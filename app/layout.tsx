import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: '엑스딕(X-DIC) - 한영/영한 복합어 전문 사전',
  description:
    '복합어와 전문용어, 띄어쓰기 걱정 없이 한 번에! 3단계 정밀 검색과 음성 인식 전문 사전',
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

        {/* ✅ Google AdSense 전역 스크립트 (반드시 1회만) */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8555893885172220"
          crossOrigin="anonymous"
        />
      </head>

      <body className="bg-white text-slate-900 font-sans antialiased">{children}</body>
    </html>
  );
}
