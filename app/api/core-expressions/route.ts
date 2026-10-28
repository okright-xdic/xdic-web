import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { buildXdicCoreLookupKeys, normalizeXdicExpression } from '@/lib/xdic-core-query';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Opt-in: no new production queries until the table, reviewed data and tests are ready.
  if (process.env.NEXT_PUBLIC_XDIC_CORE_EXPRESSIONS_ENABLED !== '1') {
    return NextResponse.json({ results: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
  const q = (new URL(request.url).searchParams.get('q') || '').trim();
  if (!q || q.length > 200) {
    return NextResponse.json({ results: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
  const { direction, keys } = buildXdicCoreLookupKeys(q);
  if (keys.length === 0) {
    return NextResponse.json({ results: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    console.warn('[xdic-core-expressions] Missing Supabase configuration');
    return NextResponse.json({ results: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
  try {
    const supabase = createClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const column = direction === 'ko' ? 'ko_key' : 'en_key';
    const { data, error } = await supabase
      .from('xdic_core_expressions')
      .select('id,ko_text,en_text,ko_key,en_key,source_kinds')
      .eq('is_published', true)
      .eq('review_status', 'APPROVED')
      .in(column, keys)
      .limit(60);
    if (error) {
      console.warn('[xdic-core-expressions] Lookup failed:', error.message);
      return NextResponse.json({ results: [] }, { headers: { 'Cache-Control': 'no-store' } });
    }
    const keyOrder = new Map(keys.map((key, index) => [key, index]));
    const rows = (data || [])
      .filter((row) => Boolean(row.ko_text && row.en_text))
      .sort((a, b) => {
        const aKey = normalizeXdicExpression(direction === 'ko' ? a.ko_key : a.en_key);
        const bKey = normalizeXdicExpression(direction === 'ko' ? b.ko_key : b.en_key);
        return (keyOrder.get(aKey) ?? 999) - (keyOrder.get(bKey) ?? 999) ||
          a.ko_text.localeCompare(b.ko_text);
      })
      .slice(0, 8)
      .map((row) => ({
        id: row.id,
        ko: row.ko_text,
        en: row.en_text,
        sourceKinds: row.source_kinds,
      }));
    return NextResponse.json({ results: rows }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.warn('[xdic-core-expressions] Exception:', error);
    return NextResponse.json({ results: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
