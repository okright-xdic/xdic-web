// app/app-view/layout.tsx

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '앱용 사전 검색 화면',
  description:
    'X-DIC 설치형 앱에서 사용하는 사전 검색 화면입니다.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function AppViewLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}