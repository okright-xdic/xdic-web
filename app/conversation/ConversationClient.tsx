// app/conversation/ConversationClient.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import AdSensePlaceholder from '@/components/ads/AdSensePlaceholder';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { useRouter, useSearchParams } from 'next/navigation';

// 🌟 'todays' 카테고리가 새롭게 추가되었습니다!
const CATEGORY_MAP: Record<string, string> = {
  'todays': "💡 오늘의 영어회화 (Today's Picks)",
  'travel': "✈️ 여행 영어 (Travel English)",
  'casual': "☕ 일상 회화 (Casual Conversation)",
  'business': "💼 비즈니스 회화 (Business English)"
};

export default function ConversationClient({ initialData = [] }: { initialData: any[] }) {
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const itemParam = searchParams.get('id');
  const isDailyDetail = typeParam === 'daily';
  
  const selectedCategory = isDailyDetail
    ? "💡 오늘의 영어회화"
    : (typeParam && CATEGORY_MAP[typeParam] ? CATEGORY_MAP[typeParam] : null);

  const [supabase] = useState(() => createClientComponentClient());
  const [data, setData] = useState<any[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [isApp, setIsApp] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ category: '', en_text: '', ko_text: '', description: '' });
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setLoading(true);
    const { data: lines, error } = await supabase
      .from('conversation_lines')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && lines) setData(lines);
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && Capacitor.isNativePlatform()) {
      setIsApp(true);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // ================================================================
  // ☆ TwoPro v1.59-safe: 메인 '오늘의 영어회화' 상세 링크 처리
  // - SearchPage의 자동 일일 회화는 conversation_lines 최근 90개 중에서 선택됩니다.
  // - ?type=daily&id=... 로 들어오면 그 항목이 있는 목록 페이지를 맞춥니다.
  // ================================================================
  useEffect(() => {
    if (!isDailyDetail || !itemParam) return;

    const dailyItems = [...data]
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 90);

    const selectedIndex = dailyItems.findIndex(item => String(item.id) === itemParam);
    if (selectedIndex >= 0) {
      setCurrentPage(Math.floor(selectedIndex / itemsPerPage) + 1);
    }
  }, [isDailyDetail, itemParam, data]);

  const handleAdminLogin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setEditingId(null);
      alert('관리자 모드가 해제되었습니다.');
      return;
    }
    const pwd = prompt('관리자 비밀번호를 입력하세요:');
    if (pwd === 'okright91088!!') {
      setIsAdmin(true);
      alert('관리자 모드로 접속되었습니다. 게시물을 자유롭게 수정/삭제/게시할 수 있습니다.');
    } else if (pwd !== null) {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 이 회화 게시물을 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('conversation_lines').delete().eq('id', id);
    if (error) {
      alert('삭제에 실패했습니다: ' + error.message);
    } else {
      alert('성공적으로 삭제되었습니다.');
      fetchData(); 
    }
  };

  const handleSetTodaysPick = async (id: number) => {
    if (!confirm('이 문장을 메인 화면의 "오늘의 영어회화"로 게시하시겠습니까?')) return;

    try {
      // 🌟 이전 코드를 지우고, 과거 내역을 덮어쓰지 않고 시간(picked_at)만 기록합니다!
      const { error } = await supabase
        .from('conversation_lines')
        .update({ 
          is_todays_pick: true,
          picked_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;
      
      alert('메인 화면 "오늘의 영어회화"에 성공적으로 게시되었습니다! 🚀');
      fetchData(); // 갱신된 데이터를 다시 불러옵니다.
    } catch (err: any) {
      alert('게시 실패: ' + err.message);
    }
  };

  const handleEditSave = async (id: number) => {
    if (!editForm.en_text.trim() || !editForm.ko_text.trim() || !editForm.description.trim()) {
      alert('영어 문장, 한국어 뜻, 해설을 모두 입력해주세요.');
      return;
    }
    const { error } = await supabase.from('conversation_lines').update({
      category: editForm.category,
      en_text: editForm.en_text,
      ko_text: editForm.ko_text,
      description: editForm.description
    }).eq('id', id);

    if (error) {
      alert('수정에 실패했습니다: ' + error.message);
    } else {
      alert('성공적으로 수정되었습니다!');
      setEditingId(null);
      fetchData(); 
    }
  };

  const handleCopy = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      alert('복사 기능을 지원하지 않는 기기입니다.');
    }
  };

  // ================================================================
  // ☆ TwoPro v1.68-safe: 회화 상세 페이지 웹/앱 공용 TTS
  // - 웹: SpeechSynthesis
  // - 설치형 앱: @capacitor-community/text-to-speech Native TTS
  // - 대표 문장: 영어 → 한국어
  // - 번역가 해설 예문: 화면 원문 순서인 한국어 → 영어
  // ================================================================
  type ConversationSpeakPart = {
    text: string;
    lang: 'ko-KR' | 'en-US';
    rate: number;
    pitch: number;
  };

  const speakConversationParts = async (parts: ConversationSpeakPart[]) => {
    const safeParts = parts.filter((part) => String(part.text || '').trim());
    if (safeParts.length === 0) return;

    if (Capacitor.isNativePlatform()) {
      try {
        try { await TextToSpeech.stop(); } catch {}

        for (const part of safeParts) {
          const languageResult = await TextToSpeech.isLanguageSupported({
            lang: part.lang,
          });

          if (!languageResult?.supported) {
            throw new Error(`TTS_LANGUAGE_NOT_SUPPORTED:${part.lang}`);
          }

          await TextToSpeech.speak({
            text: part.text,
            lang: part.lang,
            rate: part.rate,
            pitch: part.pitch,
            volume: 1.0,
            queueStrategy: 0,
          });
        }

        return;
      } catch (err) {
        console.warn('[X-DIC ConversationClient Native TTS]', err);
      }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const voices = window.speechSynthesis.getVoices();
      const enVoices = voices.filter(v => v.lang.startsWith('en'));
      const koVoices = voices.filter(v => v.lang.startsWith('ko'));

      for (const part of safeParts) {
        const utterance = new SpeechSynthesisUtterance(part.text);

        if (part.lang === 'en-US') {
          const enVoice =
            enVoices.find(v => v.name.includes('Google US English Male')) ||
            enVoices.find(v => v.name.includes('Google US English')) ||
            enVoices[0];

          if (enVoice) utterance.voice = enVoice;
          utterance.lang = enVoice ? enVoice.lang : 'en-US';
        } else {
          const koVoice =
            koVoices.find(v => v.name.includes('Google') && v.name.includes('Male')) ||
            koVoices[0];

          if (koVoice) utterance.voice = koVoice;
          utterance.lang = koVoice ? koVoice.lang : 'ko-KR';
        }

        utterance.rate = part.rate;
        utterance.pitch = part.pitch;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      }

      return;
    }

    alert('이 기기에서는 음성 듣기를 사용할 수 없습니다.');
  };

  const handleSpeak = async (enText: string, koText: string) => {
    await speakConversationParts([
      { text: String(enText || '').trim(), lang: 'en-US', rate: 0.85, pitch: 0.95 },
      { text: String(koText || '').trim(), lang: 'ko-KR', rate: 1.05, pitch: 1.0 },
    ]);
  };


  // ================================================================
  // ☆ TwoPro v1.61-safe: 번역가 해설 안의 학습 예문 자동 스피커
  //
  // 관리자가 description에
  //   "다음은 다양한 예문입니다. 참고하세요."
  // 를 넣으면 그 아래 줄만 예문 영역으로 인식합니다.
  //
  // 예문은
  //   한국어 문장. English sentence.
  // 형식일 때만 안전하게 분리하고, 한·영이 모두 있으면 원문 순서대로 한국어 → 영어 순서로 읽습니다.
  // 분리에 실패한 줄은 기존 일반 텍스트로 그대로 표시합니다.
  // ================================================================
  const handleSpeakEnglishOnly = async (enText: string) => {
    const english = String(enText || '').trim();
    if (!english) return;

    await speakConversationParts([
      { text: english, lang: 'en-US', rate: 0.85, pitch: 0.95 },
    ]);
  };

  // 번역가 해설 예문은 DB 원문 표시 순서(한국어 → 영어)를 그대로 읽습니다.
  const handleSpeakKoreanThenEnglish = async (koText: string, enText: string) => {
    const korean = String(koText || '').trim();
    const english = String(enText || '').trim();
    if (!korean && !english) return;

    await speakConversationParts([
      { text: korean, lang: 'ko-KR', rate: 1.05, pitch: 1.0 },
      { text: english, lang: 'en-US', rate: 0.85, pitch: 0.95 },
    ]);
  };

  const splitBilingualExampleV161 = (line: string) => {
    const normalized = String(line || '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!normalized) return null;

    // 한국어 문장부호 뒤에 영문 문장이 시작되는 형태를 우선 사용합니다.
    // 일반 입력: "영수증을 가지고 계신가요? Do you have the receipt?"
    // 기존 자료 입력: "죄송하지만, 이것 좀 도와주시겠어요? , I'm sorry to bother you..."
    // 처럼 한국어 문장부호와 영어 사이에 쉼표가 하나 더 들어간 경우도 안전하게 허용합니다.
    const boundary = /[.!?。！？](?:\s*[,，]\s*|\s+)(?=["“‘']?[A-Z])/u.exec(normalized);

    if (boundary && typeof boundary.index === 'number') {
      const koreanEnd = boundary.index + 1;
      const korean = normalized.slice(0, koreanEnd).trim();
      const english = normalized
        .slice(boundary.index + boundary[0].length)
        .trim();

      const englishWordCount =
        english.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)?.length || 0;

      if (
        /[가-힣]/u.test(korean) &&
        /^[“”"'‘’]?[A-Z]/u.test(english) &&
        englishWordCount >= 2
      ) {
        return { korean, english };
      }
    }

    // 영어만 단독으로 입력된 예문도 학습용 스피커를 허용합니다.
    if (
      !/[가-힣]/u.test(normalized) &&
      /^[“”"'‘’]?[A-Z]/u.test(normalized) &&
      (normalized.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)?.length || 0) >= 2
    ) {
      return { korean: '', english: normalized };
    }

    return null;
  };

  const parseDescriptionExamplesV161 = (description: any) => {
    const source = String(description || '').replace(/\r\n?/g, '\n');
    const lines = source.split('\n');

    const markerIndex = lines.findIndex((line) => {
      const compact = String(line || '')
        .replace(/\s+/g, ' ')
        .trim();

      return compact.includes('다양한 예문') && compact.includes('참고하세요');
    });

    if (markerIndex < 0) {
      return {
        hasExamples: false,
        intro: source,
        marker: '',
        examples: [] as Array<{
          raw: string;
          korean: string;
          english: string;
          speakable: boolean;
        }>,
      };
    }

    const intro = lines
      .slice(0, markerIndex)
      .join('\n')
      .trimEnd();

    const marker =
      String(lines[markerIndex] || '').trim() ||
      '다음은 다양한 예문입니다. 참고하세요.';

    const examples = lines
      .slice(markerIndex + 1)
      .map((line) => String(line || '').trim())
      .filter(Boolean)
      .map((raw) => {
        const parsed = splitBilingualExampleV161(raw);

        return parsed
          ? {
              raw,
              korean: parsed.korean,
              english: parsed.english,
              speakable: true,
            }
          : {
              raw,
              korean: '',
              english: '',
              speakable: false,
            };
      });

    return {
      hasExamples: examples.length > 0,
      intro,
      marker,
      examples,
    };
  };

  const renderDescriptionV161 = (description: any, itemKey: string | number) => {
    const parsed = parseDescriptionExamplesV161(description);

    if (!parsed.hasExamples) {
      return (
        <>
          <span className="font-extrabold text-slate-700 mr-2">💡 번역가 해설: </span>
          {description}
        </>
      );
    }

    return (
      <div>
        <div className="whitespace-pre-wrap">
          <span className="font-extrabold text-slate-700 mr-2">💡 번역가 해설: </span>
          {parsed.intro}
        </div>

        <p className="mt-4 mb-2 font-medium text-slate-600">
          {parsed.marker}
        </p>

        <div className="space-y-1.5">
          {parsed.examples.map((example, index) => (
            <div
              key={`${String(itemKey)}-example-${index}`}
              className="flex items-start gap-2"
            >
              {example.speakable ? (
                <button
                  type="button"
                  onClick={() =>
                    example.korean
                      ? handleSpeakKoreanThenEnglish(example.korean, example.english)
                      : handleSpeakEnglishOnly(example.english)
                  }
                  className="mt-0.5 w-7 h-7 shrink-0 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                  title={example.korean ? "한국어·영어 예문 발음 듣기" : "영어 예문 발음 듣기"}
                  aria-label={
                    example.korean
                      ? `한국어·영어 예문 ${index + 1} 발음 듣기`
                      : `영어 예문 ${index + 1} 발음 듣기`
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM14 10a4.002 4.002 0 00-1.172-2.828.75.75 0 10-1.06 1.06c.586.586.914 1.378.914 2.207s-.328 1.62-.914 2.207a.75.75 0 101.06 1.06A4.002 4.002 0 0014 10z" />
                  </svg>
                </button>
              ) : (
                <span className="w-7 shrink-0" aria-hidden="true" />
              )}

              {example.speakable ? (
                <p className="min-w-0 flex-1 leading-relaxed">
                  {example.korean && (
                    <span className="text-slate-600">{example.korean} </span>
                  )}
                  <span className="text-slate-700">{example.english}</span>
                </p>
              ) : (
                <p className="min-w-0 flex-1 leading-relaxed text-slate-600">
                  {example.raw}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderItem = (item: any, itemIdx: number) => (
    <React.Fragment key={item.id || itemIdx}>
      {isAdmin && editingId === item.id ? (
        <div className="p-6 bg-blue-50 border-b border-blue-200">
          <div className="flex flex-col gap-3">
            <select
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              className="p-3 border border-blue-300 rounded-lg text-sm font-bold text-slate-700 outline-none"
            >
              {Object.entries(CATEGORY_MAP)
                .filter(([key]) => key !== 'todays') // 🌟 관리자가 수동으로 '오늘의회화'를 기본 카테고리로 지정하는 것 방지
                .map(([_, cat]) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              value={editForm.en_text}
              onChange={(e) => setEditForm({ ...editForm, en_text: e.target.value })}
              className="p-3 border border-blue-300 rounded-lg font-extrabold text-blue-700 outline-none"
            />
            <input
              type="text"
              value={editForm.ko_text}
              onChange={(e) => setEditForm({ ...editForm, ko_text: e.target.value })}
              className="p-3 border border-blue-300 rounded-lg font-bold text-slate-800 outline-none"
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="p-3 border border-blue-300 rounded-lg h-32 text-sm text-slate-700 outline-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setEditingId(null)} className="px-5 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 font-bold text-sm">취소</button>
              <button onClick={() => handleEditSave(item.id)} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-sm shadow-sm">수정 완료</button>
            </div>
          </div>
        </div>
      ) : (
        <article className="p-6 hover:bg-slate-50 transition-colors">
          <div className="flex items-start gap-4 mb-3">
            <div className="flex-shrink-0 flex items-center gap-1.5 mt-1">
              <button onClick={() => handleSpeak(item.en_text, item.ko_text)} className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm" title="원어민 발음 듣기">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM14 10a4.002 4.002 0 00-1.172-2.828.75.75 0 10-1.06 1.06c.586.586.914 1.378.914 2.207s-.328 1.62-.914 2.207a.75.75 0 101.06 1.06A4.002 4.002 0 0014 10z" /></svg>
              </button>
              <button onClick={() => handleCopy(`${item.en_text}\n${item.ko_text}`, item.id)} className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all flex items-center justify-center shadow-sm" title="문장 복사">
                {copiedId === item.id ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-500"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
                )}
              </button>
            </div>
            
            <div>
              <h3 className="text-lg md:text-xl font-extrabold text-blue-700 mb-1 leading-snug">{item.en_text}</h3>
              <p className="text-base font-bold text-slate-800 mb-3">{item.ko_text}</p>
            </div>
          </div>
          
          <div className="ml-14 bg-slate-100 rounded-xl p-4 border border-slate-200 text-sm md:text-base text-slate-600 leading-relaxed">
            {renderDescriptionV161(item.description, item.id || itemIdx)}
          </div>

          {isAdmin && (
            <div className="ml-14 flex justify-end gap-2 mt-4 pt-4 border-t border-slate-200/60">
              <button 
                onClick={() => handleSetTodaysPick(item.id)}
                className="text-xs px-4 py-1.5 border border-orange-200 text-orange-600 bg-white rounded hover:bg-orange-50 transition-colors font-bold shadow-sm"
              >
                게시
              </button>
              <button onClick={() => { setEditingId(item.id); setEditForm({ category: item.category, en_text: item.en_text, ko_text: item.ko_text, description: item.description }); }} className="text-xs px-4 py-1.5 border border-blue-200 text-blue-600 rounded hover:bg-blue-50 transition-colors font-bold shadow-sm">수정</button>
              <button onClick={() => handleDelete(item.id)} className="text-xs px-4 py-1.5 border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors font-bold shadow-sm">삭제</button>
            </div>
          )}
        </article>
      )}
    </React.Fragment>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="flex-none w-full max-w-4xl mx-auto px-4 md:px-6 pt-8 md:pt-16 pb-6">
        <div className="flex items-center justify-between w-full mb-6 px-1">
          <button onClick={() => selectedCategory ? router.push('/conversation') : router.back()} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            {selectedCategory ? '전체 목록' : '뒤로'}
          </button>
          <Link href={isApp ? '/app' : '/'} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            홈으로
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center text-center gap-4 mb-8 border-b border-slate-200 pb-8">
          <Link href={isApp ? '/app' : '/'} className="cursor-pointer hover:opacity-90 transition-opacity">
            <Image src="/images/LOGO_01_ChatGPT_S.jpg" alt="X-DIC Logo" width={160} height={80} className="object-contain" priority />
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            엑스딕 필수 영어회화 가이드
          </h1>
          <p className="text-slate-500 max-w-2xl text-sm md:text-base leading-relaxed">
            여행, 일상, 비즈니스 상황에서 원어민들이 가장 자주 사용하는 핵심 영어 문장과 뉘앙스를 완벽하게 분석해 드립니다.
          </p>
          <Link href="/admin-write" className="mt-2 text-xs font-bold text-blue-500 hover:underline border border-blue-200 px-3 py-1 rounded-full bg-white">
            + 관리자 해설 등록
          </Link>
        </div>
      </div>

      <main className="w-full flex-grow mb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {loading ? (
            <div className="text-center py-12 text-slate-400 font-bold">데이터를 불러오는 중입니다...</div>
          ) : selectedCategory ? (
            isDailyDetail ? (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {(() => {
                  // SearchPage와 동일하게 최근 90개 conversation_lines를 오늘의 회화 후보군으로 사용합니다.
                  const dailyItems = [...data]
                    .sort((a, b) => {
                      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                      return dateB - dateA;
                    })
                    .slice(0, 90);

                  const selectedDaily = (
                    itemParam
                      ? dailyItems.find(item => String(item.id) === itemParam)
                      : null
                  ) ?? dailyItems[0] ?? null;

                  const totalPages = Math.ceil(dailyItems.length / itemsPerPage) || 1;
                  const indexOfLastItem = currentPage * itemsPerPage;
                  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                  const currentItems = dailyItems.slice(indexOfFirstItem, indexOfLastItem);

                  return (
                    <>
                      {/* 현재 메인에서 클릭한 '오늘의 영어회화' 1건 전체 내용 */}
                      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                        <div className="bg-slate-800 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h2 className="text-xl md:text-2xl font-bold text-white">💡 오늘의 영어회화</h2>
                          {selectedDaily?.category && (
                            <span className="text-xs font-bold text-slate-200 bg-slate-700/80 px-3 py-1 rounded-full">
                              {selectedDaily.category}
                            </span>
                          )}
                        </div>

                        {selectedDaily ? (
                          renderItem(selectedDaily, 0)
                        ) : (
                          <div className="p-10 text-center text-slate-400 font-bold">
                            표시할 오늘의 영어회화가 없습니다.
                          </div>
                        )}
                      </section>

                      {/* 영단어 뉘앙스와 같은 번호형 목록 */}
                      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-200">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h3 className="text-lg md:text-xl font-extrabold text-slate-800">영어회화 목록</h3>
                              <p className="mt-1 text-xs md:text-sm text-slate-500">
                                문장을 누르면 해당 회화의 전체 내용이 위에 표시됩니다.
                              </p>
                            </div>
                            <span className="text-xs font-bold text-slate-400 whitespace-nowrap">총 {dailyItems.length}개</span>
                          </div>
                        </div>

                        <div className="flex items-center py-3 border-b-2 border-blue-500 bg-white text-sm md:text-base font-bold text-slate-700 text-center">
                          <div className="w-16 md:w-20">번호</div>
                          <div className="flex-1 text-left px-4">영어회화</div>
                        </div>

                        <div className="flex flex-col">
                          {currentItems.length === 0 ? (
                            <div className="text-center py-16 text-slate-400 font-medium text-sm">등록된 회화가 없습니다.</div>
                          ) : (
                            currentItems.map((item, index) => {
                              const absoluteIndex = indexOfFirstItem + index;
                              const displayNum = dailyItems.length - absoluteIndex;
                              const isCurrent = selectedDaily && String(selectedDaily.id) === String(item.id);

                              return (
                                <Link
                                  key={item.id || absoluteIndex}
                                  href={`/conversation?type=daily&id=${encodeURIComponent(String(item.id))}`}
                                  className={`flex items-center py-4 border-b border-slate-100 last:border-0 transition-colors ${isCurrent ? 'bg-blue-50/80' : 'hover:bg-slate-50'}`}
                                  aria-current={isCurrent ? 'page' : undefined}
                                >
                                  <div className={`w-16 md:w-20 text-center text-[13px] md:text-sm font-bold ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>
                                    {displayNum}
                                  </div>
                                  <div className="flex-1 min-w-0 text-left px-4">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <p className={`text-[14px] md:text-[15px] font-bold truncate ${isCurrent ? 'text-blue-700' : 'text-slate-800'}`}>
                                        {item.en_text}
                                      </p>
                                      {isCurrent && (
                                        <span className="shrink-0 text-[10px] font-extrabold text-blue-600 border border-blue-200 bg-white rounded-full px-2 py-0.5">
                                          현재
                                        </span>
                                      )}
                                    </div>
                                    <p className="mt-1 text-[12px] md:text-[13px] text-slate-500 truncate">
                                      {item.ko_text}
                                    </p>
                                  </div>
                                  <div className="pr-5 text-slate-300" aria-hidden="true">›</div>
                                </Link>
                              );
                            })
                          )}
                        </div>
                      </section>

                      {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8 mb-4 font-sans flex-wrap">
                          <button
                            onClick={() => { setCurrentPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded text-sm text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            &lt;&lt;
                          </button>
                          <button
                            onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded text-sm text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            &lt;
                          </button>

                          <div className="flex items-center gap-1 mx-2 flex-wrap justify-center">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                              <button
                                key={num}
                                onClick={() => { setCurrentPage(num); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all ${currentPage === num ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700'}`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded text-sm text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            &gt;
                          </button>
                          <button
                            onClick={() => { setCurrentPage(totalPages); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded text-sm text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            &gt;&gt;
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </section>
            ) : (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-800 px-6 py-5 flex justify-between items-center">
                  <h2 className="text-xl md:text-2xl font-bold text-white">{selectedCategory}</h2>
                  <span className="text-sm font-medium text-slate-300">
                    총 {typeParam === 'todays' ? data.filter(d => d.is_todays_pick).length : data.filter(d => d.category === selectedCategory).length}개
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {(() => {
                    // 기존 오늘의 수동 게시(today's picks) 및 카테고리 목록은 그대로 보존합니다.
                    const filteredData = typeParam === 'todays'
                      ? data.filter(d => d.is_todays_pick).sort((a, b) => {
                          const dateA = a.picked_at ? new Date(a.picked_at).getTime() : 0;
                          const dateB = b.picked_at ? new Date(b.picked_at).getTime() : 0;
                          return dateB - dateA;
                        })
                      : data.filter(d => d.category === selectedCategory);

                    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

                    return (
                      <>
                        {currentItems.map((item, idx) => renderItem(item, idx))}
                        {totalPages > 1 && (
                          <div className="flex justify-center items-center gap-2 p-6 bg-slate-50 border-t border-slate-200">
                            <button onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0, 0); }} disabled={currentPage === 1} className="text-sm font-bold text-slate-500 hover:text-blue-600 disabled:opacity-30 px-3 py-2">이전</button>
                            <div className="flex items-center gap-1.5 mx-2">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                                <button key={num} onClick={() => { setCurrentPage(num); window.scrollTo(0, 0); }} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold transition-all ${currentPage === num ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'text-slate-500 hover:bg-blue-100 hover:text-blue-700'}`}>{num}</button>
                              ))}
                            </div>
                            <button onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0, 0); }} disabled={currentPage === totalPages} className="text-sm font-bold text-slate-500 hover:text-blue-600 disabled:opacity-30 px-3 py-2">다음</button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </section>
            )
          ) : (
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* ================================================================
                  ☆ TwoPro v1.60-safe: 엑스딕 필수 영어회화 전체보기
                  - 오늘의 영어회화는 별도 상세/목록 페이지로 분리
                  - /conversation 기본 화면에는 여행/일상/비즈니스 3개 분류만 표시
                  - 방금 만든 오늘의 영어회화 번호형 목록과 같은 구조 사용
                 ================================================================ */}
              <div className="px-6 py-5 border-b border-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg md:text-xl font-extrabold text-slate-800">엑스딕 필수 영어회화 목록</h2>
                    <p className="mt-1 text-xs md:text-sm text-slate-500">
                      여행, 일상, 비즈니스 회화를 분류별로 확인할 수 있습니다.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 whitespace-nowrap">총 3개 분류</span>
                </div>
              </div>

              <div className="flex items-center py-3 border-b-2 border-blue-500 bg-white text-sm md:text-base font-bold text-slate-700 text-center">
                <div className="w-16 md:w-20">번호</div>
                <div className="flex-1 text-left px-4">영어회화 분류</div>
                <div className="hidden sm:block w-20 md:w-24">문장 수</div>
              </div>

              <div className="flex flex-col">
                {[
                  { key: 'travel', label: CATEGORY_MAP.travel },
                  { key: 'casual', label: CATEGORY_MAP.casual },
                  { key: 'business', label: CATEGORY_MAP.business },
                ].map((category, index) => {
                  const itemCount = data.filter(d => d.category === category.label).length;

                  return (
                    <Link
                      key={category.key}
                      href={`/conversation?type=${category.key}`}
                      className="flex items-center py-4 border-b border-slate-100 last:border-0 hover:bg-blue-50/60 transition-colors"
                    >
                      <div className="w-16 md:w-20 text-center text-[13px] md:text-sm font-bold text-slate-400">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0 text-left px-4">
                        <p className="text-[14px] md:text-[15px] font-extrabold text-slate-800">
                          {category.label}
                        </p>
                      </div>
                      <div className="hidden sm:block w-20 md:w-24 text-center text-[12px] md:text-sm font-bold text-slate-400">
                        {itemCount}개
                      </div>
                      <div className="pr-5 text-slate-300" aria-hidden="true">›</div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {!isApp && !loading && data.length > 0 && (
            <div className="mt-12 mb-4 w-full flex justify-center">
              <AdSensePlaceholder adSlot="2218001895" debugLabel="PC_회화_하단" minHeight={250} />
            </div>
          )}

          <div className="flex items-center justify-between w-full mt-16 mb-12 px-1 pt-8 pb-4 border-t border-slate-200">
            <button onClick={() => selectedCategory ? router.push('/conversation') : router.back()} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              {selectedCategory ? '전체 목록' : '뒤로'}
            </button>
            <Link href={isApp ? '/app' : '/'} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
              홈으로
            </Link>
          </div>

          <div className="flex justify-center pb-12">
            <button onClick={handleAdminLogin} className="text-[12px] text-slate-400 hover:text-slate-600 underline font-medium">
              {isAdmin ? '관리자 로그아웃' : '관리자 로그인'}
            </button>
          </div>
        </div>
      </main>

      {!isApp && <Footer />}
    </div>
  );
}

