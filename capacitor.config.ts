import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.xdic.app',
  appName: 'X-DIC',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    url: 'https://www.x-dic.com',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    SpeechRecognition: {
      microphonePermission: 'X-DIC에서 음성 검색을 위해 마이크 권한이 필요합니다.',
      speechRecognitionPermission: '음성 인식을 사용하기 위해 권한이 필요합니다.'
    }
  }
};

export default config;