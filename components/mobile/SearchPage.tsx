'use client';

// ✅ (호환용) 기존 모바일 SearchPage를 통합 SearchPage로 연결
import React from 'react';
import SearchPage from '@/components/SearchPage';

type Props = React.ComponentProps<typeof SearchPage> & {
  isApp?: boolean;
};

export default function MobileSearchPage(props: Props) {
  return <SearchPage {...props} />;
}
