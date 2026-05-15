'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capgo/capacitor-speech-recognition';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; 

interface SearchInputProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  isApp?: boolean;
}

const MIC_USER_ENABLED_KEY = 'xdic_mic_user_enabled_v1';
const RECENT_KEY = 'xdic_recent_searches_v2'; 
const UPDATED_EVENT = 'xdic_recent_searches_updated';
const BANNED_WORDS = ['비속어', '욕설', 'badword', 'xxx', '도박', '성인'];

type MicLang = 'ko-KR' | 'en-US' | null;

// 🌟 [수프로 마스터] 검색엔진용 Normalize 사전 (종결 표현 전용 자동 복원 엔진)
const expandKoreanAbbreviations = (text: string) => {
  let res = text;

  // 💡 1. 단일 글자 종결어미 변환 (문장의 맨 마지막 어절에만 엄격하게 적용)
  const endCharMap: Record<string, string> = {
    '했': '하였', '셨': '시었', '됐': '되었', '뵀': '뵈었', '쐤': '쐬었', '쬈': '쬐었',
    '뇄': '뇌었', '좼': '죄었', '괬': '괴었', '쇘': '쇠었', '혔': '히었', '렸': '리었',
    '겼': '기었', '꼈': '끼었', '뎠': '디었', '켰': '키었', '졌': '지었', '줬': '주었',
    '냈': '내었', '쳤': '치었'
  };

  Object.keys(endCharMap).forEach(char => {
    const regex = new RegExp(char + '([^ ]*)$');
    res = res.replace(regex, endCharMap[char] + '$1');
  });

  // 💡 2. 개별 단어 종결어미 변환 (불규칙 형태 및 충돌 방지용 - 중복 제거 완료!)
  const verbMap: Record<string, string> = {
    '보였다': '보이었다', '쓰였다': '쓰이었다', '속였다': '속이었다', 
    '끓였다': '끓이었다', '파였다': '파이었다', '깎였다': '깎이었다', 
    '꺾였다': '꺾이었다', '섞였다': '섞이었다', '가리웠다': '가리우었다',
    '가렸다': '가리었다', '가졌다': '가지었다', '견뎠다': '견디었다', '그렸다': '그리었다',
    '기다렸다': '기다리었다', '내렸다': '내리었다', '느꼈다': '느끼었다', '다녔다': '다니었다',
    '다쳤다': '다치었다', '던졌다': '던지었다', '때렸다': '때리었다', '마셨다': '마시었다',
    '만졌다': '만지었다', '모셨다': '모시었다', '미쳤다': '미치었다', '버렸다': '버리었다',
    '버텼다': '버티었다', '빌렸다': '빌리었다', '아꼈다': '아끼었다', '이겼다': '이기었다',
    '지켰다': '지키었다', '치뤘다': '치루었다', '훔쳤다': '훔치었다', '흐렸다': '흐리었다',
    '느렸다': '느리었다', '어렸다': '어리었다', '남겼다': '남기었다', '넘겼다': '넘기었다', 
    '당겼다': '당기었다', '삼켰다': '삼키었다', '생겼다': '생기었다', '섬겼다': '섬기었다', 
    '숨겼다': '숨기었다', '안겼다': '안기었다', '옮겼다': '옮기었다', '우겼다': '우기었다', 
    '웃겼다': '웃기었다', '쫓겼다': '쫓기었다', '찢겼다': '찢기었다', '즐겼다': '즐기었다',
    '갈렸다': '갈리었다', '끌렸다': '끌리었다', '날렸다': '날리었다', '널렸다': '널리었다',
    '놀렸다': '놀리었다', '달렸다': '달리었다', '돌렸다': '돌리었다', '들렸다': '들리었다',
    '떨렸다': '떨리었다', '말렸다': '말리었다', '물렸다': '물리었다', '밀렸다': '밀리었다',
    '살렸다': '살리었다', '실렸다': '실리었다', '쏠렸다': '쏠리었다', '알렸다': '알리었다',
    '열렸다': '열리었다', '올렸다': '올리었다', '울렸다': '울리었다', '잘렸다': '잘리었다',
    '찔렸다': '찔리었다', '털렸다': '털리었다', '틀렸다': '틀리었다', '팔렸다': '팔리었다',
    '풀렸다': '풀리었다', '흘렸다': '흘리었다', '기울였다': '기울이었다', '녹였다': '녹이었다', 
    '늘였다': '늘이었다', '먹였다': '먹이었다', '벌였다': '벌이었다', '붙였다': '붙이었다', 
    '숙였다': '숙이었다', '줄였다': '줄이었다', '죽였다': '죽이었다', '차였다': '차이었다', '치였다': '치이었다',
    '갇혔다': '갇히었다', '고쳤다': '고치었다', '겹쳤다': '겹치었다', '넓혔다': '넓히었다',
    '넘쳤다': '넘치었다', '닫혔다': '닫히었다', '막혔다': '막히었다', '맞혔다': '맞히었다',
    '망쳤다': '망치었다', '묻혔다': '묻히었다', '밝혔다': '밝히었다', '밟혔다': '밟히었다',
    '부딪혔다': '부딪히었다', '설쳤다': '설치었다', '얽혔다': '얽히었다', '읽혔다': '읽히었다',
    '익혔다': '익히었다', '입혔다': '입히었다', '잡혔다': '잡히었다', '좁혔다': '좁히었다',
    '찍혔다': '찍히었다', '펼쳤다': '펼치었다', '헤쳤다': '헤치었다', '건드렸다': '건드리었다', 
    '깨뜨렸다': '깨뜨리었다', '떨어뜨렸다': '떨어뜨리었다', '무너뜨렸다': '무너뜨리었다', 
    '빠뜨렸다': '빠뜨리었다', '엎드렸다': '엎드리었다', '자빠뜨렸다': '자빠뜨리었다', '터뜨렸다': '터뜨리었다',
    '꽜다': '꼬았다', '봤다': '보았다', '쐈다': '쏘았다', '왔다': '오았다',
    '가져왔다': '가져오았다', '다가왔다': '다가오았다', '다녀왔다': '다녀오았다', '내려왔다': '내려오았다', 
    '들어왔다': '들어오았다', '올라왔다': '올라오았다', '찾아왔다': '찾아오았다', '노려봤다': '노려보았다', 
    '돌아봤다': '돌아보았다', '살펴봤다': '살펴보았다', '알아봤다': '알아보았다', '지켜봤다': '지켜보았다', 
    '쳐다봤다': '쳐다보았다', '훔쳐봤다': '훔쳐보았다', '꿨다': '꾸었다', '뒀다': '두었다', 
    '췄다': '추었다', '눴다': '누었다', '가꿨다': '가꾸었다', '가뒀다': '가두었다', '거뒀다': '거두었다', 
    '기웠다': '기우었다', '깨웠다': '깨우었다', '나눴다': '나누었다', '다뤘다': '다루었다', 
    '메웠다': '메우었다', '미뤘다': '미루었다', '바꿨다': '바꾸었다', '배웠다': '배우었다', 
    '비웠다': '비우었다', '싸웠다': '싸우었다', '세웠다': '세우었다', '에웠다': '에우었다', 
    '외웠다': '외우었다', '재웠다': '재우었다', '지웠다': '지우었다', '채웠다': '채우었다', 
    '치웠다': '치우었다', '키웠다': '키우었다', '태웠다': '태우었다', '피웠다': '피우었다',
    '감췄다': '감추었다', '갖췄다': '갖추었다', '낮췄다': '낮추었다', '늦췄다': '늦추었다', 
    '맞췄다': '맞추었다', '멈췄다': '멈추었다', '춤췄다': '춤추었다', '이뤘다': '이루었다', '부쉈다': '부수었다',
    '가까웠다': '가까우었다', '가벼웠다': '가벼우었다', '고마웠다': '고마우었다', '귀여웠다': '귀여우었다', 
    '까다로웠다': '까다로우었다', '더러웠다': '더러우었다', '더웠다': '더우었다', '두려웠다': '두려우었다', 
    '뜨거웠다': '뜨거우었다', '매웠다': '매우었다', '무거웠다': '무거우었다', '무서웠다': '무서우었다', 
    '미끄러웠다': '미끄러우었다', '반가웠다': '반가우었다', '부드러웠다': '부드러우었다', '쉬웠다': '쉬우었다', 
    '아름다웠다': '아름다우었다', '아쉬웠다': '아쉬우었다', '어두웠다': '어두우었다', '어려웠다': '어려우었다', 
    '외로웠다': '외로우었다', '자유로웠다': '자유로우었다', '차가웠다': '차가우었다', '추웠다': '추우었다',
    '머물렀다': '머무르었다', '눌렀다': '누르었다', '불렀다': '부르었다', '서둘렀다': '서두르었다',
    '굴렀다': '구르었다', '서툴렀다': '서투르었다', '흘렀다': '흐르었다', '골랐다': '고르았다',
    '올랐다': '오르았다', '말랐다': '마르았다', '잘랐다': '자르았다', '길렀다': '기르었다',
    '갈랐다': '가르았다', '어울렀다': '어우르었다', '벴다': '베었다', '셌다': '세었다',
    '멨다': '메었다', '설렜다': '설레었다', '헤맸다': '헤매었다'
  };
  
  Object.keys(verbMap).forEach(key => {
    const baseKey = key.slice(0, -1);
    const baseVal = verbMap[key].slice(0, -1);
    const regex = new RegExp(baseKey + '([^ ]*)$');
    res = res.replace(regex, baseVal + '$1');
  });

  // 💡 3. 구어체 명사/대명사 변환
  const wordMap: Record<string, string> = {
    '그게': '그것이', '그걸': '그것을', '그건': '그것은',
    '뭘': '무엇을', '뭣': '무엇이', '이게': '이것이', '이걸': '이것을', '이건': '이것은',
    '저게': '저것이', '저걸': '저것을', '저건': '저것은',
    '날': '나를', '널': '너를', '울': '우리를', '우릴': '우리를',
    '맘': '마음', '첨': '처음', '담': '다음'
  };
  
  Object.keys(wordMap).forEach(key => {
    const regex = new RegExp(`(^|\\s)${key}(?=\\s|$)`, 'g');
    res = res.replace(regex, `$1${wordMap[key]}`);
  });

  return res;
};

export default function SearchInput({
  initialQuery = '',
  placeholder,
  className = '',
  autoFocus = false,
  isApp = false,
}: SearchInputProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();

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

  const checkIsNative = () => {
    return typeof window !== 'undefined' && Capacitor.isNativePlatform();
  };

  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [autoFocus]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGlobalPaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      const tagName = activeEl?.tagName.toLowerCase();
      const isInputOrTextarea = tagName === 'input' || tagName === 'textarea' || (activeEl as HTMLElement)?.isContentEditable;

      if (isInputOrTextarea && activeEl !== inputRef.current) return; 

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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGlobalCopy = () => {
      const activeEl = document.activeElement;
      const tagName = activeEl?.tagName.toLowerCase();
      const isInputOrTextarea = tagName === 'input' || tagName === 'textarea' || (activeEl as HTMLElement)?.isContentEditable;

      if (isInputOrTextarea && activeEl !== inputRef.current) return; 
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

  // 🌟 입력받은 검색어의 '종결 표현'만을 정확히 찾아 원말로 복원합니다.
  const normalizeFinalQuery = (rawQuery: string) => {
    let trimmed = (rawQuery || '').trim();
    if (!trimmed) return '';
    
    // 축약어 -> 원말 변환 실행
    trimmed = expandKoreanAbbreviations(trimmed);

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

  const saveToRecent = (keyword: string) => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      let parsed = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) parsed = [];

      const existingIndex = parsed.findIndex((item: any) => item.keyword === keyword);
      
      if (existingIndex > -1) {
        parsed[existingIndex].count = (parsed[existingIndex].count || 1) + 1;
        const [movedItem] = parsed.splice(existingIndex, 1);
        parsed.unshift(movedItem);
      } else {
        parsed.unshift({ keyword, count: 1 });
      }

      const sliced = parsed.slice(0, 30);
      localStorage.setItem(RECENT_KEY, JSON.stringify(sliced));
      
      window.dispatchEvent(new Event(UPDATED_EVENT));
    } catch (e) {
      console.error('Recent keywords save error:', e);
    }
  };

  const goSearch = async (rawQuery: string) => {
    // 🌟 화면에 보여지는 검색어(query)는 그대로 두되, 백엔드/URL로 날아가는 최종 검색어만 변환합니다.
    const finalQuery = normalizeFinalQuery(rawQuery);
    
    // 🌟 유효성 검사 및 최근 검색어 저장은 원본 입력어 기준(rawQuery)으로 처리
    const rawTrimmed = (rawQuery || '').trim();
    const v = validate(rawTrimmed);
    if (!v.ok) {
      if (v.msg) alert(v.msg);
      return;
    }

    const now = Date.now();
    if (now - lastSearchAtRef.current < 600) return;
    lastSearchAtRef.current = now;

    if (!finalQuery) return;

    if (typeof window !== 'undefined') {
      saveToRecent(rawTrimmed); 

      try {
        const res = await fetch('/api/save-search-keyword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword: rawTrimmed }),
        });
        
        if (!res.ok) {
          await supabase.from('search_logs').insert([{ keyword: rawTrimmed }]);
        }
      } catch (error) {
        try { await supabase.from('search_logs').insert([{ keyword: rawTrimmed }]); } catch(e) {}
      }
    }

    const basePath = isApp || checkIsNative() ? '/app' : '/';
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
      try { recognitionRef.current.abort?.(); } catch {}
      try { recognitionRef.current.stop?.(); } catch {}
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

    try { recognitionRef.current?.stop?.(); } catch {}
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
    if (checkIsNative()) return; 

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다. (Chrome 권장)');
      setMicLang(null);
      try { sessionStorage.removeItem(MIC_USER_ENABLED_KEY); } catch {}
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
        setTimeout(() => { goSearch(transcript); }, 100);
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
        try { sessionStorage.removeItem(MIC_USER_ENABLED_KEY); } catch {}
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

    if (!checkIsNative()) return;
    if (!hard) return;

    try {
      await SpeechRecognition.stop();
      await SpeechRecognition.removeAllListeners();
    } catch {}
  };

  const startNativeLoop = async () => {
    if (!checkIsNative() || !micLangRef.current || !isMountedRef.current) return;
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
        try { sessionStorage.removeItem(MIC_USER_ENABLED_KEY); } catch {}
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
        setTimeout(() => { goSearch(transcript); }, 100);
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
        try { sessionStorage.removeItem(MIC_USER_ENABLED_KEY); } catch {}
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

    if (checkIsNative()) {
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
  }, [micLang]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (checkIsNative()) return;

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
  }, []);

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