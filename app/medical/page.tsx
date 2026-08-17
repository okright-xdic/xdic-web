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

  // ☆ TwoPro Medical Hub v3
  // 아래 묶음은 새로운 의학 지식을 생성한 것이 아니라,
  // 위 recommendedKeywords에 이미 존재하는 검색어를 탐색용으로 재배치한 것입니다.
  const medicalTopicGroups = [
    {
      id: 'disease-diagnosis',
      icon: '🫀',
      title: '질환·진단 검색 예시',
      description: '질환명과 진단 관련 용어를 한글·영어로 이어서 검색해 보세요.',
      terms: [
        { label: 'Myocardial Infarction', query: 'Myocardial Infarction' },
        { label: 'Sepsis · 패혈증', query: 'Sepsis' },
        { label: 'Hypertension', query: 'Hypertension' },
        { label: 'Chronic Gastritis', query: 'Chronic Gastritis' },
        { label: '당뇨망막병증 · diabetic retinopathy', query: '당뇨망막병증' },
        { label: '류마티스관절염 · rheumatoid arthritis', query: '류마티스관절염' },
      ],
    },
    {
      id: 'tests-findings',
      icon: '🧪',
      title: '검사·소견 검색 예시',
      description: '검사, 관찰, 소견과 관련된 표현을 X-DIC 검색 결과에서 비교해 보세요.',
      terms: [
        { label: 'Eosinophil cationic protein', query: 'Eosinophil cationic protein' },
        { label: '활력징후 · Vital signs', query: '활력징후' },
        { label: '이상 호르몬 수치', query: '이상 호르몬 수치' },
        { label: '면역학적 이상소견', query: '면역학적 이상소견' },
      ],
    },
    {
      id: 'medication-treatment',
      icon: '💊',
      title: '약물·투약·치료 검색 예시',
      description: '약물명, 투약, 치료 관련 검색어를 한영·영한 데이터와 함께 살펴보세요.',
      terms: [
        { label: '투약 오류 · Medication error', query: '투약 오류' },
        { label: 'propylthiouracil', query: 'propylthiouracil' },
        { label: '파상풍 백신 · Tetanus vaccine', query: '파상풍 백신' },
        { label: '갑상선기능항진증 치료', query: '갑상선기능항진증 치료' },
      ],
    },
    {
      id: 'anatomy-procedure',
      icon: '🦴',
      title: '해부·처치 관련 검색 예시',
      description: '해부학적 명칭과 처치·수술 관련 용어를 검색해 관련 표현을 확인해 보세요.',
      terms: [
        { label: '심폐소생술 · CPR', query: '심폐소생술' },
        { label: '요도조임근 · urethral sphincter', query: '요도조임근' },
        { label: '장협착확장술 · enteroplasty', query: '장협착확장술' },
        { label: '척추전방전위증 · spondylolisthesis', query: '척추전방전위증' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ================================================================
          ☆ TwoPro Medical Hub v2
          기존 검색/보물창고/추천 키워드 기능은 그대로 유지하고,
          검색하지 않아도 읽을 수 있는 의학 전문용어 콘텐츠 허브를 추가합니다.
         ================================================================ */}

      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-[11px] md:text-xs bg-slate-50 hover:bg-blue-50 px-2.5 py-1 rounded-full"
          >
            <span>←</span> 메인으로 <span className="text-slate-400 font-semibold">· Home</span>
          </Link>
          <div className="text-[12px] md:text-[13px] font-black text-slate-800 tracking-tighter">
            <span className="text-blue-600">X</span>-DIC
            <span className="text-slate-400 ml-1">MEDICAL</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-14 md:pt-16 pb-16">
        <section className="text-center mb-3 md:mb-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <p className="text-[9px] md:text-[10px] font-extrabold tracking-[0.12em] text-blue-600 uppercase mb-1">
            X-DIC Medical Terminology
          </p>

          <h1 className="text-[24px] md:text-[30px] font-black text-slate-900 leading-tight tracking-tight">
            의학용어 전문 검색
            <span className="ml-1.5 text-[11px] md:text-[13px] font-bold text-blue-600 align-middle">
              Medical
            </span>
          </h1>

          <p className="mt-1.5 text-[10px] md:text-[12px] font-bold tracking-tight">
            <span className="text-blue-600">Ko-En</span><span className="text-slate-400"> / </span><span className="text-emerald-600">En-Ko</span><span className="text-slate-500"> Terminology</span>
          </p>

          <p className="max-w-3xl mx-auto mt-2 text-[11px] md:text-[12.5px] text-slate-500 leading-5 md:leading-[1.65] break-keep">
            X-DIC 의학용어 허브는 의학 논문, 병원 실무, 간호 및 건강 분야에서 접하는
            영어·한국어 전문용어를 한영·영한 사전 데이터와 연결해 탐색할 수 있도록 구성했습니다.
            질환·진단, 검사·소견, 약물·투약, 해부·처치 관련 용어와 병렬 검색 결과를 함께 확인할 수 있습니다.
          </p>
        </section>

        <section aria-labelledby="medical-search-title" className="mb-4 md:mb-5">
          <h2 id="medical-search-title" className="sr-only">
            의학용어 한영·영한 검색
          </h2>

          <div className="relative max-w-2xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full h-12 md:h-14 bg-white rounded-xl border border-blue-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 transition-all"
            >
              <div className="pl-4 md:pl-5 text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="예: myocardial infarction / 심근경색"
                className="flex-grow min-w-0 h-full px-3 md:px-4 text-sm md:text-base outline-none font-medium text-slate-800"
                autoComplete="off"
              />

              <button
                type="submit"
                className="h-full px-5 md:px-6 bg-blue-600 text-white font-black text-sm md:text-base hover:bg-blue-700 transition-colors"
              >
                검색
              </button>
            </form>

            <p className="mt-1.5 text-center text-[10px] md:text-[11px] text-slate-400 font-medium">
              검색어는 이 브라우저의 ‘나만의 의학용어 보물창고’에 저장됩니다.
            </p>
          </div>
        </section>

        {/* 검색 없이 읽을 수 있는 정적 콘텐츠 */}
        <section aria-labelledby="medical-guide-title" className="mb-3.5 md:mb-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 md:p-4">
            <div className="mb-2.5">
              <p className="text-[9px] md:text-[10px] font-bold text-sky-600 mb-1">
                Medical Terminology Guide
              </p>
              <h2
                id="medical-guide-title"
                className="text-[16px] md:text-[18px] font-black text-slate-900 leading-tight"
              >
                X-DIC에서 의학용어를 찾는 방법
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <article className="rounded-lg bg-white border border-slate-200 px-3 py-2.5 md:px-3.5 md:py-3">
                <h3 className="font-extrabold text-slate-900 text-[12px] md:text-[13px] mb-1">
                  ① 한글·영어 용어 검색
                </h3>
                <p className="text-[10.5px] md:text-[11.5px] text-slate-600 leading-[1.5]">
                  질환명, 검사명, 처치명, 약물명 등 알고 싶은 용어를 한글 또는 영어로 입력하면
                  X-DIC 메인 검색 결과에서 관련 전문용어와 병렬 데이터를 확인할 수 있습니다.
                </p>
              </article>

              <article className="rounded-lg bg-white border border-slate-200 px-3 py-2.5 md:px-3.5 md:py-3">
                <h3 className="font-extrabold text-slate-900 text-[12px] md:text-[13px] mb-1">
                  ② 한영·영한 표현 함께 확인
                </h3>
                <p className="text-[10.5px] md:text-[11.5px] text-slate-600 leading-[1.5]">
                  한 개의 표제어만 보는 대신 검색어가 포함된 한영·영한 데이터와 실제 문장형 결과를
                  함께 살펴보면 용어가 어떤 문맥에서 쓰이는지 비교하기 쉽습니다.
                </p>
              </article>

              <article className="rounded-lg bg-white border border-slate-200 px-3 py-2.5 md:px-3.5 md:py-3">
                <h3 className="font-extrabold text-slate-900 text-[12px] md:text-[13px] mb-1">
                  ③ 관련 용어까지 이어서 탐색
                </h3>
                <p className="text-[10.5px] md:text-[11.5px] text-slate-600 leading-[1.5]">
                  추천 의학 실무 용어를 통해 질환·검사·처치·해부학 등 주변 개념으로 검색을 확장할 수 있습니다.
                </p>
              </article>

              <article className="rounded-lg bg-white border border-slate-200 px-3 py-2.5 md:px-3.5 md:py-3">
                <h3 className="font-extrabold text-slate-900 text-[12px] md:text-[13px] mb-1">
                  ④ 개인 검색 기록 활용
                </h3>
                <p className="text-[10.5px] md:text-[11.5px] text-slate-600 leading-[1.5]">
                  이 페이지에서 검색한 최근 의학용어는 현재 브라우저의 보물창고에 저장되어
                  다시 찾아보기 쉽도록 도와줍니다.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 대표 분야 */}
        <section aria-labelledby="medical-fields-title" className="mb-3.5 md:mb-4">
          <div className="flex items-end justify-between gap-2 mb-2.5">
            <div>
              <p className="text-[9px] md:text-[10px] font-bold text-blue-600 mb-1">
                Explore by field
              </p>
              <h2 id="medical-fields-title" className="text-[15px] md:text-[17px] font-black text-slate-900 leading-tight">
                대표 의학용어 분야
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              ['🫀', '질환·진단', '심근경색, 고혈압, 패혈증 등', '#disease-diagnosis'],
              ['🧪', '검사·소견', '활력징후, 면역학적 이상소견 등', '#tests-findings'],
              ['💊', '약물·투약', '투약 오류, 백신, 약물명 등', '#medication-treatment'],
              ['🦴', '해부·처치', '관절, 척추, 수술·처치 관련 용어', '#anatomy-procedure'],
            ].map(([icon, title, desc, href]) => (
              <a
                key={title}
                href={href}
                className="group rounded-xl border border-slate-200 bg-white px-2.5 py-2.5 md:px-3 md:py-3 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
              >
                <div className="text-base md:text-lg mb-1" aria-hidden="true">{icon}</div>
                <h3 className="font-extrabold text-slate-900 text-[11.5px] md:text-[12.5px] mb-0.5 group-hover:text-blue-700 transition-colors">
                  {title}
                </h3>
                <p className="text-[9.5px] md:text-[10.5px] text-slate-500 leading-snug">{desc}</p>
                <p className="mt-1.5 text-[9px] md:text-[10px] font-bold text-blue-600">
                  대표 검색어 보기 ↓
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* 분야별 실제 검색 진입점 */}
        <section aria-labelledby="medical-topic-terms-title" className="mb-5 md:mb-6">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-indigo-600 mb-1">
              Browse Medical Search Examples
            </p>
            <h2
              id="medical-topic-terms-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              분야별 대표 검색어
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed">
              아래 용어는 X-DIC 의학용어 페이지에 이미 준비된 추천 검색어를 분야별로 다시 정리한 것입니다.
              원하는 용어를 누르면 메인 검색 결과에서 관련 전문용어와 병렬 데이터를 이어서 확인할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {medicalTopicGroups.map((group) => (
              <article
                key={group.id}
                id={group.id}
                className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl" aria-hidden="true">{group.icon}</div>
                  <div className="min-w-0">
                    <h3 className="text-sm md:text-base font-extrabold text-slate-900">
                      {group.title}
                    </h3>
                    <p className="mt-1 text-[11px] md:text-[12px] text-slate-500 leading-relaxed">
                      {group.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {group.terms.map((term) => (
                    <Link
                      key={`${group.id}-${term.label}`}
                      href={`/?q=${encodeURIComponent(term.query)}`}
                      className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-[11px] md:text-[12px] font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      {term.label}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 md:gap-6">
          {/* 나만의 보물창고 */}
          <section aria-labelledby="medical-treasure-title" className="animate-in fade-in duration-700">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 id="medical-treasure-title" className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2">
                <span className="text-xl">🎁</span> 나만의 의학용어 보물창고
              </h2>
              {myHistory.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('보물창고를 비울까요?')) {
                      setMyHistory([]);
                      localStorage.removeItem('xdic_medical_treasure');
                    }
                  }}
                  className="text-slate-400 hover:text-red-500 text-[11px] font-bold"
                >
                  비우기
                </button>
              )}
            </div>

            <div className="bg-blue-50/40 rounded-2xl p-4 md:p-5 border border-blue-100 min-h-[82px]">
              {myHistory.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {myHistory.map((item, i) => (
                    <Link
                      key={i}
                      href={`/?q=${encodeURIComponent(item)}`}
                      className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 text-[12px] md:text-sm font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center text-slate-400 text-[12px] md:text-sm italic py-3">
                  아직 저장된 검색어가 없습니다. 위 검색창에서 의학용어를 찾아보세요.
                </div>
              )}
            </div>
          </section>

          {/* 추천 실무 용어 */}
          <section aria-labelledby="recommended-medical-terms-title">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-3">
              <div>
                <p className="text-[11px] md:text-xs font-bold text-rose-600 mb-1">
                  Recommended Medical Terms
                </p>
                <h2 id="recommended-medical-terms-title" className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2">
                  <span className="text-red-500 text-xl">📈</span> 추천 의학 실무 용어
                </h2>
              </div>

              <p className="text-[11px] md:text-xs text-slate-400">
                대표 용어를 누르면 X-DIC 검색 결과로 이동합니다.
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-4 md:p-5 border border-slate-200">
              <div className="flex flex-wrap gap-2">
                {recommendedKeywords.map((keyword, index) => (
                  <Link
                    key={index}
                    href={`/?q=${encodeURIComponent(keyword.split('(')[0].trim())}`}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] md:text-[12px] font-bold rounded-full hover:border-blue-300 hover:text-blue-600 transition-all"
                  >
                    # {keyword}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* 검색 기능과 데이터 이용 방식에 대한 정적 FAQ */}
        <section aria-labelledby="medical-faq-title" className="mt-5 md:mt-6">
          <div className="mb-3">
            <p className="text-[11px] md:text-xs font-bold text-sky-600 mb-1">
              Medical Search FAQ
            </p>
            <h2 id="medical-faq-title" className="text-lg md:text-xl font-black text-slate-900">
              의학용어 검색 FAQ
            </h2>
          </div>

          <div className="space-y-2.5">
            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                한글과 영어를 모두 검색할 수 있나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                네. 이 페이지의 검색창에 한글 또는 영어 의학용어를 입력하면 X-DIC 메인 검색 결과로 이동하여
                관련 한영·영한 데이터와 문장형 결과를 확인할 수 있습니다.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                ‘나만의 의학용어 보물창고’에는 무엇이 저장되나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                이 의학용어 페이지에서 직접 검색한 최근 검색어가 현재 브라우저의 localStorage에 저장됩니다.
                중복을 제거해 최근 검색어를 다시 열어볼 수 있도록 돕는 개인용 기록입니다.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                추천 의학 실무 용어를 누르면 어떻게 되나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                선택한 용어가 X-DIC 메인 검색으로 연결됩니다. 전문용어 데이터와 검색어가 포함된 병렬 결과를
                같은 검색 페이지에서 이어서 탐색할 수 있습니다.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                X-DIC 의학용어 검색은 의료 상담을 대신하나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                아닙니다. X-DIC은 번역과 용어 탐색을 위한 사전 서비스입니다.
                진단·치료와 같은 실제 의료 판단이 필요한 경우에는 의료 전문가와 공신력 있는 전문 자료를 함께 확인해야 합니다.
              </p>
            </details>
          </div>
        </section>

        {/* 신뢰/주의 안내 */}
        <section aria-labelledby="medical-search-notice-title" className="mt-5 md:mt-6 rounded-2xl border border-amber-100 bg-amber-50/45 p-4 md:p-5">
          <h2 id="medical-search-notice-title" className="text-sm md:text-base font-extrabold text-slate-900 mb-2">
            X-DIC 의학용어 검색 이용 안내
          </h2>
          <p className="text-[11px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
            X-DIC의 의학용어 검색은 용어와 번역 표현을 탐색하기 위한 사전 서비스입니다.
            의료 진단이나 치료 판단을 대신하지 않으며, 실제 의료 의사결정이 필요한 경우에는
            의료 전문가의 판단과 공신력 있는 전문 자료를 함께 확인해 주세요.
          </p>
        </section>
      </main>
    </div>
  );
}
