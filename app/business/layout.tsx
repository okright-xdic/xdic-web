import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const title = '비즈니스 실무 영어 표현·이메일·회의 | X-DIC Business';
const description =
  '이메일, 회의, 전화, 일정, 요청·보고, 협상·계약에서 자주 쓰는 실무 영어를 X-DIC에서 살펴보세요. 업무 상황별 표현, 정중도와 이메일 패턴을 한영·영한 검색과 함께 제공합니다.';
const canonicalUrl = 'https://www.x-dic.com/business';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '비즈니스 영어',
    '실무 영어',
    '업무 영어',
    '영어 이메일',
    '회의 영어',
    '전화 영어',
    '비즈니스 이메일',
    'business English',
    'business email',
    'practical business English',
    'X-DIC Business',
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
      name: '실무 영어 · X-DIC Business',
      item: canonicalUrl,
    },
  ],
};

export default function BusinessLayout({
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
