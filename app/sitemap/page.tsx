import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: '사이트맵 | 엑스딕(X-DIC)',
  description: '엑스딕의 모든 메뉴와 서비스를 한눈에 확인하실 수 있습니다.',
  alternates: {
    canonical: 'https://www.x-dic.com/sitemap',
  },
};

export default function SitemapPage() {
  const sections = [
    {
      title: "검색 서비스",
      icon: "🔍",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      links: [
        { name: "메인 검색 홈", href: "/", desc: "한영/영한 복합어 전문 검색" },
        { name: "최근 검색어", href: "/recent", desc: "나의 검색 히스토리 확인" },
        { name: "인기 검색어", href: "/popular", desc: "실시간 트렌드 단어 TOP 20" },
      ]
    },
    {
      title: "학습 및 해설",
      icon: "📚",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      links: [
        { name: "필수 영어회화", href: "/conversation", desc: "상황별 핵심 패턴과 예문" },
        { name: "영단어 뉘앙스", href: "/nuance", desc: "비슷한 단어의 미묘한 차이" },
        { name: "필수 숙어 해설", href: "/idiom", desc: "원어민이 자주 쓰는 관용구" },
      ]
    },
    {
      title: "전문용어 허브",
      icon: "🩺",
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
      links: [
        { name: "의학 · Medical", href: "/medical", desc: "질환·진단·검사·약물·해부 관련 용어" },
        { name: "기계·전기·전자", href: "/engineering", desc: "기계요소·재료·전력·전자·제어 용어" },
        { name: "무역·경제", href: "/trade-economy", desc: "무역서류·결제·환율·경제지표 관련 용어" },
        { name: "컴퓨터 · Computer", href: "/computer", desc: "소프트웨어·시스템·네트워크·데이터 용어" },
      ]
    },
    {
      title: "실용 영어 허브",
      icon: "💼",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      links: [
        { name: "X-DIC Travel", href: "/travel", desc: "공항·호텔·식당·쇼핑·길찾기 여행 영어" },
        { name: "X-DIC Business", href: "/business", desc: "이메일·회의·전화·일정·보고·협상 실무 영어" },
      ]
    },
    {
      title: "X-DIC 안내 · 신뢰 정보",
      icon: "🛡️",
      bgColor: "bg-violet-50",
      textColor: "text-violet-600",
      links: [
        { name: "About X-DIC", href: "/about", desc: "X-DIC의 서비스 목적과 방향" },
        { name: "데이터·편집 원칙", href: "/data-policy", desc: "검색 데이터의 구성·채택·보류·수정 기준" },
        { name: "이용 안내", href: "/guide", desc: "검색·음성검색·결과와 허브 이용 방법" },
        { name: "Contact", href: "/contact", desc: "서비스 문의와 데이터·번역 오류 제보" },
        { name: "Privacy", href: "/privacy", desc: "개인정보 안내와 정식 정책 문서 연결" },
      ]
    },
    {
      title: "고객 지원",
      icon: "📢",
      bgColor: "bg-slate-50",
      textColor: "text-slate-600",
      links: [
        { name: "공지사항 / FAQ", href: "/notice", desc: "업데이트 소식 및 자주 묻는 질문" },
        { name: "이용약관(KO/EN)", href: "/docs/terms_ko.pdf", desc: "서비스 정책 및 개인정보 처리" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-20">
        
        {/* 상단 헤더 섹션 */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <Link href="/" className="inline-block mb-6 text-2xl font-black text-slate-800 tracking-tighter hover:opacity-70 transition-opacity">
            <span className="text-blue-600">X</span>-DIC
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">서비스 지도</h1>
          <div className="w-12 h-1.5 bg-blue-500 mx-auto mt-6 rounded-full"></div>
          <p className="mt-6 text-slate-500 text-lg font-medium">
            엑스딕의 모든 가치있는 콘텐츠를 한 곳에서 확인하세요.
          </p>
        </div>

        {/* 그리드 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 ${section.bgColor} ${section.textColor} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                  {section.icon}
                </div>
                <h2 className="text-xl font-black text-slate-800">{section.title}</h2>
              </div>
              
              <ul className="space-y-6">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link href={link.href} className="group block">
                      <div className="flex justify-between items-center">
                        <span className="text-[16px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                          {link.name}
                        </span>
                        <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-medium">{link.desc}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 하단 홈으로 가기 */}
        <div className="mt-20 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            🏠 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}