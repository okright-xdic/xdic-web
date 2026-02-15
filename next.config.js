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
};

module.exports = nextConfig;