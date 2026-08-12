import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const title = '실용 여행 영어 표현·회화 | X-DIC Travel';
const description =
  '공항, 호텔, 식당, 쇼핑, 길찾기와 도움 요청에 필요한 실용 여행 영어를 X-DIC에서 살펴보세요. 상황별 영어 표현, 정중한 요청, 미니 대화와 한영·영한 검색을 함께 제공합니다.';
const canonicalUrl = 'https://www.x-dic.com/travel';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '여행영어',
    '실용영어',
    '영어회화',
    '공항영어',
    '호텔영어',
    '식당영어',
    '쇼핑영어',
    '여행 영어 표현',
    'travel English',
    'practical English',
    'X-DIC Travel',
  ],
  alternates: {
    canonical: canonicalUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title,
    description,
    url: canonicalUrl,
    siteName: 'X-DIC',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'X-DIC',
      item: 'https://www.x-dic.com/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '실용 영어 · X-DIC Travel',
      item: canonicalUrl,
    },
  ],
};

export default function TravelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {children}
    </>
  );
}
