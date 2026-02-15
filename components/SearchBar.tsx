'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      // 검색 시 URL 파라미터 업데이트
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // 음성 인식 처리 로직
  const handleVoiceSearch = () => {
    if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        router.push(`/?q=${encodeURIComponent(transcript.trim())}`);
      };

      recognition.start();
    } else {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 mb-4 relative px-4">
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="단어나 문장을 검색해 보세요"
          className="w-full pl-6 pr-24 py-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm focus:outline-none focus:border-orange-500 transition-all text-[18px]"
        />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
          {/* 음성 검색 마이크 버튼 */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`p-2 rounded-full transition-all ${
              isListening 
              ? 'text-white bg-red-500 animate-pulse scale-110' 
              : 'text-slate-300 hover:text-orange-500 hover:bg-orange-50'
            }`}
            title="음성 검색"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </button>

          {/* 검색 돋보기 버튼 */}
          <button
            type="submit"
            className="p-2 text-slate-300 hover:text-orange-500 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        {/* [원칙 반영] 음성 인식 상태 안내 문구 */}
        {isListening && (
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 px-6 py-2 bg-orange-500 text-white rounded-full text-sm font-bold shadow-xl animate-bounce z-10">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
              말씀해 주세요...
            </span>
          </div>
        )}
      </form>
    </div>
  );
}