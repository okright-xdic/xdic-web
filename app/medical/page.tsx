'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Stethoscope, BookOpen, Activity } from 'lucide-react';

export default function MedicalPage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // 검색 시 엑스딕 공통 검색 결과 페이지로 이동하되, 의학용어를 검색했음을 인지
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // 🔥 구글 검색엔진 로봇(SEO)과 의료진을 유혹할 핵심 의학 용어 TOP 20
  const topMedicalTerms = [
    'Myocardial Infarction', '심근경색', 'Hypertension', '고혈압',
    'Diabetes Mellitus', '당뇨병', 'Pneumonia', '폐렴',
    'Sepsis', '패혈증', 'Anemia', '빈혈',
    'Arrhythmia', '부정맥', 'Asthma', '천식',
    'Cerebral Infarction', '뇌경색', 'Tuberculosis', '결핵'
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-16 px-4 pb-20">
      
      {/* 상단 타이틀 영역 (의료진 타겟팅) */}
      <div className="max-w-3xl w-full text-center space-y-4 mb-10">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-blue-100 rounded-full text-blue-600">
            <Stethoscope size={48} />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          의학 영어/한글 용어 <span className="text-blue-600">100만개</span>
        </h1>
        <p className="text-lg text-slate-600 font-medium">
          간호사 · 의사 · 의학논문 번역용 최적화 실무 사전
        </p>
      </div>

      {/* 의료 전용 검색창 */}
      <div className="max-w-2xl w-full mb-12">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-blue-100 bg-white shadow-sm text-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            placeholder="예: myocardial infarction / 심근경색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            검색
          </button>
        </form>
      </div>

      {/* 카카오 애드핏 / 애드센스 광고 Placeholder (수익의 핵심) */}
      <div className="max-w-2xl w-full mb-12 text-center">
        <p className="text-xs text-slate-400 mb-2 font-medium">📌 관련 의료 전문 자료 / 추천 정보</p>
        <div className="w-full h-[100px] bg-slate-200 border border-slate-300 rounded-lg flex items-center justify-center text-slate-500 text-sm">
          {/* 실제로는 여기에 애드센스나 카카오 핏 코드가 들어갑니다 */}
          [ 🏥 의료 전문 타겟팅 광고 영역 (클릭률 2~5배 상승 존) ]
        </div>
      </div>

      {/* SEO 트래픽 폭발을 위한 '실무에서 자주 찾는 용어' 링크 그리드 */}
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
          <Activity className="text-red-500" size={24} />
          <h2 className="text-xl font-bold text-slate-800">병원 실무 다빈도 검색 용어</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topMedicalTerms.map((term, index) => (
            <button
              key={index}
              onClick={() => router.push(`/term/${encodeURIComponent(term)}`)}
              className="flex items-center space-x-2 p-3 rounded-lg hover:bg-blue-50 text-left border border-transparent hover:border-blue-100 transition-colors group"
            >
              <BookOpen size={16} className="text-slate-400 group-hover:text-blue-500" />
              <span className="text-slate-700 font-medium group-hover:text-blue-700 truncate">
                {term}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}