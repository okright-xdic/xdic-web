import type { CapacitorConfig } from '@capacitor/cli';

// ✅ 개발할 때만 아래 환경변수로 덮어쓰기
// 예) Windows PowerShell:
// $env:CAP_SERVER_URL="http://10.0.2.2:3001"; npx cap sync android
// (실기기라면 PC IP로: http://192.168.x.x:3001)
const serverUrl = process.env.CAP_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.xdic.app',
  appName: 'X-DIC',
  webDir: 'out',

  ...(serverUrl
    ? {
        server: {
          url: serverUrl,
          cleartext: serverUrl.startsWith('http://'),
        },
      }
    : {}),

  // 외부 이동 허용 목록
  allowNavigation: ['www.x-dic.com', 'x-dic.com', '*.vercel.app'],
};

export default config;