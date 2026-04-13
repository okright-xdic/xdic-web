'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchInput from '@/components/SearchInput';
import Footer from '@/components/Footer';
import PopularKeywords from '@/components/PopularKeywords'; 
import TrendGraph from '@/components/TrendGraph';
import RecentKeywords from '@/components/RecentKeywords'; 
import NuanceWidget from '@/components/NuanceWidget';

export default function PopularPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
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

      <main className="w-full flex-grow">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="md:col-span-2 relative bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-2">
               {/* 🌟 더보기 페이지에서도 데이터가 없다고 징징대면 안 되니까 직통 파이프를 달았습니다! */}
               <PopularKeywords className="min-h-[800px] shadow-none border-0 bg-transparent" />
            </section>

            <aside className="md:col-span-1 space-y-6">
              <div className="relative bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-2">
                <TrendGraph className="border-0 shadow-none bg-transparent" />
              </div>
              <div className="h-[200px] relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50 group cursor-pointer">
                <Image 
                  src="/images/mobile-app-banner-bright.png" 
                  alt="배너" 
                  fill 
                  className="object-contain group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="relative bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-2">
                 <RecentKeywords className="border-0 shadow-none bg-transparent" />
              </div>
            </aside>
          </div>

          <div className="mt-8 mb-4">
            <NuanceWidget />
          </div>

        </div>
      </main>
      <div className="flex-none"><Footer /></div>
    </div>
  );
}