// app/search/page.tsx
// ✅ PC 웹(/search) 서버 검색: 2단어 이상 검색어(전시를 축하드립니다) 부분 일치 완벽 해결 및 사오정 필터링!

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

const sortByCategory = (list: any[]) => {
  return list.sort((a, b) => {
    const catA = a.category_id != null ? a.category_id : 12;
    const catB = b.category_id != null ? b.category_id : 12;
    if (catA !== catB) return catA - catB;
    return a._db_index - b._db_index;
  });
};

// 🌟 [수술 1] 사오정 결과('발전시키다')를 밀어내고 진짜 단어('전시')를 위로 올리는 정렬 함수 업그레이드!
const rotateResults = (items: any[], keyword: string, allSearchKeywords: string[], flexStr: string, isSplitMode: boolean = false) => {
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
  
  // 🌟 독립 단어(전시)와 부분 단어(발전시키다)를 분리할 배열을 새로 만듭니다!
  const andMatchesBoundary: any[] = [];
  const andMatchesPartial: any[] = [];
  const orMatchesBoundary: any[] = [];
  const orMatchesPartial: any[] = [];
  
  const frontTightMatches: any[] = []; 
  const frontPartialMatches: any[] = []; 
  const backTightMatches: any[] = []; 
  const backPartialMatches: any[] = []; 

  const exactFrontRegex = new RegExp(`^${flexStr}(?:\\s|\\(|\\)|\\[|\\]|,|:|\\.|$)`, 'i');
  const exactStandaloneRegex = new RegExp(`(?:^|\\s|\\(|\\)|\\[|\\])${flexStr}(?:\\s|\\(|\\)|\\[|\\]|,|:|\\.|$)`, 'i');

  const isStrictStandalone = (text: string, target: string) => {
     if (!target) return false;
     const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
     const regex = new RegExp(`(?:^|[^가-힣a-zA-Z0-9_])${escapedTarget}(?:[^가-힣a-zA-Z0-9_]|$)`, 'i');
     return regex.test(text);
  };

  // 🌟 이것이 사오정 판독기입니다! (단어 앞에 한글이 붙어있으면 가짜 단어로 판별)
  const isWordBoundary = (text: string, target: string) => {
     if (!target) return false;
     const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
     const regex = new RegExp(`(?:^|[^가-힣a-zA-Z0-9_])${escaped}`, 'i');
     return regex.test(text);
  };

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
    } else if (item.split_type === 'front') {
      const splitTarget = (item.split_keyword || '').toLowerCase();
      if (isStrictStandalone(textOriginal, splitTarget)) frontTightMatches.push(item);
      else frontPartialMatches.push(item);
    } else if (item.split_type === 'back') {
      const splitTarget = (item.split_keyword || '').toLowerCase();
      if (isStrictStandalone(textOriginal, splitTarget)) backTightMatches.push(item);
      else backPartialMatches.push(item);
    } else if (item.is_rpc) {
      rpcMatches.push(item);
    } else {
      let hasAll = true;
      let hasBoundary = false;
      if (allSearchKeywords.length > 0) {
        for (const k of allSearchKeywords) {
          if (!textNoSpace.includes(k.toLowerCase())) { hasAll = false; }
          // 🌟 검색한 핵심 단어가 독립적으로 존재하면 최상단으로 올릴 수 있게 체크!
          if (isWordBoundary(textOriginal, k.toLowerCase())) { hasBoundary = true; }
        }
      } else { hasAll = false; }

      // 🌟 진짜 단어(Boundary)와 가짜 단어(Partial) 분리 수용!
      if (hasAll) {
         if (hasBoundary) andMatchesBoundary.push(item);
         else andMatchesPartial.push(item);
      } else {
         if (hasBoundary) orMatchesBoundary.push(item);
         else orMatchesPartial.push(item);
      }
    }
  });

  const hasTight = corpusSuperTight.length > 0 || dictSuperTight.length > 0 || corpusStandalone.length > 0 || dictStandalone.length > 0;

  if (hasTight && !isSplitMode) {
    return [
      ...sortByCategory(corpusSuperTight),
      ...sortByCategory(dictSuperTight),
      ...sortByCategory(corpusStandalone),
      ...sortByCategory(dictStandalone),
      ...sortByCategory(dictPartialMatch), 
      ...sortByCategory(corpusPartialMatch),
      ...sortByCategory(andMatchesBoundary), 
      ...sortByCategory(andMatchesPartial)
    ];
  } else {
    const combinedTightSplit: any[] = [];
    const sortedFrontTight = sortByCategory(frontTightMatches);
    const sortedBackTight = sortByCategory(backTightMatches);
    const maxTightSplitLen = Math.max(sortedFrontTight.length, sortedBackTight.length);
    for(let i=0; i < maxTightSplitLen; i++) {
        if(sortedFrontTight[i]) combinedTightSplit.push(sortedFrontTight[i]); 
        if(sortedBackTight[i]) combinedTightSplit.push(sortedBackTight[i]);   
    }

    const combinedPartialSplit: any[] = [];
    const sortedFrontPartial = sortByCategory(frontPartialMatches);
    const sortedBackPartial = sortByCategory(backPartialMatches);
    const maxPartialSplitLen = Math.max(sortedFrontPartial.length, sortedBackPartial.length);
    for(let i=0; i < maxPartialSplitLen; i++) {
        if(sortedFrontPartial[i]) combinedPartialSplit.push(sortedFrontPartial[i]);
        if(sortedBackPartial[i]) combinedPartialSplit.push(sortedBackPartial[i]);
    }

    return [
      ...sortByCategory(corpusSuperTight),
      ...sortByCategory(dictSuperTight),
      ...sortByCategory(corpusStandalone),
      ...sortByCategory(dictStandalone),
      ...combinedTightSplit, 
      ...sortByCategory(dictPartialMatch),
      ...sortByCategory(corpusPartialMatch),
      ...sortByCategory(andMatchesBoundary),
      ...sortByCategory(andMatchesPartial),
      ...sortByCategory(rpcMatches), 
      ...combinedPartialSplit, 
      ...sortByCategory(orMatchesBoundary),  // 🌟 진짜 단어 최상단 노출
      ...sortByCategory(orMatchesPartial)    // 🌟 가짜 사오정 단어 최하단 배치!
    ];
  }
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

// 🌟 [수술 2] SQL 에러의 주범이었던 별표(*)를 제거하고 다시 %로 복구! 
const getExactQueries = (word: string) => {
  const w = word.replace(/[,.()\[\]:"']/g, '').trim(); 
  return [
    `line_text.eq."${w}"`,
    `line_text.ilike."${w} %"`,
    `line_text.ilike."% ${w} %"`,
    `line_text.ilike."% ${w}"`
  ].join(',');
};

export default async function WebSearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = (searchParams.q || '').toString();
  const cleanQuery = query.trim();
  const noSpaceLen = cleanQuery.replace(/\s+/g, '').length;
  const noSpaceQuery = cleanQuery.replace(/\s+/g, '');

  const supabase = createServerComponentClient({ cookies });

  try {
    await supabase.auth.getSession();
  } catch(e) {}

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
  let allSearchKeywords: string[] = []; // 🌟 원본 단어('전시를')까지 모두 담을 그릇!

  const flexStr = noSpaceQuery.split('').map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s*');

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

  let bestSplit: {p1: string, p2: string} | undefined = undefined;
  if (cleanQuery && noSpaceLen >= 2) {
    wordCount = cleanQuery.split(/\s+/).length;
    baseExtracted = extractKeywords(cleanQuery);
    
    // 🌟 원본 단어('전시를', '축하드립니다')를 훼손하지 않고 고스란히 추가!
    const rawTokens = cleanQuery.split(/\s+/).map(t => t.replace(/[.,?!]/g, ''));
    allSearchKeywords = [...new Set([...baseExtracted, ...rawTokens])].filter(k => k.length >= 2 || /[가-힣]/.test(k));

    if (wordCount === 1 && cleanQuery.length >= 3 && cleanQuery.length <= 10 && /[가-힣]/.test(cleanQuery)) {
      const safeQuery = cleanQuery.replace(/[,.!?'"()\[\]]/g, '');
      let splitPairs: any[] = [];
      for (let i = 2; i <= safeQuery.length - 2; i++) {
        splitPairs.push({ p1: safeQuery.slice(0, i), p2: safeQuery.slice(i) });
      }
      if (splitPairs.length > 0) {
         bestSplit = splitPairs.reduce((prev, curr) => Math.abs(curr.p1.length - curr.p2.length) < Math.abs(prev.p1.length - prev.p2.length) ? curr : prev);
      }
    }

    const safeExactQuery = cleanQuery.replace(/[,.()\[\]:"']/g, '').trim();
    const safeNoSpaceQuery = noSpaceQuery.replace(/[,.()\[\]:"']/g, '').trim();

    const exactQueriesArray = [
      `line_text.eq."${safeExactQuery}"`, 
      `line_text.ilike."${safeExactQuery} %"`, 
      `line_text.ilike."% ${safeExactQuery} %"`, 
      `line_text.ilike."% ${safeExactQuery}"`
    ];
    if (safeExactQuery !== safeNoSpaceQuery && safeNoSpaceQuery.length >= 2) {
      exactQueriesArray.push(
        `line_text.eq."${safeNoSpaceQuery}"`, 
        `line_text.ilike."${safeNoSpaceQuery} %"`, 
        `line_text.ilike."% ${safeNoSpaceQuery} %"`, 
        `line_text.ilike."% ${safeNoSpaceQuery}"`
      );
    }
    
    promises.push((async () => {
      try {
        const { data } = await supabase.from('dictionary_lines').select('*').or(exactQueriesArray.join(',')).order('category_id', { ascending: true }).limit(100);
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

    if (bestSplit) {
      promises.push((async () => {
        try {
          const { data } = await supabase.from('dictionary_lines')
            .select('*')
            .ilike('line_text', `%${bestSplit!.p1}%`)
            .ilike('line_text', `%${bestSplit!.p2}%`)
            .order('category_id', { ascending: true })
            .limit(50);
          if (data) data.forEach(item => addRes(item));
        } catch(e) {}
      })());
    }

    await Promise.all(promises);

    results = Array.from(resultsMap.values());

    let hasExactMatch = false;

    for (const item of results) {
      const txt = (item.line_text || '').toLowerCase();
      if (item.is_exact_priority || new RegExp(`(?:^|[^가-힣a-zA-Z0-9_])${flexStr}(?:[^가-힣a-zA-Z0-9_]|$)`, 'i').test(txt)) {
        hasExactMatch = true;
        break;
      }
    }

    let isSplitModeActive = false; 

    if (!hasExactMatch && results.length < 50) {
      const fallbackPromises: Promise<void>[] = [];
      
      if (wordCount === 1 && bestSplit) {
        isSplitModeActive = true; 
        
        fallbackPromises.push((async () => {
          try {
            const { data } = await supabase.from('dictionary_lines').select('*').or(getExactQueries(bestSplit!.p1)).order('category_id', { ascending: true }).limit(50);
            if (data) data.forEach(item => { item.split_type = 'front'; item.split_keyword = bestSplit!.p1; addRes(item); });
          } catch(e) {}
        })());

        fallbackPromises.push((async () => {
          try {
            const { data } = await supabase.from('dictionary_lines').select('*').or(getExactQueries(bestSplit!.p2)).order('category_id', { ascending: true }).limit(50);
            if (data) data.forEach(item => { item.split_type = 'back'; item.split_keyword = bestSplit!.p2; addRes(item); });
          } catch(e) {}
        })());

        fallbackPromises.push((async () => {
          try {
            const { data } = await supabase.from('dictionary_lines').select('*').ilike('line_text', `%${bestSplit!.p1}%`).order('category_id', { ascending: true }).limit(30);
            if (data) data.forEach(item => { if (!item.split_type) { item.split_type = 'front_partial'; item.split_keyword = bestSplit!.p1; addRes(item); } });
          } catch(e) {}
        })());

        fallbackPromises.push((async () => {
          try {
            const { data } = await supabase.from('dictionary_lines').select('*').ilike('line_text', `%${bestSplit!.p2}%`).order('category_id', { ascending: true }).limit(30);
            if (data) data.forEach(item => { if (!item.split_type) { item.split_type = 'back_partial'; item.split_keyword = bestSplit!.p2; addRes(item); } });
          } catch(e) {}
        })());
      } else {
         const validOrKeywords = [...new Set(allSearchKeywords)].filter(k => {
           if (/[가-힣]/.test(k) && k.length <= 1) return false; 
           if (wordCount >= 3 && /[가-힣]/.test(k) && k.length <= 2) return false; 
           return k.length >= 2;
         });

         // 🌟 [수술 3] 1단어 제한 삭제! 다중 단어일 때 진짜 단어(Boundary)부터 찾고 가짜 단어(Partial)를 찾습니다!
         if (validOrKeywords.length > 0) {
           isPartialMatch = true;
           matchedKeywords = validOrKeywords;
           orangeKeys.push(...validOrKeywords);

           validOrKeywords.forEach(k => {
             const cleanK = k.replace(/[,.()\[\]:"']/g, '');
             if (!cleanK) return;

             // 1. 진짜 단어 우선 검색 (전시를, 축하드립니다 등)
             fallbackPromises.push((async () => {
               try {
                 const exactQs = getExactQueries(cleanK);
                 const { data } = await supabase.from('dictionary_lines').select('*').or(exactQs).order('category_id', { ascending: true }).limit(50);
                 if (data) data.forEach(item => addRes(item));
               } catch(e) {}
             })());

             // 2. 가짜 단어 포함 검색 (발전시키다 등)
             fallbackPromises.push((async () => {
               try {
                 const { data } = await supabase.from('dictionary_lines').select('*').ilike('line_text', `%${cleanK}%`).order('category_id', { ascending: true }).limit(30);
                 if (data) data.forEach(item => addRes(item));
               } catch(e) {}
             })());
           });
         }
      }

      if (wordCount === 1 && cleanQuery.length >= 2 && cleanQuery.length <= 4 && !bestSplit && /[가-힣]/.test(cleanQuery)) {
        const spacedQuery = cleanQuery.split('').join('%');
        fallbackPromises.push((async () => {
          try {
            const { data } = await supabase.from('dictionary_lines').select('*').ilike('line_text', `%${spacedQuery}%`).order('category_id', { ascending: true }).limit(30);
            if (data && data.length > 0) { 
              data.forEach(addRes); 
              isPartialMatch = true; 
              matchedKeywords = [cleanQuery]; 
              orangeKeys.push(cleanQuery); 
            }
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
      orangeKeys.push(...allSearchKeywords);
      orangeKeys.push(noSpaceQuery);

      if (bestSplit) {
         orangeKeys.push(bestSplit.p1, bestSplit.p2);
      }

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
      
      let isSplitModeActive = !!bestSplit;
      results = rotateResults(results, cleanQuery, allSearchKeywords, flexStr, isSplitModeActive);
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