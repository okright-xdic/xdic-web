'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchPage from '@/components/SearchPage';

type SearchResult = {
  id: string | number;
  category_id: number;
  line_text: string;
  source_order?: number;
};

export default function AppPage() {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ URL의 ?q= 가 바뀔 때마다 query 갱신 (음성검색 router.push에도 즉시 반응)
  useEffect(() => {
    const q = (searchParams?.get('q') || '').trim();
    setQuery(q);
  }, [searchParams]);

  // ✅ query가 바뀌면 검색 호출
  useEffect(() => {
    const q = (query || '').trim();
    const compact = q.replace(/\s+/g, '');

    if (!q || compact.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/rpc-search?q=${encodeURIComponent(q)}&limit=240&offset=0`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          setResults([]);
          return;
        }

        const json = await res.json();
        setResults(Array.isArray(json?.results) ? json.results : []);
      } catch (e: any) {
        if (e?.name === 'AbortError') return;
        setResults([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [query]);

  const highlightList = useMemo(() => {
    const q = (query || '').trim();
    return q ? [q] : [];
  }, [query]);

  return (
    <SearchPage
      query={query}
      results={results}
      highlightList={highlightList}
      isApp={true}
    />
  );
}