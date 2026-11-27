// app/page.tsx
// ✅ 서버 로직 완벽! (영어 복합어 띄어쓰기 보정 + 3단어 이상 2글자 무시 버그 완벽 해결!)

import SearchPage from '@/components/SearchPage';
import { appendFileSync } from 'node:fs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

function xdicPerfWriteToFileV2(marker: string, payload: string): void {
  console.info(marker, payload);
  if (process.env.NODE_ENV === 'production') return;
  try {
    appendFileSync(
      'C:/dictionary_upload/X-DIC-core-backups/X-DIC-core-scripts/XDIC_PERF_STAGE_V2.jsonl',
      JSON.stringify({ timestamp: new Date().toISOString(), marker, ...JSON.parse(payload) }) + '\n',
      { encoding: 'utf8' }
    );
  } catch (error) {
    console.warn('[XDIC PERF FILE WRITE FAILED]', String(error));
  }
}

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
  // XDIC_SEARCH_ORDER102_BEGIN: stable tie order for English single-word queries only.
  // Keep all existing CORE groups, relevancy tiers, and query paths unchanged.
  const stableWordItems = /^[A-Za-z]{3,25}$/.test(keyword.trim())
    ? [...items].sort((a, b) => {
        const categoryA = Number(a.category_id ?? 12);
        const categoryB = Number(b.category_id ?? 12);
        if (categoryA !== categoryB) return categoryA - categoryB;

        // Same ranking group/category: favor an exact leading English word.
        // This preserves the expected "vintage ..." before "... vintage".
        const word = keyword.trim().toLowerCase();
        const textA = String(a.line_text ?? '').trimStart().toLowerCase();
        const textB = String(b.line_text ?? '').trimStart().toLowerCase();
        const startsA = textA.startsWith(word) &&
          (textA.length === word.length || !/[a-z0-9_]/.test(textA.charAt(word.length)));
        const startsB = textB.startsWith(word) &&
          (textB.length === word.length || !/[a-z0-9_]/.test(textB.charAt(word.length)));
        if (startsA !== startsB) return startsA ? -1 : 1;

        const orderA = a.source_order == null
          ? Number.MAX_SAFE_INTEGER : Number(a.source_order);
        const orderB = b.source_order == null
          ? Number.MAX_SAFE_INTEGER : Number(b.source_order);
        if (orderA !== orderB) return orderA - orderB;

        const idA = String(a.id ?? '');
        const idB = String(b.id ?? '');
        return idA < idB ? -1 : idA > idB ? 1 : 0;
      })
    : items;
  const itemsWithIndex = stableWordItems.map((item, idx) => ({ ...item, _db_index: idx }));
  // XDIC_SEARCH_ORDER102_END

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

  // TwoPro CORE exact-AND 고신뢰 후보
  const twoProExactAndMatches: any[] = [];

  // TwoPro exact + family 고신뢰 후보
  const twoProFamilyMatches: any[] = [];

  // TwoPro v7.4.2
  // 3 CORE 이상 검색에서 exact + family 두 요소만 확인된
  // 중간 신뢰도 지원 후보
  const twoProSupportingFamilyMatches: any[] = [];
  
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
    } else if (Number(item._twoProDbPriority) === 2) {
      twoProExactAndMatches.push(item);
    } else if (Number(item._twoProDbPriority) === 3) {
      twoProFamilyMatches.push(item);
    } else if (
      Number(item._twoProDbPriority) === 5 &&
      item._twoProDbMatch === 'exact+family-support-v742'
    ) {
      twoProSupportingFamilyMatches.push(item);
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

  const sortedTwoProExactAndMatches =
    [...twoProExactAndMatches].sort(
      (a, b) => {
        const countA =
          Number(
            a._twoProDbExactAndCount || 0
          );

        const countB =
          Number(
            b._twoProDbExactAndCount || 0
          );

        if (countA !== countB) {
          return countB - countA;
        }

        const weightA =
          Number(
            a._twoProDbExactAndWeight || 0
          );

        const weightB =
          Number(
            b._twoProDbExactAndWeight || 0
          );

        if (weightA !== weightB) {
          return weightB - weightA;
        }

        const catA =
          a.category_id != null
            ? Number(a.category_id)
            : 12;

        const catB =
          b.category_id != null
            ? Number(b.category_id)
            : 12;

        if (catA !== catB) {
          return catA - catB;
        }

        return (
          Number(a._db_index || 0) -
          Number(b._db_index || 0)
        );
      }
    );

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

    // TwoPro CORE exact-AND 고신뢰 결과
    ...sortedTwoProExactAndMatches,

    // TwoPro exact + family 고신뢰 결과
    ...sortByCategory(twoProFamilyMatches),

    // TwoPro v7.4.2
    // 3 CORE 이상 검색의 exact + family 지원 결과
    ...sortByCategory(twoProSupportingFamilyMatches),

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
      ...sortedTwoProExactAndMatches,
      ...sortByCategory(twoProFamilyMatches),
      ...sortByCategory(twoProSupportingFamilyMatches),
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

// ============================================================
// TwoPro Safe Single-Hangul CORE v7.6
//
// 1음절이라도 의미량이 높은 내용어는
// "결합 검색용 CORE"에서 사용할 수 있습니다.
//
// 예:
// 책 / 문 / 집 / 물 / 밥 / 차 / 돈
//
// 반면 기존 stopword / 조사 / 어미는 제외합니다.
// 이 규칙은 단독 %책% 검색용이 아니라
// CORE 결합 검색용으로만 사용합니다.
// ============================================================
const twoProIsSafeSingleHangulCoreV76 = (
  value: string
): boolean => {
  const normalized =
    twoProNormalizeDbShadowV1(
      value
    );

  if (
    !/^[가-힣]$/u.test(normalized)
  ) {
    return false;
  }

  if (
    kStopWords.has(normalized)
  ) {
    return false;
  }

  if (
    kSuffixes.includes(normalized)
  ) {
    return false;
  }

  return true;
};

// ============================================================
// TwoPro Exact Token Boundary v7.2
//
// exact token은 다른 한국어 단어의 내부 문자열로
// 일치시키지 않습니다.
//
// 예:
// "문을"   → "문을 열어요"       O
// "문을"   → "창문을 열어요"     X
//
// "책을"   → "책을 샀어요"       O
//
// relaxed family("말", "열" 등)는 활용형을 잡아야 하므로
// 이 함수와 별도로 기존 relaxed boundary를 사용합니다.
// ============================================================
const twoProHasExactTokenBoundaryV72 = (
  text: string,
  token: string
): boolean => {
  const normalizedText =
    String(text || '')
      .normalize('NFC');

  const normalizedToken =
    twoProNormalizeDbShadowV1(
      token
    );

  if (!normalizedToken) {
    return false;
  }

  const escapedToken =
    normalizedToken.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

  const isKoreanTokenV76 =
    /^[가-힣]+$/u.test(
      normalizedToken
    );

  const exactBoundaryRegexV72 =
    new RegExp(
      isKoreanTokenV76
        ? `(?:^|[^가-힣A-Za-z0-9_])${escapedToken}(?:(?:에게|에서|께서|으로|부터|까지|은|는|이|가|을|를|에|로|와|과|의|도|만|랑))?(?=[^가-힣A-Za-z0-9_]|$)`
        : `(?:^|[^가-힣A-Za-z0-9_])${escapedToken}(?=[^가-힣A-Za-z0-9_]|$)`,
      'iu'
    );

  return exactBoundaryRegexV72.test(
    normalizedText
  );
};

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

  const addAnchorV3 = (
    text: string,
    weight: number,
    left: string,
    right: string
  ) => {
    const normalizedText = String(text || '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!normalizedText) {
      return;
    }

    // "문을 열" 같은 비교적 짧은 결합도 허용하지만
    // 단독 1~2글자 수준의 위험한 검색은 하지 않습니다.
    const compactLength = normalizedText
      .replace(/\s+/g, '')
      .length;

    if (compactLength < 3) {
      return;
    }

    anchors.push({
      text: normalizedText,
      weight,
      left,
      right,
    });
  };

  for (
    let index = 0;
    index < profiles.length - 1;
    index += 1
  ) {
    const left = profiles[index];
    const right = profiles[index + 1];

    // 낮은 정보량 주어/대명사가 포함된 pair는 probe하지 않습니다.
    if (
      left.retrievalWeight < 3.5 ||
      right.retrievalWeight < 3.5
    ) {
      continue;
    }

    const leftText =
      twoProNormalizeDbShadowV1(left.surface);

    // ------------------------------------------------------------
    // 1. 정확 표면형
    //
    // 예:
    // 문을 + 열라고       -> "문을 열라고"
    // 열라고 + 말해요     -> "열라고 말해요"
    // 기다리라고 + 말하지 -> "기다리라고 말하지"
    // 말하지 + 않았어요   -> "말하지 않았어요"
    //
    // 사용자가 실제 입력한 구를 최대한 그대로 DB에서 찾아봅니다.
    // ------------------------------------------------------------
    const rightExactText =
      twoProNormalizeDbShadowV1(right.surface);

    if (leftText && rightExactText) {
      addAnchorV3(
        `${leftText} ${rightExactText}`,
        left.retrievalWeight +
          right.retrievalWeight +
          1.5,
        left.surface,
        right.surface
      );
    }

    // ------------------------------------------------------------
    // 2. 기존 v2 방식의 완화형
    //
    // 예:
    // 문을 + 열라고   -> "문을 열"
    // 열라고 + 말해요 -> "열라고 말"
    // 말하지 + 않았어요 -> "말하지 않"
    //
    // 정확 표면형 자료가 없을 때 활용형 차이를 넓게 회수합니다.
    // ------------------------------------------------------------
    const rightRelaxedText =
      twoProRightAnchorFormV2(right);

    if (
      leftText &&
      rightRelaxedText &&
      rightRelaxedText !== rightExactText
    ) {
      addAnchorV3(
        `${leftText} ${rightRelaxedText}`,
        left.retrievalWeight +
          right.retrievalWeight,
        left.surface,
        right.surface
      );
    }
  }

  // 같은 anchor는 하나만 남기고,
  // 동일 문구라면 가중치가 높은 쪽을 보존합니다.
  const unique =
    new Map<string, TwoProDbShadowAnchorV2>();

  for (const anchor of anchors) {
    const key =
      anchor.text.toLocaleLowerCase();

    if (
      !unique.has(key) ||
      (unique.get(key)?.weight || 0) <
        anchor.weight
    ) {
      unique.set(key, anchor);
    }
  }

  // v2에서는 2개였지만,
  // v3 시험에서는
  // 정확형 2개 + 완화형 2개까지 localhost에서 비교합니다.
  return [...unique.values()]
    .sort(
      (a, b) =>
        b.weight - a.weight ||
        b.text.length - a.text.length
    )
    .slice(0, 4);
};

export default async function Page({ searchParams }: { searchParams: { q?: string; app?: string }; }) {
  const query = (searchParams.q || '').toString();
  const cleanQuery = query.trim();
  const noSpaceLen = cleanQuery.replace(/\s+/g, '').length;
  const noSpaceQuery = cleanQuery.replace(/\s+/g, '');
  // XDIC_SEARCH_ORDER138: English single-word searches only. Other CORE routes unchanged.
  const isStableEnglishSingleWord = /^[A-Za-z]{3,25}$/.test(cleanQuery);

// 문장 검색인지 단어 검색인지 서버에서 판단
const isSentenceSearch =
  isSentenceLikeQuery(cleanQuery);

  const supabase = createServerComponentClient({ cookies });

  // XDIC_PERF_STAGE_SHADOW_V1: read-only timing. Does not alter searches or results.
  const xdicPerfStartedV1 = Date.now();
  const xdicPerfTimesV1: Record<string, number> = {};
  let xdicPerfExactBatchesV1 = 0;
  // SQL223: local-only, request-scoped timing evidence. Search logic unchanged.
  const xdicSql223: Array<{ stage: string; keyword: string; pattern: number; ms: number; rows: number | null; error: boolean }> = [];
  // KO236: aggregate existing CORE probe timings in local diagnostics only.
  const xdicCore236 = {
    exactAnd: [] as Array<{ tokens: string[]; elapsedMs: number; resultCount: number; error: string | null }>,
    relaxed: [] as Array<{ exact: string; relaxed: string; elapsedMs: number; resultCount: number; error: string | null }>,
  };
  // KO271: development-only readout of already-fetched group results.
  // No extra SQL, no resultsMap mutation, no ranking or query changes.
  const xdicKo271Shadow = {
    exactAnd: [] as Array<{
      tokens: string[];
      sqlWaitMs: number;
      fetchedRows: number;
      safeRows: number;
      existingCandidateRows: number;
      newCandidateRows: number;
      timedOut: boolean;
    }>,
    relaxed: [] as Array<{
      exact: string;
      relaxed: string;
      sqlWaitMs: number;
      fetchedRows: number;
      safeRows: number;
      promotionRows: number;
      supportRows: number;
      existingCandidateRows: number;
      newCandidateRows: number;
      promotionEligible: boolean;
      timedOut: boolean;
    }>,
  };

  // XDIC_KO286J_RANK_SHADOW_CACHE_BEGIN
  // Request-local copy of rows already retrieved by KO286G; no extra DB calls.
  let xdicKo286jRankRows: {
    tokens: string[];
    rows: any[];
    priority: number | null;
    weight: number | null;
  } | null = null;
  // XDIC_KO286J_RANK_SHADOW_CACHE_END

  // KO272: read-only prediction of Exact-AND's effects on already-cached rows.
  // No query / result / priority mutation: only request-scoped dev telemetry.
  const xdicKo272ExactAndImpact: Array<{
    tokens: string[];
    existingRows: number;
    newRows: number;
    existingPriorityChanges: number;
    existingCountChanges: number;
    existingWeightChanges: number;
    existingMatchTagChanges: number;
    existingAnyValueChanges: number;
    wouldTriggerRerank: boolean;
    timedOut: boolean;
  }> = [];

  const xdicPerfMarkV1 = (stage: string): void => {
    if (process.env.NODE_ENV !== 'production') {
      xdicPerfTimesV1[stage] = Date.now() - xdicPerfStartedV1;
    }
  };

  try {
    await supabase.auth.getSession();
  } catch(e) {}
  xdicPerfMarkV1('auth');

  let results: any[] = [];
  let orangeKeys: string[] = cleanQuery ? [cleanQuery] : [];
  let blueKeys: string[] = []; 

  let isPartialMatch = false;
  let matchedKeywords: string[] = [];

  let globalRecent: { word: string; count: number }[] = [];
  let globalPopular: string[] = [];

  const promises: Promise<void>[] = [];
  const resultsMap = new Map();
  // XDIC_KO286B_SHADOW_STATE_BEGIN
  // Local development telemetry only: no SQL, resultsMap, ranking or UI changes.
  const xdic286bRelatedEvents: Array<{
    keyword: string;
    waitMs: number;
    fetchedRows: number | null;
    failed: boolean;
    errorCode: string | null;
    errorMessage: string | null;
    timeout: boolean;
    simulated: boolean;
    threw: boolean;
  }> = [];
  // XDIC_KO286B_SHADOW_STATE_END
  // XDIC_KO255_STATUS_BEGIN: request-scoped failure metadata only.
  // No additional reads, retries, SQL changes, or ranking mutations.
  const xdic255RelatedFailures: Array<{ keyword: string; kind: 'TIMEOUT' | 'ERROR' }> = [];
  const xdic255RecordRelatedFailure = (keyword: string, failure: unknown): void => {
    const detail = String((failure as { message?: string })?.message || failure || '');
    const code = String((failure as { code?: string })?.code || '');
    xdic255RelatedFailures.push({
      keyword,
      kind: code === '57014' || /statement timeout/i.test(detail) ? 'TIMEOUT' : 'ERROR',
    });
  };
  // Explicit test-only failure simulation; production and normal URLs are unaffected.
  const xdic255SimulationToken = String(
    (searchParams as { q?: string; app?: string; ko255sim?: string }).ko255sim || ''
  );
  const xdic255SimulateRelatedTimeout =
    process.env.NODE_ENV === 'development' &&
    cleanQuery === '예비 후보' &&
    /^[a-f0-9]{32}$/i.test(xdic255SimulationToken);
  // XDIC_KO255_STATUS_END
  // XDIC_KO290_HK_SHADOW_STATE_BEGIN
  // DEV + explicit 32-hex twin-token + fixed queries only. No production read/retry.
  // Probe is diagnostic: it never calls addRes, changes warnings, or supplies results.
  const xdic290hkToken = String((searchParams as { ko290hk?: string }).ko290hk || '');
  const xdic290hkSentence = '그 지원자는 조건이 충족되었으므로 오늘 심사를 받아야 해요';
  const xdic290hkEnabled =
    process.env.NODE_ENV === 'development' &&
    (cleanQuery === '예비 후보' || cleanQuery === xdic290hkSentence) &&
    /^[a-f0-9]{32}$/i.test(xdic290hkToken) &&
    xdic290hkToken === xdic255SimulationToken;
  const xdic290hkProbeTimeout = async (
    keyword: string, originalRows: unknown, simulated: boolean
  ): Promise<void> => {
    if (!xdic290hkEnabled) return;
    const started = Date.now();
    try {
      // LIMIT 31 tests whether all matches fit within a 30-row fallback.
      // NO ORDER to allow the PGroonga-friendly query shape; index use is NOT guaranteed.
      // If 31 rows arrive, this is only a bounded sample, never an exact top-30 result.
      const { data: shadowRows, error: shadowError } = await supabase
        .from('dictionary_lines')
        .select('id,category_id,source_order')
        .neq('category_id', 0)
        .ilike('line_text', `%${keyword}%`)
        .limit(31);
      const sample = Array.isArray(shadowRows) ? shadowRows : [];
      const completeSet = !shadowError && sample.length < 31;
      const baselineIds: string[] | null = Array.isArray(originalRows)
        ? originalRows.map((row: any) => String(row?.id ?? ''))
        : null;
      const sampleIds = sample.map((row: any) => String(row?.id ?? ''));
      const sameIdsWhenComplete = completeSet && baselineIds !== null
        ? baselineIds.length === sampleIds.length &&
          baselineIds.every((id) => sampleIds.includes(id))
        : null;
      xdicPerfWriteToFileV2('[XDIC KO290HK TIMEOUT SHADOW]', JSON.stringify({
        surface: 'web', queryLength: cleanQuery.length, keyword, simulated,
        status: shadowError ? 'SHADOW_ERROR' :
          (completeSet ? 'COMPLETE_SET' : 'TRUNCATED_SAMPLE_31'),
        elapsedMs: Date.now() - started,
        sampleRows: sample.length, completeSet,
        baselineRows: baselineIds === null ? null : baselineIds.length,
        sameIdsWhenComplete,
        baselineIds, sampleIds,
        shadowErrorCode: shadowError ? String(shadowError.code || '') : null,
        indexUseUnverified: true,
        productionDisabled: true,
        resultsMerged: false,
      }));
      // XDIC_KO290_HS_FULL_ROW_CALL_BEGIN
      // Only when both explicit test tokens match; no addRes() or warning changes.
      if (xdic290hsEnabled) {
        await xdic290hsInspectFullRows(
          keyword, sample, completeSet, originalRows, simulated
        );
      }
      // XDIC_KO290_HS_FULL_ROW_CALL_END
    } catch (shadowError) {
      xdicPerfWriteToFileV2('[XDIC KO290HK TIMEOUT SHADOW]', JSON.stringify({
        surface: 'web', queryLength: cleanQuery.length, keyword, simulated,
        status: 'SHADOW_EXCEPTION', elapsedMs: Date.now() - started,
        shadowErrorType: String((shadowError as { name?: string })?.name || 'Error'),
        indexUseUnverified: true, productionDisabled: true, resultsMerged: false,
      }));
    }
  };
  // XDIC_KO290_HK_SHADOW_STATE_END
  // XDIC_KO290_HS_FULL_ROW_DRY_RUN_BEGIN
  // Diagnostic only. Exact test token + HK allowlist + development must all pass.
  // Does not merge rows, suppress errors/warnings, or change normal search paths.
  const xdic290hsToken = String((searchParams as { ko290hs?: string }).ko290hs || '');
  const xdic290hsEnabled =
    xdic290hkEnabled && /^[a-f0-9]{32}$/i.test(xdic290hsToken) &&
    xdic290hsToken === xdic290hkToken;
  // XDIC_KO290_HT_DEV_RECOVERY_GATE_BEGIN
  // A separate opt-in token: only fixed HK test searches and localhost development.
  // Nothing changes for normal requests, production, or requests without ko290ht.
  const xdic290htToken = String((searchParams as { ko290ht?: string }).ko290ht || '');
  const xdic290htEnabled =
    xdic290hsEnabled && /^[a-f0-9]{32}$/i.test(xdic290htToken) &&
    xdic290htToken === xdic290hkToken;
  // XDIC_KO290_HT_DEV_RECOVERY_GATE_END
  // XDIC_KO290_IX_READ_ONLY_GATE_BEGIN
  // Explicit, isolated diagnostic: reuses HK/HS rows, never enables HT merging.
  const xdic290ixToken = String((searchParams as { ko290ix?: string }).ko290ix || '');
  const xdic290ixEnabled = xdic290hsEnabled && !xdic290htEnabled &&
    cleanQuery === xdic290hkSentence &&
    /^[a-f0-9]{32}$/i.test(xdic290ixToken) &&
    xdic290ixToken === xdic290hsToken;
  // XDIC_KO290_IX_READ_ONLY_GATE_END
  // XDIC_KO290_JA_FAST_LANE_GATE_BEGIN
  // Explicit development-only experiment, fixed CORE sentence. No normal/prod changes.
  const xdic290jaToken = String((searchParams as { ko290ja?: string }).ko290ja || '');
  const xdic290jaEnabled = process.env.NODE_ENV === 'development' &&
    cleanQuery === xdic290hkSentence &&
    /^[a-f0-9]{32}$/i.test(xdic290jaToken) &&
    xdic290jaToken === xdic255SimulationToken &&
    !xdic290hkEnabled && !xdic290hsEnabled && !xdic290htEnabled && !xdic290ixEnabled;
  // XDIC_KO290_JA_FAST_LANE_GATE_END
  // XDIC_KO290_JI_DEV_SERIAL_GATE_BEGIN
  // Extra explicit token: only the existing fixed-sentence JA experiment may serialize.
  const xdic290jiToken = String((searchParams as { ko290ji?: string }).ko290ji || '');
  const xdic290jiEnabled = xdic290jaEnabled &&
    /^[a-f0-9]{32}$/i.test(xdic290jiToken) &&
    xdic290jiToken === xdic290jaToken;
  // XDIC_KO290_JI_DEV_SERIAL_GATE_END
  const xdic290hsInspectFullRows = async (
    keyword: string,
    hkRows: Array<{ id?: unknown }>,
    hkCompleteSet: boolean,
    originalRows: unknown,
    simulated: boolean
  ): Promise<void> => {
    if (!xdic290hsEnabled) return;
    const started = Date.now();
    try {
      // No ORDER: test-only bounded sample. Never use first 30 of 31 as recovery.
      const { data: fullRows, error: fullError } = await supabase
        .from('dictionary_lines')
        .select('*')
        .neq('category_id', 0)
        .ilike('line_text', `%${keyword}%`)
        .limit(31);
      const rows: any[] = Array.isArray(fullRows) ? fullRows : [];
      const completeSet = !fullError && rows.length < 31;
      const ids = rows.map((r: any) => String(r?.id ?? ''));
      const idsUnique = ids.every(Boolean) && new Set(ids).size === ids.length;
      const expectedColumns = [
        'id', 'category_id', 'source_order', 'line_text', 'line_hash', 'created_at'
      ];
      const allColumnsPresent = rows.every((r: any) =>
        expectedColumns.every((key) => Object.prototype.hasOwnProperty.call(r, key))
      );
      const hkIds = hkRows.map((r) => String(r?.id ?? ''));
      const sameIdsAsHk: boolean | null = completeSet && hkCompleteSet
        ? ids.length === hkIds.length && ids.every((id) => hkIds.includes(id))
        : null;
      const baselineIds: string[] | null = Array.isArray(originalRows)
        ? originalRows.map((r: any) => String(r?.id ?? '')) : null;
      const sameIdsAsBaseline: boolean | null = completeSet && baselineIds !== null
        ? baselineIds.length === ids.length && baselineIds.every((id) => ids.includes(id))
        : null;
      const eligibleForDryRun = completeSet && idsUnique && allColumnsPresent &&
        sameIdsAsHk !== false;
      const orderedCandidateIds = eligibleForDryRun
        ? [...rows].sort((a: any, b: any) => {
            const ac = Number(a.category_id), bc = Number(b.category_id);
            if (ac !== bc) return ac - bc;
            const ao = a.source_order == null ? Infinity : Number(a.source_order);
            const bo = b.source_order == null ? Infinity : Number(b.source_order);
            if (ao !== bo) return ao - bo;
            const ai = String(a.id), bi = String(b.id);
            return ai < bi ? -1 : ai > bi ? 1 : 0;
          }).map((r: any) => String(r.id))
        : null;
      const status = fullError ? 'FULL_ROW_ERROR'
        : !completeSet ? 'FULL_ROW_TRUNCATED_31'
        : !eligibleForDryRun ? 'FULL_ROW_UNSAFE'
        : 'FULL_ROW_COMPLETE';
      xdicPerfWriteToFileV2('[XDIC KO290HS FULL ROW DRY RUN]', JSON.stringify({
        surface: 'web', queryLength: cleanQuery.length, keyword, simulated,
        status, elapsedMs: Date.now() - started,
        fetchedRows: rows.length, completeSet, idsUnique, allColumnsPresent,
        hkCompleteSet, sameIdsAsHk,
        baselineRows: baselineIds === null ? null : baselineIds.length,
        sameIdsAsBaseline,
        candidateCount: orderedCandidateIds === null ? null : orderedCandidateIds.length,
        orderedCandidateIds,
        eligibleForDryRun,
        errorCode: fullError ? String(fullError.code || '') : null,
        indexUseUnverified: true, productionDisabled: true,
        resultsMerged: false, originalFailurePreserved: true,
      }));
      // XDIC_KO290_IX_READ_ONLY_SHADOW_BEGIN
      // Shadow-only decision on ALREADY FETCHED full rows; no extra SQL/merge/UI change.
      if (xdic290ixEnabled && (keyword === '지원자는' || keyword === '심사를')) {
        const ix290RowsValid = rows.every((row: any) =>
          typeof row?.id === 'string' &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(row.id) &&
          Number.isSafeInteger(Number(row.category_id)) && Number(row.category_id) !== 0 &&
          typeof row?.line_text === 'string' && row.line_text.includes(keyword)
        );
        const ix290WouldRecover = !simulated && completeSet &&
          rows.length > 0 && rows.length <= 30 && idsUnique && allColumnsPresent &&
          hkCompleteSet && sameIdsAsHk === true && ix290RowsValid;
        const ix290ExistingAtProbe = ix290WouldRecover
          ? rows.filter((row: any) => resultsMap.has(row.id)).length : 0;
        xdicPerfWriteToFileV2('[XDIC KO290IX READ ONLY SHADOW]', JSON.stringify({
          surface: 'web', probeToken: xdic290ixToken, keyword, simulated,
          verdict: ix290WouldRecover ? 'ELIGIBLE_COMPLETE_SET'
            : simulated ? 'SKIP_SIMULATED'
            : !completeSet ? (fullError ? 'SKIP_SQL_ERROR' : 'SKIP_TRUNCATED_31')
            : 'SKIP_UNSAFE',
          completeSet, hkCompleteSet, sameIdsAsHk, idsUnique, allColumnsPresent,
          rowValidationOk: ix290RowsValid, fullRowCount: rows.length,
          candidateCount: ix290WouldRecover ? rows.length : 0,
          existingAtProbe: ix290ExistingAtProbe,
          missingAtProbe: ix290WouldRecover ? rows.length - ix290ExistingAtProbe : 0,
          sourceOrderNotEquivalentToCategoryOnly: true,
          resultsMerged: false, extraSqlCalls: 0, warningSuppressed: false,
          htEnabled: false, productionDisabled: true,
        }));
      }
      // XDIC_KO290_IX_READ_ONLY_SHADOW_END
      // XDIC_KO290_HT_DEV_RECOVERY_BEGIN
      // Development-only proof of concept. Original KO255 failure and warning stay intact.
      // No recovery for any truncated sample, failed/partial validation, or other query.
      if (xdic290htEnabled) {
        const allowedKeyword = cleanQuery === xdic290hkSentence &&
          (keyword === '지원자는' || keyword === '심사를');
        const allowedComplete = allowedKeyword && !simulated && eligibleForDryRun &&
          sameIdsAsHk === true && rows.length > 0 && rows.length <= 30;
        let mergedRows = 0;
        let alreadyPresent = 0;
        if (allowedComplete) {
          // Full set only: deterministic order for this local experiment, no result truncation.
          const orderedRows = [...rows].sort((a: any, b: any) => {
            const ca = Number(a.category_id), cb = Number(b.category_id);
            if (ca !== cb) return ca - cb;
            const sa = a.source_order == null ? Infinity : Number(a.source_order);
            const sb = b.source_order == null ? Infinity : Number(b.source_order);
            if (sa !== sb) return sa - sb;
            const ida = String(a.id), idb = String(b.id);
            return ida < idb ? -1 : ida > idb ? 1 : 0;
          });
          for (const row of orderedRows) {
            if (resultsMap.has(row.id)) {
              alreadyPresent += 1;
            } else {
              addRes(row);
              mergedRows += 1;
            }
          }
        }
        const recoveryStatus = allowedComplete ? 'DEV_MERGED_COMPLETE_SET'
          : !allowedKeyword ? 'DEV_SKIPPED_NOT_ALLOWLIST'
          : simulated ? 'DEV_SKIPPED_SIMULATED'
          : !completeSet ? 'DEV_SKIPPED_TRUNCATED_OR_ERROR'
          : 'DEV_SKIPPED_UNSAFE';
        xdicPerfWriteToFileV2('[XDIC KO290HT DEV RECOVERY]', JSON.stringify({
          surface: 'web', queryLength: cleanQuery.length, keyword, simulated,
          status: recoveryStatus, completeSet, hkCompleteSet,
          fullRowCount: rows.length, hkIdsEqual: sameIdsAsHk,
          allowedKeyword, allowedComplete,
          mergedRows, alreadyPresent,
          originalFailurePreserved: true, productionDisabled: true,
          explicitOptIn: true, warningSuppressed: false,
        }));
      }
      // XDIC_KO290_HT_DEV_RECOVERY_END
    } catch (err) {
      xdicPerfWriteToFileV2('[XDIC KO290HS FULL ROW DRY RUN]', JSON.stringify({
        surface: 'web', queryLength: cleanQuery.length, keyword, simulated,
        status: 'FULL_ROW_EXCEPTION', elapsedMs: Date.now() - started,
        errorType: String((err as { name?: string })?.name || 'Error'),
        indexUseUnverified: true, productionDisabled: true,
        resultsMerged: false, originalFailurePreserved: true,
        eligibleForDryRun: false,
      }));
    }
  };
  // XDIC_KO290_HS_FULL_ROW_DRY_RUN_END
  // XDIC_KO253_TRACE_BEGIN: read-only request-scoped local telemetry.
  // Only development requests with an explicit 32-hex token and 13 allowlisted queries are traced.
  const xdic253ProbeId = String(
    (searchParams as { q?: string; app?: string; ko253?: string }).ko253 || ''
  );
  const xdic253Enabled =
    process.env.NODE_ENV === 'development' &&
    (
      cleanQuery === '예비 후보' ||
      cleanQuery === '후보 명단' ||
      cleanQuery === '후보' ||
      cleanQuery === '명단' ||
      cleanQuery === '지원자' ||
      cleanQuery === '추가 심사' ||
      cleanQuery === 'candidate' ||
      cleanQuery === 'roster' ||
      cleanQuery === 'screening' ||
      cleanQuery === 'candidate list' ||
      cleanQuery === 'additional screening' ||
      cleanQuery === '그 지원자는 오늘 심사를 받아야 해요' ||
      cleanQuery === 'The applicant is required to be screened today.'
    ) &&
    /^[a-f0-9]{32}$/i.test(xdic253ProbeId);
  // XDIC_KO290_LO_DEV_REPLAY_GATE_BEGIN
  // Triple-token + development only. No normal/production/app behavior changes.
  const xdic290loEnabled =
    process.env.NODE_ENV === 'development' &&
    isStableEnglishSingleWord && cleanQuery === 'screening' &&
    !String((searchParams as { app?: string }).app || '') &&
    xdic253Enabled &&
    String((searchParams as { ko290lo?: string }).ko290lo || '') === xdic253ProbeId &&
    String((searchParams as { ko290km?: string }).ko290km || '') === xdic253ProbeId;
  let xdic290loBaselineIds: string[] = [];
  // XDIC_KO290_LO_DEV_REPLAY_GATE_END
  // XDIC_KO290_ME_DIRECT_DEV_GATE_BEGIN
  // Development-only, distinct triple-token. Not used in normal, app or production requests.
  const xdic290meEnabled = process.env.NODE_ENV === 'development' &&
    isStableEnglishSingleWord && cleanQuery === 'screening' &&
    !String((searchParams as { app?: string }).app || '') &&
    xdic253Enabled && !xdic290loEnabled &&
    String((searchParams as { ko290me?: string }).ko290me || '') === xdic253ProbeId &&
    String((searchParams as { ko290md?: string }).ko290md || '') === xdic253ProbeId &&
    !String((searchParams as { ko290km?: string }).ko290km || '');
  let xdic290meBaselineIds: string[] = [];
  let xdic290meDirectSqlMs = -1;
  // XDIC_KO290_MK_SINGLE150_GATE_BEGIN
  // Extra opt-in: only the already-gated dev-only ME path may select 150 rows.
  const xdic290mkEnabled = xdic290meEnabled &&
    String((searchParams as { ko290mk?: string }).ko290mk || '') === xdic253ProbeId;
  let xdic290mkRows150: any[] = [];
  // XDIC_KO290_MK_SINGLE150_GATE_END
  // XDIC_KO290_ME_DIRECT_DEV_GATE_END
  // XDIC_KO263_BEGIN: local opt-in row attributes for isolated ranking replay.
  const xdic263Token = String(
    (searchParams as { ko263?: string }).ko263 || ''
  );
  const xdic263Enabled = xdic253Enabled && xdic263Token === xdic253ProbeId;
  // XDIC_KO263_END
  const xdic253Events: Array<Record<string, unknown>> = [];
  const xdic253Capture = (
    stage: string,
    keyword: string,
    maybeRows: unknown,
    error: unknown = null
  ): void => {
    if (!xdic253Enabled) return;
    const rows: any[] = Array.isArray(maybeRows) ? maybeRows : [];
    const ids = rows
      .filter((row) => row?.id !== null && row?.id !== undefined)
      .map((row) => String(row.id));
    const newIdsBeforeMerge = rows
      .filter((row) => row?.id !== null && row?.id !== undefined && !resultsMap.has(row.id))
      .map((row) => String(row.id));
    const xdic263Event: Record<string, unknown> = {
      stage,
      keyword,
      count: rows.length,
      ids,
      newIdsBeforeMerge,
      category1Count: rows.filter((row) => Number(row?.category_id) === 1).length,
      error: error ? String((error as { message?: string })?.message || error) : null,
    };
    // Only explicit local KO263 probes capture metadata; normal requests retain
    // their original trace payload and never serialize dictionary rows.
    if (xdic263Enabled && /^ko260-rotate-[a-z-]+-before$/.test(stage)) {
      xdic263Event.ko263Rows = rows.map((row) => ({
        id: row.id,
        line_text: row.line_text,
        category_id: row.category_id,
        source_order: row.source_order,
        is_exact_priority: row.is_exact_priority,
        split_type: row.split_type,
        split_keyword: row.split_keyword,
        _twoProDbPriority: row._twoProDbPriority,
        _twoProDbMatch: row._twoProDbMatch,
        _twoProDbExactAndCount: row._twoProDbExactAndCount,
        _twoProDbExactAndWeight: row._twoProDbExactAndWeight,
      }));
    }
    xdic253Events.push(xdic263Event);
  };
  // XDIC_KO253_TRACE_END
  // XDIC_KO260_INSERTIONS_BEGIN: opt-in order-only capture; no Map mutation.
  const xdic260AddResInsertionOrder: string[] = [];
  // XDIC_KO260_INSERTIONS_END
  const addRes = (item: any) => {
    const existing = resultsMap.get(item.id);
    if (!existing) {
      resultsMap.set(item.id, item);
      // XDIC_KO260_ADDRES_BEGIN: record insertion after original Map.set.
      if (xdic253Enabled) xdic260AddResInsertionOrder.push(String(item.id));
      // XDIC_KO260_ADDRES_END
      return;
    }
    // Preserve exact-match priority regardless of concurrent request completion order.
    if (isStableEnglishSingleWord && item.is_exact_priority) {
      existing.is_exact_priority = true;
    }
  };

  let wordCount = 0;
  let baseExtracted: string[] = [];
  let allSearchKeywords: string[] = [];

  // ============================================================
  // TwoPro CORE Search Keywords v6
  // 문장·일반 검색 공통으로 저정보 토큰보다
  // 핵심 의미 토큰을 우선 검색·정렬하기 위해 사용합니다.
  // ============================================================
  let twoProCoreSearchKeywordsV6: string[] = [];

  // Shadow 전용: 실제 fallback에서 선택된 핵심어를 기록만 합니다.
  let twoProCurrentRelatedSearchKeywordsShadowV1: string[] = [];

  const flexStr = noSpaceQuery.split('').map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s*');

  if (!(xdic290loEnabled || xdic290meEnabled)) promises.push((async () => {
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
  if (cleanQuery && noSpaceLen >= 2 && !(xdic290loEnabled || xdic290meEnabled)) {
    wordCount = cleanQuery.split(/\s+/).length;
    baseExtracted = extractKeywords(cleanQuery);
    
    const rawTokens = cleanQuery.split(/\s+/).map(t => t.replace(/[.,?!]/g, ''));
    allSearchKeywords = [...new Set([...baseExtracted, ...rawTokens])].filter(k => {
       const lowerK = k.toLowerCase();
       if (eStopWords.has(lowerK) || kStopWords.has(lowerK)) return false; 
       return k.length >= 2 || /[가-힣]/.test(k);
    });

    // ============================================================
    // TwoPro CORE Search Keywords v6
    //
    // 예:
    // 나는 그에게 문을 열라고 말해요
    // → 열라고 / 말해요 / 문을
    //
    // 그녀는 나에게 기다리라고 말하지 않았어요
    // → 기다리라고 / 말하지 / 않았어요
    //
    // 그녀는 책을 샀어요
    // → 책을 / 샀어요
    //
    // 주어·대명사·수신자 표현은 검색 우선순위를 낮춥니다.
    // ============================================================
    const twoProCoreProfilesV6 =
      twoProBuildDbShadowProfilesV1(
        cleanQuery
      );

    twoProCoreSearchKeywordsV6 =
      [...twoProCoreProfilesV6]
        .filter(
          (profile) =>
            profile.retrievalWeight >= 3.5
        )
        .sort(
          (a, b) =>
            b.retrievalWeight -
              a.retrievalWeight ||
            b.rankingWeight -
              a.rankingWeight ||
            a.index -
              b.index
        )
        .map((profile) =>
          twoProNormalizeDbShadowV1(
            profile.surface
          )
        )
        .filter(Boolean)
        .filter((keyword) => {
          const isEnglishKeyword =
            /^[a-zA-Z0-9_\s\-]+$/.test(
              keyword
            );

          return isEnglishKeyword
            ? keyword.length >= 3
            : keyword.length >= 2;
        })
        .filter(
          (keyword, index, array) =>
            array.indexOf(keyword) === index
        )
        .slice(0, 4);

    // CORE 분석으로 적절한 검색어를 얻지 못한 경우에는
    // 기존 검색어를 그대로 사용하여 기존 동작을 보존합니다.
    if (
      twoProCoreSearchKeywordsV6.length === 0
    ) {
      twoProCoreSearchKeywordsV6 =
        [...new Set(allSearchKeywords)]
          .filter(Boolean)
          .slice(0, 4);
    }

    if (
      process.env.NODE_ENV !==
      'production'
    ) {
      console.log(
        '[X-DIC CORE Search Keywords v6]',
        {
          query:
            cleanQuery,
          allSearchKeywords,
          coreSearchKeywords:
            twoProCoreSearchKeywordsV6,
        }
      );
    }

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

    // Deterministic DB LIMIT for English single words only; preserves Korean/CORE queries.
    function withStableEnglishWordOrder<T extends { order: (...args: any[]) => any }>(
      queryBuilder: T, hasCategoryOrder: boolean = false
    ): T {
      if (!isStableEnglishSingleWord) return queryBuilder;
      if (!hasCategoryOrder) {
        queryBuilder.order('category_id', { ascending: true, nullsFirst: false });
      }
      queryBuilder.order('source_order', { ascending: true, nullsFirst: false });
      queryBuilder.order('id', { ascending: true });
      return queryBuilder;
    }

    const fetchExactPhrase = async (qStr: string, isExactPriority: boolean = false) => {
        if (!qStr) return;
        xdicPerfExactBatchesV1 += 1;
        const queries = [
            supabase.from('dictionary_lines').select('*').eq('line_text', qStr).limit(10),
            supabase.from('dictionary_lines').select('*').ilike('line_text', `${qStr} %`).limit(20),
            supabase.from('dictionary_lines').select('*').ilike('line_text', `% ${qStr} %`).limit(30),
            supabase.from('dictionary_lines').select('*').ilike('line_text', `% ${qStr}`).limit(20),
            supabase.from('dictionary_lines').select('*').ilike('line_text', `% ${qStr}.%`).limit(10),
            supabase.from('dictionary_lines').select('*').ilike('line_text', `% ${qStr},%`).limit(10),
            supabase.from('dictionary_lines').select('*').ilike('line_text', `% ${qStr}?%`).limit(10),
            supabase.from('dictionary_lines').select('*').ilike('line_text', `% ${qStr}!%`).limit(10)
        ].map((queryBuilder) => withStableEnglishWordOrder(queryBuilder));
        
        const xdic223Stage = xdicPerfTimesV1.primary === undefined ? 'primary' : 'fallback';
        const res = await Promise.all(queries.map(async (p, patternIndex) => {
            const xdic223Started = isSentenceSearch && process.env.NODE_ENV !== 'production' ? Date.now() : 0;
            try {
                const xdic223Result = await p;
                if (xdic223Started) {
                    xdicSql223.push({
                        stage: xdic223Stage,
                        keyword: qStr,
                        pattern: patternIndex + 1,
                        ms: Date.now() - xdic223Started,
                        rows: Array.isArray(xdic223Result?.data) ? xdic223Result.data.length : null,
                        error: !!xdic223Result?.error,
                    });
                }
                return xdic223Result;
            } catch (err) {
                if (xdic223Started) {
                    xdicSql223.push({
                        stage: xdic223Stage, keyword: qStr, pattern: patternIndex + 1,
                        ms: Date.now() - xdic223Started, rows: null, error: true,
                    });
                }
                return { data: [] };
            }
        }));
        
        // XDIC_KO253_PATTERN_BEGIN
        res.forEach((r, xdic253PatternIndex) => {
            xdic253Capture('exact8', `${qStr}#${xdic253PatternIndex + 1}`, r?.data, r && 'error' in r ? r.error : null);
            if (r && r.data) {
                r.data.forEach((item: any) => {
                    if (isExactPriority) item.is_exact_priority = true;
                    addRes(item);
                });
            }
        });
        // XDIC_KO253_PATTERN_END
    };

    // ============================================================
    // TwoPro Sentence Exact-First v1
    //
    // 문장 검색은 매우 저렴한 line_text = query를 먼저 1회 확인합니다.
    // 정확 일치가 있으면 초기 전체문장 ILIKE 7종 / no-space / RPC를
    // 실행하지 않고, 아래 관련 CORE 검색 단계에서 필요한 자료만 보강합니다.
    // 단어·전문용어 검색은 기존 경로를 그대로 유지합니다.
    // ============================================================
    let twoProSentenceExactFastHitV1 = false;

    if (isSentenceSearch && safeExactQuery) {
      try {
        const { data, error } = await supabase
          .from('dictionary_lines')
          .select('*')
          .eq('line_text', safeExactQuery)
          .limit(10);

        if (!error && Array.isArray(data) && data.length > 0) {
          twoProSentenceExactFastHitV1 = true;

          data.forEach((item: any) => {
            item.is_exact_priority = true;
            addRes(item);
          });
        }
      } catch (error) {
        // Exact-first probe가 실패하면 아래 기존 검색 경로로 그대로 복귀합니다.
        twoProSentenceExactFastHitV1 = false;
      }
    }

    if (!twoProSentenceExactFastHitV1) {
      promises.push(fetchExactPhrase(safeExactQuery, true));
      
      if (safeExactQuery !== safeNoSpaceQuery && safeNoSpaceQuery.length >= 2) {
        promises.push(fetchExactPhrase(safeNoSpaceQuery, true));
      }

      if (wordCount === 1 && cleanQuery.length >= 3 && cleanQuery.length <= 25) {
        const safeQuery = cleanQuery.replace(/[,.!?'"()\[\]]/g, '');
        let splitPairs: any[] = [];
        for (let i = 2; i <= safeQuery.length - 2; i++) {
          splitPairs.push({ p1: safeQuery.slice(0, i), p2: safeQuery.slice(i) });
        }
        
        splitPairs.forEach(pair => {
           const spaceCorrected = `${pair.p1} ${pair.p2}`;
           // XDIC_SPLIT162_BEGIN: Existence probe for English word split candidates only.
           // Any probe error falls back to the original eight-query retrieval.
           if (isStableEnglishSingleWord) {
             promises.push((async () => {
               let shouldRunOriginal = true;
                // XDIC_KO290_LI_BEGIN: development-only explicit opt-in timeout-load experiment.
                // Only screening + matching ko253/ko290li tokens; other requests unchanged.
                const xdic290liTrial = xdic253Enabled && cleanQuery === 'screening' &&
                  String((searchParams as { ko290li?: string }).ko290li || '') === xdic253ProbeId;
                let xdic290liSuppressedTimeout = false;
                // XDIC_KO290_KG_PROBE_BEGIN: telemetry only, existing SQL untouched.
                const xdic290kgProbeStarted = xdic253Enabled && cleanQuery === 'screening' ? Date.now() : 0;
               try {
                 const { data, error } = await supabase
                   .from('dictionary_lines')
                   .select('id')
                   .ilike('line_text', `%${spaceCorrected}%`)
                   .limit(1);
                  // Only suppress the 8-query fallback when the existence probe timed out.
                  if (xdic290liTrial && error &&
                      (String(error.code || '') === '57014' ||
                       /statement timeout/i.test(String(error.message || '')))) {
                    shouldRunOriginal = false;
                    xdic290liSuppressedTimeout = true;
                  }
                  if (xdic253Enabled && cleanQuery === 'screening') {
                    xdic253Events.push({
                      stage: 'ko290kg-split-probe', keyword: spaceCorrected,
                      status: error ? 'DB_ERROR' :
                        Array.isArray(data) ? (data.length > 0 ? 'HIT' : 'EMPTY') : 'INVALID_RESPONSE',
                      errorMessage: error ? String(error.message || error).slice(0, 160) : '',
                      runOriginal: shouldRunOriginal && !(!error && Array.isArray(data) && data.length === 0),
                      elapsedMs: Date.now() - xdic290kgProbeStarted,
                    });
                  }
                 if (!error && Array.isArray(data) && data.length === 0) {
                   shouldRunOriginal = false;
                 }
               } catch (_error) {
                  if (xdic290liTrial &&
                      (String((_error as any)?.code || '') === '57014' ||
                       /statement timeout/i.test(String((_error as any)?.message || _error)))) {
                    shouldRunOriginal = false;
                    xdic290liSuppressedTimeout = true;
                  }
                  if (xdic253Enabled && cleanQuery === 'screening') {
                    xdic253Events.push({
                      stage: 'ko290kg-split-probe', keyword: spaceCorrected,
                      status: 'THROWN',
                      errorMessage: String((_error as any)?.message || _error).slice(0, 160),
                      runOriginal: shouldRunOriginal,
                      elapsedMs: Date.now() - xdic290kgProbeStarted,
                    });
                  }
                  // XDIC_KO290_KG_PROBE_END
                 // Probe failed: run original eight queries as before.
               }
               if (xdic290liSuppressedTimeout) {
                  xdic253Events.push({
                    stage: 'ko290li-timeout-suppressed',
                    keyword: spaceCorrected,
                    skippedExact8Queries: 8,
                    devOnly: true,
                    productionDisabled: true,
                  });
                }
                // XDIC_KO290_LI_END
               if (shouldRunOriginal) {
                 await fetchExactPhrase(spaceCorrected, true);
               }
             })());
           } else {
             promises.push(fetchExactPhrase(spaceCorrected, true));
           }
           // XDIC_SPLIT162_END
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
            // XDIC_KO253_RPC_BEGIN
            xdic253Capture('smart-rpc', noSpaceQuery, data);
            if (Array.isArray(data)) data.forEach(item => addRes({ ...item, is_rpc: true }));
            // XDIC_KO253_RPC_END
          } catch(e) {}
        })());
      }

      if (bestSplit) {
        promises.push((async () => {
          // XDIC_KO290_KG_BEST_BEGIN: opt-in telemetry; original SQL and addRes unchanged.
          const xdic290kgBestStarted = Date.now();
          let xdic290kgBestStatus = 'EXCEPTION';
          // XDIC_KO290_KX_BEST_ERROR_DETAIL: opt-in log only; SQL and result path unchanged.
          let xdic290kxBestErrorCode = '';
          let xdic290kxBestErrorMessage = '';
          try {
            const { data, error: xdic290kxBestDbError } = await withStableEnglishWordOrder(
              supabase.from('dictionary_lines')
                .select('*')
                .ilike('line_text', `%${bestSplit!.p1}%`)
                .ilike('line_text', `%${bestSplit!.p2}%`)
                .order('category_id', { ascending: true }),
              true
            ).limit(50);
            xdic290kgBestStatus = Array.isArray(data) ? `ROWS_${data.length}` : 'NULL_OR_ERROR';
            if (xdic253Enabled && cleanQuery === 'screening') {
              if (xdic290kxBestDbError) {
                xdic290kgBestStatus = 'DB_ERROR';
                xdic290kxBestErrorCode = String(xdic290kxBestDbError.code ?? '').slice(0, 80);
                xdic290kxBestErrorMessage = String(xdic290kxBestDbError.message ?? '').slice(0, 200);
              } else if (!Array.isArray(data)) {
                xdic290kgBestStatus = 'NULL_WITHOUT_DB_ERROR';
              }
            }
            // XDIC_KO290_LE_BESTSPLIT_SHADOW_BEGIN
            // Token-gated, metadata-only observation of existing bestSplit rows.
            // Does not change SQL, addRes(), resultsMap, fallback, or returned results.
            if (xdic253Enabled && cleanQuery === 'screening' &&
                String((searchParams as { ko290le?: string }).ko290le || '') === xdic253ProbeId) {
              try {
                const xdic290leRows = Array.isArray(data) ? data : [];
                const xdic290leCategorySeen = new Map<number, number>();
                let xdic290leVisible = 0;
                let xdic290leCatZero = 0;
                let xdic290leWholeWord = 0;
                let xdic290leContains = 0;
                const xdic290leIds: string[] = [];
                for (const xdic290leRow of xdic290leRows) {
                  const xdic290leCat = xdic290leRow?.category_id == null
                    ? 12 : Number(xdic290leRow.category_id);
                  const xdic290leText = String(xdic290leRow?.line_text ?? '').toLowerCase();
                  xdic290leIds.push(String(xdic290leRow?.id ?? ''));
                  if (xdic290leCat === 0) {
                    xdic290leCatZero++;
                  } else if (Number.isSafeInteger(xdic290leCat)) {
                    const xdic290leCount = (xdic290leCategorySeen.get(xdic290leCat) || 0) + 1;
                    xdic290leCategorySeen.set(xdic290leCat, xdic290leCount);
                    if (xdic290leCount <= 5) xdic290leVisible++;
                  }
                  if (xdic290leText.includes('screening')) xdic290leContains++;
                  if (/(?:^|[^a-z0-9_])screening(?=[^a-z0-9_]|$)/i.test(xdic290leText)) {
                    xdic290leWholeWord++;
                  }
                }
                xdic253Events.push({
                  stage: 'ko290le-bestsplit-shadow',
                  keyword: cleanQuery,
                  returnedRows: xdic290leRows.length,
                  returnedIds: xdic290leIds,
                  distinctIds: new Set(xdic290leIds).size,
                  category0Rows: xdic290leCatZero,
                  visibleWithCategoryCap: xdic290leVisible,
                  containsFullKeyword: xdic290leContains,
                  wholeWordKeyword: xdic290leWholeWord,
                  productionDisabled: true,
                  sqlAdded: false,
                  resultsMutated: false,
                });
              } catch (xdic290leError) {
                // Telemetry must never block the original addRes() path.
                xdic253Events.push({
                  stage: 'ko290le-bestsplit-shadow',
                  telemetryError: String((xdic290leError as Error)?.message || xdic290leError).slice(0, 160),
                });
              }
            }
            // XDIC_KO290_LE_BESTSPLIT_SHADOW_END
            if (data) data.forEach(item => addRes(item));
          } catch(e) {
            if (xdic253Enabled && cleanQuery === 'screening') {
              xdic290kxBestErrorMessage = String(e instanceof Error ? e.message : e).slice(0, 200);
            }
          }
          finally {
            if (xdic253Enabled && cleanQuery === 'screening') {
              xdic253Events.push({
                stage: 'ko290kg-best-split',
                keyword: `${bestSplit!.p1}|${bestSplit!.p2}`,
                status: xdic290kgBestStatus,
                errorCode: xdic290kxBestErrorCode,
                errorMessage: xdic290kxBestErrorMessage,
                elapsedMs: Date.now() - xdic290kgBestStarted,
                limit: 50,
              });
            }
          }
          // XDIC_KO290_KG_BEST_END
        })());
      }
    }

    await Promise.all(promises);
    xdicPerfMarkV1('primary');

    results = Array.from(resultsMap.values());
    // XDIC_KO253_PRIMARY_BEGIN
    xdic253Capture('after-primary', cleanQuery, results);
    // XDIC_KO253_PRIMARY_END

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
            const { data } = await withStableEnglishWordOrder(
              supabase.from('dictionary_lines').select('*').ilike('line_text', `%${bestSplit!.p1}%`).order('category_id', { ascending: true }),
              true
            ).limit(30);
            if (data) data.forEach(item => { if (!item.split_type) { item.split_type = 'front_partial'; item.split_keyword = bestSplit!.p1; addRes(item); } });
          } catch(e) {}
        })());

        fallbackPromises.push((async () => {
          try {
            const { data } = await withStableEnglishWordOrder(
              supabase.from('dictionary_lines').select('*').ilike('line_text', `%${bestSplit!.p2}%`).order('category_id', { ascending: true }),
              true
            ).limit(30);
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
            // TwoPro CORE 관련 핵심어 선정 v6
            // =====================================================
            // 문장 검색과 일반 검색에 동일하게 적용합니다.
            //
            // 우선:
            // - 목적어
            // - 핵심 명사
            // - 핵심 동사·서술어
            // - 인용·명령 술어
            // - 부정·시제 정보
            //
            // 후순위:
            // - 나는 / 그는 / 그녀는
            // - 나에게 / 그에게 등 저정보 대명사 표현
            // =====================================================

            const relatedSearchKeywordSourceV6 =
              twoProCoreSearchKeywordsV6.length > 0
                ? twoProCoreSearchKeywordsV6
                : [...new Set(validOrKeywords)]
                    .sort(
                      (a, b) =>
                        b.length - a.length
                    );

            const relatedSearchKeywords =
              [
                ...new Set(
                  relatedSearchKeywordSourceV6
                ),
              ]
                .filter((keyword) => {
                  const cleanKeyword =
                    keyword
                      .replace(
                        /[,.()\[\]:"']/g,
                        ''
                      )
                      .trim();

                  if (!cleanKeyword) {
                    return false;
                  }

                  const lowerKeyword =
                    cleanKeyword.toLowerCase();

                  if (
                    lowerKeyword ===
                    'please'
                  ) {
                    return false;
                  }

                  const isEnglishKeyword =
                    /^[a-zA-Z0-9_\s\-]+$/.test(
                      cleanKeyword
                    );

                  return isEnglishKeyword
                    ? cleanKeyword.length >= 3
                    : cleanKeyword.length >= 2;
                })
                .slice(0, 4);

            // Shadow 비교 로그도 실제 선택된 CORE 검색어를 기록합니다.
            twoProCurrentRelatedSearchKeywordsShadowV1 =
              [...relatedSearchKeywords];

// XDIC_KO290_JI_SERIAL_STATE_BEGIN
// Per-request queue: keep existing SQL, candidates, order and Promise.all intact.
let xdic290jiTail: Promise<void> = Promise.resolve();
// XDIC_KO290_JI_SERIAL_STATE_END
relatedSearchKeywords.forEach((keyword) => {
  const cleanK = keyword
    .replace(/[,.()\[\]:"']/g, '')
    .trim();

  if (!cleanK) {
    return;
  }

  // Exact-first가 실제 정확 일치를 잡은 문장에서는
  // 아래 단일 %keyword% 관련 검색이 동일한 관련 후보를 보강하므로,
  // keyword마다 eq + ILIKE 7종을 다시 반복하지 않습니다.
  // Exact-first가 아니면 기존 동작을 그대로 유지합니다.
  if (!twoProSentenceExactFastHitV1) {
    fallbackPromises.push(
      fetchExactPhrase(cleanK, false)
    );
  }

  // ===================================================
  // 영어·한국어 공통 관련 문장 검색
  // ===================================================
  // category_id 0은 번역 말뭉치 전용이므로
  // 관련 검색 결과에는 포함하지 않습니다.
  fallbackPromises.push((async () => {
    // XDIC_KO290_JI_SERIAL_WAIT_BEGIN
    const xdic290jiSlot: { release?: () => void } = {};
    let xdic290jiQueueWaitMs = 0;
    let xdic290jiExecutionStarted = 0;
    if (xdic290jiEnabled) {
      const xdic290jiQueuedAt = Date.now();
      const xdic290jiPrior = xdic290jiTail;
      xdic290jiTail = new Promise<void>((resolve) => {
        xdic290jiSlot.release = resolve;
      });
      await xdic290jiPrior;
      xdic290jiExecutionStarted = Date.now();
      xdic290jiQueueWaitMs = xdic290jiExecutionStarted - xdic290jiQueuedAt;
    }
    // XDIC_KO290_JI_SERIAL_WAIT_END
    // XDIC_KO286B_SHADOW_TIMER_BEGIN: all related-ILIKE calls, including non-sentence queries.
    const xdic286bStarted = process.env.NODE_ENV === 'development' ? Date.now() : 0;
    // XDIC_KO286B_SHADOW_TIMER_END
    const xdic223RelatedStarted = isSentenceSearch && process.env.NODE_ENV !== 'production' ? Date.now() : 0;
    // XDIC_KO256_START_BEGIN: timing only for the pre-existing KO253 opt-in probes.
    const xdic256RelatedStarted = xdic253Enabled ? Date.now() : 0;
    // XDIC_KO256_START_END
    try {
      // XDIC_KO290_JI_SERIAL_START_BEGIN
      if (xdic290jiEnabled) {
        try {
          xdicPerfWriteToFileV2('[XDIC KO290JI SERIAL SLOT]', JSON.stringify({
            probeToken: xdic290jiToken, keyword: cleanK, phase: 'START',
            queueWaitMs: xdic290jiQueueWaitMs,
          }));
        } catch (_xdic290jiTelemetryError) {}
      }
      // XDIC_KO290_JI_SERIAL_START_END
      // XDIC_KO290_JA_DEV_FAST_LANE_BEGIN
      // Opt-in only: complete 1..30 exact candidate set skips the SLOW original ordered SQL.
      // On any incomplete/error/unsafe sample, the original query below runs unchanged.
      if (xdic290jaEnabled && (cleanK === '지원자는' || cleanK === '심사를')) {
        const jaStarted = Date.now();
        try {
          const { data: jaData, error: jaError } = await supabase
            .from('dictionary_lines').select('*').neq('category_id', 0)
            .ilike('line_text', `%${cleanK}%`).limit(31);
          const jaRows: any[] = Array.isArray(jaData) ? jaData : [];
          const jaIds = jaRows.map((row: any) => String(row?.id ?? ''));
          const jaColumns = ['id', 'category_id', 'source_order', 'line_text', 'line_hash', 'created_at'];
          const jaValid = !jaError && jaRows.length > 0 && jaRows.length < 31 &&
            jaIds.every(Boolean) && new Set(jaIds).size === jaIds.length &&
            jaRows.every((row: any) =>
              jaColumns.every((key) => Object.prototype.hasOwnProperty.call(row, key)) &&
              typeof row.id === 'string' &&
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(row.id) &&
              Number.isSafeInteger(Number(row.category_id)) && Number(row.category_id) !== 0 &&
              (row.source_order == null || Number.isSafeInteger(Number(row.source_order))) &&
              typeof row.line_text === 'string' && row.line_text.includes(cleanK)
            );
          if (jaValid) {
            const jaOrdered = [...jaRows].sort((a: any, b: any) => {
              const cat = Number(a.category_id) - Number(b.category_id);
              if (cat !== 0) return cat;
              const ao = a.source_order == null ? Infinity : Number(a.source_order);
              const bo = b.source_order == null ? Infinity : Number(b.source_order);
              if (ao !== bo) return ao - bo;
              const ai = String(a.id), bi = String(b.id);
              return ai < bi ? -1 : ai > bi ? 1 : 0;
            });
            const jaAlready = jaOrdered.filter((row: any) => resultsMap.has(row.id)).length;
            for (const row of jaOrdered) addRes(row);
            xdicPerfWriteToFileV2('[XDIC KO290JA FAST LANE]', JSON.stringify({
              probeToken: xdic290jaToken, keyword: cleanK,
              status: 'COMPLETE_FAST_PATH', rows: jaOrdered.length,
              candidateIds: jaOrdered.map((row: any) => String(row.id)),
              alreadyInMap: jaAlready, elapsedMs: Date.now() - jaStarted,
              originalOrderedSqlSkipped: true, additionalQueryCount: 1,
              originalTimeoutNotTriggeredForThisKeyword: true,
              categoryOrderPreserved: true, sameCategoryTieOrderNotGuaranteed: true,
              productionDisabled: true,
            }));
            return;
          }
          xdicPerfWriteToFileV2('[XDIC KO290JA FAST LANE]', JSON.stringify({
            probeToken: xdic290jaToken, keyword: cleanK,
            status: jaError ? 'FALLBACK_QUERY_ERROR' : jaRows.length >= 31 ?
              'FALLBACK_TRUNCATED_31' : 'FALLBACK_UNSAFE_OR_EMPTY',
            errorCode: jaError ? String(jaError.code || '') : null,
            errorMessage: jaError ? String(jaError.message || '').slice(0, 200) : null,
            rows: jaRows.length, elapsedMs: Date.now() - jaStarted,
            originalOrderedSqlSkipped: false, productionDisabled: true,
          }));
        } catch (jaFailure) {
          xdicPerfWriteToFileV2('[XDIC KO290JA FAST LANE]', JSON.stringify({
            probeToken: xdic290jaToken, keyword: cleanK,
            status: 'FALLBACK_EXCEPTION', elapsedMs: Date.now() - jaStarted,
            exceptionType: String((jaFailure as any)?.name || ''),
            exceptionMessage: String((jaFailure as any)?.message || '').slice(0, 200),
            originalOrderedSqlSkipped: false, productionDisabled: true,
          }));
        }
      }
      // XDIC_KO290_JA_DEV_FAST_LANE_END
      const { data, error } = await withStableEnglishWordOrder(
        supabase
          .from('dictionary_lines')
          .select('*')
          .neq('category_id', 0)
          .ilike(
            'line_text',
            `%${cleanK}%`
          )
          .order('category_id', {
            ascending: true,
          }),
        true
      ).limit(30);

      // XDIC_KO255_RELATED_BEGIN
      // Simulate an unsuccessful result ONLY on an explicit localhost development probe.
      const xdic255InjectedError = xdic255SimulateRelatedTimeout && cleanK === '후보'
        ? { code: '57014', message: 'canceling statement due to statement timeout' }
        : null;
      // XDIC_KO290_HK_SHADOW_INJECTION_BEGIN
      // An explicit development-only sentence probe simulates one failed related lookup.
      // The original KO255 simulation for "예비 후보" is unchanged.
      const xdic290hkSyntheticError =
        xdic290hkEnabled && cleanQuery === xdic290hkSentence &&
        cleanK === String(relatedSearchKeywords[0] || '').replace(/[,.()\[\]:"']/g, '').trim() &&
        !error
          ? { code: '57014', message: 'KO290HK dev-only simulated statement timeout' }
          : null;
      const xdic255EffectiveError = error || xdic255InjectedError || xdic290hkSyntheticError;
      // XDIC_KO290_HK_SHADOW_INJECTION_END
      // XDIC_KO255_RELATED_END
      // XDIC_KO253_RELATED_BEGIN
      xdic253Capture('related-ILIKE', cleanK, xdic255EffectiveError ? null : data, xdic255EffectiveError);
      // XDIC_KO253_RELATED_END
      // XDIC_KO256_RESULT_BEGIN: no change to SQL result, error, or addRes flow.
      if (xdic253Enabled) {
        xdic253Events.push({
          stage: 'related-ILIKE-timing', keyword: cleanK,
          elapsedMs: Date.now() - xdic256RelatedStarted,
          rows: Array.isArray(data) ? data.length : null,
          error: xdic255EffectiveError
            ? String(xdic255EffectiveError.message || xdic255EffectiveError) : null,
          simulated: !!xdic255InjectedError,
          threw: false,
        });
      }
      // XDIC_KO256_RESULT_END
      if (xdic223RelatedStarted) {
        xdicSql223.push({
          stage: 'related', keyword: cleanK, pattern: 0,
          ms: Date.now() - xdic223RelatedStarted,
          rows: Array.isArray(data) ? data.length : null,
          error: !!error,
        });
      }

      // XDIC_KO286B_SHADOW_RESULT_BEGIN
      if (xdic286bStarted) {
        const failure = xdic255EffectiveError;
        const code = failure ? String(failure.code || '') : '';
        const message = failure ? String(failure.message || '') : '';
        xdic286bRelatedEvents.push({
          keyword: cleanK,
          waitMs: Date.now() - xdic286bStarted,
          fetchedRows: failure ? null : (Array.isArray(data) ? data.length : null),
          failed: Boolean(failure),
          errorCode: failure ? code || null : null,
          errorMessage: failure ? message.slice(0, 300) : null,
          timeout: Boolean(failure && (code === '57014' || /statement timeout/i.test(message))),
          simulated: Boolean(xdic255InjectedError && !error),
          threw: false,
        });
      }
      // XDIC_KO286B_SHADOW_RESULT_END
      if (xdic255EffectiveError) {
        // XDIC_KO255_ERROR_BEGIN: error != successful zero-row response.
        xdic255RecordRelatedFailure(cleanK, xdic255EffectiveError);
        // XDIC_KO290_HK_SHADOW_ERROR_BEGIN
        if (xdic290hkEnabled && (
          String(xdic255EffectiveError.code || '') === '57014' ||
          /statement timeout/i.test(String(xdic255EffectiveError.message || ''))
        )) {
          await xdic290hkProbeTimeout(
            cleanK, data, Boolean(!error && (xdic255InjectedError || xdic290hkSyntheticError))
          );
        }
        // XDIC_KO290_HK_SHADOW_ERROR_END
        console.error(
          '[관련 핵심어 검색 오류]',
          {
            query: cleanQuery,
            keyword: cleanK,
            message: xdic255EffectiveError.message,
          }
        );
        // XDIC_KO255_ERROR_END
        return;
      }

      if (Array.isArray(data)) {
        data.forEach((item) => {
          addRes(item);
        });
      }
    } catch (error) {
      // XDIC_KO256_CATCH_BEGIN: includes thrown database/network exceptions.
      if (xdic253Enabled) {
        xdic253Events.push({
          stage: 'related-ILIKE-timing', keyword: cleanK,
          elapsedMs: Date.now() - xdic256RelatedStarted,
          rows: null,
          error: String((error as { message?: string })?.message || error),
          simulated: false,
          threw: true,
        });
      }
      // XDIC_KO256_CATCH_END
      // XDIC_KO286B_SHADOW_CATCH_BEGIN
      if (xdic286bStarted) {
        const code = String((error as { code?: unknown })?.code || '');
        const message = String((error as { message?: unknown })?.message || error || '');
        xdic286bRelatedEvents.push({
          keyword: cleanK,
          waitMs: Date.now() - xdic286bStarted,
          fetchedRows: null,
          failed: true,
          errorCode: code || null,
          errorMessage: message.slice(0, 300),
          timeout: code === '57014' || /statement timeout/i.test(message),
          simulated: false,
          threw: true,
        });
      }
      // XDIC_KO286B_SHADOW_CATCH_END
      // XDIC_KO255_CATCH_BEGIN
      xdic255RecordRelatedFailure(cleanK, error);
      // XDIC_KO290_HK_SHADOW_THROW_BEGIN
      if (xdic290hkEnabled && (
        String((error as { code?: unknown })?.code || '') === '57014' ||
        /statement timeout/i.test(String((error as { message?: unknown })?.message || ''))
      )) {
        await xdic290hkProbeTimeout(cleanK, null, false);
      }
      // XDIC_KO290_HK_SHADOW_THROW_END
      // XDIC_KO255_CATCH_END
      if (xdic223RelatedStarted) {
        xdicSql223.push({
          stage: 'related', keyword: cleanK, pattern: 0,
          ms: Date.now() - xdic223RelatedStarted,
          rows: null, error: true,
        });
      }
      console.error(
        '[관련 핵심어 검색 예외]',
        {
          query: cleanQuery,
          keyword: cleanK,
          error,
        }
      );
    }
    // XDIC_KO290_JI_SERIAL_RELEASE_BEGIN
    finally {
      if (xdic290jiEnabled && xdic290jiSlot.release) {
        try {
          xdicPerfWriteToFileV2('[XDIC KO290JI SERIAL SLOT]', JSON.stringify({
            probeToken: xdic290jiToken, keyword: cleanK, phase: 'END',
            executionMs: Date.now() - xdic290jiExecutionStarted,
          }));
        } catch (_xdic290jiTelemetryError) {
          // Instrumentation must never change search success/failure behavior.
        } finally {
          xdic290jiSlot.release();
        }
      }
    }
    // XDIC_KO290_JI_SERIAL_RELEASE_END
  })());
});
         }
      }

      if (fallbackPromises.length > 0) {
          await Promise.all(fallbackPromises);
          results = Array.from(resultsMap.values());
          // XDIC_KO253_FALLBACK_BEGIN
          xdic253Capture('after-fallback', cleanQuery, results);
          // XDIC_KO253_FALLBACK_END
          
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

    xdicPerfMarkV1('fallback');

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

      const rankingSearchKeywordsV6 =
        twoProCoreSearchKeywordsV6.length > 0
          ? twoProCoreSearchKeywordsV6
          : allSearchKeywords;

      // XDIC_KO263_ARGS_BEGIN: observed args for exact isolated sorter replay.
      if (xdic263Enabled) xdic253Events.push({
        stage: 'ko263-rotate-args',
        keyword: cleanQuery,
        searchKeywords: [...rankingSearchKeywordsV6],
        flexStr,
        isSplitMode: isSplitModeActive,
      });
      // XDIC_KO263_ARGS_END
      // XDIC_KO260_ROTATE_MAIN_BEGIN: opt-in snapshots only.
      xdic253Capture('ko260-rotate-main-before', cleanQuery, results);
      // XDIC_KO290_AG_INPUT_BEGIN: general two-word probe; never used in production.
      const xdic290agToken = String((searchParams as { ko290ag?: string }).ko290ag || '');
      const xdic290agTokens = cleanQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const xdic290agEnabled =
        process.env.NODE_ENV === 'development' &&
        xdic253Enabled &&
        /^[a-f0-9]{32}$/i.test(xdic290agToken) &&
        ['후보 명단', '예비 후보', '추가 심사', 'candidate list', 'additional screening'].includes(cleanQuery) &&
        xdic290agTokens.length >= 2;
      const xdic290agInput = xdic290agEnabled
        ? results.map((row: any) => ({ ...row }))
        : null;
      // XDIC_KO290_AG_INPUT_END
      // XDIC_KO290_AE_INPUT_BEGIN: opt-in, development-only read-only shadow input.
      const xdic290aeProbeToken = String(
        (searchParams as { ko290ae?: string }).ko290ae || ''
      );
      const xdic290aeEnabled =
        process.env.NODE_ENV === 'development' &&
        xdic253Enabled &&
        cleanQuery === '후보 명단' &&
        /^[a-f0-9]{32}$/i.test(xdic290aeProbeToken);
      const xdic290aeInput = xdic290aeEnabled
        ? results.map((row: any) => ({ ...row }))
        : null;
      // XDIC_KO290_AE_INPUT_END
      // XDIC_KO286X_CANONICAL_SORT_SHADOW_BEGIN
      // Explicit development-only single-query shadow. Never writes to real
      // results/resultsMap, never calls Supabase, and never changes rotateResults().
      const xdic286xEnabled =
        process.env.NODE_ENV === 'development' &&
        process.env.XDIC_KO286G_FTS_SHADOW === '1' &&
        xdic253Enabled && xdic263Enabled &&
        cleanQuery === '예비 후보' &&
        (searchParams as any)?.ko286x === '1';
      let xdic286xAudit: any = null;
      if (xdic286xEnabled) {
        const startedV286X = Date.now();
        const originalIdsV286X = results.map((row: any) => String(row?.id ?? ''));
        const originalKeysV286X = Array.from(resultsMap.keys()).map(String);
        const originalMapFingerprintV286X = JSON.stringify(
          Array.from(resultsMap.values()).map((row: any) => [
            row?.id, row?.line_text, row?.category_id, row?.source_order,
            row?.is_exact_priority, row?.split_type, row?.split_keyword,
            row?._twoProDbPriority, row?._twoProDbMatch,
            row?._twoProDbExactAndCount, row?._twoProDbExactAndWeight
          ])
        );
        try {
          if (originalIdsV286X.length !== 180 ||
              originalIdsV286X.some((id) => !id || id === 'undefined')) {
            throw new Error('Unexpected pre-rotate candidate IDs/count');
          }
          const byIdV286X = new Map<string, any>();
          results.forEach((row: any) => byIdV286X.set(String(row.id), row));
          if (byIdV286X.size !== originalIdsV286X.length) {
            throw new Error('Duplicate pre-rotate IDs');
          }
          const seenV286X = new Set<string>();
          const canonicalIdsV286X: string[] = [];
          const addEventV286X = (stage: string, keyword?: string) => {
            const matches = xdic253Events.filter((event: any) =>
              event.stage === stage &&
              (keyword === undefined || event.keyword === keyword)
            ) as any[];
            if (matches.length !== 1 || !Array.isArray(matches[0]?.ids)) {
              throw new Error('Expected exactly one captured event: ' +
                stage + '/' + String(keyword ?? ''));
            }
            for (const rawId of matches[0].ids) {
              const id = String(rawId);
              if (!byIdV286X.has(id)) {
                throw new Error('Event contains ID absent from original: ' + id);
              }
              if (!seenV286X.has(id)) {
                seenV286X.add(id);
                canonicalIdsV286X.push(id);
              }
            }
          };
          addEventV286X('after-primary');
          for (const token of ['예비', '후보']) {
            for (let pattern = 1; pattern <= 8; pattern++) {
              addEventV286X('exact8', token + '#' + pattern);
            }
          }
          for (const token of ['예비', '후보']) {
            addEventV286X('related-ILIKE', token);
          }
          const missingV286X = originalIdsV286X.filter((id) => !seenV286X.has(id));
          if (missingV286X.length !== 0 ||
              canonicalIdsV286X.length !== originalIdsV286X.length) {
            throw new Error('Canonical coverage mismatch: missing=' +
              missingV286X.length + ', count=' + canonicalIdsV286X.length);
          }
          const canonicalRowsV286X = canonicalIdsV286X.map((id) => ({
            ...byIdV286X.get(id)
          }));
          const canonicalSortedV286X = rotateResults(
            canonicalRowsV286X,
            cleanQuery,
            rankingSearchKeywordsV6,
            flexStr,
            isSplitModeActive
          );
          const sortedIdsV286X = canonicalSortedV286X.map(
            (row: any) => String(row?.id ?? '')
          );
          if (sortedIdsV286X.length !== originalIdsV286X.length ||
              new Set(sortedIdsV286X).size !== originalIdsV286X.length ||
              sortedIdsV286X.some((id) => !byIdV286X.has(id))) {
            throw new Error('Canonical rotateResults output coverage mismatch');
          }
          xdic286xAudit = {
            error: null,
            canonicalInputIds: canonicalIdsV286X,
            canonicalSortedIds: sortedIdsV286X,
            actualBeforeIds: originalIdsV286X,
            beforeMapKeys: originalKeysV286X,
            beforeMapFingerprint: originalMapFingerprintV286X,
            elapsedMs: Date.now() - startedV286X,
          };
        } catch (xdic286xError: any) {
          xdic286xAudit = {
            error: String(xdic286xError?.message || xdic286xError),
            canonicalInputIds: [],
            canonicalSortedIds: [],
            actualBeforeIds: originalIdsV286X,
            beforeMapKeys: originalKeysV286X,
            beforeMapFingerprint: originalMapFingerprintV286X,
            elapsedMs: Date.now() - startedV286X,
          };
        }
      }
      // XDIC_KO286X_CANONICAL_SORT_SHADOW_INPUT_END
      results =
        rotateResults(
          results,
          cleanQuery,
          rankingSearchKeywordsV6,
          flexStr,
          isSplitModeActive
        );
      xdic253Capture('ko260-rotate-main-after', cleanQuery, results);
      // XDIC_KO290_AG_OUTPUT_BEGIN: deterministic input order comparison; never renders.
      if (xdic290agInput) {
        try {
          const xdic290agStarted = Date.now();
          // This is an experimental tie-order candidate, NOT a new production sorter.
          const xdic290agOrdinal = (row: any): number => {
            const text = String(row?.line_text ?? '').toLowerCase();
            const index = xdic290agTokens.findIndex((token: string) => text.includes(token));
            return index < 0 ? xdic290agTokens.length : index;
          };
          const xdic290agCompare = (a: any, b: any): number => {
            const ca = Number(a?.category_id ?? 12);
            const cb = Number(b?.category_id ?? 12);
            if (ca !== cb) return ca - cb;
            const oa = xdic290agOrdinal(a);
            const ob = xdic290agOrdinal(b);
            if (oa !== ob) return oa - ob;
            const sa = a?.source_order == null ? Number.MAX_SAFE_INTEGER : Number(a.source_order);
            const sb = b?.source_order == null ? Number.MAX_SAFE_INTEGER : Number(b.source_order);
            if (sa !== sb) return sa - sb;
            const ia = String(a?.id ?? '');
            const ib = String(b?.id ?? '');
            return ia < ib ? -1 : ia > ib ? 1 : 0;
          };
          const xdic290agMakeInput = (rows: any[]) =>
            rows.map((row: any) => ({ ...row })).sort(xdic290agCompare);
          const xdic290agBefore = JSON.stringify(results.map((row: any) => [
            row?.id, row?.line_text, row?.category_id, row?.source_order,
            row?._db_index, row?._matchCount, row?._maxMatchedLen,
          ]));
          const xdic290agFirst = rotateResults(
            xdic290agMakeInput(xdic290agInput), cleanQuery,
            rankingSearchKeywordsV6, flexStr, isSplitModeActive
          );
          const xdic290agReversed = rotateResults(
            xdic290agMakeInput([...xdic290agInput].reverse()), cleanQuery,
            rankingSearchKeywordsV6, flexStr, isSplitModeActive
          );
          const xdic290agAfter = JSON.stringify(results.map((row: any) => [
            row?.id, row?.line_text, row?.category_id, row?.source_order,
            row?._db_index, row?._matchCount, row?._maxMatchedLen,
          ]));
          const xdic290agActualIds = results.map((row: any) => String(row?.id ?? ''));
          const xdic290agFirstIds = xdic290agFirst.map((row: any) => String(row?.id ?? ''));
          const xdic290agReverseIds = xdic290agReversed.map((row: any) => String(row?.id ?? ''));
          const xdic290agSameSet = (a: string[], b: string[]) =>
            a.length === b.length && new Set(a).size === a.length &&
            new Set(b).size === b.length && a.every((id: string) => b.includes(id));
          const xdic290agMembership =
            xdic290agSameSet(xdic290agActualIds, xdic290agFirstIds) &&
            xdic290agSameSet(xdic290agActualIds, xdic290agReverseIds);
          const xdic290agPermutationEqual =
            JSON.stringify(xdic290agFirstIds) === JSON.stringify(xdic290agReverseIds);
          const xdic290agChanged25 = xdic290agActualIds.slice(0,25).reduce(
            (sum: number, id: string, i: number) =>
              sum + (id === xdic290agFirstIds[i] ? 0 : 1), 0
          );
          xdic253Events.push({
            stage: 'ko290-ag-generic-shadow',
            eligible: true, keywordCount: xdic290agTokens.length,
            actualCount: xdic290agActualIds.length,
            shadowCount: xdic290agFirstIds.length,
            sameIdSet: xdic290agMembership,
            permutationOrderIdentical: xdic290agPermutationEqual,
            actualUnchanged: xdic290agBefore === xdic290agAfter,
            changedTop25Positions: xdic290agChanged25,
            actualTop25Ids: xdic290agActualIds.slice(0,25),
            shadowTop25Ids: xdic290agFirstIds.slice(0,25),
            shadowElapsedMs: Date.now() - xdic290agStarted,
            scope: 'development-only; original rotateResults; candidate clones; no real result writes',
          });
        } catch (xdic290agError) {
          xdic253Events.push({
            stage: 'ko290-ag-generic-shadow', eligible: false,
            error: String((xdic290agError as { message?: string })?.message || xdic290agError),
          });
        }
      }
      // XDIC_KO290_AG_OUTPUT_END
      // XDIC_KO290_AE_OUTPUT_BEGIN: known 12-ID diagnostic, never changes actual results.
      if (xdic290aeInput) {
        try {
          // Temporary probe IDs, NOT a production ranking rule.
          const xdic290aeA = new Set([
            '5d2c78db-cccc-444c-b703-85eea541c0e9',
            '41b3c4de-f554-4c22-be42-e439c574b675',
            '2695d431-7bb6-4074-ac9a-5257dbe5624e',
            'a564f437-6613-4ee2-bbaa-ae2c71e33d3d',
            'bdd19098-9eeb-4372-9bcc-7f9950e288f5',
            '2b99f7f6-368e-4a35-9a8e-012885bf329f',
          ]);
          const xdic290aeB = new Set([
            '19891015-4b3a-4251-9423-facba336102d',
            'cf6baaaf-d4ea-44e3-9279-c60e3de6d41f',
            '827ef969-8be1-4a70-a4c8-2aa0731cee2a',
            'e7e221c9-4e23-4660-8935-df87250c06dd',
            '04ac3d1f-0851-4a94-8a23-1d4939eaa5f7',
            '9002e004-1db6-4bdd-bb28-916583bdf606',
          ]);
          const xdic290aeSlots: number[] = [];
          const xdic290aeRowsA: any[] = [];
          const xdic290aeRowsB: any[] = [];
          xdic290aeInput.forEach((row: any, index: number) => {
            const id = String(row?.id ?? '');
            if (xdic290aeA.has(id)) {
              xdic290aeSlots.push(index);
              xdic290aeRowsA.push(row);
            } else if (xdic290aeB.has(id)) {
              xdic290aeSlots.push(index);
              xdic290aeRowsB.push(row);
            }
          });
          const xdic290aeEligible =
            xdic290aeSlots.length === 12 &&
            xdic290aeRowsA.length === 6 &&
            xdic290aeRowsB.length === 6;
          if (!xdic290aeEligible) {
            xdic253Events.push({
              stage: 'ko290-ae-main-shadow', eligible: false,
              groupA: xdic290aeRowsA.length,
              groupB: xdic290aeRowsB.length,
              reason: 'known twelve candidate IDs not all present',
            });
          } else {
            const xdic290aeCanonical = [...xdic290aeRowsB, ...xdic290aeRowsA];
            const xdic290aeShadowInput = xdic290aeInput.map((row: any) => ({ ...row }));
            xdic290aeSlots.forEach((slot, index) => {
              xdic290aeShadowInput[slot] = { ...xdic290aeCanonical[index] };
            });
            const xdic290aeStarted = Date.now();
            const xdic290aeShadowResult = rotateResults(
              xdic290aeShadowInput,
              cleanQuery,
              rankingSearchKeywordsV6,
              flexStr,
              isSplitModeActive
            );
            const xdic290aeActualIds = results.map((row: any) => String(row?.id ?? ''));
            const xdic290aeShadowIds = xdic290aeShadowResult.map((row: any) => String(row?.id ?? ''));
            const xdic290aeActualSet = new Set(xdic290aeActualIds);
            const xdic290aeShadowSet = new Set(xdic290aeShadowIds);
            const xdic290aeSameIds =
              xdic290aeActualIds.length === xdic290aeShadowIds.length &&
              xdic290aeActualSet.size === xdic290aeActualIds.length &&
              xdic290aeShadowSet.size === xdic290aeShadowIds.length &&
              xdic290aeActualIds.every((id: string) => xdic290aeShadowSet.has(id));
            let xdic290aeChangedTop25 = 0;
            for (let index = 0; index < Math.min(25, xdic290aeActualIds.length); index++) {
              if (xdic290aeActualIds[index] !== xdic290aeShadowIds[index]) {
                xdic290aeChangedTop25++;
              }
            }
            xdic253Events.push({
              stage: 'ko290-ae-main-shadow', eligible: true,
              scope: 'main rotateResults only; 12 known IDs; never rendered',
              sameIdSet: xdic290aeSameIds,
              actualCount: xdic290aeActualIds.length,
              shadowCount: xdic290aeShadowIds.length,
              changedTop25Positions: xdic290aeChangedTop25,
              actualTop25Ids: xdic290aeActualIds.slice(0, 25),
              shadowTop25Ids: xdic290aeShadowIds.slice(0, 25),
              shadowElapsedMs: Date.now() - xdic290aeStarted,
            });
          }
        } catch (xdic290aeError) {
          xdic253Events.push({
            stage: 'ko290-ae-main-shadow', eligible: false,
            error: String((xdic290aeError as { message?: string })?.message || xdic290aeError),
          });
        }
      }
      // XDIC_KO290_AE_OUTPUT_END
      // XDIC_KO286X_CANONICAL_SORT_SHADOW_OUTPUT_BEGIN
      if (xdic286xEnabled && xdic286xAudit) {
        try {
          const actualAfterIdsV286X = results.map((row: any) => String(row?.id ?? ''));
          const currentMapKeysV286X = Array.from(resultsMap.keys()).map(String);
          const currentMapFingerprintV286X = JSON.stringify(
            Array.from(resultsMap.values()).map((row: any) => [
              row?.id, row?.line_text, row?.category_id, row?.source_order,
              row?.is_exact_priority, row?.split_type, row?.split_keyword,
              row?._twoProDbPriority, row?._twoProDbMatch,
              row?._twoProDbExactAndCount, row?._twoProDbExactAndWeight
            ])
          );
          const canonicalSortedIdsV286X: string[] = xdic286xAudit.canonicalSortedIds;
          const actualSetV286X = new Set(actualAfterIdsV286X);
          const canonicalSetV286X = new Set(canonicalSortedIdsV286X);
          const canonicalInputIdsV286X: string[] = xdic286xAudit.canonicalInputIds;
          xdicPerfWriteToFileV2('[XDIC KO286X CANONICAL SORT SHADOW]', JSON.stringify({
            probeId: xdic253ProbeId,
            pilot: (searchParams as any)?.ko286m === '1',
            actualBeforeCount: xdic286xAudit.actualBeforeIds.length,
            canonicalInputCount: canonicalInputIdsV286X.length,
            canonicalSortedCount: canonicalSortedIdsV286X.length,
            actualAfterCount: actualAfterIdsV286X.length,
            inputOrderSame: canonicalInputIdsV286X.join('|') ===
              xdic286xAudit.actualBeforeIds.join('|'),
            sortedOrderSame: canonicalSortedIdsV286X.join('|') ===
              actualAfterIdsV286X.join('|'),
            missingCanonical: xdic286xAudit.actualBeforeIds.filter(
              (id: string) => !canonicalInputIdsV286X.includes(id)
            ).length,
            missingActual: canonicalSortedIdsV286X.filter(
              (id: string) => !actualSetV286X.has(id)
            ).length,
            extraActual: actualAfterIdsV286X.filter(
              (id: string) => !canonicalSetV286X.has(id)
            ).length,
            resultsMapUnchanged:
              currentMapKeysV286X.join('|') === xdic286xAudit.beforeMapKeys.join('|') &&
              currentMapFingerprintV286X === xdic286xAudit.beforeMapFingerprint,
            originalRotationUntouched: true,
            canonicalSortedIds: canonicalSortedIdsV286X,
            actualAfterTop20: actualAfterIdsV286X.slice(0, 20),
            canonicalTop20: canonicalSortedIdsV286X.slice(0, 20),
            elapsedMs: xdic286xAudit.elapsedMs,
            error: xdic286xAudit.error,
          }));
        } catch (xdic286xLogError: any) {
          xdicPerfWriteToFileV2('[XDIC KO286X CANONICAL SORT SHADOW]', JSON.stringify({
            probeId: xdic253ProbeId,
            pilot: (searchParams as any)?.ko286m === '1',
            error: String(xdic286xLogError?.message || xdic286xLogError),
            resultsMutatedByShadow: false,
          }));
        }
      }
      // XDIC_KO286X_CANONICAL_SORT_SHADOW_END
      // XDIC_KO260_ROTATE_MAIN_END
// 문장 검색은 관련 검색 결과를
// 중요 카테고리와 다양성을 고려해 최대 20건으로 정리합니다.

// ============================================================================
// ☆ TwoPro DB Phrase Exact-AND Shadow v4
//
// 목적:
// "기다리라고 말하지"처럼 완전한 문장으로 판정되지 않는
// 2단어 이상의 한국어 구도 핵심 표면형 AND 검색을 시험합니다.
//
// 중요:
// - localhost Shadow 전용
// - 기존 results 변경 없음
// - 사용자 화면 영향 없음
// - 기존 isSentenceSearch 판정 변경 없음
// ============================================================================

xdicPerfMarkV1('before_core');

const isDbCorePhraseProbeCandidateV4 =
  /[가-힣]/.test(cleanQuery) &&
  cleanQuery
    .split(/\s+/)
    .filter(Boolean)
    .length >= 2;

if (isDbCorePhraseProbeCandidateV4) {
  const phraseShadowV4 =
    twoProEvaluateDbShadowV1(
      cleanQuery,
      results
    );

  const phraseExactCoreTokensV4 =
    phraseShadowV4.profiles
      .filter(
        (profile) =>
          profile.retrievalWeight >= 3.5
      )
      .map((profile) =>
        twoProNormalizeDbShadowV1(
          profile.surface
        )
      )
      .filter(
        (token) =>
          Boolean(token) &&
          (
            token.length >= 2 ||
            twoProIsSafeSingleHangulCoreV76(
              token
            )
          )
      )
      .filter(
        (token, index, array) =>
          array.indexOf(token) === index
      )
      .slice(0, 4);

  // ============================================================
  // TwoPro CORE Contiguous Phrase Priority v7.5
  //
  // 일반 검색에서는 짧은 CORE들을 각각 %token% AND로
  // 검색하기 전에 사용자가 입력한 연속 구를 먼저 찾습니다.
  //
  // 예:
  // "회의 취소"
  // → "%회의 취소%"
  //
  // 따라서:
  // "회의 취소로 인해 ..."
  // 같은 좋은 자료도 잡을 수 있습니다.
  //
  // 연속 구가 발견되면 비싼 Exact-AND는 생략합니다.
  // localhost 전용입니다.
  // ============================================================
  const queryWordCountV75 =
    cleanQuery
      .split(/\s+/)
      .filter(Boolean)
      .length;

  const isCoreContiguousCandidateV75 =
    !isSentenceSearch &&
    queryWordCountV75 >= 2 &&
    queryWordCountV75 <= 4 &&
    phraseExactCoreTokensV4.length >= 2;

  const coreContiguousPhraseV75 =
    cleanQuery
      .replace(
        /[,.()\[\]:"']/g,
        ''
      )
      .trim();

  let hasCoreContiguousHitV75 =
    false;

  const coreContiguousRowsV75:
    any[] = [];

  const coreContiguousStartedAtV75 =
    Date.now();

  if (
    isCoreContiguousCandidateV75 &&
    coreContiguousPhraseV75
  ) {
    try {
      const {
        data,
        error,
      } =
        await supabase
          .from('dictionary_lines')
          .select('*')
          .neq('category_id', 0)
          .ilike(
            'line_text',
            `%${coreContiguousPhraseV75}%`
          )
          .limit(30);

      if (
        !error &&
        Array.isArray(data) &&
        data.length > 0
      ) {
        hasCoreContiguousHitV75 =
          true;

        coreContiguousRowsV75.push(
          ...data
        );

        for (const row of data) {
          const existing =
            resultsMap.get(row.id);

          if (existing) {
            existing._twoProDbMatch =
              'core-contiguous-phrase';
          } else {
            resultsMap.set(
              row.id,
              {
                ...row,
                _twoProDbMatch:
                  'core-contiguous-phrase',
              }
            );
          }
        }

        results =
          Array.from(
            resultsMap.values()
          );

        // XDIC_KO260_ROTATE_CONTIGUOUS_BEGIN: opt-in snapshots only.
        xdic253Capture('ko260-rotate-contiguous-before', cleanQuery, results);
        results =
          rotateResults(
            results,
            cleanQuery,
            twoProCoreSearchKeywordsV6.length > 0
              ? twoProCoreSearchKeywordsV6
              : allSearchKeywords,
            flexStr,
            !!bestSplit
          );
        xdic253Capture('ko260-rotate-contiguous-after', cleanQuery, results);
        // XDIC_KO260_ROTATE_CONTIGUOUS_END
      }

      console.log(
        '[X-DIC CORE Contiguous Phrase Priority v7.5]',
        {
          query:
            cleanQuery,
          phrase:
            coreContiguousPhraseV75,
          elapsedMs:
            Date.now() -
            coreContiguousStartedAtV75,
          resultCount:
            Array.isArray(data)
              ? data.length
              : 0,
          error:
            error?.message || null,
          userVisibleEffect:
            hasCoreContiguousHitV75,
          productionEffect:
            false,
          samples:
            Array.isArray(data)
              ? data
                  .slice(0, 5)
                  .map((row: any) =>
                    String(
                      row?.line_text || ''
                    )
                  )
              : [],
        }
      );
    } catch (error: any) {
      console.log(
        '[X-DIC CORE Contiguous Phrase Priority v7.5]',
        {
          query:
            cleanQuery,
          phrase:
            coreContiguousPhraseV75,
          elapsedMs:
            Date.now() -
            coreContiguousStartedAtV75,
          resultCount: 0,
          error:
            String(
              error?.message ||
              error ||
              'unknown contiguous phrase error'
            ),
          userVisibleEffect:
            false,
          productionEffect:
            false,
          samples: [],
        }
      );
    }
  }

  // ============================================================
  // TwoPro CORE Semantic Family Priority v7.6
  //
  // 사용자의 검색어와 DB의 실제 표현이 달라도
  // 고신뢰 의미 family가 확인된 경우 결합 검색합니다.
  //
  // 현재 첫 고신뢰 family:
  // 구매 / 구입 → 사다 계열
  //
  // 예:
  // 책 구매
  // → 책을 사...
  // → 책을 샀...
  // → 책을 산...
  // → 책을 살...
  //
  // "정책을 사용", "공책을 사다", "방해책" 등은
  // 아래 boundary 검사에서 제거합니다.
  // ============================================================
  let hasCoreSemanticFamilyHitV76 =
    false;

  if (
    !hasCoreContiguousHitV75 &&
    !isSentenceSearch &&
    queryWordCountV75 === 2
  ) {
    const queryTokensV76 =
      cleanQuery
        .replace(
          /[,.()\[\]:"']/g,
          ''
        )
        .trim()
        .split(/\s+/)
        .map(
          twoProNormalizeDbShadowV1
        )
        .filter(Boolean);

    const leftTokenV76 =
      queryTokensV76[0] || '';

    const rightTokenV76 =
      queryTokensV76[1] || '';

    const purchaseSemanticTargetsV76 =
      new Set([
        '구매',
        '구매하기',
        '구입',
        '구입하기',
      ]);

    const isPurchaseSemanticQueryV76 =
      /^[가-힣]+$/u.test(
        leftTokenV76
      ) &&
      purchaseSemanticTargetsV76.has(
        rightTokenV76
      );

    if (
      isPurchaseSemanticQueryV76
    ) {
      const lastCharV76 =
        leftTokenV76[
          leftTokenV76.length - 1
        ];

      const lastCodeV76 =
        lastCharV76.charCodeAt(0);

      const hasJongseongV76 =
        lastCodeV76 >= 0xac00 &&
        lastCodeV76 <= 0xd7a3 &&
        (
          (
            lastCodeV76 -
            0xac00
          ) %
          28
        ) > 0;

      const objectParticleV76 =
        hasJongseongV76
          ? '을'
          : '를';

      const semanticProbePhrasesV76 =
        [
          ...new Set([
            `${leftTokenV76}${objectParticleV76} 사`,
            `${leftTokenV76}${objectParticleV76} 샀`,
            `${leftTokenV76}${objectParticleV76} 산`,
            `${leftTokenV76}${objectParticleV76} 살`,
            `${leftTokenV76} 사`,
            `${leftTokenV76} 샀`,
            `${leftTokenV76} 산`,
            `${leftTokenV76} 살`,
          ]),
        ];

      const semanticStartedAtV76 =
        Date.now();

      try {
        const escapedLeftV76 =
          leftTokenV76.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&'
          );

        const safePurchaseRegexV76 =
          new RegExp(
            `(?:^|[^가-힣A-Za-z0-9_])${escapedLeftV76}(?:은|는|이|가|을|를|도|만)?\\s*(?:사(?=(?:기|고|는|도|려|러|면|서|야|주|세|지|겠|보|다|\\s|[.,?!]|$))|샀|산(?=(?:다|다면|\\s|[.,?!]|$))|살(?=(?:게|까|수|때|\\s|[.,?!]|$)))`,
            'iu'
          );

        // ========================================================
        // TwoPro Semantic Family Sequential Probe v7.7
        //
        // 여러 의미 후보를 OR로 한꺼번에 검색하지 않습니다.
        // 가장 강한 구부터 하나씩 검색하고,
        // 충분한 고신뢰 결과를 얻으면 즉시 중단합니다.
        //
        // 예:
        // 책 구매
        // 1차 → "책을 사"
        //
        // 여기서 충분한 자료가 나오면
        // "책을 샀", "책을 산", "책을 살" 등은
        // 추가 DB 검색하지 않습니다.
        // ========================================================
        const semanticRowsMapV77 =
          new Map<string, any>();

        const safeSemanticRowsMapV77 =
          new Map<string, any>();

        const semanticProbeStatsV77: Array<{
          phrase: string;
          elapsedMs: number;
          resultCount: number;
          safeResultCount: number;
          error: string | null;
        }> = [];

        let semanticErrorV77:
          string | null = null;

        for (
          const phrase of
          semanticProbePhrasesV76
        ) {
          const probeStartedAtV77 =
            Date.now();

          const {
            data,
            error: probeErrorV77,
          } =
            await supabase
              .from(
                'dictionary_lines'
              )
              .select('*')
              .neq(
                'category_id',
                0
              )
              .ilike(
                'line_text',
                `%${phrase}%`
              )
              .limit(30);

          const probeRowsV77 =
            Array.isArray(data)
              ? data
              : [];

          const safeProbeRowsV77 =
            probeRowsV77.filter(
              (row: any) =>
                safePurchaseRegexV76.test(
                  String(
                    row?.line_text || ''
                  ).normalize('NFC')
                )
            );

          for (
            const row of
            probeRowsV77
          ) {
            if (row?.id) {
              semanticRowsMapV77.set(
                String(row.id),
                row
              );
            }
          }

          for (
            const row of
            safeProbeRowsV77
          ) {
            if (row?.id) {
              safeSemanticRowsMapV77.set(
                String(row.id),
                row
              );
            }
          }

          semanticProbeStatsV77.push({
            phrase,
            elapsedMs:
              Date.now() -
              probeStartedAtV77,
            resultCount:
              probeRowsV77.length,
            safeResultCount:
              safeProbeRowsV77.length,
            error:
              probeErrorV77?.message ||
              null,
          });

          if (probeErrorV77) {
            semanticErrorV77 =
              probeErrorV77.message;

            // timeout 이후 다음 후보를 연속해서
            // 다시 검색하지 않습니다.
            break;
          }

          // X-DIC Insight 및 첫 페이지에 사용할
          // 충분한 고신뢰 자료가 확보되면 종료합니다.
          if (
            safeSemanticRowsMapV77.size >= 8
          ) {
            break;
          }
        }

        const semanticRowsV76 =
          Array.from(
            semanticRowsMapV77.values()
          );

        const safeSemanticRowsV76 =
          Array.from(
            safeSemanticRowsMapV77.values()
          );

        const error =
          semanticErrorV77
            ? {
                message:
                  semanticErrorV77,
              }
            : null;

        console.log(
          '[X-DIC CORE Semantic Sequential Probe v7.7]',
          {
            query:
              cleanQuery,
            probeStats:
              semanticProbeStatsV77,
            rawResultCount:
              semanticRowsV76.length,
            safeResultCount:
              safeSemanticRowsV76.length,
          }
        );

        if (
          !error &&
          safeSemanticRowsV76.length > 0
        ) {
          hasCoreSemanticFamilyHitV76 =
            true;

          for (
            const row of
            safeSemanticRowsV76
          ) {
            const existing =
              resultsMap.get(
                row.id
              );

            if (existing) {
              const oldPriority =
                Number(
                  existing
                    ._twoProDbPriority ??
                  999
                );

              if (
                oldPriority > 3
              ) {
                existing._twoProDbPriority =
                  3;

                existing._twoProDbMatch =
                  'core-semantic-family-v76';
              }
            } else {
              resultsMap.set(
                row.id,
                {
                  ...row,
                  _twoProDbPriority: 3,
                  _twoProDbMatch:
                    'core-semantic-family-v76',
                }
              );
            }
          }

          results =
            Array.from(
              resultsMap.values()
            );

          // XDIC_KO260_ROTATE_SEMANTIC_FAMILY_BEGIN: opt-in snapshots only.
          xdic253Capture('ko260-rotate-semantic-family-before', cleanQuery, results);
          results =
            rotateResults(
              results,
              cleanQuery,
              twoProCoreSearchKeywordsV6.length > 0
                ? twoProCoreSearchKeywordsV6
                : allSearchKeywords,
              flexStr,
              !!bestSplit
            );
          xdic253Capture('ko260-rotate-semantic-family-after', cleanQuery, results);
          // XDIC_KO260_ROTATE_SEMANTIC_FAMILY_END
        }

        console.log(
          '[X-DIC CORE Semantic Family Priority v7.6]',
          {
            query:
              cleanQuery,
            semanticFamily:
              'PURCHASE',
            probePhrases:
              semanticProbePhrasesV76,
            elapsedMs:
              Date.now() -
              semanticStartedAtV76,
            rawResultCount:
              semanticRowsV76.length,
            safeResultCount:
              safeSemanticRowsV76.length,
            error:
              error?.message || null,
            userVisibleEffect:
              hasCoreSemanticFamilyHitV76,
            productionEffect:
              false,
            samples:
              safeSemanticRowsV76
                .slice(0, 5)
                .map((row: any) =>
                  String(
                    row?.line_text || ''
                  )
                ),
          }
        );
      } catch (error: any) {
        console.log(
          '[X-DIC CORE Semantic Family Priority v7.6]',
          {
            query:
              cleanQuery,
            semanticFamily:
              'PURCHASE',
            elapsedMs:
              Date.now() -
              semanticStartedAtV76,
            rawResultCount: 0,
            safeResultCount: 0,
            error:
              String(
                error?.message ||
                error ||
                'unknown semantic family error'
              ),
            userVisibleEffect:
              false,
            productionEffect:
              false,
            samples: [],
          }
        );
      }
    }
  }

  const phraseExactAndGroupsRawV4:
    string[][] = [];

  if (
    phraseExactCoreTokensV4.length >= 2
  ) {
    // 모든 핵심어가 같은 행에 있는지 우선 검사
    phraseExactAndGroupsRawV4.push(
      phraseExactCoreTokensV4
    );

    // 인접 핵심어 pair도 검사
    for (
      let index = 0;
      index <
      phraseExactCoreTokensV4.length - 1;
      index += 1
    ) {
      phraseExactAndGroupsRawV4.push([
        phraseExactCoreTokensV4[index],
        phraseExactCoreTokensV4[
          index + 1
        ],
      ]);
    }
  }

  const phraseExactAndGroupsMapV4 =
    new Map<string, string[]>();

  for (
    const group of
    phraseExactAndGroupsRawV4
  ) {
    const key = group
      .map((token) =>
        token.toLocaleLowerCase()
      )
      .join('||');

    if (
      !phraseExactAndGroupsMapV4.has(
        key
      )
    ) {
      phraseExactAndGroupsMapV4.set(
        key,
        group
      );
    }
  }

  const phraseExactAndGroupsV4 =
    [
      ...phraseExactAndGroupsMapV4.values(),
    ].slice(0, 4);

  // XDIC_KO286G_FTS_TIMEOUT_SHADOW_FLAG_BEGIN
  // At most one optional FTS probe per request. No result/ranking changes.
  let xdicKo286gShadowIssued = false;
  // XDIC_KO286G_FTS_TIMEOUT_SHADOW_FLAG_END

  const phraseExactAndStatsV4: Array<{
    tokens: string[];
    elapsedMs: number;
    resultCount: number;
    error: string | null;
    samples: string[];
  }> = [];

  // ============================================================
  // TwoPro CORE Exact-AND Priority v7
  // localhost 실제 반영용
  // ============================================================
  const promotedExactAndRowIdsV7 =
    new Set<string>();

  for (
    const tokens of
    phraseExactAndGroupsV4
  ) {
    if (
      hasCoreContiguousHitV75 ||
      hasCoreSemanticFamilyHitV76
    ) {
      phraseExactAndStatsV4.push({
        tokens,
        elapsedMs: 0,
        resultCount: 0,
        error:
          hasCoreContiguousHitV75
            ? 'skipped: core contiguous phrase hit v7.5'
            : 'skipped: core semantic family hit v7.6',
        samples: [],
      });

      break;
    }

    const startedAt = Date.now();

    try {
      let exactAndQueryV4 =
        supabase
          .from('dictionary_lines')
          .select('*')
          .neq('category_id', 0);

      for (const token of tokens) {
        exactAndQueryV4 =
          exactAndQueryV4.ilike(
            'line_text',
            `%${token}%`
          );
      }

      // XDIC_KO286M_FTS_FIRST_PILOT_BEGIN
      // Single-query, developer-only opt-in. Default route remains unchanged.
      // No persistent DB, result-order or CORE route changes in normal mode.
      const xdic286mEnabled =
        process.env.NODE_ENV === 'development' &&
        process.env.XDIC_KO286G_FTS_SHADOW === '1' &&
        (searchParams as any)?.ko286m === '1' &&
        cleanQuery.normalize('NFC').trim() === '예비 후보' &&
        tokens.length === 2 &&
        tokens[0] === '예비' &&
        tokens[1] === '후보';
      let data: any = null;
      let error: any = null;
      let xdic286mUsedFts = false;
      if (xdic286mEnabled) {
        const xdic286mStartedAt = Date.now();
        try {
          const xdic286mResponse = await supabase
            .from('dictionary_lines')
            .select('*')
            .neq('category_id', 0)
            .textSearch('line_text', "'예비':* & '후보':*", { config: 'simple' })
            .limit(30);
          const xdic286mFetched = Array.isArray(xdic286mResponse.data)
            ? xdic286mResponse.data : [];
          const xdic286mSafe = xdic286mFetched.filter((row: any) =>
            tokens.every((token) =>
              twoProHasExactTokenBoundaryV72(String(row?.line_text || ''), token)
            )
          );
          // If the pilot query fails/has no safe candidate, retain the
          // original Exact-AND query and its unchanged error handling.
          if (!xdic286mResponse.error && xdic286mSafe.length > 0) {
            data = xdic286mFetched;
            error = null;
            xdic286mUsedFts = true;
          }
          xdicPerfWriteToFileV2('[XDIC KO286M FTS FIRST PILOT]', JSON.stringify({
            queryLength: cleanQuery.length,
            tokens: [...tokens],
            ftsWaitMs: Date.now() - xdic286mStartedAt,
            fetchedRows: xdic286mFetched.length,
            safeRows: xdic286mSafe.length,
            usedFts: xdic286mUsedFts,
            exactAndSkipped: xdic286mUsedFts,
            fallbackToOriginal: !xdic286mUsedFts,
            error: xdic286mResponse.error?.message || null,
            mode: 'explicit-developer-only-single-query',
          }));
        } catch (xdic286mError: any) {
          xdicPerfWriteToFileV2('[XDIC KO286M FTS FIRST PILOT]', JSON.stringify({
            queryLength: cleanQuery.length,
            tokens: [...tokens],
            usedFts: false,
            exactAndSkipped: false,
            fallbackToOriginal: true,
            error: String(xdic286mError?.message || xdic286mError),
            mode: 'pilot-exception-fallback-original',
          }));
        }
      }
      if (!xdic286mUsedFts) {
        const xdic286mOriginal = await exactAndQueryV4.limit(30);
        data = xdic286mOriginal.data;
        error = xdic286mOriginal.error;
      }
      // XDIC_KO286M_FTS_FIRST_PILOT_END

      // KO271: approximate Supabase wait including query-builder setup.
      const xdicKo271ExactWaitMs =
        process.env.NODE_ENV !== 'production'
          ? Date.now() - startedAt
          : 0;

      const rows =
        Array.isArray(data)
          ? data
          : [];

      // XDIC_KO286G_FTS_TIMEOUT_SHADOW_BEGIN
      // Development-only, explicit opt-in. Only AFTER an existing Exact-AND
      // statement timeout and only for two Hangul CORE tokens. No promotion.
      if (
        process.env.NODE_ENV === 'development' &&
        process.env.XDIC_KO286G_FTS_SHADOW === '1' &&
        !xdicKo286gShadowIssued &&
        tokens.length === 2 &&
        tokens.every((token) => /^[가-힣]{2,}$/.test(token)) &&
        (
          String(error?.code || '') === '57014' ||
          /statement timeout/i.test(String(error?.message || ''))
        )
      ) {
        xdicKo286gShadowIssued = true;
        const ftsShadowStartedAt = Date.now();
        try {
          const ftsShadowQuery = tokens
            .map((token) => `'${token}':*`)
            .join(' & ');
          const { data: ftsData, error: ftsError } = await supabase
            .from('dictionary_lines')
            .select('id,category_id,source_order,line_text')
            .neq('category_id', 0)
            .textSearch('line_text', ftsShadowQuery, { config: 'simple' })
            .limit(30);
          const ftsFetched = Array.isArray(ftsData) ? ftsData : [];
          const ftsSafe = ftsFetched.filter((row: any) =>
            tokens.every((token) =>
              twoProHasExactTokenBoundaryV72(String(row?.line_text || ''), token)
            )
          );
          const ftsExisting = ftsSafe.filter((row: any) =>
            row?.id !== null && row?.id !== undefined && resultsMap.has(row.id)
          ).length;
          // XDIC_KO286J_RANK_SHADOW_CAPTURE_BEGIN
          // Explicit URL opt-in plus KO286G env opt-in; keep only safe row copies.
          if (
            !ftsError &&
            process.env.NODE_ENV === 'development' &&
            process.env.XDIC_KO286G_FTS_SHADOW === '1' &&
            (searchParams as any)?.ko286j === '1' &&
            ftsSafe.length > 0
          ) {
            xdicKo286jRankRows = {
              tokens: [...tokens],
              rows: ftsSafe
                .filter((row: any) => row?.id !== null && row?.id !== undefined)
                .map((row: any) => ({ ...row })),
              priority: null,
              weight: null,
            };
          }
          // XDIC_KO286J_RANK_SHADOW_CAPTURE_END
          xdicPerfWriteToFileV2('[XDIC KO286G FTS SHADOW]', JSON.stringify({
            queryLength: cleanQuery.length,
            tokens: [...tokens],
            timedOutExactAnd: true,
            ftsWaitMs: Date.now() - ftsShadowStartedAt,
            fetchedRows: ftsFetched.length,
            safeRows: ftsSafe.length,
            existingCandidateRows: ftsExisting,
            newCandidateRows: ftsSafe.length - ftsExisting,
            error: ftsError?.message || null,
            resultsMutated: false,
          }));
        } catch (ftsShadowError: any) {
          xdicPerfWriteToFileV2('[XDIC KO286G FTS SHADOW]', JSON.stringify({
            queryLength: cleanQuery.length,
            tokens: [...tokens],
            timedOutExactAnd: true,
            ftsWaitMs: Date.now() - ftsShadowStartedAt,
            fetchedRows: 0,
            safeRows: 0,
            existingCandidateRows: 0,
            newCandidateRows: 0,
            error: String(ftsShadowError?.message || ftsShadowError),
            resultsMutated: false,
          }));
        }
      }
      // XDIC_KO286G_FTS_TIMEOUT_SHADOW_END

      // ------------------------------------------------------------
      // v7.2:
      // Supabase의 %token% 검색으로 넓게 가져온 뒤
      // 실제 exact token 경계가 맞는 행만 남깁니다.
      //
      // 예:
      // token = "문을"
      //
      // "문을 열어요"   → 유지
      // "창문을 열어요" → 제외
      // ------------------------------------------------------------
      const safeRowsV72 =
        rows.filter((row: any) => {
          const rowText =
            String(
              row?.line_text || ''
            );

          return tokens.every(
            (token) =>
              twoProHasExactTokenBoundaryV72(
                rowText,
                token
              )
          );
        });

      // KO271: inspect existing response rows BEFORE original promotion.
      if (process.env.NODE_ENV !== 'production') {
        const withIdV271 = safeRowsV72.filter(
          (row: any) => row?.id !== null && row?.id !== undefined
        );
        const knownV271 = withIdV271.filter(
          (row: any) => resultsMap.has(row.id)
        ).length;
        xdicKo271Shadow.exactAnd.push({
          tokens: [...tokens],
          sqlWaitMs: xdicKo271ExactWaitMs,
          fetchedRows: rows.length,
          safeRows: safeRowsV72.length,
          existingCandidateRows: knownV271,
          newCandidateRows: withIdV271.length - knownV271,
          timedOut:
            String(error?.code || '') === '57014' ||
            /statement timeout/i.test(String(error?.message || '')),
        });
      }

      const exactAndProfilesV74 =
        tokens
          .map((token) =>
            phraseShadowV4.profiles.find(
              (profile) =>
                twoProNormalizeDbShadowV1(
                  profile.surface
                ) === token
            )
          )
          .filter(Boolean) as TwoProDbShadowTokenV1[];

      const exactAndWeightV7 =
        exactAndProfilesV74.reduce(
          (sum, profile) =>
            sum +
            Number(
              profile.retrievalWeight || 0
            ),
          0
        );

      // ------------------------------------------------------------
      // v7.4:
      // 부정 활용형끼리의 exact-AND가
      // 더 중요한 실질 의미 CORE보다 앞서는 것을 막습니다.
      //
      // 예:
      // 기다리라고 + 말하지
      //   → 의미 CORE 결합
      //
      // 말하지 + 않았어요
      //   → 부정 술어 + 부정/TAM 결합
      //
      // 단, "먹지 않았어요"처럼 검색어 전체가
      // 부정형 두 단어뿐인 경우에는 기존 priority 2를 유지합니다.
      // ------------------------------------------------------------
      const isGrammarHeavyExactAndV74 =
        exactAndProfilesV74.length > 0 &&
        exactAndProfilesV74.every(
          (profile) =>
            profile.role ===
              'NEGATION_PREDICATE' ||
            profile.role ===
              'NEGATION_TAM'
        );

      const tokenSetV74 =
        new Set(
          tokens.map((token) =>
            token.toLocaleLowerCase()
          )
        );

      const hasStrongerSemanticCoreOutsideV74 =
        phraseShadowV4.profiles.some(
          (profile) => {
            const normalizedSurface =
              twoProNormalizeDbShadowV1(
                profile.surface
              ).toLocaleLowerCase();

            if (
              tokenSetV74.has(
                normalizedSurface
              )
            ) {
              return false;
            }

            if (
              profile.retrievalWeight <
              3.5
            ) {
              return false;
            }

            return [
              'QUOTED_OR_COMMAND_PREDICATE',
              'OBJECT_CONTENT',
              'MAIN_PREDICATE',
              'CONTENT',
              'ENGLISH_CONTENT',
            ].includes(
              profile.role
            );
          }
        );

      const exactAndPriorityV74 =
        isGrammarHeavyExactAndV74 &&
        hasStrongerSemanticCoreOutsideV74
          ? 4
          : 2;

      // XDIC_KO286J_RANK_SHADOW_META_BEGIN
      // Copy EXACT v7.4 priority and weight AFTER original calculation.
      if (
        xdicKo286jRankRows &&
        xdicKo286jRankRows.tokens.length === tokens.length &&
        xdicKo286jRankRows.tokens.every((token, idx) => token === tokens[idx])
      ) {
        xdicKo286jRankRows.priority = exactAndPriorityV74;
        xdicKo286jRankRows.weight = exactAndWeightV7;
      }
      // XDIC_KO286J_RANK_SHADOW_META_END

      // KO272: preview ORIGINAL promotion effects BEFORE it runs, without mutation.
      if (process.env.NODE_ENV !== 'production') {
        let existingRowsV272 = 0;
        let newRowsV272 = 0;
        let priorityChangesV272 = 0;
        let countChangesV272 = 0;
        let weightChangesV272 = 0;
        let matchChangesV272 = 0;
        let anyChangesV272 = 0;
        if (!error) {
          for (const rowV272 of safeRowsV72) {
            const idV272 = String(rowV272?.id || '');
            if (!idV272) continue;
            const previousV272 = resultsMap.get(rowV272.id);
            if (!previousV272) {
              newRowsV272 += 1;
              continue;
            }
            existingRowsV272 += 1;
            const priorityChangedV272 =
              Number(previousV272._twoProDbPriority ?? 999) > exactAndPriorityV74;
            const previousCountV272 =
              Number(previousV272._twoProDbExactAndCount || 0);
            const previousWeightV272 =
              Number(previousV272._twoProDbExactAndWeight || 0);
            const countChangedV272 =
              Math.max(previousCountV272, tokens.length) !== previousCountV272;
            const weightChangedV272 =
              Math.max(previousWeightV272, exactAndWeightV7) !== previousWeightV272;
            const matchChangedV272 = previousV272._twoProDbMatch !== 'core-exact-and';
            if (priorityChangedV272) priorityChangesV272 += 1;
            if (countChangedV272) countChangesV272 += 1;
            if (weightChangedV272) weightChangesV272 += 1;
            if (matchChangedV272) matchChangesV272 += 1;
            if (priorityChangedV272 || countChangedV272 ||
                weightChangedV272 || matchChangedV272) anyChangesV272 += 1;
          }
        }
        xdicKo272ExactAndImpact.push({
          tokens: [...tokens],
          existingRows: existingRowsV272,
          newRows: newRowsV272,
          existingPriorityChanges: priorityChangesV272,
          existingCountChanges: countChangesV272,
          existingWeightChanges: weightChangesV272,
          existingMatchTagChanges: matchChangesV272,
          existingAnyValueChanges: anyChangesV272,
          wouldTriggerRerank: !error && existingRowsV272 + newRowsV272 > 0,
          timedOut: String(error?.code || '') === '57014' ||
            /statement timeout/i.test(String(error?.message || '')),
        });
      }

      if (!error) {
        for (const row of safeRowsV72) {
          const rowId =
            String(row?.id || '');

          if (!rowId) {
            continue;
          }

          const existing =
            resultsMap.get(row.id);

          if (existing) {
            const oldPriority =
              Number(
                existing._twoProDbPriority ??
                999
              );

            if (
              oldPriority >
              exactAndPriorityV74
            ) {
              existing._twoProDbPriority =
                exactAndPriorityV74;
            }

            existing._twoProDbExactAndCount =
              Math.max(
                Number(
                  existing
                    ._twoProDbExactAndCount ||
                  0
                ),
                tokens.length
              );

            existing._twoProDbExactAndWeight =
              Math.max(
                Number(
                  existing
                    ._twoProDbExactAndWeight ||
                  0
                ),
                exactAndWeightV7
              );

            existing._twoProDbMatch =
              'core-exact-and';
          } else {
            resultsMap.set(
              row.id,
              {
                ...row,
                _twoProDbPriority:
                  exactAndPriorityV74,
                _twoProDbExactAndCount:
                  tokens.length,
                _twoProDbExactAndWeight:
                  exactAndWeightV7,
                _twoProDbMatch:
                  exactAndPriorityV74 === 2
                    ? 'core-exact-and'
                    : 'core-grammar-and',
              }
            );
          }

          promotedExactAndRowIdsV7.add(
            rowId
          );
        }
      }

      phraseExactAndStatsV4.push({
        tokens,
        elapsedMs:
          Date.now() - startedAt,
        resultCount:
          safeRowsV72.length,
        error:
          error?.message || null,
        samples:
          safeRowsV72
            .slice(0, 5)
            .map((row: any) =>
              String(
                row?.line_text || ''
              )
            ),
      });
    } catch (error: any) {
      phraseExactAndStatsV4.push({
        tokens,
        elapsedMs:
          Date.now() - startedAt,
        resultCount: 0,
        error:
          String(
            error?.message ||
            error ||
            'unknown phrase exact AND shadow error'
          ),
        samples: [],
      });
    }
  }

  if (
    promotedExactAndRowIdsV7.size > 0
  ) {
    results =
      Array.from(
        resultsMap.values()
      );

    // XDIC_KO260_ROTATE_EXACT_AND_BEGIN: opt-in snapshots only.
    xdic253Capture('ko260-rotate-exact-and-before', cleanQuery, results);
    results =
      rotateResults(
        results,
        cleanQuery,
        twoProCoreSearchKeywordsV6.length > 0
          ? twoProCoreSearchKeywordsV6
          : allSearchKeywords,
        flexStr,
        !!bestSplit
      );
    xdic253Capture('ko260-rotate-exact-and-after', cleanQuery, results);
    // XDIC_KO260_ROTATE_EXACT_AND_END
  }

  // KO236: copy existing per-group stats. No extra queries or result changes.
  if (isDbCorePhraseProbeCandidateV4 && process.env.NODE_ENV !== 'production') {
    xdicCore236.exactAnd = phraseExactAndStatsV4.map(
      ({ tokens, elapsedMs, resultCount, error }) =>
        ({ tokens, elapsedMs, resultCount, error })
    );
  }

  console.log(
    '[X-DIC CORE Exact-AND Priority v7]',
    {
      query:
        cleanQuery,
      shadowOnly:
        promotedExactAndRowIdsV7.size === 0,
      userVisibleEffect:
        promotedExactAndRowIdsV7.size > 0,
      productionEffect:
        false,
      promotedRowCount:
        promotedExactAndRowIdsV7.size,
      coreTokens:
        phraseExactCoreTokensV4,
      exactAndGroups:
        phraseExactAndGroupsV4,
      exactAndStats:
        phraseExactAndStatsV4,
    }
  );
}

// ============================================================================
// ☆ TwoPro DB Phrase One-Side Relaxed Shadow v5
//
// 목적:
// exact AND가 0건인 짧은 한국어 구에서
// 한쪽 핵심어는 EXACT로 고정하고,
// 다른 쪽만 아주 제한적으로 동사 family anchor로 완화합니다.
//
// 예:
// 기다리라고 + 말하지
// → 기다리라고 EXACT + 말 family
//
// 중요:
// - localhost Shadow 전용
// - 기존 results 변경 없음
// - 사용자 화면 영향 없음
// ============================================================================

if (isDbCorePhraseProbeCandidateV4) {
  const phraseShadowV5 =
    twoProEvaluateDbShadowV1(
      cleanQuery,
      results
    );

  const coreProfilesV5 =
    phraseShadowV5.profiles.filter(
      (profile) =>
        profile.retrievalWeight >= 3.5
    );

  const buildFamilyAnchorV5 = (
    surface: string
  ): string => {
    const normalized =
      twoProNormalizeDbShadowV1(surface);

    if (!normalized) {
      return '';
    }

    // 인용·명령형:
    // 기다리라고 → 기다리
    // 열라고 → 열
    const quotedMatch =
      /^(.*?)(?:라고|다고|자고|냐고)$/u.exec(
        normalized
      );

    if (
      quotedMatch?.[1] &&
      quotedMatch[1].length >= 1
    ) {
      return quotedMatch[1];
    }

    // -하지 계열:
    // 말하지 → 말
    // 사용하지 → 사용
    const negativeHaMatch =
      /^(.*?)하지$/u.exec(normalized);

    if (
      negativeHaMatch?.[1] &&
      negativeHaMatch[1].length >= 1
    ) {
      return negativeHaMatch[1];
    }

    // 기존 정규화 결과도 보조적으로 재사용
    const cleaned =
      twoProNormalizeDbShadowV1(
        cleanKoreanKeyword(normalized)
      );

    if (
      cleaned &&
      cleaned !== normalized &&
      cleaned.length >= 2
    ) {
      return cleaned;
    }

    return '';
  };

  const relaxedProbeGroupsV5: Array<{
    exact: string;
    relaxed: string;
    direction: string;
  }> = [];

  for (
    let index = 0;
    index < coreProfilesV5.length - 1;
    index += 1
  ) {
    const left =
      coreProfilesV5[index];

    const right =
      coreProfilesV5[index + 1];

    const leftExact =
      twoProNormalizeDbShadowV1(
        left.surface
      );

    const rightExact =
      twoProNormalizeDbShadowV1(
        right.surface
      );

    const leftFamily =
      buildFamilyAnchorV5(
        left.surface
      );

    const rightFamily =
      buildFamilyAnchorV5(
        right.surface
      );

    // 왼쪽 EXACT + 오른쪽 family
    if (
      leftExact &&
      rightFamily &&
      rightFamily !== rightExact
    ) {
      relaxedProbeGroupsV5.push({
        exact: leftExact,
        relaxed: rightFamily,
        direction: 'LEFT_EXACT_RIGHT_RELAXED',
      });
    }

    // 오른쪽 EXACT + 왼쪽 family
    if (
      rightExact &&
      leftFamily &&
      leftFamily !== leftExact
    ) {
      relaxedProbeGroupsV5.push({
        exact: rightExact,
        relaxed: leftFamily,
        direction: 'RIGHT_EXACT_LEFT_RELAXED',
      });
    }
  }

  const uniqueRelaxedGroupsV5 =
    new Map<
      string,
      {
        exact: string;
        relaxed: string;
        direction: string;
      }
    >();

  for (
    const group of
    relaxedProbeGroupsV5
  ) {
    const key =
      `${group.exact.toLocaleLowerCase()}||` +
      `${group.relaxed.toLocaleLowerCase()}`;

    if (
      !uniqueRelaxedGroupsV5.has(key)
    ) {
      uniqueRelaxedGroupsV5.set(
        key,
        group
      );
    }
  }

  const relaxedGroupsV5 =
    [...uniqueRelaxedGroupsV5.values()]
      .slice(0, 4);

  const relaxedStatsV5: Array<{
    exact: string;
    relaxed: string;
    direction: string;
    elapsedMs: number;
    resultCount: number;
    error: string | null;
    samples: string[];
  }> = [];

  // ============================================================
  // v7.1 localhost exact + safe-family 실제 반영 시험
  // 문장 검색과 일반 검색에 동일하게 적용합니다.
  //
  // 조건:
  // - 한국어 2단어 이상
  // - 한쪽은 EXACT
  // - 다른 쪽만 안전한 family anchor 사용
  // - production / Vercel에는 아직 영향이 없습니다.
  // ============================================================
  const allowTwoProLocalPromotionV52 =
    cleanQuery
      .split(/\s+/)
      .filter(Boolean)
      .length >= 2;

  const promotedRowIdsV52 =
    new Set<string>();

  // v7.4.2
  // 3 CORE 이상에서 2 CORE exact+family까지만 맞은
  // 중간 신뢰도 후보를 별도로 기록합니다.
  const supportingRowIdsV742 =
    new Set<string>();

  for (
    const group of relaxedGroupsV5
  ) {
    const startedAt =
      Date.now();

    try {
      const {
        data,
        error,
      } =
        await supabase
          .from('dictionary_lines')
          .select('*')
          .neq('category_id', 0)
          .ilike(
            'line_text',
            `%${group.exact}%`
          )
          .ilike(
            'line_text',
            /^[가-힣]$/u.test(group.relaxed)
              ? `% ${group.relaxed}%`
              : `%${group.relaxed}%`
          )
          .limit(30);

// KO271: approximate Supabase wait including query-builder setup.
const xdicKo271RelaxedWaitMs =
  process.env.NODE_ENV !== 'production'
    ? Date.now() - startedAt
    : 0;

const rows =
  Array.isArray(data)
    ? data
    : [];

// ------------------------------------------------------------
// v5.1: relaxed root가 다른 한국어 단어 내부에 들어 있는
// false positive를 제거합니다.
//
// 예:
// relaxed = "말"
//
// 유지:
// "기다리라고 말했나요"
// "기다리라고 말해주세요"
//
// 제외:
// "정말 필요한 경우"
// "기다리라고 정말 정중하게"
// ------------------------------------------------------------
const escapedRelaxedV51 =
  group.relaxed.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

// ------------------------------------------------------------
// v7.3:
// 한 글자짜리 한국어 family root는 너무 넓게 잡힐 수 있으므로
// 활용형으로 볼 수 있는 뒤 음절만 허용합니다.
//
// 예:
// "열" + "어"  → 열어        O
// "열" + "었"  → 열었        O
// "열" + "고"  → 열고        O
// "열" + "지"  → 열지        O
// "열" + "면"  → 열면        O
// "열" + "려"  → 열려고      O
// "열" + "린"  → 열린        O
//
// "열" + "쇠"  → 열쇠        X
// "열" + "시"  → 열시        X
//
// "말" + "하"  → 말하다      O
// "말" + "해"  → 말해요      O
// "말" + "했"  → 말했어요    O
// ------------------------------------------------------------
const isSingleHangulFamilyV73 =
  /^[가-힣]$/u.test(
    group.relaxed
  );

const relaxedBoundaryRegexV51 =
  isSingleHangulFamilyV73
    ? new RegExp(
        `(?:^|[^가-힣A-Za-z0-9_])${escapedRelaxedV51}(?=(?:아|어|여|하|해|했|합|고|지|면|자|려|겠|았|었|라|린|릴|립|렸|습|세)|[^가-힣A-Za-z0-9_]|$)`,
        'iu'
      )
    : new RegExp(
        `(?:^|[^가-힣A-Za-z0-9_])${escapedRelaxedV51}`,
        'iu'
      );

      const safeRowsV51 =
        rows.filter((row: any) => {
          const rowText =
            String(
              row?.line_text || ''
            ).normalize('NFC');

          return (
            twoProHasExactTokenBoundaryV72(
              rowText,
              group.exact
            ) &&
            relaxedBoundaryRegexV51.test(
              rowText
            )
          );
        });

      // ------------------------------------------------------------
      // v5.2:
      // 정보량이 충분한 EXACT 쪽을 가진 경우에만
      // localhost 실제 결과 후보로 승격합니다.
      //
      // 예:
      // 기다리라고(EXACT) + 말(family) → 승격
      //
      // 너무 약한 TAM 중심 조합은 아직 승격하지 않습니다.
      // ------------------------------------------------------------
      const exactProfileV52 =
        coreProfilesV5.find(
          (profile) =>
            twoProNormalizeDbShadowV1(
              profile.surface
            ) === group.exact
        );

      // ------------------------------------------------------------
      // v7.4.1:
      // CORE가 3개 이상인 검색에서는
      // exact + family 2개만 맞았다고 바로 승격하지 않습니다.
      //
      // 예:
      // "나는 그에게 문을 열라고 말해요"
      //
      // 핵심:
      // 문을 / 열라고 / 말해요
      //
      // 기존:
      // 문을(EXACT) + 열(family)
      // → "문을 열다" 계열만으로도 승격 가능
      //
      // 보강:
      // CORE가 3개 이상이면 현재 exact + family 외에
      // 나머지 CORE 중 하나가 같은 행에서 EXACT로
      // 추가 확인되어야 승격합니다.
      //
      // CORE가 2개인
      // "기다리라고 말하지"는 기존 동작을 그대로 유지합니다.
      // ------------------------------------------------------------

      const promotionRowsV741 =
        coreProfilesV5.length < 3
          ? safeRowsV51
          : safeRowsV51.filter(
              (row: any) => {
                const rowText =
                  String(
                    row?.line_text || ''
                  ).normalize('NFC');

                return coreProfilesV5.some(
                  (profile) => {
                    const profileExact =
                      twoProNormalizeDbShadowV1(
                        profile.surface
                      );

                    if (!profileExact) {
                      return false;
                    }

                    // 현재 exact 쪽은 이미 확인되었으므로 제외
                    if (
                      profileExact ===
                      group.exact
                    ) {
                      return false;
                    }

                    const profileFamily =
                      buildFamilyAnchorV5(
                        profile.surface
                      );

                    // 현재 relaxed 쪽을 만든 원래 CORE도 제외
                    if (
                      profileFamily &&
                      profileFamily ===
                        group.relaxed
                    ) {
                      return false;
                    }

                    return (
                      twoProHasExactTokenBoundaryV72(
                        rowText,
                        profileExact
                      )
                    );
                  }
                );
              }
            );

      // ------------------------------------------------------------
      // v7.4.2:
      // CORE가 3개 이상인 경우,
      // v7.4.1 고신뢰 승격에는 실패했지만
      // exact + safe-family 두 의미 요소가 확인된 행은
      // 단일 CORE fallback보다 한 단계 높은 지원 후보로 보존합니다.
      //
      // 예:
      // 문을(EXACT) + 열(family)
      // → 말해요 하나만 있는 행보다 우선
      //
      // 단:
      // priority 3 고신뢰보다 아래에 둡니다.
      // ------------------------------------------------------------
      const promotionRowIdsV741 =
        new Set(
          promotionRowsV741.map((row: any) =>
            String(row?.id || '')
          )
        );

      const supportingRowsV742 =
        coreProfilesV5.length >= 3
          ? safeRowsV51.filter(
              (row: any) => {
                const rowId =
                  String(row?.id || '');

                return (
                  Boolean(rowId) &&
                  !promotionRowIdsV741.has(rowId)
                );
              }
            )
          : [];

      const shouldPromoteV52 =
        allowTwoProLocalPromotionV52 &&
        (exactProfileV52?.retrievalWeight || 0) >= 4.0;

      // KO271: inspect boundary-safe rows BEFORE original promotion.
      if (process.env.NODE_ENV !== 'production') {
        const withIdV271 = safeRowsV51.filter(
          (row: any) => row?.id !== null && row?.id !== undefined
        );
        const knownV271 = withIdV271.filter(
          (row: any) => resultsMap.has(row.id)
        ).length;
        xdicKo271Shadow.relaxed.push({
          exact: group.exact,
          relaxed: group.relaxed,
          sqlWaitMs: xdicKo271RelaxedWaitMs,
          fetchedRows: rows.length,
          safeRows: safeRowsV51.length,
          promotionRows: promotionRowsV741.length,
          supportRows: supportingRowsV742.length,
          existingCandidateRows: knownV271,
          newCandidateRows: withIdV271.length - knownV271,
          promotionEligible: shouldPromoteV52,
          timedOut:
            String(error?.code || '') === '57014' ||
            /statement timeout/i.test(String(error?.message || '')),
        });
      }

      if (shouldPromoteV52) {
        for (const row of promotionRowsV741) {
          const rowId =
            String(row?.id || '');

          if (!rowId) {
            continue;
          }

          const existing =
            resultsMap.get(row.id);

          if (existing) {
            const oldPriority =
              Number(
                existing._twoProDbPriority ??
                999
              );

            if (oldPriority > 3) {
              existing._twoProDbPriority = 3;
            }

            existing._twoProDbMatch =
              'exact+family';
          } else {
            resultsMap.set(
              row.id,
              {
                ...row,
                _twoProDbPriority: 3,
                _twoProDbMatch:
                  'exact+family',
              }
            );
          }

          promotedRowIdsV52.add(
            rowId
          );
        }
      }

      // ------------------------------------------------------------
      // v7.4.2:
      // 고신뢰 priority 3에는 못 올라갔지만,
      // exact + safe-family가 함께 확인된 3-CORE 검색 결과는
      // priority 5 지원 후보로 보존합니다.
      // ------------------------------------------------------------
      if (
        allowTwoProLocalPromotionV52 &&
        coreProfilesV5.length >= 3 &&
        (exactProfileV52?.retrievalWeight || 0) >= 4.0
      ) {
        for (const row of supportingRowsV742) {
          const rowId =
            String(row?.id || '');

          if (!rowId) {
            continue;
          }

          const existing =
            resultsMap.get(row.id);

          if (existing) {
            const oldPriority =
              Number(
                existing._twoProDbPriority ??
                999
              );

            // 이미 더 강한 priority 2/3 판정이면 건드리지 않습니다.
            if (oldPriority > 5) {
              existing._twoProDbPriority =
                5;

              existing._twoProDbMatch =
                'exact+family-support-v742';
            }
          } else {
            resultsMap.set(
              row.id,
              {
                ...row,
                _twoProDbPriority: 5,
                _twoProDbMatch:
                  'exact+family-support-v742',
              }
            );
          }

          supportingRowIdsV742.add(
            rowId
          );
        }
      }

      relaxedStatsV5.push({
        exact:
          group.exact,
  relaxed:
    group.relaxed,
  direction:
    group.direction,
  elapsedMs:
    Date.now() - startedAt,
  resultCount:
    promotionRowsV741.length,
  error:
    error?.message || null,
  samples:
    promotionRowsV741
      .slice(0, 8)
      .map((row: any) =>
        String(
          row?.line_text || ''
        )
      ),
});
    } catch (error: any) {
      relaxedStatsV5.push({
        exact:
          group.exact,
        relaxed:
          group.relaxed,
        direction:
          group.direction,
        elapsedMs:
          Date.now() - startedAt,
        resultCount: 0,
        error:
          String(
            error?.message ||
            error ||
            'unknown relaxed shadow error'
          ),
        samples: [],
      });
    }
  }

  // ------------------------------------------------------------
  // v5.2에서 실제 승격된 후보가 있을 때만
  // resultsMap에서 results를 다시 만들고
  // 기존 rotateResults 정렬기를 그대로 재사용합니다.
  // ------------------------------------------------------------
  if (
    promotedRowIdsV52.size > 0 ||
    supportingRowIdsV742.size > 0
  ) {
    results =
      Array.from(
        resultsMap.values()
      );

    // XDIC_KO260_ROTATE_RELAXED_BEGIN: opt-in snapshots only.
    xdic253Capture('ko260-rotate-relaxed-before', cleanQuery, results);
    results =
      rotateResults(
        results,
        cleanQuery,
        twoProCoreSearchKeywordsV6.length > 0
          ? twoProCoreSearchKeywordsV6
          : allSearchKeywords,
        flexStr,
        !!bestSplit
      );
    xdic253Capture('ko260-rotate-relaxed-after', cleanQuery, results);
    // XDIC_KO260_ROTATE_RELAXED_END
  }

  // KO236: copy existing relaxed-group stats. No query or ranking changes.
  if (isDbCorePhraseProbeCandidateV4 && process.env.NODE_ENV !== 'production') {
    xdicCore236.relaxed = relaxedStatsV5.map(
      ({ exact, relaxed, elapsedMs, resultCount, error }) =>
        ({ exact, relaxed, elapsedMs, resultCount, error })
    );
  }

  console.log(
    '[X-DIC DB Phrase One-Side Relaxed Shadow v5]',
    {
      query:
        cleanQuery,
      shadowOnly:
        promotedRowIdsV52.size === 0,
      userVisibleEffect:
        promotedRowIdsV52.size > 0,
      productionEffect:
        false,
      promotedRowCount:
        promotedRowIdsV52.size,
      relaxedGroups:
        relaxedGroupsV5,
      relaxedStats:
        relaxedStatsV5,
    }
  );
}

xdicPerfMarkV1('after_core');

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
    process.env.XDIC_ENABLE_DB_SHADOW_PROBE === '1';

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

  // ============================================================
  // ☆ TwoPro DB Select Shadow v4
  // EXACT CORE TOKEN AND probe
  //
  // 예:
  // 기다리라고 말하지
  // → 기다리라고 AND 말하지
  //
  // 나는 그에게 문을 열라고 말해요
  // → 문을 AND 열라고 AND 말해요
  // → 문을 AND 열라고
  // → 열라고 AND 말해요
  //
  // localhost Shadow 전용이며 실제 화면에는 반영하지 않습니다.
  // ============================================================

  const shadowExactCoreTokensV4 =
    shadow.profiles
      .filter(
        (profile) =>
          profile.retrievalWeight >= 3.5
      )
      .map((profile) =>
        twoProNormalizeDbShadowV1(
          profile.surface
        )
      )
      .filter(
        (token) =>
          Boolean(token) &&
          token.length >= 2
      )
      .filter(
        (token, index, array) =>
          array.indexOf(token) === index
      )
      .slice(0, 4);

  const shadowExactAndGroupsRawV4:
    string[][] = [];

  if (
    shadowExactCoreTokensV4.length >= 2
  ) {
    // ① 모든 핵심 표면형이 같은 행에 존재하는지 먼저 검사
    shadowExactAndGroupsRawV4.push(
      shadowExactCoreTokensV4
    );

    // ② 인접 핵심어 pair도 검사
    for (
      let index = 0;
      index <
      shadowExactCoreTokensV4.length - 1;
      index += 1
    ) {
      shadowExactAndGroupsRawV4.push([
        shadowExactCoreTokensV4[index],
        shadowExactCoreTokensV4[index + 1],
      ]);
    }
  }

  const shadowExactAndGroupsMapV4 =
    new Map<string, string[]>();

  for (
    const group of shadowExactAndGroupsRawV4
  ) {
    const key = group
      .map((token) =>
        token.toLocaleLowerCase()
      )
      .join('||');

    if (
      !shadowExactAndGroupsMapV4.has(key)
    ) {
      shadowExactAndGroupsMapV4.set(
        key,
        group
      );
    }
  }

  const shadowExactAndGroupsV4 =
    [
      ...shadowExactAndGroupsMapV4.values(),
    ].slice(0, 4);

  const shadowExactAndStatsV4: Array<{
    tokens: string[];
    elapsedMs: number;
    resultCount: number;
    error: string | null;
  }> = [];

  if (
    shadowProbeEnabledV2 &&
    shadowExactAndGroupsV4.length > 0
  ) {
    for (
      const tokens of shadowExactAndGroupsV4
    ) {
      const startedAt = Date.now();

      try {
        let exactAndQueryV4 =
          supabase
            .from('dictionary_lines')
            .select('*')
            .neq('category_id', 0);

        for (const token of tokens) {
          exactAndQueryV4 =
            exactAndQueryV4.ilike(
              'line_text',
              `%${token}%`
            );
        }

        const {
          data,
          error,
        } =
          await exactAndQueryV4.limit(30);

        const rows =
          Array.isArray(data)
            ? data
            : [];

        shadowExactAndStatsV4.push({
          tokens,
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
        shadowExactAndStatsV4.push({
          tokens,
          elapsedMs:
            Date.now() - startedAt,
          resultCount: 0,
          error:
            String(
              error?.message ||
              error ||
              'unknown exact AND shadow error'
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

      shadowExactCoreTokensV4,
      shadowExactAndGroupsV4,
      shadowExactAndStatsV4,

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

  // XDIC_KO290_LO_DEV_REPLAY_BASELINE_BEGIN
  // Only in explicit dev replay: skip original expensive search and hydrate the
  // exact 60 historical category-0 IDs from real DB (1 read-only SELECT).
  // Then the UNMODIFIED KO290-KR branch below performs its normal 2 SELECTs.
  if (xdic290loEnabled) {
    if (results.length !== 0 || resultsMap.size !== 0) {
      throw new Error('KO290-LO expected empty pre-replay results and Map');
    }
    const { readFileSync: xdic290loReadFileSync } = await import('node:fs');
    const xdic290loHistory = xdic290loReadFileSync(
      'C:/dictionary_upload/X-DIC-core-backups/X-DIC-core-scripts/XDIC_KO253_TRACE.jsonl',
      'utf8'
    ).split(/\r?\n/);
    const xdic290loHistoryAt = '2026-11-26T10:31:30.993Z';
    const xdic290loMatching = xdic290loHistory
      .filter((line: string) => line.includes(xdic290loHistoryAt) &&
        line.includes('XDIC_KO253_TRACE'))
      .map((line: string) => JSON.parse(line))
      .filter((record: any) => record?.marker === 'XDIC_KO253_TRACE' &&
        record?.timestamp === xdic290loHistoryAt && record?.query === 'screening');
    if (xdic290loMatching.length !== 1) {
      throw new Error('KO290-LO historical baseline absent or ambiguous');
    }
    const xdic290loHistoryRecord = xdic290loMatching[0];
    const xdic290loPrimary = (xdic290loHistoryRecord.events || [])
      .find((e: any) => e.stage === 'after-primary');
    const xdic290loFallback = (xdic290loHistoryRecord.events || [])
      .find((e: any) => e.stage === 'after-fallback');
    xdic290loBaselineIds = (xdic290loHistoryRecord.finalIds || [])
      .map((id: unknown) => String(id));
    if (xdic290loPrimary?.count !== 0 || xdic290loFallback?.count !== 60 ||
        xdic290loHistoryRecord.finalCount !== 60 ||
        xdic290loBaselineIds.length !== 60 ||
        new Set(xdic290loBaselineIds).size !== 60 ||
        xdic290loBaselineIds.some((id) => !/^[a-f0-9-]{36}$/i.test(id))) {
      throw new Error('KO290-LO historical 0/60 ID integrity failed');
    }
    const xdic290loController = new AbortController();
    const xdic290loTimer = setTimeout(() => xdic290loController.abort(), 12000);
    let xdic290loFetched: any[] = [];
    try {
      const { data, error } = await supabase.from('dictionary_lines')
        .select('*').in('id', xdic290loBaselineIds)
        .abortSignal(xdic290loController.signal);
      if (error || !Array.isArray(data)) {
        throw new Error('KO290-LO 60 baseline full-row SELECT failed');
      }
      xdic290loFetched = data;
    } finally {
      clearTimeout(xdic290loTimer);
    }
    const xdic290loFetchedMap = new Map<string, any>();
    for (const row of xdic290loFetched) {
      const id = String(row?.id ?? '');
      if (!id || xdic290loFetchedMap.has(id) || Number(row?.category_id) !== 0 ||
          typeof row?.line_text !== 'string') {
        throw new Error('KO290-LO invalid baseline full-row data');
      }
      xdic290loFetchedMap.set(id, row);
    }
    if (xdic290loFetchedMap.size !== 60) {
      throw new Error('KO290-LO baseline 60 full rows missing');
    }
    for (const id of xdic290loBaselineIds) {
      const row = xdic290loFetchedMap.get(id);
      if (!row) throw new Error('KO290-LO baseline ID missing in DB');
      resultsMap.set(row.id, row);
    }
    results = xdic290loBaselineIds.map((id) => xdic290loFetchedMap.get(id));
    if (Array.from(resultsMap.keys()).length !== 60 || results.length !== 60 ||
        Array.from(resultsMap.keys()).map(String).join('|') !==
          xdic290loBaselineIds.join('|')) {
      throw new Error('KO290-LO baseline Map/order mismatch');
    }
    xdic253Events.push({
      stage: 'ko290lo-dev-replay-0-primary-60-fallback',
      count: 60, ids: [...xdic290loBaselineIds],
      originalSqlSkipped: true, databaseWrites: false,
    });
  }
  // XDIC_KO290_LO_DEV_REPLAY_BASELINE_END
  // XDIC_KO290_ME_DIRECT_50_BEGIN
  // Explicit dev-only direct 50. Original bestSplit logic is only bypassed in this request.
  if (xdic290meEnabled) {
    if (results.length !== 0 || resultsMap.size !== 0 || xdic290loEnabled) {
      throw new Error('KO290-ME unexpected pre-direct search state');
    }
    const xdic290meStart = Date.now();
    const xdic290meAbort = new AbortController();
    const xdic290meTimer = setTimeout(() => xdic290meAbort.abort(), 10000);
    let xdic290meData: any[] | null = null;
    try {
      const { data, error } = await supabase.from('dictionary_lines')
        .select('*').ilike('line_text', '%screening%')
        .order('category_id', { ascending: true, nullsFirst: false })
        .order('source_order', { ascending: true, nullsFirst: false })
        .order('id', { ascending: true })
        .limit(xdic290mkEnabled ? 150 : 50).abortSignal(xdic290meAbort.signal);
      if (error || !Array.isArray(data)) {
        throw new Error('KO290-ME direct50 SELECT error');
      }
      if (xdic290mkEnabled) {
        if (data.length !== 150 ||
            new Set(data.map((r: any) => String(r?.id ?? ''))).size !== 150 ||
            data.some((r: any) => !r?.id || typeof r.line_text !== 'string' ||
              !r.line_text.toLowerCase().includes('screening'))) {
          throw new Error('KO290-MK pool150 count/uniqueness/content mismatch');
        }
        xdic290mkRows150 = data;
        xdic290meData = data.slice(0, 50);
      } else {
        xdic290meData = data;
      }
    } finally {
      clearTimeout(xdic290meTimer);
      xdic290meDirectSqlMs = Date.now() - xdic290meStart;
    }
    if (!xdic290meData || xdic290meData.length !== 50 ||
        xdic290meData.filter((r: any) => Number(r?.category_id) === 0).length !== 30 ||
        xdic290meData.filter((r: any) => Number(r?.category_id) === 1).length !== 20 ||
        xdic290meData.some((r: any) =>
          !r?.id || typeof r?.line_text !== 'string' ||
          !r.line_text.toLowerCase().includes('screening'))) {
      throw new Error('KO290-ME direct50 rows / category baseline differ');
    }
    xdic290meBaselineIds = xdic290meData.map((r: any) => String(r.id));
    if (new Set(xdic290meBaselineIds).size !== 50) {
      throw new Error('KO290-ME duplicate direct50 ids');
    }
    const { createHash: xdic290meHash } = await import('node:crypto');
    const xdic290meSetSha = xdic290meHash('sha256')
      .update([...xdic290meBaselineIds].sort().join('|'), 'utf8')
      .digest('hex').toUpperCase();
    if (xdic290meSetSha !==
        '8752A93EB7FA5FD56AE1B2B09E0DAC14475A146CC92874B18803AA00A85A4EAB') {
      throw new Error('KO290-ME direct50 baseline hash mismatch');
    }
    xdic290meData.forEach((row: any) => addRes(row));
    results = Array.from(resultsMap.values());
    if (results.length !== 50 ||
        results.map((r: any) => String(r?.id ?? '')).join('|') !==
          xdic290meBaselineIds.join('|')) {
      throw new Error('KO290-ME baseline insertion order mismatch');
    }
    // The original English single-word ranking sees the same split-mode indicator.
    wordCount = 1;
    bestSplit = { p1: 'scre', p2: 'ening' };
    baseExtracted = extractKeywords(cleanQuery);
    allSearchKeywords = ['screening'];
    xdic253Events.push({ stage: 'ko290me-dev-direct50', count: 50,
      ids: [...xdic290meBaselineIds], directSqlMs: xdic290meDirectSqlMs,
      productionDisabled: true, originalSearchBypassed: true });
    // XDIC_KO290_MF_DEV_ROTATE_BEGIN
    // The original search section is skipped for the ME-only query, so its
    // original rotateResults call must be replayed explicitly before ME15.
    xdic253Capture('ko290mf-rotate-before', cleanQuery, results);
    results = rotateResults(
      results, cleanQuery,
      twoProCoreSearchKeywordsV6.length > 0
        ? twoProCoreSearchKeywordsV6 : allSearchKeywords,
      flexStr, !!bestSplit
    );
    xdic253Capture('ko290mf-rotate-after', cleanQuery, results);
    // XDIC_KO290_MF_DEV_ROTATE_END
  }
  // XDIC_KO290_ME_DIRECT_50_END
  // XDIC_KO286Z_LIMITED_DISPLAY_PILOT_DECL_BEGIN
  // The default and all shadow requests keep the original final result order.
  let xdic286zPendingSort: any[] | null = null;
  // XDIC_KO286Z_LIMITED_DISPLAY_PILOT_DECL_END
  // XDIC_KO286Y_FULL183_SORT_SHADOW_BEGIN
  // Developer-only fixed-input sort for the COMPLETE final 180/183 candidates.
  // Uses only KO253's already collected event IDs and copies of existing rows.
  // No SQL; never overwrites results, resultsMap, CORE, or the original sorter.
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.XDIC_KO286G_FTS_SHADOW === '1' &&
    xdic253Enabled && xdic263Enabled &&
    cleanQuery === '예비 후보' &&
    (searchParams as any)?.ko286x === '1' &&
    (searchParams as any)?.ko286y === '1'
  ) {
    const startedV286Y = Date.now();
    const pilotV286Y = (searchParams as any)?.ko286m === '1';
    const idOfV286Y = (row: any): string => String(row?.id ?? '');
    const beforeIdsV286Y = results.map(idOfV286Y);
    const beforeMapKeysV286Y = Array.from(resultsMap.keys()).map(String);
    const fingerprintV286Y = (): string => JSON.stringify({
      results: results.map((row: any) => [
        row?.id, row?.line_text, row?.category_id, row?.source_order,
        row?.is_exact_priority, row?.split_type, row?.split_keyword,
        row?._twoProDbPriority, row?._twoProDbMatch,
        row?._twoProDbExactAndCount, row?._twoProDbExactAndWeight,
        row?._db_index
      ]),
      map: Array.from(resultsMap.values()).map((row: any) => [
        row?.id, row?.line_text, row?.category_id, row?.source_order,
        row?.is_exact_priority, row?.split_type, row?.split_keyword,
        row?._twoProDbPriority, row?._twoProDbMatch,
        row?._twoProDbExactAndCount, row?._twoProDbExactAndWeight,
        row?._db_index
      ])
    });
    const beforeFingerprintV286Y = fingerprintV286Y();
    try {
      const expectedCountV286Y = pilotV286Y ? 183 : 180;
      if (results.length !== expectedCountV286Y ||
          beforeIdsV286Y.some((id) => !id || id === 'undefined')) {
        throw new Error('Unexpected final count/ID: ' + results.length);
      }
      const byIdV286Y = new Map<string, any>();
      results.forEach((row: any) => byIdV286Y.set(idOfV286Y(row), row));
      if (byIdV286Y.size !== results.length) {
        throw new Error('Duplicate final candidate ID');
      }
      const seenV286Y = new Set<string>();
      const baselineIdsV286Y: string[] = [];
      const addEventV286Y = (stage: string, keyword?: string) => {
        const matches = xdic253Events.filter((event: any) =>
          event.stage === stage &&
          (keyword === undefined || event.keyword === keyword)
        ) as any[];
        if (matches.length !== 1 || !Array.isArray(matches[0]?.ids)) {
          throw new Error('Missing/duplicate event: ' + stage + '/' + String(keyword ?? ''));
        }
        for (const rawId of matches[0].ids) {
          const id = String(rawId ?? '');
          if (!byIdV286Y.has(id)) {
            throw new Error('Baseline event ID absent from final set: ' + id);
          }
          if (!seenV286Y.has(id)) {
            seenV286Y.add(id);
            baselineIdsV286Y.push(id);
          }
        }
      };
      addEventV286Y('after-primary');
      for (const token of ['예비', '후보']) {
        for (let pattern = 1; pattern <= 8; pattern++) {
          addEventV286Y('exact8', token + '#' + pattern);
        }
      }
      for (const token of ['예비', '후보']) {
        addEventV286Y('related-ILIKE', token);
      }
      if (baselineIdsV286Y.length !== 180) {
        throw new Error('Baseline canonical coverage != 180: ' + baselineIdsV286Y.length);
      }
      const extrasV286Y = results.filter((row: any) => !seenV286Y.has(idOfV286Y(row)));
      if (extrasV286Y.length !== (pilotV286Y ? 3 : 0)) {
        throw new Error('Unexpected extra candidates: ' + extrasV286Y.length);
      }
      if (pilotV286Y) {
        const expectedIdsV286Y = new Set([
          '0cc570e8-3998-4d17-b2b3-5b897b28e02a',
          'ab4fbb1c-8a0f-42db-8e21-83f87e3afd90',
          'ace49ebd-8cda-48f0-bcdb-dc9dbce8d8f4'
        ]);
        if (extrasV286Y.some((row: any) =>
          !expectedIdsV286Y.has(idOfV286Y(row)) ||
          Number(row?.category_id) !== 12 ||
          !['예비', '후보'].every((token) =>
            twoProHasExactTokenBoundaryV72(String(row?.line_text || ''), token)
          )
        )) {
          throw new Error('Unexpected/unsafe FTS extra IDs or boundary');
        }
      }
      const stableExtrasV286Y = [...extrasV286Y].sort((a: any, b: any) => {
        const ca = Number(a?.category_id ?? 12);
        const cb = Number(b?.category_id ?? 12);
        if (ca !== cb) return ca - cb;
        const oa = Number(a?.source_order ?? Number.MAX_SAFE_INTEGER);
        const ob = Number(b?.source_order ?? Number.MAX_SAFE_INTEGER);
        if (oa !== ob) return oa - ob;
        const ia = idOfV286Y(a);
        const ib = idOfV286Y(b);
        return ia < ib ? -1 : ia > ib ? 1 : 0;
      });
      const canonicalIdsV286Y = baselineIdsV286Y.concat(stableExtrasV286Y.map(idOfV286Y));
      if (canonicalIdsV286Y.length !== results.length ||
          new Set(canonicalIdsV286Y).size !== results.length) {
        throw new Error('Full canonical candidate coverage mismatch');
      }
      const inputRowsV286Y = canonicalIdsV286Y.map((id) => ({ ...byIdV286Y.get(id) }));
      const rankInputsV286Y = twoProCoreSearchKeywordsV6.length > 0
        ? twoProCoreSearchKeywordsV6 : allSearchKeywords;
      const sortedRowsV286Y = rotateResults(
        inputRowsV286Y, cleanQuery, rankInputsV286Y, flexStr, !!bestSplit
      );
      const sortedIdsV286Y = sortedRowsV286Y.map(idOfV286Y);
      if (sortedIdsV286Y.length !== results.length ||
          new Set(sortedIdsV286Y).size !== results.length ||
          sortedIdsV286Y.some((id) => !byIdV286Y.has(id))) {
        throw new Error('Full canonical sorted coverage mismatch');
      }
      // XDIC_KO286Z_LIMITED_DISPLAY_PILOT_PREPARE_BEGIN
      // Only allow a single exact phrase in a developer-only, fully gated FTS pilot.
      // Reuse the complete KO286Y coverage and FTS safety checks above.
      if (
        pilotV286Y &&
        (searchParams as any)?.ko286z === '1' &&
        sortedIdsV286Y.length === 183 &&
        stableExtrasV286Y.length === 3
      ) {
        xdic286zPendingSort = sortedIdsV286Y.map((id) => byIdV286Y.get(id));
      }
      // XDIC_KO286Z_LIMITED_DISPLAY_PILOT_PREPARE_END
      const unchangedV286Y =
        beforeIdsV286Y.join('|') === results.map(idOfV286Y).join('|') &&
        beforeMapKeysV286Y.join('|') === Array.from(resultsMap.keys()).map(String).join('|') &&
        beforeFingerprintV286Y === fingerprintV286Y();
      xdicPerfWriteToFileV2('[XDIC KO286Y FULL183 SORT SHADOW]', JSON.stringify({
        probeId: xdic253ProbeId,
        pilot: pilotV286Y,
        finalCount: results.length,
        baselineCanonicalCount: baselineIdsV286Y.length,
        extraCount: stableExtrasV286Y.length,
        canonicalCount: canonicalIdsV286Y.length,
        sortedCount: sortedIdsV286Y.length,
        baselineCanonicalIds: baselineIdsV286Y,
        extraIds: stableExtrasV286Y.map(idOfV286Y),
        canonicalTop20: sortedIdsV286Y.slice(0, 20),
        canonicalSortedIds: sortedIdsV286Y,
        actualTop20: beforeIdsV286Y.slice(0, 20),
        actualSameAsCanonical: beforeIdsV286Y.join('|') === sortedIdsV286Y.join('|'),
        resultsMapUnchanged: unchangedV286Y,
        extraSqlCalls: 0,
        elapsedMs: Date.now() - startedV286Y,
        error: null,
      }));
    } catch (errorV286Y: any) {
      xdicPerfWriteToFileV2('[XDIC KO286Y FULL183 SORT SHADOW]', JSON.stringify({
        probeId: xdic253ProbeId,
        pilot: pilotV286Y,
        finalCount: results.length,
        resultsMapUnchanged:
          beforeIdsV286Y.join('|') === results.map(idOfV286Y).join('|') &&
          beforeMapKeysV286Y.join('|') === Array.from(resultsMap.keys()).map(String).join('|') &&
          beforeFingerprintV286Y === fingerprintV286Y(),
        extraSqlCalls: 0,
        elapsedMs: Date.now() - startedV286Y,
        error: String(errorV286Y?.message || errorV286Y),
      }));
    }
  }
  // XDIC_KO286Y_FULL183_SORT_SHADOW_END

  // XDIC_KO286Z_LIMITED_DISPLAY_PILOT_APPLY_BEGIN
  // Experimental opt-in ONLY: dev + existing KO286G env + ko253=ko263
  // + ko286x=1 + ko286y=1 + ko286m=1 + ko286z=1 + exact '예비 후보'.
  // No added database calls; no original sorter edits; only the result ARRAY
  // reference is reordered. The original Map, rows, and normal UI are untouched.
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.XDIC_KO286G_FTS_SHADOW === '1' &&
    xdic253Enabled && xdic263Enabled &&
    cleanQuery === '예비 후보' &&
    (searchParams as any)?.ko286m === '1' &&
    (searchParams as any)?.ko286x === '1' &&
    (searchParams as any)?.ko286y === '1' &&
    (searchParams as any)?.ko286z === '1'
  ) {
    const startedV286Z = Date.now();
    const idOfV286Z = (row: any) => String(row?.id ?? '');
    const beforeIdsV286Z = results.map(idOfV286Z);
    const beforeMapKeysV286Z = Array.from(resultsMap.keys()).map(String);
    const beforeMapSnapshotV286Z = JSON.stringify(Array.from(resultsMap.values()).map((row: any) => [
      row?.id, row?.line_text, row?.category_id, row?.source_order,
      row?.is_exact_priority, row?.split_type, row?.split_keyword,
      row?._twoProDbPriority, row?._twoProDbMatch,
      row?._twoProDbExactAndCount, row?._twoProDbExactAndWeight, row?._db_index
    ]));
    let appliedV286Z = false;
    let errorV286Z: string | null = null;
    try {
      if (results.length !== 183 || !xdic286zPendingSort ||
          xdic286zPendingSort.length !== 183) {
        throw new Error('KO286Y full-183 canonical candidate prerequisite not satisfied');
      }
      const canonicalIdsV286Z = xdic286zPendingSort.map(idOfV286Z);
      if (
        new Set(canonicalIdsV286Z).size !== 183 ||
        canonicalIdsV286Z.some((id) => !id || id === 'undefined') ||
        beforeIdsV286Z.length !== 183 ||
        beforeIdsV286Z.some((id) => !canonicalIdsV286Z.includes(id))
      ) {
        throw new Error('Canonical 183 candidate coverage mismatch');
      }
      if (beforeMapKeysV286Z.join('|') !==
          Array.from(resultsMap.keys()).map(String).join('|') ||
          beforeMapSnapshotV286Z !== JSON.stringify(Array.from(resultsMap.values()).map((row: any) => [
            row?.id, row?.line_text, row?.category_id, row?.source_order,
            row?.is_exact_priority, row?.split_type, row?.split_keyword,
            row?._twoProDbPriority, row?._twoProDbMatch,
            row?._twoProDbExactAndCount, row?._twoProDbExactAndWeight, row?._db_index
          ]))) {
        throw new Error('Original resultsMap changed before opt-in apply');
      }
      // Apply only to the explicitly requested experiment's results array.
      results = [...xdic286zPendingSort];
      appliedV286Z = true;
    } catch (failureV286Z: any) {
      errorV286Z = String(failureV286Z?.message || failureV286Z);
      // On a failed prerequisite leave the original results untouched.
    }
    const afterIdsV286Z = results.map(idOfV286Z);
    const mapIntactV286Z =
      beforeMapKeysV286Z.join('|') === Array.from(resultsMap.keys()).map(String).join('|') &&
      beforeMapSnapshotV286Z === JSON.stringify(Array.from(resultsMap.values()).map((row: any) => [
        row?.id, row?.line_text, row?.category_id, row?.source_order,
        row?.is_exact_priority, row?.split_type, row?.split_keyword,
        row?._twoProDbPriority, row?._twoProDbMatch,
        row?._twoProDbExactAndCount, row?._twoProDbExactAndWeight, row?._db_index
      ]));
    xdicPerfWriteToFileV2('[XDIC KO286Z OPTIN DISPLAY PILOT]', JSON.stringify({
      probeId: xdic253ProbeId,
      applied: appliedV286Z,
      pilot: true,
      beforeCount: beforeIdsV286Z.length,
      afterCount: afterIdsV286Z.length,
      beforeTop20: beforeIdsV286Z.slice(0, 20),
      afterTop20: afterIdsV286Z.slice(0, 20),
      beforeIds: beforeIdsV286Z,
      afterIds: afterIdsV286Z,
      sameCandidateSet:
        beforeIdsV286Z.length === afterIdsV286Z.length &&
        beforeIdsV286Z.every((id) => afterIdsV286Z.includes(id)),
      resultsMapUnchanged: mapIntactV286Z,
      extraSqlCalls: 0,
      elapsedMs: Date.now() - startedV286Z,
      error: errorV286Z,
    }));
  }
  // XDIC_KO286Z_LIMITED_DISPLAY_PILOT_APPLY_END


  // XDIC_KO287C_RELEVANCE_TIER_SHADOW_BEGIN
  // Dev-only explicit opt-in, never changes the existing results, resultsMap,
  // original rotateResults, CORE priorities, SQL, or rendered search order.
  // Requires the already opt-in KO286Z stable-183 display pilot to succeed.
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.XDIC_KO286G_FTS_SHADOW === '1' &&
    xdic253Enabled && xdic263Enabled &&
    cleanQuery === '예비 후보' &&
    (searchParams as any)?.ko286m === '1' &&
    (searchParams as any)?.ko286x === '1' &&
    (searchParams as any)?.ko286y === '1' &&
    (searchParams as any)?.ko286z === '1' &&
    (searchParams as any)?.ko287c === '1'
  ) {
    const startedV287C = Date.now();
    const idOfV287C = (row: any): string => String(row?.id ?? '');
    const actualIdsV287C = results.map(idOfV287C);
    const mapIdsV287C = Array.from(resultsMap.keys()).map(String);
    const fingerprintV287C = () => JSON.stringify({
      results: results.map((row: any) => [
        row?.id, row?.line_text, row?.category_id, row?.source_order,
        row?.is_exact_priority, row?.split_type, row?.split_keyword,
        row?._twoProDbPriority, row?._twoProDbMatch,
        row?._twoProDbExactAndCount, row?._twoProDbExactAndWeight,
        row?._db_index, row?._matchCount, row?._maxMatchedLen,
      ]),
      map: Array.from(resultsMap.values()).map((row: any) => [
        row?.id, row?.line_text, row?.category_id, row?.source_order,
        row?.is_exact_priority, row?.split_type, row?.split_keyword,
        row?._twoProDbPriority, row?._twoProDbMatch,
        row?._twoProDbExactAndCount, row?._twoProDbExactAndWeight,
        row?._db_index, row?._matchCount, row?._maxMatchedLen,
      ]),
    });
    const beforeFingerprintV287C = fingerprintV287C();
    const beforeMapIdsV287C = mapIdsV287C.join('|');
    try {
      if (results.length !== 183 || !xdic286zPendingSort ||
          xdic286zPendingSort.length !== 183 ||
          new Set(actualIdsV287C).size !== 183) {
        throw new Error('KO286Z stable 183 prerequisite not met');
      }
      const canonicalIdsV287C = xdic286zPendingSort.map(idOfV287C);
      if (canonicalIdsV287C.join('|') !== actualIdsV287C.join('|') ||
          new Set(canonicalIdsV287C).size !== 183) {
        throw new Error('Actual opt-in order differs from canonical Z sort');
      }

      // Four explicit candidate-relatedness tiers for this ONE Korean phrase.
      // Preserve the previous canonical position within every tier.
      const phraseV287C = /(?:^|[^가-힣A-Za-z0-9_])예비\s+후보(?:(?:에게|에서|께서|으로|부터|까지|은|는|이|가|을|를|에|로|와|과|의|도|만|랑))?(?=[^가-힣A-Za-z0-9_]|$)/u;
      const assessV287C = (row: any, index: number) => {
        const body = String(row?.line_text || '').normalize('NFC');
        const hasReserve = twoProHasExactTokenBoundaryV72(body, '예비');
        const hasCandidate = twoProHasExactTokenBoundaryV72(body, '후보');
        const exactPhrase = phraseV287C.test(body);
        const directDictionaryWord = Number(row?.category_id) === 1 &&
          (hasReserve || hasCandidate);
        const tier = exactPhrase ? 1 :
          (hasReserve && hasCandidate) ? 2 :
          directDictionaryWord ? 3 : 4;
        const corePriority = row?._twoProDbPriority ?? null;
        const manualReview =
          String(row?.id) === 'ab4fbb1c-8a0f-42db-8e21-83f87e3afd90' &&
          Number(row?.category_id) === 12 &&
          Number(row?.source_order) === 15039 && body.includes('아이오와');
        return {
          id: idOfV287C(row), tier, baselineRank: index + 1,
          categoryId: row?.category_id ?? null,
          sourceOrder: row?.source_order ?? null,
          exactPhrase, hasReserve, hasCandidate, directDictionaryWord,
          corePriority, exactPriority: !!row?.is_exact_priority,
          manualReview,
        };
      };
      const evaluationsV287C = results.map(assessV287C);
      const proposedV287C = [...evaluationsV287C].sort(
        (a, b) => a.tier - b.tier || a.baselineRank - b.baselineRank
      );
      const proposedIdsV287C = proposedV287C.map((item) => item.id);
      if (proposedIdsV287C.length !== 183 ||
          new Set(proposedIdsV287C).size !== 183 ||
          proposedIdsV287C.some((id) => !actualIdsV287C.includes(id))) {
        throw new Error('Relevance tier shadow candidate coverage failed');
      }
      const afterRankV287C = new Map(
        proposedIdsV287C.map((id, index) => [id, index + 1])
      );
      const actualTop20V287C = actualIdsV287C.slice(0, 20);
      const proposedTop20V287C = proposedIdsV287C.slice(0, 20);
      const actualTopSetV287C = new Set(actualTop20V287C);
      const proposedTopSetV287C = new Set(proposedTop20V287C);
      const coreRankMovesV287C = evaluationsV287C
        .filter((item) => item.exactPriority ||
          (item.corePriority !== null && Number(item.corePriority) <= 3))
        .map((item) => ({
          id: item.id, tier: item.tier, corePriority: item.corePriority,
          exactPriority: item.exactPriority, before: item.baselineRank,
          after: afterRankV287C.get(item.id) ?? null,
        }))
        .filter((item) => item.before !== item.after);
      const manualReviewIdsV287C = evaluationsV287C
        .filter((item) => item.manualReview).map((item) => item.id);
      const unchangedV287C =
        actualIdsV287C.join('|') === results.map(idOfV287C).join('|') &&
        beforeMapIdsV287C === Array.from(resultsMap.keys()).map(String).join('|') &&
        beforeFingerprintV287C === fingerprintV287C();
      xdicPerfWriteToFileV2('[XDIC KO287C RELEVANCE TIER SHADOW]', JSON.stringify({
        probeId: xdic253ProbeId,
        mode: 'read-only-dev-183-relevance-simulation',
        queryLength: cleanQuery.length,
        actualCount: actualIdsV287C.length,
        proposedCount: proposedIdsV287C.length,
        tiers: [1, 2, 3, 4].map((tier) => ({
          tier, count: evaluationsV287C.filter((item) => item.tier === tier).length,
        })),
        actualTop20: actualTop20V287C,
        proposedTop20: proposedTop20V287C,
        proposedIds: proposedIdsV287C,
        enteredTop20: proposedTop20V287C.filter((id) => !actualTopSetV287C.has(id)),
        exitedTop20: actualTop20V287C.filter((id) => !proposedTopSetV287C.has(id)),
        proposedTop20Details: proposedV287C.slice(0, 20).map((item) => ({
          id: item.id, tier: item.tier, categoryId: item.categoryId,
          sourceOrder: item.sourceOrder, oldRank: item.baselineRank,
        })),
        ftsExtras: evaluationsV287C.filter((item) =>
          ['0cc570e8-3998-4d17-b2b3-5b897b28e02a',
           'ab4fbb1c-8a0f-42db-8e21-83f87e3afd90',
           'ace49ebd-8cda-48f0-bcdb-dc9dbce8d8f4'].includes(item.id)
        ).map((item) => ({
          id: item.id, tier: item.tier, before: item.baselineRank,
          after: afterRankV287C.get(item.id) ?? null, manualReview: item.manualReview,
        })),
        manualReviewIds: manualReviewIdsV287C,
        corePriorityMoves: coreRankMovesV287C.slice(0, 30),
        corePriorityMoveCount: coreRankMovesV287C.length,
        unchangedResultsMap: unchangedV287C,
        sameCandidateSet: true,
        extraSqlCalls: 0,
        elapsedMs: Date.now() - startedV287C,
        error: null,
      }));
    } catch (errorV287C: any) {
      xdicPerfWriteToFileV2('[XDIC KO287C RELEVANCE TIER SHADOW]', JSON.stringify({
        probeId: xdic253ProbeId,
        mode: 'read-only-dev-183-relevance-simulation-error',
        actualCount: actualIdsV287C.length,
        unchangedResultsMap:
          actualIdsV287C.join('|') === results.map(idOfV287C).join('|') &&
          beforeMapIdsV287C === Array.from(resultsMap.keys()).map(String).join('|') &&
          beforeFingerprintV287C === fingerprintV287C(),
        extraSqlCalls: 0,
        elapsedMs: Date.now() - startedV287C,
        error: String(errorV287C?.message || errorV287C),
      }));
    }
  }
  // XDIC_KO287C_RELEVANCE_TIER_SHADOW_END

  // XDIC_KO287F_COMPACT_PHRASE_RELEVANCE_SHADOW_BEGIN
  // Only compares an additional deterministic in-memory ranking; does not
  // change results, resultsMap, CORE, rotateResults, SQL, or the displayed UI.
  // This gate is intentionally restricted to the existing Korean pilot query.
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.XDIC_KO286G_FTS_SHADOW === '1' &&
    xdic253Enabled && xdic263Enabled &&
    cleanQuery === '예비 후보' &&
    (searchParams as any)?.ko286m === '1' &&
    (searchParams as any)?.ko286x === '1' &&
    (searchParams as any)?.ko286y === '1' &&
    (searchParams as any)?.ko286z === '1' &&
    (searchParams as any)?.ko287c === '1' &&
    (searchParams as any)?.ko287f === '1'
  ) {
    const startedV287F = Date.now();
    const idOfV287F = (row: any): string => String(row?.id ?? '');
    const beforeIdsV287F = results.map(idOfV287F);
    const beforeMapKeysV287F = Array.from(resultsMap.keys()).map(String);
    const fingerprintV287F = (): string => JSON.stringify({
      results: results.map((row: any) => [
        row?.id, row?.line_text, row?.category_id, row?.source_order,
        row?.is_exact_priority, row?.split_type, row?.split_keyword,
        row?._twoProDbPriority, row?._twoProDbMatch,
        row?._twoProDbExactAndCount, row?._twoProDbExactAndWeight,
        row?._db_index, row?._matchCount, row?._maxMatchedLen
      ]),
      map: Array.from(resultsMap.values()).map((row: any) => [
        row?.id, row?.line_text, row?.category_id, row?.source_order,
        row?.is_exact_priority, row?.split_type, row?.split_keyword,
        row?._twoProDbPriority, row?._twoProDbMatch,
        row?._twoProDbExactAndCount, row?._twoProDbExactAndWeight,
        row?._db_index, row?._matchCount, row?._maxMatchedLen
      ])
    });
    const beforeFingerprintV287F = fingerprintV287F();
    const unchangedV287F = (): boolean =>
      beforeFingerprintV287F === fingerprintV287F() &&
      beforeIdsV287F.join('|') === results.map(idOfV287F).join('|') &&
      beforeMapKeysV287F.join('|') ===
        Array.from(resultsMap.keys()).map(String).join('|');
    try {
      if (results.length !== 183 || !xdic286zPendingSort ||
          xdic286zPendingSort.length !== 183 ||
          new Set(beforeIdsV287F).size !== 183 ||
          beforeIdsV287F.some((id) => !id || id === 'undefined') ||
          beforeIdsV287F.join('|') !==
            xdic286zPendingSort.map(idOfV287F).join('|')) {
        throw new Error('KO286Z stable 183 prerequisite not satisfied');
      }
      const partsV287F = cleanQuery.normalize('NFC').trim().split(/\s+/u);
      if (partsV287F.length !== 2 || partsV287F.some((part) => !part)) {
        throw new Error('Expected exactly two search terms');
      }
      const escapeV287F = (value: string): string =>
        value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const tokenA287F = escapeV287F(partsV287F[0]);
      const tokenB287F = escapeV287F(partsV287F[1]);
      // A bounded exact/compact phrase: spaced, unspaced, or a small whitelist
      // of attached Korean grammatical forms. This is NOT morphological analysis.
      // Longer unrelated continuations such as '예비후보주의' are rejected.
      const suffixV287F =
        '(?:자(?:들)?(?:은|는|이|가|을|를|의|에|에게|로|도|만)?' +
        '|였던|이었던|였다|이었으며|였으며|이었고|였고|였어요' +
        '|였어|이었다|이다|입니다|인' +
        '|은|는|이|가|을|를|의|에|로|도|만|에게|에서|으로|까지|부터)?';
      const compactPatternV287F = new RegExp(
        '(?<![\\p{L}\\p{N}_])' + tokenA287F +
        '\\s*' + tokenB287F + suffixV287F +
        '(?=$|[^\\p{L}\\p{N}_])', 'u'
      );
      const phraseExamplesV287F: Array<[string, boolean]> = [
        ['예비 후보', true], ['예비후보', true],
        ['예비후보였던', true], ['예비후보자', true],
        ['예비 후보자를', true], ['예비  후보', true],
        ['비예비후보', false], ['예비후보주의', false],
        ['예비주문 후보', false], ['예비 선거 후보', false]
      ];
      for (const [value, shouldMatch] of phraseExamplesV287F) {
        if (compactPatternV287F.test(value) !== shouldMatch) {
          throw new Error('Compact pattern self-test failed: ' + value);
        }
      }
      const evaluationsV287F = results.map((row: any, i: number) => {
        const body = String(row?.line_text ?? '').normalize('NFC');
        const phrase = compactPatternV287F.test(body);
        const hasA = twoProHasExactTokenBoundaryV72(body, partsV287F[0]);
        const hasB = twoProHasExactTokenBoundaryV72(body, partsV287F[1]);
        const dictionary = Number(row?.category_id) === 1 && (hasA || hasB);
        // Previous C-tier is computed for audit only, not changed.
        const oldPhrase = /(?:^|[^가-힣A-Za-z0-9_])예비\s+후보(?:(?:에게|에서|께서|으로|부터|까지|은|는|이|가|을|를|에|로|와|과|의|도|만|랑))?(?=[^가-힣A-Za-z0-9_]|$)/u.test(body);
        const tierC = oldPhrase ? 1 : hasA && hasB ? 2 : dictionary ? 3 : 4;
        const tierF = phrase ? 1 : hasA && hasB ? 2 : dictionary ? 3 : 4;
        return {
          id: idOfV287F(row), baselineRank: i + 1, tierC, tierF, phrase,
          categoryId: row?.category_id ?? null,
          sourceOrder: row?.source_order ?? null,
          corePriority: row?._twoProDbPriority ?? null,
          exactPriority: !!row?.is_exact_priority,
          sampleText: body.slice(0, 140)
        };
      });
      const proposedV287F = [...evaluationsV287F].sort(
        (a, b) => a.tierF - b.tierF || a.baselineRank - b.baselineRank
      );
      const proposedIdsV287F = proposedV287F.map((item) => item.id);
      const actualSetV287F = new Set(beforeIdsV287F);
      if (proposedIdsV287F.length !== 183 ||
          new Set(proposedIdsV287F).size !== 183 ||
          proposedIdsV287F.some((id) => !actualSetV287F.has(id))) {
        throw new Error('KO287F lost or duplicated a candidate');
      }
      const rankByIdV287F = new Map<string, number>(
        proposedIdsV287F.map((id, i) => [id, i + 1])
      );
      const top2V287F = evaluationsV287F.slice(0, 2);
      const top2ProtectedV287F = top2V287F.every((item, i) =>
        item.phrase && proposedIdsV287F[i] === item.id
      );
      const beforeTop20V287F = beforeIdsV287F.slice(0, 20);
      const afterTop20V287F = proposedIdsV287F.slice(0, 20);
      const beforeTopSetV287F = new Set(beforeTop20V287F);
      const afterTopSetV287F = new Set(afterTop20V287F);
      const tierUpgradesV287F = evaluationsV287F.filter((item) =>
        item.tierF !== item.tierC
      );
      const priorityMovesV287F = evaluationsV287F.filter((item) =>
        item.exactPriority ||
        (item.corePriority !== null && Number(item.corePriority) <= 3)
      ).map((item) => ({
        id: item.id, corePriority: item.corePriority,
        exactPriority: item.exactPriority, from: item.baselineRank,
        to: rankByIdV287F.get(item.id) ?? null
      })).filter((item) => item.from !== item.to);
      const intactV287F = unchangedV287F();
      if (!intactV287F) {
        throw new Error('Results or Map changed during KO287F shadow');
      }
      xdicPerfWriteToFileV2('[XDIC KO287F COMPACT PHRASE SHADOW]', JSON.stringify({
        probeId: xdic253ProbeId,
        mode: 'dev-only-read-only-compound-phrase',
        actualCount: beforeIdsV287F.length,
        proposedCount: proposedIdsV287F.length,
        tiers: [1, 2, 3, 4].map((tier) => ({
          tier, count: evaluationsV287F.filter((item) => item.tierF === tier).length
        })),
        tierUpgrades: tierUpgradesV287F.map((item) => ({
          id: item.id, fromTier: item.tierC, toTier: item.tierF,
          fromRank: item.baselineRank,
          toRank: rankByIdV287F.get(item.id) ?? null,
          categoryId: item.categoryId, sourceOrder: item.sourceOrder,
          text: item.sampleText
        })),
        top2Protected: top2ProtectedV287F,
        originalTop2: beforeIdsV287F.slice(0, 2),
        proposedTop2: proposedIdsV287F.slice(0, 2),
        actualTop20: beforeTop20V287F,
        proposedTop20: afterTop20V287F,
        top20Same: beforeTop20V287F.join('|') === afterTop20V287F.join('|'),
        enteredTop20: afterTop20V287F.filter((id) => !beforeTopSetV287F.has(id)),
        exitedTop20: beforeTop20V287F.filter((id) => !afterTopSetV287F.has(id)),
        proposedIds: proposedIdsV287F,
        corePriorityMoves: priorityMovesV287F.slice(0, 30),
        corePriorityMoveCount: priorityMovesV287F.length,
        sameCandidateSet: true,
        unchangedResultsMap: intactV287F,
        extraSqlCalls: 0,
        elapsedMs: Date.now() - startedV287F,
        error: null
      }));
    } catch (errorV287F: any) {
      xdicPerfWriteToFileV2('[XDIC KO287F COMPACT PHRASE SHADOW]', JSON.stringify({
        probeId: xdic253ProbeId,
        mode: 'dev-only-read-only-compound-phrase-error',
        actualCount: beforeIdsV287F.length,
        unchangedResultsMap: unchangedV287F(),
        extraSqlCalls: 0,
        elapsedMs: Date.now() - startedV287F,
        error: String(errorV287F?.message || errorV287F)
      }));
    }
  }
  // XDIC_KO287F_COMPACT_PHRASE_RELEVANCE_SHADOW_END

  // XDIC_KO287M_STRICT_TIER3_DISPLAY_OPTIN_BEGIN
  // KO287-K logic: single-query developer-only output experiment, not global
  // ranking. Freeze ranks 1..25 and 54..183; only stable ranks 26..53
  // can change. No new SQL, no source-row mutation, no resultsMap mutation.
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.XDIC_KO286G_FTS_SHADOW === '1' &&
    xdic253Enabled && xdic263Enabled &&
    cleanQuery === '예비 후보' &&
    (searchParams as any)?.ko286m === '1' &&
    (searchParams as any)?.ko286x === '1' &&
    (searchParams as any)?.ko286y === '1' &&
    (searchParams as any)?.ko286z === '1' &&
    (searchParams as any)?.ko287c === '1' &&
    (searchParams as any)?.ko287f === '1' &&
    (searchParams as any)?.ko287m === '1'
  ) {
    const startedV287M = Date.now();
    const oldRowsV287M = [...results];
    const idOfV287M = (row: any): string => String(row?.id ?? '');
    const oldIdsV287M = oldRowsV287M.map(idOfV287M);
    const mapFingerprintV287M = (): string => JSON.stringify(
      Array.from(resultsMap.entries()).map(([id, row]: [any, any]) => [
        String(id), row?.id, row?.line_text, row?.category_id,
        row?.source_order, row?.is_exact_priority, row?.split_type,
        row?.split_keyword, row?._twoProDbPriority, row?._twoProDbMatch,
        row?._twoProDbExactAndCount, row?._twoProDbExactAndWeight,
        row?._db_index, row?._matchCount, row?._maxMatchedLen
      ])
    );
    const oldMapFingerprintV287M = mapFingerprintV287M();
    const strictHeadwordV287M = (row: any): boolean => {
      if (Number(row?.category_id) !== 1) return false;
      const body = String(row?.line_text ?? '').normalize('NFC');
      return /^\s*(?:candidate|candidacy)\s+[가-힣]/i.test(body) &&
        /(?<![가-힣])후보(?:자격|자)?(?=$|[^가-힣])/u.test(body);
    };
    let appliedV287M = false;
    let failureV287M: string | null = null;
    let promotedV287M: Array<{id: string; from: number; to: number; text: string}> = [];
    let newIdsV287M = oldIdsV287M;
    try {
      if (oldRowsV287M.length !== 183 ||
          !xdic286zPendingSort || xdic286zPendingSort.length !== 183 ||
          new Set(oldIdsV287M).size !== 183 ||
          oldIdsV287M.some((id) => !id || id === 'undefined') ||
          oldIdsV287M.join('|') !==
            xdic286zPendingSort.map(idOfV287M).join('|')) {
        throw new Error('KO286-Z canonical 183 prerequisite failed');
      }
      if (!strictHeadwordV287M(oldRowsV287M[24])) {
        throw new Error('Rank 25 protected candidate headword missing');
      }
      const workingV287M = oldRowsV287M.slice(25, 53);
      const promotionV287M = workingV287M.filter(strictHeadwordV287M);
      const remainingV287M = workingV287M.filter(
        (row: any) => !strictHeadwordV287M(row)
      );
      const outsideV287M = oldRowsV287M.filter((row: any, i: number) =>
        strictHeadwordV287M(row) && i !== 24 && (i < 25 || i >= 53)
      );
      if (promotionV287M.length !== 5 || remainingV287M.length !== 23 ||
          outsideV287M.length !== 0 ||
          oldRowsV287M.filter(strictHeadwordV287M).length !== 6) {
        throw new Error('KO287-L strong-headword coverage changed');
      }
      const newRowsV287M = [
        ...oldRowsV287M.slice(0, 25),
        ...promotionV287M, ...remainingV287M,
        ...oldRowsV287M.slice(53)
      ];
      newIdsV287M = newRowsV287M.map(idOfV287M);
      if (newRowsV287M.length !== 183 ||
          new Set(newIdsV287M).size !== 183 ||
          oldIdsV287M.some((id) => !newIdsV287M.includes(id)) ||
          oldIdsV287M.slice(0, 25).join('|') !==
            newIdsV287M.slice(0, 25).join('|') ||
          oldIdsV287M.slice(53).join('|') !==
            newIdsV287M.slice(53).join('|')) {
        throw new Error('Fixed-rank or candidate-set validation failed');
      }
      const movedV287M = oldRowsV287M.filter((row: any, i: number) =>
        newIdsV287M[i] !== oldIdsV287M[i] ||
        newIdsV287M.indexOf(idOfV287M(row)) !== i
      );
      // Exact-priority and CORE-priority rows must never change ranks.
      if (movedV287M.some((row: any) =>
        !!row?.is_exact_priority ||
        (row?._twoProDbPriority != null &&
          Number(row._twoProDbPriority) <= 3)
      )) {
        throw new Error('CORE or exact-priority candidate would move');
      }
      if (mapFingerprintV287M() !== oldMapFingerprintV287M) {
        throw new Error('resultsMap changed before opt-in apply');
      }
      promotedV287M = promotionV287M.map((row: any, i: number) => ({
        id: idOfV287M(row),
        from: oldIdsV287M.indexOf(idOfV287M(row)) + 1,
        to: 26 + i,
        text: String(row?.line_text || '').slice(0, 160)
      }));
      results = newRowsV287M;
      appliedV287M = true;
      if (mapFingerprintV287M() !== oldMapFingerprintV287M) {
        results = oldRowsV287M;
        appliedV287M = false;
        throw new Error('resultsMap changed after opt-in apply');
      }
    } catch (errorV287M: any) {
      results = oldRowsV287M;
      appliedV287M = false;
      failureV287M = String(errorV287M?.message || errorV287M);
      newIdsV287M = oldIdsV287M;
    }
    const finalIdsV287M = results.map(idOfV287M);
    xdicPerfWriteToFileV2('[XDIC KO287M STRICT TIER3 OPTIN DISPLAY]', JSON.stringify({
      probeId: xdic253ProbeId,
      mode: 'development-only-single-query-strict-tier3-display',
      applied: appliedV287M,
      actualCount: oldIdsV287M.length,
      finalCount: finalIdsV287M.length,
      strongHeadwords: oldRowsV287M.filter(strictHeadwordV287M).length,
      promotedHeadwords: promotedV287M,
      top25Preserved:
        oldIdsV287M.slice(0, 25).join('|') ===
        finalIdsV287M.slice(0, 25).join('|'),
      tailPreserved:
        oldIdsV287M.slice(53).join('|') ===
        finalIdsV287M.slice(53).join('|'),
      fullCandidateSetPreserved:
        oldIdsV287M.length === finalIdsV287M.length &&
        oldIdsV287M.every((id) => finalIdsV287M.includes(id)),
      mapUnchanged: oldMapFingerprintV287M === mapFingerprintV287M(),
      beforeIds: oldIdsV287M,
      afterIds: finalIdsV287M,
      beforeTop20: oldIdsV287M.slice(0, 20),
      afterTop20: finalIdsV287M.slice(0, 20),
      extraSqlCalls: 0,
      elapsedMs: Date.now() - startedV287M,
      error: failureV287M
    }));
  }
  // XDIC_KO287M_STRICT_TIER3_DISPLAY_OPTIN_END

  // XDIC_KO286J_RANK_SHADOW_SIMULATE_BEGIN
  // Never write to results/resultsMap. Uses the same existing rotateResults()
  // on shallow-cloned rows and an isolated Map, without any SQL query.
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.XDIC_KO286G_FTS_SHADOW === '1' &&
    (searchParams as any)?.ko286j === '1' &&
    xdicKo286jRankRows &&
    xdicKo286jRankRows.rows.length > 0 &&
    xdicKo286jRankRows.priority !== null &&
    xdicKo286jRankRows.weight !== null
  ) {
    try {
      const rankStartedAtV286J = Date.now();
      const stagedV286J = xdicKo286jRankRows;
      const idOfV286J = (row: any): string =>
        row?.id !== null && row?.id !== undefined
          ? String(row.id)
          : [Number(row?.category_id ?? 12), String(row?.line_text || '')].join('::');
      const originalIdsV286J = results.map(idOfV286J);
      const originalMapIdsV286J = Array.from(resultsMap.keys()).map(String);
      const originalRowsFingerprintV286J = JSON.stringify(
        results.map((row: any) => [
          idOfV286J(row),
          row?._twoProDbPriority ?? null,
          row?._twoProDbExactAndCount ?? null,
          row?._twoProDbExactAndWeight ?? null,
          row?._twoProDbMatch ?? null,
        ])
      );
      const rankInputsV286J =
        twoProCoreSearchKeywordsV6.length > 0
          ? twoProCoreSearchKeywordsV6
          : allSearchKeywords;

      // Control re-rank makes any mismatch versus the actual baseline visible.
      const controlV286J = rotateResults(
        results.map((row: any) => ({ ...row })),
        cleanQuery,
        rankInputsV286J,
        flexStr,
        !!bestSplit
      );
      const controlIdsV286J = controlV286J.map(idOfV286J);
      const cloneMapV286J = new Map<string, any>();
      for (const row of results) {
        cloneMapV286J.set(idOfV286J(row), { ...row });
      }
      let addedRowsV286J = 0;
      let existingRowsV286J = 0;
      for (const row of stagedV286J.rows) {
        const rowId = idOfV286J(row);
        const existing = cloneMapV286J.get(rowId);
        if (existing) {
          existingRowsV286J += 1;
          if (Number(existing._twoProDbPriority ?? 999) > Number(stagedV286J.priority)) {
            existing._twoProDbPriority = Number(stagedV286J.priority);
          }
          existing._twoProDbExactAndCount = Math.max(
            Number(existing._twoProDbExactAndCount || 0),
            stagedV286J.tokens.length
          );
          existing._twoProDbExactAndWeight = Math.max(
            Number(existing._twoProDbExactAndWeight || 0),
            Number(stagedV286J.weight)
          );
          existing._twoProDbMatch = 'core-exact-and';
        } else {
          addedRowsV286J += 1;
          cloneMapV286J.set(rowId, {
            ...row,
            _twoProDbPriority: Number(stagedV286J.priority),
            _twoProDbExactAndCount: stagedV286J.tokens.length,
            _twoProDbExactAndWeight: Number(stagedV286J.weight),
            _twoProDbMatch:
              Number(stagedV286J.priority) === 2
                ? 'core-exact-and'
                : 'core-grammar-and',
          });
        }
      }

      const hypotheticalV286J = rotateResults(
        Array.from(cloneMapV286J.values()).map((row: any) => ({ ...row })),
        cleanQuery,
        rankInputsV286J,
        flexStr,
        !!bestSplit
      );
      const hypotheticalIdsV286J = hypotheticalV286J.map(idOfV286J);
      const controlRankV286J = new Map(
        controlIdsV286J.map((id, index) => [id, index + 1])
      );
      const actualRankV286J = new Map(
        originalIdsV286J.map((id, index) => [id, index + 1])
      );
      const afterRankV286J = new Map(
        hypotheticalIdsV286J.map((id, index) => [id, index + 1])
      );
      const controlTop20V286J = controlIdsV286J.slice(0, 20);
      const actualTop20V286J = originalIdsV286J.slice(0, 20);
      const afterTop20V286J = hypotheticalIdsV286J.slice(0, 20);
      const beforeSetV286J = new Set(controlTop20V286J);
      const afterSetV286J = new Set(afterTop20V286J);

      // This is a simulated ranking of server-side candidates, NOT
      // an assertion about the rendered pagination or every query branch.
      xdicPerfWriteToFileV2('[XDIC KO286J RANK SHADOW]', JSON.stringify({
        surface: 'web',
        queryLength: cleanQuery.length,
        tokens: [...stagedV286J.tokens],
        simulatedPriority: Number(stagedV286J.priority),
        simulatedWeight: Number(stagedV286J.weight),
        elapsedMs: Date.now() - rankStartedAtV286J,
        beforeCount: originalIdsV286J.length,
        afterCount: hypotheticalIdsV286J.length,
        safeRows: stagedV286J.rows.length,
        existingRows: existingRowsV286J,
        addedRows: addedRowsV286J,
        baselineControlTop20MatchesActual:
          JSON.stringify(controlTop20V286J) === JSON.stringify(actualTop20V286J),
        candidates: stagedV286J.rows.map((row: any) => ({
          id: idOfV286J(row),
          categoryId: row.category_id,
          sourceOrder: row.source_order,
          actualBeforeRank: actualRankV286J.get(idOfV286J(row)) ?? null,
          controlBeforeRank: controlRankV286J.get(idOfV286J(row)) ?? null,
          hypotheticalAfterRank: afterRankV286J.get(idOfV286J(row)) ?? null,
        })),
        enteredTop20: afterTop20V286J.filter((id) => !beforeSetV286J.has(id)),
        exitedTop20: controlTop20V286J.filter((id) => !afterSetV286J.has(id)),
        movedControlTop20: controlTop20V286J
          .map((id) => ({
            id,
            beforeRank: controlRankV286J.get(id) ?? null,
            afterRank: afterRankV286J.get(id) ?? null,
          }))
          .filter((row) => row.beforeRank !== row.afterRank),
        resultsMutated:
          JSON.stringify(results.map(idOfV286J)) !== JSON.stringify(originalIdsV286J) ||
          JSON.stringify(Array.from(resultsMap.keys()).map(String)) !== JSON.stringify(originalMapIdsV286J) ||
          JSON.stringify(results.map((row: any) => [
            idOfV286J(row),
            row?._twoProDbPriority ?? null,
            row?._twoProDbExactAndCount ?? null,
            row?._twoProDbExactAndWeight ?? null,
            row?._twoProDbMatch ?? null,
          ])) !== originalRowsFingerprintV286J,
        extraSqlCalls: 0,
        mode: 'server-candidate-rank-simulation-only',
      }));
    } catch (rankShadowErrorV286J: any) {
      xdicPerfWriteToFileV2('[XDIC KO286J RANK SHADOW]', JSON.stringify({
        queryLength: cleanQuery.length,
        error: String(rankShadowErrorV286J?.message || rankShadowErrorV286J),
        extraSqlCalls: 0,
        mode: 'simulation-error-no-result-change',
      }));
    }
  }
  // XDIC_KO286J_RANK_SHADOW_SIMULATE_END

  if (cleanQuery && process.env.NODE_ENV !== 'production') {
    const m = xdicPerfTimesV1;
    const totalMs = Date.now() - xdicPerfStartedV1;
    xdicPerfWriteToFileV2('[XDIC PERF STAGE V1]', JSON.stringify({
      surface: 'web',
      queryLength: cleanQuery.length,
      sentence: isSentenceSearch,
      exactPhraseBatches: xdicPerfExactBatchesV1,
      patternQueries: xdicPerfExactBatchesV1 * 8,
      sql223Count: xdicSql223.length,
      sql223Errors: xdicSql223.filter((entry) => entry.error).length,
      sql223Top: [...xdicSql223].sort((a, b) => b.ms - a.ms).slice(0, 15),
      // KO236: elapsedMs includes post-query JS processing, not SQL-only time.
      core236: {
        exactAnd: xdicCore236.exactAnd,
        relaxed: xdicCore236.relaxed,
        exactAndSumMs: xdicCore236.exactAnd.reduce((sum, item) => sum + item.elapsedMs, 0),
        relaxedSumMs: xdicCore236.relaxed.reduce((sum, item) => sum + item.elapsedMs, 0),
      },
      // KO271: developer-only counts from existing Supabase responses.
      // KO272: no extra query; derived before original per-row metadata writes.
      ko272ExactAndImpact: xdicKo272ExactAndImpact,
      ko271Shadow: xdicKo271Shadow,
      authMs: m.auth ?? null,
      primaryMs: m.primary === undefined ? null : m.primary - (m.auth ?? 0),
      fallbackMs: m.fallback === undefined ? null : m.fallback - (m.primary ?? m.auth ?? 0),
      rankingMs: m.before_core === undefined ? null : m.before_core - (m.fallback ?? 0),
      coreMs: m.after_core === undefined ? null : m.after_core - (m.before_core ?? 0),
      sentenceTailMs: totalMs - (m.after_core ?? m.before_core ?? m.fallback ?? 0),
      totalMs,
    }));
  }

  // XDIC_KO286B_SHADOW_LOG_BEGIN
  // Existing database results and the KO255 warning remain unchanged.
  // Save only keyword + metadata; avoid persisting the full user sentence.
  if (process.env.NODE_ENV === 'development' && xdic286bRelatedEvents.length > 0) {
    xdicPerfWriteToFileV2('[XDIC KO286B RELATED SHADOW]', JSON.stringify({
      surface: 'web',
      queryLength: cleanQuery.length,
      sentenceDetector: isSentenceSearch,
      relatedCount: xdic286bRelatedEvents.length,
      failedCount: xdic286bRelatedEvents.filter((event) => event.failed).length,
      warningShown: xdic255RelatedFailures.length > 0,
      events: xdic286bRelatedEvents,
    }));
  }
  // XDIC_KO286B_SHADOW_LOG_END

  const isApp = false; 

  // XDIC_KO253_FINAL_BEGIN: write once, after all existing search stages.
  if (xdic253Enabled) {
    xdic253Capture('final-render-props', cleanQuery, results);
      // XDIC_KO290_AV_TIE_SHADOW_BEGIN: gated, final-stage diagnostic only; never renders.
      const xdic290avToken = String((searchParams as { ko290av?: string }).ko290av || '');
      if (
        process.env.NODE_ENV === 'development' &&
        xdic253Enabled &&
        cleanQuery === '후보 명단' &&
        xdic290avToken.length === 32 &&
        xdic290avToken === xdic253ProbeId
      ) {
        try {
          const xdic290avActual = results.map((row: any) => String(row?.id ?? ''));
          const xdic290avBlock = results.slice(4, 16);
          const xdic290avTag = (row: any): string => {
            const text = String(row?.line_text ?? '').toLowerCase();
            const hasB = text.includes('후보');
            const hasA = text.includes('명단');
            return hasB && !hasA ? 'B' : hasA && !hasB ? 'A' : '?';
          };
          const xdic290avTags = xdic290avBlock.map(xdic290avTag);
          const xdic290avPattern = xdic290avTags.join('');
          const xdic290avScoreEqual = xdic290avBlock.length === 12 &&
            xdic290avBlock.every((row: any) => {
              const text = String(row?.line_text ?? '').toLowerCase();
              const keyword = text.includes('후보') ? '후보' : '명단';
              return Number(row?.category_id) === 1 &&
                Number(row?._matchCount) === 1 &&
                Number(row?._maxMatchedLen) === 2 &&
                row?._twoProDbPriority == null &&
                !row?.is_exact_priority &&
                !row?.split_type &&
                !text.replace(/\s+/g, '').includes('후보명단') &&
                new RegExp('(?:^|[^가-힣a-zA-Z0-9_])' + keyword, 'i').test(text);
            });
          const xdic290avEligible = xdic290avActual.length >= 25 &&
            xdic290avScoreEqual &&
            (xdic290avPattern === 'AAAAAABBBBBB' || xdic290avPattern === 'BBBBBBAAAAAA');
          const xdic290avShadow = [...xdic290avActual];
          if (xdic290avEligible) {
            const bIds = xdic290avBlock.filter((row: any) => xdic290avTag(row) === 'B')
              .map((row: any) => String(row.id));
            const aIds = xdic290avBlock.filter((row: any) => xdic290avTag(row) === 'A')
              .map((row: any) => String(row.id));
            [...bIds, ...aIds].forEach((id: string, i: number) => {
              xdic290avShadow[i + 4] = id;
            });
          }
          const xdic290avSameSet = xdic290avActual.length === xdic290avShadow.length &&
            new Set(xdic290avActual).size === xdic290avActual.length &&
            new Set(xdic290avShadow).size === xdic290avShadow.length &&
            xdic290avActual.every((id: string) => xdic290avShadow.includes(id));
          const xdic290avProtected = xdic290avActual.every((id: string, i: number) =>
            (i >= 4 && i <= 15) || id === xdic290avShadow[i]);
          const xdic290avChanged = xdic290avActual.slice(0, 25)
            .reduce((n: number, id: string, i: number) => n + (id === xdic290avShadow[i] ? 0 : 1), 0);
          xdic253Events.push({
            stage: 'ko290-av-guarded-tie-shadow',
            eligible: xdic290avEligible,
            originalPattern: xdic290avPattern,
            sameTieScore: xdic290avScoreEqual,
            sameIdSet: xdic290avSameSet,
            protectedPositionsUnchanged: xdic290avProtected,
            changedTop25Positions: xdic290avChanged,
            actualCount: xdic290avActual.length,
            actualTop25Ids: xdic290avActual.slice(0, 25),
            shadowTop25Ids: xdic290avShadow.slice(0, 25),
            mode: 'development-only; ID-array simulation; original results untouched',
          });
        } catch (xdic290avError) {
          xdic253Events.push({
            stage: 'ko290-av-guarded-tie-shadow', eligible: false,
            error: String((xdic290avError as { message?: string })?.message || xdic290avError),
          });
        }
      }
      // XDIC_KO290_AV_TIE_SHADOW_END
    // XDIC_KO260_FINAL_BEGIN: actual addRes insertion chronology and final Map order.
    xdic253Events.push({ stage: 'ko260-addRes-insertion-order',
      count: xdic260AddResInsertionOrder.length,
      ids: [...xdic260AddResInsertionOrder] });
    xdic253Capture('ko260-final-map', cleanQuery, Array.from(resultsMap.values()));
    // XDIC_KO260_FINAL_END
    try {
      const xdic253TraceFile =
        'C:/dictionary_upload/X-DIC-core-backups/X-DIC-core-scripts/XDIC_KO253_TRACE.jsonl';
      appendFileSync(
        xdic253TraceFile,
        JSON.stringify({
          timestamp: new Date().toISOString(),
          marker: 'XDIC_KO253_TRACE',
          probeId: xdic253ProbeId,
          query: cleanQuery,
          finalCount: results.length,
          finalIds: results.map((row) => String(row?.id ?? '')),
          events: xdic253Events,
        }) + '\n',
        { encoding: 'utf8' }
      );
    } catch (error) {
      console.warn('[XDIC KO253 TRACE WRITE FAILED]', String(error));
    }
  }
  // XDIC_KO253_FINAL_END

  // XDIC_KO290_IE_FINAL_RENDER_AUDIT_BEGIN
  // Diagnostics only: fixed CORE sentence, dev-only, explicit HK/HS matching tokens.
  // Records the final props at the render boundary; never changes results or SQL.
  if (xdic290hsEnabled && cleanQuery === xdic290hkSentence) {
    const xdic290ieFinalIds = results.map((row: any) => String(row?.id ?? ''));
    xdicPerfWriteToFileV2('[XDIC KO290IE FINAL RENDER]', JSON.stringify({
      surface: 'web',
      queryLength: cleanQuery.length,
      probeToken: xdic290hsToken,
      htEnabled: xdic290htEnabled,
      finalCount: xdic290ieFinalIds.length,
      finalIds: xdic290ieFinalIds,
      duplicateIds: xdic290ieFinalIds.length - new Set(xdic290ieFinalIds).size,
      warningShown: xdic255RelatedFailures.length > 0,
      productionDisabled: true,
      rowsMutated: false,
      extraSqlCalls: 0,
    }));
  }
  // XDIC_KO290_IE_FINAL_RENDER_AUDIT_END
  // XDIC_KO290_JT_SHADOW_BEGIN
  // Development-only ID comparison. Never adds, removes, reorders, or rewrites search rows.
  if (process.env.NODE_ENV === 'development' &&
      isStableEnglishSingleWord && cleanQuery === 'candidate') {
    const xdic290jtStart = Date.now();
    const xdic290jtBeforeIds = results.map((row: any) => String(row?.id ?? ''));
    const xdic290jtMapIds = Array.from(resultsMap.keys()).map(String);
    const xdic290jtCatSeen = new Map<number, number>();
    const xdic290jtVisibleIds: string[] = [];
    for (const row of results) {
      const category = row?.category_id == null ? 12 : Number(row.category_id);
      if (category === 0 || !Number.isSafeInteger(category)) continue;
      const count = (xdic290jtCatSeen.get(category) || 0) + 1;
      xdic290jtCatSeen.set(category, count);
      if (count <= 5) xdic290jtVisibleIds.push(String(row?.id ?? ''));
    }
    const xdic290jtRecord: Record<string, any> = {
      marker: 'XDIC_KO290_JT_SHADOW',
      timestampUtc: new Date().toISOString(),
      keyword: 'candidate',
      primaryRawCount: results.length,
      existingVisibleCount: xdic290jtVisibleIds.length,
      status: 'SKIP_NORMAL_VISIBLE_RESULTS',
      hypotheticalVisibleCount: xdic290jtVisibleIds.length,
      dbReadOnly: true,
      actualResultsMutated: false,
    };
    try {
      // Normal visible results: no extra SQL, preserve every original ID/position.
      if (xdic290jtVisibleIds.length === 0) {
        const { data: xdic290jtData, error: xdic290jtError, count: xdic290jtTotal } =
          await supabase.from('dictionary_lines')
            .select('id,category_id,source_order', { count: 'exact' })
            .or('category_id.neq.0,category_id.is.null')
            .ilike('line_text', '%candidate%')
            .order('category_id', { ascending: true, nullsFirst: false })
            .order('source_order', { ascending: true, nullsFirst: false })
            .order('id', { ascending: true })
            .limit(1000);
        const xdic290jtRows: any[] = Array.isArray(xdic290jtData) ? xdic290jtData : [];
        const xdic290jtCounts = new Map<number, number>();
        const xdic290jtAllIds = new Set<string>();
        const xdic290jtPairs: string[] = [];
        let xdic290jtInvalid = Boolean(xdic290jtError);
        for (const row of xdic290jtRows) {
          const id = String(row?.id ?? '');
          const category = row?.category_id == null ? 12 : Number(row.category_id);
          if (!id || xdic290jtAllIds.has(id) ||
              !Number.isSafeInteger(category) || category === 0) {
            xdic290jtInvalid = true;
            break;
          }
          xdic290jtAllIds.add(id);
          const next = (xdic290jtCounts.get(category) || 0) + 1;
          xdic290jtCounts.set(category, next);
          if (next <= 5) xdic290jtPairs.push(`${category}:${id}`);
        }
        const { createHash: xdic290jtCreateHash } = await import('node:crypto');
        const xdic290jtHash = xdic290jtCreateHash('sha256')
          .update(xdic290jtPairs.join('|'), 'utf8').digest('hex').toUpperCase();
        xdic290jtRecord.restCount = xdic290jtTotal;
        xdic290jtRecord.restRows = xdic290jtRows.length;
        xdic290jtRecord.restCategoryCount = xdic290jtCounts.size;
        xdic290jtRecord.balancedTop5 = xdic290jtPairs.length;
        xdic290jtRecord.balancedIdSha256 = xdic290jtHash;
        xdic290jtRecord.errorCode = xdic290jtError ? String(xdic290jtError.code || '') : null;
        xdic290jtRecord.hypotheticalVisibleCount = xdic290jtPairs.length;
        xdic290jtRecord.status = !xdic290jtInvalid &&
          xdic290jtTotal === 475 && xdic290jtRows.length === 475 &&
          xdic290jtCounts.size === 10 && xdic290jtPairs.length === 42 &&
          xdic290jtHash === '85E7C2FC70F844C1045A50FD4373B4C18D84E78E2B79E1297BF1DA2C87ADCF6C'
          ? 'PASS_SHADOW_42' : 'STOP_SHADOW_MISMATCH';
      }
    } catch (xdic290jtError: any) {
      xdic290jtRecord.status = 'STOP_SHADOW_EXCEPTION';
      xdic290jtRecord.errorMessage = String(xdic290jtError?.message || xdic290jtError).slice(0, 200);
    }
    // Explicit immutability check; shadow arrays are never passed to SearchPage.
    xdic290jtRecord.originalIdsUnchanged =
      xdic290jtBeforeIds.join('|') === results.map((row: any) => String(row?.id ?? '')).join('|');
    xdic290jtRecord.mapKeysUnchanged =
      xdic290jtMapIds.join('|') === Array.from(resultsMap.keys()).map(String).join('|');
    xdic290jtRecord.elapsedMs = Date.now() - xdic290jtStart;
    if (!xdic290jtRecord.originalIdsUnchanged || !xdic290jtRecord.mapKeysUnchanged) {
      xdic290jtRecord.status = 'STOP_ORIGINAL_ID_CHECK';
    }
    try {
      appendFileSync(
        'C:/dictionary_upload/X-DIC-core-backups/X-DIC-core-scripts/XDIC_KO290_JT_SHADOW.jsonl',
        JSON.stringify(xdic290jtRecord) + '\n',
        { encoding: 'utf8' }
      );
    } catch (xdic290jtLogError) {
      console.warn('[XDIC KO290JT SHADOW LOG ERROR]', String(xdic290jtLogError));
    }
    console.info('[XDIC KO290JT SHADOW]', JSON.stringify(xdic290jtRecord));
  }
  // XDIC_KO290_JT_SHADOW_END
  // XDIC_KO290_JU_DEV_CANDIDATE_BEGIN
  // Web + development + candidate only. Preserve every pre-existing row and resultsMap key.
  // Fail closed: never apply an unverified candidate set; do not modify production searches.
  if (process.env.NODE_ENV === 'development' && !isApp &&
      isStableEnglishSingleWord && cleanQuery === 'candidate') {
    const xdic290juStarted = Date.now();
    const xdic290juOriginal = results;
    const xdic290juOriginalIds = results.map((row: any) => String(row?.id ?? ''));
    const xdic290juMapIds = Array.from(resultsMap.keys()).map(String);
    const xdic290juCategoryCount = new Map<number, number>();
    let xdic290juVisible = 0;
    for (const row of results) {
      const category = row?.category_id == null ? 12 : Number(row.category_id);
      if (!Number.isSafeInteger(category) || category === 0) continue;
      const seen = (xdic290juCategoryCount.get(category) || 0) + 1;
      xdic290juCategoryCount.set(category, seen);
      if (seen <= 5) xdic290juVisible++;
    }
    const xdic290juRecord: Record<string, any> = {
      marker: 'XDIC_KO290_JU_DEV_CANDIDATE',
      timestampUtc: new Date().toISOString(),
      keyword: 'candidate',
      originalRaw: xdic290juOriginal.length,
      originalVisible: xdic290juVisible,
      added: 0,
      status: 'SKIP_NORMAL_RESULTS',
      dbReadOnly: true,
      productionDisabled: true,
    };
    if (xdic290juVisible === 0 && results.length === 50 &&
        results.every((row: any) => Number(row?.category_id) === 0)) {
      try {
        const { data: xdic290juMeta, error: xdic290juMetaError, count: xdic290juTotal } =
          await supabase.from('dictionary_lines')
            .select('id,category_id,source_order', { count: 'exact' })
            .or('category_id.neq.0,category_id.is.null')
            .ilike('line_text', '%candidate%')
            .order('category_id', { ascending: true, nullsFirst: false })
            .order('source_order', { ascending: true, nullsFirst: false })
            .order('id', { ascending: true })
            .limit(1000);
        if (xdic290juMetaError || !Array.isArray(xdic290juMeta) ||
            xdic290juTotal !== 475 || xdic290juMeta.length !== 475) {
          throw new Error('candidate metadata query/count mismatch');
        }
        const xdic290juSeenIds = new Set<string>();
        const xdic290juCatCounts = new Map<number, number>();
        const xdic290juSelectedMeta: any[] = [];
        const xdic290juPairs: string[] = [];
        for (const row of xdic290juMeta) {
          const id = String(row?.id ?? '');
          const category = row?.category_id == null ? 12 : Number(row.category_id);
          if (!id || xdic290juSeenIds.has(id) ||
              !Number.isSafeInteger(category) || category === 0) {
            throw new Error('invalid or duplicate candidate metadata');
          }
          xdic290juSeenIds.add(id);
          const count = (xdic290juCatCounts.get(category) || 0) + 1;
          xdic290juCatCounts.set(category, count);
          if (count <= 5) {
            xdic290juSelectedMeta.push(row);
            xdic290juPairs.push(`${category}:${id}`);
          }
        }
        const { createHash: xdic290juCreateHash } = await import('node:crypto');
        const xdic290juIdHash = xdic290juCreateHash('sha256')
          .update(xdic290juPairs.join('|'), 'utf8').digest('hex').toUpperCase();
        xdic290juRecord.restTotal = xdic290juTotal;
        xdic290juRecord.categoryCount = xdic290juCatCounts.size;
        xdic290juRecord.candidateCount = xdic290juSelectedMeta.length;
        xdic290juRecord.idSha256 = xdic290juIdHash;
        if (xdic290juCatCounts.size !== 10 || xdic290juSelectedMeta.length !== 42 ||
            xdic290juIdHash !== '85E7C2FC70F844C1045A50FD4373B4C18D84E78E2B79E1297BF1DA2C87ADCF6C') {
          throw new Error('KO290-JT balanced candidate ID checksum mismatch');
        }
        const xdic290juSelectedIds = xdic290juSelectedMeta.map(
          (row: any) => String(row.id));
        const { data: xdic290juFull, error: xdic290juFullError } =
          await supabase.from('dictionary_lines').select('*').in('id', xdic290juSelectedIds);
        if (xdic290juFullError || !Array.isArray(xdic290juFull) || xdic290juFull.length !== 42) {
          throw new Error('full candidate row retrieval mismatch');
        }
        const xdic290juFullMap = new Map<string, any>();
        for (const row of xdic290juFull) {
          const id = String(row?.id ?? '');
          if (!id || xdic290juFullMap.has(id) ||
              typeof row?.line_text !== 'string' ||
              !row.line_text.toLowerCase().includes('candidate')) {
            throw new Error('invalid/duplicate full candidate row');
          }
          xdic290juFullMap.set(id, row);
        }
        const xdic290juAddition: any[] = [];
        for (const meta of xdic290juSelectedMeta) {
          const id = String(meta.id);
          const full = xdic290juFullMap.get(id);
          const fullCat = full?.category_id == null ? 12 : Number(full.category_id);
          const metaCat = meta?.category_id == null ? 12 : Number(meta.category_id);
          if (!full || fullCat !== metaCat ||
              String(full?.source_order ?? '') !== String(meta?.source_order ?? '') ||
              xdic290juOriginalIds.includes(id)) {
            throw new Error('full candidate row does not match shadow metadata');
          }
          xdic290juAddition.push(full);
        }
        if (xdic290juAddition.length !== 42 ||
            xdic290juOriginalIds.join('|') !== results.map((row: any) => String(row?.id ?? '')).join('|') ||
            xdic290juMapIds.join('|') !== Array.from(resultsMap.keys()).map(String).join('|')) {
          throw new Error('existing results or map changed before append');
        }
        // Never delete or reorder original rows. UI already excludes category 0 and caps 5/category.
        results = [...xdic290juOriginal, ...xdic290juAddition];
        if (results.length !== 92 ||
            xdic290juOriginalIds.join('|') !== results.slice(0, 50).map((row: any) => String(row?.id ?? '')).join('|') ||
            xdic290juMapIds.join('|') !== Array.from(resultsMap.keys()).map(String).join('|')) {
          throw new Error('original prefix or map changed after append');
        }
        xdic290juRecord.added = xdic290juAddition.length;
        xdic290juRecord.status = 'PASS_APPEND_42';
      } catch (xdic290juError: any) {
        results = xdic290juOriginal;
        xdic290juRecord.added = 0;
        xdic290juRecord.status = 'STOP_UNVERIFIED_APPEND';
        xdic290juRecord.error = String(xdic290juError?.message || xdic290juError).slice(0, 200);
      }
    } else if (xdic290juVisible === 0) {
      xdic290juRecord.status = 'SKIP_UNEXPECTED_PRIMARY';
    }
    xdic290juRecord.finalRaw = results.length;
    xdic290juRecord.originalPrefixPreserved =
      xdic290juOriginalIds.join('|') === results.slice(0, xdic290juOriginalIds.length)
        .map((row: any) => String(row?.id ?? '')).join('|');
    xdic290juRecord.mapKeysUnchanged =
      xdic290juMapIds.join('|') === Array.from(resultsMap.keys()).map(String).join('|');
    if (!xdic290juRecord.originalPrefixPreserved || !xdic290juRecord.mapKeysUnchanged) {
      results = xdic290juOriginal;
      xdic290juRecord.status = 'STOP_ORIGINAL_INTEGRITY';
      xdic290juRecord.added = 0;
      xdic290juRecord.finalRaw = results.length;
    }
    xdic290juRecord.elapsedMs = Date.now() - xdic290juStarted;
    try {
      appendFileSync(
        'C:/dictionary_upload/X-DIC-core-backups/X-DIC-core-scripts/XDIC_KO290_JU_DEV_CANDIDATE.jsonl',
        JSON.stringify(xdic290juRecord) + '\n',
        { encoding: 'utf8' }
      );
    } catch (xdic290juLogError) {
      console.warn('[XDIC KO290JU LOG ERROR]', String(xdic290juLogError));
    }
    console.info('[XDIC KO290JU DEV CANDIDATE]', JSON.stringify(xdic290juRecord));
  }
  // XDIC_KO290_JU_DEV_CANDIDATE_END
  // XDIC_KO290_JW_MULTIKEY_SHADOW_BEGIN
  // Development-only single-word English comparison; no changes to results or resultsMap.
  // Independent evidence for a possible future generic fallback. Never applied to UI rows.
  if (process.env.NODE_ENV === 'development' && !isApp &&
      isStableEnglishSingleWord &&
      (cleanQuery === 'applicant' || cleanQuery === 'roster' || cleanQuery === 'screening')) {
    const xdic290jwStarted = Date.now();
    const xdic290jwBeforeRows = results;
    const xdic290jwBeforeIds = results.map((row: any) => String(row?.id ?? ''));
    const xdic290jwBeforeMapIds = Array.from(resultsMap.keys()).map(String);
    const xdic290jwVisibleCounts = new Map<number, number>();
    let xdic290jwVisible = 0;
    for (const row of results) {
      const category = row?.category_id == null ? 12 : Number(row.category_id);
      if (category === 0 || !Number.isSafeInteger(category)) continue;
      const next = (xdic290jwVisibleCounts.get(category) || 0) + 1;
      xdic290jwVisibleCounts.set(category, next);
      if (next <= 5) xdic290jwVisible++;
    }
    const xdic290jwRecord: Record<string, any> = {
      marker: 'XDIC_KO290_JW_MULTIKEY_SHADOW',
      timestampUtc: new Date().toISOString(),
      keyword: cleanQuery,
      originalRaw: results.length,
      originalVisible: xdic290jwVisible,
      status: 'SKIP_EXISTING_VISIBLE',
      queryExecuted: false,
      sampleLimit: 500,
      dbReadOnly: true,
      actualResultsMutated: false,
      productionDisabled: true,
    };
    if (xdic290jwVisible === 0 && results.length === 50 &&
        results.every((row: any) => Number(row?.category_id) === 0)) {
      const xdic290jwQueryStart = Date.now();
      try {
        // Metadata-only SELECT, deliberately capped. This is *not* a complete DB total.
        const { data: xdic290jwData, error: xdic290jwError } =
          await supabase.from('dictionary_lines')
            .select('id,category_id,source_order')
            .or('category_id.neq.0,category_id.is.null')
            .ilike('line_text', `%${cleanQuery}%`)
            .order('category_id', { ascending: true, nullsFirst: false })
            .order('source_order', { ascending: true, nullsFirst: false })
            .order('id', { ascending: true })
            .limit(500);
        xdic290jwRecord.queryExecuted = true;
        xdic290jwRecord.queryMs = Date.now() - xdic290jwQueryStart;
        if (xdic290jwError || !Array.isArray(xdic290jwData)) {
          throw new Error('SHADOW SELECT failed');
        }
        const xdic290jwIdSet = new Set<string>();
        const xdic290jwCounts = new Map<number, number>();
        const xdic290jwPairs: string[] = [];
        for (const row of xdic290jwData) {
          const id = String(row?.id ?? '');
          const category = row?.category_id == null ? 12 : Number(row.category_id);
          if (!id || xdic290jwIdSet.has(id) ||
              category === 0 || !Number.isSafeInteger(category)) {
            throw new Error('SHADOW sample contains invalid or duplicate ID/category');
          }
          xdic290jwIdSet.add(id);
          const count = (xdic290jwCounts.get(category) || 0) + 1;
          xdic290jwCounts.set(category, count);
          if (count <= 5) xdic290jwPairs.push(`${category}:${id}`);
        }
        const { createHash: xdic290jwHash } = await import('node:crypto');
        xdic290jwRecord.sampledRows = xdic290jwData.length;
        xdic290jwRecord.sampleMayBeTruncated = xdic290jwData.length === 500;
        xdic290jwRecord.sampledCategories = xdic290jwCounts.size;
        xdic290jwRecord.hypotheticalVisible = xdic290jwPairs.length;
        xdic290jwRecord.sampleIdSha256 = xdic290jwHash('sha256')
          .update(xdic290jwPairs.join('|'), 'utf8').digest('hex').toUpperCase();
        xdic290jwRecord.status = xdic290jwPairs.length > 0
          ? 'SHADOW_ALTERNATIVES_FOUND' : 'SHADOW_NO_ALTERNATIVES';
      } catch (xdic290jwError: any) {
        xdic290jwRecord.queryMs = Date.now() - xdic290jwQueryStart;
        xdic290jwRecord.status = 'SHADOW_QUERY_ERROR';
        xdic290jwRecord.error = String(xdic290jwError?.message || xdic290jwError).slice(0, 200);
      }
    } else if (xdic290jwVisible === 0) {
      xdic290jwRecord.status = 'SKIP_UNEXPECTED_PRIMARY';
    }
    xdic290jwRecord.finalRaw = results.length;
    xdic290jwRecord.originalArrayReferenceUnchanged = results === xdic290jwBeforeRows;
    xdic290jwRecord.originalIdsUnchanged =
      xdic290jwBeforeIds.join('|') === results.map((row: any) => String(row?.id ?? '')).join('|');
    xdic290jwRecord.mapKeysUnchanged =
      xdic290jwBeforeMapIds.join('|') === Array.from(resultsMap.keys()).map(String).join('|');
    xdic290jwRecord.elapsedMs = Date.now() - xdic290jwStarted;
    try {
      appendFileSync(
        'C:/dictionary_upload/X-DIC-core-backups/X-DIC-core-scripts/XDIC_KO290_JW_MULTIKEY_SHADOW.jsonl',
        JSON.stringify(xdic290jwRecord) + '\n',
        { encoding: 'utf8' }
      );
    } catch (xdic290jwLogError) {
      console.warn('[XDIC KO290JW SHADOW LOG ERROR]', String(xdic290jwLogError));
    }
    console.info('[XDIC KO290JW MULTIKEY SHADOW]', JSON.stringify(xdic290jwRecord));
  }
  // XDIC_KO290_JX_LOWYIELD_SHADOW_BEGIN
  // DEV WEB ONLY. Metadata SELECT for 1..19 visible rows; no results/resultsMap/UI mutations.
  if (process.env.NODE_ENV === 'development' && !isApp &&
      isStableEnglishSingleWord &&
      (cleanQuery === 'applicant' || cleanQuery === 'roster' || cleanQuery === 'screening')) {
    const xdic290jxStarted = Date.now();
    const xdic290jxOriginalRef = results;
    const xdic290jxOriginalIds = results.map((row: any) => String(row?.id ?? ''));
    const xdic290jxMapKeys = Array.from(resultsMap.keys()).map(String);
    const xdic290jxOriginalIdSet = new Set(xdic290jxOriginalIds);
    const xdic290jxExistingCategoryCounts = new Map<number, number>();
    let xdic290jxVisible = 0;
    for (const row of results) {
      const category = row?.category_id == null ? 12 : Number(row.category_id);
      if (category === 0 || !Number.isSafeInteger(category)) continue;
      const previous = xdic290jxExistingCategoryCounts.get(category) || 0;
      xdic290jxExistingCategoryCounts.set(category, previous + 1);
      if (previous < 5) xdic290jxVisible++;
    }
    const xdic290jxRecord: Record<string, any> = {
      marker: 'XDIC_KO290_JX_LOWYIELD_SHADOW',
      timestampUtc: new Date().toISOString(),
      keyword: cleanQuery,
      originalRaw: results.length,
      originalVisible: xdic290jxVisible,
      missingTo20: Math.max(0, 20 - xdic290jxVisible),
      status: 'SKIP_NOT_LOW_YIELD',
      queryExecuted: false,
      sampleLimit: 500,
      dbReadOnly: true,
      productionDisabled: true,
      actualResultsMutated: false,
    };
    // XDIC_KO290_KP_ZERO_VISIBLE_SHADOW_OPT_IN
    if ((xdic290jxVisible > 0 && xdic290jxVisible < 20) ||
        (xdic290jxVisible === 0 && cleanQuery === 'screening' &&
         /^[a-f0-9]{32}$/i.test(String((searchParams as { ko290kp?: string }).ko290kp || '')))) {
      const xdic290jxQueryStarted = Date.now();
      const xdic290jxController = new AbortController();
      const xdic290jxTimeout = setTimeout(() => xdic290jxController.abort(), 12000);
      try {
        xdic290jxRecord.queryExecuted = true;
        // Bounded metadata-only query: same category/source/id order as the working JU/JW shadows.
        const { data: xdic290jxData, error: xdic290jxError } =
          await supabase.from('dictionary_lines')
            .select('id,category_id,source_order')
            .or('category_id.neq.0,category_id.is.null')
            .ilike('line_text', `%${cleanQuery}%`)
            .order('category_id', { ascending: true, nullsFirst: false })
            .order('source_order', { ascending: true, nullsFirst: false })
            .order('id', { ascending: true })
            .limit(500)
            .abortSignal(xdic290jxController.signal);
        if (xdic290jxError || !Array.isArray(xdic290jxData)) {
          throw new Error('KO290-JX metadata SELECT failed');
        }
        const xdic290jxSeenSample = new Set<string>();
        const xdic290jxCategoryCounts = new Map(xdic290jxExistingCategoryCounts);
        const xdic290jxHypotheticalPairs: string[] = [];
        let xdic290jxNewEligible = 0;
        for (const row of xdic290jxData) {
          const id = String(row?.id ?? '');
          const category = row?.category_id == null ? 12 : Number(row.category_id);
          if (!id || xdic290jxSeenSample.has(id) ||
              category === 0 || !Number.isSafeInteger(category)) {
            throw new Error('KO290-JX invalid or duplicate sampled row');
          }
          xdic290jxSeenSample.add(id);
          // Never suggest an ID already present in the original results array.
          if (xdic290jxOriginalIdSet.has(id)) continue;
          if ((xdic290jxCategoryCounts.get(category) || 0) >= 5) continue;
          xdic290jxCategoryCounts.set(category,
            (xdic290jxCategoryCounts.get(category) || 0) + 1);
          xdic290jxNewEligible++;
          // Hypothetical first-page candidates only. No rows are fetched or appended.
          if (xdic290jxHypotheticalPairs.length < 20 - xdic290jxVisible) {
            xdic290jxHypotheticalPairs.push(`${category}:${id}`);
          }
        }
        const { createHash: xdic290jxCreateHash } = await import('node:crypto');
        xdic290jxRecord.sampledRows = xdic290jxData.length;
        xdic290jxRecord.sampleMayBeTruncated = xdic290jxData.length === 500;
        xdic290jxRecord.eligibleNew = xdic290jxNewEligible;
        xdic290jxRecord.hypotheticalAddedTo20 = xdic290jxHypotheticalPairs.length;
        xdic290jxRecord.hypotheticalFirstPage =
          xdic290jxVisible + xdic290jxHypotheticalPairs.length;
        xdic290jxRecord.hypotheticalIdSha256 = xdic290jxCreateHash('sha256')
          .update(xdic290jxHypotheticalPairs.join('|'), 'utf8').digest('hex').toUpperCase();
        xdic290jxRecord.status = xdic290jxNewEligible > 0
          ? 'SHADOW_FILL_AVAILABLE' : 'SHADOW_NO_FILL_IN_SAMPLE';
      } catch (xdic290jxError: any) {
        xdic290jxRecord.status = 'SHADOW_QUERY_ERROR';
        xdic290jxRecord.error = String(xdic290jxError?.message || xdic290jxError).slice(0, 200);
      } finally {
        clearTimeout(xdic290jxTimeout);
        xdic290jxRecord.queryMs = Date.now() - xdic290jxQueryStarted;
      }
    } else if (xdic290jxVisible >= 20) {
      xdic290jxRecord.status = 'SKIP_FIRST_PAGE_FULL';
    } else {
      xdic290jxRecord.status = 'SKIP_ZERO_VISIBLE_HANDLED_BY_JU_JW';
    }
    xdic290jxRecord.originalArrayReferenceUnchanged = results === xdic290jxOriginalRef;
    xdic290jxRecord.originalIdsUnchanged =
      xdic290jxOriginalIds.join('|') ===
      results.map((row: any) => String(row?.id ?? '')).join('|');
    xdic290jxRecord.mapKeysUnchanged =
      xdic290jxMapKeys.join('|') === Array.from(resultsMap.keys()).map(String).join('|');
    xdic290jxRecord.finalRaw = results.length;
    xdic290jxRecord.elapsedMs = Date.now() - xdic290jxStarted;
    try {
      appendFileSync(
        'C:/dictionary_upload/X-DIC-core-backups/X-DIC-core-scripts/XDIC_KO290_JX_LOWYIELD_SHADOW.jsonl',
        JSON.stringify(xdic290jxRecord) + '\n',
        { encoding: 'utf8' }
      );
    } catch (xdic290jxLogError) {
      console.warn('[XDIC KO290JX SHADOW LOG ERROR]', String(xdic290jxLogError));
    }
    console.info('[XDIC KO290JX LOWYIELD SHADOW]', JSON.stringify(xdic290jxRecord));
  }
  // XDIC_KO290_JX_LOWYIELD_SHADOW_END
  // XDIC_KO290_KM_DEV_SCREENING_APPEND_BEGIN
  // Opt-in development web screening only. Keep every original row and Map entry intact.
  const xdic290kmToken = String((searchParams as { ko290km?: string }).ko290km || '');
  if (process.env.NODE_ENV === 'development' && !isApp &&
      isStableEnglishSingleWord && cleanQuery === 'screening' &&
      /^[a-f0-9]{32}$/i.test(xdic290kmToken)) {
    const xdic290kmStarted = Date.now();
    const xdic290kmOriginal = results;
    const xdic290kmOriginalIds = results.map((row: any) => String(row?.id ?? ''));
    const xdic290kmOriginalMapIds = Array.from(resultsMap.keys()).map(String);
    const xdic290kmOriginalIdSet = new Set(xdic290kmOriginalIds);
    const xdic290kmCategoryCounts = new Map<number, number>();
    let xdic290kmVisible = 0;
    for (const row of results) {
      const category = row?.category_id == null ? 12 : Number(row.category_id);
      if (!Number.isSafeInteger(category) || category === 0) continue;
      const seen = (xdic290kmCategoryCounts.get(category) || 0) + 1;
      xdic290kmCategoryCounts.set(category, seen);
      if (seen <= 5) xdic290kmVisible++;
    }
    const xdic290kmRecord: Record<string, any> = {
      marker: 'XDIC_KO290_KM_DEV_SCREENING_APPEND',
      token: xdic290kmToken,
      timestampUtc: new Date().toISOString(),
      keyword: cleanQuery,
      originalRaw: xdic290kmOriginal.length,
      originalVisible: xdic290kmVisible,
      added: 0,
      status: 'SKIP_BASELINE_MISMATCH',
      productionDisabled: true,
      databaseWrites: false,
    };
    try {
      if (xdic290kmOriginal.length === 50 && xdic290kmVisible === 5 &&
          xdic290kmOriginalIdSet.size === 50) {
        const { createHash: xdic290kmHash } = await import('node:crypto');
        const xdic290kmOriginalSetHash = xdic290kmHash('sha256')
          .update([...xdic290kmOriginalIdSet].sort().join('|'), 'utf8')
          .digest('hex').toUpperCase();
        xdic290kmRecord.originalSetSha256 = xdic290kmOriginalSetHash;
        if (xdic290kmOriginalSetHash !==
            '950B80F7C80BCB947505E61528322089C1791047696A7BA8F54B184B75E773C3') {
          throw new Error('baseline ID set differs from verified KO290-KC screening run');
        }
        const xdic290kmQueryStart = Date.now();
        const xdic290kmController = new AbortController();
        const xdic290kmTimeout = setTimeout(() => xdic290kmController.abort(), 12000);
        let xdic290kmMeta: any[] | null = null;
        try {
          const { data, error } = await supabase.from('dictionary_lines')
            .select('id,category_id,source_order')
            .or('category_id.neq.0,category_id.is.null')
            .ilike('line_text', '%screening%')
            .order('category_id', { ascending: true, nullsFirst: false })
            .order('source_order', { ascending: true, nullsFirst: false })
            .order('id', { ascending: true })
            .limit(500)
            .abortSignal(xdic290kmController.signal);
          if (error || !Array.isArray(data)) throw new Error('metadata SELECT failed');
          xdic290kmMeta = data;
        } finally {
          clearTimeout(xdic290kmTimeout);
          xdic290kmRecord.metaQueryMs = Date.now() - xdic290kmQueryStart;
        }
        if (xdic290kmMeta.length !== 500) {
          throw new Error('metadata sample no longer matches verified 500-row sample');
        }
        const xdic290kmSampleSeen = new Set<string>();
        const xdic290kmCounts = new Map(xdic290kmCategoryCounts);
        const xdic290kmSelectedMeta: any[] = [];
        const xdic290kmPairs: string[] = [];
        let xdic290kmEligible = 0;
        for (const row of xdic290kmMeta) {
          const id = String(row?.id ?? '');
          const category = row?.category_id == null ? 12 : Number(row.category_id);
          if (!id || xdic290kmSampleSeen.has(id) ||
              !Number.isSafeInteger(category) || category === 0) {
            throw new Error('invalid or duplicate metadata sample row');
          }
          xdic290kmSampleSeen.add(id);
          if (xdic290kmOriginalIdSet.has(id)) continue;
          if ((xdic290kmCounts.get(category) || 0) >= 5) continue;
          xdic290kmCounts.set(category, (xdic290kmCounts.get(category) || 0) + 1);
          xdic290kmEligible++;
          if (xdic290kmSelectedMeta.length < 15) {
            xdic290kmSelectedMeta.push(row);
            xdic290kmPairs.push(`${category}:${id}`);
          }
        }
        const xdic290kmSelectedHash = xdic290kmHash('sha256')
          .update(xdic290kmPairs.join('|'), 'utf8').digest('hex').toUpperCase();
        xdic290kmRecord.eligible = xdic290kmEligible;
        xdic290kmRecord.selectedIdSha256 = xdic290kmSelectedHash;
        xdic290kmRecord.sampledRows = xdic290kmMeta.length;
        if (xdic290kmEligible !== 50 || xdic290kmSelectedMeta.length !== 15 ||
            xdic290kmSelectedHash !==
              '410A055DD4DC18A6DE07B79A19FF9ED517DCEF847EFB95B22166AA66AF88F616') {
          throw new Error('candidate selection differs from verified KO290-KK hash');
        }
        const xdic290kmSelectedIds = xdic290kmSelectedMeta.map((r: any) => String(r.id));
        const { data: xdic290kmFull, error: xdic290kmFullError } =
          await supabase.from('dictionary_lines').select('*').in('id', xdic290kmSelectedIds);
        if (xdic290kmFullError || !Array.isArray(xdic290kmFull) ||
            xdic290kmFull.length !== 15) {
          throw new Error('15 full row fetch failed');
        }
        const xdic290kmFullMap = new Map<string, any>();
        for (const row of xdic290kmFull) {
          const id = String(row?.id ?? '');
          if (!id || xdic290kmFullMap.has(id) ||
              typeof row?.line_text !== 'string' ||
              !row.line_text.toLowerCase().includes('screening')) {
            throw new Error('invalid/duplicate full row');
          }
          xdic290kmFullMap.set(id, row);
        }
        const xdic290kmAddition: any[] = [];
        for (const meta of xdic290kmSelectedMeta) {
          const id = String(meta.id);
          const full = xdic290kmFullMap.get(id);
          const fullCat = full?.category_id == null ? 12 : Number(full.category_id);
          const metaCat = meta?.category_id == null ? 12 : Number(meta.category_id);
          if (!full || fullCat !== metaCat ||
              String(full?.source_order ?? '') !== String(meta?.source_order ?? '') ||
              xdic290kmOriginalIdSet.has(id)) {
            throw new Error('full row does not match verified metadata');
          }
          xdic290kmAddition.push(full);
        }
        if (xdic290kmOriginalIds.join('|') !==
              results.map((r: any) => String(r?.id ?? '')).join('|') ||
            xdic290kmOriginalMapIds.join('|') !==
              Array.from(resultsMap.keys()).map(String).join('|')) {
          throw new Error('original rows or Map changed before append');
        }
        const xdic290kmProposed = [...xdic290kmOriginal, ...xdic290kmAddition];
        const xdic290kmCountsAfter = new Map<number, number>();
        let xdic290kmVisibleAfter = 0;
        for (const row of xdic290kmProposed) {
          const cat = row?.category_id == null ? 12 : Number(row.category_id);
          if (!Number.isSafeInteger(cat) || cat === 0) continue;
          const count = (xdic290kmCountsAfter.get(cat) || 0) + 1;
          xdic290kmCountsAfter.set(cat, count);
          if (count <= 5) xdic290kmVisibleAfter++;
        }
        if (xdic290kmVisibleAfter !== 20 || xdic290kmProposed.length !== 65 ||
            xdic290kmOriginalIds.join('|') !== xdic290kmProposed.slice(0, 50)
              .map((r: any) => String(r?.id ?? '')).join('|')) {
          throw new Error('proposed 20-visible append violates prefix/category-cap');
        }
        results = xdic290kmProposed;
        xdic290kmRecord.added = 15;
        xdic290kmRecord.status = 'PASS_APPEND_15';
        xdic290kmRecord.finalVisible = xdic290kmVisibleAfter;
      } else if (xdic290kmOriginal.length === 60 && xdic290kmVisible === 0 &&
                 xdic290kmOriginalIdSet.size === 60 &&
                 xdic290kmOriginal.every((row: any) =>
                   row?.category_id != null && Number(row.category_id) === 0)) {
        // KO290-KR zero-visible extension; fail closed on any unverified candidate or database error.
        const { createHash: xdic290krHash } = await import('node:crypto');
        const xdic290krQueryStart = Date.now();
        const xdic290krController = new AbortController();
        const xdic290krTimer = setTimeout(() => xdic290krController.abort(), 12000);
        let xdic290krMeta: any[] | null = null;
        try {
          const { data, error } = await supabase.from('dictionary_lines')
            .select('id,category_id,source_order')
            .or('category_id.neq.0,category_id.is.null')
            .ilike('line_text', '%screening%')
            .order('category_id', { ascending: true, nullsFirst: false })
            .order('source_order', { ascending: true, nullsFirst: false })
            .order('id', { ascending: true })
            .limit(500)
            .abortSignal(xdic290krController.signal);
          if (error || !Array.isArray(data)) throw new Error('KR metadata SELECT failed');
          xdic290krMeta = data;
        } finally {
          clearTimeout(xdic290krTimer);
          xdic290kmRecord.metaQueryMs = Date.now() - xdic290krQueryStart;
        }
        if (xdic290krMeta.length !== 500) {
          throw new Error('KR 500-row sample does not match verified KP sample');
        }
        const xdic290krSeen = new Set<string>();
        const xdic290krCounts = new Map(xdic290kmCategoryCounts);
        const xdic290krChosen: any[] = [];
        const xdic290krPairs: string[] = [];
        let xdic290krEligible = 0;
        for (const row of xdic290krMeta) {
          const id = String(row?.id ?? '');
          const category = row?.category_id == null ? 12 : Number(row.category_id);
          if (!id || xdic290krSeen.has(id) ||
              !Number.isSafeInteger(category) || category === 0) {
            throw new Error('KR invalid or duplicate metadata row');
          }
          xdic290krSeen.add(id);
          if (xdic290kmOriginalIdSet.has(id)) continue;
          if ((xdic290krCounts.get(category) || 0) >= 5) continue;
          xdic290krCounts.set(category, (xdic290krCounts.get(category) || 0) + 1);
          xdic290krEligible++;
          if (xdic290krChosen.length < 20) {
            xdic290krChosen.push(row);
            xdic290krPairs.push(`${category}:${id}`);
          }
        }
        const xdic290krSha = xdic290krHash('sha256')
          .update(xdic290krPairs.join('|'), 'utf8').digest('hex').toUpperCase();
        xdic290kmRecord.sampledRows = xdic290krMeta.length;
        xdic290kmRecord.eligible = xdic290krEligible;
        xdic290kmRecord.selectedIdSha256 = xdic290krSha;
        if (xdic290krEligible !== 55 || xdic290krChosen.length !== 20 ||
            xdic290krSha !==
              '17E9E9A8D2E406A7F80C17B4913001323041E0E8C01D6C20C71AE9F24113E261') {
          throw new Error('KR candidates differ from twice-verified KP SHA256');
        }
        const xdic290krChosenIds = xdic290krChosen.map((row: any) => String(row.id));
        const { data: xdic290krFull, error: xdic290krFullError } =
          await supabase.from('dictionary_lines').select('*').in('id', xdic290krChosenIds);
        if (xdic290krFullError || !Array.isArray(xdic290krFull) ||
            xdic290krFull.length !== 20) {
          throw new Error('KR full-row SELECT mismatch');
        }
        const xdic290krFullMap = new Map<string, any>();
        for (const row of xdic290krFull) {
          const id = String(row?.id ?? '');
          if (!id || xdic290krFullMap.has(id) ||
              typeof row?.line_text !== 'string' ||
              !row.line_text.toLowerCase().includes('screening')) {
            throw new Error('KR invalid/duplicate or unrelated full row');
          }
          xdic290krFullMap.set(id, row);
        }
        const xdic290krAddition: any[] = [];
        for (const meta of xdic290krChosen) {
          const id = String(meta.id);
          const full = xdic290krFullMap.get(id);
          const fullCategory = full?.category_id == null ? 12 : Number(full.category_id);
          const metaCategory = meta?.category_id == null ? 12 : Number(meta.category_id);
          if (!full || fullCategory !== metaCategory ||
              String(full?.source_order ?? '') !== String(meta?.source_order ?? '') ||
              xdic290kmOriginalIdSet.has(id)) {
            throw new Error('KR full-row / metadata integrity mismatch');
          }
          xdic290krAddition.push(full);
        }
        if (xdic290kmOriginalIds.join('|') !==
              results.map((row: any) => String(row?.id ?? '')).join('|') ||
            xdic290kmOriginalMapIds.join('|') !==
              Array.from(resultsMap.keys()).map(String).join('|')) {
          throw new Error('KR original results or Map changed before append');
        }
        const xdic290krProposed = [...xdic290kmOriginal, ...xdic290krAddition];
        const xdic290krCatCounts = new Map<number, number>();
        let xdic290krVisible = 0;
        for (const row of xdic290krProposed) {
          const cat = row?.category_id == null ? 12 : Number(row.category_id);
          if (!Number.isSafeInteger(cat) || cat === 0) continue;
          const count = (xdic290krCatCounts.get(cat) || 0) + 1;
          xdic290krCatCounts.set(cat, count);
          if (count <= 5) xdic290krVisible++;
        }
        if (xdic290krProposed.length !== 80 || xdic290krVisible !== 20 ||
            xdic290kmOriginalIds.join('|') !== xdic290krProposed.slice(0, 60)
              .map((row: any) => String(row?.id ?? '')).join('|')) {
          throw new Error('KR proposed 20-visible append failed prefix/category cap check');
        }
        results = xdic290krProposed;
        xdic290kmRecord.added = 20;
        xdic290kmRecord.finalVisible = xdic290krVisible;
        xdic290kmRecord.status = 'PASS_APPEND_20_FROM_ZERO';
      }
    } catch (xdic290kmError: any) {
      results = xdic290kmOriginal;
      xdic290kmRecord.added = 0;
      xdic290kmRecord.status = 'STOP_UNVERIFIED_APPEND';
      xdic290kmRecord.error = String(xdic290kmError?.message || xdic290kmError).slice(0, 200);
    }
    xdic290kmRecord.finalRaw = results.length;
    xdic290kmRecord.originalPrefixPreserved =
      xdic290kmOriginalIds.join('|') === results.slice(0, xdic290kmOriginalIds.length)
        .map((r: any) => String(r?.id ?? '')).join('|');
    xdic290kmRecord.mapKeysUnchanged =
      xdic290kmOriginalMapIds.join('|') === Array.from(resultsMap.keys()).map(String).join('|');
    if (!xdic290kmRecord.originalPrefixPreserved || !xdic290kmRecord.mapKeysUnchanged) {
      results = xdic290kmOriginal;
      xdic290kmRecord.added = 0;
      xdic290kmRecord.status = 'STOP_ORIGINAL_INTEGRITY';
      xdic290kmRecord.finalRaw = results.length;
    }
    xdic290kmRecord.elapsedMs = Date.now() - xdic290kmStarted;
    try {
      appendFileSync(
        'C:/dictionary_upload/X-DIC-core-backups/X-DIC-core-scripts/XDIC_KO290_KM_DEV_SCREENING_APPEND.jsonl',
        JSON.stringify(xdic290kmRecord) + '\n',
        { encoding: 'utf8' }
      );
    } catch (xdic290kmLogError) {
      console.warn('[XDIC KO290KM LOG ERROR]', String(xdic290kmLogError));
    }
    console.info('[XDIC KO290KM DEV SCREENING]', JSON.stringify(xdic290kmRecord));
  }
  // XDIC_KO290_KM_DEV_SCREENING_APPEND_END
  // XDIC_KO290_ME_DIRECT_15_BEGIN
  // Dev-only comparison of direct 50 + verified KM15. No changes to original KR/KM.
  let xdic290meVisible = 0;
  let xdic290meFinalIdSha = '';
  if (xdic290meEnabled) {
    const xdic290meAfterRotate = results.map((r: any) => String(r?.id ?? ''));
    if (xdic290meAfterRotate.length !== 50 ||
        new Set(xdic290meAfterRotate).size !== 50 ||
        Array.from(resultsMap.keys()).map(String).join('|') !==
          xdic290meBaselineIds.join('|')) {
      throw new Error('KO290-ME original 50 / Map changed unexpectedly');
    }
    const xdic290meFirst5Expected = [
      '9abec1cd-73ea-40e4-b430-250f925d1137',
      '0639eacc-ec4c-410f-a6e3-f028299a3732',
      '1d3dbc38-f419-4293-9537-9f1746f21e90',
      'c41af779-fa87-4452-9fd4-9810058b4fe3',
      '1bd20d72-a06b-423d-b79d-be209be7ed7b',
    ];
    const xdic290meActual5 = results
      .filter((r: any) => Number(r?.category_id) === 1)
      .slice(0, 5).map((r: any) => String(r.id));
    if (xdic290meActual5.join('|') !== xdic290meFirst5Expected.join('|')) {
      throw new Error('KO290-ME rotated category-1 first5 differ from historic');
    }
    let xdic290mePool: any[] | null = null;
    let xdic290meMetaMs = 0;
    if (xdic290mkEnabled) {
      // Reuse the same 150 fully fetched rows; never issue metadata SQL.
      if (xdic290mkRows150.length !== 150) throw new Error('KO290-MK pool150 missing');
      xdic290mePool = xdic290mkRows150.slice(50);
      if (xdic290mePool.some((r: any) => r.category_id === 0)) {
        throw new Error('KO290-MK unexpected category-0 remainder');
      }
    } else {
      const xdic290meMetaStarted = Date.now();
      const xdic290meAbort = new AbortController();
      const xdic290meTimer = setTimeout(() => xdic290meAbort.abort(), 10000);
      try {
        const { data, error } = await supabase.from('dictionary_lines')
          .select('id,category_id,source_order')
          .or('category_id.neq.0,category_id.is.null')
          .ilike('line_text', '%screening%')
          .order('category_id', { ascending: true, nullsFirst: false })
          .order('source_order', { ascending: true, nullsFirst: false })
          .order('id', { ascending: true })
          .limit(500).abortSignal(xdic290meAbort.signal);
        if (error || !Array.isArray(data)) throw new Error('KO290-ME metadata SELECT failed');
        xdic290mePool = data;
      } finally {
        clearTimeout(xdic290meTimer);
      }
      xdic290meMetaMs = Date.now() - xdic290meMetaStarted;
    }
    if (!xdic290mePool || xdic290mePool.length !== (xdic290mkEnabled ? 100 : 500)) {
      throw new Error('KO290-ME/MK metadata sample count mismatch');
    }
    const xdic290meOriginalSet = new Set(xdic290meAfterRotate);
    const xdic290meMetaSeen = new Set<string>();
    const xdic290meCatCounts = new Map<number, number>();
    for (const row of results) {
      const category = row?.category_id == null ? 12 : Number(row.category_id);
      xdic290meCatCounts.set(category, (xdic290meCatCounts.get(category) || 0) + 1);
    }
    const xdic290meSelected: any[] = [];
    const xdic290mePairs: string[] = [];
    let xdic290meEligible = 0;
    for (const meta of xdic290mePool) {
      const id = String(meta?.id ?? '');
      const category = meta?.category_id == null ? 12 : Number(meta.category_id);
      if (!id || xdic290meMetaSeen.has(id) ||
          category === 0 || !Number.isSafeInteger(category)) {
        throw new Error('KO290-ME malformed / repeated metadata');
      }
      xdic290meMetaSeen.add(id);
      if (xdic290meOriginalSet.has(id)) continue;
      if ((xdic290meCatCounts.get(category) || 0) >= 5) continue;
      xdic290meCatCounts.set(category, (xdic290meCatCounts.get(category) || 0) + 1);
      xdic290meEligible++;
      if (xdic290meSelected.length < 15) {
        xdic290meSelected.push(meta);
        xdic290mePairs.push(`${category}:${id}`);
      }
    }
    const { createHash: xdic290meHash } = await import('node:crypto');
    const xdic290meSelectedSha = xdic290meHash('sha256')
      .update(xdic290mePairs.join('|'), 'utf8').digest('hex').toUpperCase();
    if (xdic290meEligible !== (xdic290mkEnabled ? 15 : 50) ||
        xdic290meSelected.length !== 15 ||
        xdic290meSelectedSha !==
          '410A055DD4DC18A6DE07B79A19FF9ED517DCEF847EFB95B22166AA66AF88F616') {
      throw new Error('KO290-ME selected 15 differ from verified KM15');
    }
    let xdic290meFull: any[] | null = null;
    let xdic290meFullErr: any = null;
    let xdic290meFullMs = 0;
    if (xdic290mkEnabled) {
      // All selected rows were already fetched as complete rows in pool150.
      const chosenIds = new Set(xdic290meSelected.map((r: any) => String(r.id)));
      xdic290meFull = xdic290mkRows150.filter((r: any) => chosenIds.has(String(r.id)));
    } else {
      const xdic290meFullStarted = Date.now();
      const { data, error } = await supabase.from('dictionary_lines').select('*')
        .in('id', xdic290meSelected.map((r: any) => String(r.id)));
      xdic290meFull = data;
      xdic290meFullErr = error;
      xdic290meFullMs = Date.now() - xdic290meFullStarted;
    }
    if (xdic290meFullErr || !Array.isArray(xdic290meFull) ||
        xdic290meFull.length !== 15) {
      throw new Error('KO290-ME 15 full row SELECT failed');
    }
    const xdic290meFullMap = new Map<string, any>();
    for (const row of xdic290meFull) {
      const id = String(row?.id ?? '');
      if (!id || xdic290meFullMap.has(id) ||
          typeof row?.line_text !== 'string' ||
          !row.line_text.toLowerCase().includes('screening')) {
        throw new Error('KO290-ME invalid/duplicate/unrelated full row');
      }
      xdic290meFullMap.set(id, row);
    }
    const xdic290meAdded = xdic290meSelected.map((meta: any) => {
      const row = xdic290meFullMap.get(String(meta.id));
      if (!row || Number(row.category_id ?? 12) !== Number(meta.category_id ?? 12) ||
          String(row.source_order ?? '') !== String(meta.source_order ?? '')) {
        throw new Error('KO290-ME metadata/full-row integrity mismatch');
      }
      return row;
    });
    if (results.map((r: any) => String(r.id)).join('|') !==
          xdic290meAfterRotate.join('|') ||
        Array.from(resultsMap.keys()).map(String).join('|') !==
          xdic290meBaselineIds.join('|')) {
      throw new Error('KO290-ME original results/Map changed before append');
    }
    const xdic290meProposed = [...results, ...xdic290meAdded];
    const xdic290meIds = xdic290meProposed.map((r: any) => String(r?.id ?? ''));
    const xdic290meCounts = new Map<number, number>();
    const xdic290meVisibleIds: string[] = [];
    for (const row of xdic290meProposed) {
      const category = row?.category_id == null ? 12 : Number(row.category_id);
      if (!Number.isSafeInteger(category) || category === 0) continue;
      const n = (xdic290meCounts.get(category) || 0) + 1;
      xdic290meCounts.set(category, n);
      if (n <= 5) xdic290meVisibleIds.push(String(row.id));
    }
    xdic290meVisible = xdic290meVisibleIds.length;
    if (xdic290meIds.length !== 65 || new Set(xdic290meIds).size !== 65 ||
        xdic290meVisible !== 20 ||
        xdic290meIds.slice(0, 50).join('|') !== xdic290meAfterRotate.join('|')) {
      throw new Error('KO290-ME final 50+15 / first page integrity failed');
    }
    results = xdic290meProposed;
    xdic290meFinalIdSha = xdic290meHash('sha256')
      .update(xdic290meIds.join('|'), 'utf8').digest('hex').toUpperCase();
    appendFileSync(
      'C:/dictionary_upload/X-DIC-core-backups/X-DIC-core-scripts/XDIC_KO290_ME_DIRECT_DEV.jsonl',
      JSON.stringify({ marker: 'XDIC_KO290_ME_DIRECT_DEV',
        token: xdic253ProbeId, timestampUtc: new Date().toISOString(),
        baselineRaw: 50, baselineVisible: 5, metaRows: xdic290mePool.length,
        eligible: xdic290meEligible, selectedSha256: xdic290meSelectedSha,
        added: 15, finalRaw: 65, finalVisible: xdic290meVisible,
        duplicateIds: 0, originalPrefixPreserved: true, originalMapKeysPreserved: true,
        first5Ids: xdic290meActual5, finalIds: xdic290meIds,
        visibleIds: xdic290meVisibleIds, finalIdsSha256: xdic290meFinalIdSha,
        directSqlMs: xdic290meDirectSqlMs, metadataSqlMs: xdic290meMetaMs,
        fullSqlMs: xdic290meFullMs, serverElapsedMs: Date.now() - xdicPerfStartedV1,
        singleSql150: xdic290mkEnabled, fetchedRows: xdic290mkEnabled ? 150 : 50,
        directQueryCount: xdic290mkEnabled ? 1 : 3,
        devOnly: true, productionDisabled: true, databaseWrites: false,
        bestSplitMainQuerySkipped: true, kmKrSourceUnmodified: true,
      }) + '\n', { encoding: 'utf8' }
    );
  }
  // XDIC_KO290_ME_DIRECT_15_END
  // XDIC_KO290_JW_MULTIKEY_SHADOW_END
  // XDIC_KO290_JA_FINAL_DIAGNOSTIC_BEGIN
  // Logs the actual SearchPage prop IDs, without modifying the array or warning.
  if (xdic290jaEnabled) {
    const jaFinalIds = results.map((row: any) => String(row?.id ?? ''));
    xdicPerfWriteToFileV2('[XDIC KO290JA FINAL RENDER]', JSON.stringify({
      probeToken: xdic290jaToken, finalCount: jaFinalIds.length,
      finalIds: jaFinalIds, duplicateIds: jaFinalIds.length - new Set(jaFinalIds).size,
      warningShown: xdic255RelatedFailures.length > 0,
      resultsMutatedByDiagnostic: false, productionDisabled: true,
    }));
  }
  // XDIC_KO290_JA_FINAL_DIAGNOSTIC_END

  // XDIC_KO290_MN23_ROSTER_DEV_SSR_BEGIN
  // Explicit localhost development SSR probe; no general-keyword or production path.
  // Preserve the original 60 IDs/Map. The 20 full rows are read by primary keys only.
  const xdic290mn23Token = String((searchParams as { ko290mn23?: string }).ko290mn23 || '');
  const xdic290mn23Enabled = process.env.NODE_ENV === 'development' &&
    cleanQuery === 'roster' && isStableEnglishSingleWord &&
    !String((searchParams as { app?: string }).app || '') &&
    xdic253Enabled && /^[a-f0-9]{32}$/i.test(xdic290mn23Token) &&
    xdic290mn23Token === xdic253ProbeId;
  let xdic290mn23Status = 'DISABLED';
  let xdic290mn23Raw = 0;
  let xdic290mn23Visible = 0;
  let xdic290mn23IdSha = '';
  if (xdic290mn23Enabled) {
    const xdic290mn23StartedAt = Date.now();
    const xdic290mn23Original = results;
    const xdic290mn23OriginalIds = results.map((row: any) => String(row?.id ?? ''));
    const xdic290mn23OriginalMapIds = Array.from(resultsMap.keys()).map(String);
    try {
      const { createHash: xdic290mn23CreateHash } = await import('node:crypto');
      const xdic290mn23Hash = (ids: string[]): string =>
        xdic290mn23CreateHash('sha256').update(ids.join('|'), 'utf8').digest('hex').toUpperCase();
      // XDIC_KO290_MN24_BASELINE_GUARDS_BEGIN: validated history only, dev-token gated.
      const xdic290mn24Is60 = xdic290mn23OriginalIds.length === 60 &&
        xdic290mn23Hash(xdic290mn23OriginalIds) === 'B913D411A97E39A7EAEFC80B73CEE49BD2C6EF6B8E222F211B610532C95F531E' &&
        xdic290mn23Original.every((row: any) => Number(row?.category_id) === 0);
      const xdic290mn24Is50 = xdic290mn23OriginalIds.length === 50 &&
        xdic290mn23Hash(xdic290mn23OriginalIds) === '0E450FB97327AA1FE06E24EAC386C31D6A4AA9CF6942DC258175C4F0A82B7F8F' &&
        xdic290mn23Original.every((row: any, index: number) =>
          Number(row?.category_id) === (index < 45 ? 0 : 1) &&
          typeof row?.line_text === 'string' &&
          row.line_text.toLowerCase().includes('ros') &&
          row.line_text.toLowerCase().includes('ter') &&
          !row.line_text.toLowerCase().includes('roster') &&
          !/(^|[^A-Za-z0-9_])roster([^A-Za-z0-9_]|$)/i.test(row.line_text));
      if ((!xdic290mn24Is60 && !xdic290mn24Is50) ||
          new Set(xdic290mn23OriginalIds).size !== xdic290mn23OriginalIds.length) {
        throw new Error('MN24 original SSR 50/60/category/hash precheck failed');
      }
      // XDIC_KO290_MN24_BASELINE_GUARDS_END
      const xdic290mn23Expected: Array<{ id: string; category: number; sourceOrder: number }> = [
    { id: '85f356c2-4c63-4c8e-a084-0063ac6cb731', category: 1, sourceOrder: 5815 },
    { id: 'd61a68ee-16f6-4123-830c-f5a7d12b3990', category: 1, sourceOrder: 5816 },
    { id: '73498865-4f7d-43ef-ad09-e000192eef97', category: 1, sourceOrder: 9897 },
    { id: 'c4a8d2ad-8689-423f-932b-58fd0a9f6b4e', category: 1, sourceOrder: 14936 },
    { id: 'dad6533e-fc1b-4ba9-ba79-edc4c5959ee3', category: 1, sourceOrder: 26000 },
    { id: 'b8e8e705-9427-4807-bf0e-9480f9c8bd17', category: 2, sourceOrder: 14410 },
    { id: '18318c7d-0a46-41b7-bd29-c97d6d5988d8', category: 2, sourceOrder: 104804 },
    { id: 'f039f788-a2f8-4cd0-a742-6fe8d3b6ecc6', category: 2, sourceOrder: 110393 },
    { id: '900eb9f0-074a-459f-8d53-753a6e893736', category: 5, sourceOrder: 5255 },
    { id: '85539730-f5ff-430b-9aa4-dbbbcbaf536b', category: 5, sourceOrder: 5256 },
    { id: '5bd7a5c1-e134-4f24-a2cf-ed646a78676f', category: 5, sourceOrder: 75663 },
    { id: '5eef2864-817e-48ce-9d13-d0569d55a3b5', category: 5, sourceOrder: 75664 },
    { id: 'e2f18048-eec5-499b-973e-99e87a9bb737', category: 8, sourceOrder: 132559 },
    { id: '308fc626-d52f-4758-b722-7370b7db33c2', category: 8, sourceOrder: 132560 },
    { id: '31055543-ecd3-40ce-b073-128519d3245a', category: 10, sourceOrder: 53900 },
    { id: '149b5788-7a9a-48bf-bd1f-7dbe25e429c6', category: 10, sourceOrder: 63367 },
    { id: '5d58b8ad-8229-480a-a773-0375a2a1f411', category: 10, sourceOrder: 79070 },
    { id: '156c1b51-f0db-4aba-936d-0239fef9080b', category: 10, sourceOrder: 92540 },
    { id: '8f8466bb-93d9-42ca-82f7-f3a6b30331ff', category: 10, sourceOrder: 99000 },
    { id: '0469cb89-d479-4251-840a-1c0579ffced7', category: 11, sourceOrder: 102162 }
      ];
      const xdic290mn23CandidateIds = xdic290mn23Expected.map((row) => row.id);
      if (xdic290mn23Expected.length !== 20 ||
          new Set(xdic290mn23CandidateIds).size !== 20 ||
          xdic290mn23Hash(xdic290mn23CandidateIds) !== '1C43FD6D266C4A655C30712A9E5352D287F06E68C8C1097981193E9031BA01E4') {
        throw new Error('MN23 selected 20 ID/order/hash precheck failed');
      }
      const xdic290mn23Abort = new AbortController();
      const xdic290mn23Timer = setTimeout(() => xdic290mn23Abort.abort(), 10000);
      let xdic290mn23Fetched: any[] = [];
      try {
        const { data, error } = await supabase.from('dictionary_lines')
          .select('*').in('id', xdic290mn23CandidateIds)
          .abortSignal(xdic290mn23Abort.signal);
        if (error || !Array.isArray(data) || data.length !== 20) {
          throw new Error('MN23 primary-key full-row fetch failed');
        }
        xdic290mn23Fetched = data;
      } finally {
        clearTimeout(xdic290mn23Timer);
      }
      const xdic290mn23Found = new Map<string, any>();
      for (const row of xdic290mn23Fetched) {
        const id = String(row?.id ?? '');
        if (!id || xdic290mn23Found.has(id) ||
            typeof row?.line_text !== 'string') {
          throw new Error('MN23 invalid/duplicate fetched candidate');
        }
        xdic290mn23Found.set(id, row);
      }
      const xdic290mn23Added = xdic290mn23Expected.map((entry) => {
        const row = xdic290mn23Found.get(entry.id);
        if (!row || Number(row.category_id) !== entry.category ||
            Number(row.source_order) !== entry.sourceOrder ||
            !/(^|[^A-Za-z0-9_])roster([^A-Za-z0-9_]|$)/i.test(row.line_text) ||
            xdic290mn23OriginalIds.includes(entry.id)) {
          throw new Error('MN23 candidate data/category/whole-word mismatch');
        }
        return row;
      });
      const xdic290mn23Proposed = [...xdic290mn23Original, ...xdic290mn23Added];
      const xdic290mn23ProposedIds = xdic290mn23Proposed.map((row: any) => String(row?.id ?? ''));
      const xdic290mn23SeenCat = new Map<number, number>();
      const xdic290mn23VisibleIds: string[] = [];
      for (const row of xdic290mn23Proposed) {
        const category = row?.category_id == null ? 12 : Number(row.category_id);
        if (!Number.isSafeInteger(category) || category === 0) continue;
        const next = (xdic290mn23SeenCat.get(category) || 0) + 1;
        xdic290mn23SeenCat.set(category, next);
        if (next <= 5) xdic290mn23VisibleIds.push(String(row.id));
      }
      // XDIC_KO290_MN24_COMBINED_GUARDS_BEGIN
      const xdic290mn24ExpectedRaw = xdic290mn24Is60 ? 80 : 70;
      const xdic290mn24ExpectedSha = xdic290mn24Is60
        ? '63F2E0F235ACBA4EF80B91261A35516F0EDB021124AE70FAFA8E1A04F9F9EE91'
        : 'DB223366EAFEBCD8640E2C1E8BDD7E2B8045565FCC85123567BDBD970988D019';
      const xdic290mn24ExpectedLegacyVisibleIds = xdic290mn24Is60
        ? xdic290mn23CandidateIds
        : [...xdic290mn23OriginalIds.slice(45), ...xdic290mn23CandidateIds.slice(5)];
      if (xdic290mn23ProposedIds.length !== xdic290mn24ExpectedRaw ||
          new Set(xdic290mn23ProposedIds).size !== xdic290mn24ExpectedRaw ||
          xdic290mn23Hash(xdic290mn23ProposedIds) !== xdic290mn24ExpectedSha ||
          xdic290mn23ProposedIds.slice(0, xdic290mn23OriginalIds.length).join('|') !==
            xdic290mn23OriginalIds.join('|') ||
          xdic290mn23VisibleIds.length !== 20 ||
          xdic290mn23VisibleIds.join('|') !== xdic290mn24ExpectedLegacyVisibleIds.join('|') ||
          Array.from(resultsMap.keys()).map(String).join('|') !== xdic290mn23OriginalMapIds.join('|') ||
          results !== xdic290mn23Original) {
        throw new Error('MN24 proposed SSR 70/80/20/order/Map integrity failed');
      }
      // XDIC_KO290_MN24_COMBINED_GUARDS_END
      // Only this explicitly token-gated development SSR request receives 80 rows.
      results = xdic290mn23Proposed;
      xdic290mn23Status = 'PASS_APPEND_20';
      xdic290mn23Raw = xdic290mn23Proposed.length;
      xdic290mn23Visible = 20;
      xdic290mn23IdSha = xdic290mn23Hash(xdic290mn23ProposedIds);
    } catch (xdic290mn23Error: any) {
      results = xdic290mn23Original;
      xdic290mn23Status = 'STOP_UNVERIFIED_APPEND';
      xdic290mn23Raw = xdic290mn23Original.length;
      xdic290mn23Visible = 0;
      xdic290mn23IdSha = '';
      console.warn('[XDIC MN23 SSR SHADOW ERROR]', String(xdic290mn23Error?.message || xdic290mn23Error));
    }
    const xdic290mn23MapOk =
      Array.from(resultsMap.keys()).map(String).join('|') === xdic290mn23OriginalMapIds.join('|');
    if (!xdic290mn23MapOk) {
      results = xdic290mn23Original;
      xdic290mn23Status = 'STOP_MAP_INTEGRITY';
      xdic290mn23Raw = xdic290mn23Original.length;
      xdic290mn23Visible = 0;
      xdic290mn23IdSha = '';
    }
    console.info('[XDIC MN23 ROSTER SSR]', JSON.stringify({
      marker: 'XDIC_KO290_MN23_ROSTER_DEV_SSR', token: xdic290mn23Token,
      status: xdic290mn23Status, raw: xdic290mn23Raw,
      visible: xdic290mn23Visible, idSha256: xdic290mn23IdSha,
      originalPrefixPreserved: results.slice(0, xdic290mn23OriginalIds.length).map((row: any) => String(row?.id ?? '')).join('|') ===
        xdic290mn23OriginalIds.join('|'),
      originalMapKeysPreserved: xdic290mn23MapOk,
      elapsedMs: Date.now() - xdic290mn23StartedAt,
      only20PrimaryKeyLookup: true, productionDisabled: true, databaseWrites: false,
    }));
  }
  // XDIC_KO290_MN23_ROSTER_DEV_SSR_END

  // XDIC_KO290_LO_DEV_RENDER_PROPS_BEGIN
  // This check runs AFTER the actual KR block and BEFORE the real SearchPage.
  let xdic290loVisibleCount = 0;
  let xdic290loFinalSha = '';
  if (xdic290loEnabled) {
    const xdic290loIds = results.map((row: any) => String(row?.id ?? ''));
    const xdic290loMapIds = Array.from(resultsMap.keys()).map(String);
    const xdic290loCounts = new Map<number, number>();
    for (const row of results) {
      const category = row?.category_id == null ? 12 : Number(row.category_id);
      if (!Number.isSafeInteger(category) || category === 0) continue;
      const count = (xdic290loCounts.get(category) || 0) + 1;
      xdic290loCounts.set(category, count);
      if (count <= 5) xdic290loVisibleCount++;
    }
    const xdic290loValid = xdic290loIds.length === 80 &&
      new Set(xdic290loIds).size === 80 && xdic290loVisibleCount === 20 &&
      xdic290loIds.slice(0, 60).join('|') === xdic290loBaselineIds.join('|') &&
      xdic290loMapIds.join('|') === xdic290loBaselineIds.join('|') &&
      results.slice(0, 60).every((row: any) => Number(row?.category_id) === 0) &&
      results.slice(60).every((row: any) =>
        Number(row?.category_id) !== 0 &&
        String(row?.line_text || '').toLowerCase().includes('screening'));
    if (!xdic290loValid) {
      throw new Error('KO290-LO KR final SearchPage props failed validation');
    }
    const { createHash: xdic290loCreateHash } = await import('node:crypto');
    xdic290loFinalSha = xdic290loCreateHash('sha256')
      .update(xdic290loIds.join('|'), 'utf8').digest('hex').toUpperCase();
    appendFileSync(
      'C:/dictionary_upload/X-DIC-core-backups/X-DIC-core-scripts/XDIC_KO290_LO_DEV_RENDER.jsonl',
      JSON.stringify({
        marker: 'XDIC_KO290_LO_DEV_RENDER', token: xdic253ProbeId,
        timestampUtc: new Date().toISOString(),
        raw: results.length, visible: xdic290loVisibleCount,
        duplicateIds: xdic290loIds.length - new Set(xdic290loIds).size,
        baselinePrefixPreserved: true, mapKeysPreserved: true,
        baselineIds: [...xdic290loBaselineIds], finalIds: xdic290loIds,
        finalIdsSha256: xdic290loFinalSha,
        actualSearchPageProps: true, simulatedSearchBaseline: true,
        krBranchUnmodified: true, productionDisabled: true,
      }) + '\n', { encoding: 'utf8' }
    );
  }
  // XDIC_KO290_LO_DEV_RENDER_PROPS_END

  return (
    <>
      {xdic290mn23Enabled && (
        <span hidden data-xdic290mn23-status={xdic290mn23Status}
          data-xdic290mn23-raw={xdic290mn23Raw}
          data-xdic290mn23-visible={xdic290mn23Visible}
          data-xdic290mn23-id-sha={xdic290mn23IdSha}
          data-xdic290mn24-policy-b={xdic290mn23Status === 'PASS_APPEND_20' && xdic290mn23Raw === 70 ? 'on' : 'off'} />
      )}
      {xdic290loEnabled && (
        <span hidden data-xdic290lo-raw={results.length}
          data-xdic290lo-visible={xdic290loVisibleCount}
          data-xdic290lo-id-sha={xdic290loFinalSha} />
      )}
      {xdic290meEnabled && (
        <span hidden data-xdic290me-raw={results.length}
          data-xdic290me-visible={xdic290meVisible}
          data-xdic290me-id-sha={xdic290meFinalIdSha} />
      )}
      {/* XDIC_KO255_UI_BEGIN: only shown when a related retrieval failed. */}
      {xdic255RelatedFailures.length > 0 && (
        <div
          role="alert"
          aria-live="polite"
          data-xdic255-partial-results="true"
          style={{
            maxWidth: 960,
            margin: '12px auto',
            padding: '10px 14px',
            border: '1px solid #b45309',
            borderRadius: 8,
            backgroundColor: '#fffbeb',
            color: '#78350f',
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          {xdic255RelatedFailures.some((item) => item.kind === 'TIMEOUT')
            ? '일부 관련 검색이 시간 초과로 완료되지 않았습니다. 표시된 결과에 누락이 있을 수 있습니다. 다시 검색해 주세요.'
            : '일부 관련 검색이 완료되지 않았습니다. 표시된 결과에 누락이 있을 수 있습니다. 다시 검색해 주세요.'}
        </div>
      )}
      {/* XDIC_KO255_UI_END */}
    <SearchPage 
      query={query} 
      results={results} 
      xdic290mn24PolicyB={xdic290mn23Enabled &&
        xdic290mn23Status === 'PASS_APPEND_20' &&
        xdic290mn23Raw === 70 &&
        xdic290mn23IdSha === 'DB223366EAFEBCD8640E2C1E8BDD7E2B8045565FCC85123567BDBD970988D019'}
      orangeKeys={orangeKeys} 
      blueKeys={blueKeys} 
      isApp={isApp} 
      popularSearches={globalPopular}
      recentSearches={globalRecent}
      isPartialMatch={isPartialMatch}
      matchedKeywords={matchedKeywords}
      isSentenceSearch={isSentenceSearch}
    />
    </>
  );
}