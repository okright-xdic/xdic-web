import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '데이터 및 편집 원칙 | X-DIC',
  description:
    'X-DIC의 한영·영한 데이터 구성, 전문용어·병렬 문장·추천 문장·참고 표현의 역할, 정제·보류·수정 원칙과 검색 규칙의 운영 기준을 안내합니다.',
  alternates: {
    canonical: 'https://www.x-dic.com/data-policy',
  },
  openGraph: {
    title: 'X-DIC 데이터 및 편집 원칙',
    description:
      'X-DIC이 검색 데이터와 편집 콘텐츠를 어떻게 구분하고, 어떤 기준으로 정제·보류·수정하는지 설명합니다.',
    url: 'https://www.x-dic.com/data-policy',
    siteName: 'X-DIC',
    type: 'website',
  },
};

const dataTypes = [
  {
    icon: '🔤',
    title: '기본 한영·영한 대응 데이터',
    description:
      '단어, 짧은 구, 실용 문장처럼 한국어와 영어를 서로 대응해 검색할 수 있는 기본 데이터입니다. 한 표현에 하나의 대응만 있는 경우도 있고, 여러 뜻이나 번역 후보가 함께 존재하는 경우도 있습니다.',
  },
  {
    icon: '📚',
    title: '전문용어 데이터',
    description:
      '의학, 기계·전기·전자, 무역·경제, 컴퓨터 등 분야별 전문용어를 한영·영한으로 탐색할 수 있도록 구성합니다. 같은 용어라도 분야와 문맥에 따라 번역이 달라질 수 있음을 전제로 합니다.',
  },
  {
    icon: '📝',
    title: '병렬 문장 데이터',
    description:
      '한국어와 영어 문장을 한 쌍으로 보면서 실제 문장 안에서 표현이 어떻게 사용되는지 비교할 수 있도록 하는 데이터입니다. 단어 뜻만으로 판단하기 어려운 경우에 문맥을 확인하는 자료가 됩니다.',
  },
  {
    icon: '🧩',
    title: '검색 규칙·재사용 표현',
    description:
      '여러 문장에서 반복해서 사용할 수 있고 문맥 의존성이 낮은 짧은 구나 문형은 검색·번역 규칙으로 별도 관리할 수 있습니다. 문맥에 따라 뜻이 크게 달라지는 표현은 자동 치환 규칙으로 무리하게 고정하지 않습니다.',
  },
];

const resultLabels = [
  {
    label: '추천 문장',
    description:
      '현재 검색어와 관련성이 높은 병렬 문장 또는 검색 데이터 가운데 사용자에게 참고 가치가 높은 문장을 별도 블록으로 보여주는 영역입니다. 검색어 전체와 완전히 같은 문장이라는 뜻은 아닙니다.',
  },
  {
    label: '참고 표현',
    description:
      '검색어에 포함된 단어·짧은 구와 직접 대응하는 한영·영한 정보를 간단히 보여주는 영역입니다. 하나의 표현에 여러 대응어가 있으면 함께 제시될 수 있습니다.',
  },
  {
    label: '관련 검색 결과',
    description:
      '검색어 전체 또는 핵심 단어와 관련된 데이터베이스 결과입니다. 검색어와 완전히 동일한 문장뿐 아니라 부분적으로 연결되는 병렬 데이터가 함께 포함될 수 있습니다.',
  },
  {
    label: 'X-DIC Insight',
    description:
      '현재 검색 결과와 직접 연결되는 전문용어·병렬 예문 등 X-DIC 내부 탐색 정보를 한곳에서 비교할 수 있도록 정리한 보조 영역입니다.',
  },
];

const editorialChecks = [
  {
    no: '01',
    title: '한영 의미 대응',
    description:
      '한국어와 영어가 같은 핵심 의미를 전달하는지 먼저 확인합니다. 주어, 목적어, 긍정·부정, 의문문 여부가 서로 어긋나면 그대로 채택하지 않습니다.',
  },
  {
    no: '02',
    title: '문법과 자연스러움',
    description:
      '확실한 맞춤법·띄어쓰기·철자 오류와 기초 문법을 점검합니다. 의미가 분명한 경우에는 짧고 자연스러운 병렬 문장으로 정리할 수 있습니다.',
  },
  {
    no: '03',
    title: '문맥과 재사용성',
    description:
      '특정 인물·지역·브랜드·숫자·날짜·상황에 지나치게 묶인 문장은 범용 데이터나 자동 규칙으로 일반화하지 않습니다. 반복 활용이 가능한지 함께 봅니다.',
  },
  {
    no: '04',
    title: '중복과 길이',
    description:
      '업로드용 데이터는 정제 후 중복 여부와 문장 길이를 다시 확인합니다. 같은 데이터를 여러 결과 파일로 중복 업로드하지 않도록 구분합니다.',
  },
];

const holdReasons = [
  '한국어와 영어의 핵심 의미가 정확히 대응하지 않는 경우',
  '영어 문장이 불완전하거나 문법·자연스러움을 더 확인해야 하는 경우',
  '주어·시제·긍정/부정·의문문 등 문장 구조가 서로 어긋나는 경우',
  '고유명사·브랜드·국가·지역·숫자·날짜 등에 의존해 범용성이 낮은 경우',
  '거래·기술·업무 등 특정 전문 문맥에 지나치게 의존하는 경우',
  '의료·법률·정치·폭력·차별 등 별도 검토가 필요한 민감하거나 고위험 문맥인 경우',
  '문맥이 부족해 하나의 번역으로 확정하기 어려운 경우',
];

const phrasePrinciples = [
  {
    title: '짧고 재사용 가능한 표현을 우선합니다',
    description:
      '여러 문장에서 반복해 사용할 수 있는 구를 우선하며, 한 문장 전체를 그대로 PHRASE로 고정하는 방식은 가급적 피합니다.',
  },
  {
    title: '문맥 의존성이 낮아야 합니다',
    description:
      '한 표현의 번역이 특정 상황에서만 성립한다면 자동 규칙보다 일반 검색 데이터나 예문으로 남기는 편을 우선합니다.',
  },
  {
    title: '여러 자연스러운 뜻은 함께 보존할 수 있습니다',
    description:
      '가까운 한국어 대응이 둘 이상이면 하나를 억지로 버리기보다 여러 대응을 함께 보존하여 검색 시 비교할 수 있도록 합니다.',
  },
  {
    title: '이미 코드가 직접 처리하는 규칙과 중복하지 않습니다',
    description:
      '검색 엔진이 별도 문형 처리로 해결하는 표현을 다시 구문 규칙에 중복 등록하지 않도록 점검합니다. 불필요한 겹침은 예기치 않은 번역 충돌을 만들 수 있기 때문입니다.',
  },
];

const lifecycle = [
  {
    title: '원본·후보',
    description: '기존 한영·영한 원문, 전문용어, 병렬 문장과 새 후보를 수집합니다.',
  },
  {
    title: '정제·검토',
    description: '의미 대응, 문법, 재사용성, 문맥, 길이와 중복을 보수적으로 확인합니다.',
  },
  {
    title: '채택 또는 보류',
    description: '고신뢰 데이터는 업로드·규칙 후보로 분리하고, 확신하기 어려운 항목은 보류합니다.',
  },
  {
    title: '검색 반영',
    description: '데이터베이스 또는 검색 규칙에 반영해 실제 한영·영한 검색에서 사용합니다.',
  },
  {
    title: '회귀 확인·수정',
    description: '이전 검색 문장을 다시 테스트하고, 새 수정이 기존 결과를 해치지 않는지 반복 확인합니다.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'X-DIC 데이터 및 편집 원칙',
  url: 'https://www.x-dic.com/data-policy',
  description:
    'X-DIC의 한영·영한 검색 데이터 구성과 정제, 보류, 수정 및 검색 규칙 운영 원칙을 안내합니다.',
  isPartOf: {
    '@type': 'WebSite',
    name: 'X-DIC',
    url: 'https://www.x-dic.com',
  },
  about: {
    '@type': 'Thing',
    name: 'Bilingual dictionary data and editorial policy',
  },
};

export default function DataPolicyPage() {
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
              href="/guide"
              className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50/60 px-3 py-1.5 text-[12px] font-bold text-blue-700 hover:border-blue-200 transition-colors"
            >
              이용 안내
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

          <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.14em] text-emerald-600">
            X-DIC Trust & Information
          </span>
        </div>

        <header className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/65 via-white to-sky-50/55 px-5 py-7 md:px-8 md:py-10">
          <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.16em] text-emerald-600">
            Data & Editorial Principles
          </p>

          <h1 className="mt-2 text-[28px] md:text-[38px] font-black tracking-tight text-slate-950">
            X-DIC 데이터 및 편집 원칙
          </h1>

          <p className="mt-4 max-w-3xl text-[14px] md:text-[16px] leading-7 text-slate-600 break-keep">
            X-DIC은 한영·영한 검색 결과를 하나의 절대적인 정답으로 고정하기보다,
            <strong className="font-extrabold text-slate-800">
              {' '}데이터의 성격을 구분하고 여러 대응 표현과 문맥을 비교할 수 있게 하는 것
            </strong>
            을 중요하게 생각합니다. 이 페이지에서는 검색 데이터가 어떤 역할로
            나뉘고, 어떤 항목을 채택하거나 보류하며, 오류를 어떻게 보완하는지
            기본 원칙을 설명합니다.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-sky-100 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-sky-700">
              의미 대응
            </span>
            <span className="rounded-full border border-emerald-100 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
              보수적 정제
            </span>
            <span className="rounded-full border border-violet-100 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-violet-700">
              문맥 비교
            </span>
            <span className="rounded-full border border-amber-100 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-amber-700">
              보류 원칙
            </span>
            <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-slate-600">
              지속 수정
            </span>
          </div>
        </header>

        <section className="mt-9" aria-labelledby="data-types-title">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-sky-500">
            01 · Data Types
          </p>
          <h2
            id="data-types-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            검색에 쓰이는 데이터의 역할을 구분합니다
          </h2>
          <p className="mt-2 max-w-3xl text-[12px] md:text-[14px] leading-6 text-slate-600">
            X-DIC 검색 화면에 보이는 모든 정보가 같은 종류의 데이터는 아닙니다.
            기본 대응 데이터, 전문용어, 병렬 문장과 검색 규칙은 서로 다른 목적을
            가지고 있으며, 화면에서도 가능한 한 그 역할을 구분해 보여주는 방향을
            유지합니다.
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {dataTypes.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xl"
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
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="mt-10 rounded-3xl border border-blue-100 bg-blue-50/30 p-5 md:p-7"
          aria-labelledby="one-to-many-title"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-500">
            02 · One-to-one & One-to-many
          </p>
          <h2
            id="one-to-many-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            1:1 대응보다 1:다 대응이 더 자연스러운 경우가 있습니다
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <article className="rounded-2xl border border-blue-100 bg-white p-4 md:p-5">
              <h3 className="text-[14px] md:text-[15px] font-black text-slate-900">
                1:1 대응
              </h3>
              <p className="mt-1.5 text-[12px] md:text-[13px] leading-6 text-slate-600">
                특정 문맥에서 한 표현과 한 번역이 안정적으로 대응하면 간단하게 한 쌍으로 보여줄 수 있습니다.
              </p>
              <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 text-[11px] md:text-[12px]">
                <span className="font-extrabold text-slate-800">safe and sound</span>
                <span className="mx-2 text-slate-300">→</span>
                <span className="text-slate-600">무사히</span>
              </div>
            </article>

            <article className="rounded-2xl border border-violet-100 bg-white p-4 md:p-5">
              <h3 className="text-[14px] md:text-[15px] font-black text-slate-900">
                1:다 대응
              </h3>
              <p className="mt-1.5 text-[12px] md:text-[13px] leading-6 text-slate-600">
                하나의 표현에 가까운 뜻이 여러 개 있거나 문맥에 따라 번역이 달라질 때는 하나를 강제로 선택하기보다 여러 대응을 함께 보존할 수 있습니다.
              </p>
              <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 text-[11px] md:text-[12px]">
                <span className="font-extrabold text-slate-800">on cloud nine</span>
                <span className="mx-2 text-slate-300">→</span>
                <span className="text-slate-600">
                  날아갈 듯이 기쁜 · 세상을 다 가진 듯이 기쁜
                </span>
              </div>
            </article>
          </div>

          <p className="mt-3 text-[11px] md:text-[12px] leading-5 text-slate-500">
            사전 검색에서는 “가장 짧은 답 하나”보다 사용자가 문맥에 맞는 표현을 선택할 수 있도록 정보를 충분히 남기는 것이 더 유용할 수 있습니다.
          </p>
        </section>

        <section className="mt-10" aria-labelledby="result-labels-title">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-violet-500">
            03 · Search Result Labels
          </p>
          <h2
            id="result-labels-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            검색 화면의 각 정보는 의미가 다릅니다
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {resultLabels.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-violet-100 bg-violet-50/15 p-4 md:p-5"
              >
                <h3 className="text-[14px] md:text-[15px] font-black text-slate-900">
                  {item.label}
                </h3>
                <p className="mt-1.5 text-[12px] md:text-[13px] leading-6 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="mt-10 rounded-3xl border border-emerald-100 bg-emerald-50/25 p-5 md:p-7"
          aria-labelledby="editorial-checks-title"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-600">
            04 · Editorial Checks
          </p>
          <h2
            id="editorial-checks-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            데이터를 채택할 때 보는 기본 기준
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {editorialChecks.map((item) => (
              <article
                key={item.no}
                className="rounded-2xl border border-emerald-100 bg-white p-4 md:p-5"
              >
                <span className="text-[10px] font-black tracking-[0.14em] text-emerald-600">
                  {item.no}
                </span>
                <h3 className="mt-1.5 text-[14px] md:text-[15px] font-black text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[12px] md:text-[13px] leading-6 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-100 bg-white px-4 py-3.5">
            <p className="text-[11px] md:text-[12px] leading-5 text-slate-600">
              <strong className="font-black text-slate-800">편집의 기본 방향:</strong>
              {' '}뜻을 과감하게 “추측해서 채우는 것”보다, 의미 대응과 자연스러움에 확신이 부족한 데이터는 보류하고 추가 확인하는 쪽을 우선합니다.
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="hold-title">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-600">
            05 · Hold / Review
          </p>
          <h2
            id="hold-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            확신하기 어려운 데이터는 보류합니다
          </h2>
          <p className="mt-2 max-w-3xl text-[12px] md:text-[14px] leading-6 text-slate-600">
            원본에 포함되어 있다는 이유만으로 모든 문장을 바로 검색 데이터에 반영하지 않습니다. 아래와 같은 경우에는 보류하거나 별도 검토 대상으로 분리할 수 있습니다.
          </p>

          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {holdReasons.map((reason, index) => (
              <li
                key={reason}
                className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/30 px-4 py-3.5"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-black text-amber-700">
                  {index + 1}
                </span>
                <p className="text-[12px] md:text-[13px] leading-5 text-slate-600">
                  {reason}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="mt-10 rounded-3xl border border-violet-100 bg-violet-50/20 p-5 md:p-7"
          aria-labelledby="phrase-rules-title"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-violet-600">
            06 · Reusable Phrases & Rules
          </p>
          <h2
            id="phrase-rules-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            자동 규칙은 더 보수적으로 관리합니다
          </h2>
          <p className="mt-2 max-w-3xl text-[12px] md:text-[14px] leading-6 text-slate-600">
            데이터베이스에 검색 자료로 남겨두는 것과 자동 번역 규칙으로 등록하는 것은 다릅니다. 자동 규칙은 다른 문장에도 영향을 줄 수 있으므로 재사용성과 문맥 독립성을 더 엄격하게 봅니다.
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {phrasePrinciples.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-violet-100 bg-white p-4 md:p-5"
              >
                <h3 className="text-[14px] md:text-[15px] font-black text-slate-900">
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
              예를 들어 다의성이 크거나 목적어·격식·담화 문맥에 따라 뜻이 달라지는 표현은 자동 PHRASE로 단일 치환하기보다 기본 검색 데이터로 보존하여 사용자가 여러 뜻을 비교하도록 하는 편이 더 안전할 수 있습니다.
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="lifecycle-title">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
            07 · Data Lifecycle
          </p>
          <h2
            id="lifecycle-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            한 번 올리고 끝내지 않고 다시 확인합니다
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-2.5">
            {lifecycle.map((item, index) => (
              <article
                key={item.title}
                className="relative rounded-2xl border border-slate-200 bg-white p-3.5 md:p-4"
              >
                <span className="text-[9px] font-black tracking-[0.12em] text-slate-400">
                  STEP {index + 1}
                </span>
                <h3 className="mt-1 text-[13px] md:text-[14px] font-black text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[11px] md:text-[12px] leading-5 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="mt-10 rounded-3xl border border-rose-100 bg-rose-50/25 p-5 md:p-7"
          aria-labelledby="limitations-title"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-rose-500">
            08 · Accuracy & Limitations
          </p>
          <h2
            id="limitations-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            검색 결과의 한계도 함께 안내합니다
          </h2>

          <div className="mt-4 space-y-2.5 text-[12px] md:text-[13px] leading-6 text-slate-600">
            <p className="rounded-2xl border border-rose-100 bg-white px-4 py-3.5">
              X-DIC은 다양한 출처와 형태의 한영·영한 데이터를 검색·정리하는 서비스이므로, 모든 결과가 동일한 검수 수준이나 동일한 목적을 가진다고 보장하지 않습니다.
            </p>
            <p className="rounded-2xl border border-rose-100 bg-white px-4 py-3.5">
              같은 단어와 문장도 문맥·분야·시제·화자 관계에 따라 번역이 달라질 수 있습니다. 중요한 문서나 전문 분야에서는 X-DIC 결과만으로 판단하지 말고 공식 자료나 해당 분야 전문가의 확인과 함께 사용해 주세요.
            </p>
            <p className="rounded-2xl border border-rose-100 bg-white px-4 py-3.5">
              오류 또는 어색한 대응이 확인되면 데이터를 수정하거나 검색 규칙을 조정할 수 있으며, 새 수정이 기존 검색 품질을 해치지 않는지 회귀 테스트를 통해 반복 확인합니다.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-sky-100 bg-sky-50/35 p-5 md:p-7">
          <h2 className="text-[18px] md:text-[22px] font-black text-slate-950">
            X-DIC은 데이터의 양보다 검색에서의 쓰임을 함께 봅니다
          </h2>
          <p className="mt-2 max-w-3xl text-[12px] md:text-[14px] leading-6 text-slate-600">
            데이터가 많더라도 문맥과 의미가 맞지 않으면 좋은 사전이 되기 어렵습니다. X-DIC은 검색 가능한 데이터의 범위를 넓히는 동시에, 사용자가 결과의 성격을 이해하고 여러 대응 표현을 비교할 수 있도록 검색 화면과 콘텐츠 허브를 계속 정리합니다.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/about"
              className="rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-[12px] font-extrabold text-sky-700 hover:border-sky-300 transition-colors"
            >
              About X-DIC
            </Link>
            <Link
              href="/guide"
              className="rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-[12px] font-extrabold text-blue-700 hover:border-blue-300 transition-colors"
            >
              이용 안내
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
              href="/"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-[12px] font-extrabold text-white hover:bg-slate-800 transition-colors"
            >
              X-DIC 검색하기
            </Link>
            <Link
              href="/notice"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-extrabold text-slate-700 hover:border-blue-200 hover:text-blue-700 transition-colors"
            >
              공지사항 / FAQ
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
