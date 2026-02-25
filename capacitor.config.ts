import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.xdic.app',
  appName: 'X-DIC',
  webDir: 'out',

  server: {
    url: 'https://www.x-dic.com',
    cleartext: false
  },

  // (권장) 외부 이동 허용 목록
  allowNavigation: ['www.x-dic.com', 'x-dic.com', '*.vercel.app']
};

export default config;