// @ts-nocheck
import commonVerbRules from './rules-common-verbs.json';

// ============================================================================
// ☆ TwoPro Common Verbs Loader v1.0
//
// - rules-common-verbs.json을 app/api에서 한 번만 로드합니다.
// - 두 번역 route가 동일한 영어 surface index와 SAFE 한국어 역색인을 공유합니다.
// - SAFE는 양방향 대표어휘로 사용할 수 있습니다.
// - EN_LEMMA_ONLY는 영어 활용형 -> lemma 복원에만 사용합니다.
// - 다어절 PHRASES는 이 loader가 번역하지 않습니다.
// ============================================================================

export type TwoProCommonVerbModeV1 =
  | 'SAFE'
  | 'EN_LEMMA_ONLY';

export type TwoProCommonVerbFormKindV1 =
  | 'base'
  | 'third'
  | 'past'
  | 'pastParticiple'
  | 'ing';

export type TwoProCommonVerbRuntimeEntryV1 = {
  lemma: string;
  ko: string | null;
  mode: TwoProCommonVerbModeV1;
  forms: {
    third: string[];
    past: string[];
    pastParticiple: string[];
    ing: string[];
  };
};

export type TwoProCommonVerbSurfaceHitV1 = {
  surface: string;
  entry: TwoProCommonVerbRuntimeEntryV1;
  formKinds: TwoProCommonVerbFormKindV1[];
};

const TWO_PRO_COMMON_FORM_ORDER_V1:
  readonly TwoProCommonVerbFormKindV1[] = [
    'base',
    'third',
    'past',
    'pastParticiple',
    'ing',
  ];

export const twoProNormalizeEnglishCommonVerbSurfaceV1 = (
  value: unknown
): string =>
  String(value || '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/[.!?。！？]+$/u, '')
    .replace(/\s+/g, ' ')
    .trim();

export const twoProNormalizeKoreanCommonVerbSurfaceV1 = (
  value: unknown
): string =>
  String(value || '')
    .normalize('NFC')
    .replace(/[.!?。！？]+$/u, '')
    .replace(/\s+/g, ' ')
    .trim();

const rawCommonRulesV1 =
  commonVerbRules as any;

export const TWO_PRO_COMMON_VERB_SCHEMA_OK_V1 =
  rawCommonRulesV1?.schemaVersion === '1.0' &&
  rawCommonRulesV1?.entries &&
  typeof rawCommonRulesV1.entries === 'object' &&
  !Array.isArray(rawCommonRulesV1.entries);

const rawEntriesV1: Record<string, any> =
  TWO_PRO_COMMON_VERB_SCHEMA_OK_V1
    ? rawCommonRulesV1.entries
    : {};

const twoProIsStringArrayV1 = (
  value: unknown
): value is string[] =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every(
    (item) =>
      typeof item === 'string' &&
      Boolean(item.trim())
  );

const twoProParseCommonVerbEntryV1 = (
  lemmaKey: string,
  rawEntry: any
): TwoProCommonVerbRuntimeEntryV1 | null => {
  const lemma =
    twoProNormalizeEnglishCommonVerbSurfaceV1(
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
  ) as TwoProCommonVerbModeV1;

  if (
    mode !== 'SAFE' &&
    mode !== 'EN_LEMMA_ONLY'
  ) {
    return null;
  }

  const ko =
    rawEntry?.ko === null
      ? null
      : twoProNormalizeKoreanCommonVerbSurfaceV1(
          rawEntry?.ko
        );

  if (
    mode === 'SAFE' &&
    (!ko || !ko.endsWith('다'))
  ) {
    return null;
  }

  if (
    mode === 'EN_LEMMA_ONLY' &&
    rawEntry?.ko !== null
  ) {
    return null;
  }

  const forms = rawEntry?.forms || {};

  if (
    !twoProIsStringArrayV1(forms.third) ||
    !twoProIsStringArrayV1(forms.past) ||
    !twoProIsStringArrayV1(
      forms.pastParticiple
    ) ||
    !twoProIsStringArrayV1(forms.ing)
  ) {
    return null;
  }

  return {
    lemma,
    ko,
    mode,
    forms: {
      third: forms.third.map(
        (item: string) =>
          twoProNormalizeEnglishCommonVerbSurfaceV1(
            item
          )
      ),
      past: forms.past.map(
        (item: string) =>
          twoProNormalizeEnglishCommonVerbSurfaceV1(
            item
          )
      ),
      pastParticiple:
        forms.pastParticiple.map(
          (item: string) =>
            twoProNormalizeEnglishCommonVerbSurfaceV1(
              item
            )
        ),
      ing: forms.ing.map(
        (item: string) =>
          twoProNormalizeEnglishCommonVerbSurfaceV1(
            item
          )
      ),
    },
  };
};

export const TWO_PRO_COMMON_VERB_ENTRIES_V1:
  TwoProCommonVerbRuntimeEntryV1[] =
  Object.entries(rawEntriesV1)
    .map(([lemma, rawEntry]) =>
      twoProParseCommonVerbEntryV1(
        lemma,
        rawEntry
      )
    )
    .filter(
      (
        entry
      ): entry is TwoProCommonVerbRuntimeEntryV1 =>
        Boolean(entry)
    );

export const TWO_PRO_COMMON_SAFE_VERB_ENTRIES_V1 =
  TWO_PRO_COMMON_VERB_ENTRIES_V1.filter(
    (entry) =>
      entry.mode === 'SAFE' &&
      Boolean(entry.ko)
  );

const surfaceBuilderV1 =
  new Map<
    string,
    {
      entry: TwoProCommonVerbRuntimeEntryV1;
      formKinds: Set<TwoProCommonVerbFormKindV1>;
    }
  >();

const surfaceCollisionsV1 =
  new Set<string>();

const twoProAddEnglishSurfaceV1 = (
  surfaceValue: unknown,
  entry: TwoProCommonVerbRuntimeEntryV1,
  formKind: TwoProCommonVerbFormKindV1
) => {
  const surface =
    twoProNormalizeEnglishCommonVerbSurfaceV1(
      surfaceValue
    );

  if (
    !surface ||
    !/^[a-z][a-z'-]*$/u.test(surface)
  ) {
    return;
  }

  const existing =
    surfaceBuilderV1.get(surface);

  if (
    existing &&
    existing.entry.lemma !== entry.lemma
  ) {
    surfaceCollisionsV1.add(surface);
    surfaceBuilderV1.delete(surface);
    return;
  }

  if (surfaceCollisionsV1.has(surface)) {
    return;
  }

  if (existing) {
    existing.formKinds.add(formKind);
    return;
  }

  surfaceBuilderV1.set(surface, {
    entry,
    formKinds: new Set([formKind]),
  });
};

for (
  const entry of
  TWO_PRO_COMMON_VERB_ENTRIES_V1
) {
  twoProAddEnglishSurfaceV1(
    entry.lemma,
    entry,
    'base'
  );

  for (
    const surface of entry.forms.third
  ) {
    twoProAddEnglishSurfaceV1(
      surface,
      entry,
      'third'
    );
  }

  for (
    const surface of entry.forms.past
  ) {
    twoProAddEnglishSurfaceV1(
      surface,
      entry,
      'past'
    );
  }

  for (
    const surface of
    entry.forms.pastParticiple
  ) {
    twoProAddEnglishSurfaceV1(
      surface,
      entry,
      'pastParticiple'
    );
  }

  for (
    const surface of entry.forms.ing
  ) {
    twoProAddEnglishSurfaceV1(
      surface,
      entry,
      'ing'
    );
  }
}

const TWO_PRO_COMMON_EN_SURFACE_INDEX_V1 =
  new Map<string, TwoProCommonVerbSurfaceHitV1>();

for (
  const [
    surface,
    rawHit,
  ] of surfaceBuilderV1.entries()
) {
  TWO_PRO_COMMON_EN_SURFACE_INDEX_V1.set(
    surface,
    {
      surface,
      entry: rawHit.entry,
      formKinds:
        TWO_PRO_COMMON_FORM_ORDER_V1.filter(
          (kind) =>
            rawHit.formKinds.has(kind)
        ),
    }
  );
}

const TWO_PRO_COMMON_SAFE_KO_INDEX_V1 =
  new Map<
    string,
    TwoProCommonVerbRuntimeEntryV1
  >();

const safeKoCollisionsV1 =
  new Set<string>();

for (
  const entry of
  TWO_PRO_COMMON_SAFE_VERB_ENTRIES_V1
) {
  const ko =
    twoProNormalizeKoreanCommonVerbSurfaceV1(
      entry.ko
    );

  if (!ko) {
    continue;
  }

  const existing =
    TWO_PRO_COMMON_SAFE_KO_INDEX_V1.get(
      ko
    );

  if (
    existing &&
    existing.lemma !== entry.lemma
  ) {
    safeKoCollisionsV1.add(ko);
    TWO_PRO_COMMON_SAFE_KO_INDEX_V1.delete(
      ko
    );
    continue;
  }

  if (!safeKoCollisionsV1.has(ko)) {
    TWO_PRO_COMMON_SAFE_KO_INDEX_V1.set(
      ko,
      entry
    );
  }
}

export const TWO_PRO_COMMON_VERB_STATS_V1 = {
  schemaOk:
    TWO_PRO_COMMON_VERB_SCHEMA_OK_V1,
  sourceEntryCount:
    Object.keys(rawEntriesV1).length,
  loadedEntryCount:
    TWO_PRO_COMMON_VERB_ENTRIES_V1.length,
  safeEntryCount:
    TWO_PRO_COMMON_SAFE_VERB_ENTRIES_V1.length,
  lemmaOnlyEntryCount:
    TWO_PRO_COMMON_VERB_ENTRIES_V1.filter(
      (entry) =>
        entry.mode === 'EN_LEMMA_ONLY'
    ).length,
  englishSurfaceCount:
    TWO_PRO_COMMON_EN_SURFACE_INDEX_V1.size,
  englishSurfaceCollisionCount:
    surfaceCollisionsV1.size,
  safeKoreanCollisionCount:
    safeKoCollisionsV1.size,
} as const;

export const twoProLookupEnglishCommonVerbV1 = (
  value: unknown
): TwoProCommonVerbSurfaceHitV1 | null => {
  const surface =
    twoProNormalizeEnglishCommonVerbSurfaceV1(
      value
    );

  if (
    !surface ||
    !/^[a-z][a-z'-]*$/u.test(surface)
  ) {
    return null;
  }

  return (
    TWO_PRO_COMMON_EN_SURFACE_INDEX_V1.get(
      surface
    ) || null
  );
};

export const twoProLookupSafeKoreanCommonVerbV1 = (
  value: unknown
): TwoProCommonVerbRuntimeEntryV1 | null => {
  const surface =
    twoProNormalizeKoreanCommonVerbSurfaceV1(
      value
    );

  if (!surface) {
    return null;
  }

  return (
    TWO_PRO_COMMON_SAFE_KO_INDEX_V1.get(
      surface
    ) || null
  );
};

export const twoProNormalizeEnglishLeadingCommonVerbV1 = (
  value: unknown
): {
  original: string;
  normalized: string;
  hit: TwoProCommonVerbSurfaceHitV1;
} | null => {
  const original = String(value || '')
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();

  if (!original) {
    return null;
  }

  const firstWordMatch = original.match(
    /^([A-Za-z][A-Za-z'-]*)(?=\s|$)/u
  );

  if (!firstWordMatch) {
    return null;
  }

  const hit =
    twoProLookupEnglishCommonVerbV1(
      firstWordMatch[1]
    );

  if (
    !hit ||
    hit.surface === hit.entry.lemma
  ) {
    return null;
  }

  const normalized =
    hit.entry.lemma +
    original.slice(
      firstWordMatch[1].length
    );

  return {
    original,
    normalized,
    hit,
  };
};
