'use client';

import React, { useEffect, useMemo, useState } from 'react';
import SearchPage from '@/components/SearchPage';

type SearchResult = {
  id: string | number;
  category_id: number;
  line_text: string;
  source_order?: number;
};

export default function AppPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // URL의 ?q= 읽기
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const q = (sp.get('q') || '').trim();
    setQuery(q);
  }, []);

  useEffect(() => {
    const q = (query || '').trim();
    const compact = q.replace(/\s+/g, '');
    if (!q || compact.length < 2) {
      setResults([]);
      return;
    }

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/rpc-search?q=${encodeURIComponent(q)}&limit=240&offset=0`);
        const json = await res.json();
        if (!alive) return;
        setResults(Array.isArray(json?.results) ? json.results : []);
      } catch {
        if (!alive) return;
        setResults([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [query]);

  const highlightList = useMemo(() => {
    const q = (query || '').trim();
    if (!q) return [];
    // 필요하면 여기서 하이라이트 키워드 리스트를 확장
    return [q];
  }, [query]);

  // SearchPage는 props 형태가 {query, results}라서 그대로 전달
  return <SearchPage query={query} results={results} highlightList={highlightList} isApp={true} />;
}