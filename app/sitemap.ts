import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.x-dic.com';

  // 1. 고정된 주요 페이지들
  const routes = [
    '',              // 메인 페이지
    '/recent',       // 최근 검색어
    '/popular',      // 인기 검색어
    '/notice',       // 공지사항
    '/conversation', // 영어회화
    '/medical',      // 의학용어 특화 페이지 (SEO용)
    '/nuance',       // 뉘앙스 해설
    '/idiom',        // 숙어 해설
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const, // 매일 바뀔 수 있다고 알림
    priority: route === '' ? 1 : 0.8,  // 메인은 우선순위 1, 나머지는 0.8
  }));

  return [...routes];
}