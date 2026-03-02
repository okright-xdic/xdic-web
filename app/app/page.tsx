// app/app/page.tsx
// 📱 스마트폰 앱 전용 페이지

import SearchPage from '@/components/SearchPage'; // ✅ 잘못된 경로(mobile/SearchPage) 수정 완료!
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
// export const dynamic = 'force-static';

type Row = {
  id: string;
  category_id: number;
  source_order?: number;
  line_text: string;
  line_hash?: string;
};

const ensureTrailingSpace = (s: string) => {
  const t = (s || '').trim();
  if (!t) return '';
  return t + ' ';
};

// ✅ Exact 우선 점수(낮을수록 우선) - API와 동일한 최신 로직
const matchScore = (lineText: string, keyword: string) => {
  const k = keyword.trim().toLowerCase();
  const t = (lineText || '').toLowerCase();

  const isExact =
    t === k ||
    t === `${k} ` ||
    t.startsWith(`${k} `) ||
    t.startsWith(`${k}:`);

  if (isExact) return 0;
  if (t.startsWith(k)) return 1;
  if (t.includes(k)) return 2;
  return 3;
};

const sortBucket = (items: Row[], keyword: string) => {
  return (items || []).sort((a, b) => {
    const sa = matchScore(a.line_text, keyword);
    const sb = matchScore(b.line_text, keyword);
    if (sa !== sb) return sa - sb;

    const ao = typeof a.source_order === 'number' ? a.source_order : 0;
    const bo = typeof b.source_order === 'number' ? b.source_order : 0;
    if (ao !== bo) return ao - bo;

    return (a.line_text || '').localeCompare(b.line_text || '');
  });
};

// ✅ 지그재그 교차(1→12, 한 줄씩)로 최대 120개 - API와 동일한 최신 로직
const zigzagInterleave = (buckets: Record<number, Row[]>, maxTotal = 120) => {
  const out: Row[] = [];
  let progressed = true;

  while (out.length < maxTotal && progressed) {
    progressed = false;
    for (let cat = 1; cat <= 12 && out.length < maxTotal; cat++) {
      const arr = buckets[cat];
      if (!arr || arr.length === 0) continue;
      out.push(arr.shift()!);
      progressed = true;
    }
  }
  return out;
};

export default async function Page({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';
  const supabase = createServerComponentClient({ cookies });

  const trimmed = (query || '').trim();
  const noSpaceLen = trimmed.replace(/\s+/g, '').length;

  let results: Row[] = [];
  let highlightKeys: string[] = [trimmed];

  // ✅ 1글자도 허용 (빈 값만 차단)
  if (trimmed && noSpaceLen >= 1) {
    try {
      // ✅ 하이라이트 키워드 추출 (Category 0)
      const { data: cat0Data } = await supabase
        .from('dictionary_lines')
        .select('line_text')
        .eq('category_id', 0)
        .ilike('line_text', `%${trimmed}%`)
        .limit(10);

      if (cat0Data && cat0Data.length > 0) {
        cat0Data.forEach((row: any) => {
          const words = row.line_text.split(/\s+/);
          highlightKeys = [...highlightKeys, ...words];
        });
        highlightKeys = [...new Set(highlightKeys)].filter((w) => w.length > 0);
      }

      // ✅ API 서버와 완벽하게 동일한 3단계 검색 로직 이식 완료!
      const q1 = ensureTrailingSpace(trimmed); // 1) 무조건 뒤에 space
      const q2 = trimmed;                      // 2) space 제거
      const hasInnerSpace = /\s+/.test(trimmed);
      const q3 = hasInnerSpace ? ensureTrailingSpace(trimmed.replace(/\s+/g, '')) : ''; // 3) 합치기(+space)

      const merged: Row[] = [];
      const seen = new Set<string>();

      const pushAll = (arr: any[] | null | undefined) => {
        if (!arr) return;
        for (const it of arr) {
          const id = String(it.id);
          if (seen.has(id)) continue;
          seen.add(id);
          merged.push(it as Row);
        }
      };

      // 1) space 붙인 검색
      const { data: data1, error: err1 } = await supabase.rpc('search_dictionary_v8', { keyword: q1 });
      pushAll(data1);

      // 2) 0건이면 space 제거 검색
      if (merged.length === 0) {
        const { data: data2 } = await supabase.rpc('search_dictionary_v8', { keyword: q2 });
        pushAll(data2);
      }

      // 3) 그래도 0건이면 합치기(공백 있었을 때만)
      if (merged.length === 0 && q3) {
        const { data: data3 } = await supabase.rpc('search_dictionary_v8', { keyword: q3 });
        pushAll(data3);
      }

      // RPC가 실패했고 여전히 0이면 마지막 안전장치(ilike)
      if ((err1 as any) && merged.length === 0) {
        const { data: fallback } = await supabase
          .from('dictionary_lines')
          .select('id, category_id, source_order, line_text, line_hash')
          .ilike('line_text', `%${trimmed}%`)
          .order('category_id', { ascending: true })
          .order('source_order', { ascending: true })
          .limit(600);

        pushAll(fallback as any[]);
      }

      // 카테고리 버킷화 + 정렬 + 카테고리별 최대 10개 지그재그
      const buckets: Record<number, Row[]> = {};
      for (let cat = 1; cat <= 12; cat++) buckets[cat] = [];

      for (const r of merged) {
        const cat = Number(r.category_id);
        if (cat >= 1 && cat <= 12) buckets[cat].push(r);
      }

      for (let cat = 1; cat <= 12; cat++) {
        buckets[cat] = sortBucket(buckets[cat], trimmed).slice(0, 10);
      }

      results = zigzagInterleave(buckets, 120);

    } catch (e) {
      console.error('❌ 앱 검색 실패:', e);
    }
  }

  return <SearchPage query={query} results={results} highlightList={highlightKeys} isApp={true} />;
}