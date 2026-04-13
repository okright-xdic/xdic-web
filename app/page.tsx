// app/page.tsx
// ✅ 웹(/) 서버 검색: 영어 단어 독립 매치(\b) 도입! (위스키, 가르손느룩 등 사오정 검색 완벽 차단!)

import SearchPage from '@/components/SearchPage';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const kKeepWords = new Set([
  '좋은', '많은', '작은', '큰', '새로운', '나쁜', '어려운',
  '가는', '낮은', '깊은', '밝은', '맑은',
  '사랑', '사람', '서로', '바로', '함께', '같이', '다시'
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
  chose: 'choose', chosen: 'choose', came: 'come'
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

const rotateResults = (items: any[], keyword: string, extractedKeywords: string[], flexRegexStr: string) => {
  if (!items || items.length === 0) return [];
  const lowerKeywordNoSpace = keyword.trim().toLowerCase().replace(/\s+/g, '');
  const itemsWithIndex = items.map((item, idx) => ({ ...item, _db_index: idx }));

  const corpusSuperTight: any[] = [];
  const corpusStandalone: any[] = [];
  const corpusPartialMatch: any[] = [];
  const dictSuperTight: any[] = [];
  const dictStandalone: any[] = [];
  const dictPartialMatch: any[] = [];
  const rpcMatches: any[] = [];
  const andMatches: any[] = [];
  const orMatches: any[] = [];

  const exactFrontRegex = new RegExp(`^${flexRegexStr}(?:\\s|\\(|\\)|\\[|\\]|,|:|\\.|$)`, 'i');
  const exactStandaloneRegex = new RegExp(`(?:^|\\s|\\(|\\)|\\[|\\])${flexRegexStr}(?:\\s|\\(|\\)|\\[|\\]|,|:|\\.|$)`, 'i');

  itemsWithIndex.forEach((item) => {
    const textNoSpace = (item.line_text || '').toLowerCase().replace(/\s+/g, '');
    const textOriginal = (item.line_text || '').toLowerCase();
    const isCorpus = item.category_id === 0;

    const isSuperTight = item.is_exact_priority || exactFrontRegex.test(textOriginal);
    const isStandalone = exactStandaloneRegex.test(textOriginal);

    if (isCorpus) {
      if (isSuperTight) corpusSuperTight.push(item);
      else if (isStandalone) corpusStandalone.push(item);
      else corpusPartialMatch.push(item);
      return;
    }

    if (isSuperTight) {
      dictSuperTight.push(item);
    } else if (isStandalone) {
      dictStandalone.push(item);
    } else if (textNoSpace.includes(lowerKeywordNoSpace)) {
      dictPartialMatch.push(item); 
    } else if (item.is_rpc) {
      rpcMatches.push(item);
    } else {
      let hasAll = true;
      if (extractedKeywords.length > 0) {
        for (const k of extractedKeywords) {
          if (!textNoSpace.includes(k.toLowerCase())) { hasAll = false; break; }
        }
      } else { hasAll = false; }

      if (hasAll) andMatches.push(item);
      else orMatches.push(item);
    }
  });

  const rotatedDictSuperTight = rotateBuckets(dictSuperTight);
  const rotatedDictStandalone = rotateBuckets(dictStandalone);
  const rotatedDictPartial = rotateBuckets(dictPartialMatch);
  const rotatedAnd = rotateBuckets(andMatches);
  const rotatedRpc = rotateBuckets(rpcMatches);
  const rotatedOr = rotateBuckets(orMatches);

  corpusSuperTight.sort((a, b) => a._db_index - b._db_index);
  corpusStandalone.sort((a, b) => a._db_index - b._db_index);
  corpusPartialMatch.sort((a, b) => a._db_index - b._db_index);

  const hasTight = corpusSuperTight.length > 0 || dictSuperTight.length > 0 || corpusStandalone.length > 0 || dictStandalone.length > 0;

  if (hasTight) {
    return [
      ...corpusSuperTight,
      ...rotatedDictSuperTight,
      ...corpusStandalone,
      ...rotatedDictStandalone,
      ...rotatedDictPartial, 
      ...corpusPartialMatch,
      ...rotatedAnd 
    ];
  } else {
    return [
      ...corpusSuperTight,
      ...rotatedDictSuperTight,
      ...corpusStandalone,
      ...rotatedDictStandalone,
      ...rotatedDictPartial,
      ...corpusPartialMatch,
      ...rotatedAnd,
      ...rotatedRpc, 
      ...rotatedOr   
    ];
  }
};

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

export default async function Page({ searchParams }: { searchParams: { q?: string; app?: string }; }) {
  const query = (searchParams.q || '').toString();
  const cleanQuery = query.trim();
  const noSpaceLen = cleanQuery.replace(/\s+/g, '').length;
  const noSpaceQuery = cleanQuery.replace(/\s+/g, '');

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

  const promises: Promise<void>[] = [];
  const resultsMap = new Map();
  const addRes = (item: any) => { if (!resultsMap.has(item.id)) resultsMap.set(item.id, item); };

  let wordCount = 0;
  let baseExtracted: string[] = [];
  let blueTokenData: any[] = [];

  const flexStr = noSpaceQuery.split('').map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s*');
  const exactFrontRegex = new RegExp(`^${flexStr}(?:\\s|\\(|\\)|\\[|\\]|,|:|\\.|$)`, 'i');
  const exactStandaloneRegex = new RegExp(`(?:^|\\s|\\(|\\)|\\[|\\])${flexStr}(?:\\s|\\(|\\)|\\[|\\]|,|:|\\.|$)`, 'i');

  promises.push((async () => {
    try {
      const { data: logs } = await supabase.from('search_logs').select('keyword').order('created_at', { ascending: false }).limit(500);
      if (logs && logs.length > 0) {
        const counts: Record<string, number> = {};
        logs.forEach(l => { counts[l.keyword] = (counts[l.keyword] || 0) + 1; });
        const uniqueRecents = Array.from(new Set(logs.map(l => l.keyword)));
        globalRecent = uniqueRecents.slice(0, 15).map(word => ({ word, count: counts[word] || 1 }));
        globalPopular = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(entry => entry[0]).slice(0, 20);
      }
    } catch(e) {}
  })());

  if (cleanQuery && noSpaceLen >= 2) {
    wordCount = cleanQuery.split(/\s+/).length;
    baseExtracted = extractKeywords(cleanQuery);

    const exactQueriesArray = [
      `line_text.eq.${cleanQuery}`, `line_text.ilike.${cleanQuery} %`, `line_text.ilike.${cleanQuery},%`, `line_text.ilike.% ${cleanQuery} %`, `line_text.ilike.% ${cleanQuery}`
    ];
    if (cleanQuery !== noSpaceQuery && noSpaceQuery.length >= 2) {
      exactQueriesArray.push(
        `line_text.eq.${noSpaceQuery}`, `line_text.ilike.${noSpaceQuery} %`, `line_text.ilike.${noSpaceQuery},%`, `line_text.ilike.% ${noSpaceQuery} %`, `line_text.ilike.% ${noSpaceQuery}`
      );
    }
    
    promises.push((async () => {
      try {
        const { data } = await supabase.from('dictionary_lines').select('*').or(exactQueriesArray.join(',')).limit(100);
        if (data) data.forEach(item => { item.is_exact_priority = true; addRes(item); });
      } catch(e) {}
    })());

    promises.push((async () => {
      try {
        const { data } = await supabase.rpc('search_dictionary_smart', { keyword: query });
        if (Array.isArray(data)) data.forEach(item => addRes({ ...item, is_rpc: true }));
      } catch(e) {}
    })());

    if (cleanQuery.includes(' ') && noSpaceQuery.length >= 2) {
      promises.push((async () => {
        try {
          const { data } = await supabase.rpc('search_dictionary_smart', { keyword: noSpaceQuery });
          if (Array.isArray(data)) data.forEach(item => addRes({ ...item, is_rpc: true }));
        } catch(e) {}
      })());
    }

    promises.push((async () => {
      try {
        const { data } = await supabase.from('dictionary_lines').select('*').eq('category_id', 0).or(exactQueriesArray.join(',')).limit(30);
        if (data) data.forEach(item => addRes(item));
      } catch(e) {}
    })());

    if (wordCount >= 2 && baseExtracted.length > 0) {
      const wordExactOrs: string[] = [];
      baseExtracted.forEach(w => {
        wordExactOrs.push(`line_text.eq.${w}`, `line_text.ilike.${w} %`, `line_text.ilike.% ${w} %`, `line_text.ilike.% ${w}`, `line_text.ilike.${w},%`);
      });
      if (wordExactOrs.length > 0) {
        promises.push((async () => {
          try {
            const { data } = await supabase.from('dictionary_lines').select('*').or(wordExactOrs.join(',')).limit(60);
            if (data) data.forEach(item => addRes(item));
          } catch(e) {}
        })());
      }

      promises.push((async () => {
        try {
          let andQueryBuilder = supabase.from('dictionary_lines').select('*');
          baseExtracted.forEach(k => { andQueryBuilder = andQueryBuilder.ilike('line_text', `%${k}%`); });
          const { data } = await andQueryBuilder.limit(50);
          if (data) {
            // 🌟 [수술 완벽 적용] AND 조건으로 가져온 결과도 영어일 경우 정확히 단어로 존재하는지(Boundaries) 검사!
            data.forEach(item => {
                const txt = item.line_text || '';
                const isValid = baseExtracted.every(k => {
                    if (/^[a-zA-Z]+$/.test(k)) return new RegExp(`\\b${k}\\b`, 'i').test(txt);
                    return true;
                });
                if (isValid) addRes(item);
            }); 
            if (resultsMap.size === 0) { isPartialMatch = true; matchedKeywords = baseExtracted; }
          }
        } catch(e) {}
      })());
    }

    let splitPairs: any[] = [];
    if (wordCount === 1 && cleanQuery.length >= 3 && cleanQuery.length <= 10 && /[가-힣]/.test(cleanQuery)) {
      const safeQuery = cleanQuery.replace(/[,.!?'"()\[\]]/g, '');
      for (let i = 2; i <= safeQuery.length - 2; i++) {
        splitPairs.push({ p1: safeQuery.slice(0, i), p2: safeQuery.slice(i) });
      }
      if (splitPairs.length > 0) {
        const andQueryStrs = splitPairs.map(pair => `and(line_text.ilike.%${pair.p1}%,line_text.ilike.%${pair.p2}%)`);
        promises.push((async () => {
          try {
            const { data } = await supabase.from('dictionary_lines').select('*').or(andQueryStrs.join(',')).limit(50);
            if (data) data.forEach(addRes);
          } catch(e) {}
        })());
      }
    }

    const rawTokensForBlue = extractRawTokens(cleanQuery);
    const validTokensForBlue = rawTokensForBlue.filter(token => {
      if (eStopWords.has(token.toLowerCase()) || kStopWords.has(token)) return false;
      if (/[가-힣]/.test(token) && token.length === 1) return false; 
      return true;
    });
    if (validTokensForBlue.length > 0) {
      const tokenOrs = validTokensForBlue.map(t => `line_text.ilike.%${t}%`).join(',');
      promises.push((async () => {
        try {
          const { data } = await supabase.from('dictionary_lines').select('*').eq('category_id', 0).or(tokenOrs).limit(60);
          if (data) {
              // 🌟 [수술 완벽 적용] 'whisky' 사오정 방지! 영어 단어는 무조건 독립 단어(\b)일 때만 합격시킵니다!
              data.forEach(item => {
                  const txt = item.line_text || '';
                  const isValid = validTokensForBlue.some(t => {
                      if (/^[a-zA-Z]+$/.test(t)) return new RegExp(`\\b${t}\\b`, 'i').test(txt);
                      return txt.toLowerCase().includes(t.toLowerCase());
                  });
                  if (isValid) blueTokenData.push(item);
              });
          }
        } catch(e) {}
      })());
    }

    await Promise.all(promises);

    blueTokenData.forEach(addRes);
    results = Array.from(resultsMap.values());

    let hasExactMatch = false;
    let smartSplitFound = false;

    for (const item of results) {
      const txt = (item.line_text || '').toLowerCase();
      if (item.is_exact_priority || exactFrontRegex.test(txt) || exactStandaloneRegex.test(txt)) {
        hasExactMatch = true;
        break;
      }
    }

    if (wordCount === 1 && splitPairs.length > 0) {
      for (const item of results) {
        const sampleText = item.line_text || '';
        for (const pair of splitPairs) {
          if (sampleText.includes(pair.p1) && sampleText.includes(pair.p2)) {
            smartSplitFound = true; break;
          }
        }
        if (smartSplitFound) break;
      }
    }

    if (!hasExactMatch && !smartSplitFound && results.length < 30) {
      const fallbackPromises: Promise<void>[] = [];
      let orKeywords = [...baseExtracted];

      const validOrKeywords = [...new Set(orKeywords)].filter(k => {
        if (/[가-힣]/.test(k) && k.length <= 1) return false; 
        if (wordCount >= 3 && /[가-힣]/.test(k) && k.length <= 2) return false; 
        return k.length >= 2;
      });

      if (validOrKeywords.length > 0 && wordCount === 1) {
        const orKeywordStrs = validOrKeywords.map(k => `line_text.ilike.%${k}%`).join(',');
        fallbackPromises.push((async () => {
          try {
            const { data } = await supabase.from('dictionary_lines').select('*').or(orKeywordStrs).limit(80);
            if (data) {
                // 🌟 [수술 완벽 적용] OR 검색 결과도 영어 단어일 경우 꼬리표(위스키) 차단!
                data.forEach(item => {
                    const txt = item.line_text || '';
                    const isValid = validOrKeywords.some(t => {
                        if (/^[a-zA-Z]+$/.test(t)) return new RegExp(`\\b${t}\\b`, 'i').test(txt);
                        return txt.toLowerCase().includes(t.toLowerCase());
                    });
                    if (isValid) addRes(item);
                });
            }
          } catch(e) {}
        })());
      }

      if (wordCount === 1 && cleanQuery.length >= 2 && cleanQuery.length <= 4) {
        const spacedQuery = cleanQuery.split('').join('%');
        fallbackPromises.push((async () => {
          try {
            const { data } = await supabase.from('dictionary_lines').select('*').ilike('line_text', `%${spacedQuery}%`).limit(30);
            if (data && resultsMap.size === 0) { data.forEach(addRes); isPartialMatch = true; matchedKeywords = [cleanQuery]; orangeKeys.push(cleanQuery); }
          } catch(e) {}
        })());
      }

      if (fallbackPromises.length > 0) await Promise.all(fallbackPromises);
      results = Array.from(resultsMap.values());
    }

    if (results.length > 0) {
      const cleanQueryNoSpace = cleanQuery.replace(/[\s\-_]/g, '').toLowerCase();
      const allOriginalWords = cleanQuery.split(/\s+/).map(w => w.replace(/[.,:;()\[\]?!]/g, '')).filter(w => w.length > 0);
      
      allOriginalWords.forEach(w => {
         if (w.length > 1 || !/[가-힣]/.test(w)) orangeKeys.push(w);
      });
      orangeKeys.push(...baseExtracted);
      orangeKeys.push(noSpaceQuery);

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
      
      let secretBlueKeys: string[] = [];
      results.forEach(row => {
        if (row.category_id === 0 || row.category_id === 1 || row.category_id === 2 || row.category_id === 3 || row.category_id === 9) { 
          const textOriginal = (row.line_text || '').toLowerCase();
          const textNoSpace = textOriginal.replace(/\s+/g, '');
          if (exactFrontRegex.test(textOriginal) || exactStandaloneRegex.test(textOriginal) || textNoSpace.includes(cleanQueryNoSpace)) {
            const words = String(row.line_text || '').replace(/[.,:;()\[\]?!"]/g, '').split(/\s+/).filter(w => w.length > 0);
            words.forEach(w => {
              const lw = w.toLowerCase();
              if (eStopWords.has(lw) || kStopWords.has(lw)) return;
              if (isEnglishQuery && /[가-힣]/.test(w)) secretBlueKeys.push(w);
              if (isKoreanQuery && /^[a-zA-Z]+$/.test(w)) secretBlueKeys.push(w);
              if (!isEnglishQuery && !isKoreanQuery) secretBlueKeys.push(w);
            });
          }
        }
      });

      blueKeys = [...new Set(secretBlueKeys)].filter((b) => {
        if (!b || !b.trim()) return false;
        const isAlreadyOrange = orangeKeys.some(o => o.toLowerCase() === b.toLowerCase());
        return !isAlreadyOrange; 
      });

      results = rotateResults(results, cleanQuery, baseExtracted, flexStr);
    }
  }

  const isApp = false;

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