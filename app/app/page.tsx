// app/app/page.tsx

import SearchPage from '@/components/SearchPage';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

// 카테고리 ZigZag 정렬
const rotateResults = (items: any[], keyword: string) => {
  if (!items || items.length === 0) return [];

  const lowerKeyword = keyword.trim().toLowerCase();

  const buckets: Record<number, any[]> = {};
  // 🌟 수정 포인트: 0번 카테고리(기준 영어) 바구니 추가! (0부터 12까지)
  for (let i = 0; i <= 12; i++) buckets[i] = [];

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
    // 🌟 수정 포인트: 0번 카테고리 범위 포함
    const catId = item.category_id >= 0 && item.category_id <= 12 ? item.category_id : 12;
    buckets[catId].push(item);
  });

  let maxCount = 0;

  // 🌟 수정 포인트: 0번부터 순회
  for (let i = 0; i <= 12; i++) {
    buckets[i].sort(advancedSort);
    if (buckets[i].length > maxCount) maxCount = buckets[i].length;
  }

  const rotated: any[] = [];

  // 🌟 수정 포인트: 0번부터 지그재그 출력
  for (let i = 0; i < maxCount; i++) {
    for (let cat = 0; cat <= 12; cat++) {
      if (buckets[cat][i]) rotated.push(buckets[cat][i]);
    }
  }

  return rotated;
};

export default async function AppPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = (searchParams.q || '').toString();
  const cleanQuery = query.trim();
  const noSpaceLen = cleanQuery.replace(/\s+/g, '').length;

  const supabase = createServerComponentClient({ cookies });

  let results: any[] = [];
  let highlightKeys: string[] = cleanQuery ? [cleanQuery] : [];

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

      const { data: d1 } = await supabase.rpc('search_dictionary_v8', { keyword: step1 });
      if (Array.isArray(d1)) results = d1;

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

      if (results.length > 0) results = rotateResults(results, cleanQuery);
    } catch (e) {
      console.error('앱 검색 실패:', e);
    }
  }

  return (
    <SearchPage
      query={query}
      results={results}
      highlightList={highlightKeys}
      isApp={true}
    />
  );
}