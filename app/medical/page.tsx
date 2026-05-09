import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: '의료진 전용 의학용어 사전 | 엑스딕(X-DIC)',
  description: '간호사, 의사를 위한 실무 최적화 의학용어 검색 서비스입니다.',
};

export default function MedicalPage() {
  // 🌟 검색엔진(SEO)과 사용자를 동시에 잡는 실무 의학용어 핵심 리스트
  const medicalKeywords = [
    "Eosinophil cationic protein",
    "Myocardial Infarction",
    "Sepsis (패혈증)",
    "Hypertension",
    "Chronic Gastritis",
    "Ectopic Pregnancy",
    "Endocrine disorder",
    "Depressive neurosis",
    "Cervical cancer",
    "Drug side effect",
    "Acute appendicitis",
    "Pulmonary embolism",
    "심폐소생술 (CPR)",
    "투약 오류 (Medication error)",
    "활력징후 (Vital signs)"
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* 🌟 스마트 상단 네비게이션 */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-sm bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-full">
            <span>←</span> 메인 홈으로
          </Link>
          <div className="text-[14px] font-black text-slate-800 tracking-tighter">
            <span className="text-blue-600">X</span>-DIC <span className="text-slate-400 ml-1">MEDICAL</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        {/* 히어로 섹션 */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            의학 영어 / 한글 용어 <span className="text-blue-600">100만개</span>
          </h1>
          <p className="mt-4 text-slate-500 font-bold text-lg">
            간호사 · 의사 · 의학논문 번역용 최적화 실무 사전
          </p>
        </div>

        {/* 🛠️ 진짜 모터가 달린 검색바 (form 태그 적용) */}
        <div className="relative max-w-2xl mx-auto mb-16 animate-in fade-in duration-1000">
          {/* form 태그와 action="/" 속성을 사용해 메인 페이지로 쿼리 전달 */}
          <form action="/" method="GET" className="flex items-center w-full h-16 bg-white rounded-2xl border-2 border-blue-500 shadow-xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            <div className="pl-6 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              name="q" // 🌟 매우 중요: 이 이름으로 쿼리가 전달됨 (/?q=검색어)
              placeholder="예: Eosinophil cationic protein / 심근경색"
              className="flex-grow h-full px-4 text-base md:text-lg outline-none font-medium placeholder:text-slate-300 text-slate-800"
              required
              autoComplete="off"
            />
            <button type="submit" className="h-full px-6 md:px-8 bg-blue-600 text-white font-black text-base md:text-lg hover:bg-blue-700 active:bg-blue-800 transition-colors">
              검색
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-400 font-medium">
            [ 🏥 관련 의료 전문 자료 및 실무 용어 검색 최적화 ]
          </p>
        </div>

        {/* 하단 섹션: 텅 빈 박스 대신 실제 검색어 링크들 배치 (SEO + UX 극대화) */}
        <div className="grid grid-cols-1 gap-12 mt-10">
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2 mb-6">
              <span className="text-red-500">📈</span> 병원 실무 다빈도 검색 용어
            </h2>
            <div className="bg-slate-50/80 rounded-3xl p-6 md:p-8 border border-slate-200">
              <div className="flex flex-wrap gap-2.5">
                {medicalKeywords.map((keyword, index) => {
                  // 검색어에서 괄호 부분은 빼고 실제 검색할 단어만 추출
                  const queryParam = keyword.split('(')[0].trim();
                  
                  return (
                    <Link 
                      key={index}
                      href={`/?q=${encodeURIComponent(queryParam)}`}
                      className="inline-block px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm md:text-base font-bold rounded-full hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all duration-300"
                    >
                      # {keyword}
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}