'use client';

import React from 'react';

export default function AdSensePlaceholder() {
  return (
    <div className="w-full h-[100px] md:h-[250px] bg-slate-100 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400 my-6">
      <span className="text-2xl font-bold mb-2">AD</span>
      <p className="text-xs">Google AdSense 영역 (반응형)</p>
    </div>
  );
}