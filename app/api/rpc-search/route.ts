import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();

    if (!q) return NextResponse.json({ results: [] });

    // 🌟 엑스딕의 메인 검색 엔진 (함수명 변경 시 여기만 수정하세요)
    const RPC_NAME = 'search_dictionary_v8'; 
    let finalResults: any[] = [];

    // ==========================================
    // 🔍 1단계: 원본 검색어로 기본 검색
    // ==========================================
    const { data: data1, error: err1 } = await supabase.rpc(RPC_NAME, { keyword: q });
    if (data1 && data1.length > 0) finalResults = data1;

    // ==========================================
    // 🔍 2단계: 결과가 없고 "단일 단어"일 경우 -> 뒤에 공백(' ') 추가 검색 (영어 보정)
    // ==========================================
    if (finalResults.length === 0 && !q.includes(' ')) {
      const { data: data2 } = await supabase.rpc(RPC_NAME, { keyword: q + ' ' });
      if (data2 && data2.length > 0) finalResults = data2;
    }

    // ==========================================
    // 🔍 3단계: 결과가 없고 "띄어쓰기가 있는" 경우 -> 공백 모두 제거 후 검색 (한글 오타 보정)
    // ==========================================
    if (finalResults.length === 0 && q.includes(' ')) {
      const noSpaceQ = q.replace(/\s+/g, '');
      const { data: data3 } = await supabase.rpc(RPC_NAME, { keyword: noSpaceQ });
      if (data3 && data3.length > 0) finalResults = data3;
    }

    // ==========================================
    // 💡 4단계(NEW): 결과가 없고 "다 붙여쓴 긴 영어"일 경우 -> 말뭉치에서 띄어쓰기 복원!
    // ==========================================
    if (finalResults.length === 0 && !q.includes(' ') && q.length > 3) {
      
      // 방금 만든 SQL 함수를 호출하여 말뭉치(카테고리 0)에서 원본 단어를 찾습니다.
      const { data: corpusData } = await supabase.rpc('get_spaced_word_from_corpus', { search_term: q });

      // 말뭉치에 띄어쓰기된 진짜 원본(예: artificial intelligence)이 존재한다면?
      if (corpusData && corpusData.length > 0 && corpusData[0].spaced_word) {
        const recoveredWord = corpusData[0].spaced_word;
        console.log(`[마법 발동! 띄어쓰기 복원 성공] "${q}" -> "${recoveredWord}"`);

        // 복원해 낸 단어로 마지막 재검색을 시도합니다!
        const { data: data4 } = await supabase.rpc(RPC_NAME, { keyword: recoveredWord });
        if (data4 && data4.length > 0) finalResults = data4;
      }
    }

    // 에러 발생 시 처리 (1단계 에러 기준)
    if (err1 && finalResults.length === 0) {
      return NextResponse.json({ results: [], error: err1.message }, { status: 500 });
    }

    return NextResponse.json({ results: finalResults });
    
  } catch (e: any) {
    return NextResponse.json({ results: [], error: String(e?.message || e) }, { status: 500 });
  }
}