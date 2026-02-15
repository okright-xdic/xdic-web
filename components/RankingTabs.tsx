// components/RankingTabs.tsx
'use client';

import { useState } from 'react';

const TABS = ['일간', '주간', '월간'] as const;

export default function RankingTabs() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('일간');

  const handleTabClick = (tab: typeof TABS[number]) => {
    setActiveTab(tab);
    // 여기에 탭 전환 시 데이터 fetch 또는 state 변경 가능
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {/* 탭 버튼 */}
      <div className="flex border-b border-gray-300">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`flex-1 py-2 text-center transition-all duration-200 ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 font-semibold text-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <div className="mt-6">
        {activeTab === '일간' && (
          <div>
            {/* 일간 인기 검색어 통계 UI */}
            <p className="text-gray-700">📈 일간 인기 검색어 통계</p>
            {/* 여기에 일간 데이터를 렌더링 */}
          </div>
        )}

        {activeTab === '주간' && (
          <div>
            <p className="text-gray-700">📊 주간 인기 검색어 통계</p>
            {/* 여기에 주간 데이터를 렌더링 */}
          </div>
        )}

        {activeTab === '월간' && (
          <div>
            <p className="text-gray-700">📅 월간 인기 검색어 통계</p>
            {/* 여기에 월간 데이터를 렌더링 */}
          </div>
        )}
      </div>
    </div>
  );
}
