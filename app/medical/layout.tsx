import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const title = '의학용어 한영·영한 전문 검색 | X-DIC';
const description =
  '의학·간호·건강 분야의 한영·영한 전문용어를 X-DIC에서 검색하세요. 질환·진단, 검사·소견, 약물·투약, 해부·처치 용어와 관련 병렬 데이터를 함께 확인할 수 있습니다.';
const canonicalUrl = 'https://www.x-dic.com/medical';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '의학용어',
    '한영 의학사전',
    '영한 의학사전',
    '의학 영어',
    '간호 영어',
    'medical terminology',
    'Korean English medical dictionary',
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
      name: '의학용어 한영·영한 전문 검색',
      item: canonicalUrl,
    },
  ],
};

export default function MedicalLayout({
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
