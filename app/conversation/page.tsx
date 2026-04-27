// app/conversation/page.tsx
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import AdSensePlaceholder from '@/components/ads/AdSensePlaceholder';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Capacitor } from '@capacitor/core';
import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORY_MAP: Record<string, string> = {
  'travel': "✈️ 여행 영어 (Travel English)",
  'casual': "☕ 일상 회화 (Casual Conversation)",
  'business': "💼 비즈니스 회화 (Business English)"
};

function ConversationMain() {
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  
  const selectedCategory = typeParam && CATEGORY_MAP[typeParam] ? CATEGORY_MAP[typeParam] : null;

  const [supabase] = useState(() => createClientComponentClient());
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetchData();
  }, [supabase]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

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

  // 🌟 오늘의 영어회화 '게시' 처리 함수
  const handleSetTodaysPick = async (id: number) => {
    if (!confirm('이 문장을 메인 화면의 "오늘의 영어회화"로 게시하시겠습니까?')) return;

    try {
      await supabase.from('conversation_lines').update({ is_todays_pick: false }).neq('id', 0);
      
      const { error } = await supabase
        .from('conversation_lines')
        .update({ is_todays_pick: true })
        .eq('id', id);

      if (error) throw error;
      
      alert('메인 화면 "오늘의 영어회화"에 성공적으로 게시되었습니다! 🚀');
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

  // 🌟 [수정 완료] 한/영 분리하여 본섭의 두 남자 아나운서가 순서대로 읽도록 세팅!
  const handleSpeak = (enText: string, koText: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const voices = window.speechSynthesis.getVoices();
      const enVoices = voices.filter(v => v.lang.startsWith('en'));
      const koVoices = voices.filter(v => v.lang.startsWith('ko'));

      const enVoice = enVoices.find(v => v.name.includes('Google US English Male')) || enVoices.find(v => v.name.includes('Google US English')) || enVoices[0];
      const koVoice = koVoices.find(v => v.name.includes('Google') && v.name.includes('Male')) || koVoices[0];

      const enUtterance = new SpeechSynthesisUtterance(enText);
      if (enVoice) enUtterance.voice = enVoice;
      enUtterance.lang = enVoice ? enVoice.lang : 'en-US';
      enUtterance.rate = 0.85;

      const koUtterance = new SpeechSynthesisUtterance(koText);
      if (koVoice) koUtterance.voice = koVoice;
      koUtterance.lang = koVoice ? koVoice.lang : 'ko-KR';
      koUtterance.rate = 1.05;

      window.speechSynthesis.speak(enUtterance);
      window.speechSynthesis.speak(koUtterance);
    } else {
      alert('이 브라우저는 음성 듣기를 지원하지 않습니다.');
    }
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
              {Object.values(CATEGORY_MAP).map((cat) => (
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
              {!isApp && (
                // 🌟 [수정 완료] 한영 매개변수를 각각 따로따로 넘겨줍니다!
                <button onClick={() => handleSpeak(item.en_text, item.ko_text)} className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm" title="원어민 발음 듣기">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM14 10a4.002 4.002 0 00-1.172-2.828.75.75 0 10-1.06 1.06c.586.586.914 1.378.914 2.207s-.328 1.62-.914 2.207a.75.75 0 101.06 1.06A4.002 4.002 0 0014 10z" /></svg>
                </button>
              )}
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
          
          <div className="ml-14 bg-slate-100 rounded-xl p-4 border border-slate-200 text-sm md:text-base text-slate-600 leading-relaxed whitespace-pre-wrap">
            <span className="font-extrabold text-slate-700 mr-2">💡 번역가 해설: </span>
            {item.description}
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
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-800 px-6 py-5 flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-white">{selectedCategory}</h2>
                <span className="text-sm font-medium text-slate-300">
                  총 {data.filter(d => d.category === selectedCategory).length}개
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {(() => {
                  const filteredData = data.filter(d => d.category === selectedCategory);
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
          ) : (
            <div className="space-y-12">
              {Object.entries(CATEGORY_MAP).map(([urlKey, categoryName]) => {
                const categoryItems = data.filter(d => d.category === categoryName);
                if (categoryItems.length === 0) return null;
                const previewItems = categoryItems.slice(0, 5);
                return (
                  <section key={urlKey} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h2 className="text-xl font-bold text-white">{categoryName}</h2>
                      <Link href={`/conversation?type=${urlKey}`} className="text-sm font-bold text-slate-200 bg-slate-700 hover:bg-blue-600 px-4 py-1.5 rounded-full transition-colors shadow-sm text-center">
                        더보기 &gt;
                      </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {previewItems.map((item, idx) => renderItem(item, idx))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}

          {!isApp && (
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

export default function ConversationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400 font-bold">로딩 중...</div>}>
      <ConversationMain />
    </Suspense>
  );
}