import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const pageTitle = '기계·전기·전자 용어 한영·영한 전문 검색';
const socialTitle = '기계·전기·전자 용어 한영·영한 전문 검색 | X-DIC 엑스딕';
const description =
  '기계·전기·전자 분야의 한영·영한 전문용어를 X-DIC에서 검색하세요. 기계 요소, 재료·제조, 전기·전력, 전자·제어 용어와 관련 병렬 데이터를 함께 확인할 수 있습니다.';
const canonicalUrl = 'https://www.x-dic.com/engineering';

export const metadata: Metadata = {
  title: pageTitle,
  description,
  keywords: [
    '기계용어',
    '전기용어',
    '전자용어',
    '기술용어',
    '한영 기술사전',
    '영한 기술사전',
    'engineering terminology',
    'mechanical terminology',
    'electrical terminology',
    'electronic terminology',
    'X-DIC',
  ],
  alternates: {
    canonical: canonicalUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: socialTitle,
    description,
    url: canonicalUrl,
    siteName: 'X-DIC',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: socialTitle,
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
      name: '기계·전기·전자 용어 한영·영한 전문 검색',
      item: canonicalUrl,
    },
  ],
};

export default function EngineeringLayout({
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
