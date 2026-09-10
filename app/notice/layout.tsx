// app/notice/layout.tsx

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '공지사항·자주 묻는 질문 FAQ',
  description:
    'X-DIC 이용 안내, 업데이트 소식, 검색·번역 기능과 관련된 자주 묻는 질문을 확인하세요.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function NoticeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}