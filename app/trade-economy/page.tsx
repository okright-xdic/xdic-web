'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type TradeEconomyTerm = {
  label: string;
  query: string;
};

type TradeEconomyTopicGroup = {
  id: string;
  icon: string;
  title: string;
  description: string;
  terms: TradeEconomyTerm[];
};

export default function TradeEconomyPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [myHistory, setMyHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('xdic_trade_economy_treasure');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMyHistory(
            parsed
              .filter((item): item is string => typeof item === 'string')
              .slice(0, 20)
          );
        }
      } catch {
        localStorage.removeItem('xdic_trade_economy_treasure');
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
    localStorage.setItem(
      'xdic_trade_economy_treasure',
      JSON.stringify(updatedHistory)
    );

    // 기존 X-DIC 메인 검색 결과로 연결합니다.
    router.push(`/?q=${encodeURIComponent(trimmed)}`);
  };

  const recommendedTerms: TradeEconomyTerm[] = [
    { label: 'bill of lading · 선하증권', query: 'bill of lading' },
    { label: 'commercial invoice · 상업송장', query: 'commercial invoice' },
    { label: 'packing list · 포장명세서', query: 'packing list' },
    { label: 'customs clearance · 통관', query: 'customs clearance' },
    { label: 'certificate of origin · 원산지증명서', query: 'certificate of origin' },
    { label: 'freight · 운임', query: 'freight' },
    { label: 'shipment · 선적', query: 'shipment' },
    { label: 'consignee · 수하인', query: 'consignee' },

    { label: 'quotation · 견적', query: 'quotation' },
    { label: 'purchase order · 구매주문서', query: 'purchase order' },
    { label: 'sales contract · 매매계약', query: 'sales contract' },
    { label: 'letter of credit · 신용장', query: 'letter of credit' },
    { label: 'payment terms · 결제조건', query: 'payment terms' },
    { label: 'advance payment · 선급금', query: 'advance payment' },
    { label: 'accounts receivable · 매출채권', query: 'accounts receivable' },
    { label: 'accounts payable · 매입채무', query: 'accounts payable' },

    { label: 'exchange rate · 환율', query: 'exchange rate' },
    { label: 'foreign exchange · 외환', query: 'foreign exchange' },
    { label: 'interest rate · 이자율', query: 'interest rate' },
    { label: 'inflation · 인플레이션', query: 'inflation' },
    { label: 'tariff · 관세', query: 'tariff' },
    { label: 'import duty · 수입관세', query: 'import duty' },
    { label: 'trade balance · 무역수지', query: 'trade balance' },
    { label: 'current account · 경상수지', query: 'current account' },

    { label: 'gross domestic product · GDP', query: 'gross domestic product' },
    { label: 'economic growth · 경제성장', query: 'economic growth' },
    { label: 'supply and demand · 수요와 공급', query: 'supply and demand' },
    { label: 'market share · 시장점유율', query: 'market share' },
    { label: 'price index · 물가지수', query: 'price index' },
    { label: 'consumer price index · 소비자물가지수', query: 'consumer price index' },
  ];

  const topicGroups: TradeEconomyTopicGroup[] = [
    {
      id: 'trade-documents-logistics',
      icon: '🚢',
      title: '무역서류·물류 검색 예시',
      description:
        '선적·운송·통관 과정에서 접하는 대표 서류와 물류 용어를 검색해 보세요.',
      terms: [
        { label: 'bill of lading · 선하증권', query: 'bill of lading' },
        { label: 'commercial invoice · 상업송장', query: 'commercial invoice' },
        { label: 'packing list · 포장명세서', query: 'packing list' },
        { label: 'customs clearance · 통관', query: 'customs clearance' },
        { label: 'certificate of origin · 원산지증명서', query: 'certificate of origin' },
        { label: 'freight · 운임', query: 'freight' },
      ],
    },
    {
      id: 'contracts-payments',
      icon: '🧾',
      title: '계약·결제 검색 예시',
      description:
        '견적부터 주문, 계약, 신용장, 결제조건까지 실무 흐름에 맞춰 탐색합니다.',
      terms: [
        { label: 'quotation · 견적', query: 'quotation' },
        { label: 'purchase order · 구매주문서', query: 'purchase order' },
        { label: 'sales contract · 매매계약', query: 'sales contract' },
        { label: 'letter of credit · 신용장', query: 'letter of credit' },
        { label: 'payment terms · 결제조건', query: 'payment terms' },
        { label: 'advance payment · 선급금', query: 'advance payment' },
      ],
    },
    {
      id: 'foreign-exchange-finance',
      icon: '💱',
      title: '환율·금융 검색 예시',
      description:
        '외환, 환율, 금리와 관세 등 거래 비용과 금융 조건에 관련된 용어를 확인합니다.',
      terms: [
        { label: 'exchange rate · 환율', query: 'exchange rate' },
        { label: 'foreign exchange · 외환', query: 'foreign exchange' },
        { label: 'interest rate · 이자율', query: 'interest rate' },
        { label: 'tariff · 관세', query: 'tariff' },
        { label: 'import duty · 수입관세', query: 'import duty' },
      ],
    },
    {
      id: 'economic-indicators',
      icon: '📈',
      title: '경제지표 검색 예시',
      description:
        '경제 상황과 시장 흐름을 설명할 때 자주 쓰이는 주요 경제용어를 탐색합니다.',
      terms: [
        { label: 'inflation · 인플레이션', query: 'inflation' },
        { label: 'trade balance · 무역수지', query: 'trade balance' },
        { label: 'current account · 경상수지', query: 'current account' },
        { label: 'GDP · 국내총생산', query: 'gross domestic product' },
        { label: 'economic growth · 경제성장', query: 'economic growth' },
        { label: 'consumer price index · 소비자물가지수', query: 'consumer price index' },
      ],
    },
  ];

  const readingNotes = [
    {
      icon: '📄',
      title: '무역서류명은 전체 구를 먼저 검색',
      text:
        'bill of lading, commercial invoice, certificate of origin처럼 여러 단어가 하나의 서류명을 이루는 경우에는 낱말을 따로 보기보다 전체 표현을 먼저 검색하는 편이 의미를 정확히 파악하기 좋습니다.',
    },
    {
      icon: '💬',
      title: 'order·charge·balance 같은 다의어는 문맥 확인',
      text:
        'order는 주문·명령, charge는 요금·청구·부과, balance는 잔액·균형·수지 등 여러 뜻으로 쓰일 수 있습니다. 무역·경제 문맥에서는 앞뒤 단어와 결합된 긴 표현을 함께 확인하세요.',
    },
    {
      icon: '💱',
      title: 'rate는 결합하는 명사에 따라 뜻이 달라짐',
      text:
        'exchange rate는 환율, interest rate는 이자율처럼 rate 앞의 명사가 의미를 결정하는 경우가 많습니다. rate만 단독 검색한 결과보다 복합어 전체를 비교하는 것이 유리합니다.',
    },
    {
      icon: '📊',
      title: '비슷한 경제지표 이름은 구분해서 보기',
      text:
        'trade balance, current account, price index처럼 이름이 비슷하거나 서로 연관된 지표는 같은 뜻으로 보지 말고 각각의 표제어와 주변 설명을 분리해 확인하는 것이 좋습니다.',
    },
  ];

  const miniGlossary = [
    {
      term: 'bill of lading',
      ko: '선하증권',
      query: 'bill of lading',
      note:
        '화물 운송과 관련해 발행되는 대표적인 운송서류입니다. 실제 문서에서는 운송인, 화물, 수하인 등 주변 항목과 함께 나타날 수 있습니다.',
    },
    {
      term: 'commercial invoice',
      ko: '상업송장',
      query: 'commercial invoice',
      note:
        '판매자가 거래 물품과 가격 등 거래 내용을 기재하는 대표적인 무역서류입니다. 통관·대금결제 관련 문맥에서도 자주 확인됩니다.',
    },
    {
      term: 'letter of credit',
      ko: '신용장',
      query: 'letter of credit',
      note:
        '무역대금 결제에서 은행의 지급 확약과 관련된 대표적인 금융·결제 용어입니다. 실제 거래에서는 서류 조건과 결제조건을 함께 확인해야 합니다.',
    },
    {
      term: 'customs clearance',
      ko: '통관',
      query: 'customs clearance',
      note:
        '수출입 물품이 세관 절차를 거치는 과정을 가리키는 표현입니다. 신고, 관세, 관련 서류와 함께 쓰이는 경우가 많습니다.',
    },
    {
      term: 'exchange rate',
      ko: '환율',
      query: 'exchange rate',
      note:
        '한 통화의 가치를 다른 통화로 나타낸 비율입니다. 무역가격, 외화결제, 환전 및 경제 기사에서 폭넓게 사용됩니다.',
    },
    {
      term: 'tariff',
      ko: '관세',
      query: 'tariff',
      note:
        '국제거래 물품에 적용되는 관세와 관련된 용어입니다. 실제 세율과 적용 조건은 국가·품목·제도에 따라 달라질 수 있으므로 공식 자료를 함께 확인해야 합니다.',
    },
    {
      term: 'inflation',
      ko: '인플레이션',
      query: 'inflation',
      note:
        '전반적인 물가 수준이 지속적으로 상승하는 현상을 설명하는 경제용어입니다. 물가지수, 금리, 구매력 등의 문맥과 함께 나타납니다.',
    },
    {
      term: 'trade balance',
      ko: '무역수지',
      query: 'trade balance',
      note:
        '수출과 수입의 차이를 설명할 때 사용하는 경제·무역 지표 용어입니다. 통계 기준에 따라 세부 범위를 확인하는 것이 좋습니다.',
    },
  ];

  const searchPaths = [
    {
      title: '수출 서류·물류',
      description:
        '거래 서류에서 운송·통관으로 이어지는 흐름을 따라 관련 용어를 검색합니다.',
      terms: [
        { label: 'commercial invoice', query: 'commercial invoice' },
        { label: 'packing list', query: 'packing list' },
        { label: 'bill of lading', query: 'bill of lading' },
        { label: 'customs clearance', query: 'customs clearance' },
      ],
    },
    {
      title: '견적·주문·결제',
      description:
        '거래 협의에서 주문과 대금결제로 이어지는 주요 실무 용어를 연결해 봅니다.',
      terms: [
        { label: 'quotation', query: 'quotation' },
        { label: 'purchase order', query: 'purchase order' },
        { label: 'letter of credit', query: 'letter of credit' },
        { label: 'payment terms', query: 'payment terms' },
      ],
    },
    {
      title: '환율·금리·물가',
      description:
        '거래비용과 경제환경을 설명하는 대표 금융·경제 개념을 함께 비교합니다.',
      terms: [
        { label: 'exchange rate', query: 'exchange rate' },
        { label: 'interest rate', query: 'interest rate' },
        { label: 'inflation', query: 'inflation' },
        { label: 'price index', query: 'price index' },
      ],
    },
    {
      title: '대외거래·경제지표',
      description:
        '수출입 흐름과 거시경제 지표를 이어서 검색하며 용어의 범위를 비교합니다.',
      terms: [
        { label: 'trade balance', query: 'trade balance' },
        { label: 'current account', query: 'current account' },
        { label: 'GDP', query: 'gross domestic product' },
        { label: 'economic growth', query: 'economic growth' },
      ],
    },
  ];

  const tradeFlowSteps = [
    {
      step: '01',
      title: '견적·거래 제안',
      description: '가격과 거래조건을 협의하는 단계에서 자주 확인하는 용어입니다.',
      terms: [
        { label: 'quotation', query: 'quotation' },
        { label: 'unit price', query: 'unit price' },
        { label: 'payment terms', query: 'payment terms' },
      ],
    },
    {
      step: '02',
      title: '주문·계약',
      description: '주문 내용을 확정하고 계약 조건을 문서화할 때 관련 용어를 확인합니다.',
      terms: [
        { label: 'purchase order', query: 'purchase order' },
        { label: 'sales contract', query: 'sales contract' },
        { label: 'terms and conditions', query: 'terms and conditions' },
      ],
    },
    {
      step: '03',
      title: '선적서류 준비',
      description: '상품·수량·포장·운송 정보를 담는 대표 무역서류를 함께 살펴봅니다.',
      terms: [
        { label: 'commercial invoice', query: 'commercial invoice' },
        { label: 'packing list', query: 'packing list' },
        { label: 'bill of lading', query: 'bill of lading' },
      ],
    },
    {
      step: '04',
      title: '운송·통관',
      description: '화물의 이동과 수출입 세관 절차에서 쓰이는 용어를 이어서 확인합니다.',
      terms: [
        { label: 'freight', query: 'freight' },
        { label: 'shipment', query: 'shipment' },
        { label: 'customs clearance', query: 'customs clearance' },
        { label: 'import duty', query: 'import duty' },
      ],
    },
    {
      step: '05',
      title: '대금 결제',
      description: '거래대금의 지급 방식과 금융 조건을 나타내는 표현을 확인합니다.',
      terms: [
        { label: 'letter of credit', query: 'letter of credit' },
        { label: 'advance payment', query: 'advance payment' },
        { label: 'accounts receivable', query: 'accounts receivable' },
      ],
    },
    {
      step: '06',
      title: '거래 후 정산·분석',
      description: '거래가 끝난 뒤 채권·채무와 비용, 시장 상황을 검토할 때 이어지는 용어입니다.',
      terms: [
        { label: 'accounts payable', query: 'accounts payable' },
        { label: 'exchange rate', query: 'exchange rate' },
        { label: 'market share', query: 'market share' },
      ],
    },
  ];

  const economicIndicatorGuide = [
    {
      icon: '🏭',
      term: 'GDP',
      ko: '국내총생산',
      query: 'gross domestic product',
      note:
        '한 나라 안에서 일정 기간 생산된 재화와 서비스의 가치를 나타내는 대표적인 거시경제 지표입니다. 경제 규모나 성장 흐름을 설명하는 문맥에서 자주 사용됩니다.',
    },
    {
      icon: '🛒',
      term: 'consumer price index',
      ko: '소비자물가지수',
      query: 'consumer price index',
      note:
        '소비자가 구입하는 상품과 서비스의 가격 변화를 지수로 나타낸 표현입니다. 물가와 인플레이션을 설명하는 문맥에서 함께 확인되는 경우가 많습니다.',
    },
    {
      icon: '💹',
      term: 'interest rate',
      ko: '이자율',
      query: 'interest rate',
      note:
        '자금의 대여·차입과 관련된 비율을 나타내는 금융용어입니다. 대출, 채권, 중앙은행 정책, 투자 환경 등 여러 문맥에서 쓰입니다.',
    },
    {
      icon: '💱',
      term: 'exchange rate',
      ko: '환율',
      query: 'exchange rate',
      note:
        '서로 다른 통화 사이의 교환 비율입니다. 수출입 가격, 외화결제, 해외투자, 여행·환전 등 다양한 문맥에서 사용됩니다.',
    },
    {
      icon: '🚢',
      term: 'trade balance',
      ko: '무역수지',
      query: 'trade balance',
      note:
        '상품 수출과 수입의 차이를 설명할 때 사용하는 대표적인 대외거래 지표입니다. 흑자·적자 같은 표현과 함께 등장할 수 있습니다.',
    },
    {
      icon: '📈',
      term: 'economic growth',
      ko: '경제성장',
      query: 'economic growth',
      note:
        '경제의 생산이나 소득 규모가 커지는 현상을 설명하는 표현입니다. GDP, 투자, 소비, 고용 등의 문맥과 함께 나타날 수 있습니다.',
    },
  ];

  const usefulTradePairs = [
    {
      left: 'exporter',
      right: 'importer',
      leftKo: '수출자',
      rightKo: '수입자',
      leftQuery: 'exporter',
      rightQuery: 'importer',
    },
    {
      left: 'shipper',
      right: 'consignee',
      leftKo: '송하인',
      rightKo: '수하인',
      leftQuery: 'shipper',
      rightQuery: 'consignee',
    },
    {
      left: 'accounts receivable',
      right: 'accounts payable',
      leftKo: '매출채권',
      rightKo: '매입채무',
      leftQuery: 'accounts receivable',
      rightQuery: 'accounts payable',
    },
    {
      left: 'export',
      right: 'import',
      leftKo: '수출',
      rightKo: '수입',
      leftQuery: 'export',
      rightQuery: 'import',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-amber-700 transition-colors font-bold text-[11px] md:text-xs bg-slate-50 hover:bg-amber-50 px-2.5 py-1 rounded-full"
          >
            <span>←</span> 메인으로 <span className="text-slate-400 font-semibold">· Home</span>
          </Link>

          <div className="text-[12px] md:text-[13px] font-black text-slate-800 tracking-tighter">
            <span className="text-amber-600">X</span>-DIC
            <span className="text-slate-400 ml-1">TRADE &amp; ECONOMY</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-14 md:pt-16 pb-16">
        <section className="text-center mb-3 md:mb-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <p className="text-[9px] md:text-[10px] font-extrabold tracking-[0.12em] text-amber-600 uppercase mb-1">
            X-DIC Trade &amp; Economy Terminology
          </p>

          <h1 className="text-[24px] md:text-[30px] font-black text-slate-900 leading-tight tracking-tight">
            무역/경제 전문 검색
            <span className="ml-1.5 text-[11px] md:text-[13px] font-bold text-amber-600 align-middle">
              Trade&amp;Economy
            </span>
          </h1>

          <p className="mt-1.5 text-[10px] md:text-[12px] font-bold tracking-tight">
            <span className="text-blue-600">Ko-En</span><span className="text-slate-400"> / </span><span className="text-emerald-600">En-Ko</span><span className="text-slate-500"> Terminology</span>
          </p>

          <p className="max-w-3xl mx-auto mt-2 text-[11px] md:text-[12.5px] text-slate-500 leading-5 md:leading-[1.65] break-keep">
            X-DIC 무역·경제 허브는 무역서류·물류, 계약·결제, 환율·금융, 경제지표 분야에서
            접하는 영어·한국어 전문용어를 한영·영한 사전 데이터와 연결해 탐색할 수 있도록 구성했습니다.
            용어를 선택하면 X-DIC 메인 검색 결과에서 관련 전문용어와 병렬 데이터를 이어서 확인할 수 있습니다.
          </p>
        </section>

        <section aria-labelledby="trade-economy-search-title" className="mb-4 md:mb-5">
          <h2 id="trade-economy-search-title" className="sr-only">
            무역·경제 용어 한영·영한 검색
          </h2>

          <div className="relative max-w-2xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full h-12 md:h-14 bg-white rounded-xl border border-amber-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-amber-100 transition-all"
            >
              <div className="pl-4 md:pl-5 text-amber-500">
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
                placeholder="예: bill of lading / 선하증권 / exchange rate"
                className="flex-grow min-w-0 h-full px-3 md:px-4 text-sm md:text-base outline-none font-medium text-slate-800"
                autoComplete="off"
              />

              <button
                type="submit"
                className="h-full px-5 md:px-6 bg-amber-600 text-white font-black text-sm md:text-base hover:bg-amber-700 transition-colors"
              >
                검색
              </button>
            </form>

            <p className="mt-1.5 text-center text-[10px] md:text-[11px] text-slate-400 font-medium">
              검색어는 이 브라우저의 ‘나만의 무역·경제 용어 보물창고’에 저장됩니다.
            </p>
          </div>
        </section>

        {/* Guide */}
        <section aria-labelledby="trade-economy-guide-title" className="mb-3.5 md:mb-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 md:p-4">
            <div className="mb-2.5">
              <p className="text-[9px] md:text-[10px] font-bold text-amber-600 mb-1">
                Trade &amp; Economy Terminology Guide
              </p>
              <h2
                id="trade-economy-guide-title"
                className="text-[16px] md:text-[18px] font-black text-slate-900 leading-tight"
              >
                X-DIC에서 무역·경제 용어를 찾는 방법
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <article className="rounded-lg bg-white border border-slate-200 px-3 py-2.5 md:px-3.5 md:py-3">
                <h3 className="font-extrabold text-slate-900 text-[12px] md:text-[13px] mb-1">
                  ① 한글·영어 전문용어 검색
                </h3>
                <p className="text-[10.5px] md:text-[11.5px] text-slate-600 leading-[1.5]">
                  무역서류, 계약, 결제, 물류, 환율, 금융 및 경제지표 용어를 한글 또는 영어로 입력하면
                  X-DIC 메인 검색 결과에서 관련 한영·영한 데이터를 확인할 수 있습니다.
                </p>
              </article>

              <article className="rounded-lg bg-white border border-slate-200 px-3 py-2.5 md:px-3.5 md:py-3">
                <h3 className="font-extrabold text-slate-900 text-[12px] md:text-[13px] mb-1">
                  ② 긴 실무 표현부터 확인
                </h3>
                <p className="text-[10.5px] md:text-[11.5px] text-slate-600 leading-[1.5]">
                  letter of credit, bill of lading, payment terms처럼 여러 단어가 한 개념을 이루는 경우
                  전체 구를 먼저 검색하면 단어별 검색보다 의미를 정확히 파악하기 쉽습니다.
                </p>
              </article>

              <article className="rounded-lg bg-white border border-slate-200 px-3 py-2.5 md:px-3.5 md:py-3">
                <h3 className="font-extrabold text-slate-900 text-[12px] md:text-[13px] mb-1">
                  ③ 거래 흐름에 따라 연관 용어 탐색
                </h3>
                <p className="text-[10.5px] md:text-[11.5px] text-slate-600 leading-[1.5]">
                  견적 → 주문 → 계약 → 선적 → 통관 → 결제처럼 실제 업무 흐름에 따라 관련 용어를 이어서 탐색할 수 있습니다.
                </p>
              </article>

              <article className="rounded-lg bg-white border border-slate-200 px-3 py-2.5 md:px-3.5 md:py-3">
                <h3 className="font-extrabold text-slate-900 text-[12px] md:text-[13px] mb-1">
                  ④ 개인 검색 기록 활용
                </h3>
                <p className="text-[10.5px] md:text-[11.5px] text-slate-600 leading-[1.5]">
                  이 페이지에서 직접 검색한 최근 용어는 현재 브라우저에 저장되어 다시 찾아보기 쉽도록 도와줍니다.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Fields */}
        <section aria-labelledby="trade-economy-fields-title" className="mb-3.5 md:mb-4">
          <div className="mb-2.5">
            <p className="text-[9px] md:text-[10px] font-bold text-amber-600 mb-1">
              Explore by field
            </p>
            <h2
              id="trade-economy-fields-title"
              className="text-[15px] md:text-[17px] font-black text-slate-900 leading-tight"
            >
              대표 무역·경제 용어 분야
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              ['🚢', '무역서류·물류', '선하증권, 송장, 통관, 운임 등', '#trade-documents-logistics'],
              ['🧾', '계약·결제', '견적, 주문서, 신용장, 결제조건 등', '#contracts-payments'],
              ['💱', '환율·금융', '환율, 외환, 금리, 관세 등', '#foreign-exchange-finance'],
              ['📈', '경제지표', '물가, 무역수지, GDP, 경제성장 등', '#economic-indicators'],
            ].map(([icon, title, desc, href]) => (
              <a
                key={title}
                href={href}
                className="group rounded-xl border border-slate-200 bg-white px-2.5 py-2.5 md:px-3 md:py-3 hover:border-amber-200 hover:bg-amber-50/30 transition-colors"
              >
                <div className="text-base md:text-lg mb-1" aria-hidden="true">{icon}</div>
                <h3 className="font-extrabold text-slate-900 text-[11.5px] md:text-[12.5px] mb-0.5 group-hover:text-amber-700 transition-colors">
                  {title}
                </h3>
                <p className="text-[9.5px] md:text-[10.5px] text-slate-500 leading-snug">{desc}</p>
                <p className="mt-1.5 text-[9px] md:text-[10px] font-bold text-amber-600">
                  대표 검색어 보기 ↓
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Search examples */}
        <section aria-labelledby="trade-economy-topic-terms-title" className="mb-5 md:mb-6">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-indigo-600 mb-1">
              Browse Trade &amp; Economy Search Examples
            </p>
            <h2
              id="trade-economy-topic-terms-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              분야별 대표 검색어
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed">
              아래 용어를 누르면 X-DIC 메인 검색 결과로 이동합니다.
              실제 보유 전문용어와 병렬 결과를 확인하면서 주변 무역·경제 개념까지 이어서 탐색할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {topicGroups.map((group) => (
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
                      className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-[11px] md:text-[12px] font-bold text-slate-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      {term.label}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Trade flow */}
        <section aria-labelledby="trade-flow-title" className="mb-5 md:mb-6">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-blue-600 mb-1">
              Trade Workflow
            </p>
            <h2
              id="trade-flow-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              무역 거래 흐름으로 용어를 연결해 보세요
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              무역용어는 개별 단어로 외우기보다 실제 거래가 진행되는 순서와 함께 보면 관계를 이해하기 쉽습니다.
              아래 단계의 용어를 누르면 X-DIC 메인 검색 결과로 바로 이어집니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {tradeFlowSteps.map((item) => (
              <article
                key={item.step}
                className="rounded-2xl border border-blue-100 bg-blue-50/25 p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-black">
                    {item.step}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-[13px] md:text-[15px] font-extrabold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[11px] md:text-[12px] text-slate-500 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.terms.map((term) => (
                        <Link
                          key={`${item.step}-${term.label}`}
                          href={`/?q=${encodeURIComponent(term.query)}`}
                          className="px-2.5 py-1 rounded-full border border-blue-100 bg-white text-[11px] md:text-[12px] font-bold text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          {term.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Reading notes */}
        <section aria-labelledby="trade-economy-reading-notes-title" className="mb-5 md:mb-6">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-violet-600 mb-1">
              Trade &amp; Economy Terminology Notes
            </p>
            <h2
              id="trade-economy-reading-notes-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              무역·경제 용어를 읽을 때 함께 보면 좋은 기준
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              실무 문서와 경제 기사에서는 같은 단어가 일상어와 다른 의미로 쓰이기도 합니다.
              X-DIC 검색 결과를 비교할 때 아래 기준을 함께 참고해 보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {readingNotes.map((note) => (
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

        {/* Mini glossary */}
        <section aria-labelledby="trade-economy-mini-glossary-title" className="mb-5 md:mb-6">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-emerald-600 mb-1">
              Trade &amp; Economy Mini Glossary
            </p>
            <h2
              id="trade-economy-mini-glossary-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              핵심 무역·경제 용어 미니 해설
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              대표 용어의 기본 개념을 짧게 확인한 뒤, 검색 버튼을 눌러 X-DIC의 실제 한영·영한 결과와 비교해 보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {miniGlossary.map((item) => (
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

        {/* Economic indicators */}
        <section aria-labelledby="economic-indicator-guide-title" className="mb-5 md:mb-6">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-rose-600 mb-1">
              Economic Indicator Guide
            </p>
            <h2
              id="economic-indicator-guide-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              경제기사에서 자주 보는 지표 용어
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              경제용어는 단어의 한국어 대응만 아는 것보다 어떤 상황을 설명하는 지표인지 함께 보는 것이 좋습니다.
              아래 설명은 기본 개념 안내이며, 검색 버튼을 누르면 X-DIC의 실제 용례와 전문용어 결과를 확인할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {economicIndicatorGuide.map((item) => (
              <article
                key={item.term}
                className="rounded-2xl border border-rose-100 bg-rose-50/20 p-4 md:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg" aria-hidden="true">{item.icon}</span>
                      <h3 className="text-[13px] md:text-[15px] font-extrabold text-slate-900">
                        {item.term}
                        <span className="ml-2 text-slate-500 font-bold">
                          · {item.ko}
                        </span>
                      </h3>
                    </div>

                    <p className="mt-1.5 text-[11px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
                      {item.note}
                    </p>
                  </div>

                  <Link
                    href={`/?q=${encodeURIComponent(item.query)}`}
                    className="shrink-0 px-2.5 py-1 rounded-full border border-rose-200 bg-white text-[10px] md:text-[11px] font-bold text-rose-700 hover:bg-rose-50 transition-colors"
                  >
                    검색 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Paired terms */}
        <section aria-labelledby="trade-paired-terms-title" className="mb-5 md:mb-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/55 p-4 md:p-6">
            <div className="mb-4">
              <p className="text-[11px] md:text-xs font-bold text-slate-500 mb-1">
                Paired Trade Terms
              </p>
              <h2
                id="trade-paired-terms-title"
                className="text-lg md:text-xl font-black text-slate-900"
              >
                함께 보면 구분하기 쉬운 무역 용어
              </h2>
              <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
                서로 반대되거나 거래의 양쪽 역할을 나타내는 용어는 짝으로 비교하면 의미와 쓰임을 기억하기 쉽습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {usefulTradePairs.map((pair) => (
                <article
                  key={`${pair.left}-${pair.right}`}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center justify-center gap-3 md:gap-4">
                    <Link
                      href={`/?q=${encodeURIComponent(pair.leftQuery)}`}
                      className="flex-1 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-center hover:border-amber-200 hover:bg-amber-50/40 transition-colors"
                    >
                      <div className="text-[12px] md:text-[13px] font-extrabold text-slate-900">
                        {pair.left}
                      </div>
                      <div className="mt-0.5 text-[11px] md:text-[12px] text-slate-500">
                        {pair.leftKo}
                      </div>
                    </Link>

                    <span className="text-slate-300 font-black" aria-hidden="true">
                      ↔
                    </span>

                    <Link
                      href={`/?q=${encodeURIComponent(pair.rightQuery)}`}
                      className="flex-1 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-center hover:border-amber-200 hover:bg-amber-50/40 transition-colors"
                    >
                      <div className="text-[12px] md:text-[13px] font-extrabold text-slate-900">
                        {pair.right}
                      </div>
                      <div className="mt-0.5 text-[11px] md:text-[12px] text-slate-500">
                        {pair.rightKo}
                      </div>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Search paths */}
        <section aria-labelledby="trade-economy-search-paths-title" className="mb-5 md:mb-6">
          <div className="rounded-2xl border border-amber-100 bg-amber-50/35 p-4 md:p-6">
            <div className="mb-4">
              <p className="text-[11px] md:text-xs font-bold text-amber-600 mb-1">
                Related Search Paths
              </p>
              <h2
                id="trade-economy-search-paths-title"
                className="text-lg md:text-xl font-black text-slate-900"
              >
                연관 무역·경제 용어를 이어서 검색해 보세요
              </h2>
              <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
                한 용어에서 시작해 같은 거래·결제·경제 흐름에서 함께 검토되는 주변 개념으로 이동할 수 있습니다.
                각 항목은 X-DIC의 기존 메인 검색으로 연결됩니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchPaths.map((path) => (
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
                          className="px-2.5 py-1 rounded-full border border-amber-100 bg-amber-50/60 text-[11px] md:text-[12px] font-bold text-amber-700 hover:border-amber-300 hover:bg-amber-100 transition-colors"
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
          <section aria-labelledby="trade-economy-treasure-title" className="animate-in fade-in duration-700">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2
                id="trade-economy-treasure-title"
                className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2"
              >
                <span className="text-xl">🎁</span> 나만의 무역·경제 용어 보물창고
              </h2>

              {myHistory.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('보물창고를 비울까요?')) {
                      setMyHistory([]);
                      localStorage.removeItem('xdic_trade_economy_treasure');
                    }
                  }}
                  className="text-slate-400 hover:text-red-500 text-[11px] font-bold"
                >
                  비우기
                </button>
              )}
            </div>

            <div className="bg-amber-50/40 rounded-2xl p-4 md:p-5 border border-amber-100 min-h-[82px]">
              {myHistory.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {myHistory.map((item, index) => (
                    <Link
                      key={`${item}-${index}`}
                      href={`/?q=${encodeURIComponent(item)}`}
                      className="px-3 py-1.5 bg-white border border-amber-200 text-amber-700 text-[12px] md:text-sm font-bold rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center text-slate-400 text-[12px] md:text-sm italic py-3">
                  아직 저장된 검색어가 없습니다. 위 검색창에서 무역·경제 용어를 찾아보세요.
                </div>
              )}
            </div>
          </section>

          {/* Recommended */}
          <section aria-labelledby="recommended-trade-economy-terms-title">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-3">
              <div>
                <p className="text-[11px] md:text-xs font-bold text-amber-600 mb-1">
                  Recommended Trade &amp; Economy Terms
                </p>
                <h2
                  id="recommended-trade-economy-terms-title"
                  className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2"
                >
                  <span className="text-xl">📊</span> 추천 무역·경제 용어
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
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] md:text-[12px] font-bold rounded-full hover:border-amber-300 hover:text-amber-700 transition-all"
                  >
                    # {term.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* FAQ */}
        <section aria-labelledby="trade-economy-faq-title" className="mt-5 md:mt-6">
          <div className="mb-3">
            <p className="text-[11px] md:text-xs font-bold text-amber-600 mb-1">
              Trade &amp; Economy Search FAQ
            </p>
            <h2
              id="trade-economy-faq-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              무역·경제 용어 검색 FAQ
            </h2>
          </div>

          <div className="space-y-2.5">
            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                한글과 영어 무역·경제 용어를 모두 검색할 수 있나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                네. 한글 또는 영어 용어를 입력하면 X-DIC 메인 검색 결과로 이동하여
                관련 한영·영한 전문용어와 병렬 결과를 확인할 수 있습니다.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                무역용어를 거래 순서대로 보는 이유는 무엇인가요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                quotation, purchase order, commercial invoice, bill of lading처럼 서로 다른 문서는
                실제 거래의 서로 다른 단계에서 사용됩니다. 거래 흐름과 함께 보면 비슷해 보이는 용어의 역할을 구분하기 쉽고,
                주변 표현을 함께 검색하기도 편해집니다.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                order, charge, balance처럼 뜻이 많은 단어는 어떻게 검색하나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                가능하면 purchase order, service charge, trade balance처럼 실제 문서에서 쓰이는 더 긴 표현을 먼저 검색하세요.
                짧은 단어만 검색한 뒤에는 주변 용어와 병렬 결과를 함께 비교하는 것이 좋습니다.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                미니 해설과 실제 X-DIC 검색 결과는 어떤 차이가 있나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                미니 해설은 대표 용어의 기본 개념을 빠르게 이해하기 위한 안내입니다.
                실제 번역어 선택은 검색 결과의 전문용어·병렬 데이터와 사용하려는 계약서·송장·보고서 등의 문맥을 함께 확인해 결정하는 것이 좋습니다.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                실제 계약이나 통관 업무에 검색 결과를 그대로 사용해도 되나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                X-DIC은 전문용어와 번역 표현을 탐색하기 위한 사전 서비스입니다.
                실제 계약, 결제, 통관, 세금·관세 적용이 필요한 경우에는 해당 거래의 계약조건과
                관계 기관·금융기관·전문가의 최신 공식 자료를 함께 확인해 주세요.
              </p>
            </details>
          </div>
        </section>

        {/* Notice */}
        <section
          aria-labelledby="trade-economy-search-notice-title"
          className="mt-5 md:mt-6 rounded-2xl border border-amber-100 bg-amber-50/45 p-4 md:p-5"
        >
          <h2
            id="trade-economy-search-notice-title"
            className="text-sm md:text-base font-extrabold text-slate-900 mb-2"
          >
            X-DIC 무역·경제 용어 검색 이용 안내
          </h2>

          <p className="text-[11px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
            X-DIC의 무역·경제 용어 검색은 전문용어와 번역 표현을 탐색하기 위한 사전 서비스입니다.
            실제 계약, 결제, 통관, 금융·투자 또는 경제적 의사결정이 필요한 경우에는
            관련 법령·계약조건·공식 통계와 해당 분야 전문가의 최신 자료를 함께 확인해 주세요.
          </p>
        </section>
      </main>
    </div>
  );
}
