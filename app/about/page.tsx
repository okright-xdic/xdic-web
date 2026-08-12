import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About X-DIC | 무료 실용 한영·영한 번역사전',
  description:
    'X-DIC의 서비스 목적, 데이터 구성, 검색 방식, 전문용어·병렬 예문·실용 영어 콘텐츠의 역할과 운영 원칙을 소개합니다.',
  alternates: {
    canonical: 'https://www.x-dic.com/about',
  },
  openGraph: {
    title: 'About X-DIC',
    description:
      '전문용어와 실제 한영·영한 데이터를 기반으로 검색과 비교 탐색을 돕는 무료 실용 번역사전 X-DIC을 소개합니다.',
    url: 'https://www.x-dic.com/about',
    siteName: 'X-DIC',
    type: 'website',
  },
};

const dataLayers = [
  {
    icon: '🔤',
    title: '기본 한영·영한 대응 데이터',
    description:
      '단어, 짧은 구, 실용 문장처럼 한국어와 영어를 서로 대응해 확인할 수 있는 검색 데이터입니다. 하나의 표현에 여러 대응어가 있는 경우에는 검색 결과를 함께 비교할 수 있습니다.',
  },
  {
    icon: '📚',
    title: '전문용어 데이터',
    description:
      '의학, 기계·전기·전자, 무역·경제, 컴퓨터 등 여러 분야의 한영·영한 전문용어를 검색하고 주변 관련 용어까지 이어서 탐색할 수 있도록 구성합니다.',
  },
  {
    icon: '📝',
    title: '병렬 문장·실제 사용 예',
    description:
      '한국어와 영어가 함께 수록된 병렬 데이터를 통해 단어 하나의 뜻뿐 아니라 문장 안에서 어떤 표현과 함께 사용되는지도 비교할 수 있도록 합니다.',
  },
  {
    icon: '💡',
    title: '편집형 실용 콘텐츠',
    description:
      '오늘의 영어회화, X-DIC Travel, X-DIC Business, Nuance, 숙어 해설처럼 검색 데이터만으로는 보기 어려운 용법과 상황을 별도의 콘텐츠로 정리합니다.',
  },
];

const searchSteps = [
  {
    no: '01',
    title: '검색어를 먼저 찾습니다',
    description:
      '한국어 또는 영어 검색어를 기준으로 X-DIC이 보유한 대응 데이터와 관련 결과를 찾습니다.',
  },
  {
    no: '02',
    title: '문장과 참고 표현을 함께 봅니다',
    description:
      '검색어와 연결되는 추천 문장, 참고 표현, 병렬 예문이 있는 경우 같은 화면에서 비교할 수 있습니다.',
  },
  {
    no: '03',
    title: '분야별 허브로 탐색을 넓힙니다',
    description:
      '전문용어, Travel, Business, Nuance, 숙어 등 관련 허브를 통해 검색 결과 주변의 개념과 표현을 이어서 살펴볼 수 있습니다.',
  },
];

const trustPoints = [
  'X-DIC은 실시간 생성형 AI 번역 결과만을 제공하는 서비스가 아니라, 저장된 한영·영한 데이터와 편집 콘텐츠를 중심으로 검색·비교하도록 설계된 번역사전입니다.',
  '같은 단어도 문맥, 품사, 분야에 따라 번역이 달라질 수 있으므로 하나의 결과를 절대적인 정답으로 제시하기보다 여러 대응 표현과 병렬 예문을 비교할 수 있도록 합니다.',
  '전문용어와 문장 데이터는 계속 추가·정리되며, 오류가 확인된 항목은 수정하고 검색 품질을 높이는 방향으로 지속적으로 보완합니다.',
  '의학·법률·재무처럼 전문적인 판단이 필요한 내용은 X-DIC 검색 결과만으로 결정하지 말고 해당 분야의 공식 자료나 전문가 확인과 함께 사용해야 합니다.',
];

const hubs = [
  { href: '/medical', label: '의학', en: 'Medical' },
  { href: '/engineering', label: '기계·전기·전자', en: 'Engineering' },
  { href: '/trade-economy', label: '무역·경제', en: 'Trade & Economy' },
  { href: '/computer', label: '컴퓨터', en: 'Computer' },
  { href: '/travel', label: '실용 영어', en: 'X-DIC Travel' },
  { href: '/business', label: '실무 영어', en: 'X-DIC Business' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About X-DIC',
  url: 'https://www.x-dic.com/about',
  description:
    'X-DIC의 서비스 목적, 데이터 구성과 검색 방식, 전문용어 및 실용 영어 콘텐츠를 소개합니다.',
  isPartOf: {
    '@type': 'WebSite',
    name: 'X-DIC',
    url: 'https://www.x-dic.com',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 py-6 md:py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:border-blue-200 hover:text-blue-700 transition-colors"
          >
            ← 메인으로
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/data-policy"
              className="text-[10px] md:text-[11px] font-extrabold text-emerald-700 hover:underline underline-offset-4"
            >
              데이터·편집 원칙 →
            </Link>
            <Link
              href="/guide"
              className="text-[10px] md:text-[11px] font-extrabold text-blue-700 hover:underline underline-offset-4"
            >
              이용 안내 →
            </Link>
            <Link
              href="/contact"
              className="text-[10px] md:text-[11px] font-extrabold text-rose-600 hover:underline underline-offset-4"
            >
              Contact →
            </Link>
            <Link
              href="/privacy"
              className="text-[10px] md:text-[11px] font-extrabold text-violet-600 hover:underline underline-offset-4"
            >
              Privacy →
            </Link>
            <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.14em] text-sky-500">
              X-DIC Trust & Information
            </span>
          </div>
        </div>

        <header className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50/80 via-white to-indigo-50/60 px-5 py-7 md:px-8 md:py-10">
          <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.16em] text-sky-500">
            About X-DIC
          </p>

          <h1 className="mt-2 text-[28px] md:text-[38px] font-black tracking-tight text-slate-950">
            검색하고, 비교하고, 이어서 살펴보는
            <br className="hidden md:block" /> 무료 실용 번역사전 X-DIC
          </h1>

          <p className="mt-4 max-w-3xl text-[14px] md:text-[16px] leading-7 text-slate-600 break-keep">
            X-DIC은 한국어와 영어의 단어·구·문장·전문용어를 검색하고,
            실제 병렬 데이터와 관련 표현을 함께 비교할 수 있도록 만든 한영·영한
            번역사전 서비스입니다. 단순히 한 줄의 번역 결과만 보여주는 것보다
            <strong className="font-extrabold text-slate-800">
              {' '}검색어 주변의 표현과 용례를 함께 탐색하는 것
            </strong>
            을 중요하게 생각합니다.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-sky-100 bg-white/85 px-3 py-1.5 text-[11px] font-bold text-sky-700">
              한영 · 영한 검색
            </span>
            <span className="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
              전문용어
            </span>
            <span className="rounded-full border border-violet-100 bg-white/85 px-3 py-1.5 text-[11px] font-bold text-violet-700">
              병렬 예문
            </span>
            <span className="rounded-full border border-amber-100 bg-white/85 px-3 py-1.5 text-[11px] font-bold text-amber-700">
              Travel · Business
            </span>
            <span className="rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-[11px] font-bold text-slate-600">
              무료 이용
            </span>
          </div>
        </header>

        <section className="mt-8 md:mt-10" aria-labelledby="what-is-xdic">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-500">
            What X-DIC Is
          </p>
          <h2
            id="what-is-xdic"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            X-DIC이 지향하는 번역사전
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <article className="rounded-2xl border border-slate-200 p-4 md:p-5">
              <span className="text-xl" aria-hidden="true">🔎</span>
              <h3 className="mt-2 text-[15px] font-black text-slate-900">검색 중심</h3>
              <p className="mt-1.5 text-[12px] md:text-[13px] leading-6 text-slate-600">
                알고 싶은 단어나 문장을 직접 검색하고, 관련 결과를 빠르게 비교하는 것을 서비스의 출발점으로 삼습니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-4 md:p-5">
              <span className="text-xl" aria-hidden="true">⚖️</span>
              <h3 className="mt-2 text-[15px] font-black text-slate-900">비교 중심</h3>
              <p className="mt-1.5 text-[12px] md:text-[13px] leading-6 text-slate-600">
                하나의 단어에 여러 번역이 가능한 경우, 단일 답만 고정하기보다 문장과 병렬 예문을 함께 보며 적절한 표현을 판단하도록 돕습니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-4 md:p-5">
              <span className="text-xl" aria-hidden="true">🧭</span>
              <h3 className="mt-2 text-[15px] font-black text-slate-900">탐색 중심</h3>
              <p className="mt-1.5 text-[12px] md:text-[13px] leading-6 text-slate-600">
                검색 결과에서 전문용어, Travel, Business, Nuance, 숙어 등의 관련 콘텐츠로 이어서 탐색할 수 있도록 구성합니다.
              </p>
            </article>
          </div>
        </section>

        <section
          className="mt-10 rounded-3xl border border-emerald-100 bg-emerald-50/25 p-5 md:p-7"
          aria-labelledby="xdic-data-structure"
        >
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-600">
              X-DIC Data Structure
            </p>
            <h2
              id="xdic-data-structure"
              className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
            >
              X-DIC 데이터는 어떻게 구성되어 있나요?
            </h2>
            <p className="mt-2 text-[12px] md:text-[14px] leading-6 text-slate-600">
              X-DIC은 한 종류의 데이터만을 보여주는 사전이 아닙니다. 검색에 사용되는 기본 대응 데이터와 전문용어, 병렬 문장, 사람이 읽고 탐색하기 쉽도록 정리한 콘텐츠를 서로 다른 역할로 나누어 제공합니다.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            {dataLayers.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-emerald-100/80 bg-white p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg"
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

          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3.5">
            <p className="text-[11px] md:text-[12px] leading-5 text-amber-900">
              <strong className="font-black">중요:</strong> 검색 결과의 모든 항목이 같은 성격의 데이터는 아닙니다. 정확히 일치하는 사전 데이터, 관련 병렬 예문, 참고 표현, 추천 문장 등은 역할이 서로 다르므로 X-DIC은 화면에서 가능한 한 구분하여 보여주는 방향으로 개선하고 있습니다.
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="how-xdic-search-works">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-violet-500">
            Search & Explore
          </p>
          <h2
            id="how-xdic-search-works"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            검색 결과를 보는 방법
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {searchSteps.map((item) => (
              <article
                key={item.no}
                className="rounded-2xl border border-violet-100 bg-violet-50/20 p-4 md:p-5"
              >
                <span className="text-[10px] font-black tracking-[0.14em] text-violet-500">
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
        </section>

        <section
          className="mt-10 rounded-3xl border border-slate-200 bg-slate-50/55 p-5 md:p-7"
          aria-labelledby="xdic-hubs"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
            Explore X-DIC
          </p>
          <h2
            id="xdic-hubs"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            검색에서 이어지는 X-DIC 콘텐츠
          </h2>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {hubs.map((hub) => (
              <Link
                key={hub.href}
                href={hub.href}
                className="rounded-2xl border border-slate-200 bg-white px-3.5 py-3 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <p className="text-[12px] md:text-[13px] font-black text-slate-900">
                  {hub.label}
                </p>
                <p className="mt-0.5 text-[10px] md:text-[11px] text-slate-400">
                  {hub.en}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/conversation"
              className="rounded-full border border-blue-100 bg-white px-3 py-1.5 text-[11px] font-bold text-blue-700 hover:border-blue-200 transition-colors"
            >
              필수 영어회화 →
            </Link>
            <Link
              href="/nuance"
              className="rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-[11px] font-bold text-emerald-700 hover:border-emerald-200 transition-colors"
            >
              Nuance →
            </Link>
            <Link
              href="/idiom"
              className="rounded-full border border-violet-100 bg-white px-3 py-1.5 text-[11px] font-bold text-violet-700 hover:border-violet-200 transition-colors"
            >
              숙어 해설 →
            </Link>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="xdic-trust-principles">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-rose-500">
            Trust & Limitations
          </p>
          <h2
            id="xdic-trust-principles"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            X-DIC이 중요하게 생각하는 점
          </h2>

          <ul className="mt-4 space-y-2.5">
            {trustPoints.map((point, index) => (
              <li
                key={point}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3.5"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-600">
                  {index + 1}
                </span>
                <p className="text-[12px] md:text-[13px] leading-6 text-slate-600">
                  {point}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-100 bg-blue-50/35 p-5 md:p-7">
          <h2 className="text-[18px] md:text-[22px] font-black text-slate-950">
            무료로 이용할 수 있는 실용 번역사전
          </h2>
          <p className="mt-2 max-w-3xl text-[12px] md:text-[14px] leading-6 text-slate-600">
            X-DIC은 사용자가 일상 문장, 여행·업무 표현, 전문용어를 부담 없이 검색하고 비교할 수 있는 무료 서비스의 방향을 유지합니다. 검색 데이터와 콘텐츠는 계속 추가·정리하며, 이용자가 더 쉽게 필요한 표현을 찾을 수 있도록 검색 화면과 분야별 허브를 함께 개선합니다.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-[12px] font-extrabold text-white hover:bg-slate-800 transition-colors"
            >
              X-DIC 검색하기
            </Link>
            <Link
              href="/data-policy"
              className="rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-[12px] font-extrabold text-emerald-700 hover:border-emerald-300 transition-colors"
            >
              데이터 및 편집 원칙
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
              href="/notice"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-extrabold text-slate-700 hover:border-blue-200 hover:text-blue-700 transition-colors"
            >
              공지사항 / FAQ
            </Link>
            <Link
              href="/sitemap"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-extrabold text-slate-700 hover:border-blue-200 hover:text-blue-700 transition-colors"
            >
              사이트맵
            </Link>
          </div>
        </section>

        <div className="mt-8 border-t border-slate-200 pt-5 text-[10px] md:text-[11px] leading-5 text-slate-400">
          <p>
            운영자·사업자 정보와 연락처, 이용약관 및 개인정보처리방침은 사이트 하단에서 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </main>
  );
}
