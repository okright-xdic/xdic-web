'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface Notice {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function NoticePage() {
  const supabase = createClient();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const fetchNotices = async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setNotices(data);
    if (error) console.error('게시글 불러오기 실패:', error);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAdminLogin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setIsWriting(false);
      setEditingId(null);
      alert('관리자 모드가 해제되었습니다.');
      return;
    }
    const pwd = prompt('관리자 비밀번호를 입력하세요:');
    if (pwd === 'okright91088!!') {
      setIsAdmin(true);
      alert('관리자 모드로 접속되었습니다. 자유롭게 글을 작성/수정/삭제할 수 있습니다.');
    } else if (pwd !== null) {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('notices')
        .update({ title, content })
        .eq('id', editingId);

      if (error) {
        alert('글 수정에 실패했습니다.');
      } else {
        alert('성공적으로 수정되었습니다!');
        resetForm();
        fetchNotices();
      }
    } else {
      const { error } = await supabase
        .from('notices')
        .insert([{ title, content }]);

      if (error) {
        alert('글 저장에 실패했습니다.');
      } else {
        alert('성공적으로 등록되었습니다!');
        resetForm();
        fetchNotices();
      }
    }
  };

  const handleEditClick = (notice: Notice) => {
    setEditingId(notice.id);
    setTitle(notice.title);
    setContent(notice.content);
    setIsWriting(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) alert('삭제에 실패했습니다.');
    else {
      alert('삭제되었습니다.');
      fetchNotices();
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setIsWriting(false);
    setEditingId(null);
  };

  const toggleNotice = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderContentWithLineBreaks = (text: string) => {
    return text.replace(/\n/g, '<br />');
  };

  // 🌟 [핵심 마법] 붙여넣기 할 때 이미지를 가로채서 텍스트 코드로 변환하는 기능!
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault(); // 기본 붙여넣기(글자만 됨) 무시!
        
        const file = items[i].getAsFile();
        if (!file) continue;

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target?.result as string;
          // 화면에 예쁘게 나오도록 img 태그를 자동으로 만들어 줍니다.
          const imgTag = `\n<img src="${base64String}" alt="첨부 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; border: 1px solid #e2e8f0;" />\n`;

          // 현재 커서 위치에 이미지 태그 끼워넣기
          const textarea = e.target as HTMLTextAreaElement;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;

          const newContent = content.substring(0, start) + imgTag + content.substring(end);
          setContent(newContent);
        };
        reader.readAsDataURL(file); // 이미지를 텍스트 데이터(Base64)로 읽어들임
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      <header className="w-full bg-white border-b border-slate-200 py-6 px-4 md:px-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
            <Image 
              src="/images/LOGO_01_ChatGPT_S.jpg" 
              alt="X-DIC Logo" 
              width={120} 
              height={60} 
              className="object-contain" 
            />
          </Link>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>📢</span> 공지사항 / FAQ
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto mt-8 px-4 md:px-6">
        
        {isAdmin && !isWriting && (
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => {
                resetForm();
                setIsWriting(true);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md transition-all"
            >
              + 새 글 쓰기
            </button>
          </div>
        )}

        {isAdmin && isWriting && (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-400 mb-8 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
              <span>✍️</span> {editingId ? '공지사항 수정하기' : '새 공지사항 작성'}
            </h2>
            <input 
              type="text" 
              placeholder="제목을 입력하세요" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            />
            {/* 🌟 onPaste 이벤트를 달아서 붙여넣기를 감시합니다! */}
            <textarea 
              placeholder="워드 등에서 복사한 글이나 사진을 여기에 그대로 붙여넣기(Ctrl+V) 하세요!" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste} 
              className="w-full p-3 border border-slate-300 rounded-lg mb-4 h-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={resetForm}
                className="px-5 py-2 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-100 font-bold"
              >
                취소
              </button>
              <button 
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-bold"
              >
                {editingId ? '수정 완료' : '저장하기'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {notices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-400 font-medium text-sm">등록된 공지사항이 없습니다.</p>
            </div>
          ) : (
            notices.map((notice) => (
              <article key={notice.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all">
                
                <div 
                  onClick={() => toggleNotice(notice.id)}
                  className={`px-6 py-4 cursor-pointer flex justify-between items-center transition-colors ${expandedId === notice.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">안내</span>
                      <span className="text-[12px] text-slate-400 font-medium">
                        {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <h2 className={`text-base font-bold transition-colors ${expandedId === notice.id ? 'text-blue-700' : 'text-slate-800'}`}>
                      {notice.title}
                    </h2>
                  </div>
                  <span className="text-xl text-slate-400 ml-4">
                    {expandedId === notice.id ? '−' : '＋'}
                  </span>
                </div>

                {expandedId === notice.id && (
                  <div className="p-6 md:p-8 border-t border-slate-100 bg-white animate-in fade-in overflow-hidden">
                    
                    <div 
                      className="text-slate-700 text-sm md:text-[15px] leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: renderContentWithLineBreaks(notice.content) }}
                    />
                    
                    {isAdmin && (
                      <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(notice)}
                          className="text-xs px-3 py-1.5 border border-blue-200 text-blue-600 rounded hover:bg-blue-50 transition-colors font-bold"
                        >
                          수정
                        </button>
                        <button 
                          onClick={() => handleDelete(notice.id)}
                          className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors font-bold"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))
          )}
        </div>

        <div className="flex flex-col items-center justify-center pt-10 space-y-5">
          <Link href="/">
            <button className="text-sm px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-full transition-colors shadow-sm">
              메인 화면으로 돌아가기
            </button>
          </Link>

          <button 
            onClick={handleAdminLogin}
            className="text-[11px] text-slate-300 hover:text-slate-500 underline"
          >
            {isAdmin ? '관리자 로그아웃' : '관리자 로그인'}
          </button>
        </div>

      </main>
    </div>
  );
}