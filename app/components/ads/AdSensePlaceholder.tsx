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
    // 🌟 수정 포인트 1: 투명했던 공간에 연한 회색 배경과 점선 테두리를 주어 시각적으로 '공간 확보'를 명확히 합니다!
    <div
      style={{ minHeight: `${minHeight}px` }}
      className="relative w-full my-6 bg-slate-50 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center overflow-hidden"
    >
      {/* 🌟 수정 포인트 2: 로컬(PC) 환경에서 빈 공간일 때 텍스트가 박스 정중앙에 예쁘게 보이도록 절대좌표 적용 */}
      {debugLabel ? (
        <div className="absolute inset-0 flex items-center justify-center text-[12px] text-slate-400 font-medium pointer-events-none z-0">
          [광고 예약 영역] {debugLabel}
        </div>
      ) : null}

      <ins
        key={`${adSlot}:${refreshKey}`}
        ref={insRef}
        className="adsbygoogle w-full relative z-10" // 광고가 로드되면 안내 문구(z-0)를 덮어씁니다!
        style={{ display: 'block', minHeight: `${minHeight}px` }}
        // ✅ XXXXXX 대신 대표님의 진짜 애드센스 환경변수를 가져오도록 수정! (없을 경우를 대비한 안전망 포함)
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-8555893885172220"}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}