'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Capacitor } from '@capacitor/core';
import SearchInput from '@/components/SearchInput';
import Footer from '@/components/Footer';
import TrendGraph from '@/components/TrendGraph';
import AdSensePlaceholder from '@/components/ads/AdSensePlaceholder';
import NuanceWidget from '@/components/NuanceWidget'; 
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface SearchResult {
  id: string | number;
  category_id: number;
  line_text: string;
  source_order?: number;
}

interface SearchPageProps {
  query: string;
  results?: SearchResult[];
  orangeKeys?: string[]; 
  blueKeys?: string[];   
  isApp?: boolean;
  popularSearches?: string[];
  recentSearches?: { word: string; count: number }[];
  isPartialMatch?: boolean;
  matchedKeywords?: string[];
}

const CATEGORY_NAMES: Record<number, string> = {
  0: '기초영어', 1: '기본영어', 2: '인문사회용어', 3: '기계_전기_전자용어',
  4: '교육_종교_예체능용어', 5: '무역경제용어', 6: '자동차_환경용어', 7: '물리_화학용어',
  8: '컴퓨터용어', 9: '의학용어', 10: '인문사회기타용어', 11: '과학기술기타용어', 12: '기타',
};

const TAG_COLORS = [
  'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100',
  'bg-pink-50 text-pink-600 hover:bg-pink-100 border-pink-100',
  'bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-100',
  'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100',
  'bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-100',
];

export default function SearchPage({ 
  query, results = [], orangeKeys = [], blueKeys = [],
  isApp = false, popularSearches = [], recentSearches = [],
  isPartialMatch = false, matchedKeywords = []    
}: SearchPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [clientIsApp, setClientIsApp] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const [supabase] = useState(() => createClientComponentClient());

  useEffect(() => {
    if (typeof window !== 'undefined' && Capacitor.isNativePlatform()) setClientIsApp(true);
    
    const fetchPreview = async () => {
      const { data } = await supabase.from('conversation_lines').select('*').order('created_at', { ascending: false }).limit(3);
      if (data) setPreviewData(data);
    };
    fetchPreview();
  }, [supabase]);

  const displayIsApp = isApp || clientIsApp;
  const displayQuery = (query || '').trim();
  const isTooShort = displayQuery.length > 0 && displayQuery.replace(/\s+/g, '').length < 2;

  const getSearchUrl = (keyword: string) => displayIsApp ? `/app?q=${encodeURIComponent(keyword)}` : `/?q=${encodeURIComponent(keyword)}`;

  useEffect(() => setCurrentPage(1), [results, query]);

  const displayResults = React.useMemo(() => {
    const categoryCount: Record<number, number> = {};
    return results.filter(item => {
      const catId = item.category_id != null ? item.category_id : 12;
      categoryCount[catId] = (categoryCount[catId] || 0) + 1;
      return categoryCount[catId] <= 5;
    });
  }, [results]);

  const handleExternalSearch = (site: 'google' | 'naver') => {
    if (!displayQuery) return;
    const encoded = encodeURIComponent(displayQuery);
    const url = site === 'google' ? `https://www.google.com/search?q=${encoded}` : `https://en.dict.naver.com/#/search?query=${encoded}`;
    window.open(url, '_blank');
  };

  const getCategoryName = (id: number) => CATEGORY_NAMES[id] || '기타';

  const highlightMatch = (text: string) => {
    const allKeys = [...new Set([...orangeKeys, ...blueKeys])].filter(Boolean).sort((a, b) => b.length - a.length);
    if (allKeys.length === 0) return <span style={{ color: '#111111' }}>{text}</span>;

    const escapedKeys = allKeys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedKeys.join('|')})`, 'gi');
    const parts = text.split(regex);
    const lowerQueryNoSpace = displayQuery.toLowerCase().replace(/\s+/g, '');

    return (
      <>
        {parts.map((part, idx) => {
          const lowerPart = part.toLowerCase();
          const lowerPartNoSpace = lowerPart.replace(/\s+/g, ''); 
          let color = '#111111'; 

          if (orangeKeys.some((k) => k.toLowerCase() === lowerPart)) color = '#ea580c'; 
          else if (blueKeys.some((k) => k.toLowerCase() === lowerPart)) color = '#2563eb'; 
          if (lowerPartNoSpace === lowerQueryNoSpace && orangeKeys.length > 0) color = '#ea580c'; 

          return <span key={idx} style={{ color, fontWeight: 400 }}>{part}</span>;
        })}
      </>
    );
  };

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const voices = window.speechSynthesis.getVoices();
      const enVoices = voices.filter(v => v.lang.startsWith('en'));
      const koVoices = voices.filter(v => v.lang.startsWith('ko'));

      const enVoice = enVoices.find(v => v.name.includes('Google US English Male')) || enVoices.find(v => v.name.includes('Google US English')) || enVoices[0];
      const koVoice = koVoices.find(v => v.name.includes('Google') && v.name.includes('Male')) || koVoices[0];

      const parts: { lang: string; text: string }[] = [];
      let currentLang = /[a-zA-Z]/.test(text.charAt(0)) ? 'en' : 'ko'; 
      let currentText = '';

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[a-zA-Z]/.test(char)) {
          if (currentLang !== 'en' && currentText.trim().length > 0) {
            parts.push({ lang: currentLang, text: currentText });
            currentText = '';
          }
          currentLang = 'en'; currentText += char;
        } else if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(char)) {
          if (currentLang !== 'ko' && currentText.trim().length > 0) {
            parts.push({ lang: currentLang, text: currentText });
            currentText = '';
          }
          currentLang = 'ko'; currentText += char;
        } else {
          currentText += char;
        }
      }
      if (currentText.trim().length > 0) parts.push({ lang: currentLang, text: currentText });

      parts.forEach((part) => {
        if (!/[a-zA-Z가-힣0-9]/.test(part.text)) return; 
        const utterance = new SpeechSynthesisUtterance(part.text);
        if (part.lang === 'ko') {
          if (koVoice) utterance.voice = koVoice;
          utterance.lang = koVoice ? koVoice.lang : 'ko-KR';
          utterance.pitch = 1.0; 
          utterance.rate = 1.05; 
          utterance.volume = 1.0; 
        } else {
          if (enVoice) utterance.voice = enVoice;
          utterance.lang = enVoice ? enVoice.lang : 'en-US';
          utterance.pitch = 0.9; 
          utterance.rate = 0.85; 
          utterance.volume = 0.75; 
        }
        window.speechSynthesis.speak(utterance);
      });
    } else {
      alert('이 브라우저는 음성 듣기를 지원하지 않습니다.');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayResults.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-none w-full max-w-4xl mx-auto px-4 md:px-6">
        <header className={`w-full ${displayIsApp ? 'pt-14 pb-0' : 'pt-8 pb-0 md:pt-16 md:pb-0'}`}>
          {displayIsApp ? (
            <div className="flex justify-center mb-5">
              <a href="/app" className="cursor-pointer">
                <Image src="/images/LOGO_01_ChatGPT_S.jpg" alt="X-DIC Logo" width={140} height={70} className="object-contain hover:opacity-90 transition-opacity" priority />
              </a>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-5">
              <div className="flex-shrink-0">
                <a href="/" className="cursor-pointer">
                  <Image src="/images/LOGO_01_ChatGPT_S.jpg" alt="X-DIC Logo" width={140} height={70} className="object-contain hover:opacity-90 transition-opacity" priority />
                </a>
              </div>
              <div className="flex flex-col gap-1 justify-center text-center md:text-left">
                <a href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
                  <h1 className="text-xl md:text-[24px] font-extrabold text-slate-800 leading-tight md:leading-none">한영/영한사전 – 복합어 전문 엑스딕!</h1>
                </a>
                <p className="text-sm md:text-[16px] text-slate-500 font-medium leading-tight mt-1">Korean-English/English-Korean Dictionary – Compound Terminology Dictionary</p>
                <p className="text-[11px] md:text-[12px] text-slate-400 font-normal leading-tight mt-1">* 엑스딕(X-DIC)은 Expert Dictionary의 약자로, 복합어 검색 전문 한영/영한 용어사전입니다.</p>
              </div>
            </div>
          )}
          <div className="w-full">
            <SearchInput initialQuery={displayQuery} isApp={displayIsApp} autoFocus={!displayQuery} />
          </div>
        </header>
      </div>

      <main className="w-full flex-grow">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {displayQuery ? (
            <div className="w-full mt-5">
              {isTooShort ? (
                <div className="py-32 text-center text-slate-400 text-xl font-light italic animate-in fade-in slide-in-from-bottom-2 duration-300">
                  단어는 <span style={{ color: '#ea580c', fontWeight: 'bold' }}>두 글자 이상</span> 입력해 주세요.
                </div>
              ) : displayResults.length > 0 ? (
                <div className="space-y-6">
                  {isPartialMatch && matchedKeywords.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl shadow-sm mb-4 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">💡</span>
                        <div>
                          <p className="text-[14px] md:text-[15px] font-bold text-slate-800 mb-1 leading-snug">
                            입력하신 문장 전체와 정확히 일치하는 용어가 없습니다.
                          </p>
                          <p className="text-[12px] md:text-[13px] text-slate-600">
                            대신, 추출한 핵심 단어 <strong className="text-orange-600">"{matchedKeywords.join(', ')}"</strong> (이)가 포함된 결과를 찾아봤어요!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-sm font-semibold text-slate-500">
                      검색 결과 <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{displayResults.length}</span>건
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
                                  className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm mt-0.5"
                                  title="발음 듣기"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM14 10a4.002 4.002 0 00-1.172-2.828.75.75 0 10-1.06 1.06c.586.586.914 1.378.914 2.207s-.328 1.62-.914 2.207a.75.75 0 101.06 1.06A4.002 4.002 0 0014 10z" /></svg>
                                </button>
                              )}
                              <div className="text-base md:text-lg leading-snug break-keep">{highlightMatch(item.line_text)}</div>
                            </div>
                            <span className="flex-shrink-0 ml-3 px-2 py-0.5 rounded text-xs tracking-tight whitespace-nowrap shadow-sm" style={{ backgroundColor: '#d4b08c', color: '#ffffff', fontWeight: '500' }}>
                              {getCategoryName(item.category_id)}
                            </span>
                          </div>
                        </li>
                        {!displayIsApp && idx === 6 && <AdSensePlaceholder adSlot="8675599033" debugLabel="PC_검색결과_중간" minHeight={200} />}
                      </React.Fragment>
                    ))}
                  </ul>

                  {displayResults.length > itemsPerPage && (
                    <div className="flex justify-center items-center gap-3 mt-12 mb-12 select-none font-sans">
                      <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="text-xs font-bold text-slate-400 hover:text-orange-600 px-2 py-1 rounded transition-colors disabled:opacity-30">&lt;&lt;</button>
                      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="text-sm font-medium text-slate-500 hover:text-orange-600 px-2 py-1 transition-colors disabled:opacity-30">이전</button>
                      <div className="flex items-center gap-2 mx-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number, idx, arr) => (
                          <React.Fragment key={number}>
                            <button onClick={() => handlePageChange(number)} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${currentPage === number ? 'bg-slate-800 text-white font-bold shadow-md transform scale-105' : 'text-slate-400 hover:bg-slate-100'}`}>{number}</button>
                            {idx < arr.length - 1 && <span className="text-[10px] text-slate-300 mx-0.5">•</span>}
                          </React.Fragment>
                        ))}
                      </div>
                      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="text-sm font-medium text-slate-500 hover:text-orange-600 px-2 py-1 transition-colors disabled:opacity-30">다음</button>
                      <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="text-xs font-bold text-slate-400 hover:text-orange-600 px-2 py-1 rounded transition-colors disabled:opacity-30">&gt;&gt;</button>
                    </div>
                  )}
                  
                  {/* 🌟 부분 일치 시 나오는 외부 검색 버튼 추가! */}
                  {isPartialMatch && (
                    <div className="flex flex-col items-center justify-center py-10 mt-8 border-t border-slate-100 text-center px-4">
                      <p className="text-slate-700 text-[15px] font-bold mb-5">
                        '<span style={{ color: '#ea580c' }}>{displayQuery}</span>'에 대해 더 검색을 원하시면, 아래 버튼을 클릭하세요.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                        <button onClick={() => handleExternalSearch('naver')} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#03C75A] hover:bg-[#02b351] text-white rounded-xl font-bold transition-all shadow-sm hover:shadow-md">
                          네이버 사전 검색
                        </button>
                        <button onClick={() => handleExternalSearch('google')} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all shadow-sm hover:shadow-md">
                          Google 검색
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-12 mb-4"><NuanceWidget /></div>
                  {!displayIsApp && <AdSensePlaceholder adSlot="2218001895" debugLabel="PC_검색결과_하단" minHeight={250} />}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4">🤔</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    '<span style={{ color: '#ef4444' }}>{displayQuery}</span>'에 대한 결과가 없습니다.
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-4">
                    <button onClick={() => handleExternalSearch('naver')} className="flex-1 py-3 px-4 bg-[#03C75A] text-white rounded-xl font-bold shadow-sm">네이버 사전 검색</button>
                    <button onClick={() => handleExternalSearch('google')} className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold shadow-sm">Google 검색</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-5 space-y-8 animate-in fade-in duration-500">
              
              <div className="flex flex-wrap items-center justify-end gap-2 -mb-3 md:-mb-5 pr-2 relative z-10">
                <Link href="/conversation" className="group flex items-center gap-1.5 px-4 py-1.5 bg-white border border-blue-200 shadow-sm hover:border-blue-400 hover:shadow-md hover:bg-blue-50 rounded-full text-[12px] md:text-[13px] font-extrabold text-blue-600 hover:text-blue-800 transition-all duration-300">
                  <span className="text-[14px] group-hover:scale-110 transition-transform">📖</span> 
                  <span>필수 영어회화</span>
                </Link>
                <Link href="/notice" className="group flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-md hover:bg-slate-50 rounded-full text-[12px] md:text-[13px] font-extrabold text-slate-600 hover:text-slate-800 transition-all duration-300">
                  <span className="text-[14px] group-hover:scale-110 transition-transform">📢</span> 
                  <span>공지사항 / FAQ</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col h-[260px]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[15px] font-extrabold text-slate-800 flex items-center gap-2"><span className="text-blue-500">🕒</span> 실시간 최근 검색어</h2>
                    <Link href="/recent" className="text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors">
                      더보기 &gt;
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2 overflow-y-auto content-start flex-grow">
                    {recentSearches.length > 0 ? recentSearches.map((item, idx) => (
                      <Link key={idx} href={getSearchUrl(item.word)} className={`px-3 py-1.5 rounded-full border text-[13px] font-bold ${TAG_COLORS[idx % TAG_COLORS.length]}`}>
                        <span className="opacity-50 mr-1">#</span>{item.word}
                      </Link>
                    )) : <div className="text-sm text-slate-400">데이터 수집 중...</div>}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col h-[260px]">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[15px] font-extrabold text-slate-800 flex items-center gap-2"><span className="text-red-500">🔥</span> 인기 검색어 TOP</h2>
                    <Link href="/popular" className="text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors">
                      더보기 &gt;
                    </Link>
                  </div>
                  <ul className="flex-grow overflow-y-auto pr-2 space-y-1">
                    {popularSearches.length > 0 ? popularSearches.map((word, idx) => (
                      <li key={idx}>
                        <Link href={getSearchUrl(word)} className="flex items-center py-2 px-2 hover:bg-slate-50 rounded-lg group">
                          <span className="w-5 h-5 flex items-center justify-center rounded text-[11px] font-bold mr-3 bg-slate-100 text-slate-500">{idx + 1}</span>
                          <span className="text-[14px] text-slate-700 font-medium truncate group-hover:text-blue-600">{word}</span>
                        </Link>
                      </li>
                    )) : <div className="text-sm text-slate-400">데이터 수집 중...</div>}
                  </ul>
                </div>
              </div>

              <article className="bg-slate-50/80 rounded-2xl p-6 md:p-8 border border-slate-200 text-slate-700 shadow-sm mt-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 border-b border-slate-200 pb-4 gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                      <span>📖</span> 엑스딕 필수 영어회화 & 번역가 해설
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">원어민들이 가장 자주 사용하는 핵심 문장과 뉘앙스를 확인하세요.</p>
                  </div>
                  <Link href="/conversation" className="hidden md:flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap">
                    전체 보기 <span>&gt;</span>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 gap-5">
                  {previewData.length > 0 ? previewData.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="bg-slate-800 px-4 py-2">
                        <h3 className="text-sm font-bold text-white">{item.category}</h3>
                      </div>
                      <div className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-3 mb-3">
                          <button onClick={() => handleSpeak(`${item.en_text} ... ${item.ko_text}`)} className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm mt-0.5" title="발음 듣기">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM14 10a4.002 4.002 0 00-1.172-2.828.75.75 0 10-1.06 1.06c.586.586.914 1.378.914 2.207s-.328 1.62-.914 2.207a.75.75 0 101.06 1.06A4.002 4.002 0 0014 10z" /></svg>
                          </button>
                          <div>
                            <h4 className="text-base md:text-lg font-extrabold text-blue-700 mb-0.5">{item.en_text}</h4>
                            <p className="text-sm md:text-base font-bold text-slate-800">{item.ko_text}</p>
                          </div>
                        </div>
                        <div 
                          className="ml-11 bg-slate-100 rounded-lg p-4 border border-slate-200 text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[160px] overflow-y-auto" 
                          style={{ scrollbarWidth: 'thin' }}
                        >
                          <span className="font-extrabold text-blue-700 mr-1.5">💡 해설: </span>{item.description}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-slate-400 text-sm">데이터를 불러오는 중입니다...</div>
                  )}
                </div>

                <div className="mt-6 md:hidden flex justify-center">
                  <Link href="/conversation" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors border border-blue-200 bg-white px-6 py-2 rounded-full shadow-sm">
                    전체 보기 &gt;
                  </Link>
                </div>
              </article>

              <div className="w-full pt-4">
                <NuanceWidget />
              </div>

            </div>
          )}
        </div>
      </main>

      <div className="flex-grow py-[5vh]"></div>
      {!displayIsApp && <div className="flex-none"><Footer /></div>}
    </div>
  );
}