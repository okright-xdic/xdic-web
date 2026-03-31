// app/conversation/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Capacitor } from '@capacitor/core'; // 🌟 앱 여부 판별을 위해 Capacitor 추가

export default function ConversationPage() {
  const [supabase] = useState(() => createClientComponentClient());
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🌟 앱 구동 환경인지 확인하는 상태 추가
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    // 클라이언트 마운트 시 앱 여부 체크
    if (typeof window !== 'undefined' && Capacitor.isNativePlatform()) {
      setIsApp(true);
    }

    const fetchData = async () => {
      const { data: lines, error } = await supabase
        .from('conversation_lines')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && lines) setData(lines);
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const categories = [
    "✈️ 여행 영어 (Travel English)",
    "☕ 일상 회화 (Casual Conversation)",
    "💼 비즈니스 회화 (Business English)"
  ];

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const voices = window.speechSynthesis.getVoices();
      const enVoices = voices.filter(v => v.lang.startsWith('en'));
      const koVoices = voices.filter(v => v.lang.startsWith('ko'));

      const enVoice = enVoices.find(v => v.name.includes('Google US English Male')) || enVoices.find(v => v.name.includes('Google US English')) || enVoices[0];
      const koVoice = koVoices.find(v => v.name.includes('Google') && v.name.includes('Male')) || koVoices[0];

      const parts: { lang: string; text: string }[] = [];
      let currentLang = /[a-zA-Z]/.test(text.charAt(0)) ? 'en' : 'ko'; 
      let currentText = '';

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[a-zA-Z]/.test(char)) {
          if (currentLang !== 'en' && currentText.trim().length > 0) {
            parts.push({ lang: currentLang, text: currentText });
            currentText = '';
          }
          currentLang = 'en'; currentText += char;
        } else if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(char)) {
          if (currentLang !== 'ko' && currentText.trim().length > 0) {
            parts.push({ lang: currentLang, text: currentText });
            currentText = '';
          }
          currentLang = 'ko'; currentText += char;
        } else {
          currentText += char;
        }
      }
      if (currentText.trim().length > 0) parts.push({ lang: currentLang, text: currentText });

      parts.forEach((part) => {
        if (!/[a-zA-Z가-힣0-9]/.test(part.text)) return; 
        const utterance = new SpeechSynthesisUtterance(part.text);
        if (part.lang === 'ko') {
          if (koVoice) utterance.voice = koVoice;
          utterance.lang = koVoice ? koVoice.lang : 'ko-KR';
          utterance.pitch = 1.0; 
          utterance.rate = 1.05; 
          utterance.volume = 1.0; 
        } else {
          if (enVoice) utterance.voice = enVoice;
          utterance.lang = enVoice ? enVoice.lang : 'en-US';
          utterance.pitch = 0.9; 
          utterance.rate = 0.85; 
          utterance.volume = 0.75; 
        }
        window.speechSynthesis.speak(utterance);
      });
    } else {
      alert('이 브라우저는 음성 듣기를 지원하지 않습니다.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="flex-none w-full max-w-4xl mx-auto px-4 md:px-6 pt-8 md:pt-16 pb-6">
        <div className="flex flex-col items-center justify-center text-center gap-4 mb-8 border-b border-slate-200 pb-8">
          <Link href="/" className="cursor-pointer hover:opacity-90 transition-opacity">
            <Image src="/images/LOGO_01_ChatGPT_S.jpg" alt="X-DIC Logo" width={160} height={80} className="object-contain" priority />
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            엑스딕(X-DIC) 필수 영어회화 가이드
          </h1>
          <p className="text-slate-500 max-w-2xl text-sm md:text-base leading-relaxed">
            여행, 일상, 비즈니스 상황에서 원어민들이 가장 자주 사용하는 핵심 영어 문장과 그 속에 숨겨진 뉘앙스를 완벽하게 분석해 드립니다. {isApp ? '' : '마이크 버튼을 눌러 원어민의 발음을 직접 확인해 보세요!'}
          </p>
          <Link href="/admin-write" className="mt-2 text-xs font-bold text-blue-500 hover:underline border border-blue-200 px-3 py-1 rounded-full bg-white">
            + 관리자 해설 등록
          </Link>
        </div>
      </div>

      <main className="w-full flex-grow mb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-12">
          {loading ? (
            <div className="text-center py-12 text-slate-400 font-bold">데이터를 불러오는 중입니다...</div>
          ) : (
            categories.map((categoryName, idx) => {
              const items = data.filter(d => d.category === categoryName);
              if (items.length === 0) return null;

              return (
                <section key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-800 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">{categoryName}</h2>
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    {items.map((item, itemIdx) => (
                      <article key={itemIdx} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-4 mb-3">
                          {/* 🌟 앱일 때는 전체 회화 페이지의 음성 버튼도 숨김! */}
                          {!isApp && (
                            <button
                              onClick={() => handleSpeak(`${item.en_text} ... ${item.ko_text}`)}
                              className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm mt-1"
                              title="원어민 발음 듣기"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM14 10a4.002 4.002 0 00-1.172-2.828.75.75 0 10-1.06 1.06c.586.586.914 1.378.914 2.207s-.328 1.62-.914 2.207a.75.75 0 101.06 1.06A4.002 4.002 0 0014 10z" />
                              </svg>
                            </button>
                          )}
                          
                          <div>
                            <h3 className="text-lg md:text-xl font-extrabold text-blue-700 mb-1 leading-snug">
                              {item.en_text}
                            </h3>
                            <p className="text-base font-bold text-slate-800 mb-3">
                              {item.ko_text}
                            </p>
                          </div>
                        </div>
                        
                        <div className="ml-14 bg-slate-100 rounded-xl p-4 border border-slate-200 text-sm md:text-base text-slate-600 leading-relaxed whitespace-pre-wrap">
                          <span className="font-extrabold text-slate-700 mr-2">💡 번역가 해설: </span>
                          {item.description}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}