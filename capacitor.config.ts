import type { CapacitorConfig } from '@capacitor/cli';

const isLocalAndroidDebug = process.env.XDIC_ANDROID_LOCAL === '1';

const config: CapacitorConfig = {
  appId: 'com.xdic.app',
  appName: 'X-DIC',
  webDir: 'out',

  // Android Studio에서 실제 휴대폰으로 로컬 개발 서버를 테스트할 때만
  // legacy bridge를 사용합니다. 일반/배포 설정에서는 기존 기본값을 유지합니다.
  android: isLocalAndroidDebug
    ? {
        useLegacyBridge: true,
      }
    : undefined,

  server: isLocalAndroidDebug
    ? {
        // 로컬 Android Debug 전용
        url: 'http://192.168.0.55:3000',
        cleartext: true,
        androidScheme: 'http',
        allowNavigation: [
          '192.168.0.55',
          '192.168.0.55:3000',
        ],
      }
    : {
        // 기존 X-DIC 앱의 실서비스 연결 설정 — 그대로 유지
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
