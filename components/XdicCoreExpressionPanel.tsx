'use client';

import { useEffect, useState } from 'react';

export interface XdicCoreExpression {
  id: string;
  ko: string;
  en: string;
  sourceKinds?: string[];
}

/** Feature is OFF by default. Independent of translation API and main search result state. */
export function useXdicCoreExpressions(query: string): XdicCoreExpression[] {
  const [lastResult, setLastResult] = useState<{ query: string; rows: XdicCoreExpression[] }>({ query: '', rows: [] });
  useEffect(() => {
    const normalizedQuery = (query || '').trim();
    if (process.env.NEXT_PUBLIC_XDIC_CORE_EXPRESSIONS_ENABLED !== '1' ||
        normalizedQuery.length < 2 || normalizedQuery.length > 200) {
      return;
    }
    const controller = new AbortController();
    fetch(`/api/core-expressions?q=${encodeURIComponent(normalizedQuery)}`, {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then((response) => response.ok ? response.json() : { results: [] })
      .then((payload) => {
        if (!controller.signal.aborted) {
          setLastResult({ query: normalizedQuery, rows: Array.isArray(payload?.results) ? payload.results : [] });
        }
      })
      .catch(() => { if (!controller.signal.aborted) setLastResult({ query: normalizedQuery, rows: [] }); });
    return () => controller.abort();
  }, [query]);
  return lastResult.query === (query || '').trim() ? lastResult.rows : [];
}

export function XdicCoreExpressionPanel({
  rows,
  isApp,
}: {
  rows: XdicCoreExpression[];
  isApp: boolean;
}) {
  if (!rows.length) return null;
  return (
    <section
      aria-label="검수된 한·영 핵심 표현"
      className={isApp
        ? 'rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 mb-3'
        : 'rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 mb-5'}
    >
      <h2 className="text-[15px] md:text-[17px] font-extrabold text-slate-900">
        검수된 한·영 핵심 표현
      </h2>
      <p className="text-xs text-slate-600 mt-1 mb-3">
        현재는 검토된 PHRASES 자료만 표시합니다. 문맥에 따라 번역이 달라질 수 있습니다.
      </p>
      <ul className="space-y-2">
        {rows.map((item) => (
          <li key={item.id} className="rounded-lg bg-white border border-emerald-100 px-3 py-2">
            <p className="text-sm font-semibold text-slate-800 break-words">{item.ko}</p>
            <p className="text-sm text-blue-700 break-words">{item.en}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
