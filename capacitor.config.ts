import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.xdic.app',
  appName: 'X-DIC',
  webDir: 'out',   // 반드시 next export 결과 폴더
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
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