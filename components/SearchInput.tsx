'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface SearchInputProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

type RecentItem = { keyword: string; count: number };

const RECENT_KEY = 'recent_searches_v2';
const UPDATED_EVENT = 'xdic_recent_searches_updated';

// ✅ “사용자가 마이크를 눌러 ON을 만든 적이 있는가”만 저장 (처음 접속은 없음)
const MIC_USER_ENABLED_KEY = 'xdic_mic_user_enabled_v1';

// 필요하면 여기에 금칙어를 추가하세요 (PC 기준)
const BANNED_WORDS = ['비속어', '욕설', 'badword', 'xxx', '도박', '성인'];

export default function SearchInput({
  initialQuery = '',
  placeholder,
  className = '',
  autoFocus = false,
}: SearchInputProps) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery || '');
  const [isPending, startTransition] = useTransition();

  // ✅ “마이크가 켜져있는 상태(Always ON 대상)”와 “지금 듣는 중”을 분리
  const [micOn, setMicOn] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastSearchAtRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null);
  const restartTimerRef = useRef<any>(null);

  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [autoFocus]);

  // ✅ 처음 접속 시 “무조건 ON” 금지
  // ✅ 단, 사용자가 과거에 마이크를 켠 적이 있으면(키가 true) 그때부터만 ON 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const enabled = sessionStorage.getItem(MIC_USER_ENABLED_KEY) === 'true';
    setMicOn(enabled);

    if (!enabled) {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, []);

  const safeParse = (raw: string | null): RecentItem[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);

      // ✅ 새 포맷: [{keyword,count}]
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
        return parsed
          .map((x: any) => ({
            keyword: String(x?.keyword || '').trim(),
            count: Number(x?.count || 1),
          }))
          .filter((x: RecentItem) => x.keyword);
      }

      // ✅ 구 포맷: ["사랑","가"]
      if (Array.isArray(parsed) && (parsed.length === 0 || typeof parsed[0] === 'string')) {
        return parsed
          .map((s: any) => String(s || '').trim())
          .filter(Boolean)
          .map((keyword) => ({ keyword, count: 1 }));
      }

      return [];
    } catch {
      return [];
    }
  };

  const dispatchRecentUpdated = () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new Event(UPDATED_EVENT));
  };

  const saveToRecent = (keywordRaw: string) => {
    if (typeof window === 'undefined') return;

    const cleaned = String(keywordRaw || '').trim();
    if (!cleaned) return;

    const raw = localStorage.getItem(RECENT_KEY);
    let items = safeParse(raw);

    const idx = items.findIndex((it) => it.keyword === cleaned);
    if (idx >= 0) {
      const target = items[idx];
      const next = { ...target, count: (target.count || 1) + 1 };
      items.splice(idx, 1);
      items.unshift(next);
    } else {
      items.unshift({ keyword: cleaned, count: 1 });
    }

    if (items.length > 20) items = items.slice(0, 20);

    localStorage.setItem(RECENT_KEY, JSON.stringify(items));
    dispatchRecentUpdated();
  };

  // ✅ 검색어 최종 규칙(PC)
  const normalizeFinalQuery = (rawQuery: string) => {
    const trimmed = (rawQuery || '').trim();
    if (!trimmed) return '';

    const isSingleWord = !trimmed.includes(' ');
    if (isSingleWord && trimmed.length >= 2) return trimmed + ' ';

    return trimmed;
  };

  const validate = (trimmed: string) => {
    if (!trimmed) return { ok: false, msg: '' };
    if (trimmed.length > 50) return { ok: false, msg: '검색어는 50자 이내로 입력해주세요.' };
    if (BANNED_WORDS.some((w) => trimmed.includes(w))) {
      return { ok: false, msg: '부적절한 단어가 포함되어 있습니다.' };
    }
    return { ok: true, msg: '' };
  };

  const goSearch = (rawQuery: string) => {
    const trimmed = (rawQuery || '').trim();
    const v = validate(trimmed);
    if (!v.ok) {
      if (v.msg) alert(v.msg);
      return;
    }

    const now = Date.now();
    if (now - lastSearchAtRef.current < 600) return;
    lastSearchAtRef.current = now;

    const finalQuery = normalizeFinalQuery(rawQuery);
    if (!finalQuery) return;

    // ✅ 저장은 공백 없는 키워드로
    saveToRecent(trimmed);

    startTransition(() => {
      router.push(`/?q=${encodeURIComponent(finalQuery)}`);
    });
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    goSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      goSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text') || '';
    setQuery(pasted.replace(/\s+/g, ' ').trim());
  };

  // ---------------------------
  // ✅ 음성 인식: “사용자가 켠 이후부터만 Always ON”
  // ---------------------------
  const stopListeningLoop = () => {
    clearTimeout(restartTimerRef.current);
    restartTimerRef.current = null;

    try {
      recognitionRef.current?.stop?.();
    } catch {}
    recognitionRef.current = null;

    setIsListening(false);
  };

  const startListeningLoop = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      setMicOn(false);
      sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
      return;
    }

    stopListeningLoop();

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = String(event?.results?.[0]?.[0]?.transcript || '').trim();
      setIsListening(false);

      if (!transcript) return;
      setQuery(transcript);
      goSearch(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);

      if (!micOn) return;

      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = setTimeout(() => {
        if (!micOn) return;
        try {
          recognition.start();
        } catch {}
      }, 450);
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (micOn) startListeningLoop();
    else stopListeningLoop();

    return () => stopListeningLoop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micOn]);

  const handleMicToggle = () => {
    if (typeof window === 'undefined') return;

    setMicOn((prev) => {
      const next = !prev;

      if (next) sessionStorage.setItem(MIC_USER_ENABLED_KEY, 'true');
      else sessionStorage.removeItem(MIC_USER_ENABLED_KEY);

      return next;
    });
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSearch} className="w-full">
        {/* ✅ Snap2 구조: 테두리/라운드/overflow는 "컨테이너"가 담당 */}
        <div
          className={`relative flex items-center w-full h-12 md:h-14 rounded-full border-2 bg-white overflow-hidden shadow-sm transition-colors
            ${micOn ? 'border-red-500 ring-2 ring-red-100' : 'border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'}`}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            readOnly={isPending}
            placeholder={
              placeholder ||
              (micOn
                ? '🎙️ 마이크 ON: 말씀하세요 (계속 대기)'
                : '① 마이크 클릭 후 음성 검색 ② 한글/영단어 입력 후 엔터 또는 검색 클릭!(대소문자 구분 없음)')
            }
            className="flex-grow h-full px-4 md:px-6 text-sm md:text-base text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
            autoComplete="off"
          />

          {/* ✅ 오른쪽 버튼들은 모두 "바 안"에 고정 */}
          <div className="flex items-center gap-1.5 md:gap-2 pr-2">
            {/* X 버튼: 더 크고 예쁘게(SVG) */}
            {query && !isPending && (
              <button
                type="button"
                onClick={handleClear}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center
                  text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all"
                title="지우기"
                aria-label="지우기"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            )}

            {/* 마이크 버튼 */}
            <button
              type="button"
              onClick={handleMicToggle}
              disabled={isPending}
              className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all
                ${micOn ? 'bg-red-50 text-red-600 ring-2 ring-red-200' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
              title={micOn ? '음성 검색 끄기' : '음성 검색 켜기'}
              aria-label="음성 검색"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                />
              </svg>
            </button>

            {/* 검색 버튼: 예쁜 돋보기(SVG) + 텍스트 */}
            <button
              type="submit"
              disabled={isPending}
              className="h-9 md:h-10 px-4 md:px-6 rounded-full bg-slate-900 text-white font-bold
                hover:bg-slate-800 transition-all flex items-center gap-1.5"
              title="검색"
              aria-label="검색"
            >
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19a8 8 0 100-16 8 8 0 000 16z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
              <span className="text-sm md:text-base">검색</span>
            </button>
          </div>
        </div>

        {/* 안내 문구: micOn이면 계속 유지 */}
        <div className={`mt-2 h-5 text-xs md:text-sm text-center ${micOn ? 'text-red-500' : 'text-transparent'}`}>
          {micOn ? (isListening ? '듣고 있습니다... (말씀하세요)' : '마이크 ON 상태로 대기 중입니다') : ' '}
        </div>
      </form>
    </div>
  );
}
