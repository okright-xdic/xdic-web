// @ts-nocheck
import commonAdverbRules from './rules-common-adverbs.json';

// ============================================================================
// ☆ TwoPro Common Adverbs Loader v1.0
//
// - rules-common-adverbs.json을 app/api에서 한 번만 로드합니다.
// - 두 번역 route가 동일한 영어 base/comparative/superlative surface index와
//   SAFE 한국어 대표부사 역색인을 공유합니다.
// - SAFE만 whole-input standalone direct 후보가 됩니다.
// - CONTEXT는 영어 lemma/degree 분석 정보만 제공하고 직접 번역값을 강제하지 않습니다.
// - cross-lemma English surface 충돌은 direct index에서 자동 제외합니다.
// - 일반 다어절 부사구 PHRASES는 이 loader가 담당하지 않습니다.
// - more quickly / most quickly 같은 degree surface만 forms로 허용합니다.
// - 한국어 부사는 활용형을 생성하지 않고 대표형 exact와 더/가장 degree만 route가 처리합니다.
// ============================================================================

export type TwoProCommonAdverbModeV1 =
  | 'SAFE'
  | 'CONTEXT';

export type TwoProCommonAdverbDegreeV1 =
  | 'base'
  | 'comparative'
  | 'superlative';

export type TwoProCommonAdverbRuntimeEntryV1 = {
  lemma: string;
  ko: string | null;
  mode: TwoProCommonAdverbModeV1;
  forms: {
    comparative: string[];
    superlative: string[];
  };
};

export type TwoProCommonAdverbSurfaceHitV1 = {
  surface: string;
  entry: TwoProCommonAdverbRuntimeEntryV1;
  degrees: TwoProCommonAdverbDegreeV1[];
};

const TWO_PRO_COMMON_ADVERB_DEGREE_ORDER_V1:
  readonly TwoProCommonAdverbDegreeV1[] = [
    'base',
    'comparative',
    'superlative',
  ];

export const twoProNormalizeEnglishCommonAdverbSurfaceV1 = (
  value: unknown
): string =>
  String(value || '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/[.!?。！？]+$/u, '')
    .replace(/\s+/g, ' ')
    .trim();

export const twoProNormalizeKoreanCommonAdverbSurfaceV1 = (
  value: unknown
): string =>
  String(value || '')
    .normalize('NFC')
    .replace(/[.!?。！？]+$/u, '')
    .replace(/\s+/g, ' ')
    .trim();

const rawCommonAdverbRulesV1 =
  commonAdverbRules as any;

export const TWO_PRO_COMMON_ADVERB_SCHEMA_OK_V1 =
  rawCommonAdverbRulesV1?.schemaVersion === '1.0' &&
  rawCommonAdverbRulesV1?.entries &&
  typeof rawCommonAdverbRulesV1.entries === 'object' &&
  !Array.isArray(rawCommonAdverbRulesV1.entries);

const rawAdverbEntriesV1: Record<string, any> =
  TWO_PRO_COMMON_ADVERB_SCHEMA_OK_V1
    ? rawCommonAdverbRulesV1.entries
    : {};

const twoProIsPossiblyEmptyStringArrayAdverbV1 = (
  value: unknown
): value is string[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      typeof item === 'string' &&
      Boolean(item.trim())
  );

const twoProParseCommonAdverbEntryV1 = (
  lemmaKey: string,
  rawEntry: any
): TwoProCommonAdverbRuntimeEntryV1 | null => {
  const lemma =
    twoProNormalizeEnglishCommonAdverbSurfaceV1(
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
    ) as TwoProCommonAdverbModeV1;

  if (
    mode !== 'SAFE' &&
    mode !== 'CONTEXT'
  ) {
    return null;
  }

  const ko =
    rawEntry?.ko === null
      ? null
      : twoProNormalizeKoreanCommonAdverbSurfaceV1(
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
    !twoProIsPossiblyEmptyStringArrayAdverbV1(
      forms.comparative
    ) ||
    !twoProIsPossiblyEmptyStringArrayAdverbV1(
      forms.superlative
    )
  ) {
    return null;
  }

  return {
    lemma,
    ko,
    mode,
    forms: {
      comparative:
        forms.comparative.map(
          (item: string) =>
            twoProNormalizeEnglishCommonAdverbSurfaceV1(
              item
            )
        ),
      superlative:
        forms.superlative.map(
          (item: string) =>
            twoProNormalizeEnglishCommonAdverbSurfaceV1(
              item
            )
        ),
    },
  };
};

export const TWO_PRO_COMMON_ADVERB_ENTRIES_V1:
  TwoProCommonAdverbRuntimeEntryV1[] =
  Object.entries(rawAdverbEntriesV1)
    .map(([lemma, rawEntry]) =>
      twoProParseCommonAdverbEntryV1(
        lemma,
        rawEntry
      )
    )
    .filter(
      (
        entry
      ): entry is TwoProCommonAdverbRuntimeEntryV1 =>
        Boolean(entry)
    );

export const TWO_PRO_COMMON_SAFE_ADVERB_ENTRIES_V1 =
  TWO_PRO_COMMON_ADVERB_ENTRIES_V1.filter(
    (entry) =>
      entry.mode === 'SAFE' &&
      Boolean(entry.ko)
  );

const adverbSurfaceBuilderV1 =
  new Map<
    string,
    Map<
      string,
      {
        entry: TwoProCommonAdverbRuntimeEntryV1;
        degrees: Set<TwoProCommonAdverbDegreeV1>;
      }
    >
  >();

const twoProAddEnglishAdverbSurfaceV1 = (
  surfaceValue: unknown,
  entry: TwoProCommonAdverbRuntimeEntryV1,
  degree: TwoProCommonAdverbDegreeV1
) => {
  const surface =
    twoProNormalizeEnglishCommonAdverbSurfaceV1(
      surfaceValue
    );

  if (!surface) {
    return;
  }

  const bucket =
    adverbSurfaceBuilderV1.get(surface) ||
    new Map();

  const existing =
    bucket.get(entry.lemma);

  if (existing) {
    existing.degrees.add(degree);
  } else {
    bucket.set(entry.lemma, {
      entry,
      degrees: new Set([degree]),
    });
  }

  adverbSurfaceBuilderV1.set(
    surface,
    bucket
  );
};

for (
  const entry of
  TWO_PRO_COMMON_ADVERB_ENTRIES_V1
) {
  twoProAddEnglishAdverbSurfaceV1(
    entry.lemma,
    entry,
    'base'
  );

  for (
    const surface of
    entry.forms.comparative
  ) {
    twoProAddEnglishAdverbSurfaceV1(
      surface,
      entry,
      'comparative'
    );
  }

  for (
    const surface of
    entry.forms.superlative
  ) {
    twoProAddEnglishAdverbSurfaceV1(
      surface,
      entry,
      'superlative'
    );
  }
}

const TWO_PRO_COMMON_ADVERB_ENGLISH_INDEX_V1 =
  new Map<
    string,
    TwoProCommonAdverbSurfaceHitV1
  >();

export const TWO_PRO_COMMON_ADVERB_AMBIGUOUS_ENGLISH_SURFACES_V1 =
  new Set<string>();

for (
  const [
    surface,
    lemmaMap,
  ] of adverbSurfaceBuilderV1.entries()
) {
  if (lemmaMap.size !== 1) {
    TWO_PRO_COMMON_ADVERB_AMBIGUOUS_ENGLISH_SURFACES_V1.add(
      surface
    );
    continue;
  }

  const only =
    Array.from(
      lemmaMap.values()
    )[0];

  const degrees =
    Array.from(
      only.degrees
    ).sort(
      (a, b) =>
        TWO_PRO_COMMON_ADVERB_DEGREE_ORDER_V1.indexOf(
          a
        ) -
        TWO_PRO_COMMON_ADVERB_DEGREE_ORDER_V1.indexOf(
          b
        )
    );

  TWO_PRO_COMMON_ADVERB_ENGLISH_INDEX_V1.set(
    surface,
    {
      surface,
      entry: only.entry,
      degrees,
    }
  );
}

const safeKoreanAdverbBuilderV1 =
  new Map<
    string,
    TwoProCommonAdverbRuntimeEntryV1[]
  >();

for (
  const entry of
  TWO_PRO_COMMON_SAFE_ADVERB_ENTRIES_V1
) {
  const ko =
    twoProNormalizeKoreanCommonAdverbSurfaceV1(
      entry.ko
    );

  if (!ko) {
    continue;
  }

  const bucket =
    safeKoreanAdverbBuilderV1.get(ko) ||
    [];

  bucket.push(entry);

  safeKoreanAdverbBuilderV1.set(
    ko,
    bucket
  );
}

const TWO_PRO_COMMON_ADVERB_KOREAN_SAFE_INDEX_V1 =
  new Map<
    string,
    TwoProCommonAdverbRuntimeEntryV1
  >();

export const TWO_PRO_COMMON_ADVERB_AMBIGUOUS_KOREAN_SURFACES_V1 =
  new Set<string>();

for (
  const [
    ko,
    bucket,
  ] of safeKoreanAdverbBuilderV1.entries()
) {
  if (bucket.length !== 1) {
    TWO_PRO_COMMON_ADVERB_AMBIGUOUS_KOREAN_SURFACES_V1.add(
      ko
    );
    continue;
  }

  TWO_PRO_COMMON_ADVERB_KOREAN_SAFE_INDEX_V1.set(
    ko,
    bucket[0]
  );
}

export const twoProLookupEnglishCommonAdverbV1 = (
  value: unknown
): TwoProCommonAdverbSurfaceHitV1 | null => {
  const surface =
    twoProNormalizeEnglishCommonAdverbSurfaceV1(
      value
    );

  if (
    !surface ||
    TWO_PRO_COMMON_ADVERB_AMBIGUOUS_ENGLISH_SURFACES_V1.has(
      surface
    )
  ) {
    return null;
  }

  return (
    TWO_PRO_COMMON_ADVERB_ENGLISH_INDEX_V1.get(
      surface
    ) || null
  );
};

export const twoProIsBlockedEnglishCommonAdverbSurfaceV1 = (
  value: unknown
): boolean => {
  const surface =
    twoProNormalizeEnglishCommonAdverbSurfaceV1(
      value
    );

  return Boolean(
    surface &&
    TWO_PRO_COMMON_ADVERB_AMBIGUOUS_ENGLISH_SURFACES_V1.has(
      surface
    )
  );
};

export const twoProLookupKoreanSafeCommonAdverbV1 = (
  value: unknown
): TwoProCommonAdverbRuntimeEntryV1 | null => {
  const surface =
    twoProNormalizeKoreanCommonAdverbSurfaceV1(
      value
    );

  if (
    !surface ||
    TWO_PRO_COMMON_ADVERB_AMBIGUOUS_KOREAN_SURFACES_V1.has(
      surface
    )
  ) {
    return null;
  }

  return (
    TWO_PRO_COMMON_ADVERB_KOREAN_SAFE_INDEX_V1.get(
      surface
    ) || null
  );
};

export const TWO_PRO_COMMON_ADVERB_STATS_V1 = {
  schemaVersion:
    String(
      rawCommonAdverbRulesV1?.schemaVersion || ''
    ),
  schemaOk:
    TWO_PRO_COMMON_ADVERB_SCHEMA_OK_V1,
  sourceEntryCount:
    Object.keys(rawAdverbEntriesV1).length,
  loadedEntryCount:
    TWO_PRO_COMMON_ADVERB_ENTRIES_V1.length,
  safeEntryCount:
    TWO_PRO_COMMON_SAFE_ADVERB_ENTRIES_V1.length,
  contextEntryCount:
    TWO_PRO_COMMON_ADVERB_ENTRIES_V1.filter(
      (entry) =>
        entry.mode === 'CONTEXT'
    ).length,
  indexedEnglishSurfaceCount:
    TWO_PRO_COMMON_ADVERB_ENGLISH_INDEX_V1.size,
  ambiguousEnglishSurfaceCount:
    TWO_PRO_COMMON_ADVERB_AMBIGUOUS_ENGLISH_SURFACES_V1.size,
  indexedSafeKoreanCount:
    TWO_PRO_COMMON_ADVERB_KOREAN_SAFE_INDEX_V1.size,
  ambiguousSafeKoreanCount:
    TWO_PRO_COMMON_ADVERB_AMBIGUOUS_KOREAN_SURFACES_V1.size,
} as const;
