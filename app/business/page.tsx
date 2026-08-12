'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type BusinessItem = {
  en: string;
  ko: string;
  query: string;
};

type BusinessSituation = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  phrases: BusinessItem[];
};

export default function BusinessPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [myHistory, setMyHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('xdic_business_treasure');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setMyHistory(
            parsed
              .filter((item): item is string => typeof item === 'string')
              .slice(0, 20)
          );
        }
      } catch {
        localStorage.removeItem('xdic_business_treasure');
      }
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    const updatedHistory = [
      trimmed,
      ...myHistory.filter((item) => item !== trimmed),
    ].slice(0, 20);

    setMyHistory(updatedHistory);
    localStorage.setItem(
      'xdic_business_treasure',
      JSON.stringify(updatedHistory)
    );

    router.push(`/?q=${encodeURIComponent(trimmed)}`);
  };

  const situations: BusinessSituation[] = [
    {
      id: 'email',
      icon: '✉️',
      title: '이메일·문서',
      subtitle: 'Email & Documents',
      description:
        '자료 요청, 첨부, 확인, 회신과 같은 업무 이메일에서 반복해서 쓰이는 기본 표현입니다.',
      phrases: [
        {
          en: 'Please find the attached file.',
          ko: '첨부 파일을 확인해 주세요.',
          query: 'Please find the attached file.',
        },
        {
          en: 'Could you send me the updated version?',
          ko: '업데이트된 버전을 보내주시겠어요?',
          query: 'Could you send me the updated version?',
        },
        {
          en: 'I look forward to your reply.',
          ko: '회신을 기다리겠습니다.',
          query: 'I look forward to your reply.',
        },
      ],
    },
    {
      id: 'meeting',
      icon: '👥',
      title: '회의·의견',
      subtitle: 'Meetings & Opinions',
      description:
        '회의 시작, 의견 제시, 동의·이견, 안건 정리처럼 협업 회의에서 자주 쓰는 표현입니다.',
      phrases: [
        {
          en: "Let's move on to the next item.",
          ko: '다음 안건으로 넘어가겠습니다.',
          query: "Let's move on to the next item.",
        },
        {
          en: 'I agree with your point.',
          ko: '말씀하신 점에 동의합니다.',
          query: 'I agree with your point.',
        },
        {
          en: 'Could you clarify what you mean?',
          ko: '무슨 뜻인지 좀 더 설명해 주시겠어요?',
          query: 'Could you clarify what you mean?',
        },
      ],
    },
    {
      id: 'phone',
      icon: '☎️',
      title: '전화·연락',
      subtitle: 'Calls & Contact',
      description:
        '담당자 연결, 부재 안내, 메시지 전달 등 업무 전화에서 바로 사용할 수 있는 표현입니다.',
      phrases: [
        {
          en: 'May I speak to Mr. Kim?',
          ko: '김 선생님과 통화할 수 있을까요?',
          query: 'May I speak to Mr. Kim?',
        },
        {
          en: 'Could I leave a message?',
          ko: '메시지를 남겨도 될까요?',
          query: 'Could I leave a message?',
        },
        {
          en: "I'll call you back later.",
          ko: '나중에 다시 전화드리겠습니다.',
          query: "I'll call you back later.",
        },
      ],
    },
    {
      id: 'schedule',
      icon: '📅',
      title: '일정·약속',
      subtitle: 'Schedules & Appointments',
      description:
        '회의 시간 조정, 일정 확인, 연기와 마감일 협의에 필요한 기본 업무 표현입니다.',
      phrases: [
        {
          en: 'Are you available tomorrow afternoon?',
          ko: '내일 오후에 시간 괜찮으세요?',
          query: 'Are you available tomorrow afternoon?',
        },
        {
          en: 'Could we reschedule the meeting?',
          ko: '회의 일정을 다시 잡을 수 있을까요?',
          query: 'Could we reschedule the meeting?',
        },
        {
          en: 'The deadline is Friday.',
          ko: '마감일은 금요일입니다.',
          query: 'The deadline is Friday.',
        },
      ],
    },
    {
      id: 'request-report',
      icon: '📋',
      title: '요청·보고',
      subtitle: 'Requests & Reports',
      description:
        '업무 요청, 진행 상황 확인, 완료 보고와 문제 공유에 필요한 표현을 모았습니다.',
      phrases: [
        {
          en: 'Could you review this by tomorrow?',
          ko: '내일까지 이것을 검토해 주시겠어요?',
          query: 'Could you review this by tomorrow?',
        },
        {
          en: 'The project is on schedule.',
          ko: '프로젝트는 일정대로 진행되고 있습니다.',
          query: 'The project is on schedule.',
        },
        {
          en: 'We have encountered a problem.',
          ko: '문제가 발생했습니다.',
          query: 'We have encountered a problem.',
        },
      ],
    },
    {
      id: 'negotiation-contract',
      icon: '🤝',
      title: '협상·계약',
      subtitle: 'Negotiation & Contracts',
      description:
        '가격·조건 제안, 계약 검토와 합의 여부를 확인할 때 자주 접하는 실무 표현입니다.',
      phrases: [
        {
          en: 'We would like to discuss the terms.',
          ko: '조건을 협의하고 싶습니다.',
          query: 'We would like to discuss the terms.',
        },
        {
          en: 'Could you offer us a better price?',
          ko: '더 좋은 가격을 제시해 주실 수 있나요?',
          query: 'Could you offer us a better price?',
        },
        {
          en: 'We have reached an agreement.',
          ko: '합의에 도달했습니다.',
          query: 'We have reached an agreement.',
        },
      ],
    },
  ];

  const intentGroups = [
    {
      icon: '📨',
      title: '자료를 요청할 때',
      intent: '직접적인 명령보다 업무 관계에 맞게 요청의 강도를 조절할 수 있습니다.',
      items: [
        ['Please send me the report.', '보고서를 보내 주세요.'],
        ['Could you send me the report?', '보고서를 보내주시겠어요?'],
        ['Would you mind sending me the report?', '보고서를 보내주실 수 있을까요?'],
      ],
    },
    {
      icon: '✅',
      title: '확인·승인을 요청할 때',
      intent: '내용 확인, 검토, 승인 요청을 상황에 맞게 표현합니다.',
      items: [
        ['Please confirm the details.', '세부 내용을 확인해 주세요.'],
        ['Could you review this document?', '이 문서를 검토해 주시겠어요?'],
        ['Please let me know if you approve.', '승인하시면 알려 주세요.'],
      ],
    },
    {
      icon: '💬',
      title: '의견을 제시할 때',
      intent: '단정적인 표현과 부드러운 제안 표현을 구분해서 사용할 수 있습니다.',
      items: [
        ['I think we should revise the plan.', '계획을 수정해야 한다고 생각합니다.'],
        ['I suggest we revise the plan.', '계획을 수정할 것을 제안합니다.'],
        ['Perhaps we could revise the plan.', '계획을 수정해 볼 수도 있겠습니다.'],
      ],
    },
    {
      icon: '⏰',
      title: '기한·일정을 말할 때',
      intent: '마감일을 알리거나 상대방에게 가능한 일정을 물어볼 때 사용하는 표현입니다.',
      items: [
        ['We need this by Friday.', '금요일까지 이것이 필요합니다.'],
        ['Could you finish this by Friday?', '금요일까지 끝내 주시겠어요?'],
        ['When would be convenient for you?', '언제가 편하신가요?'],
      ],
    },
  ];

  const toneGuide = [
    {
      expression: 'Please ...',
      ko: '…해 주세요',
      level: '간결한 업무 지시·요청',
      note:
        '업무 이메일에서 흔히 쓰이지만 상황에 따라 다소 직접적으로 들릴 수 있습니다. 상대방과의 관계와 요청의 부담을 함께 고려하는 것이 좋습니다.',
      example: 'Please review the attached document.',
      exampleKo: '첨부 문서를 검토해 주세요.',
    },
    {
      expression: 'Could you ...?',
      ko: '…해주시겠어요?',
      level: '일반적으로 부드럽고 정중한 요청',
      note:
        '동료·거래처에 도움이나 작업을 부탁할 때 활용하기 좋은 대표적인 요청 구조입니다.',
      example: 'Could you send me the latest figures?',
      exampleKo: '최신 수치를 보내주시겠어요?',
    },
    {
      expression: 'Would you mind ...ing?',
      ko: '…해주실 수 있을까요?',
      level: '부담을 낮춘 정중한 부탁',
      note:
        '상대에게 추가 행동을 요청할 때 조심스럽고 정중한 인상을 줄 수 있는 표현입니다.',
      example: 'Would you mind checking this again?',
      exampleKo: '이것을 다시 확인해 주실 수 있을까요?',
    },
    {
      expression: 'We would like to ...',
      ko: '저희는 …하고 싶습니다',
      level: '회사·팀의 의사나 제안을 공식적으로 표현',
      note:
        '거래·협의·계약 문맥에서 조직의 의사를 비교적 정중하고 공식적으로 전달할 때 자주 사용됩니다.',
      example: 'We would like to discuss the payment terms.',
      exampleKo: '결제 조건을 협의하고 싶습니다.',
    },
  ];

  const emailPatterns = [
    {
      title: '이메일 시작',
      icon: '👋',
      items: [
        ['Thank you for your email.', '이메일 감사합니다.'],
        ['I am writing regarding the meeting.', '회의와 관련하여 연락드립니다.'],
        ['Following up on our conversation, ...', '지난 대화에 이어 연락드립니다.'],
      ],
    },
    {
      title: '요청·첨부',
      icon: '📎',
      items: [
        ['Please find the attached file.', '첨부 파일을 확인해 주세요.'],
        ['Could you send us the revised quote?', '수정 견적서를 보내주시겠어요?'],
        ['Please let me know if you need anything else.', '추가로 필요한 것이 있으면 알려 주세요.'],
      ],
    },
    {
      title: '확인·회신',
      icon: '📬',
      items: [
        ['Please confirm receipt.', '수신 여부를 확인해 주세요.'],
        ['I will get back to you shortly.', '곧 다시 연락드리겠습니다.'],
        ['I look forward to hearing from you.', '회신을 기다리겠습니다.'],
      ],
    },
    {
      title: '마무리',
      icon: '🖊️',
      items: [
        ['Thank you for your cooperation.', '협조해 주셔서 감사합니다.'],
        ['Thank you for your understanding.', '이해해 주셔서 감사합니다.'],
        ['Best regards,', '감사합니다 / 안부를 전하며,'],
      ],
    },
  ];

  const miniGlossary = [
    {
      term: 'agenda',
      ko: '의제 / 안건',
      query: 'agenda',
      note:
        '회의에서 논의할 항목이나 진행 순서를 정리한 내용을 가리키는 대표적인 실무 용어입니다.',
    },
    {
      term: 'minutes',
      ko: '회의록',
      query: 'meeting minutes',
      note:
        '회의에서 논의된 내용과 결정 사항을 기록한 문서를 의미합니다. 시간 단위 minute와 문맥상 구분해야 합니다.',
    },
    {
      term: 'deadline',
      ko: '마감일',
      query: 'deadline',
      note:
        '업무나 제출물을 완료해야 하는 최종 기한을 가리키며 일정 관리 문맥에서 자주 사용됩니다.',
    },
    {
      term: 'follow-up',
      ko: '후속 조치 / 후속 연락',
      query: 'follow-up business',
      note:
        '이전에 논의하거나 요청한 일에 대해 이어서 확인·처리하거나 다시 연락하는 것을 가리킵니다.',
    },
    {
      term: 'quotation',
      ko: '견적 / 견적서',
      query: 'quotation business',
      note:
        '거래 문맥에서는 상품이나 서비스의 가격과 조건을 제시하는 견적 또는 견적서를 뜻할 수 있습니다.',
    },
    {
      term: 'invoice',
      ko: '송장 / 청구서',
      query: 'commercial invoice',
      note:
        '거래한 상품이나 서비스의 금액을 청구하는 문서와 관련된 용어입니다. 무역 문맥에서는 commercial invoice도 함께 확인할 수 있습니다.',
    },
    {
      term: 'terms',
      ko: '조건',
      query: 'contract terms',
      note:
        '계약·거래 문맥에서 가격, 결제, 납기 등 합의된 조건을 가리키는 경우가 많습니다.',
    },
    {
      term: 'approval',
      ko: '승인',
      query: 'approval business',
      note:
        '문서·예산·업무 계획 등을 공식적으로 허가하거나 인정하는 절차와 관련된 실무 용어입니다.',
    },
  ];

  const miniDialogues = [
    {
      icon: '📅',
      title: '회의 일정 조정',
      lines: [
        ['A', 'Are you available Thursday afternoon?', '목요일 오후에 시간 괜찮으세요?'],
        ['B', 'Could we make it Friday morning instead?', '대신 금요일 오전으로 할 수 있을까요?'],
      ],
    },
    {
      icon: '📎',
      title: '자료 요청',
      lines: [
        ['A', 'Could you send me the updated report?', '업데이트된 보고서를 보내주시겠어요?'],
        ['B', "Sure. I'll send it this afternoon.", '네. 오늘 오후에 보내겠습니다.'],
      ],
    },
    {
      icon: '👥',
      title: '회의에서 의견 확인',
      lines: [
        ['A', 'What do you think about this proposal?', '이 제안에 대해 어떻게 생각하세요?'],
        ['B', 'I agree with the main idea.', '주요 취지에는 동의합니다.'],
      ],
    },
    {
      icon: '🤝',
      title: '조건 협의',
      lines: [
        ['A', 'We would like to discuss the payment terms.', '결제 조건을 협의하고 싶습니다.'],
        ['B', 'Let us review the proposal first.', '먼저 제안을 검토해 보겠습니다.'],
      ],
    },
  ];

  const searchPaths = [
    {
      title: '업무 이메일 흐름',
      terms: ['subject', 'attachment', 'reply', 'follow-up'],
    },
    {
      title: '회의 진행 흐름',
      terms: ['agenda', 'discussion', 'decision', 'minutes'],
    },
    {
      title: '프로젝트 보고 흐름',
      terms: ['schedule', 'progress', 'issue', 'deadline'],
    },
    {
      title: '거래·계약 흐름',
      terms: ['quotation', 'purchase order', 'contract', 'payment terms'],
    },
  ];

  const recommendedPhrases = [
    'Please confirm.',
    'Could you review this?',
    'Please find the attached file.',
    'I will get back to you.',
    'I look forward to your reply.',
    'Are you available tomorrow?',
    'Could we reschedule the meeting?',
    "Let's move on to the next item.",
    'I agree with your point.',
    'Could you clarify that?',
    'The project is on schedule.',
    'We have encountered a problem.',
    'Could you send me the report?',
    'We would like to discuss the terms.',
    'Could you offer us a better price?',
    'We have reached an agreement.',
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-700 transition-colors font-bold text-[11px] md:text-xs bg-slate-50 hover:bg-indigo-50 px-2.5 py-1 rounded-full"
          >
            <span>←</span> 메인으로 <span className="text-slate-400 font-semibold">· Home</span>
          </Link>

          <div className="text-[12px] md:text-[13px] font-black text-slate-800 tracking-tighter">
            <span className="text-indigo-600">X</span>-DIC
            <span className="text-slate-400 ml-1">BUSINESS</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-16 md:pt-20 pb-20">
        <section className="text-center mb-4 md:mb-5">
          <p className="text-[9px] md:text-[10px] font-extrabold tracking-[0.12em] text-indigo-600 uppercase mb-1">
            X-DIC Practical Business English
          </p>

          <h1 className="text-[24px] md:text-[30px] font-black text-slate-900 leading-tight tracking-tight">
            실무 영어
            <span className="ml-1.5 text-[11px] md:text-[13px] font-bold text-indigo-600 align-middle">
              X-DIC Business
            </span>
          </h1>

          <p className="mt-1.5 text-[10px] md:text-[12px] font-bold tracking-tight text-slate-500">
            <span className="text-indigo-600">Practical Business English</span>
            <span className="text-slate-300"> · </span>
            <span className="text-slate-500">Ko-En / En-Ko</span>
          </p>

          <p className="max-w-3xl mx-auto mt-2 text-[11px] md:text-[12.5px] text-slate-500 leading-5 md:leading-[1.65] break-keep">
            이메일, 회의, 전화, 일정, 요청·보고, 협상·계약에서 자주 쓰는 실무 영어를
            X-DIC 한영·영한 검색과 함께 살펴보세요. 같은 업무 의도를 여러 방식으로 표현하는 법과
            정중도·업무 톤의 차이도 함께 확인할 수 있습니다.
          </p>

          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <a
              href="#business-situations"
              className="px-2.5 py-1 rounded-full border border-indigo-100 bg-indigo-50 text-[10px] md:text-[11px] font-bold text-indigo-700"
            >
              상황별 실무 영어
            </a>
            <a
              href="#business-intents"
              className="px-2.5 py-1 rounded-full border border-violet-100 bg-violet-50 text-[10px] md:text-[11px] font-bold text-violet-700"
            >
              업무 의도별 표현
            </a>
            <Link
              href="/conversation?type=business"
              className="px-2.5 py-1 rounded-full border border-slate-200 bg-white text-[10px] md:text-[11px] font-bold text-slate-600 hover:border-indigo-200 hover:text-indigo-700 transition-colors"
            >
              비즈니스 영어회화 더 보기 →
            </Link>
          </div>
        </section>

        <section aria-labelledby="business-search-title" className="mb-5 md:mb-6">
          <h2 id="business-search-title" className="sr-only">
            실무 영어 문장과 표현 검색
          </h2>

          <div className="relative max-w-2xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full h-12 md:h-14 bg-white rounded-xl border border-indigo-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
            >
              <div className="pl-4 md:pl-5 text-indigo-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="예: 회의를 연기할 수 있을까요? / Please confirm receipt."
                className="flex-grow min-w-0 h-full px-3 md:px-4 text-sm md:text-base outline-none font-medium text-slate-800"
                autoComplete="off"
              />

              <button
                type="submit"
                className="h-full px-5 md:px-6 bg-indigo-600 text-white font-black text-sm md:text-base hover:bg-indigo-700 transition-colors"
              >
                검색
              </button>
            </form>

            <p className="mt-1.5 text-center text-[10px] md:text-[11px] text-slate-400 font-medium">
              검색하면 X-DIC 메인 결과로 이동하며 최근 검색어는 현재 브라우저에 저장됩니다.
            </p>
          </div>
        </section>

        <section aria-labelledby="business-guide-title" className="mb-8 md:mb-10">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:p-6">
            <p className="text-[11px] md:text-xs font-bold text-indigo-600 mb-1">
              Practical Business English Guide
            </p>
            <h2
              id="business-guide-title"
              className="text-lg md:text-2xl font-black text-slate-900"
            >
              X-DIC Business를 활용하는 방법
            </h2>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {[
                [
                  '① 한국어·영어 실무 문장 검색',
                  '작성하려는 한국어 문장이나 받은 영어 문장을 검색해 X-DIC의 추천 번역과 실제 병렬 예문을 확인합니다.',
                ],
                [
                  '② 업무 상황별 대표 표현 확인',
                  '이메일·회의·전화·일정·보고·협상처럼 반복되는 실무 상황별 대표 문장을 먼저 살펴봅니다.',
                ],
                [
                  '③ 같은 의도의 정중도와 톤 비교',
                  'Please, Could you, Would you mind 같은 요청 표현이 업무 상황에서 어떻게 다른 인상을 주는지 비교합니다.',
                ],
                [
                  '④ 전문용어·비즈니스 회화로 확장',
                  '계약·무역 용어는 X-DIC 전문용어 검색으로, 더 많은 회화 예문은 기존 비즈니스 영어회화로 이어서 탐색합니다.',
                ],
              ].map(([title, text]) => (
                <article
                  key={title}
                  className="rounded-xl bg-white border border-slate-200 p-4"
                >
                  <h3 className="font-extrabold text-slate-900 text-sm md:text-base mb-2">
                    {title}
                  </h3>
                  <p className="text-[12px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="business-situations"
          aria-labelledby="business-situations-title"
          className="scroll-mt-20 mb-8 md:mb-10"
        >
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-indigo-600 mb-1">
              Business by Situation
            </p>
            <h2
              id="business-situations-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              업무 상황별 바로 쓰는 실무 영어
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              직장에서 자주 만나는 상황을 여섯 가지로 나누었습니다. 문장을 누르면 X-DIC 메인 검색 결과에서
              관련 번역, 전문용어와 병렬 예문을 이어서 확인할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {situations.map((situation) => (
              <article
                key={situation.id}
                id={situation.id}
                className="scroll-mt-20 rounded-2xl border border-indigo-100 bg-indigo-50/20 p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl" aria-hidden="true">{situation.icon}</div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] md:text-[17px] font-extrabold text-slate-900">
                      {situation.title}
                      <span className="ml-2 text-[11px] md:text-[12px] font-bold text-indigo-500">
                        {situation.subtitle}
                      </span>
                    </h3>
                    <p className="mt-1 text-[11px] md:text-[12px] text-slate-500 leading-relaxed">
                      {situation.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {situation.phrases.map((phrase) => (
                    <Link
                      key={phrase.en}
                      href={`/?q=${encodeURIComponent(phrase.query)}`}
                      className="block rounded-xl border border-white bg-white p-3 hover:border-indigo-200 hover:shadow-sm transition-all"
                    >
                      <p className="text-[12px] md:text-[14px] font-extrabold text-indigo-700 leading-snug">
                        {phrase.en}
                      </p>
                      <p className="mt-1 text-[11px] md:text-[12px] font-bold text-slate-700">
                        {phrase.ko}
                      </p>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="business-intents"
          aria-labelledby="business-intents-title"
          className="scroll-mt-20 mb-8 md:mb-10"
        >
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-violet-600 mb-1">
              One Business Intention, Several Expressions
            </p>
            <h2
              id="business-intents-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              같은 업무 의도를 여러 영어 표현으로 말해 보세요
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              실무 영어에서는 뜻만 맞는 것보다 상대방과 상황에 맞는 강도·정중도도 중요합니다.
              같은 목적의 문장을 여러 형태로 비교해 보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {intentGroups.map((group) => (
              <article
                key={group.title}
                className="rounded-2xl border border-violet-100 bg-violet-50/20 p-4 md:p-5"
              >
                <div className="flex gap-3">
                  <div className="text-xl" aria-hidden="true">{group.icon}</div>
                  <div>
                    <h3 className="text-[14px] md:text-[16px] font-extrabold text-slate-900">
                      {group.title}
                    </h3>
                    <p className="mt-1 text-[11px] md:text-[12px] text-slate-500">
                      {group.intent}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {group.items.map(([en, ko]) => (
                    <Link
                      key={en}
                      href={`/?q=${encodeURIComponent(en)}`}
                      className="block rounded-xl bg-white border border-white p-3 hover:border-violet-200 transition-colors"
                    >
                      <p className="text-[12px] md:text-[13px] font-extrabold text-violet-700">
                        {en}
                      </p>
                      <p className="mt-0.5 text-[11px] md:text-[12px] text-slate-600 font-bold">
                        {ko}
                      </p>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="business-tone-title" className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-emerald-600 mb-1">
              Professional Tone Guide
            </p>
            <h2
              id="business-tone-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              실무 요청 표현의 정중도와 업무 톤
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              같은 부탁이라도 문장 구조에 따라 직접적이거나 더 정중하게 들릴 수 있습니다.
              하나의 절대적인 규칙이 아니라 관계·업무 부담·매체를 함께 고려해 선택하는 것이 좋습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {toneGuide.map((item) => (
              <article
                key={item.expression}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-4 md:p-5"
              >
                <h3 className="text-[15px] md:text-[17px] font-black text-emerald-700">
                  {item.expression}
                </h3>
                <p className="mt-0.5 text-[11px] md:text-[12px] font-bold text-slate-600">
                  {item.ko}
                </p>
                <p className="mt-2 text-[11px] md:text-[12px] font-extrabold text-slate-700">
                  {item.level}
                </p>
                <p className="mt-1 text-[11px] md:text-[13px] text-slate-600 leading-relaxed">
                  {item.note}
                </p>
                <Link
                  href={`/?q=${encodeURIComponent(item.example)}`}
                  className="mt-3 block rounded-xl border border-emerald-100 bg-white p-3 hover:border-emerald-300 transition-colors"
                >
                  <p className="text-[12px] md:text-[13px] font-extrabold text-slate-900">
                    {item.example}
                  </p>
                  <p className="mt-0.5 text-[11px] md:text-[12px] text-slate-500">
                    {item.exampleKo}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="business-email-title" className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-sky-600 mb-1">
              Business Email Patterns
            </p>
            <h2
              id="business-email-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              업무 이메일을 구성하는 짧은 표현
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              이메일 전체 문장을 외우기보다 시작·요청·회신·마무리처럼 역할별 짧은 표현을 알아두면
              상황에 맞게 조합하기 쉽습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {emailPatterns.map((group) => (
              <article
                key={group.title}
                className="rounded-2xl border border-sky-100 bg-sky-50/20 p-4 md:p-5"
              >
                <h3 className="flex items-center gap-2 text-[14px] md:text-[16px] font-extrabold text-slate-900">
                  <span aria-hidden="true">{group.icon}</span>
                  {group.title}
                </h3>

                <div className="mt-3 space-y-2">
                  {group.items.map(([en, ko]) => (
                    <Link
                      key={en}
                      href={`/?q=${encodeURIComponent(en)}`}
                      className="block rounded-xl bg-white border border-white p-3 hover:border-sky-200 transition-colors"
                    >
                      <p className="text-[12px] md:text-[13px] font-extrabold text-sky-700">
                        {en}
                      </p>
                      <p className="mt-0.5 text-[11px] md:text-[12px] text-slate-600 font-bold">
                        {ko}
                      </p>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="business-mini-glossary-title" className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-amber-600 mb-1">
              Business Mini Glossary
            </p>
            <h2
              id="business-mini-glossary-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              실무에서 자주 만나는 핵심 단어 미니 해설
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {miniGlossary.map((item) => (
              <article
                key={item.term}
                className="rounded-2xl border border-amber-100 bg-amber-50/20 p-4 md:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[13px] md:text-[15px] font-extrabold text-slate-900">
                      {item.term}
                      <span className="ml-2 text-slate-500 font-bold">· {item.ko}</span>
                    </h3>
                    <p className="mt-1.5 text-[11px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
                      {item.note}
                    </p>
                  </div>

                  <Link
                    href={`/?q=${encodeURIComponent(item.query)}`}
                    className="shrink-0 px-2.5 py-1 rounded-full border border-amber-200 bg-white text-[10px] md:text-[11px] font-bold text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    검색 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="business-dialogues-title" className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-rose-600 mb-1">
              Mini Business Dialogues
            </p>
            <h2
              id="business-dialogues-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              짧은 대화로 업무 표현을 연결해 보세요
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {miniDialogues.map((dialogue) => (
              <article
                key={dialogue.title}
                className="rounded-2xl border border-rose-100 bg-rose-50/20 p-4 md:p-5"
              >
                <h3 className="flex items-center gap-2 text-[14px] md:text-[16px] font-extrabold text-slate-900">
                  <span aria-hidden="true">{dialogue.icon}</span>
                  {dialogue.title}
                </h3>

                <div className="mt-3 space-y-2">
                  {dialogue.lines.map(([speaker, en, ko]) => (
                    <Link
                      key={`${dialogue.title}-${speaker}-${en}`}
                      href={`/?q=${encodeURIComponent(en)}`}
                      className="block rounded-xl border border-white bg-white p-3 hover:border-rose-200 transition-colors"
                    >
                      <p className="text-[10px] md:text-[11px] font-black text-rose-600">
                        {speaker}
                      </p>
                      <p className="mt-0.5 text-[12px] md:text-[13px] font-extrabold text-slate-900">
                        {en}
                      </p>
                      <p className="mt-0.5 text-[11px] md:text-[12px] text-slate-500 font-bold">
                        {ko}
                      </p>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="business-search-paths-title" className="mb-8 md:mb-10">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4 md:p-6">
            <p className="text-[11px] md:text-xs font-bold text-indigo-600 mb-1">
              Related Business Search Paths
            </p>
            <h2
              id="business-search-paths-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              업무 흐름을 따라 관련 표현을 이어서 검색해 보세요
            </h2>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchPaths.map((path) => (
                <article
                  key={path.title}
                  className="rounded-xl border border-white bg-white p-4"
                >
                  <h3 className="text-[13px] md:text-sm font-extrabold text-slate-900">
                    {path.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {path.terms.map((term, index) => (
                      <React.Fragment key={`${path.title}-${term}`}>
                        {index > 0 && (
                          <span className="text-slate-300 text-[11px]" aria-hidden="true">
                            →
                          </span>
                        )}
                        <Link
                          href={`/?q=${encodeURIComponent(term)}`}
                          className="px-2.5 py-1 rounded-full border border-indigo-100 bg-indigo-50/60 text-[11px] md:text-[12px] font-bold text-indigo-700 hover:border-indigo-300 hover:bg-indigo-100 transition-colors"
                        >
                          {term}
                        </Link>
                      </React.Fragment>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="business-treasure-title" className="mb-8 md:mb-10">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2
              id="business-treasure-title"
              className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2"
            >
              <span className="text-xl">🎁</span> 나만의 실무 영어 보물창고
            </h2>

            {myHistory.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('보물창고를 비울까요?')) {
                    setMyHistory([]);
                    localStorage.removeItem('xdic_business_treasure');
                  }
                }}
                className="text-slate-400 hover:text-red-500 text-[11px] font-bold"
              >
                비우기
              </button>
            )}
          </div>

          <div className="bg-indigo-50/35 rounded-2xl p-4 md:p-5 border border-indigo-100 min-h-[82px]">
            {myHistory.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {myHistory.map((item, index) => (
                  <Link
                    key={`${item}-${index}`}
                    href={`/?q=${encodeURIComponent(item)}`}
                    className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-[12px] md:text-sm font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center text-slate-400 text-[12px] md:text-sm italic py-3">
                아직 저장된 검색어가 없습니다. 위 검색창에서 실무 표현을 찾아보세요.
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="recommended-business-title" className="mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-3">
            <div>
              <p className="text-[11px] md:text-xs font-bold text-indigo-600 mb-1">
                Recommended Business English
              </p>
              <h2
                id="recommended-business-title"
                className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2"
              >
                <span className="text-xl">💼</span> 추천 실무 영어 표현
              </h2>
            </div>

            <Link
              href="/conversation?type=business"
              className="text-[11px] md:text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              비즈니스 영어회화 더 보기 →
            </Link>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-4 md:p-5 border border-slate-200">
            <div className="flex flex-wrap gap-2">
              {recommendedPhrases.map((phrase) => (
                <Link
                  key={phrase}
                  href={`/?q=${encodeURIComponent(phrase)}`}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] md:text-[12px] font-bold rounded-full hover:border-indigo-300 hover:text-indigo-700 transition-all"
                >
                  # {phrase}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="business-faq-title" className="mb-8 md:mb-10">
          <p className="text-[11px] md:text-xs font-bold text-indigo-600 mb-1">
            Business English FAQ
          </p>
          <h2
            id="business-faq-title"
            className="text-lg md:text-xl font-black text-slate-900 mb-3"
          >
            X-DIC Business FAQ
          </h2>

          <div className="space-y-2.5">
            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-extrabold text-[13px] md:text-sm text-slate-900">
                한국어 실무 문장도 검색할 수 있나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                네. 한국어 또는 영어 문장을 검색하면 X-DIC 메인 결과에서 추천 번역, 참고 표현,
                전문용어와 실제 병렬 예문을 확인할 수 있습니다.
              </p>
            </details>

            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-extrabold text-[13px] md:text-sm text-slate-900">
                Please와 Could you는 업무 이메일에서 어떻게 다른가요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                Please는 간결하고 직접적인 요청에 자주 쓰이고, Could you는 상대방에게 행동을 부탁할 때
                일반적으로 조금 더 부드럽게 들릴 수 있습니다. 관계·업무 부담·문맥에 따라 선택하는 것이 좋습니다.
              </p>
            </details>

            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-extrabold text-[13px] md:text-sm text-slate-900">
                계약·무역 전문용어는 어디에서 더 볼 수 있나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                bill of lading, letter of credit, payment terms 같은 전문용어는 X-DIC 무역·경제 전문용어 허브와
                메인 검색에서 이어서 확인할 수 있습니다.
              </p>
            </details>

            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-extrabold text-[13px] md:text-sm text-slate-900">
                이 페이지의 문장을 그대로 공식 계약서에 사용해도 되나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                일상적인 업무 의사소통에는 참고할 수 있지만 계약·법률 문서는 문구 하나가 권리와 의무에 영향을 줄 수 있습니다.
                중요한 계약 문서는 해당 분야의 공식 문서와 전문가 검토를 함께 확인해 주세요.
              </p>
            </details>
          </div>
        </section>

        <section
          aria-labelledby="business-notice-title"
          className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4 md:p-5"
        >
          <h2
            id="business-notice-title"
            className="text-sm md:text-base font-extrabold text-slate-900 mb-2"
          >
            X-DIC Business 이용 안내
          </h2>
          <p className="text-[11px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
            X-DIC Business는 직장과 거래 현장에서 자주 쓰는 실무 영어를 빠르게 탐색하고
            X-DIC 한영·영한 사전 및 전문용어 검색 결과와 연결하기 위한 실용 영어 허브입니다.
            법률·계약·세무처럼 정확한 전문 검토가 필요한 문서는 공식 자료와 전문가의 확인을 함께 이용해 주세요.
          </p>
        </section>
      </main>
    </div>
  );
}
