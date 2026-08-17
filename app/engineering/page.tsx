'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type EngineeringTerm = {
  label: string;
  query: string;
};

type EngineeringTopicGroup = {
  id: string;
  icon: string;
  title: string;
  description: string;
  terms: EngineeringTerm[];
};

export default function EngineeringPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [myHistory, setMyHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('xdic_engineering_treasure');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMyHistory(parsed.filter((item): item is string => typeof item === 'string').slice(0, 20));
        }
      } catch {
        localStorage.removeItem('xdic_engineering_treasure');
      }
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const updatedHistory = [
      trimmed,
      ...myHistory.filter((item) => item !== trimmed),
    ].slice(0, 20);

    setMyHistory(updatedHistory);
    localStorage.setItem('xdic_engineering_treasure', JSON.stringify(updatedHistory));

    // 기존 X-DIC 메인 검색 결과로 연결합니다.
    router.push(`/?q=${encodeURIComponent(trimmed)}`);
  };

  // 보수적인 범용 기계·전기·전자 용어만 선별했습니다.
  // 각 용어는 X-DIC 메인 검색으로 연결되어 실제 보유 데이터를 확인합니다.
  const recommendedTerms: EngineeringTerm[] = [
    { label: 'bearing · 베어링', query: 'bearing' },
    { label: 'shaft · 축', query: 'shaft' },
    { label: 'gear ratio · 기어비', query: 'gear ratio' },
    { label: 'torque · 토크', query: 'torque' },
    { label: 'tensile strength · 인장강도', query: 'tensile strength' },
    { label: 'thermal expansion · 열팽창', query: 'thermal expansion' },
    { label: 'lubrication · 윤활', query: 'lubrication' },
    { label: 'hydraulic pressure · 유압', query: 'hydraulic pressure' },
    { label: 'vibration · 진동', query: 'vibration' },

    { label: 'voltage · 전압', query: 'voltage' },
    { label: 'electric current · 전류', query: 'electric current' },
    { label: 'resistance · 저항', query: 'resistance' },
    { label: 'capacitance · 정전용량', query: 'capacitance' },
    { label: 'inductance · 인덕턴스', query: 'inductance' },
    { label: 'circuit breaker · 차단기', query: 'circuit breaker' },
    { label: 'grounding · 접지', query: 'grounding' },
    { label: 'transformer · 변압기', query: 'transformer' },
    { label: 'power factor · 역률', query: 'power factor' },

    { label: 'semiconductor · 반도체', query: 'semiconductor' },
    { label: 'printed circuit board · PCB', query: 'printed circuit board' },
    { label: 'integrated circuit · IC', query: 'integrated circuit' },
    { label: 'diode · 다이오드', query: 'diode' },
    { label: 'transistor · 트랜지스터', query: 'transistor' },
    { label: 'sensor · 센서', query: 'sensor' },
    { label: 'actuator · 액추에이터', query: 'actuator' },
    { label: 'feedback control · 피드백 제어', query: 'feedback control' },
    { label: 'PLC · programmable logic controller', query: 'programmable logic controller' },
    { label: 'inverter · 인버터', query: 'inverter' },
    { label: 'signal processing · 신호처리', query: 'signal processing' },
    { label: 'frequency response · 주파수 응답', query: 'frequency response' },
  ];

  const engineeringReadingNotes = [
    {
      icon: '⚙️',
      title: '부품명과 물리량을 구분해서 보기',
      text:
        'bearing(베어링), shaft(축)처럼 실제 부품을 가리키는 말과 torque(토크), vibration(진동)처럼 상태·물리량을 나타내는 말은 문서에서 역할이 다릅니다. 검색 결과를 볼 때 표제어의 품사와 주변 단어를 함께 확인하면 대응어를 고르기 쉬워집니다.',
    },
    {
      icon: '⚡',
      title: '전기량과 전기기기를 구분해서 보기',
      text:
        'voltage(전압), electric current(전류), resistance(저항)는 전기적 양이나 특성을 나타내고, transformer(변압기), circuit breaker(차단기)는 장치명을 나타냅니다. 같은 기술문서 안에서도 수치·조건을 설명하는 용어와 장치 이름을 구분해 보는 것이 좋습니다.',
    },
    {
      icon: '🔌',
      title: '센서·액추에이터·제어의 관계로 보기',
      text:
        'sensor(센서)는 상태를 감지하거나 측정하는 쪽, actuator(액추에이터)는 제어 신호를 실제 동작으로 바꾸는 쪽에서 자주 쓰입니다. feedback control(피드백 제어) 같은 표현은 이 둘이 포함된 제어 문맥에서 함께 나타날 수 있습니다.',
    },
    {
      icon: '🔎',
      title: '복합 기술용어는 긴 표현부터 검색',
      text:
        'power factor, circuit breaker, printed circuit board, frequency response처럼 여러 단어가 한 개념을 이루는 기술용어는 낱말을 따로 보기보다 전체 구를 먼저 검색하는 편이 의미를 정확히 확인하는 데 유리합니다.',
    },
  ];

  const engineeringMiniGlossary = [
    {
      term: 'bearing',
      ko: '베어링',
      query: 'bearing',
      note:
        '회전축이나 움직이는 부품을 지지하면서 마찰을 줄이는 기계 요소입니다. 문맥에 따라 베어링의 종류·하중·윤활 상태와 함께 쓰입니다.',
    },
    {
      term: 'torque',
      ko: '토크',
      query: 'torque',
      note:
        '축을 돌리려는 회전 효과를 나타내는 물리량입니다. 동력(power)과 관련되지만 같은 개념은 아니므로 회전속도와 함께 문맥을 확인하는 것이 좋습니다.',
    },
    {
      term: 'tensile strength',
      ko: '인장강도',
      query: 'tensile strength',
      note:
        '재료가 잡아당기는 힘을 받을 때 견딜 수 있는 강도와 관련된 재료 특성 용어입니다. 재료·시험·사양 문맥에서 자주 나타납니다.',
    },
    {
      term: 'circuit breaker',
      ko: '차단기',
      query: 'circuit breaker',
      note:
        '회로에서 이상 전류나 고장 조건이 발생했을 때 전류 경로를 차단하는 보호 장치입니다. 배선·보호·전력설비 문맥에서 자주 쓰입니다.',
    },
    {
      term: 'power factor',
      ko: '역률',
      query: 'power factor',
      note:
        '교류 전력 시스템에서 유효전력과 피상전력의 관계를 나타내는 값입니다. 부하·전력 품질·설비 효율을 설명하는 문맥에서 확인할 수 있습니다.',
    },
    {
      term: 'semiconductor',
      ko: '반도체',
      query: 'semiconductor',
      note:
        '전기적 전도 특성을 제어해 전자소자와 집적회로 등에 활용하는 재료·기술 분야의 핵심 용어입니다.',
    },
    {
      term: 'sensor / actuator',
      ko: '센서 / 액추에이터',
      query: 'sensor',
      note:
        '센서는 상태를 감지·측정하는 쪽, 액추에이터는 제어 신호를 실제 움직임이나 작동으로 바꾸는 쪽에서 주로 사용됩니다.',
    },
    {
      term: 'feedback control',
      ko: '피드백 제어',
      query: 'feedback control',
      note:
        '시스템의 출력이나 상태 정보를 다시 제어에 반영해 목표값에 가깝게 조정하는 제어 개념입니다. 센서·제어기·액추에이터 문맥과 함께 자주 검토됩니다.',
    },
  ];

  const engineeringSearchPaths = [
    {
      title: '회전기계·유지보수',
      description: '부품 → 윤활 → 상태 진단의 흐름으로 연관 용어를 이어서 확인합니다.',
      terms: [
        { label: 'bearing', query: 'bearing' },
        { label: 'lubrication', query: 'lubrication' },
        { label: 'vibration', query: 'vibration' },
      ],
    },
    {
      title: '전력·설비',
      description: '전기량과 보호·변환 장치를 함께 검색해 문맥 차이를 비교합니다.',
      terms: [
        { label: 'voltage', query: 'voltage' },
        { label: 'circuit breaker', query: 'circuit breaker' },
        { label: 'transformer', query: 'transformer' },
        { label: 'power factor', query: 'power factor' },
      ],
    },
    {
      title: '전자·자동제어',
      description: '입력 감지 → 출력 동작 → 제어 개념을 한 흐름으로 연결해 봅니다.',
      terms: [
        { label: 'sensor', query: 'sensor' },
        { label: 'actuator', query: 'actuator' },
        { label: 'feedback control', query: 'feedback control' },
        { label: 'PLC', query: 'programmable logic controller' },
      ],
    },
    {
      title: '재료·성능',
      description: '재료의 강도와 열적 특성을 나타내는 용어를 함께 비교합니다.',
      terms: [
        { label: 'tensile strength', query: 'tensile strength' },
        { label: 'thermal expansion', query: 'thermal expansion' },
      ],
    },
  ];

  const engineeringTopicGroups: EngineeringTopicGroup[] = [
    {
      id: 'mechanical-systems',
      icon: '⚙️',
      title: '기계·동력 전달 검색 예시',
      description: '기계 요소, 회전, 동력 전달과 관련된 대표 용어를 검색해 보세요.',
      terms: [
        { label: 'bearing · 베어링', query: 'bearing' },
        { label: 'shaft · 축', query: 'shaft' },
        { label: 'gear ratio · 기어비', query: 'gear ratio' },
        { label: 'torque · 토크', query: 'torque' },
        { label: 'vibration · 진동', query: 'vibration' },
      ],
    },
    {
      id: 'materials-manufacturing',
      icon: '🛠️',
      title: '재료·제조·설비 검색 예시',
      description: '재료 특성, 제조, 윤활과 유압 관련 표현을 이어서 확인해 보세요.',
      terms: [
        { label: 'tensile strength · 인장강도', query: 'tensile strength' },
        { label: 'thermal expansion · 열팽창', query: 'thermal expansion' },
        { label: 'lubrication · 윤활', query: 'lubrication' },
        { label: 'hydraulic pressure · 유압', query: 'hydraulic pressure' },
      ],
    },
    {
      id: 'electrical-power',
      icon: '⚡',
      title: '전기·전력 검색 예시',
      description: '전압, 전류, 회로와 전력설비 분야에서 자주 접하는 용어를 탐색합니다.',
      terms: [
        { label: 'voltage · 전압', query: 'voltage' },
        { label: 'electric current · 전류', query: 'electric current' },
        { label: 'circuit breaker · 차단기', query: 'circuit breaker' },
        { label: 'grounding · 접지', query: 'grounding' },
        { label: 'transformer · 변압기', query: 'transformer' },
        { label: 'power factor · 역률', query: 'power factor' },
      ],
    },
    {
      id: 'electronics-control',
      icon: '🔌',
      title: '전자·제어 검색 예시',
      description: '반도체, 회로, 센서와 제어 시스템 관련 용어를 한영·영한으로 살펴보세요.',
      terms: [
        { label: 'semiconductor · 반도체', query: 'semiconductor' },
        { label: 'printed circuit board · PCB', query: 'printed circuit board' },
        { label: 'sensor · 센서', query: 'sensor' },
        { label: 'actuator · 액추에이터', query: 'actuator' },
        { label: 'feedback control · 피드백 제어', query: 'feedback control' },
        { label: 'PLC', query: 'programmable logic controller' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-sky-700 transition-colors font-bold text-[11px] md:text-xs bg-slate-50 hover:bg-sky-50 px-2.5 py-1 rounded-full"
          >
            <span>←</span> 메인으로 <span className="text-slate-400 font-semibold">· Home</span>
          </Link>

          <div className="text-[12px] md:text-[13px] font-black text-slate-800 tracking-tighter">
            <span className="text-sky-600">X</span>-DIC
            <span className="text-slate-400 ml-1">ENGINEERING</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-14 md:pt-16 pb-16">
        <section className="text-center mb-3 md:mb-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <p className="text-[9px] md:text-[10px] font-extrabold tracking-[0.12em] text-sky-600 uppercase mb-1">
            X-DIC Engineering Terminology
          </p>

          <h1 className="text-[24px] md:text-[30px] font-black text-slate-900 leading-tight tracking-tight">
            기계/전기/전자 전문 검색
            <span className="ml-1.5 text-[11px] md:text-[13px] font-bold text-sky-600 align-middle">
              Mechatronics
            </span>
          </h1>

          <p className="mt-1.5 text-[10px] md:text-[12px] font-bold tracking-tight">
            <span className="text-blue-600">Ko-En</span><span className="text-slate-400"> / </span><span className="text-emerald-600">En-Ko</span><span className="text-slate-500"> Terminology</span>
          </p>

          <p className="max-w-3xl mx-auto mt-2 text-[11px] md:text-[12.5px] text-slate-500 leading-5 md:leading-[1.65] break-keep">
            X-DIC 기계·전기·전자 허브는 기계 요소, 재료·제조, 전기·전력, 전자·제어 분야에서
            접하는 영어·한국어 전문용어를 한영·영한 사전 데이터와 연결해 탐색할 수 있도록 구성했습니다.
            용어를 선택하면 X-DIC 메인 검색 결과에서 관련 전문용어와 병렬 데이터를 이어서 확인할 수 있습니다.
          </p>
        </section>

        <section aria-labelledby="engineering-search-title" className="mb-4 md:mb-5">
          <h2 id="engineering-search-title" className="sr-only">
            기계·전기·전자 용어 한영·영한 검색
          </h2>

          <div className="relative max-w-2xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full h-12 md:h-14 bg-white rounded-xl border border-sky-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-sky-100 transition-all"
            >
              <div className="pl-4 md:pl-5 text-sky-500">
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
                placeholder="예: torque / 토크 / circuit breaker"
                className="flex-grow min-w-0 h-full px-3 md:px-4 text-sm md:text-base outline-none font-medium text-slate-800"
                autoComplete="off"
              />

              <button
                type="submit"
                className="h-full px-5 md:px-6 bg-sky-600 text-white font-black text-sm md:text-base hover:bg-sky-700 transition-colors"
              >
                검색
              </button>
            </form>

            <p className="mt-1.5 text-center text-[10px] md:text-[11px] text-slate-400 font-medium">
              검색어는 이 브라우저의 ‘나만의 기술용어 보물창고’에 저장됩니다.
            </p>
          </div>
        </section>

        {/* Static content */}
        <section aria-labelledby="engineering-guide-title" className="mb-3.5 md:mb-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 md:p-4">
            <div className="mb-2.5">
              <p className="text-[9px] md:text-[10px] font-bold text-sky-600 mb-1">
                Engineering Terminology Guide
              </p>
              <h2
                id="engineering-guide-title"
                className="text-[16px] md:text-[18px] font-black text-slate-900 leading-tight"
              >
                X-DIC에서 기술용어를 찾는 방법
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <article className="rounded-lg bg-white border border-slate-200 px-3 py-2.5 md:px-3.5 md:py-3">
                <h3 className="font-extrabold text-slate-900 text-[12px] md:text-[13px] mb-1">
                  ① 한글·영어 전문용어 검색
                </h3>
                <p className="text-[10.5px] md:text-[11.5px] text-slate-600 leading-[1.5]">
                  기계부품, 재료 특성, 회로, 전력설비, 전자부품, 제어 관련 용어를 한글 또는 영어로 입력하면
                  X-DIC 메인 검색 결과에서 관련 한영·영한 데이터를 확인할 수 있습니다.
                </p>
              </article>

              <article className="rounded-lg bg-white border border-slate-200 px-3 py-2.5 md:px-3.5 md:py-3">
                <h3 className="font-extrabold text-slate-900 text-[12px] md:text-[13px] mb-1">
                  ② 같은 용어의 여러 대응 표현 비교
                </h3>
                <p className="text-[10.5px] md:text-[11.5px] text-slate-600 leading-[1.5]">
                  기술용어는 분야와 문맥에 따라 한국어·영어 대응이 달라질 수 있습니다.
                  검색 결과의 여러 전문용어 및 병렬 데이터를 비교하여 실제 문맥에 맞는 표현을 확인하세요.
                </p>
              </article>

              <article className="rounded-lg bg-white border border-slate-200 px-3 py-2.5 md:px-3.5 md:py-3">
                <h3 className="font-extrabold text-slate-900 text-[12px] md:text-[13px] mb-1">
                  ③ 분야별 대표 검색어로 확장
                </h3>
                <p className="text-[10.5px] md:text-[11.5px] text-slate-600 leading-[1.5]">
                  기계·재료, 전기·전력, 전자·제어 분야의 대표 검색어를 통해 주변 개념으로 탐색을 확장할 수 있습니다.
                </p>
              </article>

              <article className="rounded-lg bg-white border border-slate-200 px-3 py-2.5 md:px-3.5 md:py-3">
                <h3 className="font-extrabold text-slate-900 text-[12px] md:text-[13px] mb-1">
                  ④ 개인 검색 기록 활용
                </h3>
                <p className="text-[10.5px] md:text-[11.5px] text-slate-600 leading-[1.5]">
                  이 페이지에서 직접 검색한 최근 기술용어는 현재 브라우저에 저장되어 다시 찾아보기 쉽도록 도와줍니다.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Fields */}
        <section aria-labelledby="engineering-fields-title" className="mb-3.5 md:mb-4">
          <div className="mb-2.5">
            <p className="text-[9px] md:text-[10px] font-bold text-sky-600 mb-1">
              Explore by field
            </p>
            <h2
              id="engineering-fields-title"
              className="text-[15px] md:text-[17px] font-black text-slate-900 leading-tight"
            >
              대표 기술용어 분야
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              ['⚙️', '기계·동력 전달', '베어링, 축, 기어비, 토크 등', '#mechanical-systems'],
              ['🛠️', '재료·제조·설비', '인장강도, 열팽창, 윤활, 유압 등', '#materials-manufacturing'],
              ['⚡', '전기·전력', '전압, 전류, 접지, 변압기 등', '#electrical-power'],
              ['🔌', '전자·제어', '반도체, 센서, PLC, 피드백 제어 등', '#electronics-control'],
            ].map(([icon, title, desc, href]) => (
              <a
                key={title}
                href={href}
                className="group rounded-xl border border-slate-200 bg-white px-2.5 py-2.5 md:px-3 md:py-3 hover:border-sky-200 hover:bg-sky-50/30 transition-colors"
              >
                <div className="text-base md:text-lg mb-1" aria-hidden="true">{icon}</div>
                <h3 className="font-extrabold text-slate-900 text-[11.5px] md:text-[12.5px] mb-0.5 group-hover:text-sky-700 transition-colors">
                  {title}
                </h3>
                <p className="text-[9.5px] md:text-[10.5px] text-slate-500 leading-snug">{desc}</p>
                <p className="mt-1.5 text-[9px] md:text-[10px] font-bold text-sky-600">
                  대표 검색어 보기 ↓
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Search examples */}
        <section aria-labelledby="engineering-topic-terms-title" className="mb-5 md:mb-6">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-indigo-600 mb-1">
              Browse Engineering Search Examples
            </p>
            <h2
              id="engineering-topic-terms-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              분야별 대표 검색어
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed">
              아래 용어를 누르면 X-DIC 메인 검색 결과로 이동합니다.
              실제 보유 전문용어와 병렬 결과를 확인하면서 주변 기술 개념까지 이어서 탐색할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {engineeringTopicGroups.map((group) => (
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
                      className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-[11px] md:text-[12px] font-bold text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                    >
                      {term.label}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 기술용어를 읽는 관점 */}
        <section aria-labelledby="engineering-reading-guide-title" className="mb-5 md:mb-6">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-violet-600 mb-1">
              Engineering Terminology Notes
            </p>
            <h2
              id="engineering-reading-guide-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              기술용어를 읽을 때 함께 보면 좋은 기준
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              기술 번역에서는 단어 하나의 뜻보다 그 용어가 부품명인지, 물리량인지, 장치명인지,
              제어 개념인지 구분하는 일이 중요합니다. X-DIC 검색 결과를 비교할 때 아래 기준을 함께 참고해 보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {engineeringReadingNotes.map((note) => (
              <article
                key={note.title}
                className="rounded-2xl border border-slate-200 bg-slate-50/45 p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl" aria-hidden="true">{note.icon}</div>
                  <div>
                    <h3 className="text-[13px] md:text-[15px] font-extrabold text-slate-900">
                      {note.title}
                    </h3>
                    <p className="mt-1.5 text-[11px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
                      {note.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 핵심 기술용어 미니 해설 */}
        <section aria-labelledby="engineering-mini-glossary-title" className="mb-5 md:mb-6">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-emerald-600 mb-1">
              Engineering Mini Glossary
            </p>
            <h2
              id="engineering-mini-glossary-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              핵심 기술용어 미니 해설
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              대표 기술용어의 기본 개념을 짧게 확인한 뒤, 용어를 눌러 X-DIC의 실제 한영·영한 검색 결과와 비교해 보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {engineeringMiniGlossary.map((item) => (
              <article
                key={item.term}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/25 p-4 md:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[13px] md:text-[15px] font-extrabold text-slate-900">
                      {item.term}
                      <span className="ml-2 text-slate-500 font-bold">
                        · {item.ko}
                      </span>
                    </h3>

                    <p className="mt-1.5 text-[11px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
                      {item.note}
                    </p>
                  </div>

                  <Link
                    href={`/?q=${encodeURIComponent(item.query)}`}
                    className="shrink-0 px-2.5 py-1 rounded-full border border-emerald-200 bg-white text-[10px] md:text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    검색 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 연관 검색 경로 */}
        <section aria-labelledby="engineering-search-paths-title" className="mb-5 md:mb-6">
          <div className="rounded-2xl border border-sky-100 bg-sky-50/35 p-4 md:p-6">
            <div className="mb-4">
              <p className="text-[11px] md:text-xs font-bold text-sky-600 mb-1">
                Related Search Paths
              </p>
              <h2
                id="engineering-search-paths-title"
                className="text-lg md:text-xl font-black text-slate-900"
              >
                연관 기술용어를 이어서 검색해 보세요
              </h2>
              <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
                한 용어에서 시작해 같은 작업·설비·제어 흐름에서 자주 함께 검토되는 주변 개념으로 이동할 수 있습니다.
                각 항목은 X-DIC의 기존 메인 검색으로 연결됩니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {engineeringSearchPaths.map((path) => (
                <article
                  key={path.title}
                  className="rounded-xl border border-white/80 bg-white p-4 shadow-sm"
                >
                  <h3 className="text-[13px] md:text-sm font-extrabold text-slate-900">
                    {path.title}
                  </h3>
                  <p className="mt-1 text-[11px] md:text-[12px] text-slate-500 leading-relaxed">
                    {path.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {path.terms.map((term, index) => (
                      <React.Fragment key={`${path.title}-${term.label}`}>
                        {index > 0 && (
                          <span className="text-slate-300 text-[11px]" aria-hidden="true">
                            →
                          </span>
                        )}
                        <Link
                          href={`/?q=${encodeURIComponent(term.query)}`}
                          className="px-2.5 py-1 rounded-full border border-sky-100 bg-sky-50/60 text-[11px] md:text-[12px] font-bold text-sky-700 hover:border-sky-300 hover:bg-sky-100 transition-colors"
                        >
                          {term.label}
                        </Link>
                      </React.Fragment>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 md:gap-6">
          {/* Treasure */}
          <section aria-labelledby="engineering-treasure-title" className="animate-in fade-in duration-700">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2
                id="engineering-treasure-title"
                className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2"
              >
                <span className="text-xl">🎁</span> 나만의 기술용어 보물창고
              </h2>

              {myHistory.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('보물창고를 비울까요?')) {
                      setMyHistory([]);
                      localStorage.removeItem('xdic_engineering_treasure');
                    }
                  }}
                  className="text-slate-400 hover:text-red-500 text-[11px] font-bold"
                >
                  비우기
                </button>
              )}
            </div>

            <div className="bg-sky-50/40 rounded-2xl p-4 md:p-5 border border-sky-100 min-h-[82px]">
              {myHistory.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {myHistory.map((item, index) => (
                    <Link
                      key={`${item}-${index}`}
                      href={`/?q=${encodeURIComponent(item)}`}
                      className="px-3 py-1.5 bg-white border border-sky-200 text-sky-700 text-[12px] md:text-sm font-bold rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-sm"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center text-slate-400 text-[12px] md:text-sm italic py-3">
                  아직 저장된 검색어가 없습니다. 위 검색창에서 기술용어를 찾아보세요.
                </div>
              )}
            </div>
          </section>

          {/* Recommended terms */}
          <section aria-labelledby="recommended-engineering-terms-title">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-3">
              <div>
                <p className="text-[11px] md:text-xs font-bold text-sky-600 mb-1">
                  Recommended Engineering Terms
                </p>
                <h2
                  id="recommended-engineering-terms-title"
                  className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2"
                >
                  <span className="text-xl">📐</span> 추천 기계·전기·전자 용어
                </h2>
              </div>

              <p className="text-[11px] md:text-xs text-slate-400">
                대표 용어를 누르면 X-DIC 검색 결과로 이동합니다.
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-4 md:p-5 border border-slate-200">
              <div className="flex flex-wrap gap-2">
                {recommendedTerms.map((term) => (
                  <Link
                    key={term.label}
                    href={`/?q=${encodeURIComponent(term.query)}`}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] md:text-[12px] font-bold rounded-full hover:border-sky-300 hover:text-sky-700 transition-all"
                  >
                    # {term.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* FAQ */}
        <section aria-labelledby="engineering-faq-title" className="mt-5 md:mt-6">
          <div className="mb-3">
            <p className="text-[11px] md:text-xs font-bold text-sky-600 mb-1">
              Engineering Search FAQ
            </p>
            <h2 id="engineering-faq-title" className="text-lg md:text-xl font-black text-slate-900">
              기계·전기·전자 용어 검색 FAQ
            </h2>
          </div>

          <div className="space-y-2.5">
            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                한글과 영어 기술용어를 모두 검색할 수 있나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                네. 한글 또는 영어 기술용어를 입력하면 X-DIC 메인 검색 결과로 이동하여
                관련 한영·영한 전문용어와 병렬 결과를 확인할 수 있습니다.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                같은 기술용어가 여러 뜻으로 나오면 어떻게 보나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                기술용어는 분야와 문맥에 따라 대응 표현이 달라질 수 있으므로,
                한 개 결과만 보지 말고 관련 전문용어와 병렬 데이터를 함께 비교하는 것이 좋습니다.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                추천 기술용어를 누르면 어떻게 되나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                선택한 용어가 X-DIC 메인 검색으로 연결됩니다.
                검색 결과에서 실제 보유 데이터와 관련 표현을 이어서 탐색할 수 있습니다.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                미니 해설과 실제 X-DIC 검색 결과는 어떤 차이가 있나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                미니 해설은 대표 기술용어의 기본 개념을 빠르게 이해하기 위한 안내입니다.
                실제 번역어 선택은 검색 결과의 전문용어와 병렬 데이터, 그리고 사용하려는 문서의 분야·문맥을 함께 확인해 결정하는 것이 좋습니다.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                복합 기술용어는 어떤 방식으로 검색하는 것이 좋나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                circuit breaker, power factor, printed circuit board처럼 여러 단어가 하나의 기술 개념을 이루는 경우에는
                전체 표현을 먼저 검색하는 편이 좋습니다. 필요한 경우 핵심 명사만 다시 검색해 더 넓은 관련 결과를 비교할 수 있습니다.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                실제 설계·제작 문서에 그대로 사용해도 되나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                X-DIC은 용어와 번역 표현을 탐색하는 사전 서비스입니다.
                실제 설계도면, 사양서, 계약문서, 안전 관련 문서에서는 해당 프로젝트의 표준·규격·회사 용어집과 함께 확인해 주세요.
              </p>
            </details>
          </div>
        </section>

        {/* Notice */}
        <section
          aria-labelledby="engineering-search-notice-title"
          className="mt-5 md:mt-6 rounded-2xl border border-amber-100 bg-amber-50/45 p-4 md:p-5"
        >
          <h2
            id="engineering-search-notice-title"
            className="text-sm md:text-base font-extrabold text-slate-900 mb-2"
          >
            X-DIC 기술용어 검색 이용 안내
          </h2>

          <p className="text-[11px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
            X-DIC의 기계·전기·전자 용어 검색은 전문용어와 번역 표현을 탐색하기 위한 사전 서비스입니다.
            실제 설계, 제작, 시험, 안전, 규격 적용이 필요한 경우에는 해당 분야의 최신 표준·사양서와
            프로젝트 기준을 함께 확인해 주세요.
          </p>
        </section>
      </main>
    </div>
  );
}
