// app/app/page.tsx
// 📱 스마트폰 앱 전용 페이지

import SearchPage from '@/components/mobile/SearchPage';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// [로테이션 정렬 함수] - PC와 동일
const rotateResults = (items: any[], keyword: string) => {
  if (!items || items.length === 0) return [];
  const lowerKeyword = keyword.trim().toLowerCase();
  const buckets: Record<number, any[]> = {};
  for (let i = 1; i <= 12; i++) buckets[i] = [];

  const advancedSort = (a: any, b: any) => {
    const aText = a.line_text.toLowerCase();
    const bText = b.line_text.toLowerCase();
    const isExactA =
      aText === lowerKeyword || aText.startsWith(lowerKeyword + ' ') || aText.startsWith(lowerKeyword + ':');
    const isExactB =
      bText === lowerKeyword || bText.startsWith(lowerKeyword + ' ') || bText.startsWith(lowerKeyword + ':');
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

export default async function Page({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';
  const supabase = createServerComponentClient({ cookies });

  let results: any[] = [];
  let highlightKeys: string[] = [query.trim()];

  if (query.trim() && query.trim().length >= 2) {
    try {
      const cleanQuery = query.trim();
      const originalQuery = query;

      const { data: cat0Data } = await supabase
        .from('dictionary_lines')
        .select('line_text')
        .eq('category_id', 0)
        .ilike('line_text', `%${cleanQuery}%`)
        .limit(10);

      if (cat0Data && cat0Data.length > 0) {
        cat0Data.forEach((row: any) => {
          const words = row.line_text.split(/\s+/);
          highlightKeys = [...highlightKeys, ...words];
        });
        highlightKeys = [...new Set(highlightKeys)].filter((w) => w.length > 0);
      }

      let { data, error } = await supabase.rpc('search_dictionary_v8', { keyword: originalQuery });
      if (!error && data) results = data;

      const uniqueCats = new Set(results.map((item: any) => item.category_id));
      if (results.length < 30 || uniqueCats.size < 3) {
        const { data: broadData } = await supabase.rpc('search_dictionary_v8', { keyword: cleanQuery });
        if (broadData && broadData.length > 0) {
          const existingIds = new Set(results.map((r: any) => r.id));
          const newItems = broadData.filter((item: any) => !existingIds.has(item.id));
          results = [...results, ...newItems];
        }
      }

      if (results.length === 0 && cleanQuery.includes(' ')) {
        const noSpaceQuery = cleanQuery.replace(/\s+/g, '');
        const { data: retryData } = await supabase.rpc('search_dictionary_v8', { keyword: noSpaceQuery });
        if (retryData && retryData.length > 0) results = retryData;
      }

      if (results.length === 0) {
        const paddedQuery = cleanQuery + ' ';
        const { data: retryData2 } = await supabase.rpc('search_dictionary_v8', { keyword: paddedQuery });
        if (retryData2 && retryData2.length > 0) results = retryData2;
      }

      if (results.length === 0 && error) {
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
      console.error('❌ 앱 검색 실패:', e);
    }
  }

  return <SearchPage query={query} results={results} highlightList={highlightKeys} isApp={true} />;
}