import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이용 안내 | X-DIC 무료 실용 번역사전',
  description:
    'X-DIC 한영·영한 검색, KOR·ENG 음성검색, 추천 문장, 참고 표현, 관련 검색 결과, X-DIC Insight, 전문용어 허브와 Travel·Business 콘텐츠 이용 방법을 안내합니다.',
  alternates: {
    canonical: 'https://www.x-dic.com/guide',
  },
  openGraph: {
    title: 'X-DIC 이용 안내',
    description:
      '검색창부터 추천 문장·참고 표현·전문용어·병렬 예문·음성검색까지 X-DIC을 사용하는 방법을 한 페이지에서 확인하세요.',
    url: 'https://www.x-dic.com/guide',
    siteName: 'X-DIC',
    type: 'website',
  },
};

const quickStart = [
  {
    no: '01',
    icon: '⌨️',
    title: '한국어 또는 영어를 입력합니다',
    description:
      '단어, 짧은 구, 실용 문장, 전문용어를 검색창에 입력합니다. 한국어와 영어를 모두 검색할 수 있습니다.',
  },
  {
    no: '02',
    icon: '🎙️',
    title: '필요하면 KOR·ENG 음성검색을 사용합니다',
    description:
      '검색창 오른쪽의 KOR 또는 ENG 마이크 아이콘을 선택하면 해당 언어의 음성 입력을 사용할 수 있습니다. 브라우저에서 마이크 권한을 요청하면 허용해 주세요.',
  },
  {
    no: '03',
    icon: '🔎',
    title: '검색 버튼으로 결과를 확인합니다',
    description:
      '검색어와 연결되는 추천 문장, 참고 표현, 관련 병렬 데이터와 전문용어 정보가 있는지 함께 살펴봅니다.',
  },
];

const resultBlocks = [
  {
    icon: '✨',
    title: '추천 문장 번역',
    description:
      '검색어와 관련성이 높은 한영·영한 병렬 문장을 별도 블록으로 보여줍니다. 입력한 문장 전체와 완전히 같은 문장이라는 뜻은 아니며, 비교에 도움이 되는 관련 문장일 수 있습니다.',
    tip: '검색 내용과 참고 문장을 나란히 보면서 주어·시제·목적어·상황이 같은지 확인해 보세요.',
  },
  {
    icon: '💡',
    title: '참고 표현',
    description:
      '검색어 안에서 확인할 가치가 있는 단어 또는 짧은 구의 대응 표현을 간단히 제공합니다. 하나의 표현에 여러 뜻이 있으면 여러 대응어가 함께 보일 수 있습니다.',
    tip: '참고 표현은 문장 전체 번역이 아니라 단어·구 단위의 보조 정보입니다.',
  },
  {
    icon: '📄',
    title: '관련 검색 결과',
    description:
      'X-DIC 데이터베이스에서 검색어 전체 또는 핵심 단어와 연결되는 한영·영한 데이터를 보여줍니다. 정확 일치와 부분 관련 결과가 함께 나타날 수 있습니다.',
    tip: '결과가 많을 때는 검색어를 조금 더 구체적으로 입력하면 범위를 좁힐 수 있습니다.',
  },
  {
    icon: '📘',
    title: 'X-DIC Insight',
    description:
      '현재 검색 결과와 직접 연결되는 전문용어·병렬 예문 등 보조 정보를 한곳에서 비교할 수 있도록 정리한 영역입니다.',
    tip: '검색 결과에서 주변 개념이나 실제 사용 예를 더 보고 싶을 때 활용해 보세요.',
  },
];

const searchExamples = [
  {
    title: '단어·짧은 구',
    examples: ['돈', 'advice', 'safe and sound'],
    note: '기본 뜻과 여러 대응 표현을 확인할 때 적합합니다.',
  },
  {
    title: '실용 문장',
    examples: ['시간이 필요해요.', 'I need a book.'],
    note: '추천 문장과 병렬 예문을 함께 비교할 수 있습니다.',
  },
  {
    title: '전문용어',
    examples: ['myocardial infarction', 'circuit breaker', 'bill of lading'],
    note: '전문용어 허브와 함께 살펴보면 관련 분야 용어를 이어서 탐색할 수 있습니다.',
  },
];

const hubs = [
  {
    icon: '🩺',
    href: '/medical',
    title: '의학',
    en: 'Medical',
    description: '질환·진단, 검사·소견, 약물·투약, 해부·처치 관련 용어',
  },
  {
    icon: '⚙️',
    href: '/engineering',
    title: '기계·전기·전자',
    en: 'Engineering',
    description: '기계 요소, 재료·제조, 전기·전력, 전자·제어 관련 용어',
  },
  {
    icon: '📊',
    href: '/trade-economy',
    title: '무역·경제',
    en: 'Trade & Economy',
    description: '무역 서류, 거래·결제, 환율·금리, 경제지표 관련 용어',
  },
  {
    icon: '💻',
    href: '/computer',
    title: '컴퓨터',
    en: 'Computer',
    description: '소프트웨어, 시스템·클라우드, 네트워크, 데이터베이스 관련 용어',
  },
];

const contentHubs = [
  {
    icon: '🧳',
    href: '/travel',
    title: 'X-DIC Travel',
    description:
      '공항·교통, 호텔, 식당, 쇼핑, 길찾기, 도움 요청 등 여행 상황별 실용 영어를 살펴봅니다.',
  },
  {
    icon: '💼',
    href: '/business',
    title: 'X-DIC Business',
    description:
      '이메일, 회의, 전화, 일정, 보고, 협상 등 업무 상황에서 자주 쓰는 실무 영어를 비교합니다.',
  },
  {
    icon: '📖',
    href: '/conversation',
    title: '필수 영어회화',
    description:
      '여행·일상·업무에서 활용할 수 있는 영어회화와 번역가 해설을 모아 봅니다.',
  },
  {
    icon: '💬',
    href: '/nuance',
    title: 'Nuance',
    description:
      '비슷해 보이는 단어와 표현의 의미·쓰임 차이를 비교합니다.',
  },
  {
    icon: '🧩',
    href: '/idiom',
    title: '숙어 해설',
    description:
      '관용 표현과 숙어가 실제 문맥에서 어떤 뜻으로 쓰이는지 확인합니다.',
  },
];

const usefulFunctions = [
  {
    icon: '🔊',
    title: '발음 듣기',
    description:
      '검색 결과나 영어회화에 스피커 아이콘이 보이면 해당 문장을 음성으로 들어볼 수 있습니다.',
  },
  {
    icon: '📋',
    title: '복사',
    description:
      '복사 아이콘이 제공되는 결과는 문장이나 표현을 클립보드로 복사해 다른 곳에서 활용할 수 있습니다.',
  },
  {
    icon: '⭐',
    title: '즐겨찾기 추가',
    description:
      '메인 검색창 아래의 빠른 메뉴에서 즐겨찾기 추가 기능을 사용할 수 있습니다.',
  },
  {
    icon: '📈',
    title: '실시간·인기 검색어',
    description:
      '다른 사용자가 최근 찾은 검색 흐름과 인기 검색어를 살펴보고 새로운 검색어를 발견할 수 있습니다.',
  },
];

const faq = [
  {
    question: '입력한 문장과 정확히 같은 문장이 없으면 어떻게 되나요?',
    answer:
      'X-DIC은 검색어 전체와 정확히 일치하는 데이터가 없을 때에도 핵심 단어와 관련 결과를 찾아볼 수 있도록 구성되어 있습니다. 이 경우 추천 문장이나 관련 검색 결과가 입력 문장과 완전히 같은 뜻이라는 의미는 아니므로 문맥을 비교해 주세요.',
  },
  {
    question: '추천 문장은 자동 번역 결과인가요?',
    answer:
      '추천 문장 영역은 X-DIC이 보유한 한영·영한 병렬 데이터와 검색 결과 중 현재 검색어와 비교할 가치가 있는 문장을 보여주는 영역입니다. 실시간 생성형 AI가 새 문장을 즉석에서 만들어 내는 방식과는 성격이 다릅니다.',
  },
  {
    question: '참고 표현과 문장 번역은 무엇이 다른가요?',
    answer:
      '참고 표현은 검색어에 포함된 단어 또는 짧은 구의 대응 정보를 보여주는 보조 영역입니다. 문장 전체의 의미를 설명하는 번역과는 역할이 다릅니다.',
  },
  {
    question: '전문용어는 메인 검색과 전문용어 허브 중 어디에서 찾아야 하나요?',
    answer:
      '둘 다 사용할 수 있습니다. 빠르게 찾을 때는 메인 검색을 이용하고, 같은 분야의 관련 용어·대표 검색 예·미니 해설까지 이어서 보고 싶다면 전문용어 허브를 이용하는 것이 좋습니다.',
  },
  {
    question: '중요한 전문 문서에도 그대로 사용해도 되나요?',
    answer:
      'X-DIC은 검색과 비교를 돕는 사전 서비스입니다. 의학·법률·재무·계약 등 중요한 전문 문서에서는 X-DIC 결과만으로 최종 판단하지 말고 공식 자료나 해당 분야 전문가의 확인과 함께 사용해 주세요.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'X-DIC 이용 안내',
  url: 'https://www.x-dic.com/guide',
  description:
    'X-DIC의 한영·영한 검색, 음성검색, 추천 문장, 참고 표현, 전문용어 허브와 실용 영어 콘텐츠 이용 방법을 안내합니다.',
  isPartOf: {
    '@type': 'WebSite',
    name: 'X-DIC',
    url: 'https://www.x-dic.com',
  },
};

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 py-6 md:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:border-blue-200 hover:text-blue-700 transition-colors"
            >
              ← 메인으로
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-1 rounded-full border border-sky-100 bg-sky-50/60 px-3 py-1.5 text-[12px] font-bold text-sky-700 hover:border-sky-200 transition-colors"
            >
              About X-DIC
            </Link>
            <Link
              href="/data-policy"
              className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50/60 px-3 py-1.5 text-[12px] font-bold text-emerald-700 hover:border-emerald-200 transition-colors"
            >
              데이터·편집 원칙
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 rounded-full border border-rose-100 bg-rose-50/60 px-3 py-1.5 text-[12px] font-bold text-rose-700 hover:border-rose-200 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1 rounded-full border border-violet-100 bg-violet-50/60 px-3 py-1.5 text-[12px] font-bold text-violet-700 hover:border-violet-200 transition-colors"
            >
              Privacy
            </Link>
          </div>

          <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.14em] text-blue-500">
            X-DIC Trust & Information
          </span>
        </div>

        <header className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/75 via-white to-violet-50/45 px-5 py-7 md:px-8 md:py-10">
          <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.16em] text-blue-500">
            X-DIC User Guide
          </p>

          <h1 className="mt-2 text-[28px] md:text-[38px] font-black tracking-tight text-slate-950">
            X-DIC 이용 안내
          </h1>

          <p className="mt-4 max-w-3xl text-[14px] md:text-[16px] leading-7 text-slate-600 break-keep">
            X-DIC은 단어 하나만 찾는 사전부터 실용 문장, 전문용어, 병렬 예문,
            여행·업무 영어까지 한 검색 흐름에서 이어서 살펴볼 수 있도록 구성되어 있습니다.
            처음 방문하셨다면 아래 순서대로 사용해 보세요.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-blue-100 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-blue-700">
              한영 · 영한
            </span>
            <span className="rounded-full border border-violet-100 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-violet-700">
              KOR · ENG 음성검색
            </span>
            <span className="rounded-full border border-emerald-100 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
              전문용어
            </span>
            <span className="rounded-full border border-amber-100 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-amber-700">
              병렬 예문
            </span>
            <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-slate-600">
              Travel · Business
            </span>
          </div>
        </header>

        <section className="mt-9" aria-labelledby="quick-start-title">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-500">
            01 · Quick Start
          </p>
          <h2
            id="quick-start-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            검색은 세 단계면 됩니다
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickStart.map((item) => (
              <article
                key={item.no}
                className="rounded-2xl border border-blue-100 bg-blue-50/20 p-4 md:p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xl" aria-hidden="true">{item.icon}</span>
                  <span className="text-[9px] font-black tracking-[0.14em] text-blue-400">
                    STEP {item.no}
                  </span>
                </div>
                <h3 className="mt-2 text-[14px] md:text-[15px] font-black text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[12px] md:text-[13px] leading-6 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3.5">
            <p className="text-[11px] md:text-[12px] leading-5 text-slate-600">
              <strong className="font-black text-slate-800">음성검색 팁:</strong>
              {' '}한국어를 말할 때는 KOR, 영어를 말할 때는 ENG 마이크를 선택하는 것이 좋습니다.
              주변 소음이 적고 짧게 말할수록 음성 입력을 확인하기 쉽습니다.
            </p>
          </div>
        </section>

        <section
          className="mt-10 rounded-3xl border border-violet-100 bg-violet-50/20 p-5 md:p-7"
          aria-labelledby="result-guide-title"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-violet-600">
            02 · Reading Search Results
          </p>
          <h2
            id="result-guide-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            검색 결과 블록은 이렇게 읽어보세요
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {resultBlocks.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-violet-100 bg-white p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-lg"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="text-[14px] md:text-[15px] font-black text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[12px] md:text-[13px] leading-6 text-slate-600">
                      {item.description}
                    </p>
                    <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-[10px] md:text-[11px] leading-5 text-slate-500">
                      {item.tip}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="search-examples-title">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-600">
            03 · What to Search
          </p>
          <h2
            id="search-examples-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            이런 검색어부터 시작해 보세요
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {searchExamples.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/15 p-4 md:p-5"
              >
                <h3 className="text-[14px] md:text-[15px] font-black text-slate-900">
                  {item.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.examples.map((example) => (
                    <span
                      key={example}
                      className="rounded-full border border-emerald-100 bg-white px-2.5 py-1 text-[10px] md:text-[11px] font-bold text-slate-700"
                    >
                      {example}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-[11px] md:text-[12px] leading-5 text-slate-500">
                  {item.note}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-[12px] font-extrabold text-white hover:bg-slate-800 transition-colors"
            >
              X-DIC에서 직접 검색하기 →
            </Link>
          </div>
        </section>

        <section
          className="mt-10 rounded-3xl border border-emerald-100 bg-emerald-50/25 p-5 md:p-7"
          aria-labelledby="terminology-guide-title"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-600">
            04 · Terminology Hubs
          </p>
          <h2
            id="terminology-guide-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            전문용어는 분야별 허브에서 더 깊게 볼 수 있습니다
          </h2>
          <p className="mt-2 max-w-3xl text-[12px] md:text-[14px] leading-6 text-slate-600">
            메인 검색은 빠른 검색에 적합하고, 전문용어 허브는 같은 분야의 대표 용어,
            연관 검색 흐름, 미니 해설까지 이어서 살펴볼 때 유용합니다.
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {hubs.map((hub) => (
              <Link
                key={hub.href}
                href={hub.href}
                className="rounded-2xl border border-emerald-100 bg-white p-4 md:p-5 hover:border-emerald-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl" aria-hidden="true">{hub.icon}</span>
                  <div>
                    <h3 className="text-[14px] md:text-[15px] font-black text-slate-900">
                      {hub.title}
                      <span className="ml-1.5 text-[10px] font-bold text-slate-400">
                        {hub.en}
                      </span>
                    </h3>
                    <p className="mt-1.5 text-[11px] md:text-[12px] leading-5 text-slate-600">
                      {hub.description}
                    </p>
                    <p className="mt-2 text-[10px] font-extrabold text-emerald-700">
                      허브 보기 →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="practical-content-title">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-600">
            05 · Practical Content
          </p>
          <h2
            id="practical-content-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            검색 밖에서도 표현을 이어서 살펴보세요
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {contentHubs.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-amber-100 bg-amber-50/15 p-4 md:p-5 hover:border-amber-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl" aria-hidden="true">{item.icon}</span>
                  <div>
                    <h3 className="text-[14px] md:text-[15px] font-black text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[11px] md:text-[12px] leading-5 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          className="mt-10 rounded-3xl border border-sky-100 bg-sky-50/25 p-5 md:p-7"
          aria-labelledby="useful-functions-title"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-sky-500">
            06 · Useful Functions
          </p>
          <h2
            id="useful-functions-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            함께 쓰면 편리한 기능
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {usefulFunctions.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-sky-100 bg-white p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl" aria-hidden="true">{item.icon}</span>
                  <div>
                    <h3 className="text-[14px] md:text-[15px] font-black text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[11px] md:text-[12px] leading-5 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="mt-10 rounded-3xl border border-indigo-100 bg-indigo-50/20 p-5 md:p-7"
          aria-labelledby="mobile-app-title"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-indigo-500">
            07 · Mobile App
          </p>
          <h2
            id="mobile-app-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            휴대폰에서도 X-DIC을 이용할 수 있습니다
          </h2>
          <p className="mt-2 max-w-3xl text-[12px] md:text-[14px] leading-6 text-slate-600">
            갤럭시에서는 Google Play, 아이폰에서는 App Store에서
            <strong className="font-black text-violet-700"> x-dic</strong>을 검색해 보세요.
            웹과 마찬가지로 이동 중에도 단어·문장·전문용어를 빠르게 찾아볼 수 있습니다.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-[11px] font-bold text-emerald-700">
              Galaxy · Google Play
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700">
              iPhone · App Store
            </span>
            <span className="rounded-full border border-violet-100 bg-white px-3 py-1.5 text-[11px] font-bold text-violet-700">
              검색어: x-dic
            </span>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="guide-faq-title">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-rose-500">
            08 · FAQ
          </p>
          <h2
            id="guide-faq-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            이용할 때 자주 생길 수 있는 질문
          </h2>

          <div className="mt-4 space-y-2.5">
            {faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-slate-200 bg-white px-4 py-3.5"
              >
                <summary className="cursor-pointer list-none text-[12px] md:text-[13px] font-black text-slate-900">
                  <span className="mr-2 text-rose-400 group-open:text-rose-600">Q.</span>
                  {item.question}
                </summary>
                <p className="mt-2 pl-6 text-[11px] md:text-[12px] leading-6 text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50/65 p-5 md:p-7">
          <h2 className="text-[18px] md:text-[22px] font-black text-slate-950">
            더 자세한 기준이 궁금하다면
          </h2>
          <p className="mt-2 max-w-3xl text-[12px] md:text-[14px] leading-6 text-slate-600">
            X-DIC의 서비스 목적과 데이터 정제 기준은 별도의 신뢰 페이지에서 확인할 수 있습니다.
            검색 결과의 성격과 한계를 이해한 뒤 사용하면 여러 대응 표현을 비교하는 데 더 도움이 됩니다.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/about"
              className="rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-[12px] font-extrabold text-sky-700 hover:border-sky-300 transition-colors"
            >
              About X-DIC
            </Link>
            <Link
              href="/data-policy"
              className="rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-[12px] font-extrabold text-emerald-700 hover:border-emerald-300 transition-colors"
            >
              데이터 및 편집 원칙
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-[12px] font-extrabold text-rose-700 hover:border-rose-300 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className="rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-[12px] font-extrabold text-violet-700 hover:border-violet-300 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/notice"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-extrabold text-slate-700 hover:border-blue-200 hover:text-blue-700 transition-colors"
            >
              공지사항 / FAQ
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-[12px] font-extrabold text-white hover:bg-slate-800 transition-colors"
            >
              X-DIC 검색하기
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
