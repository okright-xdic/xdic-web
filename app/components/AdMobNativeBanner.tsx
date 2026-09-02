'use client';

import { useEffect } from 'react';
import { Capacitor, registerPlugin } from '@capacitor/core';
import {
  AdMob,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
} from '@capacitor-community/admob';

const GOOGLE_TEST_BANNER_ID =
  'ca-app-pub-3940256099942544/9214589741';

const XDIC_REAL_BANNER_ID =
  'ca-app-pub-8555893885172220/6206923457';

interface XdicNativeAppInfo {
  id: string;
}

interface XdicNativeAppPlugin {
  getInfo(): Promise<XdicNativeAppInfo>;
}

export default function AdMobNativeBanner() {
  useEffect(() => {
    // 웹사이트에서는 실행하지 않음
    if (!Capacitor.isNativePlatform()) return;

    // 현재는 Android만 대상
    if (Capacitor.getPlatform() !== 'android') return;

    // AdMob native plugin이 없는 기존 앱 버전 보호
    if (!Capacitor.isPluginAvailable('AdMob')) return;

    let disposed = false;

    const startAdMob = async () => {
      try {
        // 기존 코드에서 이미 App 플러그인을 등록했다면 그대로 재사용합니다.
        // 등록되어 있지 않은 화면에서만 여기서 1회 등록합니다.
        const existingAppPlugin =
          (Capacitor as any).Plugins?.App as XdicNativeAppPlugin | undefined;

        const nativeApp =
          existingAppPlugin ??
          registerPlugin<XdicNativeAppPlugin>('App');

        const appInfo = await nativeApp.getInfo();

        const isDebugApp =
          appInfo.id === 'com.xdic.app.debug';

        await AdMob.initialize();

        if (disposed) return;

        const options: BannerAdOptions = {
          adId: isDebugApp
            ? GOOGLE_TEST_BANNER_ID
            : XDIC_REAL_BANNER_ID,

          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,

          // Debug 앱에서만 Google 테스트 광고 사용
          isTesting: isDebugApp,
        };

        await AdMob.showBanner(options);
      } catch (error) {
        console.error('[AdMob] banner failed:', error);
      }
    };

    void startAdMob();

    return () => {
      disposed = true;

      if (
        Capacitor.isNativePlatform() &&
        Capacitor.getPlatform() === 'android' &&
        Capacitor.isPluginAvailable('AdMob')
      ) {
        void AdMob.removeBanner().catch(() => {});
      }
    };
  }, []);

  return null;
}