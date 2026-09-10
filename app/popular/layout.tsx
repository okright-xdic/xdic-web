// app/popular/layout.tsx

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '인기 검색어·검색 트렌드',
  description:
    'X-DIC에서 많이 검색된 인기 검색어와 최근 검색 흐름을 확인할 수 있습니다.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PopularLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}