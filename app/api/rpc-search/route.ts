import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ✅ Route Handler에서는 SSR 쿠키 세팅 없이도 "검색 RPC" 정도는 anon으로 충분 (RLS 꺼져있다면 특히)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const limit = Number(searchParams.get('limit') || 240);
    const offset = Number(searchParams.get('offset') || 0);

    if (!q) return NextResponse.json({ results: [] });

    // ✅ 여기 RPC 이름은 프로젝트에 맞게 유지하세요: search_keywords / suggest_keywords 등
    // 아래는 예시: search_keywords(q, p_limit, p_offset)
    const { data, error } = await supabase.rpc('search_keywords', {
      p_query: q,
      p_limit: limit,
      p_offset: offset,
    });

    if (error) {
      return NextResponse.json({ results: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({ results: data || [] });
  } catch (e: any) {
    return NextResponse.json({ results: [], error: String(e?.message || e) }, { status: 500 });
  }
}