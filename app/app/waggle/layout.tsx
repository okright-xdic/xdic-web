// app/app/waggle/layout.tsx

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'X-DIC 평가단 와글와글',
  description:
    'X-DIC 앱 평가단이 사용 의견과 문의를 남기고 운영자 답변을 확인하는 페이지입니다.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function WaggleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}