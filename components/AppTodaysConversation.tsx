// 파일 위치: components/AppTodaysConversation.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

export default function AppTodaysConversation() {
  const router = useRouter();
  const [supabase] = useState(() => createClientComponentClient());
  const [openingDetail, setOpeningDetail] = useState(false);

// 🌟 [수동 업데이트 영역] 매일매일 이곳의 글자만 바꿔주시면 됩니다!
  const todaysData = {
    en_text: "Could you cc my team leader on this email?",
    ko_text: "참조에 저희 팀장님을 넣어주시겠어요?",
    description: `"전화/이메일요청"에 관한 영어회화 표현입니다.
☞
(귀하: , 앞: ) 수신:  Attention Attn :  Attn:
받는 사람, 수신인 recipient, addressee
수신인 Atn (attention)
참조 CC (carbon copy) FCC(first carbon copy)
숨은참조 BCC (blind carbon copy) 
수신 : Receiver
발신 : Sender
전달하다(이메일) forward

다음은 다양한 예문입니다. 참고하세요. 

여보세요, 김 매니저님 좀 바꿔주시겠어요? Hello, could you put me through to Manager Kim?
그가 언제쯤 돌아오는지 알려주시겠어요? Could you tell me when he'll be back?
메시지 좀 남겨도 될까요? Can I leave a message?
제가 전화했었다고 전해주시겠어요? Could you tell him that I called?
돌아오시면 제게 전화 달라고 부탁드려도 될까요? Could you ask him to call me back when he returns?
제가 나중에 다시 전화해도 될까요? Can I call back later?
잘 안 들리는데 크게 말씀해 주시겠어요? I can't hear you well. Could you speak up?
전화 연결이 안 좋네요. 다시 걸어주시겠어요? The connection is bad. Could you call me back?
이메일로 세부 사항을 보내주실 수 있나요? Could you email me the details?
파일이 누락된 것 같은데 다시 첨부해 주시겠어요? The file seems to be missing. Could you attach it again?
제 이메일 주소를 적어주시겠어요? Could you write down my email address?
수신 확인 부탁드립니다. Please acknowledge receipt of this email.
메일 스팸함을 한 번 확인해 주시겠어요? Could you check your spam folder?
첨부 파일이 안 열리는데 PDF로 보내주실래요? The attachment won't open. Could you send it as a PDF?
회신을 조금만 서둘러 주시면 감사하겠습니다. I'd appreciate a prompt reply.
언제 통화가 편하신지 알려주시겠어요? Could you let me know when is a good time to call?
휴대폰 번호로 전화드려도 될까요? May I call you on your cell phone?
번호를 잘못 아신 것 같습니다. I think you have the wrong number.
지금 통화하기 곤란한데, 이따 전화해도 될까요? I can't talk right now. Can I call you later?`
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${todaysData.en_text} - ${todaysData.ko_text}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // ================================================================
  // ☆ TwoPro v1.67-safe: 앱 '전체보기'는 펼침 토글이 아니라
  // 웹과 동일한 오늘의 영어회화 상세 + 번호 목록 페이지로 이동합니다.
  // - 현재 앱의 수동 문장을 conversation_lines의 en_text와 정확히 대조
  // - 일치하는 행이 있으면 해당 id를 붙여 같은 문장을 상세 상단에 표시
  // - 일치 행을 못 찾으면 daily 목록 페이지로 안전하게 이동
  // ================================================================
  const handleOpenDetail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (openingDetail) return;

    setOpeningDetail(true);

    let href = '/conversation?type=daily';

    try {
      const { data: matched, error } = await supabase
        .from('conversation_lines')
        .select('id')
        .eq('en_text', todaysData.en_text)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && matched?.id != null) {
        href = `/conversation?type=daily&id=${encodeURIComponent(String(matched.id))}`;
      }
    } catch (err) {
      console.warn('[X-DIC AppTodaysConversation detail lookup]', err);
    } finally {
      router.push(href);
      setOpeningDetail(false);
    }
  };

  // ================================================================
  // ☆ TwoPro v1.65-safe: 앱 오늘의 영어회화 + 해설 예문 발음 듣기
  // - 설치형 앱은 Native TTS 사용
  // - 일반 브라우저는 Web SpeechSynthesis 사용
  // - 대표 문장은 기존처럼 영어 → 한국어
  // - 해설 예문은 화면 원문 순서대로 한국어 → 영어
  // ================================================================
  type SpeakPart = {
    text: string;
    lang: 'ko-KR' | 'en-US';
    rate: number;
    pitch: number;
  };

  const speakParts = async (parts: SpeakPart[]) => {
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
        console.warn('[X-DIC AppTodaysConversation Native TTS]', err);
      }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      for (const part of safeParts) {
        const utterance = new SpeechSynthesisUtterance(part.text);
        utterance.lang = part.lang;
        utterance.rate = part.rate;
        utterance.pitch = part.pitch;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();

    await speakParts([
      { text: todaysData.en_text, lang: 'en-US', rate: 0.92, pitch: 0.95 },
      { text: todaysData.ko_text, lang: 'ko-KR', rate: 1.0, pitch: 1.0 },
    ]);
  };

  // "다음은 다양한 예문입니다. 참고하세요." 아래의
  // "한국어 문장 + 영어 문장" 한 줄을 안전하게 분리합니다.
  const splitBilingualExample = (line: string) => {
    const normalized = String(line || '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!normalized) return null;

    // 일반형: "한국어 문장? English sentence."
    // 호환형: "한국어 문장? , English sentence."
    const boundary =
      /[.!?。！？](?:\s*[,，]\s*|\s+)(?=["“‘']?[A-Z])/u.exec(normalized);

    if (!boundary || typeof boundary.index !== 'number') return null;

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

    return null;
  };

  const parseDescriptionExamples = (description: string) => {
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
        const parsed = splitBilingualExample(raw);

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

  const parsedDescription = parseDescriptionExamples(todaysData.description);

  const handleExampleSpeak = async (
    e: React.MouseEvent,
    korean: string,
    english: string,
  ) => {
    e.stopPropagation();

    await speakParts([
      { text: korean, lang: 'ko-KR', rate: 1.0, pitch: 1.0 },
      { text: english, lang: 'en-US', rate: 0.92, pitch: 0.95 },
    ]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 mb-2 px-2 animate-in fade-in duration-500">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="group relative bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-2xl p-4 cursor-pointer transition-all shadow-sm hover:shadow-md"
      >
        {/* 상단 라벨 + 앱용 상세/목록 전체보기 버튼 */}
        <div className="absolute -top-3 left-4 bg-white px-2 flex items-center gap-2.5">
          <span className="text-xs font-extrabold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
            💡 오늘의 영어회화
          </span>
        </div>

        <button
          type="button"
          onClick={handleOpenDetail}
          disabled={openingDetail}
          className="absolute -top-3 right-4 bg-white px-2 text-[11px] font-extrabold text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors"
          aria-label="오늘의 영어회화 전체보기 및 목록 보기"
        >
          {openingDetail ? '불러오는 중…' : '전체보기 · View →'}
        </button>

        <div className="flex items-start gap-3 mt-1 pt-1">
          <div className="flex-shrink-0 flex items-center gap-1.5 mt-0.5">
            {/* 🌟 마이크 버튼은 복원하지 않고, 발음 듣기 스피커만 추가 */}
            <button
              onClick={handleSpeak}
              className="w-8 h-8 rounded-full bg-white text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
              title="발음 듣기"
              aria-label="오늘의 영어회화 발음 듣기"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM14 10a4.002 4.002 0 00-1.172-2.828.75.75 0 10-1.06 1.06c.586.586.914 1.378.914 2.207s-.328 1.62-.914 2.207a.75.75 0 101.06 1.06A4.002 4.002 0 0014 10z" />
              </svg>
            </button>
            <button
              onClick={handleCopy}
              className="w-8 h-8 rounded-full bg-white text-slate-400 border border-slate-200 hover:bg-slate-100 hover:text-slate-700 transition-all flex items-center justify-center shadow-sm"
              title="복사하기"
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-500"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
              )}
            </button>
          </div>

          <div className="flex-1">
            <h4 className="text-lg font-extrabold text-blue-700 tracking-tight">
              {todaysData.en_text}
            </h4>
            <p className="text-[15px] font-bold text-slate-800 mt-0.5">
              {todaysData.ko_text}
            </p>
          </div>

          <div className="flex-shrink-0 text-slate-400 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
          </div>
        </div>

        {isExpanded && todaysData.description && (
          <div className="mt-4 pt-4 border-t border-blue-100/50 animate-in fade-in slide-in-from-top-2">
            <div className="bg-white rounded-xl p-3.5 border border-blue-100 text-sm text-slate-700 leading-relaxed">
              {!parsedDescription.hasExamples ? (
                <div className="whitespace-pre-wrap">
                  <span className="font-extrabold text-blue-600 mr-1.5">👨‍🏫 해설:</span>
                  {todaysData.description}
                </div>
              ) : (
                <div>
                  <div className="whitespace-pre-wrap">
                    <span className="font-extrabold text-blue-600 mr-1.5">👨‍🏫 해설:</span>
                    {parsedDescription.intro}
                  </div>

                  <p className="mt-4 mb-2 font-medium text-slate-700">
                    {parsedDescription.marker}
                  </p>

                  <div className="space-y-1.5">
                    {parsedDescription.examples.map((example, index) => (
                      <div
                        key={`app-today-example-${index}`}
                        className="flex items-start gap-2"
                      >
                        {example.speakable ? (
                          <button
                            type="button"
                            onClick={(e) =>
                              handleExampleSpeak(
                                e,
                                example.korean,
                                example.english,
                              )
                            }
                            className="mt-0.5 w-7 h-7 shrink-0 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                            title="한국어·영어 예문 발음 듣기"
                            aria-label={`한국어·영어 예문 ${index + 1} 발음 듣기`}
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
                            <span>{example.korean} </span>
                            <span>{example.english}</span>
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}