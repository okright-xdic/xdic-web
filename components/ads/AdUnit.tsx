'use client';

import React, { useEffect, useMemo, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

type AdUnitProps = {
  className?: string;

  /** 광고 단위 슬롯 ID (숫자 문자열) */
  adSlot: string;

  /** data-ad-format (auto | fluid | ...) */
  adFormat?: 'auto' | 'fluid' | string;

  /** data-full-width-responsive */
  fullWidthResponsive?: boolean;

  /** 인피드에서 주로 쓰는 data-ad-layout-key (예: "-fg+5n+6t-e7+r") */
  layoutKey?: string;

  /** 인아티클 등에서 쓸 수 있는 data-ad-layout (예: "in-article") */
  adLayout?: string;

  /**
   * (선택) data-ad-client.
   * 없으면 NEXT_PUBLIC_ADSENSE_CLIENT (예: ca-pub-xxxxxxxxxxxxxx) 를 사용합니다.
   */
  adClient?: string;

  /** (선택) 레이아웃 흔들림 방지용 최소 높이(px) */
  minHeight?: number;

  /**
   * (선택) 강제 리프레시 키
   * 같은 페이지에서 광고를 재렌더링해야 할 때 바꿔주면 push가 다시 일어납니다.
   */
  refreshKey?: string | number;

  /** 디버그용 라벨(콘솔 로그) */
  debugLabel?: string;

  /** 개발 중 임시로 광고 호출을 끄고 싶을 때 */
  enabled?: boolean;
};

export default function AdUnit({
  className = '',
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  layoutKey,
  adLayout,
  adClient,
  minHeight = 0,
  refreshKey,
  debugLabel,
  enabled = true,
}: AdUnitProps) {
  const insRef = useRef<HTMLElement | null>(null);

  const clientId = useMemo(() => {
    const fromEnv = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
      ? String(process.env.NEXT_PUBLIC_ADSENSE_CLIENT).trim()
      : '';
    const chosen = (adClient ? String(adClient).trim() : '') || fromEnv;
    return chosen;
  }, [adClient]);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    const el = insRef.current;
    if (!el) return;

    // 1) client id 없으면 종료
    if (!clientId) {
      if (debugLabel) console.warn(`[AdUnit] missing clientId (NEXT_PUBLIC_ADSENSE_CLIENT): ${debugLabel}`);
      return;
    }

    // 2) 이미 채워진 광고면 중복 push 방지
    const status = el.getAttribute('data-adsbygoogle-status');
    if (status === 'done') {
      if (debugLabel) console.log(`[AdUnit] already done: ${debugLabel}`);
      return;
    }

    // 3) 약간 늦게 push (렌더/레이아웃 안정화)
    const t = window.setTimeout(() => {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        if (debugLabel) console.log(`[AdUnit] push ok: ${debugLabel}`);
      } catch (e) {
        if (debugLabel) console.warn(`[AdUnit] push fail: ${debugLabel}`, e);
      }
    }, 80);

    return () => window.clearTimeout(t);
  }, [
    enabled,
    clientId,
    adSlot,
    adFormat,
    layoutKey,
    adLayout,
    refreshKey,
    debugLabel,
  ]);

  // minHeight로 공간 확보(광고 로딩 전 레이아웃 덜 흔들리게)
  const wrapperStyle = minHeight ? { minHeight } : undefined;

  return (
    <div className={className} style={wrapperStyle}>
      <ins
        // refreshKey가 바뀌면 ins 자체를 새로 만들어 push 재시도 가능
        key={refreshKey ?? `${clientId}:${adSlot}`}
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        {...(adLayout ? { 'data-ad-layout': adLayout } : {})}
      />
    </div>
  );
}
