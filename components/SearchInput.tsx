'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface SearchInputProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  isApp?: boolean; 
}

type RecentItem = { keyword: string; count: number };

const RECENT_KEY = 'recent_searches_v2';
const UPDATED_EVENT = 'xdic_recent_searches_updated';

// ✅ “사용자가 마이크를 눌러 ON을 만든 적이 있는가” 저장
const MIC_USER_ENABLED_KEY = 'xdic_mic_user_enabled_v1';

const BANNED_WORDS = ['비속어', '욕설', 'badword', 'xxx', '도박', '성인'];

export default function SearchInput({
  initialQuery = '',
  placeholder,
  className = '',
  autoFocus = false,
  isApp = false,
}: SearchInputProps) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery || '');
  const [isPending, startTransition] = useTransition();

  // ✅ 처음 앱/웹 접속 시 무조건 파란색(꺼짐)으로 시작!
  const [micOn, setMicOn] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastSearchAtRef = useRef<number>(0);

  // WebSpeech 루프 안정화용 ref
  const micOnRef = useRef(false);
  const isMountedRef = useRef(false);

  const recognitionRef = useRef<any>(null);
  const restartTimerRef = useRef<any>(null);

  // ✅ 꿀링꿀링 알림음 방지를 위해 재시작 기본 시간을 800ms로 늘림
  const restartBackoffRef = useRef<number>(800);
  const startingRef = useRef(false);

  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [autoFocus]);

  useEffect(() => {
    isMountedRef.current = true;

    // ✅ 사용자가 과거에 마이크를 '클릭'해서 켰던 기억이 있다면, 다시 앱을 켜도 빨간불 유지
    if (typeof window !== 'undefined') {
      const enabled = sessionStorage.getItem(MIC_USER_ENABLED_KEY) === 'true';
      micOnRef.current = enabled;
      setMicOn(enabled);
    }

    return () => {
      isMountedRef.current = false;
      stopListeningLoop(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    micOnRef.current = micOn;
    // 상태가 변할 때마다 루프 관리
    if (micOn) startListeningLoop();
    else stopListeningLoop(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micOn]);

  const safeParse = (raw: string | null): RecentItem[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
        return parsed.map((x: any) => ({ keyword: String(x?.keyword || '').trim(), count: Number(x?.count || 1) })).filter((x: RecentItem) => x.keyword);
      }
      if (Array.isArray(parsed) && (parsed.length === 0 || typeof parsed[0] === 'string')) {
        return parsed.map((s: any) => String(s || '').trim()).filter(Boolean).map((keyword) => ({ keyword, count: 1 }));
      }
      return [];
    } catch { return []; }
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
    if (BANNED_WORDS.some((w) => trimmed.includes(w))) return { ok: false, msg: '부적절한 단어가 포함되어 있습니다.' };
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

    saveToRecent(trimmed);

    const basePath = isApp ? '/app' : '/';
    startTransition(() => {
      router.push(`${basePath}?q=${encodeURIComponent(finalQuery)}`);
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
  // ✅ 음성 인식 루프(먹통 방지 + Always ON)
  // ---------------------------
  const getSpeechRecognitionCtor = () => {
    if (typeof window === 'undefined') return null;
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
  };

  const clearRestartTimer = () => {
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    restartTimerRef.current = null;
  };

  const hardStopRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
      } catch {}
      try { recognitionRef.current.abort?.(); } catch {}
      try { recognitionRef.current.stop?.(); } catch {}
    }
    recognitionRef.current = null;
    startingRef.current = false;
    if (isMountedRef.current) setIsListening(false);
  };

  const stopListeningLoop = (hard = false) => {
    clearRestartTimer();
    restartBackoffRef.current = 800;
    if (hard) {
      hardStopRecognition();
      return;
    }
    try { recognitionRef.current?.stop?.(); } catch {}
    startingRef.current = false;
    if (isMountedRef.current) setIsListening(false);
  };

  const scheduleRestart = () => {
    if (!micOnRef.current) return;
    if (!isMountedRef.current) return;
    // 앱에서는 화면이 살짝 가려져도 계속 돌게 하려면 visibility 체크를 지워도 되지만 원본 유지
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;

    clearRestartTimer();

    const delay = Math.min(restartBackoffRef.current, 3000);
    // 계속 튕기면 점점 딜레이를 늘려서 시스템 과부하(꿀링꿀링 연사)를 막음
    restartBackoffRef.current = Math.min(Math.floor(restartBackoffRef.current * 1.5), 3000);

    restartTimerRef.current = setTimeout(() => {
      if (!micOnRef.current || !isMountedRef.current) return;
      startListeningLoop();
    }, delay);
  };

  const startListeningLoop = () => {
    if (!micOnRef.current) return;
    if (!isMountedRef.current) return;

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      alert('이 기기는 음성 인식을 지원하지 않습니다.');
      micOnRef.current = false;
      setMicOn(false);
      try { sessionStorage.removeItem(MIC_USER_ENABLED_KEY); } catch {}
      return;
    }

    if (startingRef.current) return;
    hardStopRecognition();

    const recognition = new Ctor();
    recognitionRef.current = recognition;

    recognition.lang = 'ko-KR';
    recognition.continuous = false; // 짧게 듣고 무한 재시작 전략!
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      startingRef.current = false;
      restartBackoffRef.current = 800; // 잘 켜졌으면 딜레이 리셋
      if (!isMountedRef.current) return;
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      if (!isMountedRef.current) return;
      const transcript = String(event?.results?.[0]?.[0]?.transcript || '').trim();
      setIsListening(false);

      if (!transcript) {
        scheduleRestart();
        return;
      }

      setQuery(transcript);
      goSearch(transcript); // 검색 결과 넘기기!

      scheduleRestart(); // 검색 넘기고 나서도 마이크는 끄지 말고 재시작
    };

    recognition.onerror = (e: any) => {
      if (!isMountedRef.current) return;
      setIsListening(false);

      const err = String(e?.error || '');
      // ✅ 안드로이드가 권한 문제로 끈다면 정확히 알림을 띄우고 종료
      if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'audio-capture') {
        alert('🚨 마이크 권한이 차단되었습니다! 폰 설정에서 앱 권한을 확인해주세요.');
        micOnRef.current = false;
        setMicOn(false);
        try { sessionStorage.removeItem(MIC_USER_ENABLED_KEY); } catch {}
        hardStopRecognition();
        return;
      }

      // 그 외 무음(no-speech) 에러 등은 좀비처럼 무시하고 계속 재시작!
      scheduleRestart();
    };

    recognition.onend = () => {
      if (!isMountedRef.current) return;
      setIsListening(false);
      // 인식이 끝나면 곧바로 재시작! (Always On의 핵심)
      if (micOnRef.current) scheduleRestart();
    };

    try {
      startingRef.current = true;
      recognition.start();
    } catch {
      startingRef.current = false;
      scheduleRestart();
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onVis = () => {
      if (!micOnRef.current) return;
      if (document.visibilityState === 'visible') {
        scheduleRestart();
      } else {
        stopListeningLoop(true);
      }
    };
    const onPageHide = () => stopListeningLoop(true);

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', onPageHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 사용자가 마이크 버튼을 누르면 그때부터 세션에 저장되고 Always On 가동!
  const handleMicToggle = () => {
    if (typeof window === 'undefined') return;

    setMicOn((prev) => {
      const next = !prev;
      try {
        if (next) sessionStorage.setItem(MIC_USER_ENABLED_KEY, 'true');
        else sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
      } catch {}
      return next;
    });
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSearch} className="w-full">
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
                ? '🎙️ 마이크 ON: 말씀하세요 (상시 대기 중)'
                : '① 마이크 클릭 후 음성 검색 ② 한글/영단어 입력 후 엔터!')
            }
            className="flex-grow min-w-0 h-full px-3 md:px-6 text-sm md:text-base text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
            autoComplete="off"
          />

          <div className="flex items-center gap-1 md:gap-2 pr-3 md:pr-2">
            {query && !isPending && (
              <button
                type="button"
                onClick={handleClear}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all"
                title="지우기"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            )}

            <button
              type="button"
              onClick={handleMicToggle}
              disabled={isPending}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all
                ${
                  micOn
                    ? isListening
                      ? 'bg-red-600 text-white shadow-md animate-pulse'
                      : 'bg-red-50 text-red-600 ring-2 ring-red-200'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
              title={micOn ? '음성 검색 끄기' : '음성 검색 켜기'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="h-8 md:h-10 px-3 md:px-6 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19a8 8 0 100-16 8 8 0 000 16z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
              <span className="hidden md:inline text-sm md:text-base">검색</span>
            </button>
          </div>
        </div>

        <div className={`mt-2 h-5 text-xs md:text-sm text-center ${micOn ? 'text-red-500' : 'text-transparent'}`}>
          {micOn ? (isListening ? '듣고 있습니다... (말씀하세요)' : '마이크 ON 상태로 대기 중입니다') : ' '}
        </div>
      </form>
    </div>
  );
}