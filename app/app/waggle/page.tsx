'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WagglePage() {
  const router = useRouter();

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/waggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'list',
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        console.error('[waggle fetch error]', result);
        setFeedbacks([]);
        return;
      }

      setFeedbacks(
        Array.isArray(result.feedbacks)
          ? result.feedbacks
          : []
      );
    } catch (error) {
      console.error('[waggle fetch exception]', error);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <nav className="bg-white border-b p-3 sticky top-0 z-50 flex items-center justify-between shadow-sm px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            뒤로
          </button>

          <h1 className="text-[17px] font-black text-slate-800 ml-1">
            💬 와글와글
          </h1>
        </div>

        <a
          href="/app"
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          홈으로
        </a>
      </nav>

      <main className="p-4 max-w-2xl mx-auto">
        <div className="bg-blue-600 text-white p-5 rounded-2xl mb-6 shadow-lg">
          <p className="font-bold text-sm leading-relaxed">
            엑스딕 앱 평가 기간에 운영했던 소통 게시판입니다.
            <br />
            현재 평가단 운영은 종료되어 기존 내용만 읽기 전용으로 보관하고 있습니다.
          </p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-slate-400">
              불러오는 중...
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              보관된 의견이 없습니다.
            </div>
          ) : (
            feedbacks.map((fb) => {
              const canViewContent =
                Boolean(fb.can_view_content);

              const isNotice =
                Boolean(fb.is_notice);

              return (
                <div
                  key={fb.id}
                  className={`p-5 rounded-2xl border shadow-sm relative ${
                    isNotice
                      ? 'bg-indigo-50/50 border-indigo-200'
                      : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`font-black flex items-center gap-1.5 ${
                        isNotice
                          ? 'text-indigo-800 text-[15px]'
                          : 'text-blue-600 text-sm'
                      }`}
                    >
                      {isNotice
                        ? '📢 시샵 공지'
                        : fb.nickname}

                      {!isNotice && fb.is_secret && (
                        <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">
                          비밀글
                        </span>
                      )}
                    </span>

                    <span
                      className={`text-[10px] ${
                        isNotice
                          ? 'text-indigo-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {new Date(
                        fb.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  {isNotice ? (
                    <p className="text-indigo-900 text-[14px] font-bold leading-relaxed whitespace-pre-wrap">
                      {fb.content}
                    </p>
                  ) : canViewContent ? (
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {fb.content}
                    </p>
                  ) : (
                    <p className="text-slate-400 text-sm italic">
                      🔒 비밀글로 등록된 내용입니다.
                    </p>
                  )}

                  {!isNotice && fb.reply && (
                    canViewContent ? (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-[11px] font-black text-blue-500 mb-1">
                          시샵(운영자) 답변
                        </p>

                        <p className="text-sm text-slate-600 whitespace-pre-wrap">
                          {fb.reply}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg border-l-4 border-slate-300">
                        <p className="text-[11px] font-black text-slate-400 mb-1">
                          시샵(운영자) 답변
                        </p>

                        <p className="text-sm text-slate-400 italic">
                          🔒 비밀글에 대한 답변입니다.
                        </p>
                      </div>
                    )
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}