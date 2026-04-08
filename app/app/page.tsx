// app/app/page.tsx
// ✅ 앱(/app) 서버 검색: 궁극의 하이브리드 Pinpoint 형광펜 탑재 및 스마트 OR 확장 검색 로직 적용

import SearchPage from '@/components/SearchPage';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const kKeepWords = new Set([
  '좋은', '많은', '작은', '큰', '새로운', '나쁜', '어려운',
  '가는', '낮은', '깊은', '밝은', '맑은'
]);

const kStopWords = new Set([
  '다', '까', '요', '음', '함', '고', '면', '해서',
  '것', '곳', '수', '등', '내', '경우', '때',
  '및', '등등', '또한', '역시', '게다가', '즉', '하지만', '그리고',
  '나', '너', '저', '그', '이', '보', '주', '가', '오', '하', '해', '할', '된', '될', '안', '않', '못', '좀', '잘', '더', '들', '제', '네'
]);

const kSuffixes = [
  '이시여', '라게', '것을', '도록', '부터', '까지', '하고', '이며',
  '에서', '에게', '으로', '께서', '하는',
  '된', '될', '할',
  '에', '로', '와', '과', '의', '아', '야', '도', '만', '랑', '고', '지', '면', '서'
].sort((a, b) => b.length - a.length);

const eStopWords = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'am', 'be', 'been', 'being',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among',
  'and', 'or', 'but', 'so', 'because', 'although', 'if',
  'i', 'you', 'he', 'she', 'it', 'they', 'we', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'their', 'our', 'mine', 'yours', 'theirs', 'ours',
  'this', 'that', 'these', 'those',
  'do', 'does', 'did', 'have', 'has', 'had', 'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'cannot'
]);

const irregulars: Record<string, string> = {
  fungi: 'fungus', feet: 'foot', foci: 'focus', criteria: 'criterion', crises: 'crisis', children: 'child', cacti: 'cactus', analyses: 'analysis', geese: 'goose', halves: 'half', knives: 'knife', leaves: 'leaf', lice: 'louse', lives: 'life', media: 'medium', mice: 'mouse', nuclei: 'nucleus', phenomena: 'phenomenon', shelves: 'shelf', thieves: 'thief', teeth: 'tooth', wives: 'wife', wolves: 'wolf', women: 'woman',
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
  chose: 'choose', chosen: 'choose', came: 'come',

  tallest: 'tall', taller: 'tall', smallest: 'small', smaller: 'small',
  oldest: 'old', older: 'old', slowest: 'slow', slower: 'slow',
  longest: 'long', longer: 'long', lowest: 'low', lower: 'low',
  highest: 'high', higher: 'high', coldest: 'cold', colder: 'cold',
  warmest: 'warm', warmer: 'warm', strongest: 'strong', stronger: 'strong',
  hottest: 'hot', hotter: 'hot', weakest: 'weak', weaker: 'weak',
  darkest: 'dark', darker: 'dark', brightest: 'bright', brighter: 'bright',
  kindest: 'kind', kinder: 'kind', dirtiest: 'dirty', dirtier: 'dirty',
  cleanest: 'clean', cleaner: 'clean', smartest: 'smart', smarter: 'smart',
  nicest: 'nice', nicer: 'nice', largest: 'large', larger: 'large',
  safest: 'safe', safer: 'safe', broadest: 'broad', broader: 'broad',
  happiest: 'happy', happier: 'happy', luckiest: 'lucky', luckier: 'lucky',
  prettiest: 'pretty', prettier: 'pretty', easiest: 'easy', easier: 'easy',
  funniest: 'funny', funnier: 'funny', noisiest: 'noisy', noisier: 'noisy',
  busiest: 'busy', busier: 'busy', earliest: 'early', earlier: 'early',
  friendliest: 'friendly', friendlier: 'friendly', healthiest: 'healthy', healthier: 'healthy',
  best: 'good', better: 'good', worst: 'bad', worse: 'bad',
  farthest: 'far', farther: 'far', furthest: 'far', further: 'far',
  most: 'many', more: 'many', least: 'little', less: 'little',
  fastest: 'fast', faster: 'fast'
};

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

  for (const suffix of kSuffixes) {
    if (clean.endsWith(suffix) && clean.length > suffix.length) {
      clean = clean.slice(0, -suffix.length);
      break;
    }
  }

  const otherSuffixes = /(하셨습니까|하셨습니다|해보세요|했습니다|했습니까|하셨어요|했어요|보세요|하세요|했다|봐요|했어|해라|이다|입니다|입니까|인가요|인가|인데요|인지|이냐)$/g;
  
  clean = clean.replace(otherSuffixes, '');
  return clean;
};

const rotateResults = (items: any[], keyword: string, extractedKeywords: string[]) => {
  if (!items || items.length === 0) return [];
  const lowerKeyword = keyword.trim().toLowerCase();
  const lowerKeywordNoSpace = lowerKeyword.replace(/\s+/g, '');
  const lowerExtracted = extractedKeywords.map(k => k.toLowerCase());

  const itemsWithIndex = items.map((item, idx) => ({ ...item, _db_index: idx }));

  const dictExact: any[] = [];
  const corpusExact: any[] = [];
  const partialMatches: any[] = [];

  itemsWithIndex.forEach((item) => {
    const textNoSpace = (item.line_text || '').toLowerCase().replace(/\s+/g, '');
    const textOriginal = (item.line_text || '').toLowerCase();
    const isCorpus = item.category_id === 0;

    if (isCorpus) {
      const firstWord = textOriginal.replace(/[.,:;()\[\]]/g, '').split(/\s+/)[0];
      const isFirstWordMatch = lowerExtracted.includes(firstWord) || firstWord === lowerKeyword;
      
      if (isFirstWordMatch) {
        corpusExact.push(item);
      } else {
        partialMatches.push(item);
      }
    } else {
      const isExactNoSpace = textNoSpace.includes(lowerKeywordNoSpace);
      const isExactOriginal = textOriginal.includes(lowerKeyword);

      if (isExactNoSpace || isExactOriginal) {
        dictExact.push(item);
      } else {
        partialMatches.push(item);
      }
    }
  });

  dictExact.sort((a, b) => a._db_index - b._db_index);
  corpusExact.sort((a, b) => a._db_index - b._db_index);

  const buckets: Record<number, any[]> = {};
  for (let i = 0; i <= 12; i++) buckets[i] = [];

  partialMatches.forEach((item) => {
    const catId = item.category_id >= 0 && item.category_id <= 12 ? item.category_id : 12;
    buckets[catId].push(item);
  });

  for (let i = 0; i <= 12; i++) {
    buckets[i].sort((a, b) => a._db_index - b._db_index);
  }

  let maxCount = 0;
  for (let i = 0; i <= 12; i++) {
    if (buckets[i].length > maxCount) maxCount = buckets[i].length;
  }

  const rotated: any[] = [];
  for (let i = 0; i < maxCount; i++) {
    for (let cat = 0; cat <= 12; cat++) {
      if (buckets[cat][i]) rotated.push(buckets[cat][i]);
    }
  }
  
  return [...dictExact, ...corpusExact, ...rotated];
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
    .filter(t => {
      if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(t)) return t.length >= 1;
      return t.length >= 2;
    });
};

export default async function AppPage({ searchParams }: { searchParams: { q?: string }; }) {
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

      const baseExtracted = extractKeywords(cleanQuery); 
      const wordCount = cleanQuery.split(/\s+/).length;

      // 1. 띄어쓰기 복합어 -> 붙여서 RPC 검색 추가 병합
      if (cleanQuery.includes(' ')) {
        const noSpaceQuery = cleanQuery.replace(/\s+/g, '');
        const { data: noSpaceData } = await supabase.rpc('search_dictionary_smart', { keyword: noSpaceQuery });
        if (noSpaceData && Array.isArray(noSpaceData)) {
          const existingIds = new Set(results.map(r => r.id));
          const newItems = noSpaceData.filter(r => !existingIds.has(r.id));
          results = [...results, ...newItems];
          baseExtracted.push(noSpaceQuery);
        }
      }

      const initialResultCount = results.length; 

      let smartSplitFound = false;
      let foundP1 = "";
      let foundP2 = "";
      let splitOrPieces: string[] = [];

      // 2. 붙여쓴 한국어 복합어(산화물자석) -> 쪼개서 AND 검색 (정확한 분리지점 찾기)
      if (wordCount === 1 && cleanQuery.length >= 3 && cleanQuery.length <= 10 && /[가-힣]/.test(cleanQuery)) {
        const safeQuery = cleanQuery.replace(/[,.!?'"()\[\]]/g, '');
        const splitPairs = [];
        for (let i = 2; i <= safeQuery.length - 2; i++) {
          const p1 = safeQuery.slice(0, i);
          const p2 = safeQuery.slice(i);
          splitPairs.push({ p1, p2 });
          if (p1.length >= 2) splitOrPieces.push(p1);
          if (p2.length >= 2) splitOrPieces.push(p2);
        }

        if (splitPairs.length > 0) {
          const andQueryStrs = splitPairs.map(pair => `and(line_text.ilike.%${pair.p1}%,line_text.ilike.%${pair.p2}%)`);
          const { data: splitData } = await supabase.from('dictionary_lines')
            .select('*')
            .or(andQueryStrs.join(','))
            .limit(50);

          if (splitData && splitData.length > 0) {
            const existingIds = new Set(results.map(r => r.id));
            const newSplits = splitData.filter(r => !existingIds.has(r.id));
            if (newSplits.length > 0) {
              results = [...results, ...newSplits];
              smartSplitFound = true;

              if (initialResultCount === 0) {
                isPartialMatch = true;
                matchedKeywords = [safeQuery];
              }

              const sampleText = splitData[0].line_text || '';
              for (const pair of splitPairs) {
                if (sampleText.includes(pair.p1) && sampleText.includes(pair.p2)) {
                  foundP1 = pair.p1;
                  foundP2 = pair.p2;
                  break;
                }
              }
            }
          }
        }
      }

      // 3. 띄어쓴 복합어(산화물 자석) -> 개별 단어 AND 검색
      if (wordCount >= 2 && results.length < 50 && baseExtracted.length > 0) {
        let andQueryBuilder = supabase.from('dictionary_lines').select('*');
        baseExtracted.forEach(k => { andQueryBuilder = andQueryBuilder.ilike('line_text', `%${k}%`); });
        const { data: andData } = await andQueryBuilder.limit(50);

        if (andData && andData.length > 0) {
          const existingIds = new Set(results.map(r => r.id));
          const newAnds = andData.filter(r => !existingIds.has(r.id));
          results = [...results, ...newAnds];

          if (initialResultCount === 0) {
            isPartialMatch = true;
            matchedKeywords = baseExtracted;
          }
        }
      }

      // 4. 💡 수프로 최적화 핵심: 풍성한 OR 확장 검색 (산화물 38건, 자석 35건 끌어오기!)
      // 무거운 %풀스캔%을 없애고, 인덱스를 타는 단어 단위 OR 검색으로 속도와 결과를 모두 잡습니다.
      if (results.length < 100) {
        let orKeywords = [...baseExtracted];

        if (smartSplitFound && foundP1 && foundP2) {
           // 완벽한 쪼개기(산화물, 자석)를 찾았다면 그것으로만 검색
           orKeywords.push(foundP1, foundP2);
        } else if (wordCount === 1 && splitOrPieces.length > 0) {
           // 못 찾았어도 가능한 모든 유효 조각(2글자 이상)으로 폭넓게 검색
           orKeywords.push(...splitOrPieces);
        }

        const validOrKeywords = [...new Set(orKeywords)].filter(k => k.length >= 2);

        if (validOrKeywords.length > 0) {
          const orQueryStrs = validOrKeywords.map(k => `line_text.ilike.%${k}%`);
          const { data: orData } = await supabase.from('dictionary_lines')
            .select('*')
            .or(orQueryStrs.join(','))
            .limit(120);

          if (orData && orData.length > 0) {
            const existingIds = new Set(results.map(r => r.id));
            const newOrs = orData.filter(r => !existingIds.has(r.id));
            results = [...results, ...newOrs].slice(0, 150);

            if (initialResultCount === 0 && !smartSplitFound) {
               isPartialMatch = true;
               matchedKeywords = validOrKeywords;
            }

            if (smartSplitFound && foundP1 && foundP2) {
               orangeKeys.push(foundP1, foundP2);
            } else if (wordCount === 1 && splitOrPieces.length > 0) {
               orangeKeys.push(...splitOrPieces);
            }
          }
        }
      }

      // 5. 최후의 수단: 단일 짧은 영단어 등 퍼지 검색 (안전하게 타임아웃 방지)
      if (results.length === 0 && wordCount === 1 && cleanQuery.length >= 2 && cleanQuery.length <= 4) {
        const spacedQuery = cleanQuery.split('').join('%');
        const { data: fuzzyData } = await supabase.from('dictionary_lines')
          .select('*')
          .ilike('line_text', `%${spacedQuery}%`)
          .limit(30);

        if (fuzzyData && fuzzyData.length > 0) {
          results = fuzzyData;
          isPartialMatch = true;
          matchedKeywords = [cleanQuery];
          orangeKeys.push(cleanQuery);
        }
      }

      if (results.length > 0) {
        const cleanQueryNoSpace = cleanQuery.replace(/[\s\-_]/g, '').toLowerCase();

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
                orangeKeys.push(...original); 
                break;
              }
              if (combined.length > cleanQueryNoSpace.length) break;
            }
          }
        });

        orangeKeys.push(...baseExtracted);

        const cat0Items = results.filter(row => row.category_id === 0);
        const baseExtractedLower = baseExtracted.map(k => k.toLowerCase());

        if (cat0Items.length > 0) {
          cat0Items.forEach(row => {
            const cleanText = String(row.line_text || '').replace(/[.,:;()\[\]]/g, '');
            const words = cleanText.split(/\s+/);
            const firstWord = words[0]; 
            if (firstWord) {
              const fwLower = firstWord.toLowerCase();
              if (baseExtractedLower.includes(fwLower) || fwLower === cleanQuery.toLowerCase()) {
                blueKeys.push(...words); 
              }
            }
          });
        }

        orangeKeys = [...new Set(orangeKeys)].filter((w) => w && w.trim());
        blueKeys = [...new Set(blueKeys)].filter((w) => w && w.trim());

        results = rotateResults(results, cleanQuery, baseExtracted);
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
      isApp={true} 
      popularSearches={globalPopular}
      recentSearches={globalRecent}
      isPartialMatch={isPartialMatch}
      matchedKeywords={matchedKeywords}
    />
  );
}