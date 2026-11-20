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
  // XDIC_KO253_TRACE_BEGIN: read-only request-scoped local telemetry.
  // Only requests with an explicit 32-hex probe token and two known phrases are traced.
  const xdic253ProbeId = String(
    (searchParams as { q?: string; app?: string; ko253?: string }).ko253 || ''
  );
  const xdic253Enabled =
    process.env.NODE_ENV === 'development' &&
    (cleanQuery === '예비 후보' || cleanQuery === '후보 명단') &&
    /^[a-f0-9]{32}$/i.test(xdic253ProbeId);
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
               try {
                 const { data, error } = await supabase
                   .from('dictionary_lines')
                   .select('id')
                   .ilike('line_text', `%${spaceCorrected}%`)
                   .limit(1);
                 if (!error && Array.isArray(data) && data.length === 0) {
                   shouldRunOriginal = false;
                 }
               } catch (_error) {
                 // Probe failed: run original eight queries as before.
               }
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
          try {
            const { data } = await withStableEnglishWordOrder(
              supabase.from('dictionary_lines')
                .select('*')
                .ilike('line_text', `%${bestSplit!.p1}%`)
                .ilike('line_text', `%${bestSplit!.p2}%`)
                .order('category_id', { ascending: true }),
              true
            ).limit(50);
            if (data) data.forEach(item => addRes(item));
          } catch(e) {}
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
    // XDIC_KO286B_SHADOW_TIMER_BEGIN: all related-ILIKE calls, including non-sentence queries.
    const xdic286bStarted = process.env.NODE_ENV === 'development' ? Date.now() : 0;
    // XDIC_KO286B_SHADOW_TIMER_END
    const xdic223RelatedStarted = isSentenceSearch && process.env.NODE_ENV !== 'production' ? Date.now() : 0;
    // XDIC_KO256_START_BEGIN: timing only for the pre-existing KO253 opt-in probes.
    const xdic256RelatedStarted = xdic253Enabled ? Date.now() : 0;
    // XDIC_KO256_START_END
    try {
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
      const xdic255EffectiveError = error || xdic255InjectedError;
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

  return (
    <>
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