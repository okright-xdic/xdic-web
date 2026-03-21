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

  useEffect(() => {
    const fetchNuances = async () => {
      const { data } = await supabase
        .from('nuances')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (data) setNuances(data);
    };
    fetchNuances();
  }, []);

  if (nuances.length === 0) return null; 

  return (
    <div className="bg-emerald-50/40 rounded-xl md:rounded-2xl p-4 md:p-6 border border-emerald-100 shadow-sm w-full">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h2 className="text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-2">
          <span className="text-emerald-600">💡</span> 영단어 뉘앙스 & 숙어 해설
        </h2>
        {/* 더보기는 게시판 대문으로 이동 */}
        <Link href="/nuance">
          <span className="text-xs font-bold text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors">
            더보기 +
          </span>
        </Link>
      </div>
      
      <ul className="space-y-2.5">
        {nuances.map((nuance, index) => (
          <li key={nuance.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow transition-all group">
            {/* 🌟 수정된 부분: 링크 주소에 해당 글의 고유 번호(id)를 달아서 보냅니다! */}
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