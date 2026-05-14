'use client'; // 🌟 상태 관리를 위해 클라이언트 컴포넌트로 전환

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MedicalPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [myHistory, setMyHistory] = useState<string[]>([]);

  // 1. 페이지 로드 시 기존 '보물창고' 기록 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('xdic_medical_treasure');
    if (saved) {
      setMyHistory(JSON.parse(saved));
    }
  }, []);

  // 2. 검색 실행 및 로컬 기록 저장 함수
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // 보물창고에 추가 (중복 제거 및 최신순 정렬)
    const updatedHistory = [query.trim(), ...myHistory.filter(h => h !== query.trim())].slice(0, 20);
    setMyHistory(updatedHistory);
    localStorage.setItem('xdic_medical_treasure', JSON.stringify(updatedHistory));

    // 메인 검색 결과 페이지로 이동 (전역 라이브 검색에는 영향을 주지 않음)
    router.push(`/?q=${encodeURIComponent(query.trim())}`);
  };

  // 🌟 고정 추천 키워드 (SEO용)
  const recommendedKeywords = [
    "Eosinophil cationic protein",
    "Myocardial Infarction",
    "Sepsis (패혈증)",
    "Hypertension",
    "Chronic Gastritis",
    "심폐소생술 (CPR)",
    "투약 오류 (Medication error)",
    "활력징후 (Vital signs)",
    "안구건조증",
    "xerophthalmia",
    "propylthiouracil",
    "갑상선기능항진증 치료",
    "이상 호르몬 수치",
    "EP Ectopic Pregnancy",
    "당뇨망막병증 diabetic retinopathy",
    "류마티스관절염 rheumatoid arthritis",
    "마비성 장폐색증 Paralytic ileus",
    "만성췌장염 chronic pancreatitis",
    "면역학적 이상소견 Abnormal immunological findings",
    "무릎관절증 Gonarthrosis[arthrosis of knee]",
    "바이러스성 인두결막염 Viral pharyngoconjunctivitis",
    "복부 방선균증 Abdominal actinomycosis",
    "부신수질기능 항진증 hyperfunction of the adrenal medulla",
    "비뇨생식기의 편모충증 Urogenital trichomoniasis",
    "비만 세포 백혈병 Mast cell leukaemia",
    "선양낭성암종 adenoid cystic carcinoma",
    "선천성심질환 congenital heart disease",
    "신경절교신경종 ganglioglioneuroma",
    "심실성 빈맥 ventricular tachycardia",
    "요도조임근 urethral sphincter",
    "장협착확장술 enteroplasty",
    "척추전방전위증 spondylolisthesis",
    "파상풍 백신 Tetanus vaccine",
    "폐쇄성폐질환 obstructive pulmonary disease",
    "혈관모세포성수막종 angioblastic meningioma"
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* 스마트 상단 네비게이션 */}
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
        {/* 히어로 섹션: '전용 검색'으로 문구 수정 */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            의학 영어 / 한글 용어 <span className="text-blue-600">전용 검색</span>
          </h1>
          <p className="mt-4 text-slate-500 font-bold text-lg">
            간호사 · 의사 · 의학논문 번역용 최적화 실무 사전
          </p>
        </div>

        {/* 🛠️ 스마트 검색바: 엔터 및 로컬 기록 연동 */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="flex items-center w-full h-16 bg-white rounded-2xl border-2 border-blue-500 shadow-xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            <div className="pl-6 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="예: myocardial infarction / 심근경색"
              className="flex-grow h-full px-4 text-base md:text-lg outline-none font-medium text-slate-800"
              autoComplete="off"
            />
            <button type="submit" className="h-full px-6 md:px-8 bg-blue-600 text-white font-black text-base md:text-lg hover:bg-blue-700 transition-colors">
              검색
            </button>
          </form>
          <p className="mt-4 text-center text-[11px] md:text-xs text-slate-400 font-medium">
             📌 이곳에서 검색한 단어는 아래 나만의 보물창고에만 안전하게 기록됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 mt-10">
          {/* 🎁 나만의 보물창고 (로컬 기록) */}
          <section className="animate-in fade-in duration-700">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4">
              <span className="text-xl">🎁</span> 나만의 의학용어 보물창고
            </h2>
            <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 shadow-inner min-h-[120px]">
              {myHistory.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {myHistory.map((item, i) => (
                    <Link 
                      key={i} 
                      href={`/?q=${encodeURIComponent(item)}`}
                      className="px-4 py-2 bg-white border border-blue-200 text-blue-600 text-sm font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      {item}
                    </Link>
                  ))}
                  <button 
                    onClick={() => { if(confirm('보물창고를 비울까요?')) { setMyHistory([]); localStorage.removeItem('xdic_medical_treasure'); }}}
                    className="px-3 py-2 text-slate-400 hover:text-red-500 text-[11px] font-bold"
                  >
                    [비우기]
                  </button>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm italic py-4">
                  아직 보물이 없네요. 위에서 의학용어를 검색해 보세요!
                </div>
              )}
            </div>
          </section>

          {/* 📈 추천 검색어 (기존 SEO용) */}
          <section>
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4">
              <span className="text-red-500 text-xl">📈</span> 추천 의학 실무 용어
            </h2>
            <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200">
              <div className="flex flex-wrap gap-2">
                {recommendedKeywords.map((keyword, index) => (
                  <Link 
                    key={index}
                    href={`/?q=${encodeURIComponent(keyword.split('(')[0].trim())}`}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-full hover:border-blue-300 hover:text-blue-600 transition-all"
                  >
                    # {keyword}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}