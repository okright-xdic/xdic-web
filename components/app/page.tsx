// app/page.tsx

import SearchPage from '@/components/SearchPage';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// [로테이션 정렬 함수: 카테고리 Zig-zag]
const rotateResults = (items: any[], keyword: string) => {
  if (!items || items.length === 0) return [];
  
  const lowerKeyword = keyword.trim().toLowerCase();
  
  const buckets: Record<number, any[]> = {};
  for (let i = 1; i <= 12; i++) {
    buckets[i] = [];
  }

  // 정렬 로직
  const advancedSort = (a: any, b: any) => {
    const aText = a.line_text.toLowerCase();
    const bText = b.line_text.toLowerCase();

    // 1. 정확도
    const isExactA = aText === lowerKeyword || aText.startsWith(lowerKeyword + ' ') || aText.startsWith(lowerKeyword + ':');
    const isExactB = bText === lowerKeyword || bText.startsWith(lowerKeyword + ' ') || bText.startsWith(lowerKeyword + ':');
    if (isExactA && !isExactB) return -1;
    if (!isExactA && isExactB) return 1;

    // 2. 시작 단어
    const startsA = aText.startsWith(lowerKeyword);
    const startsB = bText.startsWith(lowerKeyword);
    if (startsA && !startsB) return -1;
    if (!startsA && startsB) return 1;

    // 3. 길이 (짧은 것 우선)
    if (aText.length !== bText.length) {
        return aText.length - bText.length;
    }
    return aText.localeCompare(bText);
  };

  // 분류
  items.forEach((item) => {
    const catId = (item.category_id >= 1 && item.category_id <= 12) ? item.category_id : 12;
    buckets[catId].push(item);
  });

  let maxCount = 0;
  for (let i = 1; i <= 12; i++) {
    buckets[i].sort(advancedSort);
    if (buckets[i].length > maxCount) maxCount = buckets[i].length;
  }

  // 지그재그 추출
  const rotated: any[] = [];
  for (let i = 0; i < maxCount; i++) {
    for (let cat = 1; cat <= 12; cat++) {
      if (buckets[cat][i]) {
        rotated.push(buckets[cat][i]);
      }
    }
  }

  return rotated;
};

export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';
  const supabase = createServerComponentClient({ cookies });
  let results: any[] = [];
  
  // [★ 핵심] 하이라이트 키워드 리스트 (기본적으로 검색어 포함)
  let highlightKeys: string[] = [query.trim()];

  if (query.trim() && query.trim().length >= 2) {
    try {
      const cleanQuery = query.trim(); 
      const originalQuery = query;     

      // ---------------------------------------------------------
      // [STEP 0] 하이라이트 확장 (Category 0번 참조) -> 이게 빠져서 안됐던 겁니다!
      // ---------------------------------------------------------
      const { data: cat0Data } = await supabase
        .from('dictionary_lines')
        .select('line_text')
        .eq('category_id', 0) 
        .ilike('line_text', `%${cleanQuery}%`)
        .limit(10); // 넉넉하게 10개

      if (cat0Data && cat0Data.length > 0) {
        cat0Data.forEach((row: any) => {
          // 공백으로 쪼개서 단어별로 등록 (사랑, love)
          const words = row.line_text.split(/\s+/);
          highlightKeys = [...highlightKeys, ...words];
        });
        // 중복 제거 및 빈 문자열 제거
        highlightKeys = [...new Set(highlightKeys)].filter(w => w.length > 0);
      }

      // ---------------------------------------------------------
      // [STEP 1] 실제 검색 (Category 1~12)
      // ---------------------------------------------------------
      let { data, error } = await supabase
        .rpc('search_dictionary_v8', { keyword: originalQuery });

      if (!error && data) results = data;

      // [다양성 확보]
      const uniqueCats = new Set(results.map((item: any) => item.category_id));
      if (results.length < 30 || uniqueCats.size < 3) {
        const { data: broadData } = await supabase
          .rpc('search_dictionary_v8', { keyword: cleanQuery });

        if (broadData && broadData.length > 0) {
          const existingIds = new Set(results.map((r: any) => r.id));
          const newItems = broadData.filter((item: any) => !existingIds.has(item.id));
          results = [...results, ...newItems];
        }
      }

      // [공백 제거 재시도]
      if (results.length === 0 && cleanQuery.includes(' ')) {
        const noSpaceQuery = cleanQuery.replace(/\s+/g, '');
        const { data: retryData } = await supabase
          .rpc('search_dictionary_v8', { keyword: noSpaceQuery });
        if (retryData && retryData.length > 0) results = retryData;
      }

      // [비상 검색]
      if (results.length === 0) {
         const { data: fallback } = await supabase
          .from('dictionary_lines')
          .select('*')
          .ilike('line_text', `%${cleanQuery}%`) 
          .neq('category_id', 0) // 검색 결과에는 0번 제외
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

  // [★ 중요] highlightList를 SearchPage로 전달해야 색칠이 됩니다!
  return <SearchPage query={query} results={results} highlightList={highlightKeys} />;
}