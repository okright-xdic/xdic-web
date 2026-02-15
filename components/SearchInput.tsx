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

    // 예전 코드 잔재로 인해 처음부터 켜지는 경우를 방지(있으면 끔)
    if (!enabled) {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
      recognitionRef.current = null;
      setIsListening(false);
    }
    // enabled면 아래 effect에서 자동으로 startListeningLoop 실행됨
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
  // - 한 단어: 뒤에 공백
  // - 두 단어 이상: (요청하신 “만능” 로직은 app/page.tsx + API쪽에서 처리)
  //   여기서는 “입력 전달용”만 최소 정리
  const normalizeFinalQuery = (rawQuery: string) => {
    const trimmed = (rawQuery || '').trim();
    if (!trimmed) return '';

    const isSingleWord = !trimmed.includes(' ');
    if (isSingleWord && trimmed.length >= 2) return trimmed + ' ';

    // 두 단어 이상은 일단 그대로(뒤 공백 강제는 서버/페이지 로직에서)
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

  // ✅ Ctrl+C / Paste 안정화: 붙여넣기 내용 그대로 넣되, 줄바꿈만 정리
  // (Paste가 “안된다”는 문제는 보통 preventDefault + 이상한 변환 때문에 생깁니다)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // 브라우저 기본 붙여넣기 대신 “우리가 넣되” 최소한만 정리
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

    // 기존 루프 정리
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

      // ✅ micOn이면 “계속 유지”
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

  // ✅ micOn 상태가 true가 되면 루프 시작, false면 완전 정지
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (micOn) {
      startListeningLoop();
    } else {
      stopListeningLoop();
    }

    return () => {
      stopListeningLoop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micOn]);

  const handleMicToggle = () => {
    if (typeof window === 'undefined') return;

    setMicOn((prev) => {
      const next = !prev;

      // ✅ 사용자가 “처음으로” 켰을 때부터만 항상 ON의 자격 부여
      if (next) sessionStorage.setItem(MIC_USER_ENABLED_KEY, 'true');
      else sessionStorage.removeItem(MIC_USER_ENABLED_KEY);

      return next;
    });
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSearch} className="relative w-full">
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
            (micOn ? '🎙️ 마이크 ON: 말씀하세요 (계속 대기)' : '검색어 입력 후 Enter 또는 검색 (마이크: 음성검색)')
          }
          className={`w-full h-12 md:h-14 pl-6 pr-[140px] border rounded-full shadow-sm outline-none transition-all bg-white text-slate-800 placeholder:text-slate-400
            ${
              micOn
                ? 'border-red-400 ring-2 ring-red-100'
                : 'border-slate-200 focus:ring-2 focus:ring-blue-500'
            }`}
        />

        {/* 삭제 버튼 */}
        {query && !isPending && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-[128px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center
              text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            title="지우기"
          >
            ×
          </button>
        )}

        {/* (Snap1 스타일) 마이크 아이콘 + 검색 버튼 */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleMicToggle}
            disabled={isPending}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
              ${micOn ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
            title={micOn ? '음성 검색 끄기' : '음성 검색 켜기'}
          >
            🎤
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="h-10 px-6 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
            title="검색"
          >
            검색
          </button>
        </div>

        {/* 안내 문구: micOn이면 계속 유지 */}
        <div className={`mt-2 h-5 text-sm text-center ${micOn ? 'text-red-500' : 'text-transparent'}`}>
          {micOn ? (isListening ? '듣고 있습니다... (말씀하세요)' : '마이크 ON 상태로 대기 중입니다') : ' '}
        </div>
      </form>
    </div>
  );
}
