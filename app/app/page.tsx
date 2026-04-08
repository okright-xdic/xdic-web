// app/app/page.tsx
// ✅ 앱(/app) 서버 검색: 띄어쓰기 기준으로 완벽하게 단어를 쪼개어 사전에서 파란색 물감 추출!

import SearchPage from '@/components/SearchPage';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

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
      if (hasJongseong && ['이', '은', '을'].includes(lastChar)) clean = clean.slice(0, -1);
      else if (!hasJongseong && ['가', '는', '를'].includes(lastChar)) clean = clean.slice(0, -1);
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

const rotateBuckets = (list: any[]) => {
  const buckets: Record<number, any[]> = {};
  for (let i = 0; i <= 12; i++) buckets[i] = [];

  list.forEach((item) => {
    const catId = item.category_id >= 0 && item.category_id <= 12 ? item.category_id : 12;
    buckets[catId].push(item);
  });

  for (let i = 0; i <= 12; i++) buckets[i].sort((a, b) => a._db_index - b._db_index);

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
  return rotated;
};

const rotateResults = (items: any[], keyword: string, extractedKeywords: string[]) => {
  if (!items || items.length === 0) return [];
  const lowerKeyword = keyword.trim().toLowerCase();
  const lowerKeywordNoSpace = lowerKeyword.replace(/\s+/g, '');
  const lowerExtracted = extractedKeywords.map(k => k.toLowerCase().replace(/\s+/g, ''));

  const itemsWithIndex = items.map((item, idx) => ({ ...item, _db_index: idx }));

  const corpusExactMatch: any[] = [];
  const dictExact: any[] = [];
  const rpcMatches: any[] = []; 
  const andMatches: any[] = [];
  const orMatches: any[] = [];
  const corpusPartialMatchTail: any[] = [];

  itemsWithIndex.forEach((item) => {
    const textNoSpace = (item.line_text || '').toLowerCase().replace(/\s+/g, '');
    const textOriginal = (item.line_text || '').toLowerCase();
    const isCorpus = item.category_id === 0;

    const isExactNoSpace = textNoSpace.includes(lowerKeywordNoSpace);
    const isExactOriginal = textOriginal.includes(lowerKeyword);

    if (isCorpus) {
      if (isExactNoSpace || isExactOriginal) corpusExactMatch.push(item);
      else corpusPartialMatchTail.push(item); 
      return;
    }

    if (isExactNoSpace || isExactOriginal) {
      dictExact.push(item);
    } else if (item.is_rpc) {
      rpcMatches.push(item);
    } else {
      let hasAll = true;
      if (lowerExtracted.length > 0) {
        for (const k of lowerExtracted) {
          if (!textNoSpace.includes(k)) {
            hasAll = false;
            break;
          }
        }
      } else {
        hasAll = false;
      }

      if (hasAll) andMatches.push(item);
      else orMatches.push(item);
    }
  });

  corpusExactMatch.sort((a, b) => a._db_index - b._db_index);
  dictExact.sort((a, b) => a._db_index - b._db_index);
  rpcMatches.sort((a, b) => a._db_index - b._db_index);
  
  const rotatedAnd = rotateBuckets(andMatches);

  orMatches.sort((a, b) => {
    const vipCats = [3, 4, 5, 6, 7, 8, 9, 10, 11];
    const isAVip = vipCats.includes(a.category_id);
    const isBVip = vipCats.includes(b.category_id);
    if (isAVip && !isBVip) return -1;
    if (!isAVip && isBVip) return 1;
    return a._db_index - b._db_index;
  });

  return [...corpusExactMatch, ...dictExact, ...rpcMatches, ...rotatedAnd, ...orMatches, ...corpusPartialMatchTail];
};

// 🌟 원형 추출 함수 (파란색 물감 만들 때 한글/영어 찌꺼기를 날리지 않고 원본 그대로 살려줍니다)
const extractRawTokens = (query: string): string[] => {
  return query.split(/\s+/).map(w => w.replace(/[.,:;()\[\]?!]/g, '')).filter(w => w.length > 0);
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

  const isEnglishQuery = /^[a-zA-Z\s\-_]+$/.test(cleanQuery);
  const isKoreanQuery = /^[가-힣\s]+$/.test(cleanQuery);

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
      const wordCount = cleanQuery.split(/\s+/).length;

      let corpusData: any[] = [];
      let secretBlueKeys: string[] = [];

      try {
        const exactQueries = [`%${cleanQuery}%`];
        const noSpaceQuery = cleanQuery.replace(/\s+/g, '');
        if (cleanQuery !== noSpaceQuery && noSpaceQuery.length >= 2) {
          exactQueries.push(`%${noSpaceQuery}%`); 
        }

        const exactOr = exactQueries.map(q => `line_text.ilike.${q}`).join(',');
        const { data: exactCat0 } = await supabase.from('dictionary_lines')
          .select('*')
          .eq('category_id', 0)
          .or(exactOr)
          .limit(30);
        
        if (exactCat0) {
          corpusData = [...exactCat0];
          exactCat0.forEach(row => {
            const words = String(row.line_text || '').replace(/[.,:;()\[\]?!"]/g, '').split(/\s+/).filter(w => w.length > 0);
            words.forEach(w => {
              const lw = w.toLowerCase();
              if (eStopWords.has(lw) || kStopWords.has(lw)) return;
              if (isEnglishQuery && /[가-힣]/.test(w)) secretBlueKeys.push(w);
              if (isKoreanQuery && /^[a-zA-Z]+$/.test(w)) secretBlueKeys.push(w);
              if (!isEnglishQuery && !isKoreanQuery) secretBlueKeys.push(w);
            });
          });
        }
        
        // 🌟 수프로의 파란색 부활 로직: 띄어쓰기 그대로 모든 조각(how, long)을 사전에 던집니다!
        const rawTokensForBlue = extractRawTokens(cleanQuery);
        
        for (const token of rawTokensForBlue) {
          if (eStopWords.has(token.toLowerCase()) || kStopWords.has(token)) continue;
          if (/[가-힣]/.test(token) && token.length === 1) continue; 

          const { data: tokenData } = await supabase.from('dictionary_lines')
            .select('*')
            .eq('category_id', 0)
            .ilike('line_text', `%${token}%`)
            .limit(30);
          
          if (tokenData) {
            let filtered = tokenData;
            if (/^[a-zA-Z]+$/.test(token)) {
              const regex = new RegExp(`\\b${token}\\b`, 'i');
              filtered = tokenData.filter(r => regex.test(r.line_text || ''));
            }
            filtered.sort((a, b) => (a.line_text?.length || 0) - (b.line_text?.length || 0));

            // 긴 문장이 아닐 때만 기초영어를 결과에 추가 (사오정 방지)
            if (wordCount <= 2) {
              corpusData = [...corpusData, ...filtered.slice(0, 3)];
            }

            // 🌟 파란색 물감(secretBlueKeys)은 한도 없이 듬뿍 추출합니다!
            filtered.slice(0, 10).forEach(row => {
              const words = String(row.line_text || '').replace(/[.,:;()\[\]?!"]/g, '').split(/\s+/).filter(w => w.length > 0);
              words.forEach(w => {
                const lw = w.toLowerCase();
                if (eStopWords.has(lw) || kStopWords.has(lw)) return;
                if (isEnglishQuery && /[가-힣]/.test(w)) secretBlueKeys.push(w);
                if (isKoreanQuery && /^[a-zA-Z]+$/.test(w)) secretBlueKeys.push(w);
                if (!isEnglishQuery && !isKoreanQuery) secretBlueKeys.push(w);
              });
            });
          }
        }
        
        const seenCorpus = new Set();
        corpusData = corpusData.filter(item => {
          if (seenCorpus.has(item.id)) return false;
          seenCorpus.add(item.id);
          return true;
        });
      } catch(e) {}

      const { data, error } = await supabase.rpc('search_dictionary_smart', { keyword: query });
      if (!error && Array.isArray(data)) {
        results = data.map(item => ({ ...item, is_rpc: true }));
      }

      if (corpusData.length > 0) {
        const existingIds = new Set(results.map(r => r.id));
        const newCorpus = corpusData.filter(r => !existingIds.has(r.id));
        results = [...newCorpus, ...results]; 
      }

      const baseExtracted = extractKeywords(cleanQuery); 

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

              const sampleText = newSplits[0].line_text || '';
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

      if (wordCount >= 2 && results.length < 50 && baseExtracted.length > 0) {
        let andQueryBuilder = supabase.from('dictionary_lines').select('*');
        baseExtracted.forEach(k => { andQueryBuilder = andQueryBuilder.ilike('line_text', `%${k}%`); });
        const { data: andData } = await andQueryBuilder.limit(50);

        if (andData && andData.length > 0) {
          let filteredAnds = andData;
          baseExtracted.forEach(k => {
            if (/^[a-zA-Z]+$/.test(k)) {
              const regex = new RegExp(`\\b${k}\\b`, 'i');
              filteredAnds = filteredAnds.filter(row => regex.test(row.line_text || ''));
            }
          });

          const existingIds = new Set(results.map(r => r.id));
          const newAnds = filteredAnds.filter(r => !existingIds.has(r.id));
          results = [...results, ...newAnds];

          if (initialResultCount === 0) {
            isPartialMatch = true;
            matchedKeywords = baseExtracted;
          }
        }
      }

      // 🌟 사오정 원천 차단 철칙: 긴 문장(3단어 이상)에서 이미 완벽한 정답을 찾았다면, 쓰레기 데이터 검색 셔터 강제 종료!
      let shouldDoOrSearch = true;
      if (wordCount >= 3 && results.length > 0) {
        shouldDoOrSearch = false; // 진발다이트, 난황샘 등 완전 박멸!
      }

      if (shouldDoOrSearch && results.length < 100) {
        let orKeywords = [...baseExtracted];

        if (smartSplitFound && foundP1 && foundP2) {
           orKeywords.push(foundP1, foundP2);
        } else if (!smartSplitFound && wordCount === 1 && splitOrPieces.length > 0) {
           orKeywords.push(...splitOrPieces);
        }

        const validOrKeywords = [...new Set(orKeywords)].filter(k => {
          if (/[가-힣]/.test(k) && k.length <= 1) return false; // 1글자 찌꺼기 차단
          if (wordCount >= 3 && /[가-힣]/.test(k) && k.length <= 2) return false; 
          return k.length >= 2;
        });

        if (validOrKeywords.length > 0) {
          let combinedOrData: any[] = [];
          
          for (const k of validOrKeywords) {
            try {
              const { data } = await supabase.from('dictionary_lines')
                .select('*')
                .ilike('line_text', `%${k}%`)
                .limit(100);
                
              if (data && data.length > 0) {
                let filteredData = data;
                if (/^[a-zA-Z]+$/.test(k)) {
                  const regex = new RegExp(`\\b${k}\\b`, 'i');
                  filteredData = data.filter(row => regex.test(row.line_text || ''));
                }
                combinedOrData = [...combinedOrData, ...filteredData];
              }
            } catch(err) {}
          }

          if (combinedOrData.length > 0) {
            const existingIds = new Set(results.map(r => r.id));
            const newOrs = combinedOrData.filter(r => !existingIds.has(r.id));
            results = [...results, ...newOrs].slice(0, 200);
          }
        }
      }

      if (results.length === 0 && wordCount === 1 && cleanQuery.length >= 2 && cleanQuery.length <= 4) {
        try {
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
        } catch(err) {}
      }

      if (results.length > 0) {
        const cleanQueryNoSpace = cleanQuery.replace(/[\s\-_]/g, '').toLowerCase();

        const allOriginalWords = cleanQuery.split(/\s+/).map(w => w.replace(/[.,:;()\[\]?!]/g, '')).filter(w => w.length > 0);
        
        allOriginalWords.forEach(w => {
           if (w.length === 1 && /[가-힣]/.test(w)) return; 
           orangeKeys.push(w);
        });
        orangeKeys.push(...baseExtracted);

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

        orangeKeys = [...new Set(orangeKeys)].filter((w) => w && w.trim());
        
        // 🌟 완벽한 파란색 방패
        blueKeys = [...new Set(secretBlueKeys)].filter((b) => {
          if (!b || !b.trim()) return false;
          const isAlreadyOrange = orangeKeys.some(o => o.toLowerCase() === b.toLowerCase());
          return !isAlreadyOrange; 
        });

        results = rotateResults(results, cleanQuery, baseExtracted);
      }
    } catch (e) {
      console.error('❌ 검색 실패:', e);
    }
  }

  const isApp = true; 

  return (
    <SearchPage 
      query={query} 
      results={results} 
      orangeKeys={orangeKeys} 
      blueKeys={blueKeys} 
      isApp={isApp} 
      popularSearches={globalPopular}
      recentSearches={globalRecent}
      isPartialMatch={isPartialMatch}
      matchedKeywords={matchedKeywords}
    />
  );
}