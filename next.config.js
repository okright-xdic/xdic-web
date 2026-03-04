/** @type {import('next').NextConfig} */
const isCapBuild = process.env.CAP_BUILD === "1";

const nextConfig = {
  reactStrictMode: true,

  // ✅ 앱(Capacitor) 빌드일 때만 '사진(export)' 모드 켜기
  ...(isCapBuild
    ? {
        output: "export",
        images: { unoptimized: true }, // export 모드에서는 필수
      }
    : {
        // ✅ Vercel(웹) 배포할 때는 서버 모드로 정상 작동!
      }),
};

module.exports = nextConfig;