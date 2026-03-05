'use client';

import React from 'react';
import SearchPage from '@/components/SearchPage';
const handleSpeak = (text: string) => {
    if (isNativeApp) {
      alert('📌 앱에서는 현재 “발음 듣기”가 기기 환경에 따라 제한될 수 있어요.\n(음성 검색은 정상 동작하도록 별도로 처리했습니다)');
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && !Capacitor.isNativePlatform()) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        const voices = window.speechSynthesis.getVoices?.() || [];
        const preferredVoice =
          voices.find((v) => v.name?.includes('Google US English')) || voices.find((v) => v.lang === 'en-US');
        if (preferredVoice) {
          utterance.voice = preferredVoice;
          utterance.lang = 'en-US';
        } else {
          utterance.lang = 'en-US';
        }

        utterance.pitch = 0.85;
        utterance.rate = 0.9;

        window.speechSynthesis.speak(utterance);
      } catch {
        alert('이 기기에서는 음성 듣기가 원활하지 않습니다.');
      }
    } else {
      alert('이 브라우저는 음성 듣기를 지원하지 않습니다.');
    }
  };

export default function MobileSearchPage(props: Props) {
  return <SearchPage {...props} />;
}