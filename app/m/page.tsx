// app/m/page.tsx
// 📱 모바일 웹 메인 페이지 (서버 사이드: 1글자 검색 + 우선순위 매칭 로직 적용)

import SearchPage from '@/components/mobile/SearchPage'; // [참고] 경로는 실제 파일 위치에 맞게
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// [로테이션 정렬 함수: 카테고리 Zig-zag]
const rotateResults = (items: any[], keyword: string) => {
  if (!items || items.length === 0) return [];
  
  const lowerKeyword = keyword.trim().toLowerCase();
  const keywordWithSpace = lowerKeyword + ' '; // "사랑 "

  const buckets: Record<number, any[]> = {};
  for (let i = 1; i <= 12; i++) {
    buckets[i] = [];
  }

  // [정렬 우선순위 강화]
  const advancedSort = (a: any, b: any) => {
    const aText = a.line_text.toLowerCase();
    const bText = b.line_text.toLowerCase();
    
    // 0순위: 완전 일치 (Exact Match) "사랑"
    const exactA = aText === lowerKeyword;
    const exactB = bText === lowerKeyword;
    if (exactA && !exactB) return -1;
    if (!exactA && exactB) return 1;

    // 1순위: "단어 + 공백"으로 시작하는 경우 (단어 경계) "사랑 " -> "사랑의" 보다 우선
    const spaceA = aText.startsWith(keywordWithSpace);
    const spaceB = bText.startsWith(keywordWithSpace);
    if (spaceA && !spaceB) return -1;
    if (!spaceA && spaceB) return 1;

    // 2순위: 그냥 시작하는 경우 "사랑해"
    const startsA = aText.startsWith(lowerKeyword);
    const startsB = bText.startsWith(lowerKeyword);
    if (startsA && !startsB) return -1;
    if (!startsA && startsB) return 1;

    // 3순위: 길이 짧은 순
    if (aText.length !== bText.length) {
        return aText.length - bText.length;
    }
    return aText.localeCompare(bText);
  };

  // 버킷에 담기
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
  let highlightKeys: string[] = [query.trim()];

  // [수정] 1글자 이상이면 검색 수행
  if (query.trim().length > 0) {
    try {
      const cleanQuery = query.trim(); 
      const originalQuery = query;

      // =========================================================
      // [CASE 1] 1글자 검색일 때 -> 초고속 모드 (Exact Match Only)
      // =========================================================
      if (cleanQuery.length === 1) {
        const { data: oneCharData } = await supabase
          .from('dictionary_lines')
          .select('id, line_text, category_id, source_order')
          .eq('line_text', cleanQuery) 
          .limit(100);
        
        if (oneCharData) results = oneCharData;

      } else {
        // =========================================================
        // [CASE 2] 2글자 이상 -> "단어 + 공백" 우선 검색
        // =========================================================
        
        // 1. [우선 검색]
        const { data: priorityData } = await supabase
           .from('dictionary_lines')
           .select('id, line_text, category_id, source_order')
           .or(`line_text.eq.${cleanQuery},line_text.ilike.${cleanQuery} %`) 
           .limit(50);

        // 2. [일반 검색] RPC
        const { data: rpcData, error } = await supabase
          .rpc('search_dictionary_v8', { keyword: originalQuery });

        // 데이터 합치기
        let merged: any[] = [];
        const seenIds = new Set();

        if (priorityData) {
            priorityData.forEach((item: any) => {
                merged.push(item);
                seenIds.add(item.id);
            });
        }

        if (rpcData) {
            rpcData.forEach((item: any) => {
                if (!seenIds.has(item.id)) {
                    merged.push(item);
                    seenIds.add(item.id);
                }
            });
        }
        results = merged;

        // [비상 검색]
        if (results.length < 5) {
             const { data: fallback } = await supabase
              .from('dictionary_lines')
              .select('*')
              .ilike('line_text', `%${cleanQuery}%`) 
              .order('category_id', { ascending: true })
              .limit(50);
              
             if (fallback) {
                 fallback.forEach((item: any) => {
                     if (!seenIds.has(item.id)) {
                         results.push(item);
                         seenIds.add(item.id);
                     }
                 });
             }
        }
      }

      // [하이라이트 확장]
      if (cleanQuery.length >= 2) {
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
            highlightKeys = [...new Set(highlightKeys)].filter(w => w.length > 0);
          }
      }

      // [최종 정렬]
      if (results.length > 0) {
        results = rotateResults(results, cleanQuery);
      }

    } catch (e) {
      console.error('❌ 모바일 검색 실패:', e);
    }
  }

  // 모바일 전용 컴포넌트 반환
  return <SearchPage query={query} results={results} highlightList={highlightKeys} />;
}