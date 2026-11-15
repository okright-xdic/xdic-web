import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// ☆ TwoPro v13.00-safe: 한국어 문장 CORE 핵심어 보강용 공통 함수
//
// 목적:
// - "나는 / 그는 / 그녀는 / 나에게 / 그에게" 같은 문장 골격어는 약하게 보고
// - "문을 / 열라고 / 말해요", "기다리라고 / 말하지 / 않았어요"처럼
//   실제 검색에 중요한 내용을 우선하여 기존 DB 결과를 재정렬합니다.
//
// 안전 원칙:
// 1. 기존 search_dictionary_v8 결과를 삭제하지 않습니다.
// 2. 동일 결과는 중복 제거만 합니다.
// 3. 핵심어 일치 수가 많은 결과를 앞으로 보냅니다.
// 4. 점수가 같으면 기존 검색 순서를 그대로 유지합니다.
// ============================================================================

function normalizeTwoProSearchTextV1300(value: unknown): string {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[?？!！.,，。"'“”‘’()[\]{}<>:;~`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const TWO_PRO_CORE_STOPWORDS_V1300 = new Set<string>([
  // 1인칭
  '나',
  '나는',
  '내가',
  '나를',
  '나에게',
  '나한테',
  '저',
  '저는',
  '제가',
  '저를',
  '저에게',
  '저한테',

  // 2인칭
  '너',
  '너는',
  '네가',
  '너를',
  '너에게',
  '너한테',
  '당신',
  '당신은',
  '당신이',
  '당신을',
  '당신에게',

  // 3인칭
  '그',
  '그는',
  '그가',
  '그를',
  '그에게',
  '그한테',

  '그녀',
  '그녀는',
  '그녀가',
  '그녀를',
  '그녀에게',
  '그녀한테',

  // 복수 주어
  '우리',
  '우리는',
  '우리가',
  '우리를',
  '우리에게',

  '그들',
  '그들은',
  '그들이',
  '그들을',
  '그들에게',

  // 지시·보조성 표현
  '이것',
  '그것',
  '저것',
  '이',
  '그',
  '저',
]);

function extractTwoProCoreTokensV1300(input: string): string[] {
  const normalized = normalizeTwoProSearchTextV1300(input);

  if (!normalized) {
    return [];
  }

  const rawTokens = normalized
    .split(' ')
    .map((token) => token.trim())
    .filter(Boolean);

  const filtered = rawTokens.filter((token) => {
    if (TWO_PRO_CORE_STOPWORDS_V1300.has(token)) {
      return false;
    }

    // 너무 짧은 한글 1글자 기능어는 CORE 검색에서 제외합니다.
    if (/^[가-힣]$/.test(token)) {
      return false;
    }

    return true;
  });

  // 원래 순서는 유지하면서 중복만 제거합니다.
  return Array.from(new Set(filtered));
}

function countTwoProCoreHitsV1300(
  lineText: string,
  coreTokens: string[]
): number {
  const normalizedLine =
    normalizeTwoProSearchTextV1300(lineText);

  if (!normalizedLine || coreTokens.length === 0) {
    return 0;
  }

  let hits = 0;

  for (const token of coreTokens) {
    const normalizedToken =
      normalizeTwoProSearchTextV1300(token);

    if (
      normalizedToken &&
      normalizedLine.includes(normalizedToken)
    ) {
      hits += 1;
    }
  }

  return hits;
}

function mergeAndRerankTwoProResultsV1300(
  baseResults: any[],
  extraResults: any[],
  originalQuery: string,
  coreTokens: string[]
): any[] {
  const merged = [
    ...(Array.isArray(baseResults) ? baseResults : []),
    ...(Array.isArray(extraResults) ? extraResults : []),
  ];

  if (merged.length === 0) {
    return [];
  }

  const seen = new Set<string>();
  const uniqueResults: Array<{
    row: any;
    originalIndex: number;
  }> = [];

  merged.forEach((row, index) => {
    const id = String(row?.id ?? '').trim();
    const lineText = String(row?.line_text ?? '').trim();

    const key =
      id
        ? `id:${id}`
        : `text:${lineText}`;

    if (!seen.has(key)) {
      seen.add(key);

      uniqueResults.push({
        row,
        originalIndex: index,
      });
    }
  });

  const normalizedQuery =
    normalizeTwoProSearchTextV1300(originalQuery);

  const normalizedCorePhrase =
    normalizeTwoProSearchTextV1300(
      coreTokens.join(' ')
    );

  return uniqueResults
    .map((item) => {
      const lineText =
        String(item.row?.line_text ?? '');

      const normalizedLine =
        normalizeTwoProSearchTextV1300(lineText);

      const coreHits =
        countTwoProCoreHitsV1300(
          lineText,
          coreTokens
        );

      const exactQueryBonus =
        normalizedQuery &&
        normalizedLine.includes(normalizedQuery)
          ? 1000
          : 0;

      const corePhraseBonus =
        normalizedCorePhrase &&
        normalizedLine.includes(normalizedCorePhrase)
          ? 100
          : 0;

      const score =
        exactQueryBonus +
        corePhraseBonus +
        coreHits * 10;

      return {
        ...item,
        score,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      // 점수가 같으면 기존 DB 검색 순서를 보존합니다.
      return a.originalIndex - b.originalIndex;
    })
    .map((item) => item.row);
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

    // ========================================================================
    // 🎯 TwoPro v13.00: 한국어 문장 CORE 핵심어 보강 검색
    //
    // 예:
    // 그녀는 나에게 기다리라고 말하지 않았어요
    // → 기다리라고 말하지 않았어요
    //
    // 나는 그에게 문을 열라고 말해요
    // → 문을 열라고 말해요
    //
    // 기존 결과를 없애지 않고 핵심 내용어가 더 잘 들어 있는
    // dictionary_lines 결과를 보강한 뒤 다시 순위를 매깁니다.
    // ========================================================================

    const coreTokensV1300 =
      extractTwoProCoreTokensV1300(q);

    if (coreTokensV1300.length >= 2) {
      const corePhraseV1300 =
        coreTokensV1300.join(' ');

      // 먼저 기존 결과도 CORE 핵심어 기준으로
      // 안전하게 재정렬합니다.
      if (finalResults.length > 0) {
        finalResults =
          mergeAndRerankTwoProResultsV1300(
            finalResults,
            [],
            q,
            coreTokensV1300
          );
      }

      const bestCoreHitsV1300 =
        finalResults.length > 0
          ? countTwoProCoreHitsV1300(
              String(
                finalResults[0]?.line_text || ''
              ),
              coreTokensV1300
            )
          : 0;

      // 현재 최상위 결과가 CORE 핵심어를
      // 모두 포함하지 못할 때만 추가 검색합니다.
      //
      // 따라서 모든 검색에서 RPC를 무조건
      // 한 번 더 호출하지 않습니다.
      if (
        corePhraseV1300 &&
        corePhraseV1300 !==
          normalizeTwoProSearchTextV1300(q) &&
        bestCoreHitsV1300 <
          coreTokensV1300.length
      ) {
        const {
          data: coreDataV1300,
          error: coreErrorV1300,
        } = await supabase.rpc(RPC_NAME, {
          search_keyword: corePhraseV1300,
        });

        if (coreErrorV1300) {
          // CORE 보강 검색 실패가
          // 기존 검색 전체를 망가뜨리지 않게 합니다.
          console.warn(
            '[CORE 핵심어 보강 검색 오류]',
            {
              query: q,
              corePhrase:
                corePhraseV1300,
              message:
                coreErrorV1300.message,
            }
          );
        } else if (
          Array.isArray(coreDataV1300) &&
          coreDataV1300.length > 0
        ) {
          finalResults =
            mergeAndRerankTwoProResultsV1300(
              finalResults,
              coreDataV1300,
              q,
              coreTokensV1300
            );

          console.log(
            '[CORE 핵심어 보강 검색 성공]',
            {
              query: q,
              coreTokens:
                coreTokensV1300,
              corePhrase:
                corePhraseV1300,
              coreResultCount:
                coreDataV1300.length,
            }
          );
        }
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