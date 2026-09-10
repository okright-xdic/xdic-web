// app/trend/layout.tsx

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '검색어 트렌드',
  description:
    'X-DIC의 검색어 변화와 최근 검색 흐름을 확인할 수 있습니다.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function TrendLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}