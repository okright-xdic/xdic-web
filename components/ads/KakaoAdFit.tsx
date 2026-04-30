'use client';

import React, { useEffect, useRef } from 'react';

interface KakaoAdFitProps {
  unit: string; // 카카오에서 발급받은 DAN-xxxx 코드
  width: string;
  height: string;
  className?: string;
}

export default function KakaoAdFit({ unit, width, height, className = '' }: KakaoAdFitProps) {
  const adRef = useRef<boolean>(false);

  useEffect(() => {
    // 이미 광고가 불려왔다면 중복 방지
    if (adRef.current) return;

    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;
    document.body.appendChild(script);

    adRef.current = true;
  }, []);

  return (
    <div className={`flex justify-center items-center w-full my-4 ${className}`}>
      <ins
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit={unit}
        data-ad-width={width}
        data-ad-height={height}
      ></ins>
    </div>
  );
}