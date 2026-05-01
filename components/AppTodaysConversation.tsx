// 파일 위치: components/AppTodaysConversation.tsx
'use client';

import React, { useState } from 'react';

export default function AppTodaysConversation() {
// 🌟 [수동 업데이트 영역] 매일매일 이곳의 글자만 바꿔주시면 됩니다!
  const todaysData = {
    en_text: "Please let me know the results.",
    ko_text: "결과를 통보해 주시겠어요?",
    description: `"직장/업무요청"에 해당하는 영어회화입니다.

"Please let me know"는 "알려주세요", "말씀해 주세요", "연락 주세요"라는 뜻입니다.

다음은 다양한 예문입니다. 참고하세요. 

이 부분 좀 수정해 주시겠어요? Could you revise this part?
전화 좀 바꿔주시겠어요? Could you transfer the call to me?
내선 번호 알려주시겠어요? What is your extension number?
이 일정표를 공유해 주시겠어요? Could you share this schedule?
가능한 한 빨리 처리해 주세요. Please take care of it as soon as possible.
서명해서 돌려보내 주시겠어요? Could you sign and return it to me?
이 안건을 검토해 주시겠어요? Could you review this agenda?
피드백을 주시면 감사하겠습니다. I would appreciate your feedback.
내일 저한테 다시 알려주시겠어요? Can you remind me tomorrow?`
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${todaysData.en_text} - ${todaysData.ko_text}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 mb-2 px-2 animate-in fade-in duration-500">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="group relative bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-2xl p-4 cursor-pointer transition-all shadow-sm hover:shadow-md"
      >
        {/* 상단 라벨 (전체보기 링크 삭제됨) */}
        <div className="absolute -top-3 left-4 bg-white px-2 flex items-center gap-2.5">
          <span className="text-xs font-extrabold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
            💡 오늘의 영어회화
          </span>
        </div>

        <div className="flex items-start gap-3 mt-1 pt-1">
          <div className="flex-shrink-0 flex items-center gap-1.5 mt-0.5">
            {/* 🌟 마이크 버튼 완전 삭제됨 (버그 원천 차단) 🌟 */}
            <button
              onClick={handleCopy}
              className="w-8 h-8 rounded-full bg-white text-slate-400 border border-slate-200 hover:bg-slate-100 hover:text-slate-700 transition-all flex items-center justify-center shadow-sm"
              title="복사하기"
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-500"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
              )}
            </button>
          </div>

          <div className="flex-1">
            <h4 className="text-lg font-extrabold text-blue-700 tracking-tight">
              {todaysData.en_text}
            </h4>
            <p className="text-[15px] font-bold text-slate-800 mt-0.5">
              {todaysData.ko_text}
            </p>
          </div>

          <div className="flex-shrink-0 text-slate-400 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
          </div>
        </div>

        {isExpanded && todaysData.description && (
          <div className="mt-4 pt-4 border-t border-blue-100/50 animate-in fade-in slide-in-from-top-2">
            <div className="bg-white rounded-xl p-3.5 border border-blue-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              <span className="font-extrabold text-blue-600 mr-1.5">👨‍🏫 해설:</span>
              {todaysData.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}