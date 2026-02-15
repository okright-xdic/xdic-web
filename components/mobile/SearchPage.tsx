'use client';

// 📱 모바일 공용 화면 (Web/App 모드 구분)
// 수정사항: 앱(isApp=true)일 경우 배너 및 애드센스 광고 자동 숨김

import React, { useState, useEffect, KeyboardEvent, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import RecentKeywords from '@/components/RecentKeywords';
import PopularKeywords from '@/components/PopularKeywords';
import TrendGraph from '@/components/TrendGraph';

interface SearchResult {
  id: number;
  category_id: number;
  line_text: string;
  source_order: number;
}

interface SearchPageProps {
  query: string;
  results: SearchResult[];
  highlightList?: string[];
  isApp?: boolean; // [핵심] 앱 모드 여부
}

const CATEGORY_NAMES: Record<number, string> = {
  1: '기본영어', 2: '인문사회용어', 3: '기계_전기_전자용어', 4: '교육_종교_예체능용어',
  5: '무역경제용어', 6: '자동차_환경용어', 7: '물리_화학용어', 8: '컴퓨터용어',
  9: '의학용어', 10: '인문사회기타용어', 11: '과학기술기타용어', 12: '기타',
};

// [광고 컴포넌트]
const AdPlaceholder = ({ label }: { label: string }) => (
  <div className="w-full my-4 px-2">
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-slate-400 tracking-[0.2em] mb-1 uppercase font-bold text-center w-full">
        광고
      </span>
      <div className="w-full min-h-[80px] bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shadow-sm text-slate-300 italic text-xs">
        {label}
      </div>
    </div>
  </div>
);

export default function SearchPage({ query, results, highlightList = [], isApp = false }: SearchPageProps) {
  const router = useRouter();
  const [internalQuery, setInternalQuery] = useState(query);
  const [currentPage, setCurrentPage] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
   
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 20; 

  // [설정] 앱이면 /app, 웹이면 /m으로 홈/검색 경로 설정
  const homeLink = isApp ? '/app' : '/m';

  const isTooShort = query.trim().length > 0 && query.trim().length < 2;

  useEffect(() => {
    setInternalQuery(query);
    setCurrentPage(1);
    setIsSearching(false);
  }, [query, results]);

  // [자동 포커스]
  useEffect(() => {
    if (!query && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [query]);

  const handleSearch = () => {
    if (!internalQuery.trim()) return;
    setIsSearching(true);
    router.push(`${homeLink}?q=${encodeURIComponent(internalQuery.trim())}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setInternalQuery('');
    inputRef.current?.focus();
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.\n크롬(Chrome) 브라우저를 이용해 주세요.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ko-KR'; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true);

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setInternalQuery(speechResult);
      setIsListening(false);
      
      if (speechResult.trim()) {
        setIsSearching(true);
        router.push(`${homeLink}?q=${encodeURIComponent(speechResult.trim())}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('음성 인식 오류:', event.error);
      setIsListening(false);
      alert('음성 인식에 실패했습니다.');
    };
  };

  const handleExternalSearch = (site: 'google' | 'naver') => {
    if (!query) return;
    const encoded = encodeURIComponent(query);
    const url = site === 'google' 
      ? `https://www.google.com/search?q=${encoded}` 
      : `https://en.dict.naver.com/#/search?query=${encoded}`;
    window.open(url, '_blank');
  };

  const getCategoryName = (id: number) => CATEGORY_NAMES[id] || '기타';

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes('Google US English')) || 
                             voices.find(v => v.lang === 'en-US');
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.lang = 'en-US'; 
      }
      utterance.pitch = 0.85; 
      utterance.rate = 0.9;    
      window.speechSynthesis.speak(utterance);
    } else {
      alert("이 브라우저는 음성 듣기를 지원하지 않습니다.");
    }
  };

  const highlightMatch = (text: string) => {
    if (!highlightList || highlightList.length === 0) {
      return <span style={{ color: '#1e293b' }}>{text}</span>; 
    }
    const sortedKeys = [...highlightList].sort((a, b) => b.length - a.length);
    const escapedKeys = sortedKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedKeys.join('|')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, idx) => {
          const lowerPart = part.toLowerCase();
          const lowerQuery = query.trim().toLowerCase();
          const isMatch = sortedKeys.some(k => k.toLowerCase() === lowerPart);
          let color = '#334155';
          if (isMatch) {
            if (lowerPart === lowerQuery) color = '#ea580c';
            else color = '#2563eb';
          }
          return <span key={idx} style={{ color, fontWeight: 400 }}>{part}</span>;
        })}
      </>
    );
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      
      {/* [로딩 오버레이] */}
      {isSearching && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-6"></div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            '<span className="text-blue-600">{internalQuery}</span>' 찾는 중...
          </h2>
          <p className="text-slate-500 font-medium">잠시만 기다려주세요!</p>
        </div>
      )}

      {/* 1. 상단 섹션 */}
      <div className="flex-none w-full max-w-lg mx-auto px-4">
        <header className="w-full pt-8 pb-4">
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <div className="flex-shrink-0">
              {/* 로고 클릭 시 설정된 homeLink(/app 또는 /m)로 이동 */}
              <Link href={homeLink} className="cursor-pointer">
                <Image 
                  src="/images/LOGO_01_ChatGPT_S.jpg" 
                  alt="X-DIC Logo" 
                  width={150} 
                  height={80}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>
            
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-xl font-extrabold text-slate-800 leading-tight">
                한영/영한사전 – 복합어 전문 엑스딕(X-DIC)!
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                 Korean-English/English-Korean Dictionary – Compound Words
              </p>
               <p className="text-[11px] text-slate-400 font-normal mt-1 leading-tight">
                * 엑스딕(X-DIC)은 Expert Dictionary의 약자로, 복합어 검색 전문 한영/영한 용어사전입니다.
              </p>
            </div>
          </div>

          {/* [검색창] */}
          <div className="w-full"> 
             <div className="relative w-full max-w-4xl mx-auto">
              <div className={`relative flex items-center w-full h-11 rounded-full border-2 bg-white overflow-hidden shadow-sm transition-colors ${isListening ? 'border-red-500 ring-2 ring-red-100' : 'border-blue-500'}`}>
                
                <input
                  ref={inputRef} 
                  type="text"
                  value={internalQuery}
                  onChange={(e) => setInternalQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="① 마이크 클릭 후 음성 검색 ② 단어 입력 후 엔터/검색 클릭!(대소문자 구분 없음)"
                  className="flex-grow h-full px-1 text-[10.5px] text-center text-slate-700 placeholder-slate-400 outline-none bg-transparent tracking-tighter"
                  autoComplete="off" 
                />

                <div className="flex items-center gap-0 pr-1">
                  {internalQuery && (
                    <button onClick={handleClear} className="p-1 text-slate-300 hover:text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  )}
                  <button onClick={handleVoiceSearch} className={`p-1 transition-all ${isListening ? 'text-red-500 animate-pulse scale-110' : 'text-slate-400 hover:text-blue-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isListening ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  <button onClick={handleSearch} className="h-8 px-3 ml-1 bg-[#1e293b] hover:bg-black text-white rounded-full font-bold text-xs transition-colors whitespace-nowrap">
                    검색
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="w-full flex-grow">
        <div className="container mx-auto px-4 max-w-lg">
          
          {query ? (
             <div className="w-full mt-2">
               {isTooShort ? (
                 <div className="py-24 text-center text-slate-400 text-lg font-light italic">
                   단어는 <span style={{ color: '#ea580c', fontWeight: 'bold' }}>두 글자 이상</span> 입력해 주세요.
                 </div>
               ) : results.length > 0 ? (
                 <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-sm font-semibold text-slate-500">
                        검색 결과 <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{results.length}</span>건
                      </span>
                    </div>

                    <ul className="space-y-2"> 
                      {currentItems.map((item, idx) => (
                        <React.Fragment key={item.id}>
                          <li className="group bg-white rounded-xl py-2 px-3 border border-slate-100 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1">
                                <button onClick={() => handleSpeak(item.line_text)} className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shadow-sm active:scale-95 transition-transform">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM14 10a4.002 4.002 0 00-1.172-2.828.75.75 0 10-1.06 1.06c.586.586.914 1.378.914 2.207s-.328 1.62-.914 2.207a.75.75 0 101.06 1.06A4.002 4.002 0 0014 10z" />
                                  </svg>
                                </button>
                                <div className="text-base leading-relaxed break-keep mt-1">
                                   {highlightMatch(item.line_text)}
                                </div>
                              </div>
                              <span className="flex-shrink-0 ml-1 px-2 py-0.5 rounded-lg tracking-tight whitespace-nowrap shadow-sm mt-1" style={{ backgroundColor: '#d4b08c', color: '#ffffff', fontWeight: '500', fontSize: '11px', fontFamily: 'sans-serif' }}>
                                {getCategoryName(item.category_id)}
                              </span>
                            </div>
                          </li>
                          {/* [수정] 앱 모드(isApp)가 아닐 때만 광고 표시 */}
                          {idx === 6 && !isApp && <AdPlaceholder label="Google AdSense" />}
                        </React.Fragment>
                      ))}
                    </ul>

                    {/* 페이지네이션 */}
                    {results.length > itemsPerPage && (
                      <div className="flex justify-center items-center gap-2 mt-8 mb-8 select-none">
                        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="text-xs px-2 py-1 text-slate-400">&lt;&lt;</button>
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="text-sm px-2 py-1 text-slate-500">이전</button>
                        <div className="flex items-center gap-1 mx-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number, idx, arr) => (
                            <React.Fragment key={number}>
                              <button onClick={() => handlePageChange(number)} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentPage === number ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'}`}>{number}</button>
                              {idx < arr.length - 1 && <span className="text-[10px] text-slate-300">•</span>}
                            </React.Fragment>
                          ))}
                        </div>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="text-sm px-2 py-1 text-slate-500">다음</button>
                        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="text-xs px-2 py-1 text-slate-400">&gt;&gt;</button>
                      </div>
                    )}
                    
                    {/* [수정] 앱 모드(isApp)가 아닐 때만 하단 광고 표시 */}
                    {!isApp && <div className="mt-8"><AdPlaceholder label="Google AdSense" /></div>}
                    
                    <div className="py-8 text-center border-t border-slate-100 mt-8"><p className="text-sm text-slate-400">검색 완료</p></div>
                  </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4">🤔</div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">'<span style={{ color: '#ef4444' }}>{query}</span>' 결과 없음</h3>
                    <div className="flex flex-col w-full gap-3 mt-4">
                      <button onClick={() => handleExternalSearch('naver')} className="w-full py-3 bg-[#03C75A] text-white rounded-xl font-bold">네이버 검색</button>
                      <button onClick={() => handleExternalSearch('google')} className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold">구글 검색</button>
                    </div>
                 </div>
               )}
             </div>
          ) : (
            <div className="mt-6 flex flex-col gap-8">
              
              {/* [이미 적용됨] !isApp 일 때만(즉, 웹일 때만) 배너를 보여줌! */}
              {!isApp && (
                <div className="w-full aspect-[2/1] relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                  <Image src="/images/mobile-app-banner-bright.png" alt="배너" fill className="object-cover" />
                </div>
              )}

              <RecentKeywords />
              <PopularKeywords />
              <TrendGraph />
            </div>
          )}
        </div>
      </main>

      <div className="flex-grow py-8"></div>
      <div className="flex-none"><Footer /></div>
    </div>
  );
}