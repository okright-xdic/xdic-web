'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchInput from '@/components/SearchInput';
import Footer from '@/components/Footer';
import PopularKeywords from '@/components/PopularKeywords';
import TrendGraph from '@/components/TrendGraph';
import AdSensePlaceholder from '@/components/ads/AdSensePlaceholder';

// 🌟 메인 위젯과 완벽하게 동일한 열쇠(Key) 사용!
const RECENT_KEY = 'xdic_recent_searches_v2';
const UPDATED_EVENT = 'xdic_recent_searches_updated';

// 🎨 17가지 파스텔톤 캔디 컬러 팔레트
const COLOR_PALETTES = [
  'bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:border-red-200',
  'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100 hover:border-orange-200',
  'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100 hover:border-amber-200',
  'bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-100 hover:border-yellow-200',
  'bg-lime-50 text-lime-600 border-lime-100 hover:bg-lime-100 hover:border-lime-200',
  'bg-green-50 text-green-600 border-green-100 hover:bg-green-100 hover:border-green-200',
  'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200',
  'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100 hover:border-teal-200',
  'bg-cyan-50 text-cyan-600 border-cyan-100 hover:bg-cyan-100 hover:border-cyan-200',
  'bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-100 hover:border-sky-200',
  'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:border-blue-200',
  'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200',
  'bg-violet-50 text-violet-600 border-violet-100 hover:bg-violet-100 hover:border-violet-200',
  'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100 hover:border-purple-200',
  'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100 hover:bg-fuchsia-100 hover:border-fuchsia-200',
  'bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100 hover:border-pink-200',
  'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 hover:border-rose-200',
];

interface RecentKeyword {
  keyword: string;
  count?: number;
}

export default function RecentPage() {
  const [recentKeywords, setRecentKeywords] = useState<RecentKeyword[]>([]);
  const router = useRouter();

  const loadKeywords = () => {
    const saved = localStorage.getItem(RECENT_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentKeywords(parsed);
        }
      } catch (e) {
        console.error('Parsing Error', e);
      }
    } else {
      setRecentKeywords([]);
    }
  };

  useEffect(() => {
    loadKeywords();
    
    // 다른 컴포넌트(위젯 등)에서 검색어가 업데이트되면 이 페이지도 즉시 새로고침!
    window.addEventListener(UPDATED_EVENT, loadKeywords);
    return () => {
      window.removeEventListener(UPDATED_EVENT, loadKeywords);
    };
  }, []);

  const handleSearch = (text: string) => {
    router.push(`/?q=${encodeURIComponent(text)}`);
  };

  const handleDelete = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    const newKeywords = recentKeywords.filter((k) => k.keyword !== text);
    setRecentKeywords(newKeywords);
    localStorage.setItem(RECENT_KEY, JSON.stringify(newKeywords));
    // 삭제 후 다른 위젯들에도 알려줌
    window.dispatchEvent(new Event(UPDATED_EVENT));
  };

  const handleClearAll = () => {
    if (confirm('정말 모든 검색 기록을 삭제하시겠습니까?')) {
      setRecentKeywords([]);
      localStorage.removeItem(RECENT_KEY);
      // 삭제 후 다른 위젯들에도 알려줌
      window.dispatchEvent(new Event(UPDATED_EVENT));
    }
  };

  const getColorClass = (word: string) => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = word.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % COLOR_PALETTES.length);
    return COLOR_PALETTES[index];
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* 1. 공통 헤더 */}
      <div className="flex-none w-full max-w-4xl mx-auto px-4 md:px-6">
        <header className="w-full pt-8 pb-2 md:pt-16 md:pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 md:mb-8">
            <div className="flex-shrink-0">
              <Link href="/" className="cursor-pointer">
                <Image src="/images/LOGO_01_ChatGPT_S.jpg" alt="Logo" width={140} height={70} className="object-contain hover:opacity-90 transition-opacity" priority />
              </Link>
            </div>
            <div className="flex flex-col gap-1 justify-center text-center md:text-left">
              <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
                <h1 className="text-xl md:text-[24px] font-extrabold text-slate-800 leading-tight">
                  한영/영한사전 – 복합어 전문 엑스딕(X-DIC)!
                </h1>
              </Link>
              <p className="text-sm text-slate-500 font-medium">Korean-English/English-Korean dictionary</p>
            </div>
          </div>
          <div className="w-full"><SearchInput /></div>
        </header>
      </div>

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="w-full flex-grow">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-8 pb-20">
          
          {/* ======================================================== */}
          {/* [섹션 1: 주인공] 최근 검색어 */}
          {/* ======================================================== */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-200 mt-4 relative overflow-hidden min-h-[300px]">
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -z-10 opacity-50"></div>

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="text-2xl">🕒</span> 최근 검색어 <span className="text-sm font-normal text-slate-400">({recentKeywords.length})</span>
              </h2>
              {recentKeywords.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="text-sm text-slate-400 hover:text-red-500 underline decoration-slate-200 underline-offset-4 transition-colors"
                >
                  기록 전체 삭제
                </button>
              )}
            </div>

            {recentKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {recentKeywords.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleSearch(item.keyword)}
                    className={`
                      group flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5
                      ${getColorClass(item.keyword)}
                    `}
                  >
                    <span className="font-bold text-sm md:text-base"># {item.keyword}</span>
                    
                    {item.count && item.count > 1 && (
                      <span className="text-xs font-extrabold opacity-70">
                        (x{item.count})
                      </span>
                    )}

                    <button 
                      onClick={(e) => handleDelete(e, item.keyword)}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/20 text-current transition-colors ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <div className="text-4xl opacity-20 mb-3">💬</div>
                <p className="text-slate-500 font-medium">아직 검색 기록이 없습니다.</p>
                <p className="text-slate-400 text-sm mt-1">궁금한 단어를 검색해보세요!</p>
              </div>
            )}
          </section>

          {/* ======================================================== */}
          {/* [섹션 2] 나머지 친구들 (광고 + 인기 + 트렌드 + 배너) */}
          {/* ======================================================== */}
          
          {/* PC_최신검색어_더보기_중간 */}
          <AdSensePlaceholder
            adSlot="2840187537"
            debugLabel="PC_최신검색어_더보기_중간"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 인기 검색어 */}
            <div className="md:col-span-2">
               <div className="flex items-center gap-2 mb-3 px-2">
                  <span className="text-xl">🔥</span>
                  <h3 className="text-lg font-bold text-slate-700">함께 많이 찾는 검색어</h3>
               </div>
               <PopularKeywords className="min-h-[400px] border-blue-100 shadow-sm" />
            </div>

            {/* 트렌드 그래프 */}
            <div className="md:col-span-1">
               <h3 className="text-lg font-bold text-slate-700 mb-3 px-2">📈 검색어 트렌드</h3>
               <TrendGraph />
            </div>

            {/* 앱 배너 */}
            <div className="md:col-span-1 h-[250px] relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50 group cursor-pointer">
              <Image 
                src="/images/mobile-app-banner-bright.png" 
                alt="배너" 
                fill 
                className="object-contain group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            
          </div>

        </div>
      </main>

      <div className="flex-none"><Footer /></div>
    </div>
  );
}