'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Keyword {
  keyword: string;
  count: number;
}

const RECENT_KEY = 'recent_searches_v2';
const UPDATED_EVENT = 'xdic_recent_searches_updated';

// 🎨 17가지 파스텔톤
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

  const normalizeStored = (raw: string | null): Keyword[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);

      // ✅ 새 포맷: [{keyword,count}]
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
        return parsed
          .map((x: any) => ({
            keyword: String(x?.keyword || '').trim(),
            count: Number(x?.count || 1),
          }))
          .filter((x: Keyword) => x.keyword);
      }

      // ✅ 구 포맷: ["사랑","가"]
      if (Array.isArray(parsed) && (parsed.length === 0 || typeof parsed[0] === 'string')) {
        return parsed
          .map((s: any) => String(s || '').trim())
          .filter(Boolean)
          .map((keyword) => ({ keyword, count: 1 }));
      }

      return [];
    } catch (e) {
      console.error('최근 검색어 로드 실패:', e);
      return [];
    }
  };

  const loadKeywords = () => {
    const loaded = localStorage.getItem(RECENT_KEY);
    const normalized = normalizeStored(loaded);
    setKeywords(normalized);
  };

  useEffect(() => {
    setMounted(true);
    loadKeywords();

    // ✅ 같은 탭: custom event
    window.addEventListener(UPDATED_EVENT, loadKeywords);

    // ✅ 다른 탭/창: storage event
    window.addEventListener('storage', loadKeywords);

    return () => {
      window.removeEventListener(UPDATED_EVENT, loadKeywords);
      window.removeEventListener('storage', loadKeywords);
    };
  }, []);

  const handleKeywordClick = (text: string) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return;

    // PC: 항상 뒤에 공백 붙여 이동 (서버 3단계 로직이 처리)
    const finalQuery = trimmed.endsWith(' ') ? trimmed : trimmed + ' ';
    router.push(`/?q=${encodeURIComponent(finalQuery)}`);
  };

  const handleClearAll = () => {
    if (confirm('최근 검색 기록을 모두 삭제하시겠습니까?')) {
      localStorage.removeItem(RECENT_KEY);
      setKeywords([]);
      window.dispatchEvent(new Event(UPDATED_EVENT));
    }
  };

  const handleDeleteOne = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    const newKeywords = keywords.filter((k) => k.keyword !== text);
    setKeywords(newKeywords);
    localStorage.setItem(RECENT_KEY, JSON.stringify(newKeywords));
    window.dispatchEvent(new Event(UPDATED_EVENT));
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
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <span className="text-base">🕒</span> 최근 검색어
        </h3>

        <div className="flex items-center gap-3">
          {keywords.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-[11px] text-slate-400 hover:text-red-500 underline decoration-slate-200 underline-offset-2 transition-colors"
              title="모든 기록을 삭제합니다"
            >
              전체 삭제
            </button>
          )}

          {keywords.length > 0 && <span className="text-[10px] text-slate-200">|</span>}

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
            {keywords.slice(0, 10).map((item, index) => (
              <div
                key={`${item.keyword}-${index}`}
                onClick={() => handleKeywordClick(item.keyword)}
                className={`group flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border cursor-pointer transition-all ${getColorClass(
                  item.keyword
                )}`}
              >
                <span className="font-bold truncate max-w-[140px] sm:max-w-none"># {item.keyword}</span>
                {item.count > 1 && (
                  <span className="text-[10px] opacity-70 font-extrabold ml-0.5">(x{item.count})</span>
                )}
                <button
                  onClick={(e) => handleDeleteOne(e, item.keyword)}
                  className="w-3.5 h-3.5 flex items-center justify-center rounded-full opacity-40 hover:opacity-100 hover:bg-black/10 ml-0.5 transition-all"
                  title="삭제"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-20 text-slate-300 gap-2">
            <div className="text-xl opacity-20">💬</div>
            <p className="text-[11px]">최근 검색 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
