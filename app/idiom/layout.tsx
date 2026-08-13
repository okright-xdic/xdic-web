import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const pageTitle = "영어 숙어·관용 표현 해설";
const socialTitle = "영어 숙어·관용 표현 해설 | X-DIC Idioms";
const description = "자주 쓰이는 영어 숙어와 관용 표현의 뜻과 쓰임을 살펴보고 실제 문맥에서 어떻게 사용되는지 X-DIC에서 확인하세요.";
const canonicalUrl = "https://www.x-dic.com/idiom";

export const metadata: Metadata = {
  title: pageTitle,
  description,
  keywords: [
  "영어 숙어",
  "영어 관용구",
  "영어 관용 표현",
  "숙어 해설",
  "Idioms",
  "X-DIC"
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
      name: "필수 숙어 해설",
      item: canonicalUrl,
    },
  ],
};

export default function IdiomLayout({
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
