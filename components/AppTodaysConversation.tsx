// 파일 위치: components/AppTodaysConversation.tsx
'use client';

import React, { useState } from 'react';

export default function AppTodaysConversation() {
// 🌟 [수동 업데이트 영역] 매일매일 이곳의 글자만 바꿔주시면 됩니다!
  const todaysData = {
    en_text: "Can I take a look at the presentation file?",
    ko_text: "'프레젠테이션 자료 좀 볼 수 있을까요?",
    description: `"비즈니스/업무요청"에 관한 영어회화 표현입니다.
☞ "Take a look at"은 영어에서 "~을 (한번) 살펴보다/보다"라는 뜻으로, 무언가를 확인하거나 주의 깊게 관찰할 때 사용합니다.

다음은 다양한 예문입니다. 참고하세요. 

이 문서를 내일까지 검토해 주시겠어요? Could you review this document by tomorrow?
이 프로젝트의 담당자가 누구인지 알려주시겠어요? Could you tell me who is in charge of this project?
회의 일정을 다음 주로 미룰 수 있을까요? Could we postpone the meeting to next week?
일정을 30분 정도 앞당길 수 있을까요? Could we move the schedule up by 30 minutes?
결재를 부탁드려도 될까요? Could I ask for your approval?
사인 먼저 해주실 수 있나요? Could you sign this first?
조금 더 자세한 자료를 보내주시겠어요? Could you send me more detailed materials?
이 비용에 대한 견적서를 보내주세요. Please send me a quote for this cost.
예산안을 다시 짜주실 수 있나요? Could you revise the budget plan?
그 건에 대해 업데이트된 내용이 있나요? Could you give me an update on that?
진행 상황을 메일로 공유해 주세요. Please share the progress via email.
보고서 마감일을 연장해 주실 수 있나요? Could you extend the deadline for the report?
최종 수정본을 첨부해 주시겠어요? Could you attach the final revised version?
회의실 예약을 부탁해도 될까요? Could you book a meeting room for us?
이번 주 금요일까지 답변을 부탁드립니다. I'd appreciate a reply by this Friday.
제안서를 한 번 더 확인해 주시겠어요? Could you double-check the proposal?
이 부분의 수치를 다시 계산해 주세요. Please recalculate the figures in this part.`
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