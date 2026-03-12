'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Capacitor } from '@capacitor/core'; // 🌟 핵심 1: 스마트폰 감지 센서 달기
import SearchInput from '@/components/SearchInput';
import Footer from '@/components/Footer';
import RecentKeywords from '@/components/RecentKeywords';
import PopularKeywords from '@/components/PopularKeywords';
import TrendGraph from '@/components/TrendGraph';
import AdSensePlaceholder from '@/components/ads/AdSensePlaceholder';

interface SearchResult {
  id: string | number;
  category_id: number;
  line_text: string;
  source_order?: number;
}

interface SearchPageProps {
  query: string;
  results?: SearchResult[];
  highlightList?: string[];
  isApp?: boolean;
}

const CATEGORY_NAMES: Record<number, string> = {
  1: '기본영어',
  2: '인문사회용어',
  3: '기계_전기_전자용어',
  4: '교육_종교_예체능용어',
  5: '무역경제용어',
  6: '자동차_환경용어',
  7: '물리_화학용어',
  8: '컴퓨터용어',
  9: '의학용어',
  10: '인문사회기타용어',
  11: '과학기술기타용어',
  12: '기타',
};

export default function SearchPage({ query, results = [], highlightList = [], isApp = false }: SearchPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 🌟 핵심 2: 앱인지 아닌지 무조건 찾아내는 마법의 3줄!
  const [clientIsApp, setClientIsApp] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && Capacitor.isNativePlatform()) {
      setClientIsApp(true); // "어? 나 스마트폰 안이네? 앱 모드 켜!"
    }
  }, []);

  // 🌟 최종 판단: 원래 넘어온 isApp이 true이거나, 폰에서 켜졌으면 무조건 앱 모드로 작동!
  const displayIsApp = isApp || clientIsApp;

  const displayQuery = (query || '').trim();
  const isTooShort = displayQuery.length > 0 && displayQuery.replace(/\s+/g, '').length < 2;

  const homeHref = displayIsApp ? '/app' : '/';

  useEffect(() => {
    setCurrentPage(1);
  }, [results, query]);

  const handleExternalSearch = (site: 'google' | 'naver') => {
    if (!displayQuery) return;
    const encoded = encodeURIComponent(displayQuery);
    const url =
      site === 'google'
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
      const preferredVoice =
        voices.find((v) => v.name.includes('Google US English')) || voices.find((v) => v.lang === 'en-US');

      if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.lang = 'en-US';
      }

      utterance.pitch = 0.85;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('이 브라우저는 음성 듣기를 지원하지 않습니다.');
    }
  };

  const highlightMatch = (text: string) => {
    if (!highlightList || highlightList.length === 0) return <span style={{ color: '#1e293b' }}>{text}</span>;

    const sortedKeys = [...highlightList].filter(Boolean).sort((a, b) => b.length - a.length);
    const escapedKeys = sortedKeys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedKeys.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, idx) => {
          const lowerPart = part.toLowerCase();
          const lowerQuery = displayQuery.toLowerCase();
          const isMatch = sortedKeys.some((k) => k.toLowerCase() === lowerPart);
          let color = '#334155';

          if (isMatch) {
            if (lowerPart === lowerQuery) color = '#ea580c';
            else color = '#2563eb';
          }

          return (
            <span key={idx} style={{ color, fontWeight: 400 }}>
              {part}
            </span>
          );
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
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-none w-full max-w-4xl mx-auto px-4 md:px-6">
        
        <header className={`w-full ${displayIsApp ? 'pt-14 pb-6' : 'pt-8 pb-2 md:pt-16 md:pb-6'}`}>
          
          {displayIsApp ? (
            <div className="flex justify-center mb-6">
              <Link href={homeHref} className="cursor-pointer">
                <Image
                  src="/images/LOGO_01_ChatGPT_S.jpg"
                  alt="X-DIC Logo"
                  width={140}
                  height={70}
                  className="object-contain hover:opacity-90 transition-opacity"
                  priority
                />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8">
              <div className="flex-shrink-0">
                <Link href={homeHref} className="cursor-pointer">
                  <Image
                    src="/images/LOGO_01_ChatGPT_S.jpg"
                    alt="X-DIC Logo"
                    width={140}
                    height={70}
                    className="object-contain hover:opacity-90 transition-opacity"
                    priority
                  />
                </Link>
              </div>

              <div className="flex flex-col gap-1 justify-center text-center md:text-left">
                <Link href={homeHref} className="cursor-pointer hover:opacity-80 transition-opacity">
                  <h1 className="text-xl md:text-[24px] font-extrabold text-slate-800 leading-tight md:leading-none">
                    한영/영한사전 – 복합어 전문 엑스딕!
                  </h1>
                </Link>
                <p className="text-sm md:text-[16px] text-slate-500 font-medium leading-tight mt-1">
                  Korean-English/English-Korean Dictionary – Compound Terminology Dictionary
                </p>
                <p className="text-[11px] md:text-[12px] text-slate-400 font-normal leading-tight mt-1">
                  * 엑스딕(X-DIC)은 Expert Dictionary의 약자로, 복합어 검색 전문 한영/영한 용어사전입니다.
                </p>
              </div>
            </div>
          )}

          <div className="w-full">
            <SearchInput initialQuery={displayQuery} isApp={displayIsApp} />
          </div>
        </header>
      </div>

      <main className="w-full flex-grow">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {displayQuery ? (
            <div className="w-full mt-2">
              {isTooShort ? (
                <div className="py-32 text-center text-slate-400 text-xl font-light italic animate-in fade-in slide-in-from-bottom-2 duration-300">
                  단어는 <span style={{ color: '#ea580c', fontWeight: 'bold' }}>두 글자 이상</span> 입력해 주세요.
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-sm font-semibold text-slate-500">
                      검색 결과 <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{results.length}</span>건
                    </span>
                  </div>

                  <ul className="space-y-1">
                    {currentItems.map((item, idx) => (
                      <React.Fragment key={String(item.id || idx)}>
                        <li className="group bg-white rounded-lg py-2 px-3 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                              {!displayIsApp && (
                                <button
                                  onClick={() => handleSpeak(item.line_text)}
                                  className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                                  title="발음 듣기"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM14 10a4.002 4.002 0 00-1.172-2.828.75.75 0 10-1.06 1.06c.586.586.914 1.378.914 2.207s-.328 1.62-.914 2.207a.75.75 0 101.06 1.06A4.002 4.002 0 0014 10z" />
                                  </svg>
                                </button>
                              )}

                              <div className="text-base md:text-lg leading-snug break-keep">{highlightMatch(item.line_text)}</div>
                            </div>

                            <span
                              className="flex-shrink-0 ml-3 px-2 py-0.5 rounded text-xs tracking-tight whitespace-nowrap shadow-sm"
                              style={{ backgroundColor: '#d4b08c', color: '#ffffff', fontWeight: '500', fontFamily: 'sans-serif' }}
                            >
                              {getCategoryName(item.category_id)}
                            </span>
                          </div>
                        </li>

                        {!displayIsApp && idx === 6 && <AdSensePlaceholder adSlot="8675599033" debugLabel="PC_검색결과_중간" minHeight={200} />}
                      </React.Fragment>
                    ))}
                  </ul>

                  {results.length > itemsPerPage && (
                    <div className="flex justify-center items-center gap-3 mt-12 mb-12 select-none font-sans">
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="text-xs font-bold text-slate-400 hover:text-orange-600 hover:bg-orange-50 px-2 py-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        &lt;&lt;
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="text-sm font-medium text-slate-500 hover:text-orange-600 px-2 py-1 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        이전
                      </button>

                      <div className="flex items-center gap-2 mx-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number, idx, arr) => (
                          <React.Fragment key={number}>
                            <button
                              onClick={() => handlePageChange(number)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                                currentPage === number
                                  ? 'bg-slate-800 text-white font-bold shadow-md transform scale-105'
                                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {number}
                            </button>
                            {idx < arr.length - 1 && <span className="text-[10px] text-slate-300 mx-0.5">•</span>}
                          </React.Fragment>
                        ))}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="text-sm font-medium text-slate-500 hover:text-orange-600 px-2 py-1 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        다음
                      </button>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="text-xs font-bold text-slate-400 hover:text-orange-600 hover:bg-orange-50 px-2 py-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        &gt;&gt;
                      </button>
                    </div>
                  )}
                  
                  {!displayIsApp && <AdSensePlaceholder adSlot="2218001895" debugLabel="PC_검색결과_하단" minHeight={250} />}

                  <div className="py-8 text-center border-t border-slate-100 mt-8">
                    <p className="text-sm text-slate-400">{results.length}개의 결과를 모두 확인했습니다.</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4">🤔</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    '<span style={{ color: '#ef4444' }}>{displayQuery}</span>'에 대한 결과가 없습니다.
                  </h3>
                  <p className="text-slate-500 text-sm mb-8">내부 사전에 데이터가 없네요. 외부 사이트에서 찾아보시겠어요?</p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    <button
                      onClick={() => handleExternalSearch('naver')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#03C75A] hover:bg-[#02b351] text-white rounded-xl font-bold transition-all shadow-sm hover:shadow-md"
                    >
                      <span className="text-lg font-serif">N</span>네이버 사전 검색
                    </button>
                    <button
                      onClick={() => handleExternalSearch('google')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all shadow-sm hover:shadow-md"
                    >
                      Google 검색
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {!displayIsApp && (
                <div className="h-[180px] relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                  <Image src="/images/mobile-app-banner-bright.png" alt="배너" fill className="object-contain" />
                </div>
              )}
              <RecentKeywords />
              <PopularKeywords />
              <TrendGraph />
            </div>
          )}
        </div>
      </main>

      <div className="flex-grow py-[5vh]"></div>
      
      {!displayIsApp && (
        <div className="flex-none">
          <Footer />
        </div>
      )}
    </div>
  );
}