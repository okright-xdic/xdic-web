'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface KeywordItem {
  keyword: string;
  count: number;
}

export default function PopularKeywords({ className }: { className?: string }) {
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // 데이터 가져오기
  const fetchPopular = async () => {
    try {
      // 1. 최근 로그 가져오기
      const { data, error } = await supabase
        .from('search_logs')
        .select('keyword')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;

      if (data) {
        // 2. 집계
        const counts: { [key: string]: number } = {};
        data.forEach((item: any) => {
          const word = item.keyword?.trim();
          if (word) counts[word] = (counts[word] || 0) + 1;
        });

        // 3. 정렬 및 Top 20
        const sorted = Object.entries(counts)
          .map(([keyword, count]) => ({ keyword, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20);

        setKeywords(sorted);
      }
    } catch (err) {
      console.error('인기 검색어 로딩 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopular();
    const interval = setInterval(fetchPopular, 5000);
    return () => clearInterval(interval);
  }, []);

  // 순위별 뱃지 스타일
  const getRankStyle = (index: number) => {
    if (index === 0) return "bg-yellow-100 text-yellow-700 border-yellow-200"; 
    if (index === 1) return "bg-slate-100 text-slate-600 border-slate-200";   
    if (index === 2) return "bg-orange-100 text-orange-700 border-orange-200"; 
    return "bg-white text-slate-400 border-slate-100"; 
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col ${className || 'h-[340px]'}`}>
      
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
        <h3 className="text-sm md:text-base font-bold text-slate-800 flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-full text-[10px] shadow-sm">🔥</span>
          인기 검색어 Top 20
        </h3>
        
        <Link href="/popular" className="text-[11px] text-slate-400 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors">
          더보기 &gt;
        </Link>
      </div>
      
      {/* 리스트 영역 (간격 축소 적용됨) */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-1"> 
        {loading ? (
          <div className="flex flex-col justify-center items-center h-full text-slate-400 gap-2">
            <div className="w-4 h-4 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-[10px]">집계 중...</span>
          </div>
        ) : keywords.length > 0 ? (
          keywords.map((item, index) => (
            <button 
              key={item.keyword}
              onClick={() => router.push(`/?q=${encodeURIComponent(item.keyword)}`)}
              // [수정 포인트] py-1.5로 줄여서 높이를 슬림하게 만듦
              className="group flex justify-between items-center w-full py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {/* 순위 뱃지 (사이즈 미세 조정) */}
                <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-bold border ${getRankStyle(index)}`}>
                  {index + 1}
                </span>
                
                {/* 검색어 */}
                <span className={`text-xs md:text-sm truncate max-w-[130px] ${index < 3 ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
                  {item.keyword}
                </span>
              </div>

              <div className="flex items-center gap-1.5 pl-2">
                {/* 검색 횟수 */}
                <span className="text-[10px] text-slate-400 font-mono">{item.count}</span>
                
                {/* 상승 아이콘 */}
                {index < 3 && <span className="text-[8px] text-red-500 animate-pulse">▲</span>}
              </div>
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-300 text-xs italic">
            <p>데이터 없음</p>
          </div>
        )}
      </div>
    </div>
  );
}