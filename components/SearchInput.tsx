'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor, registerPlugin } from '@capacitor/core';

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

// ✅ 사용자가 “한번이라도” 마이크를 켠 적 있으면 이후 유지
const MIC_USER_ENABLED_KEY = 'xdic_mic_user_enabled_v1';

const BANNED_WORDS = ['비속어', '욕설', 'badword', 'xxx', '도박', '성인'];

/**
 * ✅ Capacitor Native SpeechRecognition
 * - @capgo/capacitor-speech-recognition 계열은 보통 플러그인 이름이 SpeechRecognition 입니다.
 * - 타입이 환경마다 다르니 any로 안전하게 처리합니다.
 */
const NativeSpeech: any = registerPlugin('SpeechRecognition');

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

  // -----------------------
  // Recent searches
  // -----------------------
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

  // -----------------------
  // Search helpers
  // -----------------------
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

  // -----------------------
  // ✅ mic state persistence: “사용자가 한번 켠 뒤부터” 유지
  // -----------------------
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
      stopWebLoop(true);
      stopNativeLoop(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    micOnRef.current = micOn;
  }, [micOn]);

  // =========================================================
  // ✅ (A) Web Speech API (PC/모바일 브라우저용)
  // =========================================================
  const webRecRef = useRef<any>(null);
  const webRestartTimerRef = useRef<any>(null);
  const webBackoffRef = useRef<number>(700);
  const webStartingRef = useRef(false);

  const getSpeechRecognitionCtor = () => {
    if (typeof window === 'undefined') return null;
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
  };

  const clearWebTimer = () => {
    if (webRestartTimerRef.current) clearTimeout(webRestartTimerRef.current);
    webRestartTimerRef.current = null;
  };

  const hardStopWeb = () => {
    if (webRecRef.current) {
      try {
        webRecRef.current.onstart = null;
        webRecRef.current.onresult = null;
        webRecRef.current.onend = null;
        webRecRef.current.onerror = null;
      } catch {}
      try {
        webRecRef.current.abort?.();
      } catch {}
      try {
        webRecRef.current.stop?.();
      } catch {}
    }
    webRecRef.current = null;
    webStartingRef.current = false;
    if (isMountedRef.current) setIsListening(false);
  };

  const stopWebLoop = (hard = false) => {
    clearWebTimer();
    webBackoffRef.current = 700;

    if (hard) {
      hardStopWeb();
      return;
    }

    try {
      webRecRef.current?.stop?.();
    } catch {}
    webStartingRef.current = false;
    if (isMountedRef.current) setIsListening(false);
  };

  const scheduleWebRestart = () => {
    if (!micOnRef.current || !isMountedRef.current) return;
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;

    clearWebTimer();

    const delay = Math.min(webBackoffRef.current, 2500);
    webBackoffRef.current = Math.min(Math.floor(webBackoffRef.current * 1.5), 2500);

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
      micOnRef.current = false;
      setMicOn(false);
      try {
        sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
      } catch {}
      return;
    }

    if (webStartingRef.current) return;

    hardStopWeb();

    const rec = new Ctor();
    webRecRef.current = rec;

    rec.lang = 'ko-KR';
    rec.continuous = false; // 짧게 듣고 다시 시작(안정적)
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      webStartingRef.current = false;
      webBackoffRef.current = 700;
      if (!isMountedRef.current) return;
      setIsListening(true);
    };

    rec.onresult = (event: any) => {
      if (!isMountedRef.current) return;
      const transcript = String(event?.results?.[0]?.[0]?.transcript || '').trim();

      setIsListening(false);

      if (transcript) {
        setQuery(transcript);
        goSearch(transcript);
      }

      scheduleWebRestart();
    };

    rec.onerror = (e: any) => {
      if (!isMountedRef.current) return;
      setIsListening(false);

      const err = String(e?.error || '');
      // 권한 관련만 OFF, 그 외는 루프 유지
      if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'audio-capture') {
        micOnRef.current = false;
        setMicOn(false);
        try {
          sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
        } catch {}
        hardStopWeb();
        return;
      }

      scheduleWebRestart();
    };

    rec.onend = () => {
      if (!isMountedRef.current) return;
      setIsListening(false);
      if (micOnRef.current) scheduleWebRestart();
    };

    try {
      webStartingRef.current = true;
      rec.start();
    } catch {
      webStartingRef.current = false;
      scheduleWebRestart();
    }
  };

  // =========================================================
  // ✅ (B) Native Speech (Capacitor 앱용)
  // =========================================================
  const nativeRestartTimerRef = useRef<any>(null);
  const nativeWatchdogTimerRef = useRef<any>(null);
  const nativeStartingRef = useRef(false);
  const nativeListenerHandlesRef = useRef<any[]>([]);

  const clearNativeTimers = () => {
    if (nativeRestartTimerRef.current) clearTimeout(nativeRestartTimerRef.current);
    if (nativeWatchdogTimerRef.current) clearTimeout(nativeWatchdogTimerRef.current);
    nativeRestartTimerRef.current = null;
    nativeWatchdogTimerRef.current = null;
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
      await NativeSpeech?.removeAllListeners?.();
    } catch {}
  };

  const stopNativeLoop = async (hard = false) => {
    clearNativeTimers();
    nativeStartingRef.current = false;
    if (isMountedRef.current) setIsListening(false);

    if (!isNativeApp) return;
    if (!hard) return;

    try {
      await NativeSpeech?.stop?.();
    } catch {}
    await removeNativeListeners();
  };

  const scheduleNativeRestart = (delay = 500) => {
    if (!micOnRef.current || !isMountedRef.current) return;
    clearNativeTimers();

    nativeRestartTimerRef.current = setTimeout(() => {
      if (!micOnRef.current || !isMountedRef.current) return;
      startNativeLoop();
    }, delay);
  };

  const startNativeLoop = async () => {
    if (!isNativeApp) return;
    if (!micOnRef.current || !isMountedRef.current) return;
    if (nativeStartingRef.current) return;

    nativeStartingRef.current = true;

    try {
      // 1) 권한 확인/요청
      let perm = await NativeSpeech?.checkPermissions?.();
      if (perm?.speechRecognition !== 'granted' && perm?.microphone !== 'granted') {
        perm = await NativeSpeech?.requestPermissions?.();
      }

      const granted =
        perm?.speechRecognition === 'granted' ||
        perm?.microphone === 'granted' ||
        perm?.permission === 'granted';

      if (!granted) {
        alert('마이크 권한이 필요합니다. 스마트폰 [설정 > 앱 > X-DIC > 권한]에서 마이크를 허용해주세요.');
        micOnRef.current = false;
        setMicOn(false);
        try {
          sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
        } catch {}
        nativeStartingRef.current = false;
        return;
      }

      // 2) 이벤트 리스너(버전별 이름이 다를 수 있어 다중 커버)
      await removeNativeListeners();

      const onResults = async (payload: any) => {
        const t =
          String(payload?.matches?.[0] || payload?.value?.[0] || payload?.result || payload?.text || '').trim();
        if (!t) return;
        setQuery(t);
        goSearch(t);
      };

      const h1 = await NativeSpeech?.addListener?.('results', onResults);
      const h2 = await NativeSpeech?.addListener?.('segmentResults', onResults);
      const h3 = await NativeSpeech?.addListener?.('partialResults', () => {});
      const h4 = await NativeSpeech?.addListener?.('listeningState', (e: any) => {
        if (!isMountedRef.current) return;
        const listening = !!(e?.listening ?? e?.value ?? e?.isListening);
        setIsListening(listening);

        // 안드로이드가 몰래 꺼버리면 즉시 부활
        if (!listening && micOnRef.current) {
          scheduleNativeRestart(350);
        }
      });
      const h5 = await NativeSpeech?.addListener?.('end', () => {
        if (micOnRef.current) scheduleNativeRestart(250);
      });
      const h6 = await NativeSpeech?.addListener?.('endOfSegmentedSession', () => {
        if (micOnRef.current) scheduleNativeRestart(250);
      });

      nativeListenerHandlesRef.current = [h1, h2, h3, h4, h5, h6].filter(Boolean);

      // 3) 시작
      if (isMountedRef.current) setIsListening(true);

      await NativeSpeech?.start?.({
        language: 'ko-KR',
        maxResults: 1,
        partialResults: true,
        popup: false,
      });

      nativeStartingRef.current = false;

      // 4) Watchdog: “조용히 죽는” 케이스 대비
      nativeWatchdogTimerRef.current = setTimeout(() => {
        if (!micOnRef.current || !isMountedRef.current) return;
        scheduleNativeRestart(300);
      }, 2500);
    } catch (e: any) {
      nativeStartingRef.current = false;
      if (!isMountedRef.current) return;

      const msg = String(e?.message || e || '').toLowerCase();

      // 권한/거부류만 OFF
      if (msg.includes('denied') || msg.includes('permission')) {
        alert('마이크 권한이 필요합니다. 설정에서 허용해주세요.');
        micOnRef.current = false;
        setMicOn(false);
        try {
          sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
        } catch {}
        return;
      }

      // 그 외는 씹고 부활
      scheduleNativeRestart(600);
    } finally {
      if (isMountedRef.current && micOnRef.current) {
        // 너무 오래 “듣는 중”만 고정되는 UI 방지
        setTimeout(() => {
          if (isMountedRef.current && micOnRef.current) setIsListening((v) => v);
        }, 100);
      }
    }
  };

  // =========================================================
  // ✅ micOn에 따라 앱/웹 분기 실행
  // =========================================================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!micOn) {
      stopWebLoop(true);
      stopNativeLoop(true);
      return;
    }

    // micOn이면 “사용자가 켰다” 저장
    try {
      sessionStorage.setItem(MIC_USER_ENABLED_KEY, 'true');
    } catch {}

    if (isNativeApp) {
      stopWebLoop(true);
      startNativeLoop();
    } else {
      stopNativeLoop(true);
      startWebLoop();
    }

    return () => {
      stopWebLoop(true);
      stopNativeLoop(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micOn, isNativeApp]);

  // 웹에서만 visibility 처리 (네이티브는 자체 watchdog로 처리)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isNativeApp) return;

    const onVis = () => {
      if (!micOnRef.current) return;
      if (document.visibilityState === 'visible') scheduleWebRestart();
      else stopWebLoop(true);
    };
    const onPageHide = () => stopWebLoop(true);

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', onPageHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNativeApp]);

  // ✅ 사용자가 클릭했을 때부터 always on
  const handleMicToggle = () => {
    if (typeof window === 'undefined') return;

    setMicOn((prev) => {
      const next = !prev;
      micOnRef.current = next;
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
                ? isNativeApp
                  ? '🎙️ 앱 마이크 ON: 말씀하세요 (상시 대기)'
                  : '🎙️ 마이크 ON: 말씀하세요 (상시 대기)'
                : '① 마이크 클릭 후 음성 검색 ② 한글/영단어 입력 후 엔터 또는 검색')
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