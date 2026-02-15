'use client'; // 클라이언트 사이드 렌더링 강제 (빌드 에러 해결)

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Book, LayoutGrid } from 'lucide-react';

// 1. Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. 카테고리 정의 (저장된 정보 기반)
const CATEGORIES = [
  { id: 1, name: '기본영어' },
  { id: 2, name: '인문사회용어' },
  { id: 3, name: '기계_전기_전자용어' },
  { id: 4, name: '교육_종교_예체능용어' },
  { id: 5, name: '무역경제용어' },
  { id: 6, name: '자동차_환경용어' },
  { id: 7, name: '물리_화학용어' },
  { id: 8, name: '컴퓨터용어' },
  { id: 9, name: '의학용어' },
  { id: 10, name: '인문사회기타용어' },
  { id: 11, name: '과학기술기타용어' },
  { id: 12, name: '기타' },
];

export default function AppViewPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 3. 검색 로직 (Zig-zag Interleaving 적용)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      // 검색어 보정: 복합어일 경우 붙여쓰기 자동 보정
      const refinedTerm = searchTerm.replace(/\s+/g, '');
      
      let allCategoryData: any[][] = [];
      
      // 12개 카테고리 순회하며 데이터 수집
      for (const cat of CATEGORIES) {
        let query = supabase
          .from('dictionary_lines')
          .select('*')
          .eq('category_id', cat.id);

        // 한 단어일 때 Exact Match, 아닐 때 Like 검색
        if (refinedTerm.length === searchTerm.length && !searchTerm.includes(' ')) {
          query = query.eq('line_text', searchTerm);
        } else {
          query = query.ilike('line_text', `%${searchTerm}%`);
        }

        const { data } = await query.limit(120);
        allCategoryData.push(data || []);
      }

      // 지그재그 교차(Zig-zag Interleaving) 로직
      const interleaved: any[] = [];
      let index = 0;
      while (interleaved.length < 120) {
        let addedInThisRound = false;
        for (let i = 0; i < 12; i++) {
          if (allCategoryData[i][index]) {
            interleaved.push(allCategoryData[i][index]);
            addedInThisRound = true;
          }
          if (interleaved.length >= 120) break;
        }
        if (!addedInThisRound) break; // 더 이상 가져올 데이터가 없으면 중단
        index++;
      }

      setResults(interleaved);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      {/* 검색 바 */}
      <form onSubmit={handleSearch} className="sticky top-0 z-10 bg-white p-2 rounded-xl shadow-md flex gap-2 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="검색어를 입력하세요..."
          className="flex-1 p-2 outline-none text-lg"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg">
          <Search size={24} />
        </button>
      </form>

      {/* 결과 목록 */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center p-10 text-gray-500">검색 중입니다...</div>
        ) : results.length > 0 ? (
          results.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
              <div className="text-xs text-blue-600 font-bold mb-1">
                {CATEGORIES.find(c => c.id === item.category_id)?.name}
              </div>
              <div className="text-lg text-gray-800">{item.line_text}</div>
            </div>
          ))
        ) : (
          <div className="text-center p-10 text-gray-400 font-medium">
            <LayoutGrid size={48} className="mx-auto mb-2 opacity-20" />
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {/* 하단 탭 바 (앱 느낌) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 shadow-lg">
        <div className="flex flex-col items-center text-blue-600">
          <Book size={24} />
          <span className="text-xs mt-1">사전</span>
        </div>
        <div className="flex flex-col items-center text-gray-400" onClick={() => window.location.reload()}>
          <LayoutGrid size={24} />
          <span className="text-xs mt-1">카테고리</span>
        </div>
      </div>
    </div>
  );
}