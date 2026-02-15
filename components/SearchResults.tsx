'use client';

import React, { useState, useEffect } from 'react';

const CATEGORY_NAMES: { [key: number]: string } = {
  1: '기본영어', 2: '인문사회용어', 3: '기계_전기_전자용어', 4: '교육_종교_예체능용어',
  5: '무역경제용어', 6: '자동차_환경용어', 7: '물리_화학용어', 8: '컴퓨터용어',
  9: '의학용어', 10: '인문사회기타용어', 11: '과학기술기타용어', 12: '기타'
};

// [광고 컴포넌트]
const AdPlaceholder = ({ label }: { label: string }) => (
  <div className="w-full my-8 px-2">
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-slate-400 tracking-[0.2em] mb-2 uppercase font-bold text-center w-full">
        광고(ADVERTISEMENT)
      </span>
      <div className="w-full min-h-[160px] bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm text-slate-300 italic text-sm">
        {label}
      </div>
    </div>
  </div>
);

export default function SearchResults({ keyword }: { keyword: string }) {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const isTooShort = keyword.trim().length > 0 && keyword.trim().length < 2;

  // [음성 듣기 기능]
  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; 
      utterance.pitch = 0.85; 
      utterance.rate = 0.9;   

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang === 'en-US');
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    } else {
      alert("이 브라우저는 음성 듣기를 지원하지 않습니다.");
    }
  };

  // [핵심 수정] 한글 자소 분리 문제 해결을 위한 정규화 적용
  const renderHighlightedText = (text: string, key: string) => {
    if (!key.trim()) return <span>{text}</span>;

    // 1. 한글 자소 분리 방지를 위해 NFC로 정규화 (이게 핵심입니다!)
    const normalizedText = text.normalize('NFC');
    const normalizedKey = key.trim().normalize('NFC');

    // 2. 특수문자 이스케이프 및 정규식 생성
    const escapedKey = normalizedKey.replace(/\s+/g, ' ').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = normalizedText.split(new RegExp(`(${escapedKey})`, 'gi'));

    return (
      <p className="text-[20px] text-slate-800 leading-snug font-normal">
        {parts.map((part, i) => 
          // 3. 소문자로 변환하여 비교 (정규화된 키와 일치하면 오렌지색)
          part.toLowerCase() === normalizedKey.toLowerCase() ? (
            <span key={i} className="text-orange-500 font-normal">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
    );
  };

  useEffect(() => {
    const trimmedKey = keyword.trim();
    if (trimmedKey.length < 2) {
      setResults([]);
      return; 
    }
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/rpc-search?q=${encodeURIComponent(trimmedKey)}`);
        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        setResults([]);
      } finally {
        setIsLoading(false);
        setCurrentPage(1);
      }
    };
    fetchResults();
  }, [keyword]);

  const currentItems = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const movePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pb-24">
      {isLoading ? (
        <div className="py-32 text-center flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
           <p className="text-orange-500 font-bold text-xl tracking-tight animate-pulse">"{keyword}" 검색 중...</p>
        </div>
      ) : (
        <>
          {isTooShort ? (
            <div className="py-32 text-center text-slate-400 text-xl font-light italic">
              단어는 <span className="text-orange-500 font-bold">두 글자 이상</span> 입력해 주세요.
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="mb-6 pb-2 border-b border-slate-100 flex justify-between items-center text-slate-400 text-xs font-medium font-sans">
                <span>검색 결과 <span className="text-orange-600 font-bold">{results.length}</span>건</span>
              </div>
              
              <div className="flex flex-col">
                {currentItems.map((item, idx) => (
                  <React.Fragment key={item.id || idx}>
                    <div className={`group flex items-center justify-between gap-4 py-4 px-2 transition-all hover:bg-slate-50/50 ${
                      idx !== currentItems.length - 1 ? 'border-b border-dashed border-slate-300' : ''
                    }`}>
                      
                      {/* 듣기 버튼 */}
                      <button 
                        onClick={() => handleSpeak(item.line_text)}
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 hover:bg-blue-600 hover:text-white transition-all duration-200"
                        title="발음 듣기"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 2.485.635 4.83 1.745 6.914.346 1.189 1.503 1.836 2.644 1.836h1.948l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.5 12a6.5 6.5 0 00-1.904-4.596l-1.061 1.06a5 5 0 011.465 3.536 5 5 0 01-1.465 3.536l1.061 1.06A6.5 6.5 0 0018.5 12zM20.94 5.94a9 9 0 012.56 6.06 9 9 0 01-2.56 6.06l-1.06-1.06a7.5 7.5 0 002.12-5 7.5 7.5 0 00-2.12-5l1.06-1.06z" />
                         </svg>
                      </button>

                      <div className="min-w-0 flex-grow select-text cursor-default overflow-hidden font-sans">
                        {renderHighlightedText(item.line_text, keyword)}
                      </div>

                      <span className="text-[17px] text-blue-600 font-normal whitespace-nowrap shrink-0 tracking-tight font-sans">
                        [{CATEGORY_NAMES[item.category_id]}]
                      </span>
                    </div>
                    {idx === 6 && <AdPlaceholder label="Google AdSense - Feed Ad" />}
                  </React.Fragment>
                ))}
              </div>

              {results.length > itemsPerPage && (
                <div className="mt-16 mb-12 flex justify-center items-center gap-3 select-none font-sans">
                  <button onClick={() => movePage(1)} disabled={currentPage === 1} className={`text-xs font-bold px-2 py-1 rounded transition-colors ${currentPage === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'}`} title="맨처음">&lt;&lt;</button>
                  <button onClick={() => movePage(currentPage - 1)} disabled={currentPage === 1} className={`text-sm font-medium px-2 py-1 transition-colors ${currentPage === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:text-orange-600'}`}>이전</button>
                  <div className="flex items-center gap-2 mx-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num, idx, arr) => (
                      <React.Fragment key={num}>
                        <button onClick={() => movePage(num)} className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all ${currentPage === num ? 'bg-slate-800 text-white font-bold shadow-md transform scale-105' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}>{num}</button>
                        {idx < arr.length - 1 && <span className="text-slate-300 text-[10px]">•</span>}
                      </React.Fragment>
                    ))}
                  </div>
                  <button onClick={() => movePage(currentPage + 1)} disabled={currentPage === totalPages} className={`text-sm font-medium px-2 py-1 transition-colors ${currentPage === totalPages ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:text-orange-600'}`}>다음</button>
                  <button onClick={() => movePage(totalPages)} disabled={currentPage === totalPages} className={`text-xs font-bold px-2 py-1 rounded transition-colors ${currentPage === totalPages ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'}`} title="맨끝">&gt;&gt;</button>
                </div>
              )}

              <div className="mt-8">
                <AdPlaceholder label="Google AdSense - Bottom Ad" />
              </div>
            </>
          ) : (
            // [검색 결과 없음 화면] - Google/Naver 바로가기 유지
            !isLoading && !isTooShort && (
              <div className="py-24 flex flex-col items-center animate-in fade-in duration-500">
                <div className="text-slate-400 text-xl font-light italic mb-12 font-sans">
                  "<span className="font-medium text-slate-600">{keyword}</span>"에 대한 검색 결과가 없습니다.
                </div>
                <div className="w-full max-w-lg flex flex-col sm:flex-row gap-5 justify-center px-4">
                  <a href="https://www.google.com/webhp?hl=ko&sa=X" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-[#4285F4]/30 bg-[#4285F4]/5 text-[#4285F4] font-bold transition-all duration-300 hover:bg-[#4285F4] hover:text-white hover:shadow-md hover:-translate-y-1 group">
                    <span className="whitespace-nowrap">구글 바로가기</span>
                  </a>
                  <a href="https://en.dict.naver.com/#/main?sLn=kr" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-[#03C75A]/30 bg-[#03C75A]/5 text-[#03C75A] font-bold transition-all duration-300 hover:bg-[#03C75A] hover:text-white hover:shadow-md hover:-translate-y-1 group">
                    <span className="font-black text-lg leading-none">N</span>
                    <span className="whitespace-nowrap">네이버사전 바로가기</span>
                  </a>
                </div>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}