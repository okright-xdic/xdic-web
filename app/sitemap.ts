import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.x-dic.com';

  // Google/Naver 등 검색엔진에 실제로 노출시키고 싶은
  // canonical HTML 페이지 중심으로만 구성합니다.
  //
  // 주의:
  // - /app : 웹 메인과 역할이 겹치는 앱 전용 화면이므로 제외
  // - /recent : 브라우저별 개인 최근검색 성격이 강하므로 제외
  // - /popular : 검색 트렌드 보조 페이지이므로 핵심 sitemap에서는 제외
  // - ?q=..., ?type=..., ?id=... 같은 검색/필터 URL은 제외
  // - lastModified는 실제 수정 시각을 정확히 보장할 수 없으므로 넣지 않음

  const routes = [
    '',

    // 서비스 안내 / 공지
    '/notice',

    // 영어 학습 · 해설
    '/conversation',
    '/nuance',
    '/idiom',

    // 전문용어 허브
    '/medical',
    '/engineering',
    '/trade-economy',
    '/computer',

    // 실용 영어 허브
    '/travel',
    '/business',

    // 사이트 구조 안내
    '/sitemap',

    // X-DIC 신뢰 · 운영 정보
    '/about',
    '/data-policy',
    '/guide',
    '/contact',
    '/privacy',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
  }));
}
