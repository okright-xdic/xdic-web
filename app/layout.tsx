import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

// [수정] 앱 스토어 등록 정보와 일치하도록 최적화했습니다.
export const metadata: Metadata = {
  title: '엑스딕(X-DIC) - 한영/영한 복합어 전문 사전',
  description: '복합어와 전문용어, 띄어쓰기 걱정 없이 한 번에! 3단계 정밀 검색과 음성 인식 전문 사전',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ✅ .env.local 에서 읽기 (클라이언트에도 노출되는 값이라 NEXT_PUBLIC_ 사용)
  const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="ko">
      <head>
        {/* 모바일 앱처럼 보이기 위한 추가 설정 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* ✅ (선택) AdSense 계정 메타: 정책/검증에 도움되는 경우가 있어 같이 넣어둡니다 */}
        {ADSENSE_CLIENT ? (
          <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
        ) : null}

        {/* ✅ AdSense 자동광고/광고로더 스크립트 */}
        {ADSENSE_CLIENT ? (
          <Script
            id="adsense-loader"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          />
        ) : null}
      </head>

      <body className="bg-white text-slate-900 font-sans antialiased">{children}</body>
    </html>
  );
}
