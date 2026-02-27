'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';

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

// ✅ “사용자가 마이크를 눌러 ON을 만든 적이 있는가”만 저장
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

  // ---------------------------
  // 최근검색 저장
  // ---------------------------
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

  // ---------------------------
  // 검색 공통
  // ---------------------------
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

  // ---------------------------
  // 초기화 (마이크 ON 상태 복원)
  // ---------------------------
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

    // “사용자가 한번이라도 켰으면” 계속 켜진 상태로 복원
    if (typeof window !== 'undefined') {
      const enabled = sessionStorage.getItem(MIC_USER_ENABLED_KEY) === 'true';
      micOnRef.current = enabled;
      setMicOn(enabled);
    }

    return () => {
      isMountedRef.current = false;
      stopAll(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    micOnRef.current = micOn;
  }, [micOn]);

  // =========================================================
  // (A) WEB Speech (브라우저용)
  // =========================================================
  const webRecognitionRef = useRef<any>(null);
  const webRestartTimerRef = useRef<any>(null);
  const webRestartBackoffRef = useRef<number>(800);
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
    webRestartBackoffRef.current = 800;
    if (isMountedRef.current) setIsListening(false);
  };

  const scheduleWebRestart = () => {
    if (!micOnRef.current || !isMountedRef.current) return;
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;

    clearWebTimer();

    const delay = Math.min(webRestartBackoffRef.current, 3000);
    webRestartBackoffRef.current = Math.min(Math.floor(webRestartBackoffRef.current * 1.5), 3000);

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
    webRecognitionRef.current = recognition;

    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      webStartingRef.current = false;
      webRestartBackoffRef.current = 800;
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
  // (B) NATIVE Speech (Capacitor 앱용: @capgo/capacitor-speech-recognition)
  // =========================================================
  const nativeTimerRef = useRef<any>(null);
  const nativeStartingRef = useRef(false);
  const nativeListenerHandlesRef = useRef<any[]>([]);
  const lastNativeTranscriptAtRef = useRef<number>(0);

  const clearNativeTimer = () => {
    if (nativeTimerRef.current) clearTimeout(nativeTimerRef.current);
    nativeTimerRef.current = null;
  };

  const removeNativeListeners = async (SpeechRecognition: any) => {
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

  const scheduleNativeRestart = (delay = 350) => {
    if (!micOnRef.current || !isMountedRef.current) return;
    clearNativeTimer();
    nativeTimerRef.current = setTimeout(() => {
      if (!micOnRef.current || !isMountedRef.current) return;
      startNativeLoop();
    }, delay);
  };

  const hardStopNative = async () => {
    clearNativeTimer();
    nativeStartingRef.current = false;

    if (!isMountedRef.current) return;
    setIsListening(false);

    if (!isNativeApp) return;

    try {
      const mod = await import('@capgo/capacitor-speech-recognition');
      const SpeechRecognition = mod.SpeechRecognition;

      try {
        await SpeechRecognition.stop();
      } catch {}
      await removeNativeListeners(SpeechRecognition);
    } catch {
      // ignore
    }
  };

  const startNativeLoop = async () => {
    if (!isNativeApp || !micOnRef.current || !isMountedRef.current) return;
    if (nativeStartingRef.current) return;

    nativeStartingRef.current = true;

    try {
      const mod = await import('@capgo/capacitor-speech-recognition');
      const SpeechRecognition = mod.SpeechRecognition;

      // 1) 사용 가능 여부
      const { available } = await SpeechRecognition.available();
      if (!available) {
        alert('이 기기에서는 음성 인식을 사용할 수 없습니다.');
        setMicOn(false);
        try {
          sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
        } catch {}
        nativeStartingRef.current = false;
        return;
      }

      // 2) 권한
      let perm = await SpeechRecognition.checkPermissions();
      if (perm.speechRecognition !== 'granted') {
        perm = await SpeechRecognition.requestPermissions();
      }
      if (perm.speechRecognition !== 'granted') {
        alert('🚨 마이크 권한이 필요합니다. [설정 > 앱 > X-DIC > 권한]에서 마이크를 허용해주세요.');
        setMicOn(false);
        try {
          sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
        } catch {}
        nativeStartingRef.current = false;
        return;
      }

      // 3) 리스너 재설정
      await removeNativeListeners(SpeechRecognition);

      const listeningHandle = await SpeechRecognition.addListener('listeningState', (e: any) => {
        if (!isMountedRef.current) return;
        const started = e?.status === 'started';
        setIsListening(started);

        // 안드가 몰래 껐으면 재가동
        if (!started && micOnRef.current) scheduleNativeRestart(250);
      });

      const segmentHandle = await SpeechRecognition.addListener('segmentResults', (e: any) => {
        const transcript = String(e?.matches?.[0] || '').trim();
        if (!transcript) return;

        lastNativeTranscriptAtRef.current = Date.now();
        if (!isMountedRef.current) return;

        setQuery(transcript);
        goSearch(transcript);
      });

      const partialHandle = await SpeechRecognition.addListener('partialResults', (e: any) => {
        // 부분 결과는 검색 실행 X (입력창만 업데이트)
        const partial = String(e?.matches?.[0] || '').trim();
        if (!partial) return;
        lastNativeTranscriptAtRef.current = Date.now();
        if (!isMountedRef.current) return;
        setQuery(partial);
      });

      const endHandle = await SpeechRecognition.addListener('endOfSegmentedSession', () => {
        if (!micOnRef.current) return;
        scheduleNativeRestart(200);
      });

      nativeListenerHandlesRef.current = [listeningHandle, segmentHandle, partialHandle, endHandle];

      // 4) 시작
      await SpeechRecognition.start({
        language: 'ko-KR',
        maxResults: 1,
        partialResults: true,
        popup: false, // 앱 내부에서 팝업 없이
        // Android only: silence timeout(너무 짧으면 끊기고, 너무 길면 종료가 늦음)
        allowForSilence: 1200,
      });

      nativeStartingRef.current = false;

      // 5) “꿀링만 돌고 텍스트가 안 오는” 좀비 상태 감시: 6초간 아무 텍스트도 없으면 재시작
      clearNativeTimer();
      nativeTimerRef.current = setInterval(() => {
        if (!micOnRef.current || !isMountedRef.current) return;
        const last = lastNativeTranscriptAtRef.current || 0;
        if (Date.now() - last > 6000) {
          // 아무것도 안 들어오면 재시작
          scheduleNativeRestart(250);
        }
      }, 2000);
    } catch (e: any) {
      nativeStartingRef.current = false;

      const msg = String(e?.message || e || '').toLowerCase();
      if (msg.includes('denied') || msg.includes('permission')) {
        alert('🚨 마이크 권한 오류: ' + msg);
        setMicOn(false);
        try {
          sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
        } catch {}
        return;
      }

      // 그 외 에러는 “빨간 상태 유지” + 재시작
      scheduleNativeRestart(500);
    }
  };

  // ---------------------------
  // 통합 Start/Stop
  // ---------------------------
  const stopAll = (hard = false) => {
    hardStopWeb();
    if (hard) hardStopNative();
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!micOn) {
      stopAll(true);
      return;
    }

    // micOn이 켜지는 순간 “사용자가 켰음” 저장
    try {
      sessionStorage.setItem(MIC_USER_ENABLED_KEY, 'true');
    } catch {}

    if (isNativeApp) {
      hardStopWeb();
      startNativeLoop();
    } else {
      hardStopNative();
      startWebLoop();
    }

    return () => {
      stopAll(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micOn, isNativeApp]);

  // WEB에서 탭 숨김/복귀 처리(앱은 네이티브 루프로 처리)
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

  // ✅ 사용자가 클릭하면 켜지고, 그 뒤로는 계속 유지(세션)
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