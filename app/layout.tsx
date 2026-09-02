import type { Metadata } from 'next';
import Script from 'next/script';
import AdSenseWebOnly from '@/components/AdSenseWebOnly';
import AdMobNativeBanner from './components/AdMobNativeBanner';
import './globals.css';

export const metadata: Metadata = {
metadataBase: new URL('https://www.x-dic.com'),

  title: {
    default: 'X-DIC 엑스딕 | 한영·영한 실용 번역사전·전문용어',
    template: '%s | X-DIC 엑스딕',
  },
  description:
    '한영·영한 단어와 문장 번역, 음성검색, 실제 병렬 예문과 의학·기계·전기·전자·무역·경제·컴퓨터 전문용어를 함께 검색하는 실용 번역사전 X-DIC입니다.',
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

        {/* ✅ Google AdSense: 웹에서만 로드, 설치형 Capacitor 앱에서는 차단 */}
        <AdSenseWebOnly />

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

      <body className="bg-white text-slate-900 font-sans antialiased">
        {children}
        <AdMobNativeBanner />
      </body>
    </html>
  );
}
