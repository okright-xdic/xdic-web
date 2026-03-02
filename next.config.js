/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Capacitor(webDir: out) 사용 시 필수에 가깝습니다
  output: 'export',

  // ✅ /app 같은 라우팅이 export에서 안정적으로 동작
  trailingSlash: true,

  // ✅ next/image가 export에서 에러/흰화면 유발하는 경우 방지
  images: {
    unoptimized: true,
  },

  reactStrictMode: true,
};

module.exports = nextConfig;