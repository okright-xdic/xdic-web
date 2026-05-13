'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; 
import { useRouter } from 'next/navigation';

export default function WagglePage() {
  const router = useRouter();
  const supabase = createClient(); 

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [loading, setLoading] = useState(true);

  // 관리자 답변용 상태
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // 시샵(선생님) 권한 체크 및 마스터 닉네임 설정
  const MASTER_NICKNAME = '시샵0000';
  const ADMIN_PASSWORD = 'okright91088!!';
  const isAdmin = password === ADMIN_PASSWORD || nickname === MASTER_NICKNAME;

  useEffect(() => {
    const savedNick = localStorage.getItem('xdic_tester_nick');
    const savedPw = localStorage.getItem('xdic_tester_pw');
    if (savedNick) setNickname(savedNick);
    if (savedPw) setPassword(savedPw);
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const { data, error } = await supabase
      .from('tester_feedback')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      // 시샵의 글(공지)과 일반 테스터의 글을 분리합니다.
      const notices = data.filter(fb => fb.password === ADMIN_PASSWORD || fb.nickname === MASTER_NICKNAME);
      const normals = data.filter(fb => !(fb.password === ADMIN_PASSWORD || fb.nickname === MASTER_NICKNAME));
      
      // 공지가 무조건 맨 위로 올라가도록 합칩니다.
      setFeedbacks([...notices, ...normals]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !password || !content) return alert('모든 항목을 입력해주세요!');

    // 마스터 권한이 아닐 때만 닉네임 검사
    if (!isAdmin) {
      const nickRegex = /^[가-힣a-zA-Z]\d{4}$/;
      if (!nickRegex.test(nickname)) {
        return alert('닉네임 형식을 맞춰주세요! (예: 동5678)');
      }
    }

    const { error } = await supabase.from('tester_feedback').insert([
      { nickname, password, content, is_secret: isAdmin ? false : isSecret }
    ]);

    if (!error) {
      localStorage.setItem('xdic_tester_nick', nickname);
      localStorage.setItem('xdic_tester_pw', password);
      setContent('');
      setIsSecret(false);
      fetchFeedbacks();
      alert(isAdmin ? '📢 공지사항이 맨 위에 등록되었습니다!' : '소중한 의견이 등록되었습니다!');
    } else {
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  // 시샵 전용 답변 등록 함수
  const handleReplySubmit = async (id: string) => {
    if (!replyContent.trim()) return alert('답변 내용을 입력해주세요!');
    
    const { error } = await supabase
      .from('tester_feedback')
      .update({ reply: replyContent })
      .eq('id', id);

    if (!error) {
      alert('답변이 성공적으로 등록되었습니다!');
      setReplyingId(null);
      setReplyContent('');
      fetchFeedbacks();
    } else {
      alert('답변 등록에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      <nav className="bg-white border-b p-3 sticky top-0 z-50 flex items-center justify-between shadow-sm px-4">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            뒤로
          </button>
          <h1 className="text-[17px] font-black text-slate-800 ml-1">💬 와글와글</h1>
        </div>
        <a href="/app" className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
          홈으로
        </a>
      </nav>

      <main className="p-4 max-w-2xl mx-auto">
        <div className="bg-blue-600 text-white p-5 rounded-2xl mb-6 shadow-lg">
          <p className="font-bold text-sm leading-relaxed">
            안녕하세요! 엑스딕 평가단 여러분 🫡<br/>
            본인 확인을 위해 닉네임은 <span className="underline">[이름 끝자리+전화번호 뒷4자리]</span>로 설정 부탁드립니다! (예: 동5678)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input 
              type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 (예: 동5678)" className="p-3 border rounded-xl text-sm outline-blue-500"
            />
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="비번 (시샵은 암호입력)" className="p-3 border rounded-xl text-sm outline-blue-500"
            />
          </div>
          <textarea 
            value={content} onChange={(e) => setContent(e.target.value)}
            placeholder={isAdmin ? "📢 시샵 모드: 여기에 작성하시면 자동으로 '공지'가 되어 맨 위로 올라갑니다." : "앱 사용 중 불편한 점이나 응원 메시지를 남겨주세요!"}
            className={`w-full p-4 border rounded-xl text-sm min-h-[100px] outline-blue-500 mb-3 ${isAdmin ? 'bg-indigo-50 border-indigo-200' : ''}`}
          />
          
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {isAdmin ? (
              <span className="text-sm font-black text-indigo-600 flex items-center gap-1.5">
                <span className="animate-pulse">🔴</span> 공지 등록 모드
              </span>
            ) : (
              <label className="flex items-center gap-2 text-sm text-slate-500 font-medium cursor-pointer">
                <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} className="w-4 h-4"/>
                🔒 시샵에게만 비밀글로 남기기
              </label>
            )}
            
            <button type="submit" className={`px-6 py-2.5 rounded-xl font-bold transition-colors text-white ${isAdmin ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isAdmin ? '공지 올리기' : '등록하기'}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {loading ? <div className="text-center py-10 text-slate-400">불러오는 중...</div> :
            feedbacks.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">아직 등록된 의견이 없습니다. 첫 의견을 남겨주세요!</div>
            ) : (
              feedbacks.map((fb) => {
                const canViewContent = !fb.is_secret || fb.nickname === nickname || isAdmin;
                const isNotice = fb.password === ADMIN_PASSWORD || fb.nickname === MASTER_NICKNAME;

                return (
                  <div key={fb.id} className={`p-5 rounded-2xl border shadow-sm relative ${isNotice ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-slate-100'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-black flex items-center gap-1.5 ${isNotice ? 'text-indigo-800 text-[15px]' : 'text-blue-600 text-sm'}`}>
                        {isNotice ? '📢 시샵 공지' : fb.nickname} 
                        {!isNotice && fb.is_secret && <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">비밀글</span>}
                      </span>
                      <span className={`text-[10px] ${isNotice ? 'text-indigo-400' : 'text-slate-300'}`}>{new Date(fb.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    {/* 🌟 1. 본문 내용 노출 권한 처리 */}
                    {isNotice ? (
                      <p className="text-indigo-900 text-[14px] font-bold leading-relaxed whitespace-pre-wrap">{fb.content}</p>
                    ) : canViewContent ? (
                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{fb.content}</p>
                    ) : (
                      <p className="text-slate-400 text-sm italic">🔒 작성자와 시샵만 볼 수 있는 비밀글입니다.</p>
                    )}

                    {/* 🌟 2. 시샵 답변 노출 권한 처리 (비밀글 자동 동기화!) */}
                    {!isNotice && fb.reply && (
                      canViewContent ? (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg border-l-4 border-blue-400">
                          <p className="text-[11px] font-black text-blue-500 mb-1">시샵(운영자) 답변</p>
                          <p className="text-sm text-slate-600 whitespace-pre-wrap">{fb.reply}</p>
                        </div>
                      ) : (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg border-l-4 border-slate-300">
                          <p className="text-[11px] font-black text-slate-400 mb-1">시샵(운영자) 답변</p>
                          <p className="text-sm text-slate-400 italic">🔒 작성자와 시샵만 볼 수 있는 답변입니다.</p>
                        </div>
                      )
                    )}

                    {/* 🌟 3. 시샵(관리자) 답변 달기 폼 */}
                    {isAdmin && !isNotice && (
                      <div className="mt-4 pt-3 border-t border-slate-100/50">
                        {replyingId === fb.id ? (
                          <div className="flex flex-col gap-2">
                            <textarea 
                              value={replyContent} 
                              onChange={(e) => setReplyContent(e.target.value)} 
                              placeholder="답변을 작성해주세요..."
                              className="w-full p-2 border border-blue-200 rounded text-sm outline-blue-500 min-h-[60px]"
                            />
                            <div className="flex justify-end gap-2">
                              <button onClick={() => { setReplyingId(null); setReplyContent(''); }} className="px-3 py-1.5 bg-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-300">취소</button>
                              <button onClick={() => handleReplySubmit(fb.id)} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700">답변 등록</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <button 
                              onClick={() => { setReplyingId(fb.id); setReplyContent(fb.reply || ''); }} 
                              className="text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-1.5 rounded hover:bg-indigo-100 transition-colors"
                            >
                              {fb.reply ? '✍️ 답변 수정하기' : '💬 답변 달기'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )
          }
        </div>
      </main>
    </div>
  );
}