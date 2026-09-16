import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
// ==========================================
// 🎯 1.5단계: 한국어 문장 CORE 핵심어 보강
// ==========================================
//
// 기존 전체 문장 검색에서 결과가 나오더라도,
// 중요한 내용어가 약하게 잡힌 경우 핵심어 조합으로
// search_dictionary_v8을 한 번 더 호출합니다.
//
// 예:
// 그녀는 나에게 기다리라고 말하지 않았어요
// → 기다리라고 말하지 않았어요
//
// 나는 그에게 문을 열라고 말해요
// → 문을 열라고 말해요
//
// 기존 결과 + 핵심어 결과를 합쳐 다시 순위를 매깁니다.
//
const coreTokensV1300 = extractTwoProCoreTokensV1300(q);

if (coreTokensV1300.length >= 2) {
  const corePhraseV1300 = coreTokensV1300.join(' ');

  // 우선 기존 200개 결과 자체도 핵심어 기준으로 다시 정렬합니다.
  if (finalResults.length > 0) {
    finalResults = mergeAndRerankTwoProResultsV1300(
      finalResults,
      [],
      q,
      coreTokensV1300
    );
  }

  const bestCoreHitsV1300 =
    finalResults.length > 0
      ? countTwoProCoreHitsV1300(
          String(finalResults[0]?.line_text || ''),
          coreTokensV1300
        )
      : 0;

  // 현재 최상위 결과가 핵심어를 모두 담지 못했을 때만
  // 추가 RPC를 실행합니다.
  //
  // 따라서 모든 문장에서 무조건 DB 호출이 하나 늘어나는 구조가 아닙니다.
  if (
    corePhraseV1300 &&
    corePhraseV1300 !== normalizeTwoProSearchTextV1300(q) &&
    bestCoreHitsV1300 < coreTokensV1300.length
  ) {
    const {
      data: coreDataV1300,
      error: coreErrorV1300,
    } = await supabase.rpc(RPC_NAME, {
      search_keyword: corePhraseV1300,
    });

    if (coreErrorV1300) {
      // 보강 검색 실패는 기존 검색 전체를 실패시키지 않습니다.
      console.warn('[CORE 핵심어 보강 검색 오류]', {
        query: q,
        corePhrase: corePhraseV1300,
        message: coreErrorV1300.message,
      });
    } else if (
      Array.isArray(coreDataV1300) &&
      coreDataV1300.length > 0
    ) {
      finalResults = mergeAndRerankTwoProResultsV1300(
        finalResults,
        coreDataV1300,
        q,
        coreTokensV1300
      );

      console.log('[CORE 핵심어 보강 검색 성공]', {
        query: q,
        coreTokens: coreTokensV1300,
        corePhrase: corePhraseV1300,
        coreResultCount: coreDataV1300.length,
      });
    }
  }
}
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();

    if (!q) return NextResponse.json({ results: [] });

    // 🌟 엑스딕의 메인 검색 엔진
    const RPC_NAME = 'search_dictionary_v8'; 
    let finalResults: any[] = [];

    // ==========================================
    // 🎯 0단계: 기초영어 콜론 좌우 Exact Match
    // ==========================================
    // category_id 0의 "한국어: 영어" 문장에서
    // 전체 행, 콜론 왼쪽, 콜론 오른쪽을 각각 정확히 비교합니다.
    const {
      data: exactData,
      error: exactError,
    } = await supabase.rpc(
      'search_dictionary_exact_category0',
      {
        p_keyword: q,
      }
    );

    if (exactError) {
      console.error('[기초영어 Exact Match 오류]', {
        query: q,
        message: exactError.message,
        details: exactError.details,
        hint: exactError.hint,
        code: exactError.code,
      });

      return NextResponse.json(
        {
          results: [],
          failedStage: 'search_dictionary_exact_category0',
          error: exactError.message,
          details: exactError.details,
          hint: exactError.hint,
          code: exactError.code,
        },
        { status: 500 }
      );
    }

    // Exact Match가 있으면 느린 v8/Fuzzy를 실행하지 않고 즉시 반환합니다.
    if (Array.isArray(exactData) && exactData.length > 0) {
      console.log('[기초영어 Exact Match 성공]', {
        query: q,
        resultCount: exactData.length,
        firstResult: exactData[0],
      });

      return NextResponse.json({
        results: exactData,
      });
    }

    // ==========================================
    // 🔍 1단계: 원본 검색어로 기본 검색
    // ==========================================
    const { data: data1, error: err1 } = await supabase.rpc(RPC_NAME, {
  search_keyword: q,
});
    if (data1 && data1.length > 0) finalResults = data1;

    // ==========================================
    // 🔍 2단계: 결과가 없고 "단일 단어"일 경우 -> 뒤에 공백(' ') 추가 검색 (영어 보정)
    // ==========================================
    if (finalResults.length === 0 && !q.includes(' ')) {
      const { data: data2 } = await supabase.rpc(RPC_NAME, {
  search_keyword: q + ' ',
});
      if (data2 && data2.length > 0) finalResults = data2;
    }

    // ==========================================
    // 🔍 3단계: 결과가 없고 "띄어쓰기가 있는" 경우 -> 공백 모두 제거 후 검색 (한글 오타 보정)
    // ==========================================
    if (finalResults.length === 0 && q.includes(' ')) {
      const noSpaceQ = q.replace(/\s+/g, '');
      const { data: data3 } = await supabase.rpc(RPC_NAME, {
  search_keyword: noSpaceQ,
});
      if (data3 && data3.length > 0) finalResults = data3;
    }

    // ==========================================
    // 💡 4단계: 결과가 없고 "다 붙여쓴 긴 영어"일 경우 -> 말뭉치에서 띄어쓰기 복원!
    // ==========================================
    if (finalResults.length === 0 && !q.includes(' ') && q.length > 3) {
      const { data: corpusData } = await supabase.rpc(
        'get_spaced_word_from_corpus',
        {
          search_term: q,
        }
      );

      if (
        corpusData &&
        corpusData.length > 0 &&
        corpusData[0].spaced_word
      ) {
        const recoveredWord = corpusData[0].spaced_word;

        console.log(
          `[마법 발동! 띄어쓰기 복원 성공] "${q}" -> "${recoveredWord}"`
        );

        const { data: data4 } = await supabase.rpc(RPC_NAME, {
          search_keyword: recoveredWord,
        });

        if (data4 && data4.length > 0) {
          finalResults = data4;
        }
      }
    }

    // ==========================================
    // 🚀 5단계: 앞 단계에서 결과가 없으면 Fuzzy 검색
    // ==========================================
    // 공백, 마침표, 하이픈 등 특수기호 차이로 놓친 문장을 검색합니다.
    if (finalResults.length === 0) {
      // search_dictionary_fuzzy 함수의 SQL 파라미터 이름은 q입니다.
      const {
        data: fuzzyData,
        error: fuzzyError,
      } = await supabase.rpc('search_dictionary_fuzzy', {
        q: q,
      });

      // Fuzzy RPC 호출 자체가 실패한 경우
      if (fuzzyError) {
        console.error('[search_dictionary_fuzzy 오류]', {
          query: q,
          message: fuzzyError.message,
          details: fuzzyError.details,
          hint: fuzzyError.hint,
          code: fuzzyError.code,
        });

        return NextResponse.json(
          {
            results: [],
            failedStage: 'search_dictionary_fuzzy',
            error: fuzzyError.message,
            details: fuzzyError.details,
            hint: fuzzyError.hint,
            code: fuzzyError.code,
          },
          { status: 500 }
        );
      }

      // Fuzzy 결과가 정상적으로 나온 경우
      if (Array.isArray(fuzzyData) && fuzzyData.length > 0) {
        console.log('[Fuzzy 검색 성공]', {
          query: q,
          resultCount: fuzzyData.length,
          firstResult: fuzzyData[0],
        });

        finalResults = fuzzyData;
      } else {
        console.log('[Fuzzy 검색 결과 없음]', {
          query: q,
        });
      }
    }

    // 에러 발생 시 처리 (1단계 에러 기준)
    if (err1 && finalResults.length === 0) {
      return NextResponse.json(
        {
          results: [],
          error: err1.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      results: finalResults,
    });

  } catch (e: any) {
    console.error('[rpc-search 예외 발생]', {
      message: e?.message,
      error: e,
    });

    return NextResponse.json(
      {
        results: [],
        error: String(e?.message || e),
      },
      { status: 500 }
    );
  }
}