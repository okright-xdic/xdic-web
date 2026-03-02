import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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

// ✅ Exact 우선 점수(낮을수록 우선)
const matchScore = (lineText: string, keyword: string) => {
  const k = keyword.trim().toLowerCase();
  const t = (lineText || '').toLowerCase();

  const isExact = t === k || t === `${k} ` || t.startsWith(`${k} `) || t.startsWith(`${k}:`);
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

// ✅ 지그재그 교차(1→12, 한 줄씩)로 최대 120개
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('q') ?? '';
    const trimmed = (keyword || '').trim();
    const noSpaceLen = trimmed.replace(/\s+/g, '').length;

    if (!trimmed || noSpaceLen < 1) {
      return NextResponse.json({ results: [], meta: { total: 0 } });
    }

    const supabase = createRouteHandlerClient({ cookies });

    // ✅ 3단계
    const q1 = ensureTrailingSpace(trimmed); // 1) 뒤에 space
    const q2 = trimmed; // 2) 원본
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

    const { data: data1, error: err1 } = await supabase.rpc('search_dictionary_v8', { keyword: q1 });
    pushAll(data1);

    if (merged.length === 0) {
      const { data: data2 } = await supabase.rpc('search_dictionary_v8', { keyword: q2 });
      pushAll(data2);
    }

    if (merged.length === 0 && q3) {
      const { data: data3 } = await supabase.rpc('search_dictionary_v8', { keyword: q3 });
      pushAll(data3);
    }

    if (err1 && merged.length === 0) {
      const { data: fallback } = await supabase
        .from('dictionary_lines')
        .select('id, category_id, source_order, line_text, line_hash')
        .ilike('line_text', `%${trimmed}%`)
        .order('category_id', { ascending: true })
        .order('source_order', { ascending: true })
        .limit(600);

      pushAll(fallback as any[]);
    }

    const buckets: Record<number, Row[]> = {};
    for (let cat = 1; cat <= 12; cat++) buckets[cat] = [];

    for (const r of merged) {
      const cat = Number(r.category_id);
      if (cat >= 1 && cat <= 12) buckets[cat].push(r);
    }

    for (let cat = 1; cat <= 12; cat++) {
      buckets[cat] = sortBucket(buckets[cat], trimmed).slice(0, 10);
    }

    const results = zigzagInterleave(buckets, 120);

    return NextResponse.json({
      results,
      meta: {
        input: keyword,
        step1: q1,
        step2: q2,
        step3: q3 || null,
        total: results.length,
        perCategoryMax: 10,
      },
    });
  } catch (error: any) {
    console.warn('⚠️ /api/rpc-search error:', error?.message || error);
    return NextResponse.json({ results: [], meta: { total: 0, error: 'search_failed' } });
  }
}