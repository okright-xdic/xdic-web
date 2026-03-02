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

const RECENT_KEY = 'xdic_recent_searches_v2';
const UPDATED_EVENT = 'xdic_recent_searches_updated';
const MIC_USER_ENABLED_KEY = 'xdic_mic_user_enabled_v1';
const BANNED_WORDS = ['비속어', '욕설', 'badword', 'xxx', '도박', '성인'];

// ✅ 재시작이 너무 빠르면 “꿀링” 가능성이 커서 최소 딜레이 고정
const MIN_RESTART_DELAY_MS = 700;

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

  // ✅ 기본은 OFF. “사용자가 클릭해서 켠 뒤에만” always-on 유지
  const [micOn, setMicOn] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastSearchAtRef = useRef<number>(0);

  const isMountedRef = useRef(false);
  const micOnRef = useRef(false);

  // --- 런타임 네이티브 체크(동적) ---
  const isNativeRef = useRef(false);

  // --- WebSpeech ---
  const recognitionRef = useRef<any>(null);
  const webRestartTimerRef = useRef<any>(null);
  const webStartingRef = useRef(false);
  const webBackoffRef = useRef(800);

  // --- Native Speech (Capacitor plugin) ---
  const nativeRestartTimerRef = useRef<any>(null);
  const nativeStartingRef = useRef(false);

  // 플러그인 동적 로딩(빌드/SSR 꼬임 방지)
  const capRef = useRef<any>(null);
  const sttRef = useRef<any>(null);

  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [autoFocus]);

  // ✅ 최초 마운트: 네이티브 여부 판단 + micOn 복원
  useEffect(() => {
    isMountedRef.current = true;

    (async () => {
      try {
        const cap = await import('@capacitor/core');
        capRef.current = cap;
        const isNative = !!cap?.Capacitor?.isNativePlatform?.();
        isNativeRef.current = isNative;

        if (isNative) {
          // 네이티브면 STT 플러그인 로딩
          const stt = await import('@capgo/capacitor-speech-recognition');
          sttRef.current = stt?.SpeechRecognition || stt;

          // ✅ 사용자가 이미 예전에 켰던 상태면 그대로 ON 복원
          const enabled = sessionStorage.getItem(MIC_USER_ENABLED_KEY) === 'true';
          micOnRef.current = enabled;
          setMicOn(enabled);
        } else {
          // 웹도 동일하게 복원
          const enabled = sessionStorage.getItem(MIC_USER_ENABLED_KEY) === 'true';
          micOnRef.current = enabled;
          setMicOn(enabled);
        }
      } catch {
        // Capacitor가 없으면 그냥 웹으로 간주
        isNativeRef.current = false;
        const enabled = sessionStorage.getItem(MIC_USER_ENABLED_KEY) === 'true';
        micOnRef.current = enabled;
        setMicOn(enabled);
      }
    })();

    return () => {
      isMountedRef.current = false;
      stopWeb(true);
      stopNative(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    micOnRef.current = micOn;
  }, [micOn]);

  // ---------------------------
  // 최근검색/검색 이동 로직 (원본 유지)
  // ---------------------------
  const safeParse = (raw: string | null): RecentItem[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
        return parsed
          .map((x: any) => ({ keyword: String(x?.keyword || '').trim(), count: Number(x?.count || 1) }))
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

  // =========================================================
  // (A) WebSpeech (웹 브라우저에서만)
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
    clearWebTimer();
    webStartingRef.current = false;
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
    if (isMountedRef.current) setIsListening(false);
  };

  const scheduleWebRestart = (delay = MIN_RESTART_DELAY_MS) => {
    if (!micOnRef.current || !isMountedRef.current) return;
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;

    clearWebTimer();
    const d = Math.max(delay, Math.min(webBackoffRef.current, 2500));
    webBackoffRef.current = Math.min(Math.floor(webBackoffRef.current * 1.4), 2500);

    webRestartTimerRef.current = setTimeout(() => {
      if (!micOnRef.current || !isMountedRef.current) return;
      startWeb();
    }, d);
  };

  const startWeb = () => {
    if (!micOnRef.current || !isMountedRef.current) return;

    // ✅ 네이티브 앱(WebView)에서는 WebSpeech 금지
    if (isNativeRef.current) return;

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      alert('이 기기/브라우저에서는 음성 인식을 지원하지 않습니다. (Chrome 권장)');
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
      webBackoffRef.current = 800;
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
        alert('🚨 마이크 권한이 차단되었습니다. 브라우저 설정에서 마이크 허용을 확인해주세요.');
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

  const stopWeb = (hard = false) => {
    clearWebTimer();
    webBackoffRef.current = 800;
    if (hard) {
      hardStopWeb();
      return;
    }
    try {
      recognitionRef.current?.stop?.();
    } catch {}
    if (isMountedRef.current) setIsListening(false);
  };

  // =========================================================
  // (B) Native STT (Capacitor 앱에서만)
  // =========================================================
  const clearNativeTimer = () => {
    if (nativeRestartTimerRef.current) clearTimeout(nativeRestartTimerRef.current);
    nativeRestartTimerRef.current = null;
  };

  const scheduleNativeRestart = (delay = MIN_RESTART_DELAY_MS) => {
    if (!micOnRef.current || !isMountedRef.current) return;
    clearNativeTimer();

    nativeRestartTimerRef.current = setTimeout(() => {
      if (!micOnRef.current || !isMountedRef.current) return;
      startNative();
    }, Math.max(delay, MIN_RESTART_DELAY_MS));
  };

  const stopNative = async (hard = false) => {
    clearNativeTimer();
    nativeStartingRef.current = false;
    if (isMountedRef.current) setIsListening(false);

    if (!isNativeRef.current) return;
    if (!hard) return;

    try {
      await sttRef.current?.SpeechRecognition?.stop?.();
    } catch {}
    try {
      await sttRef.current?.stop?.();
    } catch {}
    try {
      await sttRef.current?.removeAllListeners?.();
    } catch {}
  };

  const startNative = async () => {
    if (!isNativeRef.current) return;
    if (!micOnRef.current || !isMountedRef.current) return;
    if (nativeStartingRef.current) return;

    // 플러그인 미로드면 중단
    const SpeechRecognition = sttRef.current;
    if (!SpeechRecognition) {
      alert('음성 인식 플러그인이 로드되지 않았습니다. cap sync 후 다시 실행해 주세요.');
      return;
    }

    nativeStartingRef.current = true;

    try {
      // 1) 권한
      let perm = await SpeechRecognition.checkPermissions();
      if (perm?.speechRecognition !== 'granted') {
        perm = await SpeechRecognition.requestPermissions();
      }

      if (perm?.speechRecognition !== 'granted') {
        alert('🚨 마이크 권한이 필요합니다. [설정 > 앱 > X-DIC > 권한]에서 마이크를 허용해주세요.');
        setMicOn(false);
        try {
          sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
        } catch {}
        nativeStartingRef.current = false;
        return;
      }

      if (!isMountedRef.current) return;
      setIsListening(true);

      // 2) 실행
      // ✅ popup:false는 기기/OS에 따라 결과가 “안 나오는” 경우가 있어,
      // 지금 단계(결과가 안 나오는 문제)에서는 popup:true로 확실히 결과를 받습니다.
      const res = await SpeechRecognition.start({
        language: 'ko-KR',
        maxResults: 1,
        partialResults: false,
        popup: true
      });

      if (!isMountedRef.current) return;

      setIsListening(false);
      nativeStartingRef.current = false;

      // 3) 결과 추출(플러그인별 반환 형태 차이를 흡수)
      const matches = (res as any)?.matches;
      const transcript = Array.isArray(matches) ? String(matches[0] || '').trim() : '';

      if (transcript) {
        setQuery(transcript);
        goSearch(transcript);
      }

      // 4) always-on 유지: 다시 시작
      scheduleNativeRestart();
    } catch (e: any) {
      if (!isMountedRef.current) return;

      setIsListening(false);
      nativeStartingRef.current = false;

      const msg = String(e?.message || e || '').toLowerCase();

      // 권한류면 끄고 종료
      if (msg.includes('denied') || msg.includes('permission') || msg.includes('not allowed')) {
        alert('🚨 권한 문제로 음성 인식을 시작할 수 없습니다. (설정에서 마이크 허용 확인)');
        setMicOn(false);
        try {
          sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
        } catch {}
        return;
      }

      // 그 외(무음/타임아웃 등)는 부활
      scheduleNativeRestart();
    }
  };

  // =========================================================
  // micOn 변화에 따라 웹/앱 분기
  // =========================================================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!micOn) {
      stopWeb(true);
      stopNative(true);
      return;
    }

    // ✅ “한 번 켜면 계속 켜짐” 기억
    try {
      sessionStorage.setItem(MIC_USER_ENABLED_KEY, 'true');
    } catch {}

    if (isNativeRef.current) {
      stopWeb(true);
      startNative();
    } else {
      stopNative(true);
      startWeb();
    }

    return () => {
      stopWeb(true);
      stopNative(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micOn]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onVis = () => {
      if (!micOnRef.current) return;

      if (document.visibilityState === 'visible') {
        if (!isNativeRef.current) scheduleWebRestart(MIN_RESTART_DELAY_MS);
      } else {
        stopWeb(true);
      }
    };

    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 사용자가 클릭했을 때부터 always-on
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