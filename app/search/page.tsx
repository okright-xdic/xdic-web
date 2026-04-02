// app/search/page.tsx
// ✅ PC 웹(/search) 전용 페이지: 궁극의 하이브리드 Pinpoint 형광펜 탑재 및 2단어 이상 부분 일치 로직 적용

import SearchPage from '@/components/SearchPage';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 🌟 형용사/관형어 보호 사전 (조사를 자르지 않고 원형 그대로 보존할 단어들)
const kKeepWords = new Set([
  '좋은', '많은', '작은', '큰', '새로운', '나쁜', '어려운',
  '가는', '낮은', '깊은', '밝은', '맑은'
]);

// 공통 필터링 단어들
const kStopWords = new Set([
  '에', '에서', '에게', '로', '으로', '와', '과', '의',
  '다', '까', '요', '음', '함', '고', '면', '해서',
  '것', '곳', '수', '등', '내', '경우', '경우', '때',
  '및', '등등', '또한', '역시', '게다가', '즉', '하지만', '그리고'
]);

const eStopWords = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'am', 'be', 'been', 'being',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among',
  'and', 'or', 'but', 'so', 'because', 'although', 'if',
  'i', 'you', 'he', 'she', 'it', 'they', 'we', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'their', 'our', 'mine', 'yours', 'theirs', 'ours',
  'this', 'that', 'these', 'those',
  'do', 'does', 'did', 'have', 'has', 'had', 'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'cannot'
]);

const irregulars: Record<string, string> = {
  // 🌟 기존 명사 불규칙
  fungi: 'fungus', feet: 'foot', foci: 'focus', criteria: 'criterion', crises: 'crisis', children: 'child', cacti: 'cactus', analyses: 'analysis', geese: 'goose', halves: 'half', knives: 'knife', leaves: 'leaf', lice: 'louse', lives: 'life', media: 'medium', mice: 'mouse', nuclei: 'nucleus', phenomena: 'phenomenon', shelves: 'shelf', thieves: 'thief', teeth: 'tooth', wives: 'wife', wolves: 'wolf', women: 'woman',

  // 🌟 새롭게 추가된 동사 불규칙 100선 (변형된 형태 -> 동사원형)
  lent: 'lend', lay: 'lie', lain: 'lie', lost: 'lose', made: 'make', might: 'may',
  meant: 'mean', met: 'meet', mistook: 'mistake', mistaken: 'mistake', paid: 'pay',
  has: 'have', had: 'have', heard: 'hear', hid: 'hide', hidden: 'hide', held: 'hold',
  kept: 'keep', knew: 'know', known: 'know', laid: 'lay', led: 'lead', left: 'leave',
  arose: 'arise', arisen: 'arise', am: 'be', is: 'be', are: 'be', was: 'be', were: 'be',
  been: 'be', bore: 'bear', born: 'bear', ran: 'run', stood: 'stand', stole: 'steal',
  stolen: 'steal', struck: 'strike', stricken: 'strike', swam: 'swim', swum: 'swim',
  wept: 'weep', sowed: 'sow', sown: 'sow', knelt: 'kneel', dug: 'dig', does: 'do',
  did: 'do', done: 'do', drew: 'draw', drawn: 'draw', drank: 'drink', drunk: 'drink',
  drove: 'drive', driven: 'drive', said: 'say', saw: 'see', seen: 'see', sought: 'seek',
  sold: 'sell', sent: 'send', shook: 'shake', shaken: 'shake', wore: 'wear', worn: 'wear',
  would: 'will', won: 'win', wrote: 'write', written: 'write', fell: 'fall', fallen: 'fall',
  felt: 'feel', fought: 'fight', found: 'find', flew: 'fly', flown: 'fly', forgot: 'forget',
  forgotten: 'forget', forgave: 'forgive', forgiven: 'forgive', froze: 'freeze',
  frozen: 'freeze', got: 'get', gotten: 'get', gave: 'give', given: 'give', went: 'go',
  gone: 'go', grew: 'grow', grown: 'grow', hung: 'hang', hanged: 'hang', took: 'take',
  taken: 'take', taught: 'teach', tore: 'tear', torn: 'tear', told: 'tell', thought: 'think',
  threw: 'throw', thrown: 'throw', understood: 'understand', shone: 'shine', shot: 'shoot',
  showed: 'show', shown: 'show', sang: 'sing', sung: 'sing', sank: 'sink', sunk: 'sink',
  sat: 'sit', slept: 'sleep', smelt: 'smell', spoke: 'speak', spoken: 'speak', spent: 'spend',
  rode: 'ride', ridden: 'ride', rang: 'ring', rung: 'ring', rose: 'rise', risen: 'rise',
  wove: 'weave', woven: 'weave', became: 'become', began: 'begin', begun: 'begin',
  bound: 'bind', bit: 'bite', blew: 'blow', blown: 'blow', broke: 'break', broken: 'break',
  brought: 'bring', built: 'build', bought: 'buy', could: 'can', caught: 'catch',
  chose: 'choose', chosen: 'choose', came: 'come'
};

// 🌟 핵심 수정: 받침 유무 판별 및 보호 단어 우대 함수 적용
const cleanKoreanKeyword = (word: string): string => {
  if (kKeepWords.has(word)) return word;

  let clean = word;
  if (clean.length >= 2) {
    const lastChar = clean[clean.length - 1];
    const prevChar = clean[clean.length - 2];
    const prevCode = prevChar.charCodeAt(0);

    if (prevCode >= 0xac00 && prevCode <= 0xd7a3) {
      const hasJongseong = (prevCode - 0xac00) % 28 > 0;

      if (hasJongseong && ['이', '은', '을'].includes(lastChar)) {
        clean = clean.slice(0, -1);
      }
      else if (!hasJongseong && ['가', '는', '를'].includes(lastChar)) {
        clean = clean.slice(0, -1);
      }
    }
  }

  const otherSuffixes = /(하셨습니까|하셨습니다|해보세요|했습니다|했습니까|하셨어요|했어요|보세요|하세요|이시여|라게|것을|도록|부터|까지|하고|이며|했다|봐요|했어|해라|에서|에게|으로|께서|이다|입니다|입니까|인가요|인가|인데요|인지|이냐|의|에|로|아|야|도|만|와|과|랑|고|지|면|서|된|될|할|하는)$/g;
  
  clean = clean.replace(otherSuffixes, '');
  return clean;
};

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

const extractKeywords = (query: string): string[] => {
  const tokens = query.split(/\s+/);
  return tokens
    .map(t => {
      let clean = t.replace(/[.,?!]/g, ''); 
      if (eStopWords.has(clean.toLowerCase()) || kStopWords.has(clean)) return '';
      if (irregulars[clean.toLowerCase()]) {
        clean = irregulars[clean.toLowerCase()];
      } else if (/^[a-zA-Z]+$/.test(clean)) {
        if (clean.endsWith('ies')) clean = clean.slice(0, -3) + 'y'; 
        else if (clean.endsWith('ves')) clean = clean.slice(0, -3); 
        else if (clean.endsWith('es')) clean = clean.slice(0, -2); 
        else if (clean.endsWith('s') && !clean.endsWith('ss') && !clean.endsWith('is') && !clean.endsWith('us')) {
          clean = clean.slice(0, -1); 
        }
      }
      
      clean = cleanKoreanKeyword(clean);
      
      if (kStopWords.has(clean)) return '';
      return clean;
    })
    // 🌟 한글 1글자 허용
    .filter(t => {
      if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(t)) return t.length >= 1;
      return t.length >= 2;
    });
};

export default async function WebSearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = (searchParams.q || '').toString();
  const cleanQuery = query.trim();
  const noSpaceLen = cleanQuery.replace(/\s+/g, '').length;

  const supabase = createServerComponentClient({ cookies });

  let results: any[] = [];
  let orangeKeys: string[] = cleanQuery ? [cleanQuery] : [];
  let blueKeys: string[] = [];

  let isPartialMatch = false;
  let matchedKeywords: string[] = [];

  let globalRecent: { word: string; count: number }[] = [];
  let globalPopular: string[] = [];

  try {
    const { data: logs } = await supabase.from('search_logs').select('keyword').order('created_at', { ascending: false }).limit(1000);
    if (logs && logs.length > 0) {
      const counts: Record<string, number> = {};
      logs.forEach(l => { counts[l.keyword] = (counts[l.keyword] || 0) + 1; });
      const uniqueRecents = Array.from(new Set(logs.map(l => l.keyword)));
      globalRecent = uniqueRecents.slice(0, 15).map(word => ({ word, count: counts[word] || 1 }));
      globalPopular = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(entry => entry[0]).slice(0, 20);
    }
  } catch (e) {}

  if (cleanQuery && noSpaceLen >= 2) {
    try {
      const { data, error } = await supabase.rpc('search_dictionary_smart', { keyword: query });
      if (!error && Array.isArray(data)) results = data;

      if (results.length === 0) {
        const { data: fallback } = await supabase.from('dictionary_lines').select('*').ilike('line_text', `%${cleanQuery}%`).order('category_id', { ascending: true }).limit(100);
        results = fallback || [];
      }

      const wordCount = cleanQuery.split(/\s+/).length;

      if (results.length === 0 && wordCount >= 2) {
        const validKeywords = extractKeywords(cleanQuery);
        if (validKeywords.length > 0) {
          let andQueryBuilder = supabase.from('dictionary_lines').select('*');
          validKeywords.forEach(k => { andQueryBuilder = andQueryBuilder.ilike('line_text', `%${k}%`); });
          const { data: andData } = await andQueryBuilder.limit(100);

          if (andData && andData.length > 0) {
            results = andData; isPartialMatch = true; matchedKeywords = validKeywords; 
            orangeKeys = [...new Set([...orangeKeys, ...validKeywords])];
          } else {
            const orQueryStr = validKeywords.map(k => `line_text.ilike.%${k}%`).join(',');
            const { data: partialData } = await supabase.from('dictionary_lines').select('*').or(orQueryStr).limit(120);
            if (partialData && partialData.length > 0) {
              results = partialData; isPartialMatch = true; matchedKeywords = validKeywords; 
              orangeKeys = [...new Set([...orangeKeys, ...validKeywords])];
            }
          }
        }
      }

      if (results.length > 0) {
        const cleanQueryNoSpace = cleanQuery.replace(/[\s\-_]/g, '').toLowerCase();
        const isKoreanQuery = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(cleanQuery);

        results.forEach((row) => {
          const text = String(row.line_text || '');
          const cleanText = text.replace(/[.,:;()\[\]]/g, '');
          const tokens = cleanText.split(/\s+/);

          for (let i = 0; i < tokens.length; i++) {
            let combined = '';
            let original = [];
            for (let j = i; j < tokens.length; j++) {
              combined += tokens[j].replace(/[\-_]/g, '').toLowerCase();
              original.push(tokens[j]);
              if (combined === cleanQueryNoSpace) {
                orangeKeys.push(original.join(' ')); 
                break;
              }
              if (combined.length > cleanQueryNoSpace.length) break;
            }
          }
        });

        const cat0Items = results.filter(row => row.category_id === 0);
        
        if (cat0Items.length > 0) {
          cat0Items.forEach(row => {
            const cleanText = String(row.line_text || '').replace(/[.,:;()\[\]]/g, '');
            const words = cleanText.split(/\s+/);
            blueKeys.push(...words);
          });
        } else {
          results.forEach((row) => {
            const text = String(row.line_text || '');
            if (isKoreanQuery) {
              const engMatches = text.match(/[a-zA-Z0-9\-]+/g);
              if (engMatches) {
                engMatches.forEach(w => {
                  if (w.trim().length >= 2 && !eStopWords.has(w.toLowerCase())) blueKeys.push(w);
                });
              }
            } else {
              const korMatches = text.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/g);
              if (korMatches) {
                korMatches.forEach(w => {
                  let cleanW = cleanKoreanKeyword(w);
                  if (cleanW.trim().length >= 1 && !kStopWords.has(cleanW)) blueKeys.push(cleanW);
                });
              }
            }
          });
        }

        orangeKeys = [...new Set(orangeKeys)].filter((w) => w && w.trim());
        blueKeys = [...new Set(blueKeys)].filter((w) => w && w.trim());

        results = rotateResults(results, cleanQuery);
      }
    } catch (e) {
      console.error('❌ 검색 실패:', e);
    }
  }

  return (
    <SearchPage 
      query={query} 
      results={results} 
      orangeKeys={orangeKeys} 
      blueKeys={blueKeys} 
      isApp={false} 
      popularSearches={globalPopular}
      recentSearches={globalRecent}
      isPartialMatch={isPartialMatch}
      matchedKeywords={matchedKeywords}
    />
  );
}