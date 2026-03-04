'use client'; // ✅ 이거 없으면 Vercel 빌드 터집니다! 무조건 1번 줄!

import React, { useEffect, useRef, useState } from 'react';

export default function AdSensePlaceholder(props: {
  adSlot: string;
  debugLabel?: string;
  minHeight?: number;
}) {
  const { adSlot, debugLabel, minHeight = 200 } = props;

  // ✅ 핵심: HTMLElement -> HTMLModElement 완벽 수정
  const insRef = useRef<HTMLModElement | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // adsbygoogle push 시도
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // push 실패 시 재시도 가능하게 key만 증가
      setRefreshKey((k) => k + 1);
    }
  }, [adSlot]);

  return (
    <div style={{ minHeight }} className="w-full my-6">
      <ins
        key={`${adSlot}:${refreshKey}`}
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        // ✅ XXXXXX 대신 대표님의 진짜 애드센스 환경변수를 가져오도록 수정! (없을 경우를 대비한 안전망 포함)
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-8555893885172220"}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      {debugLabel ? (
        <div className="text-[10px] text-slate-300 mt-1">{debugLabel}</div>
      ) : null}
    </div>
  );
}