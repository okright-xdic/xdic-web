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

const MIC_USER_ENABLED_KEY = 'xdic_mic_user_enabled_v1';
const BANNED_WORDS = ['비속어', '욕설', 'badword', 'xxx', '도박', '성인'];

type MicLang = 'ko-KR' | 'en-US' | null;

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
  const [micLang, setMicLang] = useState<MicLang>(null);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastSearchAtRef = useRef<number>(0);

  const micLangRef = useRef<MicLang>(null);
  const isMountedRef = useRef(false);

  const recognitionRef = useRef<any>(null);
  const webRestartTimerRef = useRef<any>(null);
  const webBackoffRef = useRef<number>(700);
  const webStartingRef = useRef(false);

  const nativeRestartTimerRef = useRef<any>(null);
  const nativeRunningRef = useRef(false);

  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [autoFocus]);

  // =========================================================
  // 🌟 [무적 마법 1] 전역 붙여넣기 (Ctrl+V) 완벽 납치! (수정됨)
  // =========================================================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGlobalPaste = (e: ClipboardEvent) => {
      // ✅ [추가된 핵심 방어 로직] 
      // 현재 사용자가 클릭(포커스)해 둔 요소가 다른 입력창(input, textarea)인지 확인합니다.
      const activeEl = document.activeElement;
      const tagName = activeEl?.tagName.toLowerCase();
      // contenteditable 속성이 있는 div 등도 예외 처리
      const isInputOrTextarea = tagName === 'input' || tagName === 'textarea' || (activeEl as HTMLElement)?.isContentEditable;

      // 만약 다른 입력창에 커서가 깜빡이고 있다면? -> 가로채지 않고 즉시 패스! (기본 붙여넣기 허용)
      // (단, 자기 자신인 메인 검색창에 직접 붙여넣는 경우는 정상 처리합니다.)
      if (isInputOrTextarea && activeEl !== inputRef.current) {
        return; 
      }

      const pastedText = e.clipboardData?.getData('text');
      
      if (pastedText) {
        e.preventDefault();
        
        const cleanText = pastedText.replace(/\s+/g, ' ').trim();
        
        setQuery(cleanText);
        
        inputRef.current?.focus();
      }
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => document.removeEventListener('paste', handleGlobalPaste);
  }, []);

  // =========================================================
  // 🌟 [무적 마법 2] 엑스딕 내부에서 복사 (Ctrl+C) 시 자동 리셋
  // =========================================================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGlobalCopy = () => {
      if (document.activeElement === inputRef.current) return;

      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        setTimeout(() => {
          setQuery('');
          inputRef.current?.focus();
        }, 50);
      }
    };

    document.addEventListener('copy', handleGlobalCopy);
    return () => document.removeEventListener('copy', handleGlobalCopy);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(MIC_USER_ENABLED_KEY);
      if (saved === 'true' || saved === 'ko-KR') {
        micLangRef.current = 'ko-KR';
        setMicLang('ko-KR');
      } else if (saved === 'en-US') {
        micLangRef.current = 'en-US';
        setMicLang('en-US');
      }
    }

    return () => {
      isMountedRef.current = false;
      stopWebLoop(true);
      stopNativeLoop(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    micLangRef.current = micLang;
  }, [micLang]);

  const normalizeFinalQuery = (rawQuery: string) => {
    const trimmed = (rawQuery || '').trim();
    if (!trimmed) return '';
    const isSingleWord = !trimmed.includes(' ');
    if (isSingleWord && trimmed.length >= 2) return trimmed + ' ';
    return trimmed;
  };

  const validate = (trimmed: string) => {
    if (!trimmed) return { ok: false, msg: '' };
    if (trimmed.length > 150) return { ok: false, msg: '검색어는 150자 이내로 입력해주세요.' };
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

    if (typeof window !== 'undefined') {
      fetch('/api/log-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: trimmed }),
      }).catch((err) => console.error('검색어 로깅 실패:', err));
    }

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

  const stopWebLoop = (hard = false) => {
    clearWebTimer();
    webBackoffRef.current = 700;

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
    if (!micLangRef.current || !isMountedRef.current) return;
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;

    clearWebTimer();
    const delay = Math.min(webBackoffRef.current, 3000);
    webBackoffRef.current = Math.min(Math.floor(webBackoffRef.current * 1.5), 3000);

    webRestartTimerRef.current = setTimeout(() => {
      if (!micLangRef.current || !isMountedRef.current) return;
      startWebLoop();
    }, delay);
  };

  const startWebLoop = () => {
    if (!micLangRef.current || !isMountedRef.current) return;
    if (isNativeApp) return;

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다. (Chrome 권장)');
      setMicLang(null);
      try {
        sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
      } catch {}
      return;
    }

    if (webStartingRef.current) return;

    hardStopWeb();
    const recognition = new Ctor();
    recognitionRef.current = recognition;

    recognition.lang = micLangRef.current;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      webStartingRef.current = false;
      webBackoffRef.current = 700;
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
        setMicLang(null);
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
      if (micLangRef.current) scheduleWebRestart();
    };

    try {
      webStartingRef.current = true;
      recognition.start();
    } catch {
      webStartingRef.current = false;
      scheduleWebRestart();
    }
  };

  const clearNativeTimer = () => {
    if (nativeRestartTimerRef.current) clearTimeout(nativeRestartTimerRef.current);
    nativeRestartTimerRef.current = null;
  };

  const scheduleNativeRestart = (delay = 450) => {
    if (!micLangRef.current || !isMountedRef.current) return;

    clearNativeTimer();
    nativeRestartTimerRef.current = setTimeout(() => {
      if (!micLangRef.current || !isMountedRef.current) return;
      startNativeLoop();
    }, delay);
  };

  const stopNativeLoop = async (hard = false) => {
    clearNativeTimer();
    nativeRunningRef.current = false;
    if (isMountedRef.current) setIsListening(false);

    if (!isNativeApp) return;
    if (!hard) return;

    try {
      await SpeechRecognition.stop();
      await SpeechRecognition.removeAllListeners();
    } catch {}
  };

  const startNativeLoop = async () => {
    if (!isNativeApp || !micLangRef.current || !isMountedRef.current) return;
    if (nativeRunningRef.current) return;

    nativeRunningRef.current = true;

    try {
      const { available } = await SpeechRecognition.available();
      if (!available) {
        alert('이 기기에서는 음성 인식을 사용할 수 없습니다.');
        setMicLang(null);
        nativeRunningRef.current = false;
        return;
      }

      let perm = await SpeechRecognition.checkPermissions();
      if (perm.speechRecognition !== 'granted') {
        perm = await SpeechRecognition.requestPermissions();
      }

      if (perm.speechRecognition !== 'granted') {
        alert('마이크 권한이 필요합니다. 스마트폰 설정에서 X-DIC 마이크 권한을 허용해주세요.');
        setMicLang(null);
        try {
          sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
        } catch {}
        nativeRunningRef.current = false;
        return;
      }

      try { await SpeechRecognition.stop(); } catch(e) {}

      if (!isMountedRef.current) return;
      setIsListening(true); 

      const result = await SpeechRecognition.start({
        language: micLangRef.current,
        maxResults: 1,
        partialResults: false,
        popup: false,
        allowForSilence: 1800
      });

      if (!isMountedRef.current) return;
      setIsListening(false); 

      let transcript = String(result?.matches?.[0] || '').trim();
      transcript = transcript.replace(/[.,?!]/g, '').trim();

      if (transcript) {
        setQuery(transcript);
        goSearch(transcript); 
      }

      nativeRunningRef.current = false;

      if (micLangRef.current) scheduleNativeRestart(400);
    } catch (e: any) {
      if (!isMountedRef.current) return;
      setIsListening(false);
      nativeRunningRef.current = false;

      const msg = String(e?.message || e || '').toLowerCase();

      if (msg.includes('denied') || msg.includes('permission')) {
        alert('마이크 권한이 차단되었습니다. 설정에서 권한을 허용해주세요.');
        setMicLang(null);
        try {
          sessionStorage.removeItem(MIC_USER_ENABLED_KEY);
        } catch {}
        return;
      }

      if (micLangRef.current) scheduleNativeRestart(600);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!micLang) {
      stopWebLoop(true);
      stopNativeLoop(true);
      return;
    }

    try {
      sessionStorage.setItem(MIC_USER_ENABLED_KEY, micLang);
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
  }, [micLang, isNativeApp]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isNativeApp) return;

    const onVis = () => {
      if (!micLangRef.current) return;
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

  const handleMicToggle = (targetLang: 'ko-KR' | 'en-US') => {
    if (typeof window === 'undefined') return;

    setMicLang((prev) => {
      if (prev === targetLang) {
        try { sessionStorage.removeItem(MIC_USER_ENABLED_KEY); } catch {}
        return null;
      } else {
        try { sessionStorage.setItem(MIC_USER_ENABLED_KEY, targetLang); } catch {}
        return targetLang;
      }
    });
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSearch} className="w-full">
        <div
          className={`relative flex items-center w-full h-12 md:h-14 rounded-full border-2 bg-white overflow-hidden shadow-sm transition-colors
            ${
              micLang === 'ko-KR'
                ? 'border-red-500 ring-2 ring-red-100'
                : micLang === 'en-US'
                ? 'border-blue-500 ring-2 ring-blue-100'
                : 'border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'
            }`}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            // 🌟 [무적 마법 3] 검색창 클릭 시 글씨 파란색으로 '전체 선택'!
            onFocus={(e) => e.target.select()} 
            readOnly={isPending}
            placeholder={
              placeholder ||
              (micLang === 'ko-KR'
                ? '🎙️ 한국어 음성 검색 (대기 중)'
                : micLang === 'en-US'
                ? '🎙️ 영어 음성 검색 (대기 중)'
                : '① KOR/ENG 선택 ② 단어 검색!')
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
              onClick={() => handleMicToggle('ko-KR')}
              disabled={isPending}
              className={`px-2 h-8 md:h-10 rounded-full flex items-center justify-center gap-1 transition-all border
                ${
                  micLang === 'ko-KR'
                    ? isListening
                      ? 'bg-red-600 text-white border-red-600 shadow-md animate-pulse'
                      : 'bg-red-50 text-red-600 border-red-200 ring-2 ring-red-200'
                    : 'bg-white text-slate-400 border-slate-200 hover:text-red-600 hover:bg-red-50 hover:border-red-100'
                }`}
              title="한국어 음성 검색"
            >
              <span className="text-[11px] md:text-xs font-bold font-sans">KOR</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleMicToggle('en-US')}
              disabled={isPending}
              className={`px-2 h-8 md:h-10 rounded-full flex items-center justify-center gap-1 transition-all border
                ${
                  micLang === 'en-US'
                    ? isListening
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md animate-pulse'
                      : 'bg-blue-50 text-blue-600 border-blue-200 ring-2 ring-blue-200'
                    : 'bg-white text-slate-400 border-slate-200 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100'
                }`}
              title="영어 음성 검색"
            >
              <span className="text-[11px] md:text-xs font-bold font-sans">ENG</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="h-8 md:h-10 px-3 md:px-5 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 ml-1"
              title="검색"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19a8 8 0 100-16 8 8 0 000 16z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>

        <div className={`mt-2 h-5 text-xs md:text-sm text-center font-medium
          ${micLang === 'ko-KR' ? 'text-red-500' : micLang === 'en-US' ? 'text-blue-500' : 'text-transparent'}`}
        >
          {micLang
            ? isListening
              ? `듣고 있습니다... (${micLang === 'ko-KR' ? '한국어' : '영어'})`
              : `${micLang === 'ko-KR' ? '한국어' : '영어'} 마이크 ON 상태로 대기 중입니다`
            : ' '}
        </div>
      </form>
    </div>
  );
}