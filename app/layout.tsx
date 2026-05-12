import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: '엑스딕(X-DIC) - 복합어 전문 한영/영한사전',
  description:
    '전문용어 사전, 의학용어사전, 번역사전, 영한사전, 한영사전, 영어회화, 뉘앙스 수록',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 모바일 앱처럼 보이기 위한 설정 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* ✅ 네이버 서치어드바이저 소유권 확인 태그 */}
        <meta name="naver-site-verification" content="1b770031d6a3b92fa9cc725d68d2a8b81f3d40e1" />

        {/* ✅ Google AdSense 전역 스크립트 (반드시 1회만) */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8555893885172220"
          crossOrigin="anonymous"
        />

        {/* ▼▼▼ 구글 애널리틱스 & 구글 애즈 통합 태그 시작 ▼▼▼ */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-MJXKQ30RJJ`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // 기존 애널리틱스 통계 태그
            gtag('config', 'G-MJXKQ30RJJ'); 
            
            // 🌟 이번에 새로 추가된 구글 애즈(광고) 태그
            gtag('config', 'AW-977817955'); 
          `}
        </Script>
        {/* ▲▲▲ 구글 애널리틱스 & 구글 애즈 통합 태그 끝 ▲▲▲ */}
      </head>

      <body className="bg-white text-slate-900 font-sans antialiased">{children}</body>
    </html>
  );
}