/**
 * KO246 — OFFLINE SHADOW ONLY. Not imported by any live route.
 * These literal Korean substring hints do not emulate full SQL ILIKE semantics
 * and cannot establish relevance, completeness, performance, or SQL equivalence.
 * Never replace existing legacy AND/CORE search based on this module.
 */
export type XdicKo246MatchClass =
  | 'SPACED_EXACT'
  | 'UNSPACED_EXACT'
  | 'NEARBY_VARIANT_CANDIDATE'
  | 'AND_ONLY'
  | 'NO_MATCH';

export interface XdicKo246PhraseObservation {
  readonly shadowOnly: true;
  readonly liveEnabled: false;
  readonly canReplaceLegacy: false;
  readonly matchClass: XdicKo246MatchClass;
  readonly legacyTermPairPresent: boolean;
  readonly exactSpacedPhrasePresent: boolean;
  readonly exactUnspacedPhrasePresent: boolean;
}

function norm(value: string, label: string): string {
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > 10000) {
    throw new TypeError(`${label}: invalid input`);
  }
  return value.normalize('NFC').toLowerCase();
}

/** Suggests observation classes only, not a rewrite of any SQL predicate. */
export function observeXdicKo246PhraseShadowV1(
  lineText: string,
  leftTerm: string,
  rightTerm: string,
): XdicKo246PhraseObservation {
  const text = norm(lineText, 'lineText');
  const left = norm(leftTerm, 'leftTerm').trim();
  const right = norm(rightTerm, 'rightTerm').trim();
  if (!left || !right || /\s/.test(left) || /\s/.test(right)) {
    throw new TypeError('Terms must each contain one nonspace token');
  }
  const exactSpacedPhrasePresent = text.includes(left + ' ' + right);
  const exactUnspacedPhrasePresent = text.includes(left + right);
  const legacyTermPairPresent = text.includes(left) && text.includes(right);
  let matchClass: XdicKo246MatchClass = 'NO_MATCH';
  if (exactSpacedPhrasePresent) {
    matchClass = 'SPACED_EXACT';
  } else if (exactUnspacedPhrasePresent) {
    matchClass = 'UNSPACED_EXACT';
  } else if (legacyTermPairPresent) {
    // A short intervening sequence may be a particle, suffix, space, or unrelated text.
    // A candidate never becomes a verified grammatical/SQL equivalence.
    let nearby = false;
    let at = text.indexOf(left);
    while (at >= 0) {
      const after = at + left.length;
      const rightAt = text.indexOf(right, after);
      if (rightAt >= 0 && rightAt - after <= 4) {
        nearby = true;
        break;
      }
      at = text.indexOf(left, at + 1);
    }
    matchClass = nearby ? 'NEARBY_VARIANT_CANDIDATE' : 'AND_ONLY';
  }
  return {
    shadowOnly: true,
    liveEnabled: false,
    canReplaceLegacy: false,
    matchClass,
    legacyTermPairPresent,
    exactSpacedPhrasePresent,
    exactUnspacedPhrasePresent,
  };
}

export interface XdicKo246Row {
  readonly id: string;
  readonly category_id: number;
  readonly source_order: number;
  readonly line_text: string;
}
export interface XdicKo246Snapshot {
  readonly rows: readonly XdicKo246Row[];
  /** Must be false for every LIMIT-capped sample, partial capture, or timeout. */
  readonly complete: boolean;
  readonly error?: string | null;
}
export interface XdicKo246ResultObservation {
  readonly shadowOnly: true;
  readonly liveEnabled: false;
  readonly canReplaceLegacy: false;
  readonly sqlEquivalenceProven: false;
  readonly status: 'SAME_SNAPSHOT' | 'DIFFERENT' | 'UNVERIFIED';
  readonly observedLegacyRows: number;
  readonly observedExpandedRows: number;
  readonly missingIds: readonly string[];
  readonly unexpectedIds: readonly string[];
  readonly orderedIdsIdentical: boolean;
  readonly metadataIdentical: boolean;
  readonly reason: string;
}

function inspect(snapshot: XdicKo246Snapshot, name: string): XdicKo246Row[] {
  if (!snapshot || !Array.isArray(snapshot.rows) ||
      typeof snapshot.complete !== 'boolean' ||
      (snapshot.error != null && typeof snapshot.error !== 'string') ||
      snapshot.rows.length > 1000) {
    throw new TypeError(`${name}: invalid snapshot`);
  }
  const ids = new Set<string>();
  for (const row of snapshot.rows) {
    if (!row || typeof row.id !== 'string' || row.id.trim().length === 0 || row.id.length > 256 ||
        !Number.isSafeInteger(row.category_id) || row.category_id < 0 ||
        !Number.isSafeInteger(row.source_order) || row.source_order < 0 ||
        typeof row.line_text !== 'string' || row.line_text.length > 100000 || ids.has(row.id)) {
      throw new TypeError(`${name}: invalid or duplicate row`);
    }
    ids.add(row.id);
  }
  return snapshot.rows.slice();
}

/** Compare independently captured snapshots only; cannot prove SQL-level equivalence. */
export function compareXdicKo246ResultShadowV1(
  legacy: XdicKo246Snapshot,
  expanded: XdicKo246Snapshot,
): XdicKo246ResultObservation {
  const a = inspect(legacy, 'legacy');
  const b = inspect(expanded, 'expanded');
  const comparable = legacy.complete && expanded.complete && !legacy.error && !expanded.error;
  const bs = new Set(b.map(r => r.id));
  const as = new Set(a.map(r => r.id));
  const missingIds = comparable ? a.filter(r => !bs.has(r.id)).map(r => r.id) : [];
  const unexpectedIds = comparable ? b.filter(r => !as.has(r.id)).map(r => r.id) : [];
  const orderedIdsIdentical = comparable && a.length === b.length &&
    a.every((row, i) => row.id === b[i].id);
  const metadataIdentical = comparable && orderedIdsIdentical &&
    a.every((row, i) =>
      row.category_id === b[i].category_id &&
      row.source_order === b[i].source_order &&
      row.line_text === b[i].line_text);
  const status = !comparable ? 'UNVERIFIED' :
    (orderedIdsIdentical && metadataIdentical ? 'SAME_SNAPSHOT' : 'DIFFERENT');
  return {
    shadowOnly: true,
    liveEnabled: false,
    canReplaceLegacy: false,
    sqlEquivalenceProven: false,
    status,
    observedLegacyRows: a.length,
    observedExpandedRows: b.length,
    missingIds,
    unexpectedIds,
    orderedIdsIdentical,
    metadataIdentical,
    reason: status === 'UNVERIFIED'
      ? 'LIMIT sample, timeout, error, or incomplete capture; no equivalence conclusion.'
      : status === 'DIFFERENT'
        ? 'Observed snapshot ID, metadata, or order differs; preserve legacy behavior.'
        : 'Only the supplied complete snapshots agree; SQL equivalence is NOT proven.',
  };
}
