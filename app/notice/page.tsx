'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function NoticePage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. 상단 로고 헤더 */}
      <header className="w-full bg-white border-b border-slate-200 py-6 px-4 md:px-6">
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
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">
            📢 공지사항 및 FAQ
          </h1>
        </div>
      </header>

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="max-w-3xl mx-auto mt-8 px-4 md:px-6 space-y-10">
        
        {/* =======================================================
            [게시물 1] 가장 최근 중요 공지사항 영역
            (이 박스를 복사해서 위에 계속 쌓아 올리면 최신순 게시판이 됩니다!)
        ======================================================= */}
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* 게시물 제목 및 날짜 */}
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-sm">필독</span>
              <span className="text-sm text-slate-500 font-medium">2026. 03. 20</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              엑스딕(X-DIC) 정식 서비스 오픈 및 평가단 모집 안내
            </h2>
          </div>

          {/* 게시물 본문 (텍스트 + 이미지) */}
          <div className="p-6 md:p-8 text-slate-700 leading-relaxed space-y-6">
            
            <p>
              안녕하세요, 복합어 전문 용어사전 엑스딕(X-DIC)입니다.<br/>
              여러분들의 영어 검색 시간을 획기적으로 줄여줄 엑스딕이 드디어 정식 오픈을 준비하고 있습니다.
            </p>

            {/* 📸 대표님이 만드신 이미지를 넣는 곳! */}
            <div className="w-full flex justify-center py-4">
              <div className="relative w-full max-w-[600px] h-[300px] bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                {/* [이미지 교체 방법] 
                  1. public/images 폴더 안에 이미지를 넣습니다. (예: my-notice.png)
                  2. 아래 src="/images/my-notice.png" 로 이름을 바꿔줍니다. 
                */}
                <div className="flex items-center justify-center h-full text-slate-400 font-bold">
                  여기에 대표님이 만드신 안내 이미지가 들어갑니다. (public/images/...)
                </div>
                {/* 실제 이미지를 넣을 때는 아래 주석을 풀고 사용하세요 */}
                {/* <Image src="/images/여기에_이미지이름.jpg" alt="공지사항 이미지" fill className="object-contain" /> */}
              </div>
            </div>

            <p>
              현재 안드로이드 앱 출시를 위한 <b>비공개 테스트 평가단</b>을 모집하고 있습니다.<br/>
              사전 평가단에 참여하여 가장 먼저 엑스딕의 강력한 듀얼 음성 검색 기능을 체험해 보세요!
            </p>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-2">📱 앱 설치 방법</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600 ml-2">
                <li>아래 링크를 클릭하여 테스트 화면으로 이동합니다.</li>
                <li>파란색 글씨의 <b>'download it on Google Play'</b>를 클릭합니다.</li>
                <li><b>'설치'</b> 버튼을 클릭하여 스마트폰에 다운로드합니다.</li>
              </ol>
            </div>
            
          </div>
        </article>

        {/* =======================================================
            [게시물 2] 자주 묻는 질문 (FAQ) 영역
        ======================================================= */}
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>💡</span> 자주 묻는 질문 (FAQ)
            </h2>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            
            {/* Q&A 1 */}
            <div>
              <h3 className="flex gap-2 font-bold text-lg text-slate-800 mb-2">
                <span className="text-blue-600">Q.</span> 엑스딕은 어떤 점이 다른가요?
              </h3>
              <p className="flex gap-2 text-slate-600 leading-relaxed pl-8">
                <span className="text-slate-400 font-bold">A.</span> 
                일반 번역기에서는 엉뚱하게 번역되는 길고 복잡한 '전문 용어'와 '복합어' 데이터에 특화되어 있습니다. 또한 한국어와 영어 음성 마이크를 완벽히 분리하여 오류 없이 초고속으로 검색이 가능합니다.
              </p>
            </div>

            {/* Q&A 2 */}
            <div>
              <h3 className="flex gap-2 font-bold text-lg text-slate-800 mb-2">
                <span className="text-blue-600">Q.</span> 발음이 이상하게 들려요. 어떻게 하나요?
              </h3>
              <p className="flex gap-2 text-slate-600 leading-relaxed pl-8">
                <span className="text-slate-400 font-bold">A.</span> 
                엑스딕은 사용하시는 스마트폰 기기 내에 설치된 최고급 성우(TTS)를 자동으로 불러와서 읽어줍니다. 구글이나 애플의 기본 TTS 엔진이 설치되어 있지 않은 구형 기기나 윈도우 PC에서는 기본 기계음이 나올 수 있습니다.
              </p>
            </div>

          </div>
        </article>

        {/* 돌아가기 버튼 */}
        <div className="flex justify-center pt-8">
          <Link href="/">
            <button className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-full transition-colors shadow-sm">
              메인 화면으로 돌아가기
            </button>
          </Link>
        </div>

      </main>
    </div>
  );
}