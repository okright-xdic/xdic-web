import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const pageTitle = "영단어 뉘앙스·의미 차이";
const socialTitle = "영단어 뉘앙스·의미 차이 | X-DIC Nuance";
const description = "비슷해 보이는 영어 단어와 표현의 의미·쓰임 차이를 비교하고 문맥에 맞는 뜻과 표현을 X-DIC에서 확인하세요.";
const canonicalUrl = "https://www.x-dic.com/nuance";

export const metadata: Metadata = {
  title: pageTitle,
  description,
  keywords: [
  "영단어 뉘앙스",
  "영어 단어 차이",
  "영어 의미 차이",
  "영어 어휘",
  "Nuance",
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
      name: "영단어 Nuance",
      item: canonicalUrl,
    },
  ],
};

export default function NuanceLayout({
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
