'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Capacitor } from '@capacitor/core';

const ADSENSE_SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8555893885172220';

export default function AdSenseWebOnly() {
  const [shouldLoadAdSense, setShouldLoadAdSense] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || '';

    const isNativeApp =
      Capacitor.isNativePlatform() ||
      ua.includes('wv') ||
      ua.includes('Capacitor');

    const pathname = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const query = (params.get('q') || '').trim();

    const isSearchResultPage =
      pathname === '/search' ||
      (pathname === '/' && query.length > 0);

    setShouldLoadAdSense(
      !isNativeApp && !isSearchResultPage
    );
  }, []);

  if (!shouldLoadAdSense) return null;

  return (
    <Script
      id="xdic-adsense-web-only"
      async
      strategy="afterInteractive"
      src={ADSENSE_SRC}
      crossOrigin="anonymous"
    />
  );
}