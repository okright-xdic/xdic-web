'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capgo/capacitor-speech-recognition';
import SearchInput from '@/components/SearchInput';
import Footer from '@/components/Footer';
import PopularKeywords from '@/components/PopularKeywords'; 
import RecentKeywords from '@/components/RecentKeywords'; 
import KakaoAdFit from '@/components/ads/KakaoAdFit'; 
import NuanceWidget from '@/components/NuanceWidget'; 
import TodaysConversation from '@/components/TodaysConversation'; 
import AppTodaysConversation from '@/components/AppTodaysConversation'; 
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string | number;
  category_id: number;
  line_text: string;
  source_order?: number;
}

interface TranslationReferenceWord {
  source: string;
  selected?: string | null;
  candidates: string[];
  slot?: string;
  confidence?: number;
}

interface SlotSimilarityTier3Reference {
  direction: 'KO_EN' | 'EN_KO';
  sourcePattern: string;
  targetTemplate: string;
  patternScore?: number;
  patternMargin?: number;
  semanticSafety?: 'PASS' | 'REVIEW';
  budgetStatus?:
    | 'PASS_TIER1'
    | 'PASS_TIER2_CANDIDATE'
    | 'REVIEW';
  referenceOnly: true;
  generatedUserTranslation: false;
  engine:
    'slot-similarity-tier3-reference-v1';
}

interface SearchPageProps {
  query: string;
  results?: SearchResult[];
  orangeKeys?: string[]; 
  blueKeys?: string[];    
  isApp?: boolean;
  isSentenceSearch?: boolean;
  popularSearches?: string[];
  recentSearches?: { word: string; count: number }[];
  isPartialMatch?: boolean;
  matchedKeywords?: string[];
}

const CATEGORY_NAMES: Record<number, string> = {
  0: '기초영어(Reference English)', 
  1: '기본영어(Basic English)', 
  2: '인문사회용어(Terms for Humanities&Sociology)', 
  3: '기계·전기·전자용어(Machine·Electricity·Electronics)', 
  4: '교육·종교·예체능용어(Education·Religion·Arts&Sports)',
  5: '무역경제용어(Terms for Trade and Economy)', 
  6: '자동차·환경용어(Terms for Automobile·Environment)', 
  7: '물리·화학용어(Terms for Physics·Chemistry)', 
  8: '컴퓨터용어(Computer Terms)', 
  9: '의학용어(Medical Terms)', 
  10: '인문사회기타용어(Humanities&Sociology_Others)', 
  11: '과학기술기타용어(Terms for Science&Technology)', 
  12: '기타(Other Terms)'
};

// ================================================================
// 대응어 하이라이트 안전 처리
// - '한' 같은 한 글자 토큰이 '완전한/조사한/이용한' 내부에서
//   잘못 색칠되는 것을 막습니다.
// ================================================================
const HIGHLIGHT_STOPWORDS = new Set([
  // 한국어 한 글자 조사·의존 표현
  '한', '을', '를', '은', '는', '이', '가', '와', '과', '의',
  '에', '로', '도', '만', '수', '좀', '및',

  // 영어 기능어
  'a', 'an', 'the', 'is', 'are', 'was', 'were',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'
]);

const normalizeHighlightKey = (value: string): string =>
  String(value || '')
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .replace(/^[.,:;!?()[\]{}"'“”‘’]+/g, '')
    .replace(/[.,:;!?()[\]{}"'“”‘’]+$/g, '')
    .trim();

const sanitizeHighlightKeys = (
  values: readonly string[]
): string[] => {
  const unique = new Map<string, string>();

  for (const rawValue of values) {
    const value = normalizeHighlightKey(rawValue);
    const compact = value.replace(/\s+/g, '');
    const compareKey = value.toLocaleLowerCase();

    if (!value || compact.length < 2) {
      continue;
    }

    if (HIGHLIGHT_STOPWORDS.has(compareKey)) {
      continue;
    }

    // 한글 한 글자는 다른 단어의 어미·관형형과 쉽게 충돌하므로 제외
    if (/^[가-힣]$/u.test(compact)) {
      continue;
    }

    if (!unique.has(compareKey)) {
      unique.set(compareKey, value);
    }
  }

  // 긴 대응어를 먼저 처리해 짧은 대응어가 일부를 선점하지 않게 합니다.
  return Array.from(unique.values()).sort(
    (a, b) => b.length - a.length
  );
};

const escapeHighlightRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


// ================================================================
// 단어·전문용어와 번역할 문장을 구분합니다.
// ================================================================
const isSentenceLikeQuery = (value: string): boolean => {
  const text = String(value || '').trim();

  if (!text) {
    return false;
  }

  const hasKorean = /[가-힣]/.test(text);

  // ------------------------------------------------
  // 한국어 문장 판별
  // ------------------------------------------------
  if (hasKorean) {
    const withoutEndingPunctuation = text
      .replace(/[.!?]+$/g, '')
      .trim();

    const wordCount = withoutEndingPunctuation
      .split(/\s+/)
      .filter(Boolean).length;

    // ============================================================
    // ☆ TwoPro v1.6: 한국어 문장 종결형 판별 보강
    // '큽니다/갑니다/옵니다'처럼 공통 끝부분이 '니다'인 문장과
    // '커요/작아요/좋아요' 같은 2어절 이상의 해요체를 인식합니다.
    // ============================================================
    const hasKoreanFormalEnding =
      /(습니다|습니까|니다|니까|입니다|인가요|나요|까요|세요|십시오|시오|아요|어요|예요|에요|게요|데요|래요|거든요|잖아요|지요|해요|했어요|했습니까|했다|한다|된다|됐다|이다|아니다|있다|없다|싶다|있어|없어|같아|겠어|했어|았어|었어|거야|잖아|구나|좋아해요|좋아하세요|주세요|줘요|죠|군요|네요|합시다|읍시다)$/u.test(
        withoutEndingPunctuation
      );

    const hasKoreanConversationalEnding =
      wordCount >= 2 &&
      /(요|다|죠|군요|네요|필요해|좋아해|싫어해|사랑해|미안해|고마워|괜찮아|같아|싶어|있어|없어|됐어|돼|할 거야|해야 해|해줘|할게|갈게|줄게|보자|가자|하자|맞아|몰라|알아|잖아|구나)$/u.test(
        withoutEndingPunctuation
      );

    // ============================================================
    // ☆ TwoPro v1.6-safe: xTemp14(3) 종결형 보강
    //
    // -가요?는 계신가요/으신가요/비싼가요를 포괄하지만
    // 평서형 '학교에 가요.'와 충돌하므로 '?'가 있을 때만 인정합니다.
    // -까?도 '?'가 있을 때만 추가 인정합니다.
    //
    // 갑니까/됩니까/하십니까처럼 종성 ㅂ + '니까'인
    // 정식 -(으)ㅂ니까와,
    // 갑시다/봅시다/먹읍시다 같은 -(으)ㅂ시다도
    // Hangul 종성을 확인하여 인식합니다.
    // ============================================================
    const twoProHasFinalJongseongBV16 = (
      value: string
    ): boolean => {
      const char = String(value || '');

      if (!/^[가-힣]$/u.test(char)) {
        return false;
      }

      const code =
        char.charCodeAt(0) - 0xac00;

      return (
        code >= 0 &&
        code <= 11171 &&
        code % 28 === 17
      );
    };

    const twoProHasFusedBEndingV16 = (
      source: string,
      tail: string
    ): boolean => {
      if (!source.endsWith(tail)) {
        return false;
      }

      const prefix =
        source.slice(
          0,
          -tail.length
        );

      if (!prefix) {
        return false;
      }

      return twoProHasFinalJongseongBV16(
        prefix.slice(-1)
      );
    };

    const hasKoreanCorpusQuestionEnding =
      /[?？]$/u.test(text) &&
      /(?:가요|까)$/u.test(
        withoutEndingPunctuation
      );

    const hasKoreanBnikkaEnding =
      twoProHasFusedBEndingV16(
        withoutEndingPunctuation,
        '니까'
      );

    const hasKoreanBshipdaEnding =
      /읍시다$/u.test(
        withoutEndingPunctuation
      ) ||
      twoProHasFusedBEndingV16(
        withoutEndingPunctuation,
        '시다'
      );


    // ============================================================
    // ☆ TwoPro v1.5-safe: 친구 사이 반말 의문형·청유형
    //
    // 물음표가 있을 때만 한 단어 종결형을 문장으로 인정합니다.
    // '야', '래' 등을 무구두점 일반 명사로 오인하지 않게 합니다.
    //
    // 잘못 입력되기 쉬운 표기는 수록하지 않고
    // 올바른 '겠습니까'만 인식합니다.
    // ============================================================
    const hasKoreanFriendQuestionEnding =
      /\?$/u.test(text) &&
      /(하시겠습니까|되겠니|한지요|겠습니까|아니|알아|알지|래요|이야|나요|어요|니|래|야)$/u.test(
        withoutEndingPunctuation
      );

    // '보라'는 색상명과 충돌할 수 있으므로
    // 목적어가 있거나 느낌표가 있을 때만 명령문으로 봅니다.
    // '해라'는 단독 명령형도 허용합니다.
    const hasKoreanImperativeEnding =
      /해라$/u.test(
        withoutEndingPunctuation
      ) ||
      (
        /보라$/u.test(
          withoutEndingPunctuation
        ) &&
        (
          wordCount >= 2 ||
          /!$/u.test(text)
        )
      );

    return (
      hasKoreanFormalEnding ||
      hasKoreanConversationalEnding ||
      hasKoreanCorpusQuestionEnding ||
      hasKoreanBnikkaEnding ||
      hasKoreanBshipdaEnding ||
      hasKoreanFriendQuestionEnding ||
      hasKoreanImperativeEnding ||
      (wordCount >= 2 && /[.!?。！？]$/.test(text))
    );
  }

  // ------------------------------------------------
  // 영어 문장 판별
  // ------------------------------------------------
  const englishWords =
    text.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || [];

  // sepsis, email, septic shock 등의 단어·용어 제외
  if (englishWords.length < 2) {
    return false;
  }

  const lowerText = text.toLowerCase();

  // ================================================================
  // ☆ TwoPro v13.61-safe: hear + cry/cries 전용 문장 판별
  // ================================================================
  // 일반 조동사 판별에 걸리는 can/could/will 문장뿐 아니라,
  // 한 단어 조동사 cannot과 단순 현재 hears도 반드시
  // /api/translate-en-ko로 전달합니다.
  //
  // 이 검사는 번역 규칙이 아니라 "API 전달 여부"만 결정합니다.
  // 실제 번역은 route.ts의 v13.60 제한 문형이 담당합니다.
  const isTwoProHearCriesSentenceV1361 = (() => {
    const match = text.match(
      /^(I|We|You|He|She|They)\s+(can\s+not\s+hear|cannot\s+hear|can['’]t\s+hear|could\s+not\s+hear|couldnot\s+hear|couldn['’]t\s+hear|will\s+not\s+hear|won['’]t\s+hear|can\s+hear|could\s+hear|will\s+hear|hear|hears|heard)\s+(?:(?:the\s+)?animal['’]s\s+cry|(?:the\s+)?animals['’]\s+cries|(?:the\s+)?cr(?:y|ies))(?:\s+in\s+(?:my|our|your|his|her|their|the)\s+houses?)?[.!?]?$/i
    );

    if (!match) {
      return false;
    }

    const subject = String(match[1] || '').toLowerCase();
    const predicate = String(match[2] || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    // 단순 현재의 주어·동사 수 일치만 이 단계에서 확인합니다.
    if (predicate === 'hears') {
      return subject === 'he' || subject === 'she';
    }

    if (predicate === 'hear') {
      return subject !== 'he' && subject !== 'she';
    }

    return true;
  })();

  if (isTwoProHearCriesSentenceV1361) {
    return true;
  }

  // ================================================================
  // ☆ TwoPro v13.62-safe: 이순신/defeat 문형 전용 문장 판별
  // ================================================================
  // defeated/defeats는 기존 일반 영어 술어 목록에 없었으므로
  // 정확 일치 규칙이 남아 있어도 번역 API가 호출되지 않았습니다.
  // 아래 제한 문형만 /api/translate-en-ko로 전달합니다.
  const isTwoProLeeSoonShinDefeatSentenceV1362 = (() => {
    const match = text.match(
      /^(Adm\.\s+Lee\s+Soon\s+Shin|Lee\s+Soon\s+Shin|I|We|You|He|She|They)\s+(defeat|defeats|defeated|will\s+defeat)\s+(?:(?:the\s+)?(?:powerful\s+)?invaders?)(?:\s+in\s+(?:the\s+South\s+Shore(?:\s+of\s+Korea)?|the\s+Shore\s+of\s+Korea))?(?:\s+with\s+(?:the\s+first\s+|the\s+)?iron-clad\s+ships?)?[.!?]?$/i
    );

    if (!match) {
      return false;
    }

    const subject = String(match[1] || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const predicate = String(match[2] || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const isThirdPersonSingularSubject =
      subject === 'adm. lee soon shin' ||
      subject === 'lee soon shin' ||
      subject === 'he' ||
      subject === 'she';

    if (predicate === 'defeats') {
      return isThirdPersonSingularSubject;
    }

    if (predicate === 'defeat') {
      return !isThirdPersonSingularSubject;
    }

    return true;
  })();

  if (isTwoProLeeSoonShinDefeatSentenceV1362) {
    return true;
  }

  // ================================================================
  // ☆ TwoPro v13.64-safe: discuss the plan 문형 전용 문장 판별
  // ================================================================
  // discuss/discusses/discussed가 기존 일반 술어 목록에 없어도
  // 아래 제한 문형은 반드시 /api/translate-en-ko로 전달합니다.
  // 실제 번역과 수·인칭 검증은 route.ts의 v13.64 처리기가 담당합니다.
  const isTwoProDiscussPlanSentenceV1364 = (() => {
    const match = text.match(
      /^(I|We|You|He|She|They)\s+(discuss|discusses|discussed|will\s+discuss)\s+(?:a|the|my|our|your|his|her|their)\s+plans?(?:\s+for\s+(?:(?:my|our|your|his|her|their)\s+)?winter\s+vacation)?(?:\s+with\s+(?:(?:my|our|your|his|her|their)\s+friends?|me|us|you|him|her|them))?[.!?]?$/i
    );

    if (!match) {
      return false;
    }

    const subject = String(match[1] || '')
      .toLowerCase();

    const predicate = String(match[2] || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const isThirdPersonSingular =
      subject === 'he' ||
      subject === 'she';

    if (predicate === 'discusses') {
      return isThirdPersonSingular;
    }

    if (predicate === 'discuss') {
      return !isThirdPersonSingular;
    }

    return true;
  })();

  if (isTwoProDiscussPlanSentenceV1364) {
    return true;
  }

  // ================================================================
  // ☆ TwoPro v13.65-safe: develop one's theory 문형 전용 문장 판별
  // ================================================================
  // Einstein처럼 일반 대명사로 시작하지 않는 주어와
  // develop/develops/developed를 포함한 아래 제한 문형을
  // 반드시 /api/translate-en-ko로 전달합니다.
  // 실제 번역과 수·인칭 검증은 route.ts의 v13.65 처리기가 담당합니다.
  const isTwoProDevelopTheorySentenceV1365 = (() => {
    const match = text.match(
      /^(Einstein|I|We|You|He|She|They)\s+(develop|develops|developed|will\s+develop)\s+(?:(?:a|the|my|our|your|his|her|their)\s+(?:theory|theories)|theories)(?:\s+through\s+(?:deep\s+thought(?:\s+and\s+(?:complex\s+)?mathematical\s+reasoning)?|thought(?:\s+and\s+reasoning)?|(?:complex\s+)?mathematical\s+reasoning|reasoning))?[.!?]?$/i
    );

    if (!match) {
      return false;
    }

    const subject = String(match[1] || '')
      .toLowerCase()
      .trim();

    const predicate = String(match[2] || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const isThirdPersonSingular =
      subject === 'einstein' ||
      subject === 'he' ||
      subject === 'she';

    if (predicate === 'develops') {
      return isThirdPersonSingular;
    }

    if (predicate === 'develop') {
      return !isThirdPersonSingular;
    }

    return true;
  })();

  if (isTwoProDevelopTheorySentenceV1365) {
    return true;
  }

  // ================================================================
  // ☆ TwoPro v13.66-safe: Gandhi independence 복합절 문장 판별
  // ================================================================
  // Mahatma Gandi/Gandhi처럼 일반 대명사로 시작하지 않는 주어와
  // say/says/said, 복합 when 절을 포함한 제한 문형을
  // 반드시 /api/translate-en-ko로 전달합니다.
  // 실제 번역·인칭·수·시제 검증은 route.ts의 v13.66 처리기가 담당합니다.
  const isTwoProGandhiIndependenceSentenceV1366 = (() => {
    const normalized = text
      .replace(/[.!?]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const mainMatch = normalized.match(
      /^(Mahatma\s+(?:Gandi|Gandhi)|Gandi|Gandhi|I|We|You|He|She|They)\s+(?:(once)\s+)?(say|says|said|will\s+say)\s+that\s+(India|I|We|You|He|She|They)\s+(would\s+attain|will\s+attain)\s+(?:complete\s+)?independence(?:\s+(when\s+.+))?$/i
    );

    if (!mainMatch) {
      return false;
    }

    const reportSubject = String(
      mainMatch[1] || ''
    )
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const onceSource = String(
      mainMatch[2] || ''
    )
      .toLowerCase()
      .trim();

    const reportVerb = String(
      mainMatch[3] || ''
    )
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const attainVerb = String(
      mainMatch[5] || ''
    )
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const conditionSource = String(
      mainMatch[6] || ''
    )
      .replace(/\s+/g, ' ')
      .trim();

    const reportSubjectIsThirdSingular =
      reportSubject === 'mahatma gandi' ||
      reportSubject === 'mahatma gandhi' ||
      reportSubject === 'gandi' ||
      reportSubject === 'gandhi' ||
      reportSubject === 'he' ||
      reportSubject === 'she';

    if (reportVerb === 'says') {
      if (!reportSubjectIsThirdSingular) {
        return false;
      }
    } else if (reportVerb === 'say') {
      if (reportSubjectIsThirdSingular) {
        return false;
      }
    }

    if (
      onceSource &&
      reportVerb !== 'said'
    ) {
      return false;
    }

    if (
      reportVerb === 'said' &&
      attainVerb !== 'would attain'
    ) {
      return false;
    }

    if (
      reportVerb !== 'said' &&
      attainVerb !== 'will attain'
    ) {
      return false;
    }

    if (!conditionSource) {
      return true;
    }

    const conditionMatch = conditionSource.match(
      /^when\s+(the\s+masses|people|I|We|You|He|She|They)\s+(feel|feels|felt|will\s+feel)\s+(?:(?:\(\s*that\s*\)|that)\s+)?(I|We|You|He|She|They)\s+(can|could|will\s+be\s+able\s+to)\s+improve\s+(my|our|your|his|her|their)\s+lot(?:\s+by\s+(my|our|your|his|her|their)\s+own\s+(?:effort|efforts))?(?:\s+and\s+that\s+(I|We|You|He|She|They)\s+(can|could|will\s+be\s+able\s+to)\s+shape\s+(my|our|your|his|her|their)\s+(?:destiny|destinies)(?:\s+the\s+way\s+(I|We|You|He|She|They)\s+(like|likes|liked|will\s+like))?)?$/i
    );

    if (!conditionMatch) {
      return false;
    }

    const conditionSubject = String(
      conditionMatch[1] || ''
    )
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const feelVerb = String(
      conditionMatch[2] || ''
    )
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const improvePronoun = String(
      conditionMatch[3] || ''
    )
      .toLowerCase()
      .trim();

    const improveAbility = String(
      conditionMatch[4] || ''
    )
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const lotPossessive = String(
      conditionMatch[5] || ''
    )
      .toLowerCase()
      .trim();

    const effortPossessive = String(
      conditionMatch[6] || ''
    )
      .toLowerCase()
      .trim();

    const shapePronoun = String(
      conditionMatch[7] || ''
    )
      .toLowerCase()
      .trim();

    const shapeAbility = String(
      conditionMatch[8] || ''
    )
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const destinyPossessive = String(
      conditionMatch[9] || ''
    )
      .toLowerCase()
      .trim();

    const wayPronoun = String(
      conditionMatch[10] || ''
    )
      .toLowerCase()
      .trim();

    const likeVerb = String(
      conditionMatch[11] || ''
    )
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const expectedPronounMap:
      Record<string, string> = {
        'the masses': 'they',
        people: 'they',
        i: 'i',
        we: 'we',
        you: 'you',
        he: 'he',
        she: 'she',
        they: 'they',
      };

    const expectedPossessiveMap:
      Record<string, string> = {
        i: 'my',
        we: 'our',
        you: 'your',
        he: 'his',
        she: 'her',
        they: 'their',
      };

    const expectedPronoun =
      expectedPronounMap[
        conditionSubject
      ];

    const expectedPossessive =
      expectedPossessiveMap[
        expectedPronoun
      ];

    if (
      !expectedPronoun ||
      !expectedPossessive ||
      improvePronoun !== expectedPronoun ||
      lotPossessive !== expectedPossessive
    ) {
      return false;
    }

    const conditionIsThirdSingular =
      conditionSubject === 'he' ||
      conditionSubject === 'she';

    if (
      feelVerb === 'feels' &&
      !conditionIsThirdSingular
    ) {
      return false;
    }

    if (
      feelVerb === 'feel' &&
      conditionIsThirdSingular
    ) {
      return false;
    }

    if (
      effortPossessive &&
      effortPossessive !==
        expectedPossessive
    ) {
      return false;
    }

    if (shapePronoun) {
      if (
        shapePronoun !== expectedPronoun ||
        destinyPossessive !==
          expectedPossessive ||
        shapeAbility !== improveAbility
      ) {
        return false;
      }

      if (
        wayPronoun &&
        wayPronoun !== expectedPronoun
      ) {
        return false;
      }

      const wayIsThirdSingular =
        expectedPronoun === 'he' ||
        expectedPronoun === 'she';

      if (
        likeVerb === 'likes' &&
        !wayIsThirdSingular
      ) {
        return false;
      }

      if (
        likeVerb === 'like' &&
        wayIsThirdSingular
      ) {
        return false;
      }
    }

    return true;
  })();

  if (
    isTwoProGandhiIndependenceSentenceV1366
  ) {
    return true;
  }

  // ================================================================
  // ☆ TwoPro v13.68-safe: lend + 간접목적어 + book(s) 문장 판별
  // ================================================================
  // lend/lends/lent는 기존 일반 술어 목록에 없으므로,
  // 아래 제한된 4형식 문형을 반드시 /api/translate-en-ko로 전달합니다.
  // 실제 번역과 수·인칭·관사 검증은 route.ts의 v13.68 처리기가 담당합니다.
  const isTwoProLendBooksSentenceV1368 = (() => {
    const match = text.match(
      /^(I|We|You|He|She|They)\s+(lend|lends|lent|will\s+lend)\s+((?:(?:a|the)\s+citizens?)|citizens|me|us|you|him|her|them)\s+((?:many\s+books)|(?:(?:a|the|my|our|your|his|her|their)\s+books?)|books)(?:\s+during\s+(?:this|that|the)\s+(?:reading\s+)?week)?[.!?]?$/i
    );

    if (!match) {
      return false;
    }

    const subject = String(match[1] || '')
      .toLowerCase()
      .trim();

    const predicate = String(match[2] || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const recipient = String(match[3] || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const directObject = String(
      match[4] || ''
    )
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const subjectIsThirdSingular =
      subject === 'he' ||
      subject === 'she';

    if (predicate === 'lends') {
      if (!subjectIsThirdSingular) {
        return false;
      }
    } else if (predicate === 'lend') {
      if (subjectIsThirdSingular) {
        return false;
      }
    }

    const citizenMatch = recipient.match(
      /^(?:(a|the)\s+)?(citizen|citizens)$/
    );

    if (citizenMatch) {
      const determiner = String(
        citizenMatch[1] || ''
      )
        .toLowerCase()
        .trim();

      const isPlural =
        String(citizenMatch[2] || '')
          .toLowerCase() === 'citizens';

      if (!determiner && !isPlural) {
        return false;
      }

      if (determiner === 'a' && isPlural) {
        return false;
      }
    }

    const bookMatch = directObject.match(
      /^(a|the|my|our|your|his|her|their)\s+(book|books)$/
    );

    if (
      bookMatch &&
      String(bookMatch[1] || '')
        .toLowerCase() === 'a' &&
      String(bookMatch[2] || '')
        .toLowerCase() === 'books'
    ) {
      return false;
    }

    return true;
  })();

  if (isTwoProLendBooksSentenceV1368) {
    return true;
  }

  // ================================================================
  // ☆ TwoPro v13.71-safe: build + 간접목적어 + house(s) 문장 판별
  // ================================================================
  // build/builds/built가 일반 영어 술어 목록에 없어도,
  // 아래 제한된 4형식 문형은 반드시 /api/translate-en-ko로 전달합니다.
  // 실제 번역과 수·인칭·관사 검증은 route.ts의 v13.71 처리기가 담당합니다.
  const isTwoProBuildHousesSentenceV1371 = (() => {
    const match = text.match(
      /^((?:(?:My|Our|Your|His|Her|Their|The)\s+(?:charitable\s+)?carpenters?)|I|We|You|He|She|They)\s+(build|builds|built|will\s+build)\s+((?:(?:(?:a|the)\s+)?(?:poor\s+)?citizens?(?:\s+without\s+(?:(?:a|the|my|our|your|his|her|their)\s+)?houses?)?)|me|us|you|him|her|them)\s+((?:(?:a|the|my|our|your|his|her|their|many)\s+)?(?:grand\s+)?houses?)(?:\s+in\s+(?:this|that|the|my|our|your|his|her|their)\s+(?:silent\s+)?(?:valley|valleys))?[.!?]?$/i
    );

    if (!match) {
      return false;
    }

    const subject = String(match[1] || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const predicate = String(match[2] || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const recipient = String(match[3] || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const directObject = String(match[4] || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const subjectIsThirdSingular =
      subject === 'he' ||
      subject === 'she' ||
      /^(?:my|our|your|his|her|their|the)\s+(?:charitable\s+)?carpenter$/.test(
        subject
      );

    if (
      predicate === 'builds' &&
      !subjectIsThirdSingular
    ) {
      return false;
    }

    if (
      predicate === 'build' &&
      subjectIsThirdSingular
    ) {
      return false;
    }

    const citizenMatch = recipient.match(
      /^(?:(a|the)\s+)?(?:poor\s+)?(citizen|citizens)(?:\s+without\s+(?:(a|the|my|our|your|his|her|their)\s+)?(house|houses))?$/
    );

    if (citizenMatch) {
      const citizenDeterminer = String(
        citizenMatch[1] || ''
      )
        .toLowerCase()
        .trim();

      const citizenIsPlural =
        String(citizenMatch[2] || '')
          .toLowerCase() === 'citizens';

      const withoutDeterminer = String(
        citizenMatch[3] || ''
      )
        .toLowerCase()
        .trim();

      const withoutHouse = String(
        citizenMatch[4] || ''
      )
        .toLowerCase()
        .trim();

      if (
        !citizenDeterminer &&
        !citizenIsPlural
      ) {
        return false;
      }

      if (
        citizenDeterminer === 'a' &&
        citizenIsPlural
      ) {
        return false;
      }

      if (withoutHouse) {
        const withoutIsPlural =
          withoutHouse === 'houses';

        if (
          !withoutDeterminer &&
          !withoutIsPlural
        ) {
          return false;
        }

        if (
          withoutDeterminer === 'a' &&
          withoutIsPlural
        ) {
          return false;
        }
      }
    }

    const houseMatch = directObject.match(
      /^(?:(a|the|my|our|your|his|her|their|many)\s+)?(?:grand\s+)?(house|houses)$/
    );

    if (!houseMatch) {
      return false;
    }

    const houseDeterminer = String(
      houseMatch[1] || ''
    )
      .toLowerCase()
      .trim();

    const houseIsPlural =
      String(houseMatch[2] || '')
        .toLowerCase() === 'houses';

    if (
      !houseDeterminer &&
      !houseIsPlural
    ) {
      return false;
    }

    if (
      houseDeterminer === 'a' &&
      houseIsPlural
    ) {
      return false;
    }

    if (
      houseDeterminer === 'many' &&
      !houseIsPlural
    ) {
      return false;
    }

    return true;
  })();

  if (isTwoProBuildHousesSentenceV1371) {
    return true;
  }

  // ================================================================
  // ☆ TwoPro v13.73-safe: consider + king 목적보어 문장 판별
  // ================================================================
  // Many people/People처럼 일반 대명사로 시작하지 않는 주어와
  // consider/considers/considered 및 제한적 교정 후보를
  // 반드시 /api/translate-en-ko로 전달합니다.
  // 실제 번역·교정·수·인칭 검증은 route.ts가 담당합니다.
  const isTwoProConsiderKingSentenceV1373 =
    /^(Many\s+people|People|I|We|You|He|She|They)\s+(consider|considers|considered|will\s+consider|will\s+considered|will\s+considers)\s+(King\s+Sejong|Sejong|me|us|you|him|her|them)\s+((?:a\s+king)|(?:the\s+(?:greatest\s+)?king)|(?:(?:my|our|your|his|her|their)\s+(?:greatest\s+)?kings?)|(?:the\s+(?:greatest\s+)?kings)|kings)[.!?]?$/i.test(
      text
    );

  if (isTwoProConsiderKingSentenceV1373) {
    return true;
  }

  const hasEnglishPredicate =
    /\b(am|is|are|was|were|be|been|being|do|does|did|have|has|had|can|could|will|would|shall|should|may|might|must|cannot|couldnot|need|needs|needed|want|wants|wanted|like|likes|liked|love|loves|loved|know|knows|knew|think|thinks|thought|go|goes|went|get|gets|got|getting|gather|gathers|gathered|gathering|come|comes|came|check|checks|checked|show|shows|showed|tell|tells|told|teach|teaches|taught|teaching|give|gives|gave|take|takes|took|make|makes|made|find|finds|found|help|helps|helped|hear|hears|heard|hearing|thank|thanks|please|let|lets|look|looks|stop|stops|wait|waits|try|tries|tried|use|uses|used|work|works|worked|sell|sells|sold|selling|sing|sings|sang|play|plays|played|playing|visit|visits|visited|visiting|live|lives|lived|stay|stays|stayed|feel|feels|felt|seem|seems|seemed|mean|means|meant|ask|asks|asked|buy|buys|bought|break|breaks|broke|breaking|bring|brings|brought|send|sends|sent|call|calls|called|open|opens|opened|close|closes|closed|start|starts|started|finish|finishes|finished|lose|loses|lost|meet|meets|met|devote|devotes|devoted|remember|remembers|remembered|remembering|plant|plants|planted|planting|laugh|laughs|laughed|throw|throws|threw|throwing|ride|rides|rode|riding)\b/i.test(
      lowerText
    );

  const commonExpression =
    /^(thank you|thanks|thanks a lot|good morning|good afternoon|good evening|good night)[.!?]?$/i.test(
      text
    );

  const startsLikeSentence =
    /^(i|you|he|she|it|we|they|there|this|that|these|those|who|what|when|where|why|how|please|let's)\b/i.test(
      text
    );

  return (
    commonExpression ||
    hasEnglishPredicate ||
    (
      englishWords.length >= 3 &&
      startsLikeSentence &&
      /[.!?]$/.test(text)
    )
  );
};

  export default function SearchPage({
  query,
  results = [],
  orangeKeys = [],
  blueKeys = [],
  isApp = false,
  isSentenceSearch = false,
  popularSearches = [],
  recentSearches = [],
  isPartialMatch = false,
  matchedKeywords = [],
}: SearchPageProps) {
const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const [clientIsApp, setClientIsApp] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const [isMobileWeb, setIsMobileWeb] = useState(false);
  const [supabase] = useState(() => createClientComponentClient());

  const [aiTranslation, setAiTranslation] = useState<string | null>(null);
  const [aiTranslationEngine, setAiTranslationEngine] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{ko: string, en: string}[] | null>(null);
  
  // 🌟 [수프로 엣지] 백엔드에서 보낸 '참고용' 비밀 신호를 담을 상태 추가!
  const [isReference, setIsReference] = useState<boolean>(false);

  // 문형·구 번역 결과를 번역 블록 아래에 표시할 참고 표현
  const [referenceWords, setReferenceWords] = useState<
    TranslationReferenceWord[]
  >([]);

  // ================================================================
  // ☆ TwoPro v1.13 — Slot Similarity Tier 3 "유사 문형 참고"
  //
  // 사용자 문장을 새로 생성 번역하지 않고,
  // 서버가 선택한 기존 슬롯 규칙 + 기존 번역 템플릿만 표시합니다.
  // ================================================================
  const [
    slotSimilarityReference,
    setSlotSimilarityReference,
  ] = useState<
    SlotSimilarityTier3Reference | null
  >(null);

  // ☆ TwoPro v13.70: 문법 교정이 적용된 정규 영어 문장
  const [correctedEnglish, setCorrectedEnglish] = useState<
    string | null
  >(null);

  // 🌟 번역 결과 박스 전용 마이크 상태
  const [isBoxListening, setIsBoxListening] = useState(false);
  const [boxMicLang, setBoxMicLang] = useState<'ko-KR' | 'en-US' | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || '';
      const isNativeEnv = Capacitor.isNativePlatform() || ua.includes('wv') || ua.includes('Capacitor');
      if (isNativeEnv) setClientIsApp(true);
    }
    const fetchPreview = async () => {
      const { data } = await supabase.from('conversation_lines').select('*').order('created_at', { ascending: false }).limit(3);
      if (data) setPreviewData(data);
    };
    fetchPreview();
  }, [supabase]);

  // 🌟 [수프로 마법] 2. 번역 API 지능형 라우팅
// 단어·전문용어는 번역 블록을 만들지 않고,
// 문장형 검색어만 한영·영한 번역 API로 보냅니다.
useEffect(() => {
  const normalizedQuery = String(query || '').trim();

  const clearTranslationBox = () => {
    setAiTranslation(null);
    setAiTranslationEngine(null);
    setAiAnalysis(null);
    setIsReference(false);
    setReferenceWords([]);
    setCorrectedEnglish(null);
  };

  const hasKorean =
    /[가-힣]/.test(normalizedQuery);

  const sentenceLike =
    isSentenceLikeQuery(normalizedQuery);

  const koreanWordCount = hasKorean
    ? normalizedQuery
        .replace(/[.!?]+$/g, '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length
    : 0;

  // PHRASES 파일의 구를 확인하기 위해 한국어 한 어절 이상도
  // translate-search API에 보냅니다.
  // 단, 응답 단계에서 PHRASES 직접 번역이 아닐 경우에는
  // 일반 단어·전문용어 번역 블록을 표시하지 않습니다.
  // 한 어절이라도 PHRASES에 정확히 등록되어 있을 수 있으므로
  // 한국어 검색어는 translate-search API에 확인 요청을 보냅니다.
  // 화면에는 PHRASES 직접 번역 결과일 때만 표시합니다.
  const phraseCandidate =
    hasKorean &&
    koreanWordCount >= 1;

  // ================================================================
  // ☆ TwoPro v1.7-safe: common verbs 단일 영어 동사 probe
  //
  // 기존에는 영어 한 단어가 isSentenceLikeQuery()에서 false가 되어
  // /api/translate-en-ko에 도달하지 못했습니다.
  //
  // 영어 한 단어는 서버에 확인 요청만 보내고,
  // 실제 화면 표시는 common-verbs-en-ko-exact 엔진일 때만 허용합니다.
  // 따라서 일반 사전 단어/전문용어가 파란 번역 블록으로 승격되지 않습니다.
  // ================================================================
  const commonVerbEnglishProbeCandidate =
    !hasKorean &&
    /^[A-Za-z][A-Za-z'’-]*$/u.test(
      normalizedQuery
    );

  // ================================================================
  // ☆ TwoPro v1.8-additive-safe: common adjectives degree probe
  //
  // 기존 commonVerbEnglishProbeCandidate는 그대로 보존합니다.
  // 영어 단일 형용사는 이미 위 단일어 probe를 통과하므로,
  // 여기서는 more/most + adjective 두 어절만 추가로 API에 보냅니다.
  // 실제 화면 표시는 common-adjectives SAFE direct engine일 때만 허용합니다.
  // ================================================================
  const commonAdjectiveDegreeEnglishProbeCandidate =
    !hasKorean &&
    /^(?:more|most)\s+[A-Za-z][A-Za-z'’-]*$/iu.test(
      normalizedQuery
    );

  // ================================================================
  // ☆ TwoPro v1.10-safe: English PHRASES 2~6어절 probe
  //
  // book a seat / on the ground of처럼 문장 판별에는 걸리지 않지만
  // rules-en-ko-phrases.json exact key일 수 있는 영어 다어절 검색을
  // /api/translate-en-ko에 확인 요청합니다.
  //
  // 현재 영->한 PHRASES의 최대 영어 어절 수가 6이므로 2~6어절만
  // probe합니다. 실제 화면 표시는 기존 direct PHRASES/common engine
  // 판정을 그대로 사용하므로 일반 다어절 DB 결과가 파란 블록으로
  // 승격되지는 않습니다.
  // ================================================================
  const commonEnglishPhraseWords =
    !hasKorean
      ? normalizedQuery.match(
          /[A-Za-z]+(?:['’-][A-Za-z]+)*/g
        ) || []
      : [];

  const commonEnglishPhraseProbeCandidate =
    !hasKorean &&
    commonEnglishPhraseWords.length >= 2 &&
    commonEnglishPhraseWords.length <= 6;

  // ================================================================
  // ☆ TwoPro v1.3-safe:
  // translate-search API가 참고 문장을 반환하지 못하더라도,
  // 이미 검색된 일반 결과 중 가장 가까운 한·영 병렬문장을
  // 번역 블록의 '참고 문장'으로 사용하는 2차 안전 경로입니다.
  // ================================================================
  const applyGeneralResultReference = (): boolean => {
    if (!sentenceLike || !hasKorean) {
      return false;
    }

    const normalizedNeedle = normalizedQuery
      .replace(/[.!?]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const bilingualResults = results.filter(
      (item) => {
        const lineText = String(
          item?.line_text || ''
        ).trim();

        return (
          lineText.length > 0 &&
          /[가-힣]/u.test(lineText) &&
          /[A-Za-z]/.test(lineText)
        );
      }
    );

    const matchedResult =
      bilingualResults.find((item) => {
        const normalizedLine = String(
          item?.line_text || ''
        )
          .replace(/\s+/g, ' ')
          .trim();

        return (
          normalizedNeedle.length > 0 &&
          normalizedLine.includes(
            normalizedNeedle
          )
        );
      }) ||
      bilingualResults[0];

    const fallbackText = String(
      matchedResult?.line_text || ''
    ).trim();

    if (!fallbackText) {
      return false;
    }

    setAiTranslation(fallbackText);
    setAiAnalysis(null);
    setIsReference(true);
    setReferenceWords([]);
    setCorrectedEnglish(null);

    return true;
  };

  if (
    normalizedQuery.length < 2 ||
    (
      !sentenceLike &&
      !phraseCandidate &&
      !commonVerbEnglishProbeCandidate &&
      !commonEnglishPhraseProbeCandidate &&
      !commonAdjectiveDegreeEnglishProbeCandidate
    )
  ) {
    clearTranslationBox();
    return;
  }

  const controller = new AbortController();

  const endpoint = hasKorean
    ? '/api/translate-search'
    : '/api/translate-en-ko';

  // 이전 검색 결과가 잠시 남는 현상 방지
  clearTranslationBox();

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: normalizedQuery,
    }),
    signal: controller.signal,
    cache: 'no-store',
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.ok && data.best) {
        const responseEngine =
          String(
            data.best.engine || ''
          );

        const isDirectPhraseResult =
          responseEngine ===
            'phrases-en-ko-exact-v13.75' ||
          responseEngine.startsWith(
            'phrase-sequence-ko-en-'
          ) ||
          (
            data.best.phraseApplied === true &&
            String(
              data.best.baseEngine || ''
            ).startsWith(
              'phrase-sequence-ko-en-'
            )
          );

        // ============================================================
        // ☆ TwoPro v1.7-safe: common verbs 직접 결과 표시 허용
        //
        // - EN->KO: common-verbs-en-ko-exact-v13.79
        // - KO->EN: common-verbs-ko-en-exact-v9.84
        //
        // 위 두 엔진만 비문장 단일어의 파란 번역 블록을 허용합니다.
        // DB exact/reference, 일반 rules, EN_LEMMA_ONLY fallthrough는
        // 기존 단어 검색 화면을 유지하도록 여기서 허용하지 않습니다.
        // ============================================================
        const isDirectCommonVerbResult =
          responseEngine ===
            'common-verbs-en-ko-exact-v13.79' ||
          responseEngine ===
            'common-verbs-ko-en-exact-v9.84';

        // ============================================================
        // ☆ TwoPro v1.8-additive-safe: common adjectives 직접 결과 표시
        //
        // 기존 common verbs 표시 조건은 그대로 보존합니다.
        // SAFE common adjective exact engine 두 개만 추가로 허용합니다.
        // CONTEXT / DB / 일반 rules 결과는 기존 단어 검색 화면을 유지합니다.
        // ============================================================
        const isDirectCommonAdjectiveResult =
          responseEngine ===
            'common-adjectives-en-ko-exact-v13.80' ||
          responseEngine ===
            'common-adjectives-ko-en-exact-v9.85' ||
          responseEngine ===
            'common-adjectives-ko-en-exact-v9.86';

        // ============================================================
        // ☆ TwoPro v1.9-additive-safe: common nouns 직접 결과 표시
        //
        // 기존 common verbs/adjectives 표시 조건은 그대로 보존합니다.
        // SAFE whole-input common noun exact engine 두 개만 추가 허용합니다.
        // CONTEXT / DB / 일반 rules 결과는 기존 단어 검색 화면을 유지합니다.
        // ============================================================
        const isDirectCommonNounResult =
          responseEngine ===
            'common-nouns-en-ko-exact-v13.81' ||
          responseEngine ===
            'common-nouns-ko-en-exact-v9.87';


        // ============================================================
        // ☆ TwoPro v1.12-additive-safe: common adverbs 직접 결과 표시
        //
        // 기존 verb/adjective/noun 표시 조건은 그대로 보존합니다.
        // SAFE common adverb exact engine 두 개만 추가 허용합니다.
        // CONTEXT / cross-POS / DB / 일반 rules 결과는 기존 화면을 유지합니다.
        // ============================================================
        const isDirectCommonAdverbResult =
          responseEngine ===
            'common-adverbs-en-ko-exact-v13.83' ||
          responseEngine ===
            'common-adverbs-ko-en-exact-v9.88';

        // ☆ TwoPro v1.14: Stage 8B Tier 2 안전 근접 슬롯 직접 결과
        const isDirectSlotSimilarityTier2Result =
          responseEngine ===
            'slot-similarity-tier2-safe-v1';

        // 문장이 아닌 한 어절·구 검색어는
        // PHRASES 직접 번역 또는 common-verbs SAFE 직접 번역일 때만
        // 파란 번역 블록을 표시합니다.
        if (
          !sentenceLike &&
          !isDirectPhraseResult &&
          !isDirectCommonVerbResult &&
          !isDirectCommonNounResult &&
          !isDirectCommonAdverbResult &&
          !isDirectCommonAdjectiveResult &&
          !isDirectSlotSimilarityTier2Result
        ) {
          clearTranslationBox();
          return;
        }

        const nextTargetText =
          String(
            data.best.target_text || ''
          ).trim();

        if (!nextTargetText) {
          if (!applyGeneralResultReference()) {
            clearTranslationBox();
          }
          return;
        }

        setAiTranslation(
          nextTargetText
        );

        setAiTranslationEngine(
          responseEngine || null
        );

        setAiAnalysis(
          data.best.analysis || null
        );

        setIsReference(
          Boolean(data.best.isReference)
        );

        const nextCorrectedEnglish =
          String(
            data.best.corrected_source_text || ''
          ).trim();

        setCorrectedEnglish(
          nextCorrectedEnglish &&
          nextCorrectedEnglish.toLowerCase() !==
            normalizedQuery.toLowerCase()
            ? nextCorrectedEnglish
            : null
        );

        const nextReferenceWords =
          Array.isArray(
            data.best.referenceWords
          )
            ? data.best.referenceWords
            : Array.isArray(
                data.referenceWords
              )
              ? data.referenceWords
              : [];

        setReferenceWords(
          nextReferenceWords
            .map((item: any) => ({
              source:
                String(
                  item?.source || ''
                ).trim(),
              selected:
                item?.selected
                  ? String(
                      item.selected
                    ).trim()
                  : null,
              candidates:
                Array.isArray(
                  item?.candidates
                )
                  ? [
                      ...new Set(
                        item.candidates
                          .map(
                            (candidate: any) =>
                              String(
                                candidate || ''
                              ).trim()
                          )
                          .filter(Boolean)
                      ),
                    ]
                  : [],
              slot:
                item?.slot
                  ? String(item.slot)
                  : undefined,
              confidence:
                Number.isFinite(
                  Number(
                    item?.confidence
                  )
                )
                  ? Number(
                      item.confidence
                    )
                  : undefined,
            }))
            .filter(
              (
                item:
                  TranslationReferenceWord
              ) =>
                item.source &&
                item.candidates.length > 0
            )
        );
      } else {
        if (!applyGeneralResultReference()) {
          clearTranslationBox();
        }
      }
    })
    .catch((error) => {
      if (error?.name === 'AbortError') {
        return;
      }

      if (!applyGeneralResultReference()) {
        clearTranslationBox();
      }
    });

  return () => {
    controller.abort();
  };
}, [query, results]);

  // ================================================================
  // ☆ TwoPro v1.13 — Tier 3 유사 문형 참고 전용 비차단 probe
  //
  // 기존 translate API와 독립적인 supplemental 요청입니다.
  // 실패/지연되어도 추천 문장 번역과 일반 검색 결과에는 영향이 없습니다.
  // 단일 단어는 보내지 않고 문장형 입력만 확인합니다.
  // ================================================================
  useEffect(() => {
    const normalizedQuery =
      String(query || '').trim();

    setSlotSimilarityReference(null);

    if (
      normalizedQuery.length < 2 ||
      !isSentenceLikeQuery(
        normalizedQuery
      )
    ) {
      return;
    }

    const controller =
      new AbortController();

    fetch(
      '/api/slot-similarity-reference',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          q: normalizedQuery,
        }),
        signal: controller.signal,
        cache: 'no-store',
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const reference =
          data?.ok
            ? data?.reference
            : null;

        if (
          !reference ||
          reference.referenceOnly !==
            true ||
          reference
            .generatedUserTranslation !==
            false ||
          String(
            reference.engine || ''
          ) !==
            'slot-similarity-tier3-reference-v1'
        ) {
          setSlotSimilarityReference(
            null
          );
          return;
        }

        const sourcePattern =
          String(
            reference.sourcePattern ||
              ''
          ).trim();

        const targetTemplate =
          String(
            reference.targetTemplate ||
              ''
          ).trim();

        if (
          !sourcePattern ||
          !targetTemplate
        ) {
          setSlotSimilarityReference(
            null
          );
          return;
        }

        setSlotSimilarityReference({
          direction:
            reference.direction ===
            'KO_EN'
              ? 'KO_EN'
              : 'EN_KO',
          sourcePattern,
          targetTemplate,
          patternScore:
            Number.isFinite(
              Number(
                reference.patternScore
              )
            )
              ? Number(
                  reference.patternScore
                )
              : undefined,
          patternMargin:
            Number.isFinite(
              Number(
                reference.patternMargin
              )
            )
              ? Number(
                  reference.patternMargin
                )
              : undefined,
          semanticSafety:
            reference.semanticSafety ===
              'PASS' ||
            reference.semanticSafety ===
              'REVIEW'
              ? reference.semanticSafety
              : undefined,
          budgetStatus:
            reference.budgetStatus,
          referenceOnly: true,
          generatedUserTranslation:
            false,
          engine:
            'slot-similarity-tier3-reference-v1',
        });
      })
      .catch((error) => {
        if (
          error?.name ===
          'AbortError'
        ) {
          return;
        }

        setSlotSimilarityReference(null);
      });

    return () => {
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobileWeb(window.innerWidth < 768);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayIsApp = isApp || clientIsApp;
  const displayQuery = (query || '').trim();
  const isTooShort = displayQuery.length > 0 && displayQuery.replace(/\s+/g, '').length < 2;

  const handleBookmarkClick = () => {
    if (typeof window === 'undefined') return;
    const userAgent = navigator.userAgent.toLowerCase();
    const isMac = userAgent.includes('mac');
    const isMobile = /iphone|ipad|ipod|android/.test(userAgent);
    if (displayIsApp) { alert('앱(App)에서는 이미 홈 화면에 설치되어 있습니다! 언제든 아이콘을 눌러 접속해주세요.'); return; }
    if (isMobile) alert('🌟 모바일 브라우저 환경입니다.\n화면 하단이나 상단 메뉴(⋮)에서 [⭐ 별 모양 아이콘]을 눌러 즐겨찾기에 추가해주세요!');
    else if (isMac) alert('🌟 Mac 환경입니다.\n키보드에서 [ Cmd + D ] 를 동시에 눌러 엑스딕을 즐겨찾기에 추가해주세요!');
    else alert('🌟 PC 환경입니다.\n키보드에서 [ Ctrl + D ] 를 동시에 눌러 엑스딕을 즐겨찾기에 추가해주세요!');
  };

  const safeOrangeKeys = useMemo(
    () => sanitizeHighlightKeys(orangeKeys || []),
    [orangeKeys]
  );

  const derivedBlueKeys = useMemo(() => {
    const keys: string[] = [];
    const lowerQuery = displayQuery.toLowerCase().trim();
    if (!lowerQuery) return keys;
    const stopWords = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    const queryTokens = lowerQuery.split(/\s+/).filter(t => t.length > 1 && !stopWords.has(t));
    const lowerQueryNoSpace = lowerQuery.replace(/\s+/g, '');
    results.forEach(item => {
      const text = item.line_text || '';
      const cleanText = text.replace(/[.,:;()\[\]?!"]/g, '');
      const words = cleanText.split(/\s+/).filter(Boolean);
      const engWords = words.filter(w => /^[a-zA-Z\-]+$/.test(w));
      const korWords = words.filter(w => /[가-힣]/.test(w));
      if (engWords.length > 0 && korWords.length > 0) {
          const engJoined = engWords.join('').toLowerCase();
          const korJoined = korWords.join('').toLowerCase();
          if (engJoined === lowerQueryNoSpace) korWords.forEach(kw => keys.push(kw));
          else if (korJoined === lowerQueryNoSpace) engWords.forEach(ew => keys.push(ew));
          else {
              if (engWords.length === 1) {
                  const ew = engWords[0].toLowerCase();
                  if (queryTokens.includes(ew) || ew === lowerQueryNoSpace) korWords.forEach(kw => keys.push(kw));
              }
              if (korWords.length === 1) {
                  const kw = korWords[0].toLowerCase();
                  if (queryTokens.includes(kw) || kw === lowerQueryNoSpace) engWords.forEach(ew => keys.push(ew));
              }
          }
      }
    });
    return sanitizeHighlightKeys(
      [...new Set(keys)]
    ).filter((blueKey) => {
      const lowerBlueKey =
        blueKey.toLocaleLowerCase();

      return !safeOrangeKeys.some(
        (orangeKey) =>
          orangeKey.toLocaleLowerCase() ===
          lowerBlueKey
      );
    });
  }, [displayQuery, results, safeOrangeKeys]);

  const UnifiedHeader = () => (
    <header className="w-full pt-8 pb-0 md:pt-12 md:pb-0">
      <div className="flex flex-col items-center justify-center text-center gap-2 mb-6 px-1 w-full">
        <a href={displayIsApp ? '/app' : '/'} className="cursor-pointer mb-2">
          <Image src="/images/LOGO_01_ChatGPT_S.jpg" alt="X-DIC Logo" width={140} height={70} className="object-contain hover:opacity-90 transition-opacity" priority />
        </a>
        <a href={displayIsApp ? '/app' : '/'} className="cursor-pointer hover:opacity-80 transition-opacity">
          <h1 className="text-[22px] md:text-[26px] font-extrabold text-slate-800 leading-tight">한영/영한사전 – 복합어(합성어) 전문 엑스딕!</h1>
        </a>
        <div className="flex flex-col items-center w-full mt-1 mb-2">
          <p className="text-[11px] md:text-[13px] text-slate-400 font-semibold mb-3">Korean-English/English-Korean Dictionary – Compound Terminology</p>
          <div className="w-full max-w-[95%] md:max-w-3xl bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 md:py-3 shadow-sm">
            <p className="text-[12px] md:text-[14px] text-slate-700 font-bold leading-snug break-keep text-center">
              <span className="text-blue-600 mr-1">💡 전문용어 검색 특화:</span>
              의학용어 · 교육용어 · 기계용어 · 무역경제용어 · 자동차용어 · 전자용어 · 컴퓨터용어 등
            </p>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-medium leading-tight mt-1.5 px-2 break-keep text-center">
              Specialized search for terminology such as medical, educational, mechanical, trade, economic, automobile, electronic, computer, etc.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full">
        <SearchInput initialQuery={displayQuery} isApp={displayIsApp} autoFocus={!displayQuery} />
        {displayIsApp && (
          <div className="flex justify-end max-w-2xl mx-auto mt-2 mb-6 px-4 animate-in fade-in duration-500">
            <a href="/app/waggle" className="animate-bounce bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black px-6 py-2.5 rounded-full shadow-lg border-2 border-white text-sm flex items-center gap-2 hover:scale-105 transition-transform">
              <span className="text-xl">💬</span> 평가단 와글와글 입장!
            </a>
          </div>
        )}
        {mounted && !displayIsApp && <TodaysConversation />}
        {mounted && displayIsApp && <AppTodaysConversation />}
      </div>
    </header>
  );

  const getSearchUrl = (keyword: string) => displayIsApp ? `/app?q=${encodeURIComponent(keyword)}` : `/?q=${encodeURIComponent(keyword)}`;

  useEffect(() => setCurrentPage(1), [results, query]);

// ==========================================
// 화면에 표시할 검색 결과 정리
// category_id 0은 번역 말뭉치 전용이므로
// 일반 검색 결과 목록에서는 숨깁니다.
// ==========================================
const displayResults = React.useMemo(() => {
  const categoryCount: Record<number, number> = {};

  return results.filter((item) => {
    const catId =
      item.category_id !== null &&
      item.category_id !== undefined
        ? Number(item.category_id)
        : 12;

    // 기초영어 말뭉치는 번역 엔진에서만 사용하고
    // 검색 결과 목록에는 표시하지 않습니다.
    if (catId === 0) {
      return false;
    }

    categoryCount[catId] =
      (categoryCount[catId] || 0) + 1;

    // 각 표시 카테고리에서 최대 5개
    return categoryCount[catId] <= 5;
  });
}, [results]);

  const handleExternalSearch = (site: 'google' | 'naver') => {
    if (!displayQuery) return;
    const encoded = encodeURIComponent(displayQuery);
    const url = site === 'google' ? `https://www.google.com/search?q=${encoded}` : `https://en.dict.naver.com/#/search?query=${encoded}`;
    window.open(url, '_blank');
  };

  const getCategoryName = (id: number) => CATEGORY_NAMES[id] || '기타(Other Terms)';

  const highlightMatch = (text: string) => {
    const normalizedText =
      String(text || '').normalize('NFC');

    const safeBlueKeys =
      sanitizeHighlightKeys(derivedBlueKeys);

    const allKeys = sanitizeHighlightKeys([
      ...safeOrangeKeys,
      ...safeBlueKeys,
    ]);

    if (allKeys.length === 0) {
      return (
        <span
          style={{
            color: '#334155',
            fontWeight: 400,
          }}
        >
          {normalizedText}
        </span>
      );
    }

    const orangeKeySet = new Set(
      safeOrangeKeys.map((key) =>
        key.toLocaleLowerCase()
      )
    );

    const blueKeySet = new Set(
      safeBlueKeys.map((key) =>
        key.toLocaleLowerCase()
      )
    );

    const escapedRegexParts =
      allKeys.map((key) => {
        const escaped =
          escapeHighlightRegExp(key);

        // 영어는 단어 경계를 적용하고,
        // 한국어는 '자료'가 '자료를' 안에서도 대응되도록 부분 일치를 허용합니다.
        return /[가-힣]/u.test(key)
          ? escaped
          : `\\b${escaped}\\b`;
      });

    const regex = new RegExp(
      `(${escapedRegexParts.join('|')})`,
      'giu'
    );

    const parts = normalizedText.split(regex);

    return (
      <>
        {parts.map((part, idx) => {
          const comparePart =
            normalizeHighlightKey(
              part
            ).toLocaleLowerCase();

          let color = '#334155';

          if (orangeKeySet.has(comparePart)) {
            color = '#ea580c';
          } else if (
            blueKeySet.has(comparePart)
          ) {
            color = '#2563eb';
          }

          return (
            <span
              key={idx}
              style={{
                color,
                fontWeight: 400,
              }}
            >
              {part}
            </span>
          );
        })}
      </>
    );
  };

  const handleCopy = async (text: string, id: string | number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      alert('복사 기능을 지원하지 않는 기기입니다.');
    }
  };

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const voices = window.speechSynthesis.getVoices();
      const enVoices = voices.filter(v => v.lang.startsWith('en'));
      const koVoices = voices.filter(v => v.lang.startsWith('ko'));
      const enVoice = enVoices.find(v => v.name.includes('Google US English Male')) || enVoices.find(v => v.name.includes('Google US English')) || enVoices[0];
      const koVoice = koVoices.find(v => v.name.includes('Google') && v.name.includes('Male')) || koVoices[0];
      const parts: { lang: string; text: string }[] = [];
      let currentLang = /[a-zA-Z]/.test(text.charAt(0)) ? 'en' : 'ko'; 
      let currentText = '';
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[a-zA-Z]/.test(char)) {
          if (currentLang !== 'en' && currentText.trim().length > 0) { parts.push({ lang: currentLang, text: currentText }); currentText = ''; }
          currentLang = 'en'; currentText += char;
        } else if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(char)) {
          if (currentLang !== 'ko' && currentText.trim().length > 0) { parts.push({ lang: currentLang, text: currentText }); currentText = ''; }
          currentLang = 'ko'; currentText += char;
        } else {
          currentText += char;
        }
      }
      if (currentText.trim().length > 0) parts.push({ lang: currentLang, text: currentText });
      parts.forEach((part) => {
        if (!/[a-zA-Z가-힣0-9]/.test(part.text)) return; 
        const utterance = new SpeechSynthesisUtterance(part.text);
        if (part.lang === 'ko') {
          if (koVoice) utterance.voice = koVoice;
          utterance.lang = koVoice ? koVoice.lang : 'ko-KR';
          utterance.pitch = 1.0; utterance.rate = 1.05; utterance.volume = 1.0; 
        } else {
          if (enVoice) utterance.voice = enVoice;
          utterance.lang = enVoice ? enVoice.lang : 'en-US';
          utterance.pitch = 0.9; utterance.rate = 0.85; utterance.volume = 0.75; 
        }
        window.speechSynthesis.speak(utterance);
      });
    } else {
      alert('이 브라우저는 음성 듣기를 지원하지 않습니다.');
    }
  };

  // 🌟 번역 박스 전용 단발성 마이크 검색 로직
  const handleBoxVoiceSearch = async (lang: 'ko-KR' | 'en-US') => {
    if (isBoxListening) return;
    setBoxMicLang(lang);
    setIsBoxListening(true);

    const isNative = Capacitor.isNativePlatform();
    const basePath = displayIsApp ? '/app' : '/';

    if (isNative) {
      try {
        const { available } = await SpeechRecognition.available();
        if (!available) {
          alert('이 기기에서는 음성 인식을 사용할 수 없습니다.');
          setIsBoxListening(false);
          setBoxMicLang(null);
          return;
        }

        let perm = await SpeechRecognition.checkPermissions();
        if (perm.speechRecognition !== 'granted') {
          perm = await SpeechRecognition.requestPermissions();
        }

        if (perm.speechRecognition !== 'granted') {
          alert('마이크 권한이 필요합니다. 설정에서 권한을 허용해주세요.');
          setIsBoxListening(false);
          setBoxMicLang(null);
          return;
        }

        const result = await SpeechRecognition.start({
          language: lang,
          maxResults: 1,
          partialResults: false,
          popup: false,
        });

        let transcript = String(result?.matches?.[0] || '').trim().replace(/[.,?!]/g, '');
        setIsBoxListening(false);
        setBoxMicLang(null);

        if (transcript) {
          router.push(`${basePath}?q=${encodeURIComponent(transcript)}`);
        }
      } catch (e: any) {
        setIsBoxListening(false);
        setBoxMicLang(null);
        const msg = String(e?.message || e || '').toLowerCase();
        if (msg.includes('denied') || msg.includes('permission')) {
          alert('마이크 권한이 차단되었습니다. 설정에서 허용해주세요.');
        }
      }
    } else {
      const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!Ctor) {
        alert('이 브라우저는 음성 인식을 지원하지 않습니다. (Chrome 브라우저 권장)');
        setIsBoxListening(false);
        setBoxMicLang(null);
        return;
      }

      const recognition = new Ctor();
      recognition.lang = lang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        setIsBoxListening(false);
        setBoxMicLang(null);
        const transcript = String(event?.results?.[0]?.[0]?.transcript || '').trim();
        if (transcript) {
          router.push(`${basePath}?q=${encodeURIComponent(transcript)}`);
        }
      };

      recognition.onerror = (e: any) => {
        setIsBoxListening(false);
        setBoxMicLang(null);
        if (e.error === 'not-allowed') {
          alert('마이크 권한이 차단되었습니다. 브라우저 설정에서 마이크를 허용해주세요.');
        }
      };

      recognition.onend = () => {
        setIsBoxListening(false);
        setBoxMicLang(null);
      };

      try {
        recognition.start();
      } catch {
        setIsBoxListening(false);
        setBoxMicLang(null);
      }
    }
  };

  const indexOfLastItem =
    currentPage * itemsPerPage;

  const indexOfFirstItem =
    indexOfLastItem - itemsPerPage;

  const currentItems =
    displayResults.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

  const totalPages =
    Math.ceil(
      displayResults.length /
        itemsPerPage
    );

  const handlePageChange = (
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-none w-full max-w-4xl mx-auto px-4 md:px-6">
        {!displayQuery && <UnifiedHeader />}
        {displayQuery && (
          <header className={`w-full ${displayIsApp ? 'pt-8 pb-0' : 'pt-8 pb-0 md:pt-12 md:pb-0'}`}>
            <div className="flex items-center justify-between w-full mb-6 px-1">
              <button onClick={() => router.back()} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                뒤로
              </button>
              <a href={displayIsApp ? '/app' : '/'} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                홈으로
              </a>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-5 text-center w-full">
                <div className="flex-shrink-0 mb-2 md:mb-0">
                    <a href={displayIsApp ? '/app' : '/'} className="cursor-pointer">
                        <Image src="/images/LOGO_01_ChatGPT_S.jpg" alt="X-DIC Logo" width={140} height={70} className="object-contain hover:opacity-90 transition-opacity" priority />
                    </a>
                </div>
                <div className="flex flex-col gap-1 w-full max-w-2xl items-center md:items-start">
                    <a href={displayIsApp ? '/app' : '/'} className="cursor-pointer hover:opacity-80 transition-opacity">
                        <h1 className="text-xl md:text-[24px] font-extrabold text-slate-800 leading-tight">한영/영한사전 – 복합어(합성어) 전문 엑스딕!</h1>
                    </a>
                    <p className="text-[11px] md:text-[13px] text-slate-400 font-semibold leading-tight hidden md:block mb-1">Korean-English/English-Korean Dictionary – Compound Terminology</p>
                    
                    <div className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 shadow-sm text-center md:text-left">
                        <p className="text-[11px] md:text-[13px] text-slate-700 font-bold leading-tight break-keep">
                            <span className="text-blue-600 mr-1">💡 전문용어 특화:</span>
                            의학용어 · 교육용어 · 기계용어 · 무역경제용어 · 자동차용어 · 전자용어 · 컴퓨터용어 등
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full">
              <SearchInput initialQuery={displayQuery} isApp={displayIsApp} autoFocus={!displayQuery} />
              
              {displayIsApp && (
                <div className="flex justify-end max-w-2xl mx-auto mt-2 mb-2 px-4 animate-in fade-in duration-500">
                  <a href="/app/waggle" className="animate-bounce bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black px-6 py-2.5 rounded-full shadow-lg border-2 border-white text-sm flex items-center gap-2 hover:scale-105 transition-transform">
                    <span className="text-xl">💬</span> 평가단 와글와글 입장!
                  </a>
                </div>
              )}
            </div>
          </header>
        )}
      </div>

      <main className="w-full flex-grow">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {displayQuery ? (
            <div className="w-full mt-0">
              
              {/* 🌟 앱 다운로드 안내 문구 (앱이 아닐 때만 노출) */}
              {!displayIsApp && (
                <div className="w-full mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 shadow-sm text-center">
                    <p className="text-[14px] md:text-[15px] font-bold text-slate-700 leading-snug break-keep">
                      📱 휴대폰 앱 다운방법: <span className="text-blue-600 font-extrabold">갤럭시폰</span>은 <span className="text-orange-500 font-extrabold">Play 스토어</span>에서, <span className="text-blue-600 font-extrabold">iPhone</span>은 <span className="text-orange-500 font-extrabold">App Store</span>에서 <span className="text-purple-600 font-extrabold">x-dic</span>으로 검색!
                    </p>
                  </div>
                </div>
              )}

              {isTooShort ? (
                <div className="py-32 text-center text-slate-400 text-xl font-light italic animate-in fade-in slide-in-from-bottom-2 duration-300">
                  단어는 <span style={{ color: '#ea580c', fontWeight: 'bold' }}>두 글자 이상</span> 입력해 주세요.
                </div>
              ) : (
                displayResults.length > 0 ||
                Boolean(aiTranslation) ||
                Boolean(slotSimilarityReference)
              ) ? (
                <div className="space-y-6">

                  {/* 🌟 [수프로 마법] 번역 박스 + 스피커 및 검색 문장 표시 UI 반영 */}
                  {aiTranslation && (
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-4 mb-5 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl drop-shadow-sm">✨</span>
                        <h3 className="text-blue-800 font-extrabold text-[16px] md:text-lg tracking-tight"> 추천 문장 번역</h3>
                      </div>
                      
                      <div className="flex flex-col gap-2.5 pl-1 mb-0">
                        {/* 🌟 1. 사용자가 검색한 내용 표시 */}
                        <div className="flex items-start gap-3">
                          <span className="text-[13px] md:text-[15px] font-bold text-blue-700/80 whitespace-nowrap mt-1">검색 내용:</span>
                          <p className="text-[16px] md:text-[18px] font-bold text-slate-800 leading-snug flex-1">{displayQuery}</p>
                          
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {/* 스피커 버튼 (발음 듣기) */}
                            <button onClick={() => handleSpeak(displayQuery)} className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm" title="발음 듣기">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM14 10a4.002 4.002 0 00-1.172-2.828.75.75 0 10-1.06 1.06c.586.586.914 1.378.914 2.207s-.328 1.62-.914 2.207a.75.75 0 101.06 1.06A4.002 4.002 0 0014 10z" /></svg>
                            </button>
                            {/* 복사 버튼 */}
                            <button onClick={() => handleCopy(displayQuery, 'query')} className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all flex items-center justify-center shadow-sm" title="복사">
                              {copiedId === 'query' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-500"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {correctedEnglish && (
                          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2">
                            <span className="text-[13px] md:text-[15px] font-bold text-amber-700 whitespace-nowrap mt-0.5">
                              영어 교정:
                            </span>
                            <p className="text-[15px] md:text-[17px] font-bold text-slate-800 leading-snug flex-1">
                              {correctedEnglish}
                            </p>
                            <button
                              onClick={() =>
                                handleCopy(
                                  correctedEnglish,
                                  'corrected-english'
                                )
                              }
                              className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-slate-400 hover:bg-amber-100 hover:text-amber-700 transition-all flex items-center justify-center shadow-sm"
                              title="교정 문장 복사"
                            >
                              {copiedId ===
                              'corrected-english' ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 h-4 text-emerald-500"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2.5}
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        )}

                        {/* 🌟 2. 번역 결과 표시 (라벨 동적 변경) */}
                        <div className="flex items-start gap-3">
                          <span className={`text-[13px] md:text-[15px] font-bold whitespace-nowrap mt-1 ${isReference ? 'text-orange-600' : 'text-blue-700/80'}`}>
                            {isReference ? '참고 문장:' : '검색 결과:'}
                          </span>
                          <p className="text-[18px] md:text-[20px] font-black text-slate-900 leading-snug flex-1">{aiTranslation.replace(/\.{2,}/g, '.')}</p>
                          
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {/* 🌟 번역 결과 듣기(스피커) 버튼 */}
                            <button onClick={() => handleSpeak(aiTranslation)} className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm" title="발음 듣기">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM14 10a4.002 4.002 0 00-1.172-2.828.75.75 0 10-1.06 1.06c.586.586.914 1.378.914 2.207s-.328 1.62-.914 2.207a.75.75 0 101.06 1.06A4.002 4.002 0 0014 10z" /></svg>
                            </button>
                            {/* 복사 버튼 */}
                            <button onClick={() => handleCopy(aiTranslation.replace(/\.{2,}/g, '.'), 'translation')} className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all flex items-center justify-center shadow-sm" title="복사">
                              {copiedId === 'translation' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-500"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                    {aiTranslationEngine ===
                      'slot-similarity-tier2-safe-v1' && (
                      <p className="text-[12px] md:text-[13px] mt-3 pl-1 font-semibold text-emerald-700">
                        안전 기준을 통과한 근접 슬롯 문형으로 생성한 번역입니다.
                      </p>
                    )}

                    {referenceWords.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-blue-200/80 space-y-1.5">
                        {referenceWords.map((item, index) => {
                          const selected =
                            item.selected || '';

                          const orderedCandidates = [
                            selected,
                            ...item.candidates,
                          ].filter(
                            (
                              value,
                              candidateIndex,
                              values
                            ) =>
                              Boolean(value) &&
                              values.indexOf(value) ===
                                candidateIndex
                          );

                          return (
                            <div
                              key={`${item.source}-${index}`}
                              className="flex items-start gap-3 pl-1"
                            >
                              <span className="text-[12px] md:text-[13px] font-bold text-emerald-700 whitespace-nowrap mt-0.5">
                                참고 표현:
                              </span>

                              <p className="text-[13px] md:text-[15px] text-slate-700 leading-relaxed flex-1 break-words">
                                <span className="font-extrabold text-slate-900">
                                  {item.source}
                                </span>
                                <span className="mx-1.5 text-slate-400">
                                  →
                                </span>
                                {orderedCandidates.map(
                                  (
                                    candidate,
                                    candidateIndex
                                  ) => (
                                    <React.Fragment
                                      key={`${candidate}-${candidateIndex}`}
                                    >
                                      {candidateIndex > 0 && (
                                        <span className="text-slate-400">
                                          ,{' '}
                                        </span>
                                      )}
                                      <span
                                        className={
                                          candidate ===
                                          selected
                                            ? 'font-extrabold text-emerald-700'
                                            : 'font-medium text-slate-600'
                                        }
                                      >
                                        {candidate}
                                      </span>
                                    </React.Fragment>
                                  )
                                )}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {isReference && (
                      <p className="text-[12px] md:text-[13px] mt-4 pl-1 font-medium text-orange-600/80">
                        엑스딕이 추천하는 전문가 번역 데이터 중 가장 자연스러운 문장입니다.
                      </p>
                    )}
                  </div>
                )}

                  {slotSimilarityReference &&
                    aiTranslationEngine !==
                      'slot-similarity-tier2-safe-v1' && (
                    <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 mb-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">
                          💡
                        </span>
                        <h3 className="text-amber-800 font-extrabold text-[16px] md:text-lg tracking-tight">
                          유사 문형 참고
                        </h3>
                      </div>

                      <p className="text-[12px] md:text-[13px] text-amber-800/80 font-medium mb-3 leading-relaxed">
                        입력하신 문장과 구조가 비슷한 등록 문형입니다. 아래 내용은 확정 번역이 아니라 참고용입니다.
                      </p>

                      <div className="space-y-2 pl-1">
                        <div className="flex items-start gap-3">
                          <span className="text-[13px] md:text-[14px] font-bold text-amber-700 whitespace-nowrap mt-0.5">
                            등록 문형:
                          </span>
                          <p className="text-[15px] md:text-[17px] font-extrabold text-slate-800 leading-snug flex-1 break-words">
                            {slotSimilarityReference.sourcePattern}
                          </p>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="text-[13px] md:text-[14px] font-bold text-amber-700 whitespace-nowrap mt-0.5">
                            참고 번역:
                          </span>
                          <p className="text-[15px] md:text-[17px] font-bold text-slate-800 leading-snug flex-1 break-words">
                            {slotSimilarityReference.targetTemplate}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

{!aiTranslation &&
  isPartialMatch &&
  matchedKeywords.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl shadow-sm mb-4 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">💡</span>
                        <div>
                          <p className="text-[14px] md:text-[15px] font-bold text-slate-800 mb-1 leading-snug">입력하신 문장 전체와 정확히 일치하는 용어가 없습니다.</p>
                          <p className="text-[12px] md:text-[13px] text-slate-600">대신, 추출한 핵심 단어 <strong className="text-orange-600">"{matchedKeywords.join(', ')}"</strong> (이)가 포함된 결과를 찾아봤어요!</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-sm font-semibold text-slate-500">
                      {isSentenceSearch ? '관련 검색 결과' : '검색 결과'}{' '}
                      <span style={{ color: '#2563eb', fontWeight: 'bold' }}>
                        {displayResults.length}
                      </span>
                      건
                    </span>
                  </div>

                  <ul className="space-y-1.5">
                    {currentItems.map((item, idx) => (
                      <React.Fragment key={String(item.id || idx)}>
                        <li className="relative group bg-white rounded-lg px-3 py-2 md:px-4 md:py-2.5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                          <div className="flex items-start gap-2.5">
                            <div className="flex-shrink-0 flex items-center gap-1.5 mt-0.5">
                              {mounted && !displayIsApp && (
                                <button onClick={() => handleSpeak(item.line_text)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm" title="발음 듣기">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM14 10a4.002 4.002 0 00-1.172-2.828.75.75 0 10-1.06 1.06c.586.586.914 1.378.914 2.207s-.328 1.62-.914 2.207a.75.75 0 101.06 1.06A4.002 4.002 0 0014 10z" /></svg>
                                </button>
                              )}
                              <button onClick={() => handleCopy(item.line_text, item.id || idx)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all flex items-center justify-center shadow-sm" title="텍스트 복사">
                                {copiedId === (item.id || idx) ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-500"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
                                )}
                              </button>
                            </div>
                            <div className="flex-1 text-[16px] md:text-[18px] leading-snug break-keep pb-4 md:pb-5">
                              {highlightMatch(item.line_text)}
                            </div>
                          </div>
                          <div className="absolute bottom-1.5 right-2 md:bottom-2 md:right-3">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] md:text-[12px] tracking-tight shadow-sm" style={{ backgroundColor: '#d4b08c', color: '#ffffff', fontWeight: '600' }}>
                              {getCategoryName(item.category_id)}
                            </span>
                          </div>
                        </li>
                        {!displayIsApp && idx === Math.min(6, currentItems.length - 1) && (
                          <div className="w-full flex justify-center my-6">
                            <div className={`relative flex items-center justify-center w-full max-w-[728px] ${isMobileWeb ? 'min-h-[100px]' : 'min-h-[90px]'} bg-transparent rounded-lg overflow-hidden`}>
                              <div className="relative z-10 flex justify-center w-full overflow-x-auto max-w-full">
                                <KakaoAdFit key={isMobileWeb ? 'DAN-C5u8rkTg1BugPsOE' : 'DAN-Gui4SG5eMaraSbpv'} unit={isMobileWeb ? 'DAN-C5u8rkTg1BugPsOE' : 'DAN-Gui4SG5eMaraSbpv'} width={isMobileWeb ? '320' : '728'} height={isMobileWeb ? '100' : '90'} />
                              </div>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </ul>

                  {displayResults.length > itemsPerPage && (
                    <div className="flex justify-center items-center gap-3 mt-12 mb-12 select-none font-sans">
                      <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="text-xs font-bold text-slate-400 hover:text-orange-600 px-2 py-1 rounded transition-colors disabled:opacity-30">&lt;&lt;</button>
                      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="text-sm font-medium text-slate-500 hover:text-orange-600 px-2 py-1 transition-colors disabled:opacity-30">이전</button>
                      <div className="flex items-center gap-2 mx-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number, idx, arr) => (
                          <React.Fragment key={number}>
                            <button onClick={() => handlePageChange(number)} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${currentPage === number ? 'bg-slate-800 text-white font-bold shadow-md transform scale-105' : 'text-slate-400 hover:bg-slate-100'}`}>{number}</button>
                            {idx < arr.length - 1 && <span className="text-[10px] text-slate-300 mx-0.5">•</span>}
                          </React.Fragment>
                        ))}
                      </div>
                      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="text-sm font-medium text-slate-500 hover:text-orange-600 px-2 py-1 transition-colors disabled:opacity-30">다음</button>
                      <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="text-xs font-bold text-slate-400 hover:text-orange-600 px-2 py-1 rounded transition-colors disabled:opacity-30">&gt;&gt;</button>
                    </div>
                  )}
                  
                  {isPartialMatch && (
                    <div className="flex flex-col items-center justify-center py-10 mt-8 border-t border-slate-100 text-center px-4">
                      <p className="text-slate-700 text-[15px] font-bold mb-5">
                        '<span style={{ color: '#ea580c' }}>{displayQuery}</span>'에 대해 더 검색을 원하시면, 아래 버튼을 클릭하세요.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                        <button onClick={() => handleExternalSearch('naver')} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#03C75A] hover:bg-[#02b351] text-white rounded-xl font-bold transition-all shadow-sm hover:shadow-md">네이버 사전 검색</button>
                        <button onClick={() => handleExternalSearch('google')} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold transition-all shadow-sm hover:shadow-md">Google 검색</button>
                      </div>
                    </div>
                  )}

                  {/* =====================================================
                      AI-Hub 한-영 번역 말뭉치 데이터 활용 출처 표기
                      - 검색 결과·페이지네이션·외부 검색 안내 다음
                      - 하단 광고 바로 이전
                      - 웹과 앱에서 모두 표시
                     ===================================================== */}
                  <aside
                    aria-label="AI-Hub 데이터 활용 출처"
                    className="w-full max-w-4xl mx-auto mt-8 mb-2 px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-center shadow-sm"
                  >
                    <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed break-keep">
                      본 성과물은 2026년도 과학기술정보통신부 및 한국지능정보사회진흥원의
                      {' '}&apos;지능정보 산업 인프라 조성&apos; 사업으로 구축된 AI-Hub의
                      {' '}한-영 번역 말뭉치 데이터를 이용하여 구축되었습니다.
                    </p>
                    <p
                      lang="en"
                      className="mt-2 text-[11px] md:text-xs text-slate-500 leading-relaxed break-words"
                    >
                      This product was made using 한-영 번역 말뭉치 from AI-Hub,
                      which was supported by the Ministry of Science and ICT and
                      National Information Society Agency(NIA) in 2026.
                    </p>
                  </aside>

                  {!displayIsApp && currentItems.length >= 10 && (
                    <div className="w-full flex justify-center mt-8 mb-2">
                      <div className={`relative flex items-center justify-center w-full max-w-[728px] ${isMobileWeb ? 'min-h-[100px]' : 'min-h-[90px]'} bg-transparent rounded-lg overflow-hidden`}>
                        <div className="relative z-10 flex justify-center w-full overflow-x-auto max-w-full">
                          <KakaoAdFit key={isMobileWeb ? 'Bottom-Mobile' : 'Bottom-PC'} unit={isMobileWeb ? 'DAN-rTmeRojhcQi9r19X' : 'DAN-k31fweVZvecyVYdf'} width={isMobileWeb ? '320' : '728'} height={isMobileWeb ? '100' : '90'} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-12 mb-4"><NuanceWidget /></div>
                  
                  <div className="flex items-center justify-between w-full mt-10 mb-6 px-1 pt-6 border-t border-slate-100">
                    <button onClick={() => router.back()} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                      뒤로
                    </button>
                    <a href={displayIsApp ? '/app' : '/'} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                      홈으로
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4">🤔</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    '<span style={{ color: '#ef4444' }}>{displayQuery}</span>'에 대한 결과가 없습니다.
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-4">
                    <button onClick={() => handleExternalSearch('naver')} className="flex-1 py-3 px-4 bg-[#03C75A] text-white rounded-xl font-bold shadow-sm">네이버 사전 검색</button>
                    <button onClick={() => handleExternalSearch('google')} className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold shadow-sm">Google 검색</button>
                  </div>
                  
                  <div className="flex items-center justify-between w-full max-w-md mt-12 px-1 pt-6 border-t border-slate-100">
                    <button onClick={() => router.back()} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                      뒤로
                    </button>
                    <a href={displayIsApp ? '/app' : '/'} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                      홈으로
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-5 space-y-8 animate-in fade-in duration-500">
              
              <div className="flex flex-wrap items-center justify-end gap-2 -mb-3 md:-mb-5 pr-2 relative z-10">
                <button onClick={handleBookmarkClick} className="group flex items-center gap-1.5 px-4 py-1.5 bg-white border border-orange-200 shadow-sm hover:border-orange-400 hover:shadow-md hover:bg-orange-50 rounded-full text-[12px] md:text-[13px] font-extrabold text-orange-600 hover:text-orange-800 transition-all duration-300">
                  <span className="text-[14px] group-hover:scale-110 transition-transform">⭐</span> 
                  <span>즐겨찾기 추가</span>
                </button>
                <Link href="/conversation" className="group flex items-center gap-1.5 px-4 py-1.5 bg-white border border-blue-200 shadow-sm hover:border-blue-400 hover:shadow-md hover:bg-blue-50 rounded-full text-[12px] md:text-[13px] font-extrabold text-blue-600 hover:text-blue-800 transition-all duration-300">
                  <span className="text-[14px] group-hover:scale-110 transition-transform">📖</span> 
                  <span>필수 영어회화</span>
                </Link>
                <Link href="/notice" className="group flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-md hover:bg-slate-50 rounded-full text-[12px] md:text-[13px] font-extrabold text-slate-600 hover:text-slate-800 transition-all duration-300">
                  <span className="text-[14px] group-hover:scale-110 transition-transform">📢</span> 
                  <span>공지사항 / FAQ</span>
                </Link>
                <Link href="/sitemap" className="group flex items-center gap-1.5 px-4 py-1.5 bg-white border border-emerald-200 shadow-sm hover:border-emerald-400 hover:shadow-md hover:bg-emerald-50 rounded-full text-[12px] md:text-[13px] font-extrabold text-emerald-600 hover:text-emerald-800 transition-all duration-300">
                  <span className="text-[14px] group-hover:scale-110 transition-transform">🗺️</span> 
                  <span>사이트맵</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[300px]">
                  <Link href="/recent" className="absolute top-5 right-5 text-[12px] font-bold text-slate-400 hover:text-slate-600 transition-colors z-10 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">더보기 &gt;</Link>
                  <div className="w-full h-full p-2"><RecentKeywords className="w-full h-full border-0 shadow-none bg-transparent" /></div>
                </div>
                <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[300px]">
                  <Link href="/popular" className="absolute top-5 right-5 text-[12px] font-bold text-slate-400 hover:text-slate-600 transition-colors z-10 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">더보기 &gt;</Link>
                  <div className="w-full h-full p-2"><PopularKeywords className="w-full h-full border-0 shadow-none bg-transparent" /></div>
                </div>
              </div>

              <article className="bg-slate-50/80 rounded-2xl p-6 md:p-8 border border-slate-200 text-slate-700 shadow-sm mt-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 border-b border-slate-200 pb-4 gap-4">
                  <div>
                    <h2 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2"><span>📖</span> 엑스딕 필수 영어회화 & 번역가 해설</h2>
                    <p className="mt-2 text-sm text-slate-500">원어민들이 가장 자주 사용하는 핵심 문장과 뉘앙스를 확인하세요.</p>
                  </div>
                  <Link href="/conversation" className="hidden md:flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap">전체 보기 <span>&gt;</span></Link>
                </div>
                
                <div className="grid grid-cols-1 gap-5">
                  {previewData.length > 0 ? previewData.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="bg-slate-800 px-4 py-2 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-white">{item.category}</h3>
                        <Link href={`/conversation?type=${item.category?.includes('여행') ? 'travel' : item.category?.includes('일상') ? 'casual' : item.category?.includes('비즈니스') ? 'business' : ''}`} className="text-[11px] font-medium text-slate-300 hover:text-white transition-colors border border-slate-600 px-2 py-0.5 rounded-full">더보기 &gt;</Link>
                      </div>
                      <div className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-shrink-0 flex items-center gap-1.5 mt-0.5">
                            {mounted && !displayIsApp && (
                              <button onClick={() => handleSpeak(`${item.en_text} ... ${item.ko_text}`)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm" title="발음 듣기">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM14 10a4.002 4.002 0 00-1.172-2.828.75.75 0 10-1.06 1.06c.586.586.914 1.378.914 2.207s-.328 1.62-.914 2.207a.75.75 0 101.06 1.06A4.002 4.002 0 0014 10z" /></svg>
                              </button>
                            )}
                            <button onClick={() => handleCopy(`${item.en_text} - ${item.ko_text}`, item.id || idx)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all flex items-center justify-center shadow-sm" title="문장 복사">
                              {copiedId === (item.id || idx) ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-500"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
                              )}
                            </button>
                          </div>
                          <div>
                            <h4 className="text-base md:text-lg font-extrabold text-blue-700 mb-0.5">{item.en_text}</h4>
                            <p className="text-sm md:text-base font-bold text-slate-800">{item.ko_text}</p>
                          </div>
                        </div>
                        <div className="ml-11 bg-slate-100 rounded-lg p-4 border border-slate-200 text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[160px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                          <span className="font-extrabold text-blue-700 mr-1.5">💡 해설: </span>{item.description}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-slate-400 text-sm">데이터를 불러오는 중입니다...</div>
                  )}
                </div>

                <div className="mt-6 md:hidden flex justify-center">
                  <Link href="/conversation" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors border border-blue-200 bg-white px-6 py-2 rounded-full shadow-sm">전체 보기 &gt;</Link>
                </div>
              </article>

              <div className="w-full pt-4">
                <NuanceWidget />
              </div>

            </div>
          )}
        </div>
      </main>

      <div className="flex-grow py-[5vh]"></div>
      {!displayIsApp && <div className="flex-none"><Footer /></div>}
    </div>
  );
}
