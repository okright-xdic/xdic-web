import type { Metadata } from 'next';
import './globals.css';

// [중요] 이곳이 검색 엔진과 브라우저 탭에 노출되는 '웹사이트 타이틀'입니다.
export const metadata: Metadata = {
  title: '복합어 전문 한영/영한 엑스딕(X-DIC) 사전 방문을 환영합니다! WELCOME!',
  description: '복합어 검색 전문 한영/영한 용어사전, 엑스딕(X-DIC)입니다.',
  icons: {
    icon: '/favicon.ico', // 파비콘이 있다면 설정
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-white text-slate-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}