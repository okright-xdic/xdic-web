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

// ✅ 사용자가 마이크를 켠 적이 있으면 이후 유지
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

  const isNativeApp =
    typeof window !== 'undefined'
      ? (() => {
          try {
            return Capacitor.isNativePlatform();
          } catch {
            return false;
          }
        })()
      : false;

  const [query, setQuery] = useState(initialQuery || '');
  const [isPending, startTransition] = useTransition();

  const [micOn, setMicOn] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastSearchAtRef = useRef<number>(0);
  const lastNativeTranscriptRef = useRef<string>('');
  const lastNativeTranscriptAtRef = useRef<number>(0);

  const micOnRef = useRef(false);
  const isMountedRef = useRef(false);

  // --------------------------
  // WebSpeech refs
  // --------------------------
  const recognitionRef = useRef<any>(null);
  const webRestartTimerRef = useRef<any>(null);
  const webBackoffRef = useRef<number>(650);
  const webStartingRef = useRef(false);

  // --------------------------
  // Native Speech refs (Capgo)
  // --------------------------
  const nativeRestartTimerRef = useRef<any>(null);
  const nativeStartingRef = useRef(false);
  const nativeHandlesRef = useRef<any[]>([]);
  const nativeBackoffRef = useRef<number>(450);

  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [autoFocus]);

  // ✅ 마이크 ON 저장값 로드
  useEffect(() => {
    isMountedRef.current = true;

    if (typeof window !== 'undefined') {
      const enabled = sessionStorage.getItem(MIC_USER_ENABLED_KEY) === 'true';
      micOnRef.current = enabled;
      setMicOn(enabled);
    }

    return () => {
      isMountedRef.current = false;
      void stopAllLoops(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    micOnRef.current = micOn;
  }, [micOn]);

  // --------------------------
  // Recent 저장 유틸
  // --------------------------
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

  const validate = (trimmed: string) => {
    if (!trimmed) return { ok: false, msg: '' };
    if (trimmed.length > 50) return { ok: false, msg: '검색어는 50자 이내로 입력해주세요.' };
    if (BANNED_WORDS.some((w) => trimmed.includes(w))) return { ok: false, msg: '부적절한 단어가 포함되어 있습니다.' };
    return { ok: true, msg: '' };
  };

  const normalizeFinalQuery = (rawQuery: string) => {
    const trimmed = (rawQuery || '').trim();
    if (!trimmed) return '';
    const isSingleWord = !trimmed.includes(' ');
    if (isSingleWord && trimmed.length >= 2) return trimmed + ' ';
    return trimmed;
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

    const targetPath = isApp || isNativeApp ? '/app/search' : '/search';

    startTransition(() => {
      router.push(`${targetPath}?q=${encodeURIComponent(finalQuery)}`);
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
  // 공통: 루프 정지
  // =========================================================
  const clearTimer = (ref: React.MutableRefObject<any>) => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = null;
  };

  const stopWebLoop = (hard = false) => {
    clearTimer(webRestartTimerRef);
    webBackoffRef.current = 650;
    webStartingRef.current = false;

    if (hard && recognitionRef.current) {
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
      recognitionRef.current = null;
    } else {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
    }

    if (isMountedRef.current) setIsListening(false);
  };

  const removeNativeListeners = async () => {
    const handles = nativeHandlesRef.current;
    nativeHandlesRef.current = [];

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
    clearTimer(nativeRestartTimerRef);
    nativeBackoffRef.current = 450;
    nativeStartingRef.current = false;

    if (!isNativeApp) {
      if (isMountedRef.current) setIsListening(false);
      return;
    }

    if (hard) {
      try {
        await SpeechRecognition.stop();
      } catch {}
      await removeNativeListeners();
    }

    if (isMountedRef.current) setIsListening(false);
  };

  const stopAllLoops = async (hard = false) => {
    stopWebLoop(hard);
    await stopNativeLoop(hard);
  };

  // =========================================================
  // (A) WebSpeech (웹 브라우저)
  // =========================================================
  const getSpeechRecognitionCtor = () => {
    if (typeof window === 'undefined') return null;
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
  };

  const scheduleWebRestart = () => {
    if (!micOnRef.current || !isMountedRef.current) return;
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;

    clearTimer(webRestartTimerRef);

    const delay = Math.min(webBackoffRef.current, 2500);
    webBackoffRef.current = Math.min(Math.floor(webBackoffRef.current * 1.45), 2500);

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

    stopWebLoop(true);

    const recognition = new Ctor();
    recognitionRef.current = recognition;

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
        stopWebLoop(true);
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
  // (B) Native (Capgo SpeechRecognition)
  // =========================================================
  const scheduleNativeRestart = (delay = 350) => {
    if (!micOnRef.current || !isMountedRef.current || !isNativeApp) return;

    clearTimer(nativeRestartTimerRef);

    const safeDelay = Math.min(delay + nativeBackoffRef.current, 2500);
    nativeBackoffRef.current = Math.min(Math.floor(nativeBackoffRef.current * 1.35), 1800);

    nativeRestartTimerRef.current = setTimeout(() => {
      if (!micOnRef.current || !isMountedRef.current || !isNativeApp) return;
      startNativeLoop();
    }, safeDelay);
  };

  const handleNativeTranscript = (raw: unknown, doSearch = true) => {
    const transcript = String(raw || '').trim();
    if (!transcript) return;
    if (!isMountedRef.current) return;

    setQuery(transcript);

    if (!doSearch) return;

    const now = Date.now();
    const isSameText = lastNativeTranscriptRef.current === transcript;
    const isTooSoon = now - lastNativeTranscriptAtRef.current < 900;

    if (isSameText && isTooSoon) return;

    lastNativeTranscriptRef.current = transcript;
    lastNativeTranscriptAtRef.current = now;
    goSearch(transcript);
  };

  const startNativeLoop = async () => {
    if (!isNativeApp || !micOnRef.current || !isMountedRef.current) return;
    if (nativeStartingRef.current) return;

    nativeStartingRef.current = true;

    try {
      let perm = await SpeechRecognition.checkPermissions();
      if (perm?.speechRecognition !== 'granted') {
        perm = await SpeechRecognition.requestPermissions();
      }

      if (perm?.speechRecognition !== 'granted') {
        alert('🚨 마이크 권한이 필요합니다.\n[설정 > 앱 > X-DIC > 권한]에서 마이크를 허용해주세요.');
        setMicOn(false);
        try {
          sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
        } catch {}
        nativeStartingRef.current = false;
        return;
      }

      nativeBackoffRef.current = 450;

      await removeNativeListeners();

      const h1 = await SpeechRecognition.addListener('segmentResults', (e: any) => {
        handleNativeTranscript(e?.matches?.[0], true);
      });

      const h2 = await SpeechRecognition.addListener('result', (e: any) => {
        handleNativeTranscript(e?.matches?.[0], true);
      });

      const h3 = await SpeechRecognition.addListener('partialResults', (e: any) => {
        handleNativeTranscript(e?.matches?.[0], false);
      });

      const h4 = await SpeechRecognition.addListener('listeningState', (e: any) => {
        if (!isMountedRef.current) return;

        const listening =
          e?.listening === true ||
          e?.status === 'started' ||
          e?.status === 'listening';

        setIsListening(listening);

        if (!listening && micOnRef.current) {
          scheduleNativeRestart(250);
        }
      });

      const h5 = await SpeechRecognition.addListener('endOfSegmentedSession', () => {
        if (!micOnRef.current) return;
        scheduleNativeRestart(200);
      });

      const h6 = await SpeechRecognition.addListener('end', () => {
        if (!micOnRef.current) return;
        scheduleNativeRestart(250);
      });

      nativeHandlesRef.current = [h1, h2, h3, h4, h5, h6];

      if (!isMountedRef.current) return;
      setIsListening(true);

      const res: any = await SpeechRecognition.start({
        language: 'ko-KR',
        maxResults: 1,
        partialResults: true,
        popup: false,
      });

      handleNativeTranscript(res?.matches?.[0], true);

      if (isMountedRef.current) setIsListening(false);
      nativeStartingRef.current = false;

      scheduleNativeRestart(600);
    } catch (e: any) {
      nativeStartingRef.current = false;
      if (!isMountedRef.current) return;

      setIsListening(false);

      const msg = String(e?.message || e || '').toLowerCase();

      if (msg.includes('denied') || msg.includes('permission')) {
        alert('🚨 마이크 권한 오류: 설정에서 마이크 허용 후 다시 시도해주세요.');
        setMicOn(false);
        try {
          sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
        } catch {}
        return;
      }

      scheduleNativeRestart(600);
    }
  };

  // =========================================================
  // micOn 변화에 따라 분기 실행
  // =========================================================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!micOn) {
      void stopAllLoops(true);
      return;
    }

    try {
      sessionStorage.setItem(MIC_USER_ENABLED_KEY, 'true');
    } catch {}

    if (isNativeApp) {
      stopWebLoop(true);
      void startNativeLoop();
    } else {
      void stopNativeLoop(true);
      startWebLoop();
    }

    return () => {
      void stopAllLoops(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micOn, isNativeApp]);

  // 웹에서만 visibility 처리
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

  const handleMicToggle = async () => {
    if (typeof window === 'undefined') return;

    if (!micOnRef.current && isNativeApp) {
      try {
        let perm = await SpeechRecognition.checkPermissions();
        if (perm?.speechRecognition !== 'granted') {
          perm = await SpeechRecognition.requestPermissions();
        }
        if (perm?.speechRecognition !== 'granted') {
          alert('🚨 마이크 권한이 필요합니다.\n[설정 > 앱 > X-DIC > 권한]에서 마이크를 허용해주세요.');
          return;
        }
      } catch {}
    }

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
              title="검색"
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