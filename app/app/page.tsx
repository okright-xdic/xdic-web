// app/app/page.tsx
// ✅ 앱(/app) 서버 검색: 1. 일치 시 오지랖 역검색(OR) 차단 / 2. 두 단어 이상은 Exact Match만 허용 (논리 완벽 패치!)

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

// 🌟 무적의 VIP 판독기 및 사오정 필터
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

    // 🌟 완벽 일치 VIP ("기능장애" == "기능 장애")
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
      dictPartialMatch.push(item); // 단순 포함 (접두사/접미사)
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

  // 🌟 [Rule 1 & 2의 핵심] 정답(VIP)이 존재하면 사오정(RPC)과 오지랖(OR) 검색 결과를 화면에서 완전히 숨깁니다!
  const hasTight = corpusSuperTight.length > 0 || dictSuperTight.length > 0 || corpusStandalone.length > 0 || dictStandalone.length > 0;

  if (hasTight) {
    return [
      ...corpusSuperTight,
      ...rotatedDictSuperTight,
      ...corpusStandalone,
      ...rotatedDictStandalone,
      ...rotatedDictPartial, 
      ...corpusPartialMatch,
      ...rotatedAnd // 각 단어별 정확한 매치만 포함
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
      ...rotatedRpc, // 정답이 없을 때만 사오정 추천 보여줌
      ...rotatedOr   // 정답이 없을 때만 부분 조각 보여줌
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

export default async function AppPage({ searchParams }: { searchParams: { q?: string }; }) {
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

  // 🌟 띄어쓰기를 완벽하게 무시하는 정규식 엔진
  const flexStr = noSpaceQuery.split('').map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s*');
  const exactFrontRegex = new RegExp(`^${flexStr}(?:\\s|\\(|\\)|\\[|\\]|,|:|\\.|$)`, 'i');
  const exactStandaloneRegex = new RegExp(`(?:^|\\s|\\(|\\)|\\[|\\])${flexStr}(?:\\s|\\(|\\)|\\[|\\]|,|:|\\.|$)`, 'i');

  promises.push(
    supabase.from('search_logs').select('keyword').order('created_at', { ascending: false }).limit(500)
      .then(({ data: logs }) => {
        if (logs && logs.length > 0) {
          const counts: Record<string, number> = {};
          logs.forEach(l => { counts[l.keyword] = (counts[l.keyword] || 0) + 1; });
          const uniqueRecents = Array.from(new Set(logs.map(l => l.keyword)));
          globalRecent = uniqueRecents.slice(0, 15).map(word => ({ word, count: counts[word] || 1 }));
          globalPopular = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(entry => entry[0]).slice(0, 20);
        }
      }).catch(() => {})
  );

  if (cleanQuery && noSpaceLen >= 2) {
    wordCount = cleanQuery.split(/\s+/).length;
    baseExtracted = extractKeywords(cleanQuery);

    // 1. VIP 전체 일치 검색 (띄어쓰기 여부 무시)
    const exactQueriesArray = [
      `line_text.eq.${cleanQuery}`, `line_text.ilike.${cleanQuery} %`, `line_text.ilike.${cleanQuery},%`, `line_text.ilike.% ${cleanQuery} %`, `line_text.ilike.% ${cleanQuery}`
    ];
    if (cleanQuery !== noSpaceQuery && noSpaceQuery.length >= 2) {
      exactQueriesArray.push(
        `line_text.eq.${noSpaceQuery}`, `line_text.ilike.${noSpaceQuery} %`, `line_text.ilike.${noSpaceQuery},%`, `line_text.ilike.% ${noSpaceQuery} %`, `line_text.ilike.% ${noSpaceQuery}`
      );
    }
    promises.push(
      supabase.from('dictionary_lines').select('*').or(exactQueriesArray.join(',')).limit(100)
        .then(({ data }) => { if (data) data.forEach(item => { item.is_exact_priority = true; addRes(item); }); }).catch(() => {})
    );

    // 2. RPC (일단 호출해두고 나중에 Rule에 따라 버릴지 결정)
    promises.push(
      supabase.rpc('search_dictionary_smart', { keyword: query }).then(({ data }) => { if (Array.isArray(data)) data.forEach(item => addRes({ ...item, is_rpc: true })); }).catch(() => {})
    );

    // 3. 기초영어 말뭉치 전용 검색
    promises.push(
      supabase.from('dictionary_lines').select('*').eq('category_id', 0).or(exactQueriesArray.join(',')).limit(30)
        .then(({ data }) => { if (data) data.forEach(addRes); }).catch(() => {})
    );

    // 4. [Rule 2] 두 단어 이상일 때 "각 단어별로 정확한(Exact) 결과만" 미리 챙겨둡니다.
    if (wordCount >= 2 && baseExtracted.length > 0) {
      const wordExactOrs: string[] = [];
      baseExtracted.forEach(w => {
        wordExactOrs.push(`line_text.eq.${w}`, `line_text.ilike.${w} %`, `line_text.ilike.% ${w} %`, `line_text.ilike.% ${w}`, `line_text.ilike.${w},%`);
      });
      if (wordExactOrs.length > 0) {
        promises.push(
          supabase.from('dictionary_lines').select('*').or(wordExactOrs.join(',')).limit(60)
            .then(({ data }) => { if (data) data.forEach(addRes); }).catch(() => {})
        );
      }

      let andQueryBuilder = supabase.from('dictionary_lines').select('*');
      baseExtracted.forEach(k => { andQueryBuilder = andQueryBuilder.ilike('line_text', `%${k}%`); });
      promises.push(
        andQueryBuilder.limit(50).then(({ data }) => { 
          if (data) { data.forEach(addRes); if (resultsMap.size === 0) { isPartialMatch = true; matchedKeywords = baseExtracted; } }
        }).catch(() => {})
      );
    }

    // 5. 쪼개기 검색 ("산화물자석" -> "산화물" + "자석")을 메인 검색으로 끌어올려 VIP를 찾아냅니다!
    let splitPairs: any[] = [];
    if (wordCount === 1 && cleanQuery.length >= 3 && cleanQuery.length <= 10 && /[가-힣]/.test(cleanQuery)) {
      const safeQuery = cleanQuery.replace(/[,.!?'"()\[\]]/g, '');
      for (let i = 2; i <= safeQuery.length - 2; i++) {
        splitPairs.push({ p1: safeQuery.slice(0, i), p2: safeQuery.slice(i) });
      }
      if (splitPairs.length > 0) {
        const andQueryStrs = splitPairs.map(pair => `and(line_text.ilike.%${pair.p1}%,line_text.ilike.%${pair.p2}%)`);
        promises.push(
          supabase.from('dictionary_lines').select('*').or(andQueryStrs.join(',')).limit(50)
            .then(({ data }) => { if (data) data.forEach(addRes); }).catch(() => {})
        );
      }
    }

    await Promise.all(promises);

    results = Array.from(resultsMap.values());

    // 🌟 [Rule 1 칼퇴근 판독기] 정답이 1개라도 있는지 검사!
    let hasExactMatch = false;
    for (const item of results) {
      const txt = (item.line_text || '').toLowerCase();
      if (item.is_exact_priority || exactFrontRegex.test(txt) || exactStandaloneRegex.test(txt)) {
        hasExactMatch = true;
        break;
      }
    }

    // 🌟 Rule 1 적용: 정답이 없을 때만(hasExactMatch == false) 역검색(OR)을 허용합니다!
    if (!hasExactMatch && results.length < 30) {
      const fallbackPromises: Promise<void>[] = [];
      let orKeywords = [...baseExtracted];

      const validOrKeywords = [...new Set(orKeywords)].filter(k => {
        if (/[가-힣]/.test(k) && k.length <= 1) return false; 
        if (wordCount >= 3 && /[가-힣]/.test(k) && k.length <= 2) return false; 
        return k.length >= 2;
      });

      // 🌟 [Rule 2 적용] 두 단어 이상 검색했을 땐 쓸데없는 부분일치(OR)를 돌리지 않습니다!
      if (validOrKeywords.length > 0 && wordCount === 1) {
        const orKeywordStrs = validOrKeywords.map(k => `line_text.ilike.%${k}%`).join(',');
        fallbackPromises.push(
          supabase.from('dictionary_lines').select('*').or(orKeywordStrs).limit(80)
            .then(({ data }) => { if (data) data.forEach(addRes); }).catch(() => {})
        );
      }

      if (wordCount === 1 && cleanQuery.length >= 2 && cleanQuery.length <= 4) {
        const spacedQuery = cleanQuery.split('').join('%');
        fallbackPromises.push(
          supabase.from('dictionary_lines').select('*').ilike('line_text', `%${spacedQuery}%`).limit(30)
            .then(({ data }) => {
              if (data && resultsMap.size === 0) { data.forEach(addRes); isPartialMatch = true; matchedKeywords = [cleanQuery]; orangeKeys.push(cleanQuery); }
            }).catch(() => {})
        );
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
      
      // 🌟 [파란색 물감 완벽 부활] 검색된 결과들을 쭉 훑으면서 영단어를 모조리 건져내 파란색으로 칠합니다!
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
        return !orangeKeys.some(o => o.toLowerCase() === b.toLowerCase()); 
      });

      results = rotateResults(results, cleanQuery, baseExtracted, flexStr);
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