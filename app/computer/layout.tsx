import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const pageTitle = '컴퓨터 용어 한영·영한 전문 검색';
const socialTitle = '컴퓨터 용어 한영·영한 전문 검색 | X-DIC 엑스딕';
const description =
  '컴퓨터 분야의 한영·영한 전문용어를 X-DIC에서 검색하세요. 소프트웨어·웹, 시스템·클라우드, 네트워크·인터넷, 데이터·데이터베이스 용어와 관련 병렬 데이터를 함께 확인할 수 있습니다.';
const canonicalUrl = 'https://www.x-dic.com/computer';

export const metadata: Metadata = {
  title: pageTitle,
  description,
  keywords: [
    '컴퓨터용어',
    'IT용어',
    '소프트웨어용어',
    '네트워크용어',
    '데이터베이스용어',
    '한영 컴퓨터사전',
    '영한 컴퓨터사전',
    'computer terminology',
    'software terminology',
    'network terminology',
    'database terminology',
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
      name: '컴퓨터 용어 한영·영한 전문 검색',
      item: canonicalUrl,
    },
  ],
};

export default function ComputerLayout({
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
