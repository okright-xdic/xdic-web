// @ts-nocheck
import commonAdjectiveRules from './rules-common-adjectives.json';

// ============================================================================
// ☆ TwoPro Common Adjectives Loader v1.0
//
// - rules-common-adjectives.json을 app/api에서 한 번만 로드합니다.
// - 두 번역 route가 동일한 영어 base/comparative/superlative surface index와
//   SAFE 한국어 대표형 역색인을 공유합니다.
// - SAFE만 양방향 대표형용사 direct 후보가 됩니다.
// - CONTEXT는 영어 lemma/degree 분석 정보만 제공하고 직접 번역값을 강제하지 않습니다.
// - cross-lemma surface 충돌(lower 등)은 direct index에서 자동 제외합니다.
// - 다어절 PHRASES 번역은 이 loader가 담당하지 않습니다.
// ============================================================================

export type TwoProCommonAdjectiveModeV1 =
  | 'SAFE'
  | 'CONTEXT';

export type TwoProCommonAdjectiveDegreeV1 =
  | 'base'
  | 'comparative'
  | 'superlative';

export type TwoProCommonAdjectiveRuntimeEntryV1 = {
  lemma: string;
  ko: string | null;
  mode: TwoProCommonAdjectiveModeV1;
  forms: {
    comparative: string[];
    superlative: string[];
  };
};

export type TwoProCommonAdjectiveSurfaceHitV1 = {
  surface: string;
  entry: TwoProCommonAdjectiveRuntimeEntryV1;
  degrees: TwoProCommonAdjectiveDegreeV1[];
};

const TWO_PRO_COMMON_ADJECTIVE_DEGREE_ORDER_V1:
  readonly TwoProCommonAdjectiveDegreeV1[] = [
    'base',
    'comparative',
    'superlative',
  ];

export const twoProNormalizeEnglishCommonAdjectiveSurfaceV1 = (
  value: unknown
): string =>
  String(value || '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/[.!?。！？]+$/u, '')
    .replace(/\s+/g, ' ')
    .trim();

export const twoProNormalizeKoreanCommonAdjectiveSurfaceV1 = (
  value: unknown
): string =>
  String(value || '')
    .normalize('NFC')
    .replace(/[.!?。！？]+$/u, '')
    .replace(/\s+/g, ' ')
    .trim();

const rawCommonAdjectiveRulesV1 =
  commonAdjectiveRules as any;

export const TWO_PRO_COMMON_ADJECTIVE_SCHEMA_OK_V1 =
  rawCommonAdjectiveRulesV1?.schemaVersion === '1.0' &&
  rawCommonAdjectiveRulesV1?.entries &&
  typeof rawCommonAdjectiveRulesV1.entries === 'object' &&
  !Array.isArray(rawCommonAdjectiveRulesV1.entries);

const rawAdjectiveEntriesV1: Record<string, any> =
  TWO_PRO_COMMON_ADJECTIVE_SCHEMA_OK_V1
    ? rawCommonAdjectiveRulesV1.entries
    : {};

const twoProIsPossiblyEmptyStringArrayV1 = (
  value: unknown
): value is string[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      typeof item === 'string' &&
      Boolean(item.trim())
  );

const twoProParseCommonAdjectiveEntryV1 = (
  lemmaKey: string,
  rawEntry: any
): TwoProCommonAdjectiveRuntimeEntryV1 | null => {
  const lemma =
    twoProNormalizeEnglishCommonAdjectiveSurfaceV1(
      lemmaKey
    );

  if (
    !lemma ||
    !/^[a-z][a-z'-]*$/u.test(lemma) ||
    lemma.includes(' ')
  ) {
    return null;
  }

  const mode = String(
    rawEntry?.mode || ''
  ) as TwoProCommonAdjectiveModeV1;

  if (
    mode !== 'SAFE' &&
    mode !== 'CONTEXT'
  ) {
    return null;
  }

  const ko =
    rawEntry?.ko === null
      ? null
      : twoProNormalizeKoreanCommonAdjectiveSurfaceV1(
          rawEntry?.ko
        );

  if (
    mode === 'SAFE' &&
    (!ko || !ko.endsWith('다'))
  ) {
    return null;
  }

  if (
    mode === 'CONTEXT' &&
    rawEntry?.ko !== null
  ) {
    return null;
  }

  const forms = rawEntry?.forms || {};

  if (
    !twoProIsPossiblyEmptyStringArrayV1(
      forms.comparative
    ) ||
    !twoProIsPossiblyEmptyStringArrayV1(
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
            twoProNormalizeEnglishCommonAdjectiveSurfaceV1(
              item
            )
        ),
      superlative:
        forms.superlative.map(
          (item: string) =>
            twoProNormalizeEnglishCommonAdjectiveSurfaceV1(
              item
            )
        ),
    },
  };
};

export const TWO_PRO_COMMON_ADJECTIVE_ENTRIES_V1:
  TwoProCommonAdjectiveRuntimeEntryV1[] =
  Object.entries(rawAdjectiveEntriesV1)
    .map(([lemma, rawEntry]) =>
      twoProParseCommonAdjectiveEntryV1(
        lemma,
        rawEntry
      )
    )
    .filter(
      (
        entry
      ): entry is TwoProCommonAdjectiveRuntimeEntryV1 =>
        Boolean(entry)
    );

export const TWO_PRO_COMMON_SAFE_ADJECTIVE_ENTRIES_V1 =
  TWO_PRO_COMMON_ADJECTIVE_ENTRIES_V1.filter(
    (entry) =>
      entry.mode === 'SAFE' &&
      Boolean(entry.ko)
  );

const adjectiveSurfaceBuilderV1 =
  new Map<
    string,
    Map<
      string,
      {
        entry: TwoProCommonAdjectiveRuntimeEntryV1;
        degrees: Set<TwoProCommonAdjectiveDegreeV1>;
      }
    >
  >();

const twoProAddEnglishAdjectiveSurfaceV1 = (
  surfaceValue: unknown,
  entry: TwoProCommonAdjectiveRuntimeEntryV1,
  degree: TwoProCommonAdjectiveDegreeV1
) => {
  const surface =
    twoProNormalizeEnglishCommonAdjectiveSurfaceV1(
      surfaceValue
    );

  if (!surface) {
    return;
  }

  const bucket =
    adjectiveSurfaceBuilderV1.get(surface) ||
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

  adjectiveSurfaceBuilderV1.set(
    surface,
    bucket
  );
};

for (
  const entry of
  TWO_PRO_COMMON_ADJECTIVE_ENTRIES_V1
) {
  twoProAddEnglishAdjectiveSurfaceV1(
    entry.lemma,
    entry,
    'base'
  );

  for (
    const surface of
    entry.forms.comparative
  ) {
    twoProAddEnglishAdjectiveSurfaceV1(
      surface,
      entry,
      'comparative'
    );
  }

  for (
    const surface of
    entry.forms.superlative
  ) {
    twoProAddEnglishAdjectiveSurfaceV1(
      surface,
      entry,
      'superlative'
    );
  }
}

const TWO_PRO_COMMON_ADJECTIVE_ENGLISH_INDEX_V1 =
  new Map<
    string,
    TwoProCommonAdjectiveSurfaceHitV1
  >();

export const TWO_PRO_COMMON_ADJECTIVE_AMBIGUOUS_ENGLISH_SURFACES_V1 =
  new Set<string>();

for (
  const [
    surface,
    lemmaMap,
  ] of adjectiveSurfaceBuilderV1.entries()
) {
  if (lemmaMap.size !== 1) {
    TWO_PRO_COMMON_ADJECTIVE_AMBIGUOUS_ENGLISH_SURFACES_V1.add(
      surface
    );
    continue;
  }

  const only =
    Array.from(lemmaMap.values())[0];

  const degrees =
    Array.from(only.degrees).sort(
      (a, b) =>
        TWO_PRO_COMMON_ADJECTIVE_DEGREE_ORDER_V1.indexOf(
          a
        ) -
        TWO_PRO_COMMON_ADJECTIVE_DEGREE_ORDER_V1.indexOf(
          b
        )
    );

  TWO_PRO_COMMON_ADJECTIVE_ENGLISH_INDEX_V1.set(
    surface,
    {
      surface,
      entry: only.entry,
      degrees,
    }
  );
}

const safeKoreanAdjectiveBuilderV1 =
  new Map<
    string,
    TwoProCommonAdjectiveRuntimeEntryV1[]
  >();

for (
  const entry of
  TWO_PRO_COMMON_SAFE_ADJECTIVE_ENTRIES_V1
) {
  const ko =
    twoProNormalizeKoreanCommonAdjectiveSurfaceV1(
      entry.ko
    );

  if (!ko) {
    continue;
  }

  const bucket =
    safeKoreanAdjectiveBuilderV1.get(ko) ||
    [];

  bucket.push(entry);
  safeKoreanAdjectiveBuilderV1.set(
    ko,
    bucket
  );
}

const TWO_PRO_COMMON_ADJECTIVE_KOREAN_SAFE_INDEX_V1 =
  new Map<
    string,
    TwoProCommonAdjectiveRuntimeEntryV1
  >();

export const TWO_PRO_COMMON_ADJECTIVE_AMBIGUOUS_KOREAN_SURFACES_V1 =
  new Set<string>();

for (
  const [
    ko,
    bucket,
  ] of safeKoreanAdjectiveBuilderV1.entries()
) {
  if (bucket.length !== 1) {
    TWO_PRO_COMMON_ADJECTIVE_AMBIGUOUS_KOREAN_SURFACES_V1.add(
      ko
    );
    continue;
  }

  TWO_PRO_COMMON_ADJECTIVE_KOREAN_SAFE_INDEX_V1.set(
    ko,
    bucket[0]
  );
}

export const twoProLookupEnglishCommonAdjectiveV1 = (
  value: unknown
): TwoProCommonAdjectiveSurfaceHitV1 | null => {
  const surface =
    twoProNormalizeEnglishCommonAdjectiveSurfaceV1(
      value
    );

  if (
    !surface ||
    TWO_PRO_COMMON_ADJECTIVE_AMBIGUOUS_ENGLISH_SURFACES_V1.has(
      surface
    )
  ) {
    return null;
  }

  return (
    TWO_PRO_COMMON_ADJECTIVE_ENGLISH_INDEX_V1.get(
      surface
    ) || null
  );
};

export const twoProIsBlockedEnglishCommonAdjectiveSurfaceV1 = (
  value: unknown
): boolean => {
  const surface =
    twoProNormalizeEnglishCommonAdjectiveSurfaceV1(
      value
    );

  return Boolean(
    surface &&
    TWO_PRO_COMMON_ADJECTIVE_AMBIGUOUS_ENGLISH_SURFACES_V1.has(
      surface
    )
  );
};

export const twoProLookupKoreanSafeCommonAdjectiveV1 = (
  value: unknown
): TwoProCommonAdjectiveRuntimeEntryV1 | null => {
  const surface =
    twoProNormalizeKoreanCommonAdjectiveSurfaceV1(
      value
    );

  if (
    !surface ||
    TWO_PRO_COMMON_ADJECTIVE_AMBIGUOUS_KOREAN_SURFACES_V1.has(
      surface
    )
  ) {
    return null;
  }

  return (
    TWO_PRO_COMMON_ADJECTIVE_KOREAN_SAFE_INDEX_V1.get(
      surface
    ) || null
  );
};

export const TWO_PRO_COMMON_ADJECTIVE_STATS_V1 = {
  schemaVersion:
    String(
      rawCommonAdjectiveRulesV1?.schemaVersion || ''
    ),
  schemaOk:
    TWO_PRO_COMMON_ADJECTIVE_SCHEMA_OK_V1,
  sourceEntryCount:
    Object.keys(rawAdjectiveEntriesV1).length,
  loadedEntryCount:
    TWO_PRO_COMMON_ADJECTIVE_ENTRIES_V1.length,
  safeEntryCount:
    TWO_PRO_COMMON_SAFE_ADJECTIVE_ENTRIES_V1.length,
  contextEntryCount:
    TWO_PRO_COMMON_ADJECTIVE_ENTRIES_V1.filter(
      (entry) => entry.mode === 'CONTEXT'
    ).length,
  indexedEnglishSurfaceCount:
    TWO_PRO_COMMON_ADJECTIVE_ENGLISH_INDEX_V1.size,
  ambiguousEnglishSurfaceCount:
    TWO_PRO_COMMON_ADJECTIVE_AMBIGUOUS_ENGLISH_SURFACES_V1.size,
  indexedSafeKoreanCount:
    TWO_PRO_COMMON_ADJECTIVE_KOREAN_SAFE_INDEX_V1.size,
  ambiguousSafeKoreanCount:
    TWO_PRO_COMMON_ADJECTIVE_AMBIGUOUS_KOREAN_SURFACES_V1.size,
} as const;
