'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

interface Conversation {
  id: string | number;
  en_text: string;
  ko_text: string;
  description: string;
}

export default function TodaysConversation() {
  const [item, setItem] = useState<Conversation | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchTodaysPick = async () => {
      const { data } = await supabase
        .from('conversation_lines')
        .select('*')
        .eq('is_todays_pick', true)
        .order('picked_at', { ascending: false, nullsFirst: false })
        .limit(1)
        .single();

      if (data) setItem(data);
    };
    fetchTodaysPick();
  }, [supabase]);

  if (!item) return null;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${item.en_text} - ${item.ko_text}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleSpeak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    } else {
      alert('이 브라우저는 음성 듣기를 지원하지 않습니다.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 mb-2 px-2 animate-in fade-in duration-500">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="group relative bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-2xl p-4 cursor-pointer transition-all shadow-sm hover:shadow-md"
      >
        <div className="absolute -top-3 left-4 bg-white px-2 flex items-center gap-2.5">
          <span className="text-xs font-extrabold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
            💡 오늘의 영어회화
          </span>
          <Link
            href="/conversation?type=todays"
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] font-bold text-slate-400 hover:text-blue-600 transition-colors"
          >
            전체보기 &gt;
          </Link>
        </div>

        <div className="flex items-start gap-3 mt-1">
          <div className="flex-shrink-0 flex items-center gap-1.5 mt-0.5">
            <button
              onClick={(e) => handleSpeak(item.en_text, e)}
              className="w-8 h-8 rounded-full bg-white text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
              title="발음 듣기"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM14 10a4.002 4.002 0 00-1.172-2.828.75.75 0 10-1.06 1.06c.586.586.914 1.378.914 2.207s-.328 1.62-.914 2.207a.75.75 0 101.06 1.06A4.002 4.002 0 0014 10z" /></svg>
            </button>
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
              {item.en_text}
            </h4>
            <p className="text-[15px] font-bold text-slate-800 mt-0.5">
              {item.ko_text}
            </p>
          </div>

          <div className="flex-shrink-0 text-slate-400 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
          </div>
        </div>

        {isExpanded && item.description && (
          <div className="mt-4 pt-4 border-t border-blue-100/50 animate-in fade-in slide-in-from-top-2">
            <div className="bg-white rounded-xl p-3.5 border border-blue-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              <span className="font-extrabold text-blue-600 mr-1.5">👨‍🏫 번역가 해설:</span>
              {item.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}