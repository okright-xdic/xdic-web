'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface TrendData {
  date: string;
  count: number;
}

export default function KeywordTrendChart({ className }: { className?: string }) {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // [데이터 생성] 지난 7일
    const mockData = Array.from({ length: 7 }).map((_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
      count: Math.floor(Math.random() * 30) + 20 + (i * 5),
    }));
    setData(mockData);
    setLoading(false);
  }, []);

  // 날짜 포맷 (예: 2.05)
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}.${d.getDate()}`;
  };

  const getPath = (points: TrendData[], width: number, height: number) => {
    if (points.length === 0) return { d: '', coords: [] };
    
    // 텍스트 들어갈 공간 확보를 위해 높이 조정
    const chartHeight = height - 30; // 하단 30px은 텍스트용

    const maxVal = Math.max(...points.map(p => p.count)) || 1;
    const minVal = Math.min(...points.map(p => p.count)) || 0;
    const range = maxVal - minVal + (maxVal * 0.2);

    const coords = points.map((p, i) => {
      // 좌우 여백을 조금 둠 (텍스트 잘림 방지)
      const x = (i / (points.length - 1)) * (width - 40) + 20;
      const normalizedY = (p.count - minVal) / range;
      const y = chartHeight - (normalizedY * chartHeight * 0.8) - 10;
      return { x, y, date: p.date, val: p.count };
    });

    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) * 0.5;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) * 0.5;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return { d, coords, chartHeight };
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative ${className || ''}`}>
      
      {/* 1. 헤더 */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="text-lg">🌊</span> 주간 트렌드
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">지난 7일간 검색 추이</p>
        </div>
        <Link href="/trend" className="text-[11px] text-slate-400 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors">
          더보기 &gt;
        </Link>
      </div>

      {/* 2. 차트 영역 */}
      <div className="relative w-full h-40"> {/* 높이 약간 증가 */}
        {loading ? (
           <div className="w-full h-full flex items-center justify-center">
             <div className="w-5 h-5 border-2 border-slate-100 border-t-blue-500 rounded-full animate-spin"></div>
           </div>
        ) : (
          <svg viewBox="0 0 300 160" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {(() => {
              const { d, coords, chartHeight } = getPath(data, 300, 160);
              if (!d) return null;

              return (
                <>
                  {/* 배경 채우기 */}
                  <path 
                    d={`${d} L ${coords[coords.length-1].x} ${chartHeight} L ${coords[0].x} ${chartHeight} Z`} 
                    fill="url(#blueGradient)" 
                  />
                  
                  {/* 메인 라인 */}
                  <path 
                    d={d} 
                    fill="none" 
                    stroke="#3B82F6" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    style={{ filter: 'drop-shadow(0px 4px 6px rgba(59, 130, 246, 0.3))' }}
                  />

                  {/* [추가됨] X축 날짜 (은은하게 표시) */}
                  {coords.map((p, i) => (
                    <g key={i}>
                      {/* 포인트 점 */}
                      <circle 
                        cx={p.x} cy={p.y} r="3" 
                        fill="white" stroke="#3B82F6" strokeWidth="2"
                        className="transition-all duration-300 hover:r-5"
                      />
                      
                      {/* 날짜 텍스트 (여기가 핵심!) */}
                      <text 
                        x={p.x} 
                        y={155} // 바닥 부근
                        textAnchor="middle" 
                        fill="#94a3b8" // slate-400 (은은한 회색)
                        fontSize="10" 
                        fontWeight="500"
                        style={{ fontFamily: 'sans-serif' }}
                      >
                        {formatDate(p.date)}
                      </text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>
        )}
      </div>
    </div>
  );
}