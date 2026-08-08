import { NextResponse } from 'next/server';
import {
  twoProFindSlotSimilarityTier3ReferenceV1,
} from '../slot-similarity';

export const dynamic = 'force-dynamic';

const twoProNoStoreJsonV1 = (
  body: unknown,
  status: number = 200
) =>
  NextResponse.json(
    body,
    {
      status,
      headers: {
        'Cache-Control':
          'no-store, max-age=0',
      },
    }
  );

export async function POST(
  request: Request
) {
  try {
    const body =
      await request
        .json()
        .catch(() => ({}));

    const inputText = String(
      body?.q || ''
    ).trim();

    if (
      !inputText ||
      inputText
        .replace(/\s+/g, '')
        .length < 2
    ) {
      return twoProNoStoreJsonV1({
        ok: true,
        reference: null,
        engine:
          'slot-similarity-tier3-reference-v1',
      });
    }

    const hasKorean =
      /[가-힣]/u.test(inputText);

    const direction =
      hasKorean
        ? 'KO_EN'
        : 'EN_KO';

    const reference =
      twoProFindSlotSimilarityTier3ReferenceV1({
        direction,
        inputText,
      });

    return twoProNoStoreJsonV1({
      ok: true,
      reference,
      engine:
        'slot-similarity-tier3-reference-v1',
    });
  } catch (error) {
    console.warn(
      '[TwoPro Slot Similarity Tier3 Reference v1 오류]',
      error instanceof Error
        ? error.message
        : String(error)
    );

    // supplemental reference API이므로
    // 오류가 기존 번역 UX를 깨지 않도록
    // 200 + reference:null로 안전하게 종료합니다.
    return twoProNoStoreJsonV1({
      ok: true,
      reference: null,
      engine:
        'slot-similarity-tier3-reference-v1',
    });
  }
}
