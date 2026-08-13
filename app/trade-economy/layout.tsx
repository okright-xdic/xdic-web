import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const pageTitle = '무역·경제 용어 한영·영한 전문 검색';
const socialTitle = '무역·경제 용어 한영·영한 전문 검색 | X-DIC 엑스딕';
const description =
  '무역·경제 분야의 한영·영한 전문용어를 X-DIC에서 검색하세요. 무역서류·물류, 계약·결제, 환율·금융, 경제지표 용어와 관련 병렬 데이터를 함께 확인할 수 있습니다.';
const canonicalUrl = 'https://www.x-dic.com/trade-economy';

export const metadata: Metadata = {
  title: pageTitle,
  description,
  keywords: [
    '무역용어',
    '경제용어',
    '무역영어',
    '한영 무역사전',
    '영한 무역사전',
    'trade terminology',
    'business terminology',
    'economics terminology',
    'Korean English trade dictionary',
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
      name: '무역·경제 용어 한영·영한 전문 검색',
      item: canonicalUrl,
    },
  ],
};

export default function TradeEconomyLayout({
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
