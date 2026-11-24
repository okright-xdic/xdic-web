'use client';
// XDIC_KO290_EN_PAGE_PANEL_V1_BEGIN
// Isolated supplementary matches panel; never alters existing SearchPage results.
import React, { useEffect, useState } from 'react';

type Row = {
  id: string;
  category_id: number;
  source_order: number | null;
  line_text: string;
};

type PagePayload = {
  query: string;
  page: number;
  pageSize: number;
  results: Row[];
  hasMore: boolean;
  limitReached?: boolean;
};

const KO290_EZ_ALLOWED = new Set(['후보', '후보자', 'candidate', '명단', '지원자']);

export default function XdicKo290EnAllMatches({ query }: { query: string }) {
  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [limited, setLimited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const targetQuery = query.trim();
  const highlightPattern = targetQuery === '후보' ? /(후보|candidates?)/gi
    : targetQuery === '후보자' ? /(후보자|candidates?)/gi
    : targetQuery === 'candidate' ? /(candidates?)/gi
    : targetQuery === '명단' ? /(명단)/gi : /(지원자)/gi;

  useEffect(() => {
    setOpened(false);
    setPage(1);
    setRows([]);
    setHasMore(false);
    setLimited(false);
    setError('');
  }, [query]);

  useEffect(() => {
    if (!opened || !KO290_EZ_ALLOWED.has(targetQuery)) return;
    const controller = new AbortController();
    setLoading(true);
    setRows([]);
    setHasMore(false);
    setError('');
    const url = `/api/xdic-ko290-en-matches?q=${encodeURIComponent(targetQuery)}&page=${page}`;
    fetch(url, { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error || '조회 실패');
        return payload as PagePayload;
      })
      .then((payload) => {
        if (controller.signal.aborted) return;
        if (payload.query !== targetQuery || payload.page !== page || payload.pageSize !== 20 || !Array.isArray(payload.results)) {
          throw new Error('조회 응답 형식이 예상과 다릅니다.');
        }
        setRows(payload.results);
        setHasMore(payload.hasMore === true);
        setLimited(payload.limitReached === true);
      })
      .catch((cause) => {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : '조회 실패');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [opened, page, query]);

  if (!KO290_EZ_ALLOWED.has(targetQuery)) return null;

  return (
    <section className="mt-5 mb-6 rounded-xl border border-sky-200 bg-sky-50/40 p-4 md:p-5" aria-label={`${targetQuery} 추가 일치 자료`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-slate-900">추가 일치 자료 보기 · {targetQuery}</h3>
          <p className="mt-1 text-base leading-relaxed text-slate-600">기존 검색 결과와 별도 · 카테고리 0 제외 · 카테고리별 5건 제한 미적용</p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-lg font-semibold text-blue-700 shadow-sm hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-expanded={opened}
          onClick={() => {
            if (!opened) setPage(1);
            setOpened(!opened);
          }}
        >
          {opened ? '추가 자료 닫기' : '20건씩 더 찾아보기'}
        </button>
      </div>

      {opened && (
        <div className="mt-3 border-t border-sky-200 pt-3">
          <p className="mb-3 text-base font-medium text-slate-700" role="status" aria-live="polite">
            {loading ? '조회 중…' : `추가 자료 ${page}페이지 · ${rows.length}건 표시`}
          </p>
          {error && (
            <p role="alert" className="mb-3 text-lg font-semibold text-red-700">
              {error} · 기존 검색 결과는 그대로 유지됩니다.
            </p>
          )}
          {!loading && !error && rows.length === 0 && (
            <p className="py-3 text-lg text-slate-600">이 페이지에는 더 표시할 일치 자료가 없습니다.</p>
          )}
          {!error && rows.length > 0 && (
            <ol className="space-y-2">
              {rows.map((row, index) => (
                <li key={row.id} className="rounded-lg border border-slate-200 border-l-[3px] border-l-sky-300 bg-white px-4 py-3 shadow-sm">
                  <div className="mb-1.5 text-base font-medium text-sky-700">
                    {((page - 1) * 20) + index + 1} · 카테고리 {row.category_id}
                  </div>
                  <p className="whitespace-pre-wrap break-words text-lg leading-8 text-slate-900">
                    {row.line_text.split(highlightPattern).map((part, partIndex) =>
                      /^(후보|후보자|명단|지원자)$/.test(part) ? (
                        <span key={partIndex} className="rounded-sm bg-orange-50 font-normal text-orange-700">{part}</span>
                      ) : /^candidates?$/i.test(part) ? (
                        <span key={partIndex} className="rounded-sm bg-blue-50 font-normal text-blue-700">{part}</span>
                      ) : (
                        <React.Fragment key={partIndex}>{part}</React.Fragment>
                      )
                    )}
                  </p>
                </li>
              ))}
            </ol>
          )}
          {!error && limited && (
            <p className="mt-3 text-base font-medium text-amber-700">파일럿 조회 상한(500페이지)에 도달했습니다. 기존 검색 데이터는 변경되지 않았습니다.</p>
          )}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button type="button" className="rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-lg font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              disabled={loading || page === 1}
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}>
              이전 20건
            </button>
            <span className="text-lg font-bold text-slate-800">{page}페이지</span>
            <button type="button" className="rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-lg font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              disabled={loading || !!error || !hasMore}
              onClick={() => setPage((previous) => previous + 1)}>
              다음 20건
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
// XDIC_KO290_EN_PAGE_PANEL_V1_END
