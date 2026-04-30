import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.xdic.app',
  appName: 'X-DIC',
  webDir: 'out',

  server: {
    // 🌟 수프로의 보증 수표: 이 부분이 앱을 '마법의 거울'로 만들어줍니다!
    // 절대 지우거나 수정하지 마세요! 웹사이트(x-dic.com)만 업데이트하면 앱도 자동으로 고쳐집니다.
    url: 'https://www.x-dic.com',
    androidScheme: 'https',
    allowNavigation: [
      'x-dic.com',
      'www.x-dic.com',
      '*.vercel.app',
    ],
  },

  plugins: {
    SpeechRecognition: {
      popup: false,
    },
  },
};

export default config;