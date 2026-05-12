'use client';

import React, { useState, useEffect } from 'react';
// 🌟 Supabase 클라이언트를 생성하는 함수를 가져옵니다.
import { createClient } from '@/utils/supabase/client'; 
import { useRouter } from 'next/navigation';

export default function WagglePage() {
  const router = useRouter();
  // 🌟 컴포넌트 내부에서 클라이언트를 직접 생성하여 'undefined' 에러를 방지합니다.
  const supabase = createClient(); 

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [loading, setLoading] = useState(true);

  // 로컬 스토리지에서 이전 닉네임 불러오기 (자동 기억)
  useEffect(() => {
    const savedNick = localStorage.getItem('xdic_tester_nick');
    const savedPw = localStorage.getItem('xdic_tester_pw');
    if (savedNick) setNickname(savedNick);
    if (savedPw) setPassword(savedPw);
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    // 🌟 이제 supabase 객체가 정상적으로 생성되었으므로 .from()을 읽을 수 있습니다.
    const { data, error } = await supabase
      .from('tester_feedback')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setFeedbacks(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !password || !content) return alert('모든 항목을 입력해주세요!');

    // 닉네임 가이드 체크 (이름 끝자 + 번호 4자리)
    const nickRegex = /^[가-힣a-zA-Z]\d{4}$/;
    if (!nickRegex.test(nickname)) {
      return alert('닉네임 형식을 맞춰주세요! (예: 동5678)');
    }

    const { error } = await supabase.from('tester_feedback').insert([
      { nickname, password, content, is_secret: isSecret }
    ]);

    if (!error) {
      localStorage.setItem('xdic_tester_nick', nickname);
      localStorage.setItem('xdic_tester_pw', password);
      setContent('');
      setIsSecret(false);
      fetchFeedbacks();
      alert('소중한 의견이 등록되었습니다!');
    } else {
      console.error('등록 에러:', error);
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <nav className="bg-white border-b p-4 sticky top-0 z-50 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-slate-400">←</button>
        <h1 className="text-lg font-black text-slate-800">💬 평가단 와글와글</h1>
      </nav>

      <main className="p-4 max-w-2xl mx-auto">
        {/* 안내 문구 */}
        <div className="bg-blue-600 text-white p-5 rounded-2xl mb-6 shadow-lg">
          <p className="font-bold text-sm leading-relaxed">
            안녕하세요! 엑스딕 평가단 여러분 🫡<br/>
            본인 확인을 위해 닉네임은 <span className="underline">[이름 끝자리+전화번호 뒷4자리]</span>로 설정 부탁드립니다! (예: 동5678)
          </p>
        </div>

        {/* 글쓰기 폼 */}
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input 
              type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 (예: 동5678)" className="p-3 border rounded-xl text-sm outline-blue-500"
            />
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="비번 4자리" className="p-3 border rounded-xl text-sm outline-blue-500"
            />
          </div>
          <textarea 
            value={content} onChange={(e) => setContent(e.target.value)}
            placeholder="앱 사용 중 불편한 점이나 응원 메시지를 남겨주세요!"
            className="w-full p-4 border rounded-xl text-sm min-h-[100px] outline-blue-500 mb-3"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-500 font-medium cursor-pointer">
              <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} className="w-4 h-4"/>
              🔒 시샵에게만 비밀글로 남기기
            </label>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors">
              등록하기
            </button>
          </div>
        </form>

        {/* 게시글 목록 */}
        <div className="space-y-4">
          {loading ? <div className="text-center py-10 text-slate-400">불러오는 중...</div> :
            feedbacks.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">아직 등록된 의견이 없습니다. 첫 의견을 남겨주세요!</div>
            ) : (
              feedbacks.map((fb) => (
                <div key={fb.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-blue-600 text-sm">{fb.nickname}</span>
                    <span className="text-[10px] text-slate-300">{new Date(fb.created_at).toLocaleDateString()}</span>
                  </div>
                  {fb.is_secret && fb.nickname !== nickname ? (
                    <p className="text-slate-400 text-sm italic">🔒 작성자와 시샵만 볼 수 있는 비밀글입니다.</p>
                  ) : (
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{fb.content}</p>
                  )}
                  {fb.reply && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg border-l-4 border-blue-400">
                      <p className="text-[11px] font-black text-blue-500 mb-1">시샵(운영자) 답변</p>
                      <p className="text-sm text-slate-600">{fb.reply}</p>
                    </div>
                  )}
                </div>
              ))
            )
          }
        </div>
      </main>
    </div>
  );
}