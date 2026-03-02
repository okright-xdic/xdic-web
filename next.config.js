/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Capacitor가 server.url로 https://www.x-dic.com 를 로드하는 구조면
  // output: 'export' 는 필요 없습니다(오히려 API route 못 씀).

  images: {
    unoptimized: true,
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  reactStrictMode: false,

  // (참고) export 모드에서는 headers() 사용 불가라 주석 유지
};

module.exports = nextConfig;