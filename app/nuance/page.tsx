'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
// 🌟 통일성을 위해 검색창과 푸터 추가!
import SearchInput from '@/components/SearchInput';
import Footer from '@/components/Footer';

interface Nuance {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function NuancePage() {
  const supabase = createClient();
  const [nuances, setNuances] = useState<Nuance[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const fetchNuances = async () => {
    const { data, error } = await supabase
      .from('nuances')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setNuances(data);
    if (error) console.error('불러오기 실패:', error);
  };

  useEffect(() => {
    fetchNuances();
  }, []);

  // 외부에서 id를 달고 접속했을 때 자동 펼치기 & 스크롤
  useEffect(() => {
    if (nuances.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const targetId = params.get('id');
      
      if (targetId) {
        const idNum = Number(targetId);
        setExpandedId(idNum); 
        
        setTimeout(() => {
          const element = document.getElementById(`nuance-${idNum}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [nuances]);

  const handleAdminLogin = () => {
    if (isAdmin) {
      setIsAdmin(false); setIsWriting(false); setEditingId(null);
      alert('관리자 모드가 해제되었습니다.');
      return;
    }
    const pwd = prompt('관리자 비밀번호를 입력하세요:');
    if (pwd === 'okright91088!!') {
      setIsAdmin(true);
      alert('관리자 모드로 접속되었습니다.');
    } else if (pwd !== null) {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return alert('제목과 내용을 모두 입력해주세요.');
    if (editingId) {
      await supabase.from('nuances').update({ title, content }).eq('id', editingId);
      alert('수정되었습니다!');
    } else {
      await supabase.from('nuances').insert([{ title, content }]);
      alert('등록되었습니다!');
    }
    resetForm();
    fetchNuances();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await supabase.from('nuances').delete().eq('id', id);
    alert('삭제되었습니다.');
    fetchNuances();
  };

  const handleEditClick = (nuance: Nuance) => {
    setEditingId(nuance.id); setTitle(nuance.title); setContent(nuance.content);
    setIsWriting(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => { setTitle(''); setContent(''); setIsWriting(false); setEditingId(null); };
  const toggleNuance = (id: number) => setExpandedId(expandedId === id ? null : id);
  const renderContentWithLineBreaks = (text: string) => text.replace(/\n/g, '<br />');

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (!file) continue;
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target?.result as string;
          const imgTag = `\n<img src="${base64String}" alt="첨부 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; border: 1px solid #e2e8f0;" />\n`;
          const textarea = e.target as HTMLTextAreaElement;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          setContent(content.substring(0, start) + imgTag + content.substring(end));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 md:bg-white">
      
      {/* 🌟 1. 다른 페이지와 동일한 엑스딕 공식 헤더 장착! */}
      <div className="flex-none w-full max-w-4xl mx-auto px-4 md:px-6 bg-white">
        <header className="w-full pt-8 pb-2 md:pt-16 md:pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 md:mb-8">
            <div className="flex-shrink-0">
              <Link href="/" className="cursor-pointer">
                <Image src="/images/LOGO_01_ChatGPT_S.jpg" alt="Logo" width={140} height={70} className="object-contain hover:opacity-90 transition-opacity" priority />
              </Link>
            </div>
            <div className="flex flex-col gap-1 justify-center text-center md:text-left">
              <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
                <h1 className="text-xl md:text-[24px] font-extrabold text-slate-800 leading-tight">
                  한영/영한사전 – 복합어 전문 엑스딕(X-DIC)!
                </h1>
              </Link>
              <p className="text-sm text-slate-500 font-medium">Korean-English/English-Korean dictionary</p>
            </div>
          </div>
          <div className="w-full"><SearchInput /></div>
        </header>
      </div>

      {/* 2. 게시판 메인 컨텐츠 */}
      <main className="w-full flex-grow bg-slate-50 pb-20">
        <div className="max-w-4xl mx-auto mt-8 px-4 md:px-6">

          {/* 타이틀 및 새 글 쓰기 버튼 */}
          <div className="flex items-center justify-between mb-6 px-2">
             <div className="flex items-center gap-2">
                <span className="text-2xl">💡</span>
                <h2 className="text-xl md:text-2xl font-black text-slate-800">
                   영단어 뉘앙스 & 숙어 해설
                </h2>
             </div>
             {isAdmin && !isWriting && (
                <button onClick={() => { resetForm(); setIsWriting(true); }} className="bg-emerald-600 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-md transition-all">
                  + 새 해설 쓰기
                </button>
             )}
          </div>

          {/* 에디터 폼 */}
          {isAdmin && isWriting && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-emerald-400 mb-8 animate-in fade-in slide-in-from-top-4">
              <h2 className="text-lg font-bold text-emerald-700 mb-4 flex items-center gap-2"><span>✍️</span> {editingId ? '해설 수정하기' : '새 해설 작성'}</h2>
              <input type="text" placeholder="제목을 입력하세요 (예: say, tell, speak, talk의 차이점)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg mb-4 text-sm font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
              <textarea placeholder="워드에서 작성한 글이나 사진을 그대로 붙여넣기 하세요!" value={content} onChange={(e) => setContent(e.target.value)} onPaste={handlePaste} className="w-full p-3 border border-slate-300 rounded-lg mb-4 h-80 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
              <div className="flex justify-end gap-3">
                <button onClick={resetForm} className="px-5 py-2 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-100 font-bold transition-colors">취소</button>
                <button onClick={handleSave} className="px-5 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 font-bold shadow-sm transition-colors">{editingId ? '수정 완료' : '저장하기'}</button>
              </div>
            </div>
          )}

          {/* 🌟 3. 리스트 영역 (번호 No. 디자인 추가!) */}
          <div className="space-y-4">
            {nuances.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300"><p className="text-slate-400 font-medium text-sm">등록된 해설이 없습니다.</p></div>
            ) : (
              nuances.map((nuance, index) => (
                <article key={nuance.id} id={`nuance-${nuance.id}`} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                  
                  {/* 펼치기/접기 헤더 */}
                  <div onClick={() => toggleNuance(nuance.id)} className={`px-5 md:px-6 py-4 cursor-pointer flex justify-between items-center transition-colors ${expandedId === nuance.id ? 'bg-emerald-50/70' : 'hover:bg-slate-50'}`}>
                    <div className="flex items-center flex-1 gap-3 md:gap-4">
                      
                      {/* 🌟 번호(No.) 뱃지! (열렸을 땐 초록색 꽉 차게, 닫혔을 땐 연하게) */}
                      <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center text-[13px] font-black rounded-full transition-all ${expandedId === nuance.id ? 'bg-emerald-500 text-white shadow-md' : 'bg-emerald-100 text-emerald-700 shadow-inner'}`}>
                        {index + 1}
                      </span>
                      
                      <h2 className={`text-[15px] md:text-[17px] font-bold transition-colors ${expandedId === nuance.id ? 'text-emerald-700' : 'text-slate-800'}`}>
                        {nuance.title}
                      </h2>
                    </div>
                    
                    {/* 우측 +/- 아이콘 애니메이션 적용 */}
                    <span className={`flex-shrink-0 text-xl ml-4 transition-transform duration-300 flex items-center justify-center w-8 h-8 rounded-full ${expandedId === nuance.id ? 'text-emerald-600 bg-emerald-100 rotate-180' : 'text-slate-400 bg-slate-50'}`}>
                      {expandedId === nuance.id ? '−' : '＋'}
                    </span>
                  </div>

                  {/* 펼쳐지는 본문 내용 */}
                  {expandedId === nuance.id && (
                    <div className="p-6 md:p-8 border-t border-emerald-100 bg-white animate-in fade-in overflow-hidden">
                      <div className="text-slate-700 text-sm md:text-[16px] leading-loose break-keep font-sans" dangerouslySetInnerHTML={{ __html: renderContentWithLineBreaks(nuance.content) }} />
                      
                      {isAdmin && (
                        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-2">
                          <button onClick={() => handleEditClick(nuance)} className="text-xs px-4 py-2 border border-emerald-200 text-emerald-600 rounded-lg font-bold hover:bg-emerald-50 transition-colors">수정</button>
                          <button onClick={() => handleDelete(nuance.id)} className="text-xs px-4 py-2 border border-red-200 text-red-500 rounded-lg font-bold hover:bg-red-50 transition-colors">삭제</button>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>

          <div className="flex flex-col items-center justify-center pt-12 space-y-5">
            <button onClick={handleAdminLogin} className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-4">{isAdmin ? '관리자 로그아웃' : '관리자 로그인'}</button>
          </div>
        </div>
      </main>

      {/* 푸터 추가 */}
      <div className="flex-none bg-white"><Footer /></div>
    </div>
  );
}