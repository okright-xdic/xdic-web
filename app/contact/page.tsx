import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact X-DIC | 문의·데이터 오류 제보',
  description:
    'X-DIC 일반 문의, 데이터·번역 오류 제보, 개인정보 관련 문의 방법과 운영자·사업자 정보를 안내합니다.',
  alternates: {
    canonical: 'https://www.x-dic.com/contact',
  },
  openGraph: {
    title: 'Contact X-DIC',
    description:
      'X-DIC 서비스 이용 문의, 데이터 오류 제보, 개인정보 관련 문의 및 운영자 정보를 확인하세요.',
    url: 'https://www.x-dic.com/contact',
    siteName: 'X-DIC',
    type: 'website',
  },
};


const errorReportFields = [
  {
    label: '1. 검색어',
    example: '예: 아직은 시간이 필요해.',
  },
  {
    label: '2. 문제가 있는 결과',
    example: '추천 문장 / 참고 표현 / 관련 검색 결과 중 어느 부분인지 적어 주세요.',
  },
  {
    label: '3. 제안하는 수정',
    example: '가능하다면 더 자연스럽거나 정확하다고 생각하는 한영·영한 표현을 적어 주세요.',
  },
  {
    label: '4. 참고 정보',
    example: '전문용어라면 분야명이나 참고할 공식 자료가 있으면 함께 알려주시면 도움이 됩니다.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact X-DIC',
  url: 'https://www.x-dic.com/contact',
  description:
    'X-DIC 일반 문의, 데이터 오류 제보, 개인정보 관련 문의 및 운영자 정보를 안내합니다.',
  mainEntity: {
    '@type': 'Organization',
    name: '케이제이트랜스',
    alternateName: 'X-DIC',
    url: 'https://www.x-dic.com',
    email: 'zzangth@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '화정로 280번길 9-1',
      addressLocality: '서구',
      addressRegion: '광주광역시',
      addressCountry: 'KR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'zzangth@gmail.com',
      availableLanguage: ['Korean', 'English'],
    },
  },
};

export default function ContactPage() {
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
              href="/privacy"
              className="inline-flex items-center gap-1 rounded-full border border-violet-100 bg-violet-50/60 px-3 py-1.5 text-[12px] font-bold text-violet-700 hover:border-violet-200 transition-colors"
            >
              Privacy
            </Link>
          </div>

          <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.14em] text-rose-500">
            X-DIC Trust & Information
          </span>
        </div>

        <header className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50/55 via-white to-sky-50/55 px-5 py-7 md:px-8 md:py-10">
          <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.16em] text-rose-500">
            Contact X-DIC
          </p>

          <h1 className="mt-2 text-[28px] md:text-[38px] font-black tracking-tight text-slate-950">
            문의와 데이터 오류 제보
          </h1>

          <p className="mt-4 max-w-3xl text-[14px] md:text-[16px] leading-7 text-slate-600 break-keep">
            X-DIC 이용 중 궁금한 점이나 검색 데이터의 오류를 발견하셨다면 이메일로 알려주세요.
            문의 목적을 구분해 보내주시면 내용을 확인하는 데 도움이 됩니다.
          </p>

        </header>

        <section className="mt-9" aria-labelledby="contact-methods-title">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-rose-500">
            01 · Contact
          </p>
          <h2
            id="contact-methods-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            문의는 대표 이메일로 보내주세요
          </h2>

          <p className="mt-2 max-w-3xl text-[12px] md:text-[14px] leading-6 text-slate-600">
            사이트 이용 문의, 데이터·번역 오류 제보, 개인정보 관련 문의는 아래 대표 이메일로 보내주시면 됩니다.
          </p>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
            <p className="text-[11px] md:text-[12px] font-black text-slate-500">
              대표 이메일
            </p>
            <p className="mt-1 text-[15px] md:text-[17px] font-black text-blue-700">
              zzangth@gmail.com
            </p>
            <p className="mt-2 text-[10px] md:text-[11px] leading-5 text-slate-500">
              문의 내용에 따라 확인에 시간이 필요할 수 있으며, 모든 제안이나 수정 요청이 그대로 반영되는 것은 아닙니다.
            </p>
          </div>
        </section>

        <section
          className="mt-10 rounded-3xl border border-emerald-100 bg-emerald-50/25 p-5 md:p-7"
          aria-labelledby="error-report-title"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-600">
            02 · Data Error Report
          </p>
          <h2
            id="error-report-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            데이터 오류를 제보할 때 이렇게 보내주세요
          </h2>
          <p className="mt-2 max-w-3xl text-[12px] md:text-[14px] leading-6 text-slate-600">
            검색 결과를 다시 확인할 수 있도록 아래 정보를 함께 보내주시면 오류를 찾고 비교하는 데 도움이 됩니다.
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {errorReportFields.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-emerald-100 bg-white p-4"
              >
                <h3 className="text-[13px] md:text-[14px] font-black text-slate-900">
                  {item.label}
                </h3>
                <p className="mt-1.5 text-[11px] md:text-[12px] leading-5 text-slate-600">
                  {item.example}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3.5">
            <p className="text-[11px] md:text-[12px] leading-5 text-amber-900">
              <strong className="font-black">전문용어 제보:</strong>
              {' '}의학·법률·재무·기술 등 전문 분야의 수정 제안은 가능하면 공식 자료명이나 분야 정보를 함께 알려주세요.
              X-DIC은 중요한 전문 문맥을 임의로 단정하기보다 추가 확인하는 방향을 우선합니다.
            </p>
          </div>

        </section>

        <section className="mt-10" aria-labelledby="operator-info-title">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
            03 · Operator Information
          </p>
          <h2
            id="operator-info-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            X-DIC 운영자·사업자 정보
          </h2>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full border-collapse text-left">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <th
                    scope="row"
                    className="px-4 py-3.5 align-top text-[11px] font-black text-slate-500"
                    style={{ width: '150px' }}
                  >
                    상호명
                  </th>
                  <td className="px-4 py-3.5 text-[12px] md:text-[13px] font-bold text-slate-800">
                    케이제이트랜스
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-4 py-3.5 align-top text-[11px] font-black text-slate-500"
                    style={{ width: '150px' }}
                  >
                    대표
                  </th>
                  <td className="px-4 py-3.5 text-[12px] md:text-[13px] font-bold text-slate-800">
                    장태훈
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-4 py-3.5 align-top text-[11px] font-black text-slate-500"
                    style={{ width: '150px' }}
                  >
                    주소
                  </th>
                  <td className="px-4 py-3.5 text-[12px] md:text-[13px] text-slate-700">
                    광주광역시 서구 화정로 280번길 9-1
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-4 py-3.5 align-top text-[11px] font-black text-slate-500"
                    style={{ width: '150px' }}
                  >
                    사업자등록 번호
                  </th>
                  <td className="px-4 py-3.5 text-[12px] md:text-[13px] text-slate-700">
                    408-90-79721
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-4 py-3.5 align-top text-[11px] font-black text-slate-500"
                    style={{ width: '150px' }}
                  >
                    통신판매등록번호
                  </th>
                  <td className="px-4 py-3.5 text-[12px] md:text-[13px] text-slate-700">
                    2018-광주서구-0127
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-4 py-3.5 align-top text-[11px] font-black text-slate-500"
                    style={{ width: '150px' }}
                  >
                    이메일
                  </th>
                  <td className="px-4 py-3.5 text-[12px] md:text-[13px] font-extrabold text-blue-700">
                    zzangth@gmail.com
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section
          className="mt-10 rounded-3xl border border-violet-100 bg-violet-50/20 p-5 md:p-7"
          aria-labelledby="privacy-terms-title"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-violet-500">
            04 · Terms & Privacy
          </p>
          <h2
            id="privacy-terms-title"
            className="mt-1 text-[21px] md:text-[27px] font-black text-slate-950"
          >
            이용약관과 개인정보처리방침
          </h2>
          <p className="mt-2 max-w-3xl text-[12px] md:text-[14px] leading-6 text-slate-600">
            현재 X-DIC의 이용약관 및 개인정보처리방침은 한글과 영어 문서로 제공하고 있습니다.
            개인정보 관련 문의도 위 대표 이메일을 통해 접수할 수 있습니다.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/privacy"
              className="rounded-xl border border-violet-200 bg-violet-700 px-4 py-2.5 text-[12px] font-extrabold text-white hover:bg-violet-800 transition-colors"
            >
              개인정보 안내 페이지
            </Link>
            <a
              href="/docs/terms_ko.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-[12px] font-extrabold text-violet-700 hover:border-violet-300 transition-colors"
            >
              한글 약관·개인정보처리방침
            </a>
            <a
              href="/docs/terms_en.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-extrabold text-slate-700 hover:border-violet-200 transition-colors"
            >
              English Terms & Privacy
            </a>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-sky-100 bg-sky-50/35 p-5 md:p-7">
          <h2 className="text-[18px] md:text-[22px] font-black text-slate-950">
            X-DIC의 서비스와 데이터 원칙도 함께 확인해 주세요
          </h2>
          <p className="mt-2 max-w-3xl text-[12px] md:text-[14px] leading-6 text-slate-600">
            검색 결과의 의미와 데이터 정제 기준을 먼저 확인하면 문의나 오류 제보 내용을 더 정확하게 전달하는 데 도움이 됩니다.
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
