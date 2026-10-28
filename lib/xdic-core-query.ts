/** Independent, purely deterministic lookup logic for published expression pairs.
 * No changes to CORE translation slots or existing dictionary search ranker.
 */
export type XdicLookupDirection = 'ko' | 'en';

const stripEdgePunctuation = (input: string): string =>
  input.replace(/^[\s.,!?;:()[\]{}“”‘’"']+|[\s.,!?;:()[\]{}“”‘’"']+$/gu, '');

export const normalizeXdicExpression = (value: string): string =>
  stripEdgePunctuation(String(value || '').normalize('NFC'))
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

export function buildXdicCoreLookupKeys(
  query: string,
  maxKeys = 96
): { direction: XdicLookupDirection; keys: string[] } {
  const direction: XdicLookupDirection = /[가-힣]/u.test(query) ? 'ko' : 'en';
  const normalized = normalizeXdicExpression(query).slice(0, 200);
  if (normalized.replace(/\s+/g, '').length < 2) {
    return { direction, keys: [] };
  }
  const tokens = normalized.split(' ').filter(Boolean).slice(0, 30);
  const found = new Set<string>();
  // Longer phrases have precedence. A bounded number of indexed keys is sent in one query.
  for (let span = Math.min(8, tokens.length); span >= 1; span--) {
    for (let index = 0; index + span <= tokens.length; index++) {
      const chunk = tokens.slice(index, index + span);
      const phrase = normalizeXdicExpression(chunk.join(' '));
      if (phrase.length >= 2) found.add(phrase);
      if (direction === 'ko') {
        // Conservative terminal-particle normalization. No stemming of verb endings.
        // e.g. 센서 기록들은 -> 센서 기록들, 계약 조건을 -> 계약 조건
        const last = chunk[chunk.length - 1];
        const shorter = last.replace(/(?:은|는|이|가|을|를|도|만)$/u, '');
        if (last !== shorter && shorter.length >= 2) {
          found.add(normalizeXdicExpression([...chunk.slice(0, -1), shorter].join(' ')));
        }
      }
      if (found.size >= maxKeys) return { direction, keys: [...found].slice(0, maxKeys) };
    }
  }
  return { direction, keys: [...found].slice(0, maxKeys) };
}
