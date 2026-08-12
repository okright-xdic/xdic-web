import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보 안내 | X-DIC',
  description:
    'X-DIC 이용 중 개인정보와 관련해 알아두면 좋은 사항, 브라우저 저장 기능, 이메일 문의, 외부 서비스 안내와 정식 개인정보처리방침 문서를 확인할 수 있습니다.',
  alternates: {
    canonical: 'https://www.x-dic.com/privacy',
  },
  openGraph: {
    title: 'X-DIC 개인정보 안내',
    description:
      'X-DIC 개인정보 관련 이용 안내와 정식 개인정보처리방침 문서를 확인하세요.',
    url: 'https://www.x-dic.com/privacy',
    siteName: 'X-DIC',
    type: 'website',
  },
};

const privacyOverview = [
  {
    icon: '🔎',
    title: '검색창에는 필요한 검색어만 입력해 주세요',
    description:
      'X-DIC 검색창은 단어·구·문장·전문용어를 찾기 위한 공간입니다. 비밀번호, 주민등록번호, 금융정보, 건강정보처럼 검색에 불필요한 개인정보나 민감한 정보는 입력하지 않는 것을 권합니다.',
  },
  {
    icon: '💾',
    title: '일부 편의 기능은 브라우저 저장공간을 사용할 수 있습니다',
    description:
      '최근 검색어 또는 개인 보관 기능처럼 브라우저에서 다시 불러오기 위한 일부 기능은 localStorage 등 브라우저 저장공간을 이용할 수 있습니다. 이러한 정보는 브라우저 설정이나 사이트 데이터 삭제를 통해 사용자가 직접 지울 수 있습니다.',
  },
  {
    icon: '✉️',
    title: '이메일 문의는 사용자가 보내는 정보를 포함합니다',
    description:
      'Contact 페이지에서 이메일을 보내면 발신 이메일 주소와 사용자가 작성한 문의 내용이 전달됩니다. 문의에 필요하지 않은 개인정보는 함께 보내지 않는 것이 좋습니다.',
  },
  {
    icon: '🌐',
    title: '광고·앱스토어 등 외부 서비스가 함께 사용될 수 있습니다',
    description:
      '웹사이트 또는 앱에서 광고, 앱스토어, 호스팅 등 외부 서비스가 사용되는 경우 해당 서비스 제공자의 쿠키·기기정보·개인정보 처리 기준이 별도로 적용될 수 있습니다. 구체적인 법적 처리 내용은 아래 정식 정책 문서를 기준으로 확인해 주세요.',
  },
];

const userChoices = [
  {
    no: '01',
    title: '검색어에 개인정보를 넣지 않기',
    description:
      '사전 검색과 번역에 필요하지 않은 이름, 연락처, 계정정보, 비밀번호, 주민등록번호 등은 검색어에 포함하지 않는 것을 권합니다.',
  },
  {
    no: '02',
    title: '브라우저 저장정보 직접 관리하기',
    description:
      '브라우저의 사이트 데이터 또는 저장공간을 삭제하면 localStorage 등에 저장된 최근 검색·보관 정보도 함께 삭제될 수 있습니다.',
  },
  {
    no: '03',
    title: '문의 메일에는 필요한 정보만 보내기',
    description:
      '오류 제보에는 검색어, 문제가 있는 결과, 제안하는 수정 정도면 충분한 경우가 많습니다. 신분증이나 민감한 개인정보를 첨부할 필요는 없습니다.',
  },
  {
    no: '04',
    title: '정식 개인정보처리방침 확인하기',
    description:
      '개인정보의 처리 목적, 처리 항목, 보유기간, 제3자 제공·처리위탁·국외이전 등 구체적인 법적 사항은 정식 개인정보처리방침 문서를 확인해 주세요.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'X-DIC 개인정보 안내',
  url: 'https://www.x-dic.com/privacy',
  dateModified: '2026-08-10',
  description:
    'X-DIC 개인정보 관련 이용 안내와 정식 개인정보처리방침 문서를 연결하는 신뢰 정보 페이지입니다.',
  isPartOf: {
    '@type': 'WebSite',
    name: 'X-DIC',
    url: 'https://www.x-dic.com',
  },
  publisher: {
    '@type': 'Organization',
    name: '케이제이트랜스',
    alternateName: 'X-DIC',
    email: 'zzangth@gmail.com',
  },
};

export default function PrivacyPage() {
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
          </div>

          <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.14em] text-violet-500">
            X-DIC Trust & Information
          </span>
        </div>

        <header className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/55 via-white to-sky-50/55 px-5 py-7 md:px-8 md:py-10">
          <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.16em] text-violet-500">
            Privacy at X-DIC
          </p>

          <h1 className="mt-2 text-[28px] md:text-[38px] font-black tracking-tight text-slate-950">
            X-DIC 개인정보 안내
          </h1>

          <p className="mt-4 max-w-3xl text-[14px] md:text-[16px] leading-7 text-slate-600 break-keep">
            이 페이지는 X-DIC을 이용할 때 개인정보와 관련해 알아두면 좋은 내용을
            쉽게 설명하는 안내 페이지입니다. 구체적인 법적 처리 기준과 권리는
            아래의 <strong className="font-black text-slate-800">정식 개인정보처리방침 문서</strong>를
            기준으로 확인해 주세요.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-violet-100 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-violet-700">
              개인정보 최소 입력
            </span>
            <span className="rounded-full border border-blue-100 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-blue-700">
              브라우저 저장정보 관리
            </span>
            <span className="rounded-full border border-emerald-100 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
              정식 정책 문서 연결
            </span>
          </div>
        </header>

        <section className="mt-9" aria-labelledby="privacy-overview-title">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-violet-500">
            01 · Privacy Overview
          </p>
          <h2
            id="privacy-overview-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            X-DIC 이용 중 알아두면 좋은 개인정보 사항
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {privacyOverview.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-violet-100 bg-violet-50/15 p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg"
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
          className="mt-10 rounded-3xl border border-emerald-100 bg-emerald-50/25 p-5 md:p-7"
          aria-labelledby="official-policy-title"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-600">
            02 · Official Privacy Documents
          </p>
          <h2
            id="official-policy-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            정식 이용약관·개인정보처리방침
          </h2>

          <p className="mt-2 max-w-3xl text-[12px] md:text-[14px] leading-6 text-slate-600">
            개인정보의 구체적인 처리 목적·항목·보유기간, 제3자 제공 또는 처리위탁,
            국외이전, 파기, 정보주체의 권리 등 적용되는 상세 사항은 현재 제공 중인
            정식 문서를 확인해 주세요.
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <a
              href="/docs/terms_ko.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-emerald-100 bg-white p-4 md:p-5 hover:border-emerald-200 hover:shadow-sm transition-all"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-emerald-600">
                Korean
              </p>
              <h3 className="mt-1 text-[14px] md:text-[15px] font-black text-slate-900">
                이용약관 및 개인정보처리방침(한글)
              </h3>
              <p className="mt-2 text-[11px] md:text-[12px] leading-5 text-slate-500">
                한글 정식 정책 문서를 새 창에서 확인합니다.
              </p>
              <p className="mt-3 text-[11px] font-extrabold text-emerald-700">
                문서 열기 →
              </p>
            </a>

            <a
              href="/docs/terms_en.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-sky-100 bg-white p-4 md:p-5 hover:border-sky-200 hover:shadow-sm transition-all"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-sky-600">
                English
              </p>
              <h3 className="mt-1 text-[14px] md:text-[15px] font-black text-slate-900">
                Terms & Privacy Policy (English)
              </h3>
              <p className="mt-2 text-[11px] md:text-[12px] leading-5 text-slate-500">
                영어 정식 정책 문서를 새 창에서 확인합니다.
              </p>
              <p className="mt-3 text-[11px] font-extrabold text-sky-700">
                Open document →
              </p>
            </a>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3.5">
            <p className="text-[11px] md:text-[12px] leading-5 text-amber-900">
              <strong className="font-black">중요:</strong>
              {' '}이 페이지의 쉬운 설명과 정식 문서의 내용이 다르게 보이는 경우에는
              정식 이용약관·개인정보처리방침 문서를 우선하여 확인해 주세요.
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="user-choice-title">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-500">
            03 · Your Choices
          </p>
          <h2
            id="user-choice-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            사용자가 직접 관리할 수 있는 부분
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {userChoices.map((item) => (
              <article
                key={item.no}
                className="rounded-2xl border border-blue-100 bg-blue-50/15 p-4 md:p-5"
              >
                <span className="text-[9px] font-black tracking-[0.14em] text-blue-400">
                  {item.no}
                </span>
                <h3 className="mt-1.5 text-[14px] md:text-[15px] font-black text-slate-900">
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
          aria-labelledby="privacy-contact-title"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-rose-500">
            04 · Privacy Contact
          </p>
          <h2
            id="privacy-contact-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            개인정보 관련 문의
          </h2>

          <p className="mt-2 max-w-3xl text-[12px] md:text-[14px] leading-6 text-slate-600">
            개인정보처리방침, 개인정보 관련 권리 또는 X-DIC의 데이터 처리와 관련해
            확인할 사항이 있다면 Contact 페이지 또는 아래 이메일을 이용해 주세요.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="mailto:zzangth@gmail.com?subject=%5BX-DIC%5D%20%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%20%EA%B4%80%EB%A0%A8%20%EB%AC%B8%EC%9D%98"
              className="rounded-xl bg-rose-700 px-4 py-2.5 text-[12px] font-extrabold text-white hover:bg-rose-800 transition-colors"
            >
              개인정보 문의 메일 작성 →
            </a>
            <Link
              href="/contact"
              className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-[12px] font-extrabold text-rose-700 hover:border-rose-300 transition-colors"
            >
              Contact 페이지
            </Link>
          </div>

          <p className="mt-3 text-[11px] md:text-[12px] text-slate-500">
            대표 이메일: <strong className="font-extrabold text-slate-700">zzangth@gmail.com</strong>
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50/65 p-5 md:p-7">
          <h2 className="text-[18px] md:text-[22px] font-black text-slate-950">
            X-DIC의 다른 신뢰 정보
          </h2>
          <p className="mt-2 max-w-3xl text-[12px] md:text-[14px] leading-6 text-slate-600">
            X-DIC의 서비스 목적, 데이터 편집 기준과 검색 이용 방법도 별도의 신뢰 페이지에서 확인할 수 있습니다.
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
          </div>
        </section>
      </div>
    </main>
  );
}
