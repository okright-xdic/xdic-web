// @ts-nocheck
import koEnRules from './translate-search/rules-ko-en.json';
import enKoRules from './translate-en-ko/rules-en-ko.json';

// ============================================================================
// ☆ TwoPro Slot Similarity v1 — Stage 7 Shadow Mode
//
// - 기존 API 응답/우선순위에는 영향을 주지 않습니다.
// - exact 슬롯 결과가 만들어지지 않은 경우 route에서 호출합니다.
// - 실제 rules-ko-en.json / rules-en-ko.json을 한 번 컴파일합니다.
// - 후보 검색 → PatternScore → Semantic Veto → Difference Budget
//   → 기존 slotConfidence callback → finalConfidence를 계산합니다.
// - 결과는 console.log 진단으로만 남깁니다.
//
// 활성화:
// development/test: 기본 ON
// production: 기본 OFF
// TWO_PRO_SLOT_SIMILARITY_SHADOW=1 -> 강제 ON
// TWO_PRO_SLOT_SIMILARITY_SHADOW=0 -> 강제 OFF
// ============================================================================

export type TwoProSlotSimilarityDirectionV1 =
  | 'KO_EN'
  | 'EN_KO';

export type TwoProSlotSimilarityShadowSlotV1 = {
  slotId: string;
  occurrence: number;
  value: string;
};

export type TwoProSlotSimilarityResolvedSlotV1 = {
  resolved: boolean;
  confidence: number;
  selected?: string | null;
  origin?: string | null;
  candidateCount?: number | null;
};

export type TwoProSlotSimilarityShadowResolverV1 = (
  slot: TwoProSlotSimilarityShadowSlotV1
) => Promise<TwoProSlotSimilarityResolvedSlotV1>;

export type TwoProSlotSimilarityShadowRequestV1 = {
  direction: TwoProSlotSimilarityDirectionV1;
  inputText: string;
  resolveSlotConfidence?: TwoProSlotSimilarityShadowResolverV1;
};

type TwoProShadowForceV1 =
  | 'DECLARATIVE'
  | 'QUESTION'
  | 'REQUEST'
  | 'IMPERATIVE'
  | 'PROHIBITION'
  | 'UNKNOWN';

type TwoProShadowRuleV1 = {
  direction: TwoProSlotSimilarityDirectionV1;
  sourcePattern: string;
  targetTemplate: string;
  normalizedPattern: string;
  slots: string[];
  anchors: string[];
  relationSignatures: string[];
  operatorSignatures: string[];
  force: TwoProShadowForceV1;
  tamSignatures: string[];
  politeness: string;
  exactRegex: RegExp | null;
  lowRiskRegex: RegExp | null;
  specificity: number;
};

type TwoProShadowCandidateV1 = {
  rule: TwoProShadowRuleV1;
  patternScore: number;
  components: {
    anchor: number | null;
    slotTopology: number | null;
    relation: number | null;
    operator: number | null;
    sentenceForce: number | null;
    tam: number | null;
    politeness: number | null;
    difference: number | null;
  };
  semanticSafety: 'PASS' | 'REVIEW' | 'FAIL';
  semanticVetoes: string[];
  budgetStatus:
    | 'PASS_TIER1'
    | 'PASS_TIER2_CANDIDATE'
    | 'REVIEW'
    | 'FAIL';
  reasonCodes: string[];
  capturedSlots: TwoProSlotSimilarityShadowSlotV1[];
  exactStructuralMatch: boolean;
  lowRiskStructuralMatch: boolean;
  lowRiskChanges: string[];
};

const TWO_PRO_STAGE6_THRESHOLDS_V1 = {
  KO_EN: {
    tier2PatternScoreMin: 0.995,
    tier2SlotConfidenceMin: 0.91,
    tier2FinalConfidenceMin: 0.91,
    tier2PatternMarginMin: 0.03,
    tier3PatternScoreMin: 0.80,
    tier3PatternMarginMin: 0.015,
  },
  EN_KO: {
    tier2PatternScoreMin: 0.993,
    tier2SlotConfidenceMin: 0.90,
    tier2FinalConfidenceMin: 0.90,
    tier2PatternMarginMin: 0.03,
    tier3PatternScoreMin: 0.80,
    tier3PatternMarginMin: 0.015,
  },
} as const;

const TWO_PRO_PATTERN_WEIGHTS_V1 = {
  anchor: 0.30,
  slotTopology: 0.20,
  relation: 0.15,
  operator: 0.15,
  sentenceForce: 0.10,
  tam: 0.05,
  politeness: 0.02,
  difference: 0.03,
} as const;

const TWO_PRO_CRITICAL_COMPONENTS_V1 = [
  'anchor',
  'slotTopology',
  'relation',
  'operator',
  'sentenceForce',
] as const;

const TWO_PRO_EN_STOPWORDS_V1 = new Set([
  'a','an','the','this','that','these','those',
  'i','you','he','she','we','they','it',
  'me','us','him','her','them','my','your','our','their','his','its',
  'to','from','in','on','at','of','for','by','with','without','into','out',
  'over','under','and','or','but','if','when','before','after',
  'is','am','are','was','were','be','been','do','does','did','have','has','had',
  'can','could','may','might','must','should','would','will','shall',
  'not','no','never','please','some','any',
]);

const TWO_PRO_EN_IRREGULAR_V1: Record<string,string> = {
  sent:'send', gave:'give', given:'give', went:'go', gone:'go',
  made:'make', bought:'buy', brought:'bring', took:'take', taken:'take',
  found:'find', thought:'think', told:'tell', said:'say', got:'get',
  came:'come', seen:'see', saw:'see', wrote:'write', written:'write',
  read:'read', had:'have', did:'do', was:'be', were:'be',
};

const twoProClamp01V1 = (value: number): number =>
  Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

export const twoProIsSlotSimilarityShadowEnabledV1 = (): boolean => {
  const raw = String(
    process.env.TWO_PRO_SLOT_SIMILARITY_SHADOW || ''
  ).trim().toLowerCase();

  if (['0','false','off','no'].includes(raw)) return false;
  if (['1','true','on','yes'].includes(raw)) return true;

  return process.env.NODE_ENV !== 'production';
};

const twoProNormalizeEnV1 = (value: unknown): string =>
  String(value || '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[‐‑‒–—]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/\s+([?.!,;:])/g, '$1')
    .trim();

const twoProNormalizeKoV1 = (value: unknown): string =>
  String(value || '')
    .normalize('NFC')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[‐‑‒–—]/g, '-')
    .replace(/\s+/g, ' ')
    // ☆ Stage 8B v1.2 — safe polite-request spacing canonicalization
    // 확인해주세요 / 확인해 주세요, 보내주세요 / 보내 주세요처럼
    // 의미가 변하지 않는 '주세요' 계열 보조용언 앞 공백만 통일합니다.
    // 전역 Korean whitespace를 \s*로 느슨하게 만들지 않아 lexical token
    // 경계가 무너지는 것을 방지합니다.
    .replace(
      /([가-힣])(?=(?:주세요|주십시오|주시겠어요|주시겠습니까)(?:[?.!,;:]|$))/gu,
      '$1 '
    )
    .replace(/\s+([?.!,;:])/g, '$1')
    .trim();

const twoProNormalizeV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  value: unknown
): string =>
  direction === 'EN_KO'
    ? twoProNormalizeEnV1(value)
    : twoProNormalizeKoV1(value);

const twoProStripTerminalPunctuationV1 = (value: string): string =>
  String(value || '').replace(/[.!?。！？]+$/u, '').trim();

const twoProTokenizeEnV1 = (value: string): string[] =>
  String(value || '').toLowerCase().match(
    /[a-z0-9]+(?:'[a-z]+)?|\[[a-z][a-z0-9_]*\]/g
  ) || [];

const twoProTokenizeKoV1 = (value: string): string[] =>
  String(value || '')
    .replace(/\[[A-Za-z][A-Za-z0-9_]*\]/g, ' ')
    .replace(/[?.!,;:'"“”‘’()[\]{}]/g, ' ')
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

const twoProEnglishLemmaV1 = (raw: string): string => {
  const token = String(raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9'-]/g, '');

  if (!token) return '';
  if (TWO_PRO_EN_IRREGULAR_V1[token]) return TWO_PRO_EN_IRREGULAR_V1[token];

  if (token.endsWith('ies') && token.length > 4) {
    return `${token.slice(0, -3)}y`;
  }
  if (token.endsWith('ing') && token.length > 5) {
    const stem = token.slice(0, -3);
    return stem.length > 2 && stem.endsWith(stem.slice(-1).repeat(2))
      ? stem.slice(0, -1)
      : stem;
  }
  if (token.endsWith('ed') && token.length > 4) {
    const stem = token.slice(0, -2);
    return stem.length > 2 && stem.endsWith(stem.slice(-1).repeat(2))
      ? stem.slice(0, -1)
      : stem;
  }
  if (token.endsWith('es') && token.length > 4) return token.slice(0, -2);
  if (token.endsWith('s') && token.length > 3) return token.slice(0, -1);
  return token;
};

const twoProKoreanAnchorV1 = (raw: string): string =>
  String(raw || '')
    .normalize('NFC')
    .replace(/[?.!,;:'"“”‘’()[\]{}]/g, '')
    .replace(
      /(주시겠어요|주십시오|주세요|합니다|했습니다|합니까|했나요|이에요|예요|입니다|인가요|나요|까요)$/u,
      ''
    )
    .replace(
      /(은|는|이|가|을|를|와|과|에게|께|에서|에|로|으로)$/u,
      ''
    )
    .trim();

const twoProAnchorLemmaV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  raw: string
): string =>
  direction === 'EN_KO'
    ? twoProEnglishLemmaV1(raw)
    : twoProKoreanAnchorV1(raw);

const twoProLowRiskNormalizeV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  value: string
): { text: string; removed: string[] } => {
  let text = twoProStripTerminalPunctuationV1(
    twoProNormalizeV1(direction, value)
  );

  const removed: string[] = [];

  if (direction === 'EN_KO') {
    const before = text;
    text = text
      .replace(/^please[\s,]+/i, '')
      .replace(/,\s*please$/i, '')
      .replace(/\s+please$/i, '')
      .trim();

    if (text !== before) removed.push('please');
  } else {
    const next = text.split(/\s+/).filter((part) => {
      if (part === '좀') {
        removed.push('좀');
        return false;
      }
      return true;
    });
    text = next.join(' ').trim();
  }

  return { text, removed };
};

const twoProDetectForceV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  rawValue: string
): TwoProShadowForceV1 => {
  const original = twoProNormalizeV1(direction, rawValue);
  const value = twoProStripTerminalPunctuationV1(original);
  if (!value) return 'UNKNOWN';

  if (direction === 'EN_KO') {
    if (/^(do not|don't|never)\b/.test(value)) return 'PROHIBITION';
    if (/^please\b/.test(value) || /^(could|can|would|will) you\b/.test(value)) {
      return 'REQUEST';
    }
    if (
      /\?$/.test(original) ||
      /^(who|what|where|when|why|how|do|does|did|is|are|am|was|were|have|has|had|may|could|can|would|will)\b/.test(value)
    ) {
      return 'QUESTION';
    }
    return 'DECLARATIVE';
  }

  if (/(지\s*마세요|지\s*마십시오|하지\s*마세요|하지\s*마십시오)$/u.test(value)) {
    return 'PROHIBITION';
  }
  if (/(주세요|주십시오|주시겠어요|주시겠습니까|해\s*주세요|해\s*주십시오|하세요)$/u.test(value)) {
    return 'REQUEST';
  }
  if (
    /\?$/.test(original) ||
    /(나요|까요|습니까|인가요|있나요|필요한가요)$/u.test(value)
  ) {
    return 'QUESTION';
  }
  return 'DECLARATIVE';
};

const twoProDetectOperatorsV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  rawValue: string
): string[] => {
  const value = twoProNormalizeV1(direction, rawValue);
  const result = new Set<string>();

  if (direction === 'EN_KO') {
    if (/\bnot\b/.test(value) || /n't\b/.test(value) || /\bnever\b/.test(value) || /\bno\b/.test(value)) {
      result.add('NEGATION:NEG');
    }

    const modal = value.match(
      /\b(can|could|may|might|must|should|would|will|shall)\b/
    )?.[1];
    if (modal) result.add(`MODALITY:${modal}`);

    if (/\bif\b/.test(value)) result.add('CONDITION:IF');
    if (/\bunless\b/.test(value)) result.add('CONDITION:UNLESS');
    if (/\bmore\b/.test(value)) result.add('COMPARISON:MORE');
    if (/\bless\b/.test(value)) result.add('COMPARISON:LESS');
    if (/\bwithout\b/.test(value)) result.add('INCLUSION_EXCLUSION:WITHOUT');
    else if (/\bwith\b/.test(value)) result.add('INCLUSION_EXCLUSION:WITH');
    if (/\bbefore\b/.test(value)) result.add('TEMPORAL_ORDER:BEFORE');
    if (/\bafter\b/.test(value)) result.add('TEMPORAL_ORDER:AFTER');
    if (/\bfrom\b/.test(value)) result.add('DIRECTION:FROM');
    if (/\bto\b/.test(value)) result.add('DIRECTION:TO');
    if (/\bnone\b/.test(value) || /\bat most\b/.test(value)) result.add('QUANTITY:LOW_OR_NONE');
    if (/\ball\b/.test(value) || /\bat least\b/.test(value)) result.add('QUANTITY:HIGH_OR_ALL');

    return [...result].sort();
  }

  if (
    /(^|\s)안(\s|$)/u.test(value) ||
    /(^|\s)못(\s|$)/u.test(value) ||
    /(지\s*않|지\s*못|지\s*마|아니|없)/u.test(value)
  ) {
    result.add('NEGATION:NEG');
  }

  if (/수\s*없/u.test(value)) result.add('MODALITY:CANNOT');
  else if (/수\s*있/u.test(value)) result.add('MODALITY:CAN');

  if (/(해야\s*한다|해야\s*합니다|하십시오)/u.test(value)) result.add('MODALITY:MUST');
  if (/(으?면|아니면)/u.test(value)) result.add('CONDITION:IF');
  if (/(^|\s)더(\s|$)/u.test(value)) result.add('COMPARISON:MORE');
  if (/(^|\s)덜(\s|$)/u.test(value)) result.add('COMPARISON:LESS');
  if (/(없이|제외)/u.test(value)) result.add('INCLUSION_EXCLUSION:WITHOUT');
  if (/(함께|포함)/u.test(value)) result.add('INCLUSION_EXCLUSION:WITH');
  if (/(전에|이전)/u.test(value)) result.add('TEMPORAL_ORDER:BEFORE');
  if (/(후에|이후)/u.test(value)) result.add('TEMPORAL_ORDER:AFTER');
  if (/(에게서|으로부터|로부터)/u.test(value)) result.add('DIRECTION:FROM');
  if (/(에게|까지|으로|로)(?:\s|$)/u.test(value)) result.add('DIRECTION:TO');
  if (/(최소|이상|모두)/u.test(value)) result.add('QUANTITY:HIGH_OR_ALL');
  if (/(최대|이하|아무도)/u.test(value)) result.add('QUANTITY:LOW_OR_NONE');

  return [...result].sort();
};

const twoProDetectRelationsV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  rawValue: string
): string[] => {
  const value = twoProNormalizeV1(direction, rawValue);
  const out = new Set<string>();

  if (direction === 'EN_KO') {
    if (/\bfrom\b/.test(value)) out.add('SOURCE');
    if (/\bto\b/.test(value)) out.add('DIRECTION');
    if (/\bin\b|\bat\b|\bon\b/.test(value)) out.add('LOCATION');
    if (/\bwith\b/.test(value)) out.add('COMPANION_OR_INSTRUMENT');
    if (/\bfor\b/.test(value)) out.add('PURPOSE_OR_BENEFICIARY');
    if (/\bof\b/.test(value)) out.add('POSSESSION_OR_COMPLEMENT');
    if (/\bbefore\b|\bafter\b/.test(value)) out.add('TIME');
    return [...out].sort();
  }

  if (/에게서|한테서|께서/u.test(value)) out.add('SOURCE');
  if (/에게|한테|께/u.test(value)) out.add('RECIPIENT');
  if (/에서/u.test(value)) out.add('LOCATION_OR_SOURCE');
  if (/을\/를|을|를/u.test(value)) out.add('OBJECT');
  if (/와\/과|과\/와|와|과/u.test(value)) out.add('COMPANION');
  if (/(으로|로)/u.test(value)) out.add('DIRECTION_OR_INSTRUMENT');
  if (/전에|후에|동안/u.test(value)) out.add('TIME');
  return [...out].sort();
};

const twoProDetectTamV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  rawValue: string
): string[] => {
  const value = twoProNormalizeV1(direction, rawValue);
  const out = new Set<string>();

  if (direction === 'EN_KO') {
    if (/\b(was|were|did|had)\b/.test(value) || /\b\w+ed\b/.test(value)) {
      out.add('TENSE:PAST');
    }
    if (/\bwill\b/.test(value)) out.add('TENSE:FUTURE');
    if (/\b(has|have|had)\s+\w+(ed|en)\b/.test(value)) out.add('ASPECT:PERFECT');
    if (/\b(am|is|are|was|were)\s+\w+ing\b/.test(value)) out.add('ASPECT:PROGRESSIVE');
    return [...out].sort();
  }

  if (/(았|었|했|였습니다)/u.test(value)) out.add('TENSE:PAST');
  if (/(겠|을\s*것|ㄹ\s*것)/u.test(value)) out.add('TENSE:FUTURE');
  if (/(고\s*있|해\s*왔|하고\s*있)/u.test(value)) out.add('ASPECT:PROGRESSIVE_OR_CONTINUATIVE');
  return [...out].sort();
};

const twoProDetectPolitenessV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  rawValue: string
): string => {
  const value = twoProNormalizeV1(direction, rawValue);

  if (direction === 'EN_KO') {
    if (/\bplease\b/.test(value) || /^(could|would) you\b/.test(value)) {
      return 'POLITE';
    }
    return 'NEUTRAL';
  }

  if (/(습니다|습니까|주십시오|하십시오)/u.test(value)) return 'FORMAL_POLITE';
  if (/(요|주세요|주시겠어요|하세요)$/u.test(twoProStripTerminalPunctuationV1(value))) {
    return 'POLITE';
  }
  return 'NEUTRAL';
};

const twoProExtractAnchorsV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  rawPattern: string
): string[] => {
  let withoutSlots = twoProNormalizeV1(direction, rawPattern)
    .replace(/\[[A-Za-z][A-Za-z0-9_]*\](?:ing|ed|s)?/g, ' ');

  if (direction === 'KO_EN') {
    // Stage 3 Skeleton contract: 조사/이형태는 RELATION이고 lexical ANCHOR가 아닙니다.
    // 예: [N]을/를 확인해주세요 -> anchor는 '확인해'만 남겨야 합니다.
    withoutSlots = withoutSlots
      .replace(/(을\/를|이\/가|은\/는|와\/과|과\/와|\(으\)로|으니\/니)/gu, ' ');
  }

  const lowRisk = twoProLowRiskNormalizeV1(direction, withoutSlots).text;

  if (direction === 'EN_KO') {
    return twoProTokenizeEnV1(lowRisk)
      .filter((token) => !TWO_PRO_EN_STOPWORDS_V1.has(token))
      .map((token) => twoProAnchorLemmaV1(direction, token))
      .filter(Boolean);
  }

  return twoProTokenizeKoV1(lowRisk)
    .map((token) => twoProAnchorLemmaV1(direction, token))
    .filter((token) => {
      if (!token) return false;
      return !/^(좀|그리고|또는|하지만|때문에|동안|까지|정말|매우)$/u.test(token);
    });
};

const twoProPatternSlotIdsV1 = (rawPattern: string): string[] =>
  [...String(rawPattern || '').matchAll(/\[([A-Za-z][A-Za-z0-9_]*)\]/g)]
    .map((match) => String(match[1] || '').toUpperCase());

const twoProEscapeRegexV1 = (value: string): string =>
  String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const twoProLiteralRegexV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  rawLiteral: string,
  removeLowRisk: boolean
): string => {
  let literal = twoProNormalizeV1(direction, rawLiteral);

  if (removeLowRisk) {
    literal = twoProLowRiskNormalizeV1(direction, literal).text;
  }

  literal = twoProStripTerminalPunctuationV1(literal);

  if (!literal) return '\\s*';

  if (direction === 'KO_EN') {
    const sentinels: Array<[string,string]> = [
      ['을/를','__OBJ_PART__'],
      ['이/가','__SUBJ_PART__'],
      ['은/는','__TOPIC_PART__'],
      ['와/과','__WITH_PART__'],
      ['과/와','__WITH_PART2__'],
      ['(으)로','__RO_PART__'],
      ['으니/니','__REASON_PART__'],
    ];

    for (const [from,to] of sentinels) {
      literal = literal.split(from).join(to);
    }

    let escaped = twoProEscapeRegexV1(literal).replace(/\s+/g, '\\s+');

    return escaped
      .replace(/__OBJ_PART__/g, '(?:을|를)')
      .replace(/__SUBJ_PART__/g, '(?:이|가)')
      .replace(/__TOPIC_PART__/g, '(?:은|는)')
      .replace(/__WITH_PART__/g, '(?:와|과)')
      .replace(/__WITH_PART2__/g, '(?:과|와)')
      .replace(/__RO_PART__/g, '(?:으로|로)')
      .replace(/__REASON_PART__/g, '(?:으니|니)');
  }

  return twoProEscapeRegexV1(literal).replace(/\s+/g, '\\s+');
};

const twoProCompileFlexibleRegexV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  rawPattern: string,
  removeLowRisk: boolean
): RegExp | null => {
  const normalized = twoProNormalizeV1(direction, rawPattern);
  const matches = [
    ...normalized.matchAll(/\[([A-Za-z][A-Za-z0-9_]*)\](ing|ed|s)?/g),
  ];

  let cursor = 0;
  let source = '^\\s*';

  for (const match of matches) {
    const index = match.index || 0;

    source += twoProLiteralRegexV1(
      direction,
      normalized.slice(cursor, index),
      removeLowRisk
    );

    source += '(.+?)';

    const suffix = String(match[2] || '');
    if (suffix && direction === 'EN_KO') {
      source += twoProEscapeRegexV1(suffix);
    }

    cursor = index + String(match[0] || '').length;
  }

  source += twoProLiteralRegexV1(
    direction,
    normalized.slice(cursor),
    removeLowRisk
  );
  source += '\\s*$';

  try {
    return new RegExp(source, direction === 'EN_KO' ? 'iu' : 'u');
  } catch {
    return null;
  }
};

const twoProCompileRuleV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  sourcePattern: string,
  targetTemplate: string
): TwoProShadowRuleV1 | null => {
  if (!/\[[A-Z][A-Z0-9_]*\]/.test(sourcePattern)) return null;

  const normalizedPattern = twoProStripTerminalPunctuationV1(
    twoProNormalizeV1(direction, sourcePattern)
  );

  const slots = twoProPatternSlotIdsV1(sourcePattern);
  const anchors = twoProExtractAnchorsV1(direction, sourcePattern);

  return {
    direction,
    sourcePattern,
    targetTemplate,
    normalizedPattern,
    slots,
    anchors,
    relationSignatures: twoProDetectRelationsV1(direction, sourcePattern),
    operatorSignatures: twoProDetectOperatorsV1(direction, sourcePattern),
    force: twoProDetectForceV1(direction, sourcePattern),
    tamSignatures: twoProDetectTamV1(direction, sourcePattern),
    politeness: twoProDetectPolitenessV1(direction, sourcePattern),
    exactRegex: twoProCompileFlexibleRegexV1(direction, sourcePattern, false),
    lowRiskRegex: twoProCompileFlexibleRegexV1(direction, sourcePattern, true),
    specificity:
      anchors.length * 100 +
      normalizedPattern
        .replace(/\[[A-Za-z][A-Za-z0-9_]*\]/g, '')
        .replace(/\s+/g, '')
        .length -
      slots.length,
  };
};

const twoProCompileRuleSetV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  rawRules: Record<string,unknown>
): TwoProShadowRuleV1[] =>
  Object.entries(rawRules)
    .map(([sourcePattern,rawTarget]) =>
      twoProCompileRuleV1(direction, sourcePattern, String(rawTarget || ''))
    )
    .filter((item): item is TwoProShadowRuleV1 => Boolean(item));

const TWO_PRO_KO_EN_RULES_V1 =
  twoProCompileRuleSetV1('KO_EN', koEnRules as Record<string,unknown>);

const TWO_PRO_EN_KO_RULES_V1 =
  twoProCompileRuleSetV1('EN_KO', enKoRules as Record<string,unknown>);

const twoProMatchedAnchorPositionsV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  anchors: string[],
  inputText: string
): { matched:number; total:number; inOrder:boolean } => {
  if (!anchors.length) {
    return { matched:0, total:0, inOrder:true };
  }

  const lowRisk = twoProLowRiskNormalizeV1(direction, inputText).text;

  const tokens =
    direction === 'EN_KO'
      ? twoProTokenizeEnV1(lowRisk)
          .map((token) => twoProAnchorLemmaV1(direction, token))
          .filter(Boolean)
      : twoProTokenizeKoV1(lowRisk)
          .map((token) => twoProAnchorLemmaV1(direction, token))
          .filter(Boolean);

  let cursor = 0;
  let matched = 0;

  for (const anchor of anchors) {
    let found = -1;

    for (let index = cursor; index < tokens.length; index += 1) {
      if (tokens[index] === anchor) {
        found = index;
        break;
      }
    }

    if (found >= 0) {
      matched += 1;
      cursor = found + 1;
    }
  }

  return {
    matched,
    total: anchors.length,
    inOrder: matched === anchors.length,
  };
};

const twoProArrayF1V1 = (a: string[], b: string[]): number | null => {
  if (!a.length && !b.length) return null;

  const left = new Set(a);
  const right = new Set(b);
  let matched = 0;

  for (const value of left) {
    if (right.has(value)) matched += 1;
  }

  const precision = right.size ? matched / right.size : 0;
  const recall = left.size ? matched / left.size : 0;

  if (precision + recall === 0) return 0;
  return 2 * precision * recall / (precision + recall);
};

const twoProRelationScoreV1 = (
  ruleRelations: string[],
  inputRelations: string[]
): number | null => {
  if (!ruleRelations.length && !inputRelations.length) return null;
  if (!ruleRelations.length || !inputRelations.length) return 0.4;

  let sum = 0;

  for (const relation of ruleRelations) {
    if (inputRelations.includes(relation)) {
      sum += 1;
      continue;
    }

    const family = relation.split('_')[0];
    if (inputRelations.some((item) => item.split('_')[0] === family)) {
      sum += 0.7;
    }
  }

  return twoProClamp01V1(sum / ruleRelations.length);
};

const twoProTamScoreV1 = (
  ruleTam: string[],
  inputTam: string[]
): number | null => {
  if (!ruleTam.length && !inputTam.length) return null;
  if (!ruleTam.length || !inputTam.length) return 0.5;
  return twoProArrayF1V1(ruleTam, inputTam);
};

const twoProPolitenessScoreV1 = (
  rulePolite: string,
  inputPolite: string
): number | null => {
  if (!rulePolite && !inputPolite) return null;
  if (rulePolite === inputPolite) return 1;

  if (
    ['POLITE','FORMAL_POLITE'].includes(rulePolite) &&
    ['POLITE','FORMAL_POLITE'].includes(inputPolite)
  ) {
    return 0.7;
  }

  if (!rulePolite || !inputPolite) return 0.5;
  return 0;
};

const twoProSemanticSafetyV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  rule: TwoProShadowRuleV1,
  inputText: string,
  lowRiskChanges: string[]
): {
  semanticSafety:'PASS'|'REVIEW'|'FAIL';
  semanticVetoes:string[];
  reasonCodes:string[];
  adjustedInputForce:TwoProShadowForceV1;
} => {
  const inputOps = twoProDetectOperatorsV1(direction, inputText);
  const ruleOps = rule.operatorSignatures;

  const familyMap = (values:string[]): Record<string,Set<string>> => {
    const result:Record<string,Set<string>> = {};
    for (const value of values) {
      const [family,subtype] = value.split(':');
      if (!result[family]) result[family] = new Set();
      result[family].add(subtype || value);
    }
    return result;
  };

  const left = familyMap(ruleOps);
  const right = familyMap(inputOps);
  const vetoes:string[] = [];
  const reasons:string[] = [];

  const hardFamilies:Array<[string,string]> = [
    ['NEGATION','VETO_NEGATION'],
    ['DIRECTION','VETO_DIRECTION'],
    ['COMPARISON','VETO_COMPARISON_POLARITY'],
    ['INCLUSION_EXCLUSION','VETO_INCLUSION_EXCLUSION'],
    ['TEMPORAL_ORDER','VETO_TEMPORAL_ORDER'],
    ['MODALITY','VETO_MODALITY'],
    ['QUANTITY','VETO_QUANTITY_POLARITY'],
    ['EXISTENCE','VETO_EXISTENCE_POLARITY'],
    ['CONDITION','GUARD_CONDITION_OPERATOR'],
  ];

  for (const [family,code] of hardFamilies) {
    const a = left[family] || new Set();
    const b = right[family] || new Set();

    const same =
      a.size === b.size &&
      [...a].every((item) => b.has(item));

    if (!same) {
      vetoes.push(code);
      reasons.push(code);
    }
  }

  let inputForce = twoProDetectForceV1(direction, inputText);

  // EN please만 Stage 2 whitelist로 허용:
  // stored REQUEST ↔ bare request를 같은 요청 의도로 봅니다.
  if (
    direction === 'EN_KO' &&
    rule.force === 'REQUEST' &&
    lowRiskChanges.includes('please') &&
    inputForce === 'DECLARATIVE'
  ) {
    inputForce = 'REQUEST';
  }

  if (
    rule.force !== 'UNKNOWN' &&
    inputForce !== 'UNKNOWN' &&
    rule.force !== inputForce
  ) {
    if (rule.force === 'PROHIBITION' || inputForce === 'PROHIBITION') {
      vetoes.push('GUARD_SENTENCE_FORCE');
      reasons.push('GUARD_SENTENCE_FORCE');
    } else {
      reasons.push('REVIEW_SENTENCE_FORCE');
    }
  }

  if (vetoes.length) {
    return {
      semanticSafety:'FAIL',
      semanticVetoes:[...new Set(vetoes)],
      reasonCodes:[...new Set(reasons)],
      adjustedInputForce:inputForce,
    };
  }

  if (reasons.includes('REVIEW_SENTENCE_FORCE')) {
    return {
      semanticSafety:'REVIEW',
      semanticVetoes:[],
      reasonCodes:[...new Set(reasons)],
      adjustedInputForce:inputForce,
    };
  }

  return {
    semanticSafety:'PASS',
    semanticVetoes:[],
    reasonCodes:[],
    adjustedInputForce:inputForce,
  };
};

const twoProExtractCapturedSlotsV1 = (
  rule: TwoProShadowRuleV1,
  inputText: string,
  useLowRiskRegex: boolean
): TwoProSlotSimilarityShadowSlotV1[] => {
  const normalizedInput = twoProStripTerminalPunctuationV1(
    twoProNormalizeV1(rule.direction, inputText)
  );

  const lowRiskInput = twoProLowRiskNormalizeV1(
    rule.direction,
    normalizedInput
  ).text;

  const regex = useLowRiskRegex ? rule.lowRiskRegex : rule.exactRegex;
  const text = useLowRiskRegex ? lowRiskInput : normalizedInput;

  if (!regex) return [];

  const match = text.match(regex);
  if (!match) return [];

  const occurrenceMap:Record<string,number> = {};

  return rule.slots.map((slotId,index) => {
    const occurrence = occurrenceMap[slotId] || 0;
    occurrenceMap[slotId] = occurrence + 1;

    return {
      slotId,
      occurrence,
      value:String(match[index+1] || '').trim(),
    };
  });
};

const twoProPatternScoreV1 = (
  components: TwoProShadowCandidateV1['components']
): number => {
  const applicable = Object.entries(components)
    .filter(([,value]) => typeof value === 'number') as Array<
      [keyof typeof TWO_PRO_PATTERN_WEIGHTS_V1, number]
    >;

  if (!applicable.length) return 0;

  const denominator = applicable.reduce(
    (sum,[name]) => sum + TWO_PRO_PATTERN_WEIGHTS_V1[name],
    0
  );

  if (!denominator) return 0;

  const weightedMean = applicable.reduce(
    (sum,[name,value]) =>
      sum + TWO_PRO_PATTERN_WEIGHTS_V1[name] * value,
    0
  ) / denominator;

  const critical = TWO_PRO_CRITICAL_COMPONENTS_V1
    .map((name) => components[name])
    .filter((value): value is number => typeof value === 'number');

  const criticalFloor = critical.length ? Math.min(...critical) : 0;

  return Number(
    (0.75 * weightedMean + 0.25 * criticalFloor).toFixed(4)
  );
};

const twoProScoreCandidateV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  rule: TwoProShadowRuleV1,
  inputText: string
): TwoProShadowCandidateV1 | null => {
  const normalizedInput = twoProStripTerminalPunctuationV1(
    twoProNormalizeV1(direction, inputText)
  );

  const lowInputInfo = twoProLowRiskNormalizeV1(direction, normalizedInput);
  const lowPatternInfo = twoProLowRiskNormalizeV1(direction, rule.normalizedPattern);

  const lowRiskChanges = [
    ...new Set([
      ...lowInputInfo.removed,
      ...lowPatternInfo.removed,
    ]),
  ];

  // ☆ Stage 8B v1.1 — anchorless broad-slot guard
  // [N] 주세요 같은 규칙은 exact 슬롯 엔진에서는 유효하지만,
  // Similarity 후보로 쓰면 [N]이 '문서를 확인해' 같은 동사구까지
  // 삼켜 false near-match를 만들 수 있습니다.
  // 따라서 lexical CORE anchor가 없는 규칙은 Similarity에서 제외하고
  // 기존 exact 엔진에만 맡깁니다.
  if (!rule.anchors.length) {
    return null;
  }

  const exactStructuralMatch = Boolean(rule.exactRegex?.test(normalizedInput));
  const lowRiskStructuralMatch = Boolean(rule.lowRiskRegex?.test(lowInputInfo.text));

  const anchorMatch = twoProMatchedAnchorPositionsV1(
    direction,
    rule.anchors,
    lowInputInfo.text
  );

  const anchorCoverage =
    anchorMatch.total
      ? anchorMatch.matched / anchorMatch.total
      : lowRiskStructuralMatch
        ? 1
        : 0;

  if (!exactStructuralMatch && !lowRiskStructuralMatch && anchorCoverage < 0.34) {
    return null;
  }

  const anchorScore =
    anchorMatch.total
      ? 0.8 * anchorCoverage + 0.2 * (anchorMatch.inOrder ? 1 : 0)
      : lowRiskStructuralMatch
        ? 1
        : 0.5;

  const capturedSlots = twoProExtractCapturedSlotsV1(
    rule,
    inputText,
    !exactStructuralMatch
  );

  const slotTopology =
    rule.slots.length
      ? (
          capturedSlots.length === rule.slots.length
            ? 1
            : anchorCoverage === 1
              ? 0.6
              : 0
        )
      : 1;

  const inputRelations = twoProDetectRelationsV1(direction, inputText);
  const relation = twoProRelationScoreV1(rule.relationSignatures, inputRelations);

  const inputOps = twoProDetectOperatorsV1(direction, inputText);
  const operator = twoProArrayF1V1(rule.operatorSignatures, inputOps);

  const safety = twoProSemanticSafetyV1(
    direction,
    rule,
    inputText,
    lowRiskChanges
  );

  const force =
    rule.force === 'UNKNOWN' || safety.adjustedInputForce === 'UNKNOWN'
      ? 0.5
      : rule.force === safety.adjustedInputForce
        ? 1
        : 0;

  const tam = twoProTamScoreV1(
    rule.tamSignatures,
    twoProDetectTamV1(direction, inputText)
  );

  const politeness = twoProPolitenessScoreV1(
    rule.politeness,
    twoProDetectPolitenessV1(direction, inputText)
  );

  let budgetStatus:TwoProShadowCandidateV1['budgetStatus'];
  let differenceScore:number;
  const reasonCodes = [...safety.reasonCodes];

  if (safety.semanticSafety === 'FAIL') {
    budgetStatus = 'FAIL';
    differenceScore = 0;
  } else if (anchorCoverage < 1) {
    budgetStatus = 'FAIL';
    differenceScore = 0;
    reasonCodes.push('DANGER_ANCHOR_CHANGE');
  } else if (exactStructuralMatch && lowRiskChanges.length === 0) {
    budgetStatus = 'PASS_TIER1';
    differenceScore = 1;
    reasonCodes.push('EXACT_STRUCTURE_SLOT_UNCERTAIN');
  } else if (
    lowRiskStructuralMatch &&
    lowRiskChanges.length > 0 &&
    lowRiskChanges.every((item) => item === 'please' || item === '좀') &&
    safety.semanticSafety === 'PASS'
  ) {
    budgetStatus = 'PASS_TIER2_CANDIDATE';
    differenceScore = 0.95;

    for (const item of lowRiskChanges) {
      reasonCodes.push(
        item === 'please' ? 'LOW_RISK_PLEASE' : 'LOW_RISK_KO_JOM'
      );
    }
  } else {
    budgetStatus = 'REVIEW';
    differenceScore = 0.70;
    reasonCodes.push('REVIEW_UNCLASSIFIED_DIFFERENCE');
  }

  const components:TwoProShadowCandidateV1['components'] = {
    anchor:twoProClamp01V1(anchorScore),
    slotTopology:twoProClamp01V1(slotTopology),
    relation,
    operator,
    sentenceForce:force,
    tam,
    politeness,
    difference:differenceScore,
  };

  return {
    rule,
    patternScore:twoProPatternScoreV1(components),
    components,
    semanticSafety:safety.semanticSafety,
    semanticVetoes:safety.semanticVetoes,
    budgetStatus,
    reasonCodes:[...new Set(reasonCodes)],
    capturedSlots,
    exactStructuralMatch,
    lowRiskStructuralMatch,
    lowRiskChanges,
  };
};

const twoProRulesForDirectionV1 = (
  direction: TwoProSlotSimilarityDirectionV1
): TwoProShadowRuleV1[] =>
  direction === 'KO_EN' ? TWO_PRO_KO_EN_RULES_V1 : TWO_PRO_EN_KO_RULES_V1;

const twoProResolveSlotConfidenceV1 = async (
  candidate: TwoProShadowCandidateV1,
  resolver?: TwoProSlotSimilarityShadowResolverV1
): Promise<{
  slotCoverage:number;
  slotConfidence:number;
  slotConfidenceMean:number;
  weakestSlot:{
    slotId:string;
    occurrence:number;
    confidence:number;
    origin:string|null;
  }|null;
  slotDiagnostics:Array<{
    slotId:string;
    occurrence:number;
    value:string;
    resolved:boolean;
    confidence:number;
    origin:string|null;
  }>;
}> => {
  const slots = candidate.capturedSlots;

  if (!candidate.rule.slots.length) {
    return {
      slotCoverage:1,
      slotConfidence:1,
      slotConfidenceMean:1,
      weakestSlot:null,
      slotDiagnostics:[],
    };
  }

  if (slots.length !== candidate.rule.slots.length || !resolver) {
    return {
      slotCoverage:0,
      slotConfidence:0,
      slotConfidenceMean:0,
      weakestSlot:null,
      slotDiagnostics:slots.map((slot) => ({
        ...slot,
        resolved:false,
        confidence:0,
        origin:null,
      })),
    };
  }

  const diagnostics:Array<any> = [];

  for (const slot of slots) {
    try {
      const resolved = await resolver(slot);
      diagnostics.push({
        ...slot,
        resolved:Boolean(resolved?.resolved),
        confidence:twoProClamp01V1(Number(resolved?.confidence || 0)),
        origin:resolved?.origin ? String(resolved.origin) : null,
      });
    } catch {
      diagnostics.push({
        ...slot,
        resolved:false,
        confidence:0,
        origin:'resolver-error',
      });
    }
  }

  const resolved = diagnostics.filter((item) => item.resolved);
  const slotCoverage = diagnostics.length
    ? resolved.length / diagnostics.length
    : 1;

  if (slotCoverage < 1 || !resolved.length) {
    return {
      slotCoverage:Number(slotCoverage.toFixed(4)),
      slotConfidence:0,
      slotConfidenceMean:resolved.length
        ? Number(
            (
              resolved.reduce((sum,item) => sum + item.confidence,0) /
              resolved.length
            ).toFixed(4)
          )
        : 0,
      weakestSlot:null,
      slotDiagnostics:diagnostics,
    };
  }

  const weakest = [...resolved].sort(
    (a,b) => a.confidence - b.confidence
  )[0];

  return {
    slotCoverage:1,
    slotConfidence:Number(weakest.confidence.toFixed(4)),
    slotConfidenceMean:Number(
      (
        resolved.reduce((sum,item) => sum + item.confidence,0) /
        resolved.length
      ).toFixed(4)
    ),
    weakestSlot:{
      slotId:weakest.slotId,
      occurrence:weakest.occurrence,
      confidence:weakest.confidence,
      origin:weakest.origin,
    },
    slotDiagnostics:diagnostics,
  };
};

const twoProSuggestTierV1 = (
  direction:TwoProSlotSimilarityDirectionV1,
  candidate:TwoProShadowCandidateV1,
  secondPatternScore:number|null,
  slotCoverage:number,
  slotConfidence:number,
  finalConfidence:number
): string => {
  const threshold = TWO_PRO_STAGE6_THRESHOLDS_V1[direction];
  const patternMargin =
    secondPatternScore === null
      ? 1
      : Math.max(0, candidate.patternScore - secondPatternScore);

  if (candidate.semanticSafety === 'FAIL' || candidate.budgetStatus === 'FAIL') {
    return 'REJECT';
  }

  if (
    candidate.exactStructuralMatch &&
    candidate.budgetStatus === 'PASS_TIER1'
  ) {
    return 'EXACT_STRUCTURE_SLOT_UNCERTAIN';
  }

  if (
    candidate.semanticSafety === 'PASS' &&
    candidate.budgetStatus === 'PASS_TIER2_CANDIDATE' &&
    slotCoverage === 1 &&
    candidate.patternScore >= threshold.tier2PatternScoreMin &&
    slotConfidence >= threshold.tier2SlotConfidenceMin &&
    finalConfidence >= threshold.tier2FinalConfidenceMin &&
    patternMargin >= threshold.tier2PatternMarginMin
  ) {
    return 'TIER_2_SHADOW_CANDIDATE';
  }

  if (
    candidate.patternScore >= threshold.tier3PatternScoreMin &&
    patternMargin >= threshold.tier3PatternMarginMin &&
    candidate.semanticSafety !== 'FAIL' &&
    candidate.budgetStatus !== 'FAIL'
  ) {
    return 'TIER_3_REFERENCE_CANDIDATE';
  }

  return 'REJECT';
};

export const twoProRunSlotSimilarityShadowV1 = async (
  request:TwoProSlotSimilarityShadowRequestV1
): Promise<void> => {
  if (!twoProIsSlotSimilarityShadowEnabledV1()) return;

  const direction = request.direction;
  const inputText = String(request.inputText || '').trim();
  if (!inputText) return;

  try {
    const candidates = twoProRulesForDirectionV1(direction)
      .map((rule) => twoProScoreCandidateV1(direction, rule, inputText))
      .filter(
        (item): item is TwoProShadowCandidateV1 => Boolean(item)
      )
      .sort((a,b) => {
        if (b.patternScore !== a.patternScore) {
          return b.patternScore - a.patternScore;
        }
        return b.rule.specificity - a.rule.specificity;
      })
      .slice(0,5);

    if (!candidates.length) {
      console.log('[TwoPro Slot Similarity Shadow v1]', {
        direction,
        input:inputText,
        status:'NO_CANDIDATE',
        shadowOnly:true,
        userVisibleEffect:false,
      });
      return;
    }

    const best = candidates[0];
    const secondPatternScore = candidates[1]?.patternScore ?? null;
    const patternMargin = secondPatternScore === null
      ? 1
      : Number(
          Math.max(0, best.patternScore - secondPatternScore).toFixed(4)
        );

    const slotResult = await twoProResolveSlotConfidenceV1(
      best,
      request.resolveSlotConfidence
    );

    const finalConfidence = Number(
      Math.min(best.patternScore, slotResult.slotConfidence).toFixed(4)
    );

    const suggestedTier = twoProSuggestTierV1(
      direction,
      best,
      secondPatternScore,
      slotResult.slotCoverage,
      slotResult.slotConfidence,
      finalConfidence
    );

    console.log('[TwoPro Slot Similarity Shadow v1]', {
      direction,
      input:inputText,
      shadowOnly:true,
      userVisibleEffect:false,

      bestCandidate:{
        sourcePattern:best.rule.sourcePattern,
        targetTemplate:best.rule.targetTemplate,
        patternScore:best.patternScore,
        patternMargin,
        exactStructuralMatch:best.exactStructuralMatch,
        lowRiskStructuralMatch:best.lowRiskStructuralMatch,
        lowRiskChanges:best.lowRiskChanges,
        semanticSafety:best.semanticSafety,
        semanticVetoes:best.semanticVetoes,
        budgetStatus:best.budgetStatus,
        reasonCodes:best.reasonCodes,
        components:best.components,
      },

      slotMetrics:{
        slotCoverage:slotResult.slotCoverage,
        slotConfidence:slotResult.slotConfidence,
        slotConfidenceMean:slotResult.slotConfidenceMean,
        finalConfidence,
        weakestSlot:slotResult.weakestSlot,
        slots:slotResult.slotDiagnostics,
      },

      suggestedTier,

      topCandidates:candidates.map((candidate) => ({
        sourcePattern:candidate.rule.sourcePattern,
        patternScore:candidate.patternScore,
        semanticSafety:candidate.semanticSafety,
        budgetStatus:candidate.budgetStatus,
      })),

      thresholds:TWO_PRO_STAGE6_THRESHOLDS_V1[direction],
    });
  } catch (error) {
    console.warn(
      '[TwoPro Slot Similarity Shadow v1 오류 - 번역 결과에는 영향 없음]',
      {
        direction,
        input:inputText,
        error:error instanceof Error ? error.message : String(error),
      }
    );
  }
};


// ============================================================================
// ☆ TwoPro Slot Similarity v1 — Stage 8B Tier 2 Limited Promotion
//
// 최초 production 승격 범위는 의도적으로 매우 작습니다.
// - EN->KO: request 문형의 please 추가/삭제만
// - KO->EN: polite request 문형의 좀 추가/삭제만
// - nominal/time/place 계열의 안전 슬롯만
// - Stage 6 pattern / slotConfidence / finalConfidence / margin 전부 통과
// - semanticSafety PASS + Difference Budget PASS_TIER2_CANDIDATE
// - exact structural match는 기존 Tier 0/1에 맡김
// - best candidate가 실패하면 2위 후보로 갈아타지 않음
//
// emergency off:
// TWO_PRO_SLOT_SIMILARITY_TIER2=0
// ============================================================================

export type TwoProSlotSimilarityTier2ResolvedSlotV1 = {
  slotId: string;
  occurrence: number;
  sourceValue: string;
  selectedValue: string;
  confidence: number;
  origin: string | null;
  candidateCount: number;
};

export type TwoProSlotSimilarityTier2TranslationV1 = {
  direction: TwoProSlotSimilarityDirectionV1;
  sourcePattern: string;
  targetTemplate: string;
  patternScore: number;
  patternMargin: number;
  slotCoverage: 1;
  slotConfidence: number;
  slotConfidenceMean: number;
  finalConfidence: number;
  semanticSafety: 'PASS';
  budgetStatus: 'PASS_TIER2_CANDIDATE';
  lowRiskChanges: string[];
  reasonCodes: string[];
  resolvedSlots: TwoProSlotSimilarityTier2ResolvedSlotV1[];
  tier: 2;
  engine: 'slot-similarity-tier2-safe-v1';
};

const TWO_PRO_TIER2_SAFE_SLOT_BASES_V1 = new Set([
  'N',
  'V',
  'O',
  'OBJECT',
  'IO',
  'PERSON',
  'PLACE',
  'HOSPITAL',
  'TIME',
  'DURATION',
  'DAY',
  'YEAR',
  'DATE',
  'NUM',
  'MONEY',
  'PRICE',
  'LANG',
  'DOCUMENT',
  'TRANSPORT',
  'MEDICINE',
  'ITEM',
  'JOB',
  'CLOTHING',
  'TASTE',
  'SIZE',
  'DEPT',
]);

const twoProTier2SlotBaseV1 = (
  slotId: string
): string =>
  String(slotId || '')
    .toUpperCase()
    .replace(/\d+$/g, '');

export const twoProIsSlotSimilarityTier2EnabledV1 =
  (): boolean => {
    const raw = String(
      process.env
        .TWO_PRO_SLOT_SIMILARITY_TIER2 ||
        ''
    ).trim().toLowerCase();

    if (
      ['0', 'false', 'off', 'no'].includes(raw)
    ) {
      return false;
    }

    return true;
  };

const twoProTier2LowRiskWhitelistPassV1 = (
  direction: TwoProSlotSimilarityDirectionV1,
  changes: string[]
): boolean => {
  const unique = [...new Set(changes)];

  if (unique.length !== 1) {
    return false;
  }

  return direction === 'EN_KO'
    ? unique[0] === 'please'
    : unique[0] === '좀';
};

const twoProTier2SlotsAreSafeV1 = (
  slots: TwoProSlotSimilarityShadowSlotV1[]
): boolean =>
  slots.every((slot) =>
    TWO_PRO_TIER2_SAFE_SLOT_BASES_V1.has(
      twoProTier2SlotBaseV1(slot.slotId)
    )
  );

export const twoProFindSlotSimilarityTier2TranslationV1 =
  async (
    request: TwoProSlotSimilarityShadowRequestV1
  ): Promise<
    TwoProSlotSimilarityTier2TranslationV1 | null
  > => {
    if (
      !twoProIsSlotSimilarityTier2EnabledV1() ||
      !request.resolveSlotConfidence
    ) {
      return null;
    }

    const direction = request.direction;
    const inputText = String(
      request.inputText || ''
    ).trim();

    if (!inputText) {
      return null;
    }

    const candidates =
      twoProRulesForDirectionV1(direction)
        .map((rule) =>
          twoProScoreCandidateV1(
            direction,
            rule,
            inputText
          )
        )
        .filter(
          (
            item
          ): item is TwoProShadowCandidateV1 =>
            Boolean(item)
        )
        .sort((a, b) => {
          if (
            b.patternScore !== a.patternScore
          ) {
            return (
              b.patternScore -
              a.patternScore
            );
          }

          return (
            b.rule.specificity -
            a.rule.specificity
          );
        })
        .slice(0, 5);

    if (!candidates.length) {
      return null;
    }

    const best = candidates[0];
    const secondPatternScore =
      candidates[1]?.patternScore ?? null;

    const patternMargin =
      secondPatternScore === null
        ? 1
        : Number(
            Math.max(
              0,
              best.patternScore -
                secondPatternScore
            ).toFixed(4)
          );

    const threshold =
      TWO_PRO_STAGE6_THRESHOLDS_V1[
        direction
      ];

    // 후보의 pattern과 실제 입력 사이에서 low-risk token의
    // 존재 여부가 달라졌을 때만 Tier 2 차이로 인정합니다.
    // Stage 7 shadow의 lowRiskChanges는 진단용 union이므로
    // exact pattern에 원래 please/좀 이 있는 경우까지 포함할 수 있습니다.
    // Tier 2 production 판정에서는 symmetric difference를 사용합니다.
    const inputLowRiskInfo =
      twoProLowRiskNormalizeV1(
        direction,
        inputText
      );

    const patternLowRiskInfo =
      twoProLowRiskNormalizeV1(
        direction,
        best.rule.normalizedPattern
      );

    const inputLowRiskSet =
      new Set(inputLowRiskInfo.removed);
    const patternLowRiskSet =
      new Set(patternLowRiskInfo.removed);

    const actualLowRiskChanges =
      [...new Set([
        ...[...inputLowRiskSet].filter(
          (item) =>
            !patternLowRiskSet.has(item)
        ),
        ...[...patternLowRiskSet].filter(
          (item) =>
            !inputLowRiskSet.has(item)
        ),
      ])];

    if (
      !best.lowRiskStructuralMatch ||
      best.semanticSafety !== 'PASS' ||
      best.budgetStatus !==
        'PASS_TIER2_CANDIDATE'
    ) {
      return null;
    }

    if (
      !twoProTier2LowRiskWhitelistPassV1(
        direction,
        actualLowRiskChanges
      )
    ) {
      return null;
    }

    // exactRegex의 슬롯 (.+?)가 '좀' 같은 저위험 토큰을
    // 슬롯 내부로 삼키는 경우가 있으므로 Tier2에서는 항상
    // low-risk-normalized regex로 슬롯을 다시 capture합니다.
    const tier2CapturedSlots =
      twoProExtractCapturedSlotsV1(
        best.rule,
        inputText,
        true
      );

    if (
      tier2CapturedSlots.length !==
        best.rule.slots.length ||
      !twoProTier2SlotsAreSafeV1(
        tier2CapturedSlots
      )
    ) {
      return null;
    }

    if (
      best.patternScore <
        threshold.tier2PatternScoreMin ||
      patternMargin <
        threshold.tier2PatternMarginMin
    ) {
      return null;
    }

    const resolvedSlots:
      TwoProSlotSimilarityTier2ResolvedSlotV1[] =
      [];

    for (const slot of tier2CapturedSlots) {
      let resolved:
        TwoProSlotSimilarityResolvedSlotV1;

      try {
        resolved =
          await request.resolveSlotConfidence(
            slot
          );
      } catch {
        return null;
      }

      const selectedValue = String(
        resolved?.selected || ''
      ).trim();

      const confidence =
        twoProClamp01V1(
          Number(
            resolved?.confidence || 0
          )
        );

      if (
        !resolved?.resolved ||
        !selectedValue
      ) {
        return null;
      }

      resolvedSlots.push({
        slotId: slot.slotId,
        occurrence: slot.occurrence,
        sourceValue: slot.value,
        selectedValue,
        confidence,
        origin: resolved?.origin
          ? String(resolved.origin)
          : null,
        candidateCount:
          Number(
            resolved?.candidateCount || 0
          ),
      });
    }

    const slotCoverage = 1 as const;

    const slotConfidence =
      resolvedSlots.length
        ? Number(
            Math.min(
              ...resolvedSlots.map(
                (slot) =>
                  slot.confidence
              )
            ).toFixed(4)
          )
        : 1;

    const slotConfidenceMean =
      resolvedSlots.length
        ? Number(
            (
              resolvedSlots.reduce(
                (sum, slot) =>
                  sum + slot.confidence,
                0
              ) /
              resolvedSlots.length
            ).toFixed(4)
          )
        : 1;

    const finalConfidence = Number(
      Math.min(
        best.patternScore,
        slotConfidence
      ).toFixed(4)
    );

    if (
      slotConfidence <
        threshold.tier2SlotConfidenceMin ||
      finalConfidence <
        threshold.tier2FinalConfidenceMin
    ) {
      return null;
    }

    return {
      direction,
      sourcePattern:
        best.rule.sourcePattern,
      targetTemplate:
        best.rule.targetTemplate,
      patternScore:
        best.patternScore,
      patternMargin,
      slotCoverage,
      slotConfidence,
      slotConfidenceMean,
      finalConfidence,
      semanticSafety: 'PASS',
      budgetStatus:
        'PASS_TIER2_CANDIDATE',
      lowRiskChanges:
        [...actualLowRiskChanges],
      reasonCodes:
        [...best.reasonCodes],
      resolvedSlots,
      tier: 2,
      engine:
        'slot-similarity-tier2-safe-v1',
    };
  };

export const TWO_PRO_SLOT_SIMILARITY_TIER2_STATS_V1 = {
  stage: 8,
  mode: 'TIER2_LIMITED_PROMOTION',
  engine:
    'slot-similarity-tier2-safe-v1',
  lowRiskOnly: ['please', '좀'],
  exactStructuralOverride: false,
  secondBestFallback: false,
  userVisible: true,
} as const;


// ============================================================================
// ☆ TwoPro Slot Similarity v1 — Stage 8A Tier 3 Reference
//
// 사용자 문장을 새로 번역하지 않습니다.
// 저장된 슬롯 규칙(sourcePattern)과 저장된 번역 템플릿(targetTemplate)만
// "유사 문형 참고"로 반환합니다.
//
// 안전 조건:
// - exact structural match는 Tier 3로 표시하지 않음
// - semanticSafety FAIL 금지
// - Difference Budget FAIL 금지
// - Stage 6 Tier 3 patternScore / patternMargin 기준 통과
// - best candidate만 사용하며 unsafe best를 건너뛰어 2위 후보를 억지 선택하지 않음
//
// emergency off:
// TWO_PRO_SLOT_SIMILARITY_TIER3_REFERENCE=0
// ============================================================================

export type TwoProSlotSimilarityTier3ReferenceV1 = {
  direction: TwoProSlotSimilarityDirectionV1;
  sourcePattern: string;
  targetTemplate: string;
  patternScore: number;
  patternMargin: number;
  semanticSafety: 'PASS' | 'REVIEW';
  budgetStatus:
    | 'PASS_TIER1'
    | 'PASS_TIER2_CANDIDATE'
    | 'REVIEW';
  reasonCodes: string[];
  lowRiskChanges: string[];
  referenceOnly: true;
  generatedUserTranslation: false;
  engine: 'slot-similarity-tier3-reference-v1';
};

export const twoProIsSlotSimilarityTier3ReferenceEnabledV1 =
  (): boolean => {
    const raw = String(
      process.env
        .TWO_PRO_SLOT_SIMILARITY_TIER3_REFERENCE ||
        ''
    ).trim().toLowerCase();

    if (
      ['0', 'false', 'off', 'no'].includes(raw)
    ) {
      return false;
    }

    return true;
  };

export const twoProFindSlotSimilarityTier3ReferenceV1 = (
  request: {
    direction: TwoProSlotSimilarityDirectionV1;
    inputText: string;
  }
): TwoProSlotSimilarityTier3ReferenceV1 | null => {
  if (
    !twoProIsSlotSimilarityTier3ReferenceEnabledV1()
  ) {
    return null;
  }

  const direction = request.direction;
  const inputText = String(
    request.inputText || ''
  ).trim();

  if (!inputText) {
    return null;
  }

  const candidates =
    twoProRulesForDirectionV1(direction)
      .map((rule) =>
        twoProScoreCandidateV1(
          direction,
          rule,
          inputText
        )
      )
      .filter(
        (
          item
        ): item is TwoProShadowCandidateV1 =>
          Boolean(item)
      )
      .sort((a, b) => {
        if (
          b.patternScore !== a.patternScore
        ) {
          return (
            b.patternScore -
            a.patternScore
          );
        }

        return (
          b.rule.specificity -
          a.rule.specificity
        );
      })
      .slice(0, 5);

  if (!candidates.length) {
    return null;
  }

  const best = candidates[0];
  const secondPatternScore =
    candidates[1]?.patternScore ?? null;

  const patternMargin =
    secondPatternScore === null
      ? 1
      : Number(
          Math.max(
            0,
            best.patternScore -
              secondPatternScore
          ).toFixed(4)
        );

  const threshold =
    TWO_PRO_STAGE6_THRESHOLDS_V1[
      direction
    ];

  // Exact slot은 기존 Tier 0/1 엔진의 책임입니다.
  // "유사 문형 참고"로 중복 표시하지 않습니다.
  if (best.exactStructuralMatch) {
    return null;
  }

  // 가장 가까운 후보가 위험하다면
  // 더 낮은 순위의 안전 후보로 갈아타지 않습니다.
  if (
    best.semanticSafety === 'FAIL' ||
    best.budgetStatus === 'FAIL'
  ) {
    return null;
  }

  if (
    best.patternScore <
      threshold.tier3PatternScoreMin ||
    patternMargin <
      threshold.tier3PatternMarginMin
  ) {
    return null;
  }

  return {
    direction,
    sourcePattern:
      best.rule.sourcePattern,
    targetTemplate:
      best.rule.targetTemplate,
    patternScore:
      best.patternScore,
    patternMargin,
    semanticSafety:
      best.semanticSafety,
    budgetStatus:
      best.budgetStatus,
    reasonCodes:
      [...best.reasonCodes],
    lowRiskChanges:
      [...best.lowRiskChanges],
    referenceOnly: true,
    generatedUserTranslation: false,
    engine:
      'slot-similarity-tier3-reference-v1',
  };
};

export const TWO_PRO_SLOT_SIMILARITY_TIER3_STATS_V1 = {
  stage: 8,
  mode: 'TIER3_REFERENCE_ONLY',
  generatedUserTranslation: false,
  koEnRuleCount:
    TWO_PRO_KO_EN_RULES_V1.length,
  enKoRuleCount:
    TWO_PRO_EN_KO_RULES_V1.length,
  totalRuleCount:
    TWO_PRO_KO_EN_RULES_V1.length +
    TWO_PRO_EN_KO_RULES_V1.length,
} as const;


export const TWO_PRO_SLOT_SIMILARITY_SHADOW_STATS_V1 = {
  koEnRuleCount:TWO_PRO_KO_EN_RULES_V1.length,
  enKoRuleCount:TWO_PRO_EN_KO_RULES_V1.length,
  totalRuleCount:
    TWO_PRO_KO_EN_RULES_V1.length +
    TWO_PRO_EN_KO_RULES_V1.length,
  stage:7,
  mode:'SHADOW_ONLY',
} as const;
