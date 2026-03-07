import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.xdic.app',
  appName: 'X-DIC',

  // Next export 결과
  webDir: 'out',

  server: {
    androidScheme: 'https'
  },

  allowNavigation: [
    'x-dic.com',
    'www.x-dic.com',
    '*.vercel.app'
  ],

  plugins: {
    SpeechRecognition: {
      popup: false
    }
  }
};

export default config;