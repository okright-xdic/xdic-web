/**
 * X-DIC Korean Predicate Shadow v1 (stage 3-228)
 * This module is deliberately NOT imported by app/page.tsx or any API route.
 * No SQL, UI, ranking or CORE behavior changes until separately approved.
 * Conservative, opt-in morphology observations only; NOT a grammar checker.
 */

export type XdicKoShadowTense = 'PRESENT' | 'PAST' | 'FUTURE' | 'CONDITIONAL' | 'PAST_CONJECTURE' | 'UNKNOWN';
export type XdicKoShadowPolarity = 'POSITIVE' | 'NEGATIVE' | 'INABILITY' | 'UNKNOWN';
export type XdicKoShadowForm = 'SIMPLE' | 'PROGRESSIVE' | 'OBLIGATION' | 'INTENTION' | 'QUOTATION' | 'OTHER';

export interface XdicKoPredicateShadowV1 {
  readonly shadowOnly: true;
  readonly original: string;
  readonly normalized: string;
  readonly changed: boolean;
  readonly appliedRules: readonly string[];
  readonly predicatePhrase: string | null;
  readonly lemma: string | null;
  readonly tense: XdicKoShadowTense;
  readonly polarity: XdicKoShadowPolarity;
  readonly form: XdicKoShadowForm;
  readonly protectedConstruction: boolean;
  readonly isInterrogative: boolean;
  readonly candidatePhrases: readonly string[];
  readonly suppressedStandaloneKeywords: readonly string[];
}

// Conservative set of dictionary-like 'N+하다' stems for SHADOW ONLY.
// Unknown stems are intentionally not joined: false positives are more harmful.
const VERIFIED_SHADOW_HA_STEMS = [
  '사랑', '공부', '노력', '운동', '연락', '확인', '설명', '준비', '정리',
  '시작', '계획', '결정', '예약', '선택', '제출', '검토', '참석', '연습',
  '사용', '진행', '수정', '완료', '신청', '요청', '수행', '처리',
  '해결', '작성', '번역', '검색', '조회', '관리', '등록', '개발',
] as const;

const HA_STEM_PATTERN = VERIFIED_SHADOW_HA_STEMS.join('|');

// X-DIC 3-232: verified lexical base verbs in '-아/어야 하다' constructions.
// This is Shadow-only: unverified forms keep the existing conservative behavior.
const VERIFIED_SHADOW_OBLIGATION_LEMMAS: Readonly<Record<string, string>> = {
  '받아야': '받다',
  '가야': '가다',
  '먹어야': '먹다',
  '읽어야': '읽다',
  '타야': '타다',
  '와야': '오다',
  '봐야': '보다',
  '해야': '하다',
};

// Specific, sentence-terminal patterns only; no broad text-wide substitution.
// Preserve meaning-sensitive auxiliary spacing, especially '-아/어야 하다'.
const JOIN_HA_ENDINGS = [
  '할 것입니다', '할 거예요', '할 거야', '하겠습니다',
  '하고 있었어요', '하고 있어요', '했었습니다', '했었어요', '하였어요', '했습니다', '했어요',
  '합니다', '한다', '했다', '해요',
];

const NEG_MOT_AUX_ENDINGS = ['못했습니다', '못했어요', '못합니다', '못해요'];

const NEG_AUX_ENDINGS = [
  '않을 것입니다', '않을 거예요', '않을 거야',
  '않았습니다', '않았어요', '않았다',
  '않습니다', '않아요', '않는다', '않다',
];

const END_PUNCTUATION = '[.!?]*$';
const joinHaPattern = new RegExp(
  `(^|\\s)(${HA_STEM_PATTERN})\\s+(${JOIN_HA_ENDINGS.join('|')})(?=${END_PUNCTUATION})`,
  'u'
);
const joinJiAnhPattern = new RegExp(
  `(^|\\s)(${HA_STEM_PATTERN})\\s*(하지)\\s*(${NEG_AUX_ENDINGS.join('|')})(?=${END_PUNCTUATION})`,
  'u'
);
const joinJiMotPattern = new RegExp(
  `(^|\\s)(${HA_STEM_PATTERN})\\s*(하지)\\s*(${NEG_MOT_AUX_ENDINGS.join('|')})(?=${END_PUNCTUATION})`,
  'u'
);
const joinObligationPattern = new RegExp(
  `(^|\\s)(${HA_STEM_PATTERN})\\s+(해야)(?=\\s+(?:했어요|했습니다|해요|합니다|한다|했다)[.!?]*$)`,
  'u'
);

const POSITIVE_ENDINGS: readonly [string, XdicKoShadowTense, XdicKoShadowForm][] = [
  ['하고 있었어요', 'PAST', 'PROGRESSIVE'],
  ['하고 있어요', 'PRESENT', 'PROGRESSIVE'],
  ['할 것입니다', 'FUTURE', 'SIMPLE'],
  ['할 거예요', 'FUTURE', 'SIMPLE'],
  ['할 거야', 'FUTURE', 'SIMPLE'],
  ['하겠습니다', 'FUTURE', 'SIMPLE'],
  ['해야 했어요', 'PAST', 'OBLIGATION'],
  ['해야 했습니다', 'PAST', 'OBLIGATION'],
  ['해야 합니다', 'PRESENT', 'OBLIGATION'],
  ['해야 해요', 'PRESENT', 'OBLIGATION'],
  ['했더라면', 'CONDITIONAL', 'SIMPLE'],
  ['했었어요', 'PAST', 'SIMPLE'],
  ['했습니다', 'PAST', 'SIMPLE'],
  ['했어요', 'PAST', 'SIMPLE'],
  ['하였어요', 'PAST', 'SIMPLE'],
  ['합니다', 'PRESENT', 'SIMPLE'],
  ['한다', 'PRESENT', 'SIMPLE'],
  ['했다', 'PAST', 'SIMPLE'],
  ['해요', 'PRESENT', 'SIMPLE'],
];

const NEGATIVE_ENDINGS: readonly [string, XdicKoShadowTense][] = [
  ['하지 않을 것입니다', 'FUTURE'],
  ['하지 않을 거예요', 'FUTURE'],
  ['하지 않을 거야', 'FUTURE'],
  ['하지 않았습니다', 'PAST'],
  ['하지 않았어요', 'PAST'],
  ['하지 않았다', 'PAST'],
  ['하지 않습니다', 'PRESENT'],
  ['하지 않아요', 'PRESENT'],
  ['하지 않는다', 'PRESENT'],
];

function uniq(items: readonly string[]): string[] {
  return [...new Set(items.filter((item) => item.length > 0))];
}

function stripSentencePunctuation(value: string): string {
  return value.replace(/[.!?]+$/u, '').trimEnd();
}

export function analyzeXdicKoPredicateShadowV1(input: string): XdicKoPredicateShadowV1 {
  const original = input;
  let normalized = input.replace(/\s+/gu, ' ').trim();
  const appliedRules: string[] = [];

  const applyRule = (pattern: RegExp, replace: (...parts: string[]) => string, rule: string): void => {
    const next = normalized.replace(pattern, (...parts: string[]) => replace(...parts));
    if (next !== normalized) {
      normalized = next;
      appliedRules.push(rule);
    }
  };

  // Do not rewrite '숙제를 했어요', '오라고 했어요', '가려고 했어요', etc.
  // Only a small allowlist of unsuffixed N+하다 stems is joined.
  applyRule(joinJiAnhPattern, (_match, prefix, stem, ji, anh) =>
    `${prefix}${stem}${ji} ${anh}`, 'JOIN_VERB_NEGATIVE');
  applyRule(joinJiMotPattern, (_match, prefix, stem, ji, mot) =>
    `${prefix}${stem}${ji} ${mot}`, 'JOIN_VERB_INABILITY');
  applyRule(joinObligationPattern, (_match, prefix, stem, obligation) =>
    `${prefix}${stem}${obligation}`, 'JOIN_VERB_OBLIGATION');
  applyRule(joinHaPattern, (_match, prefix, stem, ending) =>
    `${prefix}${stem}${ending}`, 'JOIN_VERB_HA');

  const bare = stripSentencePunctuation(normalized);
  let predicatePhrase: string | null = null;
  let lemma: string | null = null;
  let tense: XdicKoShadowTense = 'UNKNOWN';
  let polarity: XdicKoShadowPolarity = 'UNKNOWN';
  let form: XdicKoShadowForm = 'OTHER';
  let protectedConstruction = false;

  // Never strip negative auxiliaries from the predicate's search unit.
  for (const stem of VERIFIED_SHADOW_HA_STEMS) {
    const incap = NEG_MOT_AUX_ENDINGS.find((ending) => bare.endsWith(stem + '하지 ' + ending));
    if (incap) {
      predicatePhrase = stem + '하지 ' + incap;
      lemma = stem + '하다';
      tense = incap.startsWith('못했') ? 'PAST' : 'PRESENT';
      polarity = 'INABILITY';
      form = 'SIMPLE';
      break;
    }
    const neg = NEGATIVE_ENDINGS.find(([ending]) => bare.endsWith(stem + ending));
    if (neg) {
      predicatePhrase = stem + neg[0];
      lemma = stem + '하다';
      tense = neg[1];
      polarity = 'NEGATIVE';
      form = 'SIMPLE';
      break;
    }

    const negShort = bare.match(new RegExp(`(?:^|\\s)(${stem})\\s+(안|못)\\s+(했어요|했습니다|해요|합니다)$`, 'u'));
    if (negShort) {
      predicatePhrase = `${stem} ${negShort[2]} ${negShort[3]}`;
      lemma = stem + '하다';
      tense = negShort[3].startsWith('했') ? 'PAST' : 'PRESENT';
      polarity = negShort[2] === '못' ? 'INABILITY' : 'NEGATIVE';
      form = 'SIMPLE';
      protectedConstruction = true;
      break;
    }

    const pos = POSITIVE_ENDINGS.find(([ending]) => bare.endsWith(stem + ending));
    if (pos) {
      predicatePhrase = stem + pos[0];
      lemma = stem + '하다';
      tense = pos[1];
      polarity = 'POSITIVE';
      form = pos[2];
      break;
    }
  }

  // Phrase-bound auxiliary '하다' is not a license to glue the preceding word.
  // Keep the particle/quotative/intention/adverb and verb together for retrieval.
  if (!predicatePhrase) {
    const protectedMatch = bare.match(
      /((?:[^\s]+(?:을|를|라고|려고|게|아야|어야|만|야)|스스로)\s+(?:했어요|했습니다|해요|합니다|했다|한다))$/u
    );
    if (protectedMatch) {
      predicatePhrase = protectedMatch[1];
      lemma = '하다';
      tense = /했어요|했습니다|했다$/u.test(predicatePhrase) ? 'PAST' : 'PRESENT';
      polarity = 'POSITIVE';
      form = /라고\s+/u.test(predicatePhrase) ? 'QUOTATION' :
        /려고\s+/u.test(predicatePhrase) ? 'INTENTION' : 'OTHER';
      protectedConstruction = true;
      // '받아야 해요' is lexical '받다' + obligation auxiliary '하다',
      // not a simple '하다' predicate.  Existing surface phrasing is untouched.
      const auxiliaryHead = protectedMatch[1].split(/\s+/u)[0];
      const verifiedLemma = VERIFIED_SHADOW_OBLIGATION_LEMMAS[auxiliaryHead];
      if (verifiedLemma) {
        lemma = verifiedLemma;
        form = 'OBLIGATION';
      }
    }
  }

  // X-DIC 3-230: independent shadow coverage for ordinary V-지 않다 endings.
  // This does not rewrite source text or perform SQL.  The -지 segment alone
  // establishes a Korean verbal negative, avoiding generic '않았어요' retrieval.
  // Past-conjectural '않았을 거예요' must not be flattened to simple FUTURE/PAST.
  if (!predicatePhrase) {
    const verbNeg = bare.match(
      /(?:^|\s)([가-힣]{1,16})지\s+(않았을 거예요|않을 것입니다|않을 거예요|않았습니다|않았어요|않았다|않습니다|않아요|않는다)$/u
    );
    if (verbNeg) {
      const verbStem = verbNeg[1];
      const negativeTail = verbNeg[2];
      predicatePhrase = `${verbStem}지 ${negativeTail}`;
      lemma = `${verbStem}다`;
      tense = negativeTail === '않았을 거예요' ? 'PAST_CONJECTURE' :
        negativeTail.startsWith('않을') ? 'FUTURE' :
        negativeTail.startsWith('않았') ? 'PAST' : 'PRESENT';
      polarity = 'NEGATIVE';
      form = 'SIMPLE';
    }
  }

  if (!predicatePhrase) {
    const genericMatch = bare.match(/(?:^|\s)(안 했어요|못 했어요|하지 않았어요|하지 않아요|않았어요|않아요|했어요|해요|합니다)$/u);
    if (genericMatch) {
      predicatePhrase = genericMatch[1];
      lemma = genericMatch[1].includes('않') ? '않다' : '하다';
      polarity = genericMatch[1].startsWith('못') ? 'INABILITY' :
        /안 |않/u.test(genericMatch[1]) ? 'NEGATIVE' : 'POSITIVE';
      tense = /했|않았/u.test(genericMatch[1]) ? 'PAST' : 'PRESENT';
      form = 'OTHER';
    }
  }

  const genericTails = ['해요', '했어요', '않았어요', '않아요', '합니다', '했습니다'];
  const suppressedStandaloneKeywords = predicatePhrase && !genericTails.includes(predicatePhrase)
    ? uniq([
      ...genericTails.filter((token) => predicatePhrase!.endsWith(token)),
      ...(predicatePhrase.endsWith('않았을 거예요') ? ['않았을', '거예요'] : []),
    ])
    : [];

  // Candidate phrases are for offline observation, not automatic DB querying.
  // Never promote generic '하다'/'않다' or all tenses into SQL predicates.
  const candidatePhrases = uniq([
    normalized,
    ...(predicatePhrase && predicatePhrase !== normalized && predicatePhrase.length > 3 ? [predicatePhrase] : []),
  ]);

  return {
    shadowOnly: true,
    original,
    normalized,
    changed: normalized !== original,
    appliedRules,
    predicatePhrase,
    lemma,
    tense,
    polarity,
    form,
    protectedConstruction,
    isInterrogative: /\?\s*$/u.test(normalized),
    candidatePhrases,
    suppressedStandaloneKeywords,
  };
}
