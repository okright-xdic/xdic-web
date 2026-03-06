'use client';

import React from 'react';
import SearchPage from '@/components/SearchPage';

type Props = React.ComponentProps<typeof SearchPage> & {
  isApp?: boolean;
};

export default function MobileSearchPage(props: Props) {
  return <SearchPage {...props} />;
}