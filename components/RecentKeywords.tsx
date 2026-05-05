'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Keyword {
  keyword: string;
  count: number;
}

// 🎨 17가지 파스텔톤 (그대로 유지!)
const COLOR_PALETTES = [
  'bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:border-red-200',
  'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100 hover:border-orange-200',
  'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100 hover:border-amber-200',
  'bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-100 hover:border-yellow-200',
  'bg-lime-50 text-lime-600 border-lime-100 hover:bg-lime-100 hover:border-lime-200',
  'bg-green-50 text-green-600 border-green-100 hover:bg-green-100 hover:border-green-200',
  'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200',
  'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100 hover:border-teal-200',
  'bg-cyan-50 text-cyan-600 border-cyan-100 hover:bg-cyan-100 hover:border-cyan-200',
  'bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-100 hover:border-sky-200',
  'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:border-blue-200',
  'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200',
  'bg-violet-50 text-violet-600 border-violet-100 hover:bg-violet-100 hover:border-violet-200',
  'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100 hover:border-purple-200',
  'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100 hover:bg-fuchsia-100 hover:border-fuchsia-200',
  'bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100 hover:border-pink-200',
  'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 hover:border-rose-200',
];

export default function RecentKeywords({ className }: { className?: string }) {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  // 🔥 Supabase 클라이언트 연결
  const supabase = createClientComponentClient();

  useEffect(() => {
    setMounted(true);
    fetchInitialKeywords();

    // 🌟 핵심 마법: Supabase Realtime 구독 (채팅창처럼 실시간 수신)
    const channel = supabase
      .channel('realtime_search_logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'search_logs' },
        (payload) => {
          const newWord = payload.new.keyword;
          if (newWord) {
            setKeywords((prev) => {
              // 중복되는 단어가 있으면 지우고 맨 앞에 새롭게 띄움 (채팅 최신글처럼)
              const filtered = prev.filter((k) => k.keyword !== newWord);
              return [{ keyword: newWord, count: 1 }, ...filtered].slice(0, 15); // 최신 15개 유지
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // 페이지 처음 로딩 시 DB에서 최신 검색어 15개를 가져옴
  const fetchInitialKeywords = async () => {
    try {
      const { data } = await supabase
        .from('search_logs')
        .select('keyword')
        .order('created_at', { ascending: false })
        .limit(100);

      if (data) {
        const unique: Keyword[] = [];
        const seen = new Set<string>();
        for (const row of data) {
          if (!seen.has(row.keyword)) {
            seen.add(row.keyword);
            unique.push({ keyword: row.keyword, count: 1 });
          }
          if (unique.length >= 15) break;
        }
        setKeywords(unique);
      }
    } catch (e) {
      console.error('초기 데이터 로드 실패:', e);
    }
  };

  const handleKeywordClick = (text: string) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    const finalQuery = trimmed.endsWith(' ') ? trimmed : trimmed + ' ';
    router.push(`/?q=${encodeURIComponent(finalQuery)}`);
  };

  const getColorClass = (word: string) => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) hash = word.charCodeAt(i) + ((hash << 5) - hash);
    const index = Math.abs(hash % COLOR_PALETTES.length);
    return COLOR_PALETTES[index];
  };

  if (!mounted) return null;

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full ${
        className || ''
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          {/* 🔥 실시간 깜빡임 효과 (LIVE) */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          실시간 라이브 검색
        </h3>

        <div className="flex items-center gap-3">
          <Link
            href="/recent"
            className="text-[11px] text-slate-400 hover:text-blue-600 flex items-center gap-0.5 cursor-pointer transition-colors font-medium"
          >
            더보기 &gt;
          </Link>
        </div>
      </div>

      <div className="flex-grow w-full">
        {keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {keywords.map((item, index) => (
              <div
                key={`${item.keyword}-${index}`}
                onClick={() => handleKeywordClick(item.keyword)}
                className={`group flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border cursor-pointer transition-all hover:scale-105 ${getColorClass(
                  item.keyword
                )}`}
              >
                <span className="font-bold truncate max-w-[140px] sm:max-w-none"># {item.keyword}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-20 text-slate-300 gap-2">
            <div className="text-xl opacity-20">📡</div>
            <p className="text-[11px]">실시간 검색어를 수신 중입니다...</p>
          </div>
        )}
      </div>
    </div>
  );
}