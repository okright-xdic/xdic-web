import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const pageTitle = "필수 영어회화·실용 표현";
const socialTitle = "필수 영어회화·실용 표현 | X-DIC Essential English";
const description = "여행·일상·업무에서 활용할 수 있는 필수 영어회화와 한국어 번역, 번역가 해설을 X-DIC에서 함께 살펴보세요.";
const canonicalUrl = "https://www.x-dic.com/conversation";

export const metadata: Metadata = {
  title: pageTitle,
  description,
  keywords: [
  "필수 영어회화",
  "실용 영어회화",
  "영어 표현",
  "영어회화 예문",
  "Essential English",
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
      name: "필수 영어회화",
      item: canonicalUrl,
    },
  ],
};

export default function ConversationLayout({
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
