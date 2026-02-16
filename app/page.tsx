// app/page.tsx
// ✅ 통합 기준: 서버 검색 로직은 여기 1곳에서만 유지 (PC 3단계 “만능”)

import SearchPage from '@/components/SearchPage';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

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

export default async function Page({ searchParams }: { searchParams: { q?: string; app?: string } }) {
  const query = searchParams.q || '';
  const supabase = createServerComponentClient({ cookies });

  let results: any[] = [];
  let highlightKeys: string[] = [query.trim()];

  const cleanQuery = query.trim();
  const noSpaceLen = cleanQuery.replace(/\s+/g, '').length;

  if (cleanQuery && noSpaceLen >= 2) {
    try {
      // ---------------------------------------------------------
      // [STEP 0] 하이라이트 확장 (Category 0번)
      // ---------------------------------------------------------
      const { data: cat0Data } = await supabase
        .from('dictionary_lines')
        .select('line_text')
        .eq('category_id', 0)
        .ilike('line_text', `%${cleanQuery}%`)
        .limit(10);

      if (cat0Data && cat0Data.length > 0) {
        cat0Data.forEach((row: any) => {
          const words = String(row.line_text || '').split(/\s+/);
          highlightKeys = [...highlightKeys, ...words];
        });
        highlightKeys = [...new Set(highlightKeys)].filter((w) => w && w.length > 0);
      }

      // ---------------------------------------------------------
      // ✅ PC 3단계 로직 (요청하신 “만능”)
      // 1) 항상 뒤에 space 붙여 검색
      // 2) 결과 없으면 space 제거 후 검색
      // 3) 그래도 없으면(공백 있으면) 합쳐서 검색
      // ---------------------------------------------------------
      const step1 = cleanQuery + ' ';
      const step2 = cleanQuery;
      const step3 = cleanQuery.includes(' ') ? cleanQuery.replace(/\s+/g, '') : '';

      // STEP 1
      let { data: d1, error: e1 } = await supabase.rpc('search_dictionary_v8', { keyword: step1 });
      if (!e1 && d1) results = d1;

      // STEP 2
      if (results.length === 0) {
        const { data: d2 } = await supabase.rpc('search_dictionary_v8', { keyword: step2 });
        if (d2 && d2.length > 0) results = d2;
      }

      // STEP 3
      if (results.length === 0 && step3) {
        const { data: d3 } = await supabase.rpc('search_dictionary_v8', { keyword: step3 });
        if (d3 && d3.length > 0) results = d3;
      }

      // [비상 검색] - RPC 실패 시 like 검색
      if (results.length === 0 && e1) {
        const { data: fallback } = await supabase
          .from('dictionary_lines')
          .select('*')
          .ilike('line_text', `%${cleanQuery}%`)
          .order('category_id', { ascending: true })
          .limit(100);
        results = fallback || [];
      }

      // [최종 정렬]
      if (results.length > 0) {
        results = rotateResults(results, cleanQuery);
      }
    } catch (e) {
      console.error('❌ 검색 실패:', e);
    }
  }

  // ✅ app=1이면 광고/배너 숨김 (SearchPage에서 URL로도 감지함)
  const isApp = searchParams.app === '1';

  return <SearchPage query={query} results={results} highlightList={highlightKeys} isApp={isApp} />;
}
