// @ts-nocheck
import commonNounRules from './rules-common-nouns.json';

// ============================================================================
// ☆ TwoPro Common Nouns Loader v1.0
//
// - rules-common-nouns.json을 app/api에서 한 번만 로드합니다.
// - 두 번역 route가 동일한 영어 base/plural surface index와
//   SAFE 한국어 대표명사 역색인을 공유합니다.
// - SAFE만 whole-input standalone direct 후보가 됩니다.
// - CONTEXT는 lemma/number/countability 정보만 제공하고 직접 번역값을 강제하지 않습니다.
// - a/an/the는 이 loader가 생성하거나 제거하지 않습니다.
// - 한국어 조사/복수표지 '들'도 JSON에 저장하지 않습니다.
// - cross-lemma English surface 충돌은 direct index에서 자동 제외합니다.
// - same-lemma 동일 단복수(sheep/deer)는 하나의 surface hit로 합칩니다.
// - 다어절 PHRASES 번역은 이 loader가 담당하지 않습니다.
// ============================================================================

export type TwoProCommonNounModeV1 =
  | 'SAFE'
  | 'CONTEXT';

export type TwoProCommonNounCountabilityV1 =
  | 'COUNT'
  | 'MASS'
  | 'BOTH'
  | 'CONTEXT';

export type TwoProCommonNounNumberV1 =
  | 'base'
  | 'plural';

export type TwoProCommonNounRuntimeEntryV1 = {
  lemma: string;
  ko: string | null;
  mode: TwoProCommonNounModeV1;
  countability: TwoProCommonNounCountabilityV1;
  forms: {
    plural: string[];
  };
};

export type TwoProCommonNounSurfaceHitV1 = {
  surface: string;
  entry: TwoProCommonNounRuntimeEntryV1;
  numbers: TwoProCommonNounNumberV1[];
};

const TWO_PRO_COMMON_NOUN_NUMBER_ORDER_V1:
  readonly TwoProCommonNounNumberV1[] = [
    'base',
    'plural',
  ];

export const twoProNormalizeEnglishCommonNounSurfaceV1 = (
  value: unknown
): string =>
  String(value || '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/[.!?。！？]+$/u, '')
    .replace(/\s+/g, ' ')
    .trim();

export const twoProNormalizeKoreanCommonNounSurfaceV1 = (
  value: unknown
): string =>
  String(value || '')
    .normalize('NFC')
    .replace(/[.!?。！？]+$/u, '')
    .replace(/\s+/g, ' ')
    .trim();

const rawCommonNounRulesV1 =
  commonNounRules as any;

export const TWO_PRO_COMMON_NOUN_SCHEMA_OK_V1 =
  rawCommonNounRulesV1?.schemaVersion === '1.0' &&
  rawCommonNounRulesV1?.entries &&
  typeof rawCommonNounRulesV1.entries === 'object' &&
  !Array.isArray(rawCommonNounRulesV1.entries);

const rawNounEntriesV1: Record<string, any> =
  TWO_PRO_COMMON_NOUN_SCHEMA_OK_V1
    ? rawCommonNounRulesV1.entries
    : {};

const twoProIsPossiblyEmptyStringArrayNounV1 = (
  value: unknown
): value is string[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      typeof item === 'string' &&
      Boolean(item.trim())
  );

const twoProParseCommonNounEntryV1 = (
  lemmaKey: string,
  rawEntry: any
): TwoProCommonNounRuntimeEntryV1 | null => {
  const lemma =
    twoProNormalizeEnglishCommonNounSurfaceV1(
      lemmaKey
    );

  if (
    !lemma ||
    !/^[a-z][a-z'-]*$/u.test(lemma) ||
    lemma.includes(' ')
  ) {
    return null;
  }

  const mode =
    String(
      rawEntry?.mode || ''
    ) as TwoProCommonNounModeV1;

  if (
    mode !== 'SAFE' &&
    mode !== 'CONTEXT'
  ) {
    return null;
  }

  const countability =
    String(
      rawEntry?.countability || ''
    ) as TwoProCommonNounCountabilityV1;

  if (
    countability !== 'COUNT' &&
    countability !== 'MASS' &&
    countability !== 'BOTH' &&
    countability !== 'CONTEXT'
  ) {
    return null;
  }

  const ko =
    rawEntry?.ko === null
      ? null
      : twoProNormalizeKoreanCommonNounSurfaceV1(
          rawEntry?.ko
        );

  if (
    mode === 'SAFE' &&
    !ko
  ) {
    return null;
  }

  if (
    mode === 'CONTEXT' &&
    rawEntry?.ko !== null
  ) {
    return null;
  }

  const forms =
    rawEntry?.forms || {};

  if (
    !twoProIsPossiblyEmptyStringArrayNounV1(
      forms.plural
    )
  ) {
    return null;
  }

  const plural =
    forms.plural.map(
      (item: string) =>
        twoProNormalizeEnglishCommonNounSurfaceV1(
          item
        )
    );

  if (
    countability === 'MASS' &&
    plural.length
  ) {
    return null;
  }

  return {
    lemma,
    ko,
    mode,
    countability,
    forms: {
      plural,
    },
  };
};

export const TWO_PRO_COMMON_NOUN_ENTRIES_V1:
  TwoProCommonNounRuntimeEntryV1[] =
  Object.entries(rawNounEntriesV1)
    .map(([lemma, rawEntry]) =>
      twoProParseCommonNounEntryV1(
        lemma,
        rawEntry
      )
    )
    .filter(
      (
        entry
      ): entry is TwoProCommonNounRuntimeEntryV1 =>
        Boolean(entry)
    );

export const TWO_PRO_COMMON_SAFE_NOUN_ENTRIES_V1 =
  TWO_PRO_COMMON_NOUN_ENTRIES_V1.filter(
    (entry) =>
      entry.mode === 'SAFE' &&
      Boolean(entry.ko)
  );

const nounSurfaceBuilderV1 =
  new Map<
    string,
    Map<
      string,
      {
        entry: TwoProCommonNounRuntimeEntryV1;
        numbers: Set<TwoProCommonNounNumberV1>;
      }
    >
  >();

const twoProAddEnglishNounSurfaceV1 = (
  surfaceValue: unknown,
  entry: TwoProCommonNounRuntimeEntryV1,
  number: TwoProCommonNounNumberV1
) => {
  const surface =
    twoProNormalizeEnglishCommonNounSurfaceV1(
      surfaceValue
    );

  if (!surface) {
    return;
  }

  const bucket =
    nounSurfaceBuilderV1.get(surface) ||
    new Map();

  const existing =
    bucket.get(entry.lemma);

  if (existing) {
    existing.numbers.add(number);
  } else {
    bucket.set(entry.lemma, {
      entry,
      numbers: new Set([number]),
    });
  }

  nounSurfaceBuilderV1.set(
    surface,
    bucket
  );
};

for (
  const entry of
  TWO_PRO_COMMON_NOUN_ENTRIES_V1
) {
  twoProAddEnglishNounSurfaceV1(
    entry.lemma,
    entry,
    'base'
  );

  for (
    const surface of
    entry.forms.plural
  ) {
    twoProAddEnglishNounSurfaceV1(
      surface,
      entry,
      'plural'
    );
  }
}

const TWO_PRO_COMMON_NOUN_ENGLISH_INDEX_V1 =
  new Map<
    string,
    TwoProCommonNounSurfaceHitV1
  >();

export const TWO_PRO_COMMON_NOUN_AMBIGUOUS_ENGLISH_SURFACES_V1 =
  new Set<string>();

for (
  const [
    surface,
    lemmaMap,
  ] of nounSurfaceBuilderV1.entries()
) {
  if (lemmaMap.size !== 1) {
    TWO_PRO_COMMON_NOUN_AMBIGUOUS_ENGLISH_SURFACES_V1.add(
      surface
    );
    continue;
  }

  const only =
    Array.from(
      lemmaMap.values()
    )[0];

  const numbers =
    Array.from(
      only.numbers
    ).sort(
      (a, b) =>
        TWO_PRO_COMMON_NOUN_NUMBER_ORDER_V1.indexOf(
          a
        ) -
        TWO_PRO_COMMON_NOUN_NUMBER_ORDER_V1.indexOf(
          b
        )
    );

  TWO_PRO_COMMON_NOUN_ENGLISH_INDEX_V1.set(
    surface,
    {
      surface,
      entry: only.entry,
      numbers,
    }
  );
}

const safeKoreanNounBuilderV1 =
  new Map<
    string,
    TwoProCommonNounRuntimeEntryV1[]
  >();

for (
  const entry of
  TWO_PRO_COMMON_SAFE_NOUN_ENTRIES_V1
) {
  const ko =
    twoProNormalizeKoreanCommonNounSurfaceV1(
      entry.ko
    );

  if (!ko) {
    continue;
  }

  const bucket =
    safeKoreanNounBuilderV1.get(ko) ||
    [];

  bucket.push(entry);
  safeKoreanNounBuilderV1.set(
    ko,
    bucket
  );
}

const TWO_PRO_COMMON_NOUN_KOREAN_SAFE_INDEX_V1 =
  new Map<
    string,
    TwoProCommonNounRuntimeEntryV1
  >();

export const TWO_PRO_COMMON_NOUN_AMBIGUOUS_KOREAN_SURFACES_V1 =
  new Set<string>();

for (
  const [
    ko,
    bucket,
  ] of safeKoreanNounBuilderV1.entries()
) {
  if (bucket.length !== 1) {
    TWO_PRO_COMMON_NOUN_AMBIGUOUS_KOREAN_SURFACES_V1.add(
      ko
    );
    continue;
  }

  TWO_PRO_COMMON_NOUN_KOREAN_SAFE_INDEX_V1.set(
    ko,
    bucket[0]
  );
}

export const twoProLookupEnglishCommonNounV1 = (
  value: unknown
): TwoProCommonNounSurfaceHitV1 | null => {
  const surface =
    twoProNormalizeEnglishCommonNounSurfaceV1(
      value
    );

  if (
    !surface ||
    TWO_PRO_COMMON_NOUN_AMBIGUOUS_ENGLISH_SURFACES_V1.has(
      surface
    )
  ) {
    return null;
  }

  return (
    TWO_PRO_COMMON_NOUN_ENGLISH_INDEX_V1.get(
      surface
    ) || null
  );
};

export const twoProIsBlockedEnglishCommonNounSurfaceV1 = (
  value: unknown
): boolean => {
  const surface =
    twoProNormalizeEnglishCommonNounSurfaceV1(
      value
    );

  return Boolean(
    surface &&
    TWO_PRO_COMMON_NOUN_AMBIGUOUS_ENGLISH_SURFACES_V1.has(
      surface
    )
  );
};

export const twoProLookupKoreanSafeCommonNounV1 = (
  value: unknown
): TwoProCommonNounRuntimeEntryV1 | null => {
  const surface =
    twoProNormalizeKoreanCommonNounSurfaceV1(
      value
    );

  if (
    !surface ||
    TWO_PRO_COMMON_NOUN_AMBIGUOUS_KOREAN_SURFACES_V1.has(
      surface
    )
  ) {
    return null;
  }

  return (
    TWO_PRO_COMMON_NOUN_KOREAN_SAFE_INDEX_V1.get(
      surface
    ) || null
  );
};

export const TWO_PRO_COMMON_NOUN_STATS_V1 = {
  schemaVersion:
    String(
      rawCommonNounRulesV1?.schemaVersion || ''
    ),
  schemaOk:
    TWO_PRO_COMMON_NOUN_SCHEMA_OK_V1,
  sourceEntryCount:
    Object.keys(rawNounEntriesV1).length,
  loadedEntryCount:
    TWO_PRO_COMMON_NOUN_ENTRIES_V1.length,
  safeEntryCount:
    TWO_PRO_COMMON_SAFE_NOUN_ENTRIES_V1.length,
  contextEntryCount:
    TWO_PRO_COMMON_NOUN_ENTRIES_V1.filter(
      (entry) =>
        entry.mode === 'CONTEXT'
    ).length,
  indexedEnglishSurfaceCount:
    TWO_PRO_COMMON_NOUN_ENGLISH_INDEX_V1.size,
  ambiguousEnglishSurfaceCount:
    TWO_PRO_COMMON_NOUN_AMBIGUOUS_ENGLISH_SURFACES_V1.size,
  indexedSafeKoreanCount:
    TWO_PRO_COMMON_NOUN_KOREAN_SAFE_INDEX_V1.size,
  ambiguousSafeKoreanCount:
    TWO_PRO_COMMON_NOUN_AMBIGUOUS_KOREAN_SURFACES_V1.size,
} as const;
