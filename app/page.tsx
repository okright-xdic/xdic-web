// app/page.tsx
// ✅ 웹(/) 서버 검색: Supabase RPC 기반 단일 로직 유지

import SearchPage from '@/components/SearchPage';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// [로테이션 정렬 함수: 카테고리 Zig-zag]
const rotateResults = (items: any[], keyword: string) => {
  if (!items || items.length === 0) return [];
  const lowerKeyword = keyword.trim().toLowerCase();

  const buckets: Record<number, any[]> = {};
  for (let i = 0; i <= 12; i++) buckets[i] = [];

  const advancedSort = (a: any, b: any) => {
    const aText = (a.line_text || '').toLowerCase();
    const bText = (b.line_text || '').toLowerCase();

    const isExactA =
      aText === lowerKeyword ||
      aText.startsWith(lowerKeyword + ' ') ||
      aText.startsWith(lowerKeyword + ':');
    const isExactB =
      bText === lowerKeyword ||
      bText.startsWith(lowerKeyword + ' ') ||
      bText.startsWith(lowerKeyword + ':');

    if (isExactA && !isExactB) return -1;
    if (!isExactA && isExactB) return 1;

    const startsA = aText.startsWith(lowerKeyword);
    const startsB = bText.startsWith(lowerKeyword);
    if (startsA && !startsB) return -1;
    if (!startsA && startsB) return 1;

    if (aText.length !== bText.length) return aText.length - bText.length;
    return aText.localeCompare(bText);
  };

  items.forEach((item) => {
    const catId = item.category_id >= 0 && item.category_id <= 12 ? item.category_id : 12;
    buckets[catId].push(item);
  });

  let maxCount = 0;
  for (let i = 0; i <= 12; i++) {
    buckets[i].sort(advancedSort);
    if (buckets[i].length > maxCount) maxCount = buckets[i].length;
  }

  const rotated: any[] = [];
  for (let i = 0; i < maxCount; i++) {
    for (let cat = 0; cat <= 12; cat++) {
      if (buckets[cat][i]) rotated.push(buckets[cat][i]);
    }
  }
  return rotated;
};

// =========================================================
// 🌟 [최고급 형태소 분석기] 한국어 기능어(Stop words) 완벽 제거!
// =========================================================
const extractKeywords = (query: string): string[] => {
  const tokens = query.split(/\s+/);
  
  const kStopSuffixes = /(하셨습니까|하셨습니다|해보세요|했습니다|했습니까|하셨어요|했어요|보세요|하세요|이시여|라게|것을|도록|부터|까지|하고|이며|했다|봐요|했어|해라|에서|에게|으로|께서|이다|입니다|입니까|인가요|인가|인데요|인지|이냐|은|는|이|가|을|를|의|에|로|아|야|도|만|와|과|랑|고|지|면|서|된|될|할|하는)$/g;
  
  const kStopWords = new Set([
    '어디', '언제', '누구', '무엇', '어떻게', '왜', '어느', '무슨', '어떤', 
    '이', '그', '저', '이것', '그것', '저것', '여기', '거기', '저기',
    '있나요', '있습니까', '있어요', '있어', '있는', '있을', '있', 
    '없나요', '없습니까', '없어요', '없어', '없는', '없을', '없',
    '입니다', '입니까', '이에요', '예요', '합니다', '합니까', '해요', '해', '하는', '할', 
    '수', '것', '들', '제', '내', '네', '너', '나', '우리', '저희', '좀', '잘', '더'
  ]);

  const eStopWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'am', 'be', 'been', 'being',
    'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among',
    'and', 'or', 'but', 'so', 'because', 'although', 'if',
    'i', 'you', 'he', 'she', 'it', 'they', 'we', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'their', 'our', 'mine', 'yours', 'theirs', 'ours',
    'this', 'that', 'these', 'those',
    'what', 'how', 'who', 'where', 'when', 'why', 'which', 'whose', 'whom',
    'do', 'does', 'did', 'have', 'has', 'had', 'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'cannot'
  ]);

  const irregulars: Record<string, string> = {
    men: 'man', women: 'woman', children: 'child', feet: 'foot', teeth: 'tooth', mice: 'mouse'
  };

  return tokens
    .map(t => {
      let clean = t.replace(/[.,?!]/g, ''); 
      if (eStopWords.has(clean.toLowerCase()) || kStopWords.has(clean)) return '';

      if (irregulars[clean.toLowerCase()]) {
        clean = irregulars[clean.toLowerCase()];
      } 
      else if (/^[a-zA-Z]+$/.test(clean)) {
        if (clean.endsWith('ies')) clean = clean.slice(0, -3) + 'y'; 
        else if (clean.endsWith('ves')) clean = clean.slice(0, -3); 
        else if (clean.endsWith('es')) clean = clean.slice(0, -2); 
        else if (clean.endsWith('s') && !clean.endsWith('ss') && !clean.endsWith('is') && !clean.endsWith('us')) {
          clean = clean.slice(0, -1); 
        }
      }

      clean = clean.replace(kStopSuffixes, '');
      if (kStopWords.has(clean)) return '';

      return clean;
    })
    .filter(t => t.length >= 2);
};
// =========================================================

export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string; app?: string };
}) {
  const query = (searchParams.q || '').toString();
  const cleanQuery = query.trim();
  const noSpaceLen = cleanQuery.replace(/\s+/g, '').length;

  const supabase = createServerComponentClient({ cookies });

  let results: any[] = [];
  let highlightKeys: string[] = cleanQuery ? [cleanQuery] : [];

  let isPartialMatch = false;
  let matchedKeywords: string[] = [];

  let globalRecent: { word: string; count: number }[] = [];
  let globalPopular: string[] = [];

  try {
    const { data: logs } = await supabase
      .from('search_logs')
      .select('keyword')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (logs && logs.length > 0) {
      const counts: Record<string, number> = {};
      logs.forEach(l => {
        counts[l.keyword] = (counts[l.keyword] || 0) + 1;
      });

      const uniqueRecents = Array.from(new Set(logs.map(l => l.keyword)));
      globalRecent = uniqueRecents.slice(0, 15).map(word => ({
        word,
        count: counts[word] || 1
      }));

      globalPopular = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0])
        .slice(0, 20);
    }
  } catch (e) {
    console.error('검색어 집계 실패:', e);
  }

  if (cleanQuery && noSpaceLen >= 2) {
    try {
      // 🚀 1. 검색부터 바로 시원하게 진행합니다. (비효율적인 cat0Data 사전 검색 삭제!)
      const step1 = cleanQuery + ' ';
      const step2 = cleanQuery;
      const step3 = cleanQuery.includes(' ') ? cleanQuery.replace(/\s+/g, '') : '';

      const { data: d1, error: e1 } = await supabase.rpc('search_dictionary_v8', { keyword: step1 });
      if (!e1 && Array.isArray(d1)) results = d1;

      if (results.length === 0) {
        const { data: d2 } = await supabase.rpc('search_dictionary_v8', { keyword: step2 });
        if (Array.isArray(d2) && d2.length > 0) results = d2;
      }

      if (results.length === 0 && step3) {
        const { data: d3 } = await supabase.rpc('search_dictionary_v8', { keyword: step3 });
        if (Array.isArray(d3) && d3.length > 0) results = d3;
      }

      if (results.length === 0) {
        const { data: fallback } = await supabase
          .from('dictionary_lines')
          .select('*')
          .ilike('line_text', `%${cleanQuery}%`)
          .order('category_id', { ascending: true })
          .limit(100);

        results = fallback || [];
      }

      const wordCount = cleanQuery.split(/\s+/).length;
      
      // 🚀 2. 결과가 없을 때의 부분 일치 검색
      if (results.length === 0 && wordCount >= 3) {
        const validKeywords = extractKeywords(cleanQuery);
        
        if (validKeywords.length > 0) {
          let andQueryBuilder = supabase.from('dictionary_lines').select('*');
          validKeywords.forEach(k => {
            andQueryBuilder = andQueryBuilder.ilike('line_text', `%${k}%`);
          });
          
          const { data: andData } = await andQueryBuilder.limit(100);

          if (andData && andData.length > 0) {
            results = andData;
            isPartialMatch = true;
            matchedKeywords = validKeywords;
            highlightKeys = [...new Set([...highlightKeys, ...validKeywords])];
          } else {
            const orQueryStr = validKeywords.map(k => `line_text.ilike.%${k}%`).join(',');
            const { data: partialData } = await supabase
              .from('dictionary_lines')
              .select('*')
              .or(orQueryStr)
              .limit(120);

            if (partialData && partialData.length > 0) {
              results = partialData;
              isPartialMatch = true;
              matchedKeywords = validKeywords;
              highlightKeys = [...new Set([...highlightKeys, ...validKeywords])];
            }
          }
        }
      }

      // 🚀 3. [핵심 로직] 이미 찾은 결과(results) 안에서 확실하게 단어를 추출합니다!
      if (results.length > 0) {
        // 화면에 보여질 진짜 0번 카테고리 데이터만 쏙 빼옵니다.
        const cat0Items = results.filter((item) => item.category_id === 0);
        
        if (cat0Items.length > 0) {
          const add: string[] = [];
          cat0Items.forEach((row) => {
            const cleanText = String(row.line_text || '').replace(/[.,:;()]/g, '');
            const words = cleanText.split(/\s+/);
            add.push(...words);
          });
          highlightKeys = [...new Set([...highlightKeys, ...add])].filter((w) => w && w.trim());
        }

        // 마지막으로 예쁘게 섞어주기
        results = rotateResults(results, cleanQuery);
      }
    } catch (e) {
      console.error('❌ 검색 실패:', e);
    }
  }

  const isApp = searchParams.app === '1';

  return (
    <SearchPage 
      query={query} 
      results={results} 
      highlightList={highlightKeys} 
      isApp={isApp} 
      popularSearches={globalPopular}
      recentSearches={globalRecent}
      isPartialMatch={isPartialMatch}
      matchedKeywords={matchedKeywords}
    />
  );
}