'use client';

// 🌟 useRef라는 마법의 자물쇠 도구를 추가로 불러옵니다!
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import SearchInput from '@/components/SearchInput';
import Footer from '@/components/Footer';

interface Nuance {
  id: number;
  title: string;
  content: string;
  created_at: string;
  views?: number;
}

export default function NuancePage() {
  const supabase = createClient();
  const [nuances, setNuances] = useState<Nuance[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🌟 [핵심 해결책] 주소창을 읽고 이동하는 걸 '딱 한 번만' 하도록 기억하는 자물쇠입니다.
  const isUrlHandled = useRef(false);

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

  useEffect(() => {
    // 🌟 데이터가 있고, 아직 자물쇠가 안 잠겼을 때만(처음 1번만) 실행!
    if (nuances.length > 0 && !isUrlHandled.current) {
      isUrlHandled.current = true; // 🌟 한 번 실행했으니 자물쇠를 철칵! 잠급니다.

      const params = new URLSearchParams(window.location.search);
      const targetId = params.get('id');
      
      if (targetId) {
        const idNum = Number(targetId);
        
        const itemIndex = nuances.findIndex(n => n.id === idNum);
        if (itemIndex !== -1) {
          const targetPage = Math.floor(itemIndex / itemsPerPage) + 1;
          setCurrentPage(targetPage);
          setExpandedId(idNum); 
          
          setTimeout(() => {
            const element = document.getElementById(`nuance-${idNum}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }
      }
    }
  }, [nuances]); // 🌟 이제 조회수가 올라가서 nuances가 변경되어도 자물쇠 때문에 무시됩니다!

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
  
  const toggleNuance = async (targetNuance: Nuance) => {
    const isOpening = expandedId !== targetNuance.id;
    setExpandedId(isOpening ? targetNuance.id : null);

    if (isOpening) {
      const newViews = (targetNuance.views || 0) + 1;
      setNuances(nuances.map(n => n.id === targetNuance.id ? { ...n, views: newViews } : n));
      await supabase.from('nuances').update({ views: newViews }).eq('id', targetNuance.id);
    }
  };

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = nuances.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(nuances.length / itemsPerPage) || 1;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 md:bg-white">
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

      <main className="w-full flex-grow bg-slate-50 pb-20">
        <div className="max-w-4xl mx-auto mt-8 px-4 md:px-6">

          <div className="flex items-center justify-between mb-6 px-2">
             <div className="flex items-center gap-2">
                <span className="text-2xl">💡</span>
                <h2 className="text-xl md:text-2xl font-black text-slate-800">
                   영단어 뉘앙스 해설
                </h2>
             </div>
             
             {isAdmin && !isWriting && (
                <button 
                  onClick={() => { resetForm(); setIsWriting(true); }} 
                  style={{ backgroundColor: '#059669', color: '#ffffff' }}
                  className="px-4 py-2 md:px-6 md:py-2 rounded-lg text-sm font-bold shadow-md hover:opacity-80 transition-opacity"
                >
                  + 새 해설 쓰기
                </button>
             )}
          </div>

          {isAdmin && isWriting && (
            <div style={{ borderColor: '#059669' }} className="bg-white p-6 rounded-2xl shadow-md border mb-8 animate-in fade-in slide-in-from-top-4">
              <h2 style={{ color: '#059669' }} className="text-lg font-bold mb-4 flex items-center gap-2"><span>✍️</span> {editingId ? '해설 수정하기' : '새 해설 작성'}</h2>
              <input type="text" placeholder="제목을 입력하세요 (예: say, tell, speak, talk의 차이점)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg mb-4 text-sm font-bold outline-none" />
              <textarea placeholder="워드에서 작성한 글이나 사진을 그대로 붙여넣기 하세요!" value={content} onChange={(e) => setContent(e.target.value)} onPaste={handlePaste} className="w-full p-3 border border-slate-300 rounded-lg mb-4 h-80 text-sm outline-none" />
              <div className="flex justify-end gap-3">
                <button onClick={resetForm} className="px-5 py-2 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-100 font-bold transition-colors">취소</button>
                <button 
                  onClick={handleSave} 
                  style={{ backgroundColor: '#059669', color: '#ffffff' }}
                  className="px-5 py-2 text-sm rounded-lg font-bold shadow-sm hover:opacity-80 transition-opacity"
                >
                  {editingId ? '수정 완료' : '저장하기'}
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            <div style={{ borderColor: '#059669' }} className="flex items-center py-3 border-b-2 bg-white text-sm md:text-base font-bold text-slate-700 text-center">
              <div className="w-16 md:w-20">번호</div>
              <div className="flex-1 text-left px-4">제목</div>
              {/* <div className="w-16 md:w-24">조회수</div> */}
            </div>

            <div className="flex flex-col">
              {currentItems.length === 0 ? (
                <div className="text-center py-20 text-slate-400 font-medium text-sm">등록된 해설이 없습니다.</div>
              ) : (
                currentItems.map((nuance, index) => {
                  const absoluteIndex = indexOfFirstItem + index;
                  const displayNum = nuances.length - absoluteIndex;

                  return (
                    <article key={nuance.id} id={`nuance-${nuance.id}`} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <div onClick={() => toggleNuance(nuance)} className="flex items-center py-4 cursor-pointer text-center">
                        <div className="w-16 md:w-20 text-[13px] md:text-sm font-bold text-slate-400">
                          {displayNum}
                        </div>
                        <div style={{ color: expandedId === nuance.id ? '#059669' : '#1e293b' }} className="flex-1 text-left px-4 text-[14px] md:text-[15px] font-bold truncate transition-colors">
                          {nuance.title}
                        </div>
                        {/* <div className="w-16 md:w-24 text-[12px] text-slate-400">{nuance.views || 0}</div> */}
                      </div>

                      {expandedId === nuance.id && (
                        <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 animate-in fade-in overflow-hidden">
                          <div className="text-slate-700 text-sm md:text-[16px] leading-loose break-keep font-sans" dangerouslySetInnerHTML={{ __html: renderContentWithLineBreaks(nuance.content) }} />
                          
                          {isAdmin && (
                            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end gap-2">
                              <button onClick={() => handleEditClick(nuance)} style={{ color: '#059669', borderColor: '#059669' }} className="text-xs px-4 py-2 border rounded-lg font-bold hover:opacity-70 transition-opacity">수정</button>
                              <button onClick={() => handleDelete(nuance.id)} className="text-xs px-4 py-2 border border-red-200 text-red-500 rounded-lg font-bold hover:bg-red-50 transition-colors">삭제</button>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 mb-4 font-sans">
              <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded text-sm text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">&lt;&lt;</button>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded text-sm text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">&lt;</button>
              
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button 
                    key={num} 
                    onClick={() => handlePageChange(num)} 
                    style={{ 
                      backgroundColor: currentPage === num ? '#059669' : 'transparent',
                      color: currentPage === num ? '#ffffff' : '#64748b'
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all hover:bg-slate-100"
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded text-sm text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">&gt;</button>
              <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded text-sm text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">&gt;&gt;</button>
            </div>
          )}

          <div className="flex flex-col items-center justify-center pt-12 space-y-5">
            <button onClick={handleAdminLogin} className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-4">{isAdmin ? '관리자 로그아웃' : '관리자 로그인'}</button>
          </div>
        </div>
      </main>

      <div className="flex-none bg-white"><Footer /></div>
    </div>
  );
}