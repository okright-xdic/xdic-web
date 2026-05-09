'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-50 pb-12 text-[13px] text-slate-500 font-light leading-relaxed">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* 파란색 라인: About/Contact 바로 위에 밀착 */}
        <div className="w-full border-t-[1.5px] border-blue-700 mt-0 mb-3"></div>

        <div className="flex flex-col gap-0.5">
          
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[16px] font-bold text-slate-700 block">
              About / Contact
            </span>
            
            <div className="flex items-center gap-2">
              <Link 
                href="/conversation" 
                className="text-[12px] font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors border border-blue-200 bg-white shadow-sm flex items-center gap-1"
              >
                <span>📖</span> 필수 영어회화
              </Link>
              <Link 
                href="/notice" 
                className="text-[12px] font-bold text-slate-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors border border-slate-200 bg-white shadow-sm flex items-center gap-1"
              >
                <span>📢</span> 공지사항 / FAQ
              </Link>
              {/* 🌟 새로 추가된 시각적 사이트맵 버튼 */}
              <Link 
                href="/sitemap" 
                className="text-[12px] font-bold text-slate-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors border border-slate-200 bg-white shadow-sm flex items-center gap-1"
              >
                <span>🗺️</span> 사이트맵
              </Link>
            </div>
          </div>

          <p className="flex flex-wrap items-center gap-x-1">
            <span className="font-bold text-slate-600 text-[12px]">상호명</span> : 케이제이트랜스
            <span className="text-slate-300 px-1">|</span>
            <span className="font-bold text-slate-600 text-[12px]">대표</span> : 장태훈
          </p>
          
          <p className="flex flex-wrap items-center gap-x-1">
            <span className="font-bold text-slate-600 text-[12px]">주소</span> : 광주광역시 서구 화정로 280번길 9-1
            <span className="text-slate-300 px-1">|</span>
            <span className="font-bold text-slate-600 text-[12px]">사업자등록 번호</span> : 408-90-79721
          </p>

          <div className="flex flex-wrap items-center gap-x-1">
            <span className="font-bold text-slate-600 text-[12px]">통신판매등록번호</span> : 2018-광주서구-0127
            <span className="text-slate-300 px-1">|</span>
            <span className="font-bold text-slate-600 text-[12px]">이메일</span> : zzangth@gmail.com
            
            <span className="text-slate-300 px-1">|</span>
            
            <div className="flex items-center gap-2 font-medium text-slate-600 text-[12px]">
              <a 
                href="/docs/terms_ko.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 hover:underline underline-offset-4 transition-colors"
              >
                이용약관 및 개인정보처리방침(한글)
              </a>
              <span className="text-slate-300">/</span>
              <a 
                href="/docs/terms_en.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 hover:underline underline-offset-4 transition-colors"
              >
                이용약관 및 개인정보처리방침(영어)
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 text-slate-400 text-[11px]">
           © 2026 X-DIC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}