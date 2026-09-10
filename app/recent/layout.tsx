// app/recent/layout.tsx

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '최근 검색어',
  description:
    '이 브라우저에서 최근 검색한 X-DIC 검색어를 확인하고 다시 검색할 수 있습니다.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function RecentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}