'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchInput from '@/components/SearchInput';
import Footer from '@/components/Footer';
import PopularKeywords from '@/components/PopularKeywords';
import RecentKeywords from '@/components/RecentKeywords';
import TrendGraph from '@/components/TrendGraph';
import AdSensePlaceholder from '@/components/ads/AdSensePlaceholder';
// 🌟 뉘앙스 위젯 불러오기!
import NuanceWidget from '@/components/NuanceWidget';

export default function TrendPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-none w-full max-w-4xl mx-auto px-4 md:px-6">
        <header className="w-full pt-8 pb-2 md:pt-16 md:pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 md:mb-8">
            <div className="flex-shrink-0">
              <Link href="/" className="cursor-pointer">
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

      <main className="w-full flex-grow">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <section className="mt-4 w-full">
            <div style={{ height: '400px', width: '100%' }} className="relative">
              <TrendGraph className="w-full h-full shadow-md border border-slate-200" />
            </div>
          </section>

          {/* 🌟 광고 바로 위 구원투수: 뉘앙스 위젯 배치! */}
          <div className="mt-8 mb-4">
            <NuanceWidget />
          </div>

          <div className="my-6">
            <AdSensePlaceholder
              adSlot="9488087447"
              debugLabel="PC_주간트랜드_더보기_중간"
            />
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
            <div className="h-[180px] relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
              <Image src="/images/mobile-app-banner-bright.png" alt="배너" fill className="object-contain" />
            </div>
            <RecentKeywords />
            <div className="md:col-span-2">
               <PopularKeywords />
            </div>
          </section>

        </div>
      </main>

      <div className="flex-none"><Footer /></div>
    </div>
  );
}