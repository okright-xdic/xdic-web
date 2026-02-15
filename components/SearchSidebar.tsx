"use client";

import { useEffect, useState } from "react";

interface KeywordItem {
  keyword: string;
  rankChange?: "up" | "down" | "same";
}

export default function SearchSidebar({
  onKeywordClick,
}: {
  onKeywordClick: (keyword: string) => void;
}) {
  const [popular, setPopular] = useState<KeywordItem[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    // 인기 검색어 불러오기
    fetch("/api/popular")
      .then((res) => res.json())
      .then((data) => setPopular(data))
      .catch(console.error);

    // 최근 검색어 불러오기
    const stored = localStorage.getItem("recentKeywords");
    if (stored) {
      setRecent(JSON.parse(stored));
    }
  }, []);

  return (
    <aside className="w-full md:w-80 p-4 bg-white border rounded-lg shadow-sm">
      {/* 인기 검색어 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">🔥 인기 검색어</h2>
        <ul className="space-y-1">
          {popular.map((item, idx) => (
            <li key={idx}>
              <button
                onClick={() => onKeywordClick(item.keyword)}
                className="flex justify-between items-center w-full text-left hover:text-blue-600"
              >
                <span>{idx + 1}. {item.keyword}</span>
                {item.rankChange === "up" && <span className="text-green-500">▲</span>}
                {item.rankChange === "down" && <span className="text-red-500">▼</span>}
                {item.rankChange === "same" && <span className="text-gray-400">-</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 최근 검색어 */}
      <div>
        <h2 className="text-lg font-semibold mb-2">🕘 최근 검색어</h2>
        <ul className="space-y-1">
          {recent.map((item, idx) => (
            <li key={idx}>
              <button
                onClick={() => onKeywordClick(item)}
                className="text-left w-full hover:text-blue-600"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
