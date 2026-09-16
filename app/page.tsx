// app/page.tsx
// ✅ 서버 로직 완벽! (영어 복합어 띄어쓰기 보정 + 3단어 이상 2글자 무시 버그 완벽 해결!)

import SearchPage from '@/components/SearchPage';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string; app?: string };
}): Promise<Metadata> {
  const query = (searchParams.q || '').toString().trim();

  if (query) {
    return {
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return {
    robots: {
      index: true,
      follow: true,
    },
  };
}

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
  'please',
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

const sortByRelevanceAndCategory = (list: any[]) => {
  return list.sort((a, b) => {
    const countA = a._matchCount || 0;
    const countB = b._matchCount || 0;
    if (countA !== countB) return countB - countA;

    const lenA = a._maxMatchedLen || 0;
    const lenB = b._maxMatchedLen || 0;
    if (lenA !== lenB) return lenB - lenA;

    const catA = a.category_id != null ? a.category_id : 12;
    const catB = b.category_id != null ? b.category_id : 12;
    if (catA !== catB) return catA - catB;
    
    return (a._db_index || 0) - (b._db_index || 0);
  });
};

// ============================================================
// 문장 관련 검색 결과 표시 정책
// ============================================================

const SENTENCE_RELATED_LIMIT = 20;

// 처음에는 다양한 카테고리의 상위 결과를 우선 선택합니다.
const SENTENCE_FIRST_STAGE_LIMIT = 8;
const SENTENCE_FIRST_STAGE_PER_CATEGORY = 3;

// 최종적으로 한 카테고리가 차지할 수 있는 최대 개수입니다.
const SENTENCE_FINAL_PER_CATEGORY = 5;

// 문장 검색에서 우선 보강할 중요 카테고리
// 1: 기본영어
// 2: 인문사회용어
// 10: 인문사회기타용어
const IMPORTANT_CATEGORY_TARGETS: Record<number, number> = {
  1: 5,
  2: 4,
  10: 3,
};

// ============================================================
// 단어·전문용어와 문장을 구분합니다.
// ============================================================

const isSentenceLikeQuery = (
  value: string
): boolean => {
  const text = String(value || '').trim();

  if (!text) {
    return false;
  }

  const hasKorean = /[가-힣]/.test(text);

  // ----------------------------------------------------------
  // 한국어 문장 판별
  // ----------------------------------------------------------
  if (hasKorean) {
    const cleanText = text
      .replace(/[.!?]+$/g, '')
      .trim();

    const wordCount = cleanText
      .split(/\s+/)
      .filter(Boolean)
      .length;

    const hasSentenceEnding =
      /(습니다|습니까|입니다|입니까|인가요|나요|까요|세요|해요|했어요|합니다|했다|한다|된다|됐다|이다|아니다|있다|없다|싶다|좋아해요|좋아하세요|주세요|줘요|할까요|합니까)$/u.test(
        cleanText
      );

    return (
      hasSentenceEnding ||
      (
        wordCount >= 2 &&
        /[?!]$/.test(text)
      )
    );
  }

  // ----------------------------------------------------------
  // 영어 문장 판별
  // ----------------------------------------------------------
  const englishWords =
    text.match(
      /[A-Za-z]+(?:['’-][A-Za-z]+)*/g
    ) || [];

  // sepsis, septic shock, blood pressure 등은
  // 단어·전문용어 검색으로 처리합니다.
  if (englishWords.length < 2) {
    return false;
  }

  const hasPredicate =
    /\b(am|is|are|was|were|be|been|being|do|does|did|have|has|had|can|could|will|would|shall|should|may|might|must|need|needs|want|wants|like|likes|liked|love|loves|know|knows|think|thinks|go|goes|went|come|comes|came|check|checks|show|shows|tell|tells|give|gives|take|takes|make|makes|find|finds|help|helps|thank|thanks|please|look|looks|wait|waits|try|tries|use|uses|work|works|live|lives|stay|stays|feel|feels|seem|seems|ask|asks|buy|buys|bring|brings|send|sends|call|calls|open|opens|close|closes|start|starts|finish|finishes|lose|loses|lost|throw|throws|throwing|ride|rides|riding)\b/i.test(
      text
    );

  const commonExpression =
    /^(thank you|thanks|thanks a lot|good morning|good afternoon|good evening|good night)[.!?]?$/i.test(
      text
    );

  const startsLikeSentence =
    /^(i|you|he|she|it|we|they|there|this|that|these|those|who|what|when|where|why|how|please|let's)\b/i.test(
      text
    );

  return (
    commonExpression ||
    hasPredicate ||
    (
      englishWords.length >= 3 &&
      startsLikeSentence &&
      /[.!?]$/.test(text)
    )
  );
};

// ============================================================
// 문장 관련 검색 결과를 최대 20건으로 정리합니다.
// ============================================================

const selectSentenceRelatedResults = (
  rankedResults: any[]
): any[] => {
  if (
    !Array.isArray(rankedResults) ||
    rankedResults.length === 0
  ) {
    return [];
  }

  // category_id 0은 번역 말뭉치 전용이므로
  // 관련 검색 결과에서는 제외합니다.
  const candidates = rankedResults.filter(
    (item) =>
      Number(item.category_id) !== 0
  );

  const selected: any[] = [];
  const selectedKeys = new Set<string>();

  const categoryCounts:
    Record<number, number> = {};

  const getResultKey = (
    item: any
  ): string => {
    if (
      item.id !== null &&
      item.id !== undefined
    ) {
      return String(item.id);
    }

    return [
      Number(item.category_id),
      String(item.line_text || ''),
    ].join('::');
  };

  const addResult = (
    item: any,
    categoryLimit:
      number = SENTENCE_FINAL_PER_CATEGORY
  ): boolean => {
    const categoryId =
      item.category_id !== null &&
      item.category_id !== undefined
        ? Number(item.category_id)
        : 12;

    if (categoryId === 0) {
      return false;
    }

    const key = getResultKey(item);

    if (selectedKeys.has(key)) {
      return false;
    }

    const currentCount =
      categoryCounts[categoryId] || 0;

    if (currentCount >= categoryLimit) {
      return false;
    }

    selected.push(item);
    selectedKeys.add(key);

    categoryCounts[categoryId] =
      currentCount + 1;

    return true;
  };

  // ----------------------------------------------------------
  // 1단계: 관련도가 높은 상위 8건
  // 카테고리당 최대 3건
  // ----------------------------------------------------------

  for (const item of candidates) {
    if (
      selected.length >=
      SENTENCE_FIRST_STAGE_LIMIT
    ) {
      break;
    }

    addResult(
      item,
      SENTENCE_FIRST_STAGE_PER_CATEGORY
    );
  }

  // ----------------------------------------------------------
  // 2단계: 중요 카테고리 보강
  // ----------------------------------------------------------

  const importantCategoryOrder = [
    1,
    2,
    10,
  ];

  for (
    const categoryId
    of importantCategoryOrder
  ) {
    const targetCount =
      IMPORTANT_CATEGORY_TARGETS[
        categoryId
      ] || 0;

    if (targetCount <= 0) {
      continue;
    }

    for (const item of candidates) {
      if (
        selected.length >=
        SENTENCE_RELATED_LIMIT
      ) {
        break;
      }

      if (
        Number(item.category_id) !==
        categoryId
      ) {
        continue;
      }

      const currentCount =
        categoryCounts[categoryId] || 0;

      if (currentCount >= targetCount) {
        break;
      }

      addResult(
        item,
        Math.min(
          targetCount,
          SENTENCE_FINAL_PER_CATEGORY
        )
      );
    }
  }

  // ----------------------------------------------------------
  // 3단계: 나머지를 관련도 순서로 최대 20건까지 채움
  // 최종 카테고리당 최대 5건
  // ----------------------------------------------------------

  for (const item of candidates) {
    if (
      selected.length >=
      SENTENCE_RELATED_LIMIT
    ) {
      break;
    }

    addResult(
      item,
      SENTENCE_FINAL_PER_CATEGORY
    );
  }

  return selected;
};

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
     const isEnglishOnly = /^[a-zA-Z0-9_\s\-]+$/.test(target);
     if (isEnglishOnly) {
         return new RegExp(`(?:^|[^a-zA-Z0-9_])${escapedTarget}(?=[^a-zA-Z0-9_]|$)`, 'i').test(text);
     }
     return new RegExp(`(?:^|[^가-힣a-zA-Z0-9_])${escapedTarget}(?:[^가-힣a-zA-Z0-9_]|$)`, 'i').test(text);
  };

  const isWordBoundary = (text: string, target: string) => {
     if (!target) return false;
     const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
     const isEnglishOnly = /^[a-zA-Z0-9_\s\-]+$/.test(target);
     if (isEnglishOnly) {
         return new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?=[^a-zA-Z0-9_]|$)`, 'i').test(text);
     }
     return new RegExp(`(?:^|[^가-힣a-zA-Z0-9_])${escaped}`, 'i').test(text);
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
    } else {
      let hasAll = true;
      let hasBoundary = false;
      let matchCount = 0;
      let maxMatchedLen = 0;

      if (allSearchKeywords.length > 0) {
        for (const k of allSearchKeywords) {
          if (textNoSpace.includes(k.toLowerCase())) {
            matchCount++;
            if (isWordBoundary(textOriginal, k.toLowerCase())) { 
              hasBoundary = true; 
              if (k.length > maxMatchedLen) maxMatchedLen = k.length;
            }
          } else { 
            hasAll = false; 
          }
        }
      } else { hasAll = false; }

      item._matchCount = matchCount;
      item._maxMatchedLen = maxMatchedLen;

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
    // Exact 또는 강한 일치 결과
    ...sortByCategory(corpusSuperTight),
    ...sortByCategory(dictSuperTight),
    ...sortByCategory(corpusStandalone),
    ...sortByCategory(dictStandalone),

    // 검색어 전체가 포함된 관련 결과
    ...sortByCategory(dictPartialMatch),
    ...sortByCategory(corpusPartialMatch),
    ...sortByRelevanceAndCategory(
      andMatchesBoundary
    ),
    ...sortByRelevanceAndCategory(
      andMatchesPartial
    ),

    // Exact Match가 있더라도 일부 핵심어가 포함된
    // 관련 자료를 추가 정보로 제공합니다.
    ...sortByRelevanceAndCategory(
      orMatchesBoundary
    ),
    ...sortByRelevanceAndCategory(
      orMatchesPartial
    ),
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
      ...sortByRelevanceAndCategory(andMatchesBoundary),
      ...sortByRelevanceAndCategory(andMatchesPartial),
      ...combinedPartialSplit, 
      ...sortByRelevanceAndCategory(orMatchesBoundary),  
      ...sortByRelevanceAndCategory(orMatchesPartial)    
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

const getExactQueries = (word: string) => {
  const w = word.replace(/[,.()\[\]:"']/g, '').trim(); 
  return [
    `line_text.eq."${w}"`,
    `line_text.ilike."${w} *"`,
    `line_text.ilike."* ${w} *"`,
    `line_text.ilike."* ${w}"`
  ].join(',');
};


// ============================================================
// ☆ TwoPro DB Select Shadow v1
// - 기존 검색 결과/정렬/화면은 변경하지 않습니다.
// - 추가 DB 호출 없이 현재 후보군만 별도 점수로 비교합니다.
// ============================================================
type TwoProDbShadowTokenV1 = {
  surface: string;
  alternatives: string[];
  rankingWeight: number;
  retrievalWeight: number;
  role: string;
  index: number;
};

const TWO_PRO_SHADOW_LOW_SUBJECTS_V1 = new Set([
  '나는', '저는', '내가', '제가', '나를', '저를', '너는', '네가', '너를',
  '당신은', '당신이', '당신을', '그는', '그가', '그를', '그녀는', '그녀가',
  '그녀를', '우리는', '우리가', '우리를', '그들은', '그들이', '그들을',
]);

const TWO_PRO_SHADOW_LOW_RECIPIENTS_V1 = new Set([
  '나에게', '저에게', '너에게', '당신에게', '그에게', '그녀에게',
  '우리에게', '그들에게', '나한테', '저한테', '너한테', '그한테',
  '그녀한테', '우리한테', '그들한테',
]);

const twoProNormalizeDbShadowV1 = (value: string): string =>
  String(value || '')
    .normalize('NFC')
    .replace(/^[\s.,:;!?()[\]{}"'“”‘’]+|[\s.,:;!?()[\]{}"'“”‘’]+$/g, '')
    .trim();

const twoProBuildDbShadowProfilesV1 = (queryText: string): TwoProDbShadowTokenV1[] => {
  const tokens = String(queryText || '')
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/\s+/)
    .map(twoProNormalizeDbShadowV1)
    .filter(Boolean);

  return tokens.map((surface, index) => {
    const lower = surface.toLocaleLowerCase();
    const hasKorean = /[가-힣]/u.test(surface);
    const next = tokens[index + 1] || '';
    let rankingWeight = 3.0;
    let retrievalWeight = 4.0;
    let role = 'CONTENT';

    if (hasKorean) {
      if (TWO_PRO_SHADOW_LOW_SUBJECTS_V1.has(surface)) {
        rankingWeight = 0.5; retrievalWeight = 0.2; role = 'LOW_SUBJECT_PRONOUN';
      } else if (TWO_PRO_SHADOW_LOW_RECIPIENTS_V1.has(surface)) {
        rankingWeight = 1.3; retrievalWeight = 0.7; role = 'LOW_RECIPIENT_PRONOUN';
      } else if (/(않|못|아니|없)/u.test(surface)) {
        rankingWeight = 4.5; retrievalWeight = 3.8; role = 'NEGATION_TAM';
      } else if (/지$/u.test(surface) && /^(?:않|못)/u.test(next)) {
        rankingWeight = 4.2; retrievalWeight = 4.5; role = 'NEGATION_PREDICATE';
      } else if (/(?:라고|다고|자고|냐고)/u.test(surface)) {
        rankingWeight = 4.3; retrievalWeight = 4.8; role = 'QUOTED_OR_COMMAND_PREDICATE';
      } else if (/(?:을|를)$/u.test(surface)) {
        rankingWeight = 3.8; retrievalWeight = 4.4; role = 'OBJECT_CONTENT';
      } else if (/(?:해요|합니다|했어요|했죠|한다|했다|말해요|말합니다|말했어요|가요|갔어요|와요|왔어요|줘요|주세요|됩니다|됐어요|있어요|없어요)$/u.test(surface)) {
        rankingWeight = 4.0; retrievalWeight = 4.6; role = 'MAIN_PREDICATE';
      }
    } else if (eStopWords.has(lower)) {
      rankingWeight = 0.5; retrievalWeight = 0.2; role = 'LOW_ENGLISH_FUNCTION';
    } else if (/^(?:not|never|no|without)$/i.test(surface)) {
      rankingWeight = 4.5; retrievalWeight = 3.8; role = 'NEGATION_TAM';
    } else {
      rankingWeight = 3.4; retrievalWeight = 4.2; role = 'ENGLISH_CONTENT';
    }

    const alternatives = new Set<string>([surface]);
    if (hasKorean) {
      const cleaned = twoProNormalizeDbShadowV1(cleanKoreanKeyword(surface));
      if (cleaned && cleaned !== surface && !/^[가-힣]$/u.test(cleaned)) alternatives.add(cleaned);
    } else if (irregulars[lower]?.length >= 2) {
      alternatives.add(irregulars[lower]);
    }

    return { surface, alternatives: [...alternatives], rankingWeight, retrievalWeight, role, index };
  });
};

const twoProEvaluateDbShadowV1 = (queryText: string, candidateResults: any[]) => {
  const profiles = twoProBuildDbShadowProfilesV1(queryText);
  const coreProfiles = profiles.filter((p) => p.retrievalWeight >= 3.5);
  const shadowKeywords = [...coreProfiles]
    .sort((a, b) => b.retrievalWeight - a.retrievalWeight || a.index - b.index)
    .map((p) => p.surface)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 4);

  const phraseUnits = profiles.slice(0, -1)
    .map((p, i) => p.rankingWeight >= 3 && profiles[i + 1]?.rankingWeight >= 3
      ? `${p.surface} ${profiles[i + 1].surface}` : '')
    .filter(Boolean);

  const totalWeight = Math.max(
    profiles.reduce((sum, p) => sum + p.rankingWeight, 0),
    1
  );

  const scored = (Array.isArray(candidateResults) ? candidateResults : []).map((item, originalIndex) => {
    const text = String(item?.line_text || '').normalize('NFC').replace(/\s+/g, ' ').trim();
    const lowerText = text.toLocaleLowerCase();
    const matched = profiles.filter((p) => p.alternatives.some((alt) => {
      const key = twoProNormalizeDbShadowV1(alt).toLocaleLowerCase();
      return Boolean(key) && lowerText.includes(key);
    }));
    const matchedWeight = matched.reduce((sum, p) => sum + p.rankingWeight, 0);
    const distinctCoreMatches = matched.filter((p) => p.rankingWeight >= 3).length;
    const coverage = matchedWeight / totalWeight;
    const phraseMatches = phraseUnits.filter((phrase) => lowerText.includes(phrase.toLocaleLowerCase()));
    const score = matchedWeight + coverage * 4
      + (distinctCoreMatches >= 2 ? (distinctCoreMatches - 1) * 3 : 0)
      + Math.min(phraseMatches.length, 2) * 2
      - (coreProfiles.length >= 2 && distinctCoreMatches === 1 ? 1.5 : 0);
    return {
      item, originalIndex, score, coverage, distinctCoreMatches,
      matchedTokens: matched.map((p) => p.surface), phraseMatches,
    };
  }).sort((a, b) =>
    b.score - a.score ||
    b.distinctCoreMatches - a.distinctCoreMatches ||
    b.coverage - a.coverage ||
    a.originalIndex - b.originalIndex
  );

  const missingCoreKeywords = coreProfiles
    .filter((p) => !scored.some((entry) => entry.matchedTokens.includes(p.surface)))
    .map((p) => p.surface);

  return { profiles, shadowKeywords, phraseUnits, scored, missingCoreKeywords };
};

// ============================================================
// ☆ TwoPro DB Select Shadow v3
// - 개발 환경(localhost)에서만 추가 DB probe를 실행합니다.
// - 실제 results/resultsMap/화면에는 절대 합치지 않습니다.
// - 짧은 단독어가 아니라 인접 핵심정보를 묶은 anchor만 조회합니다.
// - compact length 3도 허용하여 "문을 열" 같은 고정보다 넓은 활용형 anchor를 시험합니다.
//   예: "문을 열", "열라고 말", "기다리라고 말", "말하지 않"
// ============================================================
type TwoProDbShadowAnchorV2 = {
  text: string;
  weight: number;
  left: string;
  right: string;
};

const twoProRightAnchorFormV2 = (
  profile: TwoProDbShadowTokenV1
): string => {
  const surface = twoProNormalizeDbShadowV1(profile.surface);

  if (!surface) return '';

  if (/[가-힣]/u.test(surface)) {
    if (profile.role === 'QUOTED_OR_COMMAND_PREDICATE') {
      const stem = surface
        .replace(/(?:으라고|라고|다고|자고|냐고)$/u, '')
        .trim();
      return stem || surface;
    }

    if (profile.role === 'MAIN_PREDICATE') {
      const stem = surface
        .replace(
          /(?:했어요|했죠|합니다|해요|한다|했다)$/u,
          ''
        )
        .trim();
      return stem || surface;
    }

    if (profile.role === 'NEGATION_TAM') {
      if (/^않/u.test(surface)) return '않';
      if (/^못/u.test(surface)) return '못';
      if (/^없/u.test(surface)) return '없';
      if (/^아니/u.test(surface)) return '아니';
    }
  }

  return surface;
};

const twoProBuildDbShadowAnchorsV2 = (
  profiles: TwoProDbShadowTokenV1[]
): TwoProDbShadowAnchorV2[] => {
  const anchors: TwoProDbShadowAnchorV2[] = [];

  for (let index = 0; index < profiles.length - 1; index += 1) {
    const left = profiles[index];
    const right = profiles[index + 1];

    // 낮은 정보량 주어/대명사가 포함된 pair는 probe하지 않습니다.
    if (
      left.retrievalWeight < 3.5 ||
      right.retrievalWeight < 3.5
    ) {
      continue;
    }

    const leftText = twoProNormalizeDbShadowV1(left.surface);
    const rightText = twoProRightAnchorFormV2(right);

    if (!leftText || !rightText) {
      continue;
    }

    const anchorText = `${leftText} ${rightText}`
      .replace(/\s+/g, ' ')
      .trim();

    // 단독 1~2글자 검색은 피하되, "문을 열"처럼 전체 anchor가
    // 3글자 이상이면 의미 결합이 충분하므로 local Shadow probe를 허용합니다.
    const compactLength = anchorText
      .replace(/\s+/g, '')
      .length;

    if (compactLength < 3) {
      continue;
    }

    anchors.push({
      text: anchorText,
      weight:
        left.retrievalWeight +
        right.retrievalWeight,
      left: left.surface,
      right: right.surface,
    });
  }

  const unique = new Map<string, TwoProDbShadowAnchorV2>();

  for (const anchor of anchors) {
    const key = anchor.text.toLocaleLowerCase();

    if (
      !unique.has(key) ||
      (unique.get(key)?.weight || 0) < anchor.weight
    ) {
      unique.set(key, anchor);
    }
  }

  return [...unique.values()]
    .sort(
      (a, b) =>
        b.weight - a.weight ||
        b.text.length - a.text.length
    )
    .slice(0, 2);
};

export default async function Page({ searchParams }: { searchParams: { q?: string; app?: string }; }) {
  const query = (searchParams.q || '').toString();
  const cleanQuery = query.trim();
  const noSpaceLen = cleanQuery.replace(/\s+/g, '').length;
  const noSpaceQuery = cleanQuery.replace(/\s+/g, '');

// 문장 검색인지 단어 검색인지 서버에서 판단
const isSentenceSearch =
  isSentenceLikeQuery(cleanQuery);

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
  let allSearchKeywords: string[] = []; 
  // Shadow 전용: 실제 fallback에서 선택된 핵심어를 기록만 합니다.
  let twoProCurrentRelatedSearchKeywordsShadowV1: string[] = [];

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
    
    const rawTokens = cleanQuery.split(/\s+/).map(t => t.replace(/[.,?!]/g, ''));
    allSearchKeywords = [...new Set([...baseExtracted, ...rawTokens])].filter(k => {
       const lowerK = k.toLowerCase();
       if (eStopWords.has(lowerK) || kStopWords.has(lowerK)) return false; 
       return k.length >= 2 || /[가-힣]/.test(k);
    });

    if (wordCount === 1 && cleanQuery.length >= 3 && cleanQuery.length <= 25) {
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

    const fetchExactPhrase = async (qStr: string, isExactPriority: boolean = false) => {
        if (!qStr) return;
        const queries = [
            supabase.from('dictionary_lines').select('*').eq('line_text', qStr).limit(10),
            supabase.from('dictionary_lines').select('*').ilike('line_text', `${qStr} %`).limit(20),
            supabase.from('dictionary_lines').select('*').ilike('line_text', `% ${qStr} %`).limit(30),
            supabase.from('dictionary_lines').select('*').ilike('line_text', `% ${qStr}`).limit(20),
            supabase.from('dictionary_lines').select('*').ilike('line_text', `% ${qStr}.%`).limit(10),
            supabase.from('dictionary_lines').select('*').ilike('line_text', `% ${qStr},%`).limit(10),
            supabase.from('dictionary_lines').select('*').ilike('line_text', `% ${qStr}?%`).limit(10),
            supabase.from('dictionary_lines').select('*').ilike('line_text', `% ${qStr}!%`).limit(10)
        ];
        
        const res = await Promise.all(queries.map(async (p) => {
            try {
                return await p;
            } catch (err) {
                return { data: [] };
            }
        }));
        
        res.forEach(r => {
            if (r && r.data) {
                r.data.forEach((item: any) => {
                    if (isExactPriority) item.is_exact_priority = true;
                    addRes(item);
                });
            }
        });
    };

    promises.push(fetchExactPhrase(safeExactQuery, true));
    
    if (safeExactQuery !== safeNoSpaceQuery && safeNoSpaceQuery.length >= 2) {
      promises.push(fetchExactPhrase(safeNoSpaceQuery, true));
    }

    if (wordCount === 1 && cleanQuery.length >= 3 && cleanQuery.length <= 25) {
      const safeQuery = cleanQuery.replace(/[,.!?'"()\[\]]/g, '');
      let splitPairs: any[] = [];
      for (let i = 1; i < safeQuery.length; i++) {
        splitPairs.push({ p1: safeQuery.slice(0, i), p2: safeQuery.slice(i) });
      }
      
      splitPairs.forEach(pair => {
         const spaceCorrected = `${pair.p1} ${pair.p2}`;
         promises.push(fetchExactPhrase(spaceCorrected, true));
      });

      const validPairs = splitPairs.filter(p => p.p1.length >= 2 && p.p2.length >= 2);
      if (validPairs.length > 0) {
         bestSplit = validPairs.reduce((prev, curr) => Math.abs(curr.p1.length - curr.p2.length) < Math.abs(prev.p1.length - prev.p2.length) ? curr : prev);
      } else if (splitPairs.length > 0) {
         bestSplit = splitPairs.reduce((prev, curr) => Math.abs(curr.p1.length - curr.p2.length) < Math.abs(prev.p1.length - prev.p2.length) ? curr : prev);
      }
    }

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

    if ((!hasExactMatch || results.length < 20) && results.length < 50) {
      const fallbackPromises: Promise<void>[] = [];
      
      if (wordCount === 1 && bestSplit) {
        isSplitModeActive = true; 
        
        fallbackPromises.push(fetchExactPhrase(bestSplit!.p1, false));
        fallbackPromises.push(fetchExactPhrase(bestSplit!.p2, false));

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
           // 🌟 [수프로 변경점] 3단어 이상일 때 2글자 단어 무시 버그 완벽 삭제! (이제 "빠른 회신 감사" 정상 작동!)
           return k.length >= 2;
         });

         if (validOrKeywords.length > 0) {
           matchedKeywords = validOrKeywords;
           
           const orangeCandidates = validOrKeywords.filter(k => {
              const lowerK = k.toLowerCase();
              return !eStopWords.has(lowerK) && !kStopWords.has(lowerK);
           });
           orangeKeys.push(...orangeCandidates);

// =====================================================
// 문장 검색용 관련 핵심어 선정
// =====================================================
// 너무 흔한 표현은 제외하고, 의미가 강한 단어부터
// 최대 4개까지만 관련 검색에 사용합니다.
const relatedSearchKeywords = [
  ...new Set(validOrKeywords)
]
  .filter((keyword) => {
    const cleanKeyword = keyword
      .replace(/[,.()\[\]:"']/g, '')
      .trim();

    if (!cleanKeyword) {
      return false;
    }

    const lowerKeyword =
      cleanKeyword.toLowerCase();

    // 정중 표현은 관련 용어 검색에서 제외
    if (
      lowerKeyword === 'please'
    ) {
      return false;
    }

    const isEnglishKeyword =
      /^[a-zA-Z0-9_\s\-]+$/.test(
        cleanKeyword
      );

    // 영어는 3글자 이상, 한국어는 2글자 이상
    return isEnglishKeyword
      ? cleanKeyword.length >= 3
      : cleanKeyword.length >= 2;
  })
  // 긴 핵심어를 우선 검색
  .sort((a, b) => b.length - a.length)
  .slice(0, 4);

// 실제 검색에는 그대로 relatedSearchKeywords를 사용합니다.
twoProCurrentRelatedSearchKeywordsShadowV1 = [...relatedSearchKeywords];

relatedSearchKeywords.forEach((keyword) => {
  const cleanK = keyword
    .replace(/[,.()\[\]:"']/g, '')
    .trim();

  if (!cleanK) {
    return;
  }

  // 기존의 단어 경계 중심 검색도 유지합니다.
  fallbackPromises.push(
    fetchExactPhrase(cleanK, false)
  );

  // ===================================================
  // 영어·한국어 공통 관련 문장 검색
  // ===================================================
  // category_id 0은 번역 말뭉치 전용이므로
  // 관련 검색 결과에는 포함하지 않습니다.
  fallbackPromises.push((async () => {
    try {
      const { data, error } = await supabase
        .from('dictionary_lines')
        .select('*')
        .neq('category_id', 0)
        .ilike(
          'line_text',
          `%${cleanK}%`
        )
        .order('category_id', {
          ascending: true,
        })
        .limit(30);

      if (error) {
        console.error(
          '[관련 핵심어 검색 오류]',
          {
            query: cleanQuery,
            keyword: cleanK,
            message: error.message,
          }
        );

        return;
      }

      if (Array.isArray(data)) {
        data.forEach((item) => {
          addRes(item);
        });
      }
    } catch (error) {
      console.error(
        '[관련 핵심어 검색 예외]',
        {
          query: cleanQuery,
          keyword: cleanK,
          error,
        }
      );
    }
  })());
});
         }
      }

      if (fallbackPromises.length > 0) {
          await Promise.all(fallbackPromises);
          results = Array.from(resultsMap.values());
          
          let foundExactInFallback = false;
          const lowerNoSpace = noSpaceQuery.toLowerCase();
          for (const item of results) {
            const textNoSpace = (item.line_text || '').toLowerCase().replace(/\s+/g, '');
            if (item.is_exact_priority || textNoSpace.includes(lowerNoSpace)) {
              foundExactInFallback = true;
              break;
            }
          }

          if (!hasExactMatch && !foundExactInFallback && matchedKeywords.length > 0) {
              isPartialMatch = true;
          } else {
              isPartialMatch = false; 
          }
      }
    }

    if (hasExactMatch) {
      isPartialMatch = false;
    }

    if (results.length > 0) {
      const cleanQueryNoSpace = cleanQuery.replace(/[\s\-_]/g, '').toLowerCase();
      const allOriginalWords = cleanQuery.split(/\s+/).map(w => w.replace(/[.,:;()\[\]?!]/g, '')).filter(w => w.length > 0);
      
      allOriginalWords.forEach(w => {
         const lowerW = w.toLowerCase();
         if ((w.length > 1 || !/[가-힣]/.test(w)) && !eStopWords.has(lowerW) && !kStopWords.has(lowerW)) {
             orangeKeys.push(w);
         }
      });
      orangeKeys.push(...allSearchKeywords.filter(k => !eStopWords.has(k.toLowerCase()) && !kStopWords.has(k.toLowerCase())));
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

      orangeKeys = [...new Set(orangeKeys)].filter((w) => {
          if (!w || !w.trim()) return false;
          const lowerW = w.trim().toLowerCase();
          return !eStopWords.has(lowerW) && !kStopWords.has(lowerW);
      });
      
      let isSplitModeActive = !!bestSplit;
      results = rotateResults(results, cleanQuery, allSearchKeywords, flexStr, isSplitModeActive);
// 문장 검색은 관련 검색 결과를
// 중요 카테고리와 다양성을 고려해 최대 20건으로 정리합니다.
if (isSentenceSearch) {
  // ------------------------------------------------------------
  // Shadow v1: 현재 후보군만 분석 (실제 화면 영향 없음)
  // ------------------------------------------------------------
  const shadow = twoProEvaluateDbShadowV1(
    cleanQuery,
    results
  );

  const currentSelected =
    selectSentenceRelatedResults(results);

  // ------------------------------------------------------------
  // Shadow v3: localhost 개발 환경에서만 "핵심 anchor" 2개 probe
  //
  // 중요:
  // - production build / Vercel에서는 실행하지 않습니다.
  // - probe 결과는 results/resultsMap에 절대 addRes 하지 않습니다.
  // - 사용자 화면은 currentSelected를 그대로 사용합니다.
  // ------------------------------------------------------------
  const shadowProbeEnabledV2 =
    process.env.NODE_ENV !== 'production';

  const shadowAnchorsV2 =
    twoProBuildDbShadowAnchorsV2(
      shadow.profiles
    );

  const shadowProbeRowsV2: any[] = [];
  const shadowProbeStatsV2: Array<{
    anchor: string;
    elapsedMs: number;
    resultCount: number;
    error: string | null;
  }> = [];

  if (
    shadowProbeEnabledV2 &&
    shadowAnchorsV2.length > 0
  ) {
    for (const anchor of shadowAnchorsV2) {
      const startedAt = Date.now();

      try {
        const { data, error } = await supabase
          .from('dictionary_lines')
          .select('*')
          .neq('category_id', 0)
          .ilike(
            'line_text',
            `%${anchor.text}%`
          )
          .limit(30);

        const rows =
          Array.isArray(data)
            ? data
            : [];

        shadowProbeStatsV2.push({
          anchor: anchor.text,
          elapsedMs:
            Date.now() - startedAt,
          resultCount: rows.length,
          error:
            error?.message || null,
        });

        if (!error) {
          for (const row of rows) {
            shadowProbeRowsV2.push(row);
          }
        }
      } catch (error: any) {
        shadowProbeStatsV2.push({
          anchor: anchor.text,
          elapsedMs:
            Date.now() - startedAt,
          resultCount: 0,
          error:
            String(
              error?.message ||
              error ||
              'unknown shadow probe error'
            ),
        });
      }
    }
  }

  // current 후보 + shadow probe 후보를 별도 Map으로만 병합합니다.
  // 실제 results에는 합치지 않습니다.
  const shadowMergedMapV2 =
    new Map<string, any>();

  const addShadowOnlyV2 = (
    item: any
  ) => {
    const key =
      item?.id !== null &&
      item?.id !== undefined
        ? String(item.id)
        : [
            Number(item?.category_id ?? 12),
            String(item?.line_text || ''),
          ].join('::');

    if (!shadowMergedMapV2.has(key)) {
      shadowMergedMapV2.set(key, item);
    }
  };

  // Insight/관련 검색 결과에서 category 0은 표시하지 않으므로
  // v2 비교도 같은 조건으로 맞춥니다.
  results
    .filter(
      (item) =>
        Number(item?.category_id) !== 0
    )
    .forEach(addShadowOnlyV2);

  shadowProbeRowsV2
    .filter(
      (item) =>
        Number(item?.category_id) !== 0
    )
    .forEach(addShadowOnlyV2);

  const shadowAfterProbeV2 =
    twoProEvaluateDbShadowV1(
      cleanQuery,
      Array.from(
        shadowMergedMapV2.values()
      )
    );

  console.log(
    '[X-DIC DB Select Shadow v3]',
    {
      query: cleanQuery,
      shadowOnly: true,
      userVisibleEffect: false,
      productionDbProbe: false,
      localShadowDbProbe:
        shadowProbeEnabledV2,
      anchorMinCompactLength: 3,
      candidateCountBeforeSentenceSelect:
        results.length,
      currentFallbackKeywords:
        twoProCurrentRelatedSearchKeywordsShadowV1,
      shadowKeywords:
        shadow.shadowKeywords,
      tokenProfiles:
        shadow.profiles.map((p) => ({
          token: p.surface,
          role: p.role,
          rankingWeight:
            p.rankingWeight,
          retrievalWeight:
            p.retrievalWeight,
          alternatives:
            p.alternatives,
        })),
      phraseUnits:
        shadow.phraseUnits,
      missingCoreKeywordsBeforeProbe:
        shadow.missingCoreKeywords,
      shadowAnchors:
        shadowAnchorsV2,
      shadowProbeStats:
        shadowProbeStatsV2,
      shadowProbeUniqueRows:
        new Set(
          shadowProbeRowsV2.map(
            (item) =>
              String(
                item?.id ??
                item?.line_text ??
                ''
              )
          )
        ).size,
      missingCoreKeywordsAfterProbe:
        shadowAfterProbeV2
          .missingCoreKeywords,
      currentSelectedTop5:
        currentSelected
          .slice(0, 5)
          .map((item) => ({
            categoryId:
              item?.category_id,
            text:
              String(
                item?.line_text || ''
              ),
          })),
      shadowTop8AfterProbe:
        shadowAfterProbeV2.scored
          .slice(0, 8)
          .map((entry) => ({
            categoryId:
              entry.item?.category_id,
            text:
              String(
                entry.item?.line_text || ''
              ),
            score:
              Number(
                entry.score.toFixed(3)
              ),
            coverage:
              Number(
                entry.coverage.toFixed(3)
              ),
            distinctCoreMatches:
              entry.distinctCoreMatches,
            matchedTokens:
              entry.matchedTokens,
            phraseMatches:
              entry.phraseMatches,
          })),
    }
  );

  // 실제 사용자 화면은 기존 선택 결과를 그대로 사용합니다.
  results = currentSelected;
}
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
      isSentenceSearch={isSentenceSearch}
    />
  );
}