'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface Nuance {
  id: number;
  title: string;
  created_at: string;
}

export default function NuanceWidget() {
  const supabase = createClient();
  const [nuances, setNuances] = useState<Nuance[]>([]);
  // 🌟 로딩 상태를 관리하는 스위치를 하나 추가합니다!
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNuances = async () => {
      const { data } = await supabase
        .from('nuances')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (data) setNuances(data);
      // 데이터가 도착하면 로딩 끝!
      setIsLoading(false);
    };
    fetchNuances();
  }, []);

  // 🌟 [핵심 마법] 로딩 중일 때는 밀리지 않도록 똑같은 크기의 뼈대(Skeleton)를 보여줍니다.
  if (isLoading) {
    return (
      <div className="bg-emerald-50/40 rounded-xl md:rounded-2xl p-4 md:p-6 border border-emerald-100 shadow-sm w-full">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h2 className="text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-2">
            <span className="text-emerald-600">💡</span> 영단어 뉘앙스 & 숙어 해설
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
    );
  }

  // 등록된 글이 진짜로 없을 때만 숨김
  if (nuances.length === 0) return null; 

  return (
    <div className="bg-emerald-50/40 rounded-xl md:rounded-2xl p-4 md:p-6 border border-emerald-100 shadow-sm w-full">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h2 className="text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-2">
          <span className="text-emerald-600">💡</span> 영단어 뉘앙스 & 숙어 해설
        </h2>
        <Link href="/nuance">
          <span className="text-xs font-bold text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors">
            더보기 +
          </span>
        </Link>
      </div>
      
      <ul className="space-y-2.5">
        {nuances.map((nuance, index) => (
          <li key={nuance.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow transition-all group">
            <Link href={`/nuance?id=${nuance.id}`} className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-emerald-100 text-emerald-700 text-[12px] font-black rounded-full shadow-inner">
                {index + 1}
              </span>
              <p className="text-[13px] md:text-[14px] font-bold text-slate-700 group-hover:text-emerald-700 truncate">
                {nuance.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}