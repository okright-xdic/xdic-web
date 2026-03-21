'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface BoardItem {
  id: number;
  title: string;
  created_at: string;
}

export default function NuanceWidget() {
  const supabase = createClient();
  const [nuances, setNuances] = useState<BoardItem[]>([]);
  const [idioms, setIdioms] = useState<BoardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 🌟 두 게시판의 데이터를 동시에 빛의 속도로 불러옵니다!
      const [nuanceRes, idiomRes] = await Promise.all([
        supabase.from('nuances').select('id, title, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('idioms').select('id, title, created_at').order('created_at', { ascending: false }).limit(3)
      ]);
      
      if (nuanceRes.data) setNuances(nuanceRes.data);
      if (idiomRes.data) setIdioms(idiomRes.data);
      
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
        {/* 뉘앙스 로딩 뼈대 (초록) */}
        <div className="bg-emerald-50/40 rounded-xl md:rounded-2xl p-4 md:p-6 border border-emerald-100 shadow-sm">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <h2 className="text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span className="text-emerald-600">💡</span> 영단어 뉘앙스 해설
            </h2>
            <div className="w-10 h-4 bg-emerald-200/50 rounded animate-pulse"></div>
          </div>
          <ul className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <li key={i} className="bg-white/50 p-3 rounded-lg border border-slate-200/50 shadow-sm flex items-center gap-3 animate-pulse">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-100/50 rounded-full"></div>
                <div className="h-4 bg-slate-200/50 rounded w-3/4"></div>
              </li>
            ))}
          </ul>
        </div>

        {/* 숙어 로딩 뼈대 (파랑) */}
        <div className="bg-blue-50/40 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-100 shadow-sm">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <h2 className="text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span className="text-blue-600">📚</span> 필수 숙어 해설
            </h2>
            <div className="w-10 h-4 bg-blue-200/50 rounded animate-pulse"></div>
          </div>
          <ul className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <li key={i} className="bg-white/50 p-3 rounded-lg border border-slate-200/50 shadow-sm flex items-center gap-3 animate-pulse">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100/50 rounded-full"></div>
                <div className="h-4 bg-slate-200/50 rounded w-3/4"></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
      {/* 1. 뉘앙스 해설 위젯 (초록색 테마) */}
      <div className="bg-emerald-50/40 rounded-xl md:rounded-2xl p-4 md:p-6 border border-emerald-100 shadow-sm">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h2 className="text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-2">
            <span className="text-emerald-600">💡</span> 영단어 뉘앙스 해설
          </h2>
          <Link href="/nuance">
            <span className="text-xs font-bold text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors">
              더보기 +
            </span>
          </Link>
        </div>
        <ul className="space-y-2.5">
          {nuances.length > 0 ? nuances.map((item, index) => (
            <li key={item.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow transition-all group">
              <Link href={`/nuance?id=${item.id}`} className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-emerald-100 text-emerald-700 text-[12px] font-black rounded-full shadow-inner">
                  {index + 1}
                </span>
                <p className="text-[13px] md:text-[14px] font-bold text-slate-700 group-hover:text-emerald-700 truncate">
                  {item.title}
                </p>
              </Link>
            </li>
          )) : (
            <div className="text-xs text-slate-400 text-center py-4">게시물이 없습니다.</div>
          )}
        </ul>
      </div>

      {/* 2. 필수 숙어 해설 위젯 (파란색 테마) */}
      <div className="bg-blue-50/40 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-100 shadow-sm">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h2 className="text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-2">
            <span className="text-blue-600">📚</span> 필수 숙어 해설
          </h2>
          <Link href="/idiom">
            <span className="text-xs font-bold text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">
              더보기 +
            </span>
          </Link>
        </div>
        <ul className="space-y-2.5">
          {idioms.length > 0 ? idioms.map((item, index) => (
            <li key={item.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow transition-all group">
              <Link href={`/idiom?id=${item.id}`} className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 text-[12px] font-black rounded-full shadow-inner">
                  {index + 1}
                </span>
                <p className="text-[13px] md:text-[14px] font-bold text-slate-700 group-hover:text-blue-700 truncate">
                  {item.title}
                </p>
              </Link>
            </li>
          )) : (
            <div className="text-xs text-slate-400 text-center py-4">게시물이 없습니다.</div>
          )}
        </ul>
      </div>
    </div>
  );
}