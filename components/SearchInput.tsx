'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // usePathname 추가

interface SearchInputProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  isApp?: boolean; // 이제 이 값이 없어도 스스로 판단하지만, 넣어주면 더 좋습니다.
}

type RecentItem = { keyword: string; count: number };

const RECENT_KEY = 'recent_searches_v2';
const UPDATED_EVENT = 'xdic_recent_searches_updated';
const MIC_USER_ENABLED_KEY = 'xdic_mic_user_enabled_v1';
const BANNED_WORDS = ['비속어', '욕설', 'badword', 'xxx', '도박', '성인'];

// ✅ Capacitor(앱) 환경인지 스스로 감지하는 함수
const checkIsCapacitor = () => {
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    return (window as any).Capacitor.isNativePlatform();
  }
  return false;
};

export default function SearchInput({
  initialQuery = '',
  placeholder,
  className = '',
  autoFocus = false,
  isApp: propIsApp = false,
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname(); // 현재 주소 확인용

  // ✅ 앱인지 웹인지 확실하게 판단 (Props가 우선, 없으면 자동 감지)
  const [isRealApp, setIsRealApp] = useState(propIsApp);

  const [query, setQuery] = useState(initialQuery || '');
  const [isPending, startTransition] = useTransition();

  // ✅ [핵심] 앱이면 무조건 true(켜짐), 웹이면 false(꺼짐)로 시작
  const [micOn, setMicOn] = useState(false); 
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastSearchAtRef = useRef<number>(0);

  const micOnRef = useRef(false);
  const isMountedRef = useRef(false);

  const recognitionRef = useRef<any>(null);
  const restartTimerRef = useRef<any>(null);
  const restartBackoffRef = useRef<number>(450);
  const startingRef = useRef(false);

  // 초기화: 앱 환경 감지 및 마이크 자동 켜기
  useEffect(() => {
    isMountedRef.current = true;
    const isCap = checkIsCapacitor();
    const finalIsApp = propIsApp || isCap; // Props가 있거나, Capacitor환경이면 앱으로 간주
    setIsRealApp(finalIsApp);

    // 앱이라면 무조건 마이크 켜기!
    if (finalIsApp) {
      setMicOn(true);
      micOnRef.current = true;
      sessionStorage.setItem(MIC_USER_ENABLED_KEY, 'true');
    } else {
      // 웹이라면 저장된 설정 따르기
      const enabled = sessionStorage.getItem(MIC_USER_ENABLED_KEY) === 'true';
      setMicOn(enabled);
      micOnRef.current = enabled;
    }

    return () => {
      isMountedRef.current = false;
      stopListeningLoop(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [autoFocus]);

  useEffect(() => {
    micOnRef.current = micOn;
    if (micOn) startListeningLoop();
    else stopListeningLoop(true);
  }, [micOn]);

  // --- [최근 검색어 로직 생략 없이 그대로 유지] ---
  const safeParse = (raw: string | null): RecentItem[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
        return parsed.map((x: any) => ({
            keyword: String(x?.keyword || '').trim(),
            count: Number(x?.count || 1),
          })).filter((x: RecentItem) => x.keyword);
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
      items.splice(idx, 1);
      items.unshift({ ...target, count: (target.count || 1) + 1 });
    } else {
      items.unshift({ keyword: cleaned, count: 1 });
    }
    if (items.length > 20) items = items.slice(0, 20);
    localStorage.setItem(RECENT_KEY, JSON.stringify(items));
    dispatchRecentUpdated();
  };
  // ------------------------------------------------

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

    // ✅ [라우팅 꼬임 해결] 
    // 1. 만약 현재 주소가 /app으로 시작하면 -> 계속 /app 사용
    // 2. 혹은 isRealApp이 true면 -> /app 사용
    // 3. 그것도 아니면 -> / (메인) 사용
    let targetBase = '/';
    if (pathname?.startsWith('/app') || isRealApp) {
        targetBase = '/app';
    }

    startTransition(() => {
      router.push(`${targetBase}?q=${encodeURIComponent(finalQuery)}`);
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
  // ✅ 음성 인식 루프 (Always ON + 튕김 방지)
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
        recognitionRef.current.abort?.();
        recognitionRef.current.stop?.();
      } catch {}
    }
    recognitionRef.current = null;
    startingRef.current = false;
    if (isMountedRef.current) setIsListening(false);
  };

  const stopListeningLoop = (hard = false) => {
    clearRestartTimer();
    restartBackoffRef.current = 450;
    if (hard) {
      hardStopRecognition();
      return;
    }
    try { recognitionRef.current?.stop?.(); } catch {}
    startingRef.current = false;
    if (isMountedRef.current) setIsListening(false);
  };

  const scheduleRestart = () => {
    if (!micOnRef.current || !isMountedRef.current) return;
    
    // 안드로이드 앱에서는 화면이 뒤에 있어도(hidden) 소리를 들어야 하므로 검사 완화
    
    clearRestartTimer();
    const delay = Math.min(restartBackoffRef.current, 1000); // 1초 이내 재시작

    restartTimerRef.current = setTimeout(() => {
      if (!micOnRef.current || !isMountedRef.current) return;
      startListeningLoop();
    }, delay);
  };

  const startListeningLoop = () => {
    if (!micOnRef.current || !isMountedRef.current) return;

    const Ctor = getSpeechRecognitionCtor();
    // 브라우저 미지원 시 (앱에서는 보통 WebView가 지원하므로 넘어감)
    if (!Ctor) {
       // 앱이 아니고 웹일 때만 경고
       if (!isRealApp) {
         alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
         setMicOn(false);
       }
       return;
    }

    if (startingRef.current) return;
    hardStopRecognition();

    const recognition = new Ctor();
    recognitionRef.current = recognition;

    recognition.lang = 'ko-KR';
    recognition.continuous = false; // 끊어서 인식하고 바로 재시작하는 전략
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      startingRef.current = false;
      restartBackoffRef.current = 450;
      if (!isMountedRef.current) return;
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      if (!isMountedRef.current) return;
      const transcript = String(event?.results?.[0]?.[0]?.transcript || '').trim();
      setIsListening(false);

      if (transcript) {
        setQuery(transcript);
        goSearch(transcript); // 검색 실행
      }
      scheduleRestart(); // 결과 나오면 즉시 재시작 (Always On)
    };

    recognition.onerror = (e: any) => {
      if (!isMountedRef.current) return;
      setIsListening(false);
      
      const err = String(e?.error || '');

      // 권한 없음 에러 발생 시
      if (err === 'not-allowed' || err === 'service-not-allowed') {
         // 앱에서는 alert로 알려주고 멈춤 (무한 alert 방지)
         alert('🚨 마이크 권한이 필요합니다. 설정에서 허용해주세요.');
         setMicOn(false);
         micOnRef.current = false;
         hardStopRecognition();
         return;
      }
      
      // 그 외 에러는 무시하고 재시작 (좀비 모드)
      scheduleRestart();
    };

    recognition.onend = () => {
      if (!isMountedRef.current) return;
      setIsListening(false);
      // 인식이 끝나면 무조건 재시작 (Always On 핵심)
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

  // ------------------------------------------------

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
                ? '🎙️ 마이크 ON: 말씀하세요 (상시 대기)'
                : '① 마이크 클릭 후 음성 검색 ② 단어 입력!')
            }
            className="flex-grow min-w-0 h-full px-3 md:px-6 text-sm md:text-base text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
            autoComplete="off"
          />

          <div className="flex items-center gap-1 md:gap-2 pr-3 md:pr-2">
            {query && !isPending && (
              <button
                type="button"
                onClick={handleClear}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
                  text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all"
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
              className="h-8 md:h-10 px-3 md:px-6 rounded-full bg-slate-900 text-white font-bold
                hover:bg-slate-800 transition-all flex items-center gap-1.5"
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