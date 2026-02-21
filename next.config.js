/** @type {import('next').NextConfig} */
const nextConfig = {
  // 빌드 시 ESLint(문법 검사) 에러가 있어도 무시하고 진행합니다.
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 빌드 시 TypeScript(타입 검사) 에러가 있어도 무시하고 진행합니다.
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ (권장) dev에서 StrictMode 이펙트 2번 실행로 인한 마이크/이펙트 꼬임 방지용
  // (프로덕션에선 덜하지만, 로컬 테스트 안정성에 도움)
  reactStrictMode: false,

  // ✅ (권장) Vercel/배포 환경에서 마이크 권한 정책을 "명시적으로 허용"
  // 기본값이 막혀있는 경우(특정 헤더/프록시/보안설정) 대비
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Permissions-Policy', value: 'microphone=(self)' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
