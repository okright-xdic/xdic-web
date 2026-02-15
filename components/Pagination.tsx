'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  perPage: number;
}

export default function Pagination({ currentPage, totalCount, perPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const totalPages = Math.ceil(totalCount / perPage);

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handlePageChange = (page: number) => {
    router.push(`/search?q=${encodeURIComponent(query)}&page=${page}`);
    window.scrollTo(0, 0); // 페이지 이동 시 상단 스크롤
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center items-center space-x-2 mt-12 mb-20 font-serif">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm text-gray-500 hover:text-blue-600 disabled:opacity-30 transition-colors"
      >
        ◀ 이전
      </button>

      <div className="flex items-center">
        {getPageNumbers().map((page, idx, array) => (
          <React.Fragment key={page}>
            <button
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 text-[16px] transition-all ${
                page === currentPage
                  ? 'font-bold text-blue-600 underline underline-offset-4'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {page}
            </button>
            {/* 숫자 사이 작은 점 표시 */}
            {idx < array.length - 1 && (
              <span className="text-gray-300 text-[10px] select-none mx-1">•</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm text-gray-500 hover:text-blue-600 disabled:opacity-30 transition-colors"
      >
        다음 ▶
      </button>
    </nav>
  );
}