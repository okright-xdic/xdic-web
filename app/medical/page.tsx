import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: '의료진 전용 의학용어 사전 | 엑스딕(X-DIC)',
  description: '간호사, 의사를 위한 실무 최적화 의학용어 검색 서비스입니다.',
};

export default function MedicalPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 🌟 스마트 상단 네비게이션 추가 */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-sm">
            <span>←</span> 홈으로 돌아가기
          </Link>
          <div className="text-[13px] font-black text-slate-800 tracking-tighter">
            <span className="text-blue-600">X</span>-DIC <span className="text-slate-300 ml-1">MEDICAL</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        {/* 히어로 섹션 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            의학 영어 / 한글 용어 <span className="text-blue-600">100만개</span>
          </h1>
          <p className="mt-4 text-slate-500 font-bold text-lg">
            간호사 · 의사 · 의학논문 번역용 최적화 실무 사전
          </p>
        </div>

        {/* 🛠️ 정렬이 완벽해진 검색바 */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="flex items-center w-full h-16 bg-white rounded-2xl border-2 border-blue-500 shadow-xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            <div className="pl-6 text-slate-400">
              {/* 돋보기 아이콘: 정확히 인풋 왼쪽에 위치 */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="예: myocardial infarction / 심근경색"
              className="flex-grow h-full px-4 text-lg outline-none font-medium placeholder:text-slate-300"
            />
            <button className="h-full px-8 bg-blue-600 text-white font-black hover:bg-blue-700 transition-colors">
              검색
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-slate-400 font-medium">
            [ 🏥 관련 의료 전문 자료 / 추천 정보 수신 중 ]
          </p>
        </div>

        {/* 하단 섹션들 */}
        <div className="grid grid-cols-1 gap-12 mt-10">
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-6">
              <span className="text-red-500">📈</span> 병원 실무 다빈도 검색 용어
            </h2>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 min-h-[100px] flex items-center justify-center italic text-slate-400">
              데이터를 불러오는 중입니다...
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}