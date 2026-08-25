'use client';

import React, { useState } from 'react';

const TABS = [
  { label: '실시간', value: 'realtime' },
  { label: '일간', value: 'daily' },
  { label: '주간', value: 'weekly' },
];

export default function KeywordTrendTabs() {
  const [selected, setSelected] = useState('realtime');

  return (
    <div className="flex space-x-2 p-1 bg-slate-100/50 rounded-full w-fit">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setSelected(tab.value)}
          // [수정] variant 속성을 지우고, className으로 디자인을 직접 적용했습니다.
          className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all duration-200
            ${selected === tab.value 
              ? 'bg-white text-slate-800 shadow-sm border border-slate-200' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}