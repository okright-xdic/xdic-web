import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: '사이트맵 | 엑스딕(X-DIC)',
  description: '엑스딕의 모든 메뉴와 서비스를 한눈에 확인하실 수 있습니다.',
};

export default function SitemapPage() {
  const sections = [
    {
      title: "🔍 검색 및 데이터",
      links: [
        { name: "엑스딕 메인 검색", href: "/" },
        { name: "최근 검색어 리스트", href: "/recent" },
        { name: "인기 검색어 TOP 20", href: "/popular" },
      ]
    },
    {
      title: "📖 학습 콘텐츠",
      links: [
        { name: "필수 영어회화 가이드", href: "/conversation" },
        { name: "영단어 뉘앙스 해설", href: "/nuance" },
        { name: "필수 숙어 해설", href: "/idiom" },
      ]
    },
    {
      title: "🏥 전문 서비스",
      links: [
        { name: "의료진 특화 의학용어 사전", href: "/medical" },
      ]
    },
    {
      title: "📢 고객 지원",
      links: [
        { name: "공지사항 및 FAQ", href: "/notice" },
        { name: "이용약관 및 개인정보처리방침", href: "/docs/terms_ko.pdf" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12 border-b border-slate-100 pb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <span className="text-blue-500">🗺️</span> 사이트맵
          </h1>
          <p className="mt-4 text-slate-500 text-lg">
            엑스딕(X-DIC)이 제공하는 모든 서비스와 페이지를 안내해 드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-5">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                {section.title}
              </h2>
              <ul className="space-y-3 pl-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      href={link.href}
                      className="text-slate-600 hover:text-blue-600 hover:underline underline-offset-4 transition-colors font-medium flex items-center gap-2 group"
                    >
                      <span className="text-slate-300 group-hover:text-blue-400">·</span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-center text-slate-400 text-sm">
            원하시는 정보를 찾지 못하셨나요? <br className="md:hidden" /> 
            메인 검색창에서 복합어와 전문 용어를 직접 검색해 보세요!
          </p>
          <div className="mt-6 flex justify-center">
            <Link 
              href="/"
              className="px-8 py-3 bg-slate-800 text-white font-bold rounded-full hover:bg-blue-600 transition-all shadow-md"
            >
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}