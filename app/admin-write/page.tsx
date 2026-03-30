// app/admin-write/page.tsx
'use client';

import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminWritePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // 🌟 보안을 위한 상태값 추가
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const [category, setCategory] = useState('✈️ 여행 영어 (Travel English)');
  const [enText, setEnText] = useState('');
  const [koText, setKoText] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🌟 관리자 인증 처리 함수
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'okright91088!!') {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 일치하지 않습니다. 관리자만 접근 가능합니다.');
      setPassword('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enText || !koText || !description) {
      return alert('모든 항목을 입력해주세요.');
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from('conversation_lines')
      .insert([{ category, en_text: enText, ko_text: koText, description }]);

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      alert('업로드 실패: ' + error.message);
    } else {
      alert('성공적으로 업로드되었습니다!');
      setEnText('');
      setKoText('');
      setDescription('');
      router.push('/conversation'); // 작성 완료 후 회화 페이지로 이동
    }
  };

  // 🔒 인증되지 않았을 때 보여줄 '자물쇠(로그인)' 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🔒</div>
            <h1 className="text-2xl font-extrabold text-slate-800">관리자 인증</h1>
            <p className="text-slate-500 text-sm mt-2">해설 등록을 위해 비밀번호를 입력해주세요.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full border border-slate-300 rounded-lg p-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium tracking-widest text-center"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-800 text-white font-bold rounded-lg py-4 hover:bg-slate-900 transition-colors"
            >
              입장하기
            </button>
            <div className="text-center mt-4">
              <Link href="/conversation" className="text-sm font-medium text-slate-400 hover:text-slate-600 hover:underline">
                돌아가기
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 🔓 인증 성공 시 보여줄 '글쓰기' 화면
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-800">📝 엑스딕 회화 관리자 글쓰기</h1>
          <Link href="/conversation" className="text-sm font-bold text-blue-600 hover:underline">
            목록으로 돌아가기
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">카테고리 선택</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="✈️ 여행 영어 (Travel English)">✈️ 여행 영어 (Travel English)</option>
              <option value="☕ 일상 회화 (Casual Conversation)">☕ 일상 회화 (Casual Conversation)</option>
              <option value="💼 비즈니스 회화 (Business English)">💼 비즈니스 회화 (Business English)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">영어 문장 (제목)</label>
            <input
              type="text"
              value={enText}
              onChange={(e) => setEnText(e.target.value)}
              placeholder="예: Let's grab a bite to eat."
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">한국어 뜻 (내용)</label>
            <input
              type="text"
              value={koText}
              onChange={(e) => setKoText(e.target.value)}
              placeholder="예: 간단하게 뭐 좀 먹자."
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">번역가 해설 (설명)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="자세한 뉘앙스나 상황 설명을 적어주세요."
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-bold rounded-lg py-4 hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? '업로드 중...' : '데이터베이스에 저장하기'}
          </button>
        </form>
      </div>
    </div>
  );
}