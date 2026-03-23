// app/page.tsx
// ✅ 웹(/) 서버 검색: Supabase RPC 기반 단일 로직 유지

import SearchPage from '@/components/SearchPage';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// ✅ 검색은 매 요청마다 갱신되게 (RPC/DB 반영 안정화)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// [로테이션 정렬 함수: 카테고리 Zig-zag]
const rotateResults = (items: any[], keyword: string) => {
  if (!items || items.length === 0) return [];
  const lowerKeyword = keyword.trim().toLowerCase();

  const buckets: Record<number, any[]> = {};
  for (let i = 1; i <= 12; i++) buckets[i] = [];

  const advancedSort = (a: any, b: any) => {
    const aText = (a.line_text || '').toLowerCase();
    const bText = (b.line_text || '').toLowerCase();

    const isExactA =
      aText === lowerKeyword ||
      aText.startsWith(lowerKeyword + ' ') ||
      aText.startsWith(lowerKeyword + ':');
    const isExactB =
      bText === lowerKeyword ||
      bText.startsWith(lowerKeyword + ' ') ||
      bText.startsWith(lowerKeyword + ':');

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

export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string; app?: string };
}) {
  const query = (searchParams.q || '').toString();
  const cleanQuery = query.trim();
  const noSpaceLen = cleanQuery.replace(/\s+/g, '').length;

  const supabase = createServerComponentClient({ cookies });

  let results: any[] = [];
  let highlightKeys: string[] = cleanQuery ? [cleanQuery] : [];

  // 실시간 최근 검색어 & 인기 검색어 집계 로직 (이전과 동일)
  let globalRecent: { word: string; count: number }[] = [];
  let globalPopular: string[] = [];

  try {
    const { data: logs } = await supabase
      .from('search_logs')
      .select('keyword')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (logs && logs.length > 0) {
      // 빈도수 계산
      const counts: Record<string, number> = {};
      logs.forEach(l => {
        counts[l.keyword] = (counts[l.keyword] || 0) + 1;
      });

      // 1. 최근 검색어 (중복 제거 후 최근 15개提取, 카운트 포함)
      const uniqueRecents = Array.from(new Set(logs.map(l => l.keyword)));
      globalRecent = uniqueRecents.slice(0, 15).map(word => ({
        word,
        count: counts[word] || 1
      }));

      // 2. 인기 검색어 (빈도수 계산 후 Top 20)
      globalPopular = Object.entries(counts)
        .sort((a, b) => b[1] - a[1]) // 많이 검색된 순으로 정렬
        .map(entry => entry[0])
        .slice(0, 20);
    }
  } catch (e) {
    console.error('검색어 집계 실패:', e);
  }

  if (cleanQuery && noSpaceLen >= 2) {
    try {
      const { data: cat0Data } = await supabase
        .from('dictionary_lines')
        .select('line_text')
        .eq('category_id', 0)
        .ilike('line_text', `%${cleanQuery}%`)
        .limit(10);

      if (cat0Data && cat0Data.length > 0) {
        const add: string[] = [];
        for (const row of cat0Data) {
          const words = String((row as any)?.line_text || '').split(/\s+/);
          add.push(...words);
        }
        highlightKeys = [...new Set([...highlightKeys, ...add])].filter((w) => w && w.trim());
      }

      const step1 = cleanQuery + ' ';
      const step2 = cleanQuery;
      const step3 = cleanQuery.includes(' ') ? cleanQuery.replace(/\s+/g, '') : '';

      const { data: d1, error: e1 } = await supabase.rpc('search_dictionary_v8', { keyword: step1 });
      if (!e1 && Array.isArray(d1)) results = d1;

      if (results.length === 0) {
        const { data: d2 } = await supabase.rpc('search_dictionary_v8', { keyword: step2 });
        if (Array.isArray(d2) && d2.length > 0) results = d2;
      }

      if (results.length === 0 && step3) {
        const { data: d3 } = await supabase.rpc('search_dictionary_v8', { keyword: step3 });
        if (Array.isArray(d3) && d3.length > 0) results = d3;
      }

      if (results.length === 0) {
        const { data: fallback } = await supabase
          .from('dictionary_lines')
          .select('*')
          .ilike('line_text', `%${cleanQuery}%`)
          .order('category_id', { ascending: true })
          .limit(100);

        results = fallback || [];
      }

      if (results.length > 0) {
        results = rotateResults(results, cleanQuery);
      }
    } catch (e) {
      console.error('❌ 검색 실패:', e);
    }
  }

  const isApp = searchParams.app === '1';

  // SearchPage로 집계한 데이터를 넘겨줍니다!
  return (
    <SearchPage 
      query={query} 
      results={results} 
      highlightList={highlightKeys} 
      isApp={isApp} 
      popularSearches={globalPopular}
      recentSearches={globalRecent}
    />
  );
}