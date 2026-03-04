'use client';

import AdSensePlaceholder from '@/components/ads/AdSensePlaceholder';

import React, { useEffect, useMemo, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

type Props = {
  /** 광고 슬롯(숫자 문자열) */
  adSlot: string;

  /** (선택) ca-pub-xxxx. 없으면 NEXT_PUBLIC_ADSENSE_CLIENT 사용 */
  adClient?: string;

  /** (선택) className */
  className?: string;

  /** (선택) data-ad-format */
  adFormat?: 'auto' | 'fluid' | string;

  /** (선택) 반응형 */
  fullWidthResponsive?: boolean;

  /** (선택) 레이아웃 흔들림 방지 최소 높이 */
  minHeight?: number;

  /** (선택) 디버그 라벨 */
  debugLabel?: string;
};

export default function AdSensePlaceholder({
  adSlot,
  adClient,
  className = '',
  adFormat = 'auto',
  fullWidthResponsive = true,
  minHeight = 160,
  debugLabel,
}: Props) {
  const insRef = useRef<HTMLElement | null>(null);

  const clientId = useMemo(() => {
    return (
      adClient ||
      (process.env.NEXT_PUBLIC_ADSENSE_CLIENT
        ? String(process.env.NEXT_PUBLIC_ADSENSE_CLIENT)
        : 'ca-pub-8555893885172220') // ✅ 안전 기본값(원하시면 제거 가능)
    );
  }, [adClient]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = insRef.current as any;
    if (!el) return;

    // ✅ 이미 로드된 광고면 중복 push 방지
    const status = el.getAttribute?.('data-adsbygoogle-status');
    if (status === 'done') {
      if (debugLabel) console.log(`[AdSense] already done: ${debugLabel}`);
      return;
    }

    // ✅ 스크립트가 아직 로드 중일 수 있어 약간 딜레이 후 push
    const t = window.setTimeout(() => {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        if (debugLabel) console.log(`[AdSense] push ok: ${debugLabel}`);
      } catch (e) {
        if (debugLabel) console.warn(`[AdSense] push fail: ${debugLabel}`, e);
      }
    }, 80);

    return () => window.clearTimeout(t);
  }, [adSlot, clientId, adFormat, fullWidthResponsive, debugLabel]);

  // clientId가 비어 있으면(환경변수 누락 등) 개발 중엔 박스만 보여주기
  if (!clientId) {
    return (
      <div
        className={`w-full bg-slate-100 border border-slate-200 border-dashed rounded-xl flex items-center justify-center text-slate-400 my-6 ${className}`}
        style={{ minHeight }}
      >
        AdSense client id missing (NEXT_PUBLIC_ADSENSE_CLIENT)
      </div>
    );
  }

  return (
    <div className={`w-full my-6 ${className}`} style={{ minHeight }}>
      <ins
        ref={insRef as any}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}
