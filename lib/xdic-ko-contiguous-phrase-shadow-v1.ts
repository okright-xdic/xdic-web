/**
 * X-DIC 3-243: offline-only contiguous phrase candidate shadow.
 * NEVER imported into live application, query executor, or CORE742.
 * Evidence of substring adjacency is NOT evidence of result-set equivalence.
 */
export interface XdicPhrasePairV1 {
  readonly left: string;
  readonly right: string;
}

export interface XdicContiguousCandidateV1 {
  readonly phrase: string;
  readonly left: string;
  readonly right: string;
  readonly offset: number;
  readonly matchKind: 'EXACT_ADJACENT' | 'RIGHT_PARTICLE_SUFFIX';
  readonly legacyAndRequired: true;
  readonly equivalentToAnd: false;
}

export interface XdicContiguousShadowV1 {
  readonly shadowOnly: true;
  readonly liveEnabled: false;
  readonly original: string;
  readonly normalized: string;
  readonly candidates: readonly XdicContiguousCandidateV1[];
  readonly ignoredPairs: readonly XdicPhrasePairV1[];
  readonly legacyQueriesChanged: false;
  readonly equivalentResultsProven: false;
}

// A suffix in the input is only an observation; it does not justify
// modifying the old SQL or treating a prefix match as a full word match.
const RIGHT_PARTICLE_SUFFIXES = [
  '에서는', '에게서', '으로는', '까지는', '부터는',
  '에서', '에게', '으로', '부터', '까지', '처럼', '보다',
  '에는', '으로', '과는', '와는',
  '은', '는', '이', '가', '을', '를', '에', '도', '만', '과', '와', '로',
];
const SUFFIX_GROUP = RIGHT_PARTICLE_SUFFIXES.join('|');
const VALID_TOKEN = /^[가-힣]{2,24}$/u;

export function buildXdicKoContiguousPhraseShadowV1(
  original: string,
  normalized: string,
  existingPairs: readonly XdicPhrasePairV1[],
): XdicContiguousShadowV1 {
  if (typeof original !== 'string' || typeof normalized !== 'string' ||
      !Array.isArray(existingPairs)) {
    throw new TypeError('Missing original, normalized, or existingPairs');
  }
  if (existingPairs.length > 64 || normalized.length > 10000) {
    throw new RangeError('Shadow-only input limit exceeded');
  }
  const candidates: XdicContiguousCandidateV1[] = [];
  const ignoredPairs: XdicPhrasePairV1[] = [];
  const seen = new Set<string>();
  // At most eight proposals. Retain original pair order. No candidate changes
  // the existing AND queries, CORE logic or result ordering.
  for (const pair of existingPairs) {
    const left = pair?.left;
    const right = pair?.right;
    if (typeof left !== 'string' || typeof right !== 'string' ||
        !VALID_TOKEN.test(left) || !VALID_TOKEN.test(right)) {
      ignoredPairs.push({left: String(left ?? ''), right: String(right ?? '')});
      continue;
    }
    const phrase = `${left} ${right}`;
    if (seen.has(phrase)) continue;
    seen.add(phrase);
    // Literal adjacency, with one space, and constrained word boundaries.
    // Do not infer morphological equivalence, reorder words, or invent phrase text.
    const matcher = new RegExp(
      `(^|\\s)(${left} ${right})(?=($|\\s|[.!?,]|(?:${SUFFIX_GROUP})(?=$|\\s|[.!?,])))`,
      'u',
    );
    const hit = matcher.exec(normalized);
    if (!hit) {
      ignoredPairs.push({left, right});
      continue;
    }
    const offset = hit.index + hit[1].length;
    const nextText = normalized.slice(offset + phrase.length);
    const matchKind: XdicContiguousCandidateV1['matchKind'] =
      nextText.length > 0 && /^[가-힣]/u.test(nextText)
        ? 'RIGHT_PARTICLE_SUFFIX' : 'EXACT_ADJACENT';
    if (candidates.length < 8) {
      candidates.push({
        phrase, left, right, offset, matchKind,
        legacyAndRequired: true,
        equivalentToAnd: false,
      });
    }
  }
  return {
    shadowOnly: true,
    liveEnabled: false,
    original,
    normalized,
    candidates,
    ignoredPairs,
    legacyQueriesChanged: false,
    equivalentResultsProven: false,
  };
}
