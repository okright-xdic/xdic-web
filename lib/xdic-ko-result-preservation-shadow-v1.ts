/**
 * X-DIC KO244: offline-only comparison of independently obtained row snapshots.
 * Never imported by a live route; never queries Supabase or modifies CORE742.
 * Equal snapshots are NOT proof that different SQL predicates are equivalent.
 */
export interface XdicKoSnapshotV1 {
  readonly rows: readonly { readonly id: string }[];
  /** true only when the *whole* intended result scope is known to be captured. */
  readonly complete: boolean;
  readonly error?: string | null;
}
export type XdicKoShadowComparisonStatusV1 =
  | 'UNVERIFIED' | 'DIFFERENT' | 'SAME_SNAPSHOT';
export interface XdicKoRowPreservationV1 {
  readonly shadowOnly: true;
  readonly liveEnabled: false;
  readonly legacyAndRequired: true;
  readonly safeToReplaceLegacy: false;
  readonly sqlEquivalenceProven: false;
  readonly status: XdicKoShadowComparisonStatusV1;
  readonly legacyCount: number;
  readonly phraseCount: number;
  readonly missingFromPhrase: readonly string[];
  readonly unexpectedPhraseIds: readonly string[];
  readonly orderedIdsIdentical: boolean;
  readonly reason: string;
}

function inspect(snapshot: XdicKoSnapshotV1, name: string): string[] {
  if (!snapshot || !Array.isArray(snapshot.rows) ||
      typeof snapshot.complete !== 'boolean' ||
      (snapshot.error != null && typeof snapshot.error !== 'string')) {
    throw new TypeError(`${name}: invalid snapshot`);
  }
  if (snapshot.rows.length > 1000) throw new RangeError(`${name}: too many rows`);
  const ids: string[] = [];
  const seen = new Set<string>();
  for (const row of snapshot.rows) {
    if (!row || typeof row.id !== 'string' || row.id.trim().length === 0 ||
        row.id.length > 256 || seen.has(row.id)) {
      throw new TypeError(`${name}: empty/duplicate/invalid id`);
    }
    seen.add(row.id);
    ids.push(row.id);
  }
  return ids;
}

export function compareXdicKoRowPreservationShadowV1(
  legacy: XdicKoSnapshotV1,
  phrase: XdicKoSnapshotV1,
): XdicKoRowPreservationV1 {
  const left = inspect(legacy, 'legacy');
  const right = inspect(phrase, 'phrase');
  const lset = new Set(left);
  const rset = new Set(right);
  // Comparison is only meaningful for comparable, complete, error-free snapshots.
  // In particular: SQL timeout + [] is NOT evidence of no matching rows.
  const comparable = legacy.complete && phrase.complete &&
    !legacy.error && !phrase.error;
  const missingFromPhrase = comparable ? left.filter(id => !rset.has(id)) : [];
  const unexpectedPhraseIds = comparable ? right.filter(id => !lset.has(id)) : [];
  const orderedIdsIdentical = comparable && left.length === right.length &&
    left.every((id, i) => id === right[i]);
  const status: XdicKoShadowComparisonStatusV1 = !comparable ? 'UNVERIFIED' :
    (orderedIdsIdentical ? 'SAME_SNAPSHOT' : 'DIFFERENT');
  const reason = !comparable
    ? 'Timed out, errored, or truncated snapshots cannot establish coverage.'
    : status === 'DIFFERENT'
      ? 'Snapshot IDs/count/order differ; do not replace legacy AND.'
      : 'Only these snapshots match; SQL-level equivalence is NOT proven.';
  return {
    shadowOnly: true, liveEnabled: false, legacyAndRequired: true,
    safeToReplaceLegacy: false, sqlEquivalenceProven: false,
    status, legacyCount: left.length, phraseCount: right.length,
    missingFromPhrase, unexpectedPhraseIds, orderedIdsIdentical, reason,
  };
}
