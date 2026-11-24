// XDIC_KO290_EN_PAGE_API_V1_BEGIN
// Independent, opt-in, read-only paging pilot for the verified '후보' query.
// Existing RPC/CORE pipelines, 120-row fastpath, and existing indexes are untouched.
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;
// Fetch a wider ordered window to favor the verified PGroonga plan; expose only 20 rows.
const QUERY_WINDOW = 120;
// Bound expensive deep OFFSET pagination in this first-stage pilot.
const MAX_PAGE = 500;
// Explicitly reviewed terms only; no user-defined wildcard patterns.
const KO290_EZ_ALLOWED = new Set(['후보', '후보자', 'candidate', '명단', '지원자']);

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('q') || '').trim();
  const pageRaw = searchParams.get('page') || '1';
  if (!KO290_EZ_ALLOWED.has(query) || !/^[1-9]\d{0,2}$/.test(pageRaw)) {
    return NextResponse.json(
      { error: 'KO290-EN supports only the reviewed query and valid page numbers.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }
  const page = Number(pageRaw);
  if (!Number.isSafeInteger(page) || page > MAX_PAGE) {
    return NextResponse.json(
      { error: 'Page is outside the bounded KO290-EN pilot.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  try {
    const start = (page - 1) * PAGE_SIZE;
    // 120-row planning window; return 20 rows and probe hasMore. No COUNT(*).
    const { data, error } = await db
      .from('dictionary_lines')
      .select('id,category_id,source_order,line_text')
      .neq('category_id', 0)
      .ilike('line_text', `%${query}%`)
      .order('category_id', { ascending: true, nullsFirst: false })
      .order('source_order', { ascending: true, nullsFirst: false })
      .order('id', { ascending: true })
      .range(start, start + QUERY_WINDOW - 1);

    if (error) {
      console.warn('[XDIC KO290-EN page query unavailable]', {
        code: error.code,
        page,
      });
      return NextResponse.json(
        { error: '일치 자료 조회에 실패했습니다.', code: error.code || 'DB_ERROR' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const rows = Array.isArray(data) ? data : [];
    const hasMoreInDatabase = rows.length > PAGE_SIZE;
    const limitReached = hasMoreInDatabase && page === MAX_PAGE;
    return NextResponse.json(
      {
        query,
        page,
        pageSize: PAGE_SIZE,
        results: rows.slice(0, PAGE_SIZE),
        hasMore: hasMoreInDatabase && !limitReached,
        limitReached,
        scope: 'dictionary_nonzero_category_literal_matches',
        ordering: 'category_id,source_order,id',
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (cause) {
    console.error('[XDIC KO290-EN page query exception]', {
      page,
      message: cause instanceof Error ? cause.message : String(cause),
    });
    return NextResponse.json(
      { error: '일치 자료 조회를 완료하지 못했습니다.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
// XDIC_KO290_EN_PAGE_API_V1_END
