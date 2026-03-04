'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchInput from '@/components/SearchInput';
import Footer from '@/components/Footer';
import PopularKeywords from '@/components/PopularKeywords'; // 진짜 인기 검색어 컴포넌트
import TrendGraph from '@/components/TrendGraph';
import AdSensePlaceholder from '@/components/ads/AdSensePlaceholder'; // 경로수정
import RecentKeywords from '@/components/RecentKeywords'; // 우측 사이드바용

export default function PopularPage() {
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* [좌측 메인] 실시간 인기 검색어 Top 100 */}
            <section className="md:col-span-2 space-y-4">
               <div className="flex items-center gap-2 px-2">
                  <span className="text-2xl">🔥</span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-800">
                     실시간 인기 검색어 <span className="text-blue-600">Top 100</span>
                  </h2>
               </div>
               
               {/* 인기 검색어 리스트를 길게 보여주는 역할 */}
               <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-2">
                 <PopularKeywords className="min-h-[800px] shadow-none border-0" />
               </div>
            </section>

            {/* [우측 사이드] 부가 정보 (트렌드, 배너, 최근검색어) */}
            <aside className="md:col-span-1 space-y-6">
              
              {/* 1. 트렌드 그래프 */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 mb-2 px-1">📈 검색어 트렌드</h3>
                <TrendGraph />
              </div>

              {/* 2. 광고 배너 */}
              <div className="h-[200px] relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50 group cursor-pointer">
                <Image 
                  src="/images/mobile-app-banner-bright.png" 
                  alt="배너" 
                  fill 
                  className="object-contain group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              {/* 3. 내 검색 기록 (작게 표시) */}
              <div>
                 <h3 className="text-sm font-bold text-slate-500 mb-2 px-1">🕒 내 검색 기록</h3>
                 <RecentKeywords className="border-slate-100 shadow-none bg-slate-50" />
              </div>

            </aside>
          </div>

{/* PC_인기검색어_더보기_하단 */}
<AdSensePlaceholder
  adSlot="5466350874"
  debugLabel="PC_인기검색어_더보기_하단"
/>

        </div>
      </main>

      <div className="flex-none"><Footer /></div>
    </div>
  );
}