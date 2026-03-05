'use client';

import React, { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capgo/capacitor-speech-recognition';

interface SearchInputProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  isApp?: boolean;
}

type RecentItem = { keyword: string; count: number };

const RECENT_KEY = 'xdic_recent_searches_v2';
const UPDATED_EVENT = 'xdic_recent_searches_updated';
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

  const isNativeApp = useMemo(() => {
    return typeof window !== 'undefined' ? Capacitor.isNativePlatform() : false;
  }, []);

  const [query, setQuery] = useState(initialQuery || '');
  const [isPending, startTransition] = useTransition();

  const [micOn, setMicOn] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastSearchAtRef = useRef<number>(0);

  const isMountedRef = useRef(false);
  const micOnRef = useRef(false);

  // =========================================================
  // Recent 저장
  // =========================================================
  const safeParse = (raw: string | null): RecentItem[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
        return parsed
          .map((x: any) => ({
            keyword: String(x?.keyword || '').trim(),
            count: Number(x?.count || 1),
          }))
          .filter((x: RecentItem) => x.keyword);
      }

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
      items.splice(idx, 1);
      items.unshift({ ...target, count: (target.count || 1) + 1 });
    } else {
      items.unshift({ keyword: cleaned, count: 1 });
    }

    if (items.length > 20) items = items.slice(0, 20);
    localStorage.setItem(RECENT_KEY, JSON.stringify(items));
    dispatchRecentUpdated();
  };

  // =========================================================
  // Query/Validation
  // =========================================================
  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [autoFocus]);

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
    if (now - lastSearchAtRef.current < 450) return; // ✅ 음성은 연속으로 들어올 수 있어 살짝 줄임
    lastSearchAtRef.current = now;

    const finalQuery = normalizeFinalQuery(rawQuery);
    if (!finalQuery) return;

    saveToRecent(trimmed);

    // ✅ 핵심: 검색 페이지로 “정확히” 이동
    // - 앱(네이티브/앱페이지): /app/search
    // - 웹: /search
    const basePath = isNativeApp || isApp ? '/app/search' : '/search';

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

  // =========================================================
  // (A) Web Speech (PC/모바일 웹)
  // =========================================================
  const webRecognitionRef = useRef<any>(null);
  const webTimerRef = useRef<any>(null);
  const webStartingRef = useRef(false);
  const webBackoffRef = useRef<number>(650);

  const getSpeechRecognitionCtor = () => {
    if (typeof window === 'undefined') return null;
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
  };

  const clearWebTimer = () => {
    if (webTimerRef.current) clearTimeout(webTimerRef.current);
    webTimerRef.current = null;
  };

  const hardStopWeb = () => {
    clearWebTimer();
    if (webRecognitionRef.current) {
      try {
        webRecognitionRef.current.onstart = null;
        webRecognitionRef.current.onresult = null;
        webRecognitionRef.current.onend = null;
        webRecognitionRef.current.onerror = null;
      } catch {}
      try {
        webRecognitionRef.current.abort?.();
      } catch {}
      try {
        webRecognitionRef.current.stop?.();
      } catch {}
    }
    webRecognitionRef.current = null;
    webStartingRef.current = false;
    if (isMountedRef.current && !isNativeApp) setIsListening(false);
  };

  const scheduleWebRestart = () => {
    if (!micOnRef.current || !isMountedRef.current || isNativeApp) return;
    clearWebTimer();

    const delay = Math.min(webBackoffRef.current, 2200);
    webBackoffRef.current = Math.min(Math.floor(webBackoffRef.current * 1.4), 2200);

    webTimerRef.current = setTimeout(() => {
      if (!micOnRef.current || !isMountedRef.current || isNativeApp) return;
      startWebLoop();
    }, delay);
  };

  const startWebLoop = () => {
    if (!micOnRef.current || !isMountedRef.current || isNativeApp) return;

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다. (Chrome 권장)');
      setMicOn(false);
      try {
        sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
      } catch {}
      return;
    }

    if (webStartingRef.current) return;
    hardStopWeb();

    const recognition = new Ctor();
    webRecognitionRef.current = recognition;

    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      webStartingRef.current = false;
      webBackoffRef.current = 650;
      if (isMountedRef.current) setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      if (!isMountedRef.current) return;
      const transcript = String(event?.results?.[0]?.[0]?.transcript || '').trim();

      setIsListening(false);

      if (transcript) {
        setQuery(transcript);
        goSearch(transcript);
      }

      scheduleWebRestart();
    };

    recognition.onerror = (e: any) => {
      if (!isMountedRef.current) return;
      setIsListening(false);

      const err = String(e?.error || '');
      if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'audio-capture') {
        alert('🚨 마이크 권한이 차단되었습니다. 브라우저/기기 설정에서 마이크를 허용해주세요.');
        setMicOn(false);
        try {
          sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
        } catch {}
        hardStopWeb();
        return;
      }

      scheduleWebRestart();
    };

    recognition.onend = () => {
      if (!isMountedRef.current) return;
      setIsListening(false);
      if (micOnRef.current) scheduleWebRestart();
    };

    try {
      webStartingRef.current = true;
      recognition.start();
    } catch {
      webStartingRef.current = false;
      scheduleWebRestart();
    }
  };

  // =========================================================
  // (B) Native Speech (Capgo 플러그인)
  // =========================================================
  const nativeTimerRef = useRef<any>(null);
  const nativeHandlesRef = useRef<any[]>([]);
  const nativeStartingRef = useRef(false);

  const clearNativeTimer = () => {
    if (nativeTimerRef.current) clearTimeout(nativeTimerRef.current);
    nativeTimerRef.current = null;
  };

  const removeNativeListeners = async () => {
    const hs = nativeHandlesRef.current;
    nativeHandlesRef.current = [];
    for (const h of hs) {
      try {
        await h?.remove?.();
      } catch {}
    }
    try {
      await SpeechRecognition.removeAllListeners();
    } catch {}
  };

  const hardStopNative = async () => {
    clearNativeTimer();
    if (!isNativeApp) return;

    try {
      await SpeechRecognition.stop();
    } catch {}
    await removeNativeListeners();

    nativeStartingRef.current = false;
    if (isMountedRef.current) setIsListening(false);
  };

  const ensureNativePermission = async () => {
    let perm: any = null;

    try {
      perm = await SpeechRecognition.checkPermissions();
    } catch {}

    const granted =
      perm?.speechRecognition === 'granted' ||
      perm?.microphone === 'granted' ||
      perm?.permission === 'granted' ||
      perm === 'granted';

    if (granted) return true;

    try {
      const req: any = await SpeechRecognition.requestPermissions();
      const granted2 =
        req?.speechRecognition === 'granted' ||
        req?.microphone === 'granted' ||
        req?.permission === 'granted' ||
        req === 'granted';
      return !!granted2;
    } catch {
      return false;
    }
  };

  const scheduleNativeRestart = (delay = 650) => {
    if (!micOnRef.current || !isMountedRef.current || !isNativeApp) return;
    clearNativeTimer();
    nativeTimerRef.current = setTimeout(() => {
      if (!micOnRef.current || !isMountedRef.current || !isNativeApp) return;
      void startNativeLoop();
    }, delay);
  };

  const startNativeLoop = async () => {
    if (!isNativeApp || !micOnRef.current || !isMountedRef.current) return;
    if (nativeStartingRef.current) return;

    nativeStartingRef.current = true;

    const ok = await ensureNativePermission();
    if (!ok) {
      nativeStartingRef.current = false;
      alert('🚨 마이크 권한이 필요합니다. [설정 > 앱 > X-DIC > 권한]에서 마이크를 허용해주세요.');
      setMicOn(false);
      try {
        sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
      } catch {}
      return;
    }

    try {
      await removeNativeListeners();

      const onAnyResult = async (e: any) => {
        const transcript = String(e?.matches?.[0] || e?.value || '').trim();
        if (!transcript) return;
        if (!isMountedRef.current) return;

        setQuery(transcript);
        goSearch(transcript);

        await hardStopNative();
        scheduleNativeRestart(700);
      };

      const h1 = await SpeechRecognition.addListener('partialResults', onAnyResult);
      const h2 = await SpeechRecognition.addListener('segmentResults', onAnyResult);

      const h3 = await SpeechRecognition.addListener('listeningState', (e: any) => {
        if (!isMountedRef.current) return;
        setIsListening(!!e?.listening || !!e?.status);
        if (!e?.listening && micOnRef.current) scheduleNativeRestart(450);
      });

      let h4: any = null;
      try {
        h4 = await SpeechRecognition.addListener('endOfSegmentedSession', () => {
          if (micOnRef.current) scheduleNativeRestart(450);
        });
      } catch {}

      nativeHandlesRef.current = h4 ? [h1, h2, h3, h4] : [h1, h2, h3];

      await SpeechRecognition.start({
        language: 'ko-KR',
        maxResults: 1,
        partialResults: true,
        popup: false,
      } as any);

      nativeStartingRef.current = false;

const basePath = isApp ? '/search' : '/';      scheduleNativeRestart(2500);
    } catch {
      nativeStartingRef.current = false;
      scheduleNativeRestart(900);
    }
  };

  // =========================================================
  // Mount & micOn 연동 (사용자가 클릭한 이후 Always ON)
  // =========================================================
  useEffect(() => {
    isMountedRef.current = true;

    if (typeof window !== 'undefined') {
      const enabled = sessionStorage.getItem(MIC_USER_ENABLED_KEY) === 'true';
      micOnRef.current = enabled;
      setMicOn(enabled);
    }

    return () => {
      isMountedRef.current = false;
      hardStopWeb();
      void hardStopNative();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    micOnRef.current = micOn;

    if (!micOn) {
      hardStopWeb();
      void hardStopNative();
      return;
    }

    try {
      sessionStorage.setItem(MIC_USER_ENABLED_KEY, 'true');
    } catch {}

    if (isNativeApp) {
      hardStopWeb();
      void startNativeLoop();
    } else {
      void hardStopNative();
      startWebLoop();
    }

    return () => {
      hardStopWeb();
      void hardStopNative();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micOn, isNativeApp]);

  useEffect(() => {
    if (typeof window === 'undefined' || isNativeApp) return;

    const onVis = () => {
      if (!micOnRef.current) return;
      if (document.visibilityState === 'visible') scheduleWebRestart();
      else hardStopWeb();
    };

    const onPageHide = () => hardStopWeb();

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', onPageHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNativeApp]);

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
              (micOn ? '🎙️ 마이크 ON: 말씀하세요 (상시 대기)' : '① 마이크 클릭 후 음성 검색 ② 단어 입력!')
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
                aria-label="지우기"
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
              aria-label="음성 검색"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                />
              </svg>
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="h-8 md:h-10 px-3 md:px-6 rounded-full bg-slate-900 text-white font-bold
              hover:bg-slate-800 transition-all flex items-center gap-1.5"
              title="검색"
              aria-label="검색"
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