'use client';

// app/app/page.tsx
// 📱 스마트폰 앱 전용 페이지 (클라이언트 fetch 방식으로 안정화)

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchPage from '@/components/SearchPage';

type Row = {
  id: string | number;
  category_id: number;
  source_order?: number;
  line_text: string;
};

const rotateResults = (items: any[], keyword: string) => {
  if (!items || items.length === 0) return [];
  const lowerKeyword = keyword.trim().toLowerCase();
  const buckets: Record<number, any[]> = {};
  for (let i = 1; i <= 12; i++) buckets[i] = [];

  const advancedSort = (a: any, b: any) => {
    const aText = (a.line_text || '').toLowerCase();
    const bText = (b.line_text || '').toLowerCase();
    const isExactA = aText === lowerKeyword || aText.startsWith(lowerKeyword + ' ') || aText.startsWith(lowerKeyword + ':');
    const isExactB = bText === lowerKeyword || bText.startsWith(lowerKeyword + ' ') || bText.startsWith(lowerKeyword + ':');
    if (isExactA && !isExactB) return -1;
    if (!isExactA && isExactB) return 1;

    const startsA = aText.startsWith(lowerKeyword);
    const startsB = bText.startsWith(lowerKeyword);
    if (startsA && !startsB) return -1;
    if (!startsA && startsB) return 1;

    if (aText.length !== bText.length) return aText.length - bText.length;
    return aText.localeCompare(bText);
  };

  items.forEach((item) => {
    const catId = item.category_id >= 1 && item.category_id <= 12 ? item.category_id : 12;
    buckets[catId].push(item);
  });

  let maxCount = 0;
  for (let i = 1; i <= 12; i++) {
    buckets[i].sort(advancedSort);
    if (buckets[i].length > maxCount) maxCount = buckets[i].length;
  }

  const rotated: any[] = [];
  for (let i = 0; i < maxCount; i++) {
    for (let cat = 1; cat <= 12; cat++) {
      if (buckets[cat][i]) rotated.push(buckets[cat][i]);
    }
  }
  return rotated;
};

export default function AppPage() {
  const sp = useSearchParams();
  const query = useMemo(() => (sp.get('q') || '').toString(), [sp]);

  const [results, setResults] = useState<Row[]>([]);
  const [highlightKeys, setHighlightKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = (query || '').trim();
    setHighlightKeys(q ? [q] : []);

    const noSpaceLen = q.replace(/\s+/g, '').length;
    if (!q || noSpaceLen < 1) {
      setResults([]);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        const url = `/api/rpc-search?q=${encodeURIComponent(q)}`;
        const res = await fetch(url, { cache: 'no-store' });
        const json = await res.json();
        const arr: Row[] = Array.isArray(json?.results) ? json.results : [];
        const rotated = arr.length > 0 ? rotateResults(arr, q) : [];
        if (!cancelled) setResults(rotated);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [query]);

  // loading UI가 필요하면 SearchPage에 prop 추가해도 됨 (지금은 결과만 넘김)
  return <SearchPage query={query} results={results} highlightList={highlightKeys} isApp={true} />;
}