'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface BoardItem {
  id: number;
  title: string;
  created_at: string;
}

interface NuanceWidgetProps {
  /**
   * 메인페이지에서만 날짜별 rotation을 켭니다.
   * 기본값 false이므로 기존 호출부는 최신 3건 표시를 유지합니다.
   */
  dailyRotation?: boolean;
}

const DAILY_ROTATION_POOL_LIMIT = 120;
const DAILY_ROTATION_COUNT = 3;

const getKoreaDateKey = (): string => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());

    const value = (type: string) =>
      parts.find((part) => part.type === type)?.value || '';

    const year = value('year');
    const month = value('month');
    const day = value('day');

    return year && month && day ? `${year}-${month}-${day}` : '';
  } catch {
    return '';
  }
};

const dateKeyToDaySerial = (dateKey: string): number => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return 0;

  const utc = Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3])
  );

  return Math.floor(utc / 86400000);
};

const selectDailyItems = (
  items: BoardItem[],
  dateKey: string,
  salt: number
): BoardItem[] => {
  if (!dateKey || items.length <= DAILY_ROTATION_COUNT) {
    return items.slice(0, DAILY_ROTATION_COUNT);
  }

  const daySerial = dateKeyToDaySerial(dateKey);
  const start =
    ((daySerial * DAILY_ROTATION_COUNT + salt) % items.length + items.length) %
    items.length;

  return Array.from(
    { length: Math.min(DAILY_ROTATION_COUNT, items.length) },
    (_, offset) => items[(start + offset) % items.length]
  );
};

export default function NuanceWidget({
  dailyRotation = false,
}: NuanceWidgetProps) {
  const supabase = createClient();
  const [nuancePool, setNuancePool] = useState<BoardItem[]>([]);
  const [idiomPool, setIdiomPool] = useState<BoardItem[]>([]);
  const [rotationDateKey, setRotationDateKey] = useState(
    dailyRotation ? getKoreaDateKey() : ''
  );
  const [isLoading, setIsLoading] = useState(true);

  // 메인페이지 rotation 모드에서만 한국 날짜 변경을 감지합니다.
  useEffect(() => {
    if (!dailyRotation || typeof window === 'undefined') return;

    const syncDateKey = () => {
      setRotationDateKey(getKoreaDateKey());
    };

    syncDateKey();
    const timer = window.setInterval(syncDateKey, 60 * 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [dailyRotation]);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);

      const limit = dailyRotation
        ? DAILY_ROTATION_POOL_LIMIT
        : DAILY_ROTATION_COUNT;

      const [nuanceRes, idiomRes] = await Promise.all([
        supabase
          .from('nuances')
          .select('id, title, created_at')
          .order('created_at', { ascending: false })
          .limit(limit),
        supabase
          .from('idioms')
          .select('id, title, created_at')
          .order('created_at', { ascending: false })
          .limit(limit),
      ]);

      if (cancelled) return;

      if (nuanceRes.data) setNuancePool(nuanceRes.data);
      if (idiomRes.data) setIdiomPool(idiomRes.data);

      setIsLoading(false);
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [dailyRotation, rotationDateKey]);

  const nuances = useMemo(
    () =>
      dailyRotation
        ? selectDailyItems(nuancePool, rotationDateKey, 17)
        : nuancePool.slice(0, DAILY_ROTATION_COUNT),
    [dailyRotation, nuancePool, rotationDateKey]
  );

  const idioms = useMemo(
    () =>
      dailyRotation
        ? selectDailyItems(idiomPool, rotationDateKey, 43)
        : idiomPool.slice(0, DAILY_ROTATION_COUNT),
    [dailyRotation, idiomPool, rotationDateKey]
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3 w-full">
        {/* 뉘앙스 로딩 뼈대 */}
        <section
          aria-label="영단어 뉘앙스 해설 불러오는 중"
          className="rounded-xl border border-emerald-100 bg-emerald-50/25 p-3 md:p-3.5"
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[15px]" aria-hidden="true">💡</span>
              <div className="h-4 w-32 rounded bg-emerald-100/80 animate-pulse" />
            </div>
            <div className="h-3.5 w-12 rounded bg-emerald-100/70 animate-pulse" />
          </div>

          <ul className="space-y-1.5">
            {[1, 2, 3].map((i) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded-lg border border-emerald-100/70 bg-white/75 px-2.5 py-2 animate-pulse"
              >
                <div className="h-5 w-5 shrink-0 rounded-full bg-emerald-100" />
                <div className="h-3.5 w-3/4 rounded bg-slate-100" />
              </li>
            ))}
          </ul>
        </section>

        {/* 숙어 로딩 뼈대 */}
        <section
          aria-label="필수 숙어 해설 불러오는 중"
          className="rounded-xl border border-blue-100 bg-blue-50/25 p-3 md:p-3.5"
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[15px]" aria-hidden="true">📘</span>
              <div className="h-4 w-28 rounded bg-blue-100/80 animate-pulse" />
            </div>
            <div className="h-3.5 w-12 rounded bg-blue-100/70 animate-pulse" />
          </div>

          <ul className="space-y-1.5">
            {[1, 2, 3].map((i) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded-lg border border-blue-100/70 bg-white/75 px-2.5 py-2 animate-pulse"
              >
                <div className="h-5 w-5 shrink-0 rounded-full bg-blue-100" />
                <div className="h-3.5 w-3/4 rounded bg-slate-100" />
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3 w-full">
      {/* 1. 영단어 Nuance: 사전형 컴팩트 카드 */}
      <section
        aria-labelledby="xdic-nuance-widget-title"
        className="rounded-xl border border-emerald-100 bg-emerald-50/25 p-3 md:p-3.5"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <h2
              id="xdic-nuance-widget-title"
              className="flex items-center gap-1.5 text-[14px] md:text-[15px] font-black text-slate-800 leading-tight"
            >
              <span className="text-sm" aria-hidden="true">💡</span>
              영단어 Nuance
            </h2>
            <p className="mt-0.5 text-[9px] md:text-[10px] text-slate-400">
              {dailyRotation ? '매일 다른 3개 · 의미·쓰임 차이' : '단어의 의미·쓰임 차이'}
            </p>
          </div>

          <Link
            href="/nuance"
            className="shrink-0 text-[10px] md:text-[11px] font-extrabold text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            전체보기 →
          </Link>
        </div>

        <ul className="space-y-1.5">
          {nuances.length > 0 ? nuances.map((item, index) => (
            <li key={item.id}>
              <Link
                href={`/nuance?id=${item.id}`}
                className="group flex items-center gap-2 rounded-lg border border-emerald-100/80 bg-white/85 px-2.5 py-1.5 md:py-2 hover:border-emerald-200 hover:bg-white transition-colors"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-black text-emerald-700">
                  {index + 1}
                </span>
                <p className="min-w-0 flex-1 truncate text-[11px] md:text-[12px] font-bold text-slate-700 group-hover:text-emerald-800 transition-colors">
                  {item.title}
                </p>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-[10px] text-slate-300 group-hover:text-emerald-500 transition-colors"
                >
                  ›
                </span>
              </Link>
            </li>
          )) : (
            <li className="rounded-lg border border-dashed border-emerald-100 bg-white/60 py-4 text-center text-[10px] text-slate-400">
              등록된 뉘앙스 해설이 없습니다.
            </li>
          )}
        </ul>
      </section>

      {/* 2. 필수 숙어: 사전형 컴팩트 카드 */}
      <section
        aria-labelledby="xdic-idiom-widget-title"
        className="rounded-xl border border-blue-100 bg-blue-50/25 p-3 md:p-3.5"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <h2
              id="xdic-idiom-widget-title"
              className="flex items-center gap-1.5 text-[14px] md:text-[15px] font-black text-slate-800 leading-tight"
            >
              <span className="text-sm" aria-hidden="true">📘</span>
              <span>
                필수 숙어
                <span className="ml-1 text-[10px] md:text-[11px] font-bold text-blue-500">
                  Idioms
                </span>
              </span>
            </h2>
            <p className="mt-0.5 text-[9px] md:text-[10px] text-slate-400">
              {dailyRotation ? '매일 다른 3개 · 관용 표현·실전 의미' : '관용 표현·실전 의미'}
            </p>
          </div>

          <Link
            href="/idiom"
            className="shrink-0 text-[10px] md:text-[11px] font-extrabold text-blue-700 hover:text-blue-900 transition-colors"
          >
            전체보기 →
          </Link>
        </div>

        <ul className="space-y-1.5">
          {idioms.length > 0 ? idioms.map((item, index) => (
            <li key={item.id}>
              <Link
                href={`/idiom?id=${item.id}`}
                className="group flex items-center gap-2 rounded-lg border border-blue-100/80 bg-white/85 px-2.5 py-1.5 md:py-2 hover:border-blue-200 hover:bg-white transition-colors"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-black text-blue-700">
                  {index + 1}
                </span>
                <p className="min-w-0 flex-1 truncate text-[11px] md:text-[12px] font-bold text-slate-700 group-hover:text-blue-800 transition-colors">
                  {item.title}
                </p>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-[10px] text-slate-300 group-hover:text-blue-500 transition-colors"
                >
                  ›
                </span>
              </Link>
            </li>
          )) : (
            <li className="rounded-lg border border-dashed border-blue-100 bg-white/60 py-4 text-center text-[10px] text-slate-400">
              등록된 숙어 해설이 없습니다.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
