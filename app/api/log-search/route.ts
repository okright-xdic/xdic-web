import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { keyword } = await request.json();
    const trimmed = (keyword || '').trim();

    // 단어가 없거나 너무 짧으면 저장하지 않음 (의미 없는 데이터 방지)
    if (!trimmed || trimmed.length < 2) {
      return NextResponse.json({ success: false, msg: 'Too short' });
    }

    // 서버용 Supabase 클라이언트 생성
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // search_logs 테이블에 검색어 기록 추가!
    const { error } = await supabase
      .from('search_logs')
      .insert([{ keyword: trimmed }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('검색어 로깅 실패:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}