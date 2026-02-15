import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// [정렬 함수 동일 적용]
const sortResults = (items: any[], keyword: string) => {
  if (!items || items.length === 0) return [];
  const lowerKeyword = keyword.trim().toLowerCase();
  
  return items.sort((a, b) => {
    // 1. 카테고리 우선
    if (a.category_id !== b.category_id) {
      return a.category_id - b.category_id;
    }

    const aText = a.line_text.toLowerCase();
    const bText = b.line_text.toLowerCase();

    // 2. 정확도 우선 (완전 일치 > 시작 일치 > 포함 일치)
    const isExactA = aText === lowerKeyword || aText.startsWith(lowerKeyword + ' ') || aText.startsWith(lowerKeyword + ':');
    const isExactB = bText === lowerKeyword || bText.startsWith(lowerKeyword + ' ') || bText.startsWith(lowerKeyword + ':');

    if (isExactA && !isExactB) return -1;
    if (!isExactA && isExactB) return 1;

    const startsA = aText.startsWith(lowerKeyword);
    const startsB = bText.startsWith(lowerKeyword);

    if (startsA && !startsB) return -1;
    if (!startsA && startsB) return 1;

    return aText.localeCompare(bText);
  });
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('q');

  // 2글자 미만 차단
  if (!keyword || keyword.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = createRouteHandlerClient({ cookies });
  let results: any[] = [];
  const cleanQuery = keyword.trim();

  try {
    // [기존 로직 유지] Space 추가 검색 우선
    const paddedQuery = cleanQuery + ' ';
    let { data, error } = await supabase
      .rpc('search_dictionary_v8', { keyword: paddedQuery });

    // 결과 보충
    if (!error && (!data || data.length < 10)) {
       const { data: broadData } = await supabase
        .rpc('search_dictionary_v8', { keyword: cleanQuery });
       
       if (broadData) {
         const existingIds = new Set(data?.map((item: any) => item.id) || []);
         const newItems = broadData.filter((item: any) => !existingIds.has(item.id));
         results = [...(data || []), ...newItems];
       } else {
         results = data || [];
       }
    } else {
      results = data || [];
    }

    // 비상 엔진
    if (error && results.length === 0) {
      const { data: fallback } = await supabase
        .from('dictionary_lines')
        .select('*')
        .ilike('line_text', `%${cleanQuery}%`)
        .order('category_id', { ascending: true })
        .limit(100);
      results = fallback || [];
    }

    // [최종] 정렬 적용
    results = sortResults(results, cleanQuery);

  } catch (error: any) {
    console.warn('⚠️ API 검색 에러:', error.message);
    return NextResponse.json({ results: [] });
  }

  return NextResponse.json({ results });
}