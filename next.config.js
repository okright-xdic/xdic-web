/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ 1. 앱 껍데기에 넣을 'out' 폴더를 만들어주는 가장 중요한 핵심!
//  output: 'export',

  // ✅ 2. output: 'export' 사용 시 이미지 에러 방지용
  images: {
    unoptimized: true,
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // dev에서 이펙트 2번 실행로 꼬이는 문제 완화
  reactStrictMode: false,

  // 🚨 주의: output: 'export' 모드에서는 headers()를 사용할 수 없어서 임시로 막아둡니다. 
  // 앱(Capacitor)에서는 안드로이드 자체 권한을 쓰기 때문에 웹용 헤더가 없어도 괜찮습니다!
  /*
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
  */
};

module.exports = nextConfig;