/** @type {import('next').NextConfig} */
const isCapBuild = process.env.CAP_BUILD === "1";

const nextConfig = {
  reactStrictMode: true,

  // 🌟 수프로의 보증 수표: Vercel 배포를 위한 완벽한 분기 처리입니다!
  ...(isCapBuild
    ? {
        output: "export",
        images: { unoptimized: true }, // export 모드에서는 필수
      }
    : {
        // ✅ 평소처럼 Vercel(웹) 배포할 때는 서버 모드로 완벽하게 정상 작동합니다!
      }),

  // 🔥 [수프로 추가] 빌드할 때 과거의 찌꺼기(캐시)가 섞여서 500 에러를 내는 것을 영구 방어!
  generateBuildId: async () => {
    return 'xdic-build-' + new Date().getTime();
  },
};

module.exports = nextConfig;