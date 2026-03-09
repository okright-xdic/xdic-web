'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
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
  const isNativeApp = typeof window !== 'undefined' ? Capacitor.isNativePlatform() : false;

  const [query, setQuery] = useState(initialQuery || '');
  const [isPending, startTransition] = useTransition();
  const [micOn, setMicOn] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastSearchAtRef = useRef<number>(0);

  const isMountedRef = useRef(false);
  const micOnRef = useRef(false);

  // -------------------------
  // WebSpeech refs
  // -------------------------
  const recognitionRef = useRef<any>(null);
  const webRestartTimerRef = useRef<any>(null);
  const webBackoffRef = useRef<number>(900);
  const webStartingRef = useRef(false);

  // -------------------------
  // Native refs
  // -------------------------
  const nativeRestartTimerRef = useRef<any>(null);
  const nativeListenerHandlesRef = useRef<any[]>([]);
  const nativeStartingRef = useRef(false);
  const nativeSessionActiveRef = useRef(false);
  const lastNativeTranscriptRef = useRef<string>('');
  const lastNativeTranscriptAtRef = useRef<number>(0);

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

    if (typeof window !== 'undefined') {
      const enabled = sessionStorage.getItem(MIC_USER_ENABLED_KEY) === 'true';
      micOnRef.current = enabled;
      setMicOn(enabled);
    }

    return () => {
      isMountedRef.current = false;
      void stopWebLoop(true);
      void stopNativeLoop(true);
    };
  }, []);

  useEffect(() => {
    micOnRef.current = micOn;
  }, [micOn]);

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

    saveToRecent(trimmed);

    const basePath = isApp || isNativeApp ? '/app' : '/';
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
  // Web Speech
  // =========================================================
  const getSpeechRecognitionCtor = () => {
    if (typeof window === 'undefined') return null;
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
  };

  const clearWebTimer = () => {
    if (webRestartTimerRef.current) clearTimeout(webRestartTimerRef.current);
    webRestartTimerRef.current = null;
  };

  const hardStopWeb = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
      } catch {}
      try {
        recognitionRef.current.abort?.();
      } catch {}
      try {
        recognitionRef.current.stop?.();
      } catch {}
    }

    recognitionRef.current = null;
    webStartingRef.current = false;
    if (isMountedRef.current) setIsListening(false);
  };

  const stopWebLoop = async (hard = false) => {
    clearWebTimer();
    webBackoffRef.current = 900;

    if (hard) {
      hardStopWeb();
      return;
    }

    try {
      recognitionRef.current?.stop?.();
    } catch {}
    webStartingRef.current = false;
    if (isMountedRef.current) setIsListening(false);
  };

  const scheduleWebRestart = () => {
    if (!micOnRef.current || !isMountedRef.current) return;
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;

    clearWebTimer();

    const delay = Math.min(webBackoffRef.current, 3000);
    webBackoffRef.current = Math.min(Math.floor(webBackoffRef.current * 1.4), 3000);

    webRestartTimerRef.current = setTimeout(() => {
      if (!micOnRef.current || !isMountedRef.current) return;
      startWebLoop();
    }, delay);
  };

  const startWebLoop = () => {
    if (!micOnRef.current || !isMountedRef.current) return;

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
    recognitionRef.current = recognition;

    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      webStartingRef.current = false;
      webBackoffRef.current = 900;
      if (!isMountedRef.current) return;
      setIsListening(true);
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
        alert('마이크 권한이 차단되었습니다. 브라우저/기기 설정에서 마이크를 허용해주세요.');
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
  // Native Speech (@capgo)
  // 결과는 이벤트에서 받고, 재시작은 stopped/end 에서만 수행
  // =========================================================
  const clearNativeTimer = () => {
    if (nativeRestartTimerRef.current) clearTimeout(nativeRestartTimerRef.current);
    nativeRestartTimerRef.current = null;
  };

  const removeNativeListeners = async () => {
    const handles = nativeListenerHandlesRef.current;
    nativeListenerHandlesRef.current = [];

    for (const h of handles) {
      try {
        await h?.remove?.();
      } catch {}
    }

    try {
      await SpeechRecognition.removeAllListeners();
    } catch {}
  };

  const stopNativeLoop = async (hard = false) => {
    clearNativeTimer();
    nativeStartingRef.current = false;
    nativeSessionActiveRef.current = false;

    if (isMountedRef.current) setIsListening(false);

    if (!isNativeApp) return;
    if (!hard) return;

    try {
      await SpeechRecognition.stop();
    } catch {}

    await removeNativeListeners();
  };

  const scheduleNativeRestart = (delay = 900) => {
    if (!micOnRef.current || !isMountedRef.current) return;

    clearNativeTimer();
    nativeRestartTimerRef.current = setTimeout(() => {
      if (!micOnRef.current || !isMountedRef.current) return;
      void startNativeLoop();
    }, delay);
  };

  const startNativeLoop = async () => {
    if (!isNativeApp || !micOnRef.current || !isMountedRef.current) return;
    if (nativeStartingRef.current || nativeSessionActiveRef.current) return;

    nativeStartingRef.current = true;

    try {
      const avail = await SpeechRecognition.available();
      if (!avail.available) {
        alert('이 기기에서 음성 인식을 사용할 수 없습니다.');
        setMicOn(false);
        nativeStartingRef.current = false;
        return;
      }

      let perm = await SpeechRecognition.checkPermissions();
      if (perm.speechRecognition !== 'granted') {
        perm = await SpeechRecognition.requestPermissions();
      }

      if (perm.speechRecognition !== 'granted') {
        alert('마이크 권한이 필요합니다. 스마트폰 설정에서 X-DIC 마이크 권한을 허용해주세요.');
        setMicOn(false);
        try {
          sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
        } catch {}
        nativeStartingRef.current = false;
        return;
      }

      const currentState = await SpeechRecognition.isListening();
      if (currentState.listening) {
        nativeSessionActiveRef.current = true;
        nativeStartingRef.current = false;
        return;
      }

      await removeNativeListeners();

      const h1 = await SpeechRecognition.addListener('listeningState', (event: any) => {
        if (!isMountedRef.current) return;

        const listening = event?.status === 'started';
        nativeSessionActiveRef.current = listening;
        setIsListening(listening);

        if (event?.status === 'stopped' && micOnRef.current) {
          scheduleNativeRestart(1000);
        }
      });

      const h2 = await SpeechRecognition.addListener('partialResults', (event: any) => {
        const text = String(event?.matches?.[0] || '').trim();
        if (!text) return;
        if (!isMountedRef.current) return;
        setQuery(text);
      });

      const h3 = await SpeechRecognition.addListener('segmentResults', (event: any) => {
        const transcript = String(event?.matches?.[0] || '').trim();
        if (!transcript) return;

        const now = Date.now();
        const isDuplicate =
          transcript === lastNativeTranscriptRef.current &&
          now - lastNativeTranscriptAtRef.current < 1800;

        if (isDuplicate) return;

        lastNativeTranscriptRef.current = transcript;
        lastNativeTranscriptAtRef.current = now;

        if (!isMountedRef.current) return;
        setQuery(transcript);
        goSearch(transcript);
      });

      const h4 = await SpeechRecognition.addListener('endOfSegmentedSession', () => {
        nativeSessionActiveRef.current = false;
        if (!micOnRef.current) return;
        scheduleNativeRestart(1000);
      });

      nativeListenerHandlesRef.current = [h1, h2, h3, h4];

      await SpeechRecognition.start({
        language: 'ko-KR',
        maxResults: 1,
        partialResults: true,
        popup: false,
        allowForSilence: 3500
      });

      nativeStartingRef.current = false;
    } catch (e: any) {
      nativeStartingRef.current = false;
      nativeSessionActiveRef.current = false;

      if (!isMountedRef.current) return;

      const msg = String(e?.message || e || '').toLowerCase();

      if (msg.includes('denied') || msg.includes('permission')) {
        alert('마이크 권한이 차단되었습니다. 설정에서 권한을 허용해주세요.');
        setMicOn(false);
        try {
          sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
        } catch {}
        return;
      }

      scheduleNativeRestart(1200);
    }
  };

  // =========================================================
  // micOn 변화에 따라 웹/앱 분기
  // =========================================================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!micOn) {
      void stopWebLoop(true);
      void stopNativeLoop(true);
      return;
    }

    try {
      sessionStorage.setItem(MIC_USER_ENABLED_KEY, 'true');
    } catch {}

    if (isNativeApp) {
      void stopWebLoop(true);
      void startNativeLoop();
    } else {
      void stopNativeLoop(true);
      startWebLoop();
    }

    return () => {
      void stopWebLoop(true);
      void stopNativeLoop(true);
    };
  }, [micOn, isNativeApp]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isNativeApp) return;

    const onVis = () => {
      if (!micOnRef.current) return;
      if (document.visibilityState === 'visible') scheduleWebRestart();
      else void stopWebLoop(true);
    };

    const onPageHide = () => {
      void stopWebLoop(true);
    };

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', onPageHide);
    };
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
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all"
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
              className="h-8 md:h-10 px-3 md:px-6 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5"
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