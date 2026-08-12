'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type TravelItem = {
  en: string;
  ko: string;
  query: string;
};

type TravelSituation = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  phrases: TravelItem[];
};

export default function TravelPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [myHistory, setMyHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('xdic_travel_treasure');

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
        localStorage.removeItem('xdic_travel_treasure');
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
      'xdic_travel_treasure',
      JSON.stringify(updatedHistory)
    );

    router.push(`/?q=${encodeURIComponent(trimmed)}`);
  };

  const situations: TravelSituation[] = [
    {
      id: 'airport-transport',
      icon: '✈️',
      title: '공항·교통',
      subtitle: 'Airport & Transportation',
      description:
        '체크인, 좌석, 탑승구, 환승, 택시와 대중교통에서 자주 필요한 기본 표현입니다.',
      phrases: [
        {
          en: 'Where is the check-in counter?',
          ko: '체크인 카운터가 어디에 있나요?',
          query: 'Where is the check-in counter?',
        },
        {
          en: 'Could I have an aisle seat?',
          ko: '통로 쪽 좌석으로 받을 수 있을까요?',
          query: 'Could I have an aisle seat?',
        },
        {
          en: 'Where do I transfer?',
          ko: '어디에서 갈아타나요?',
          query: 'Where do I transfer?',
        },
      ],
    },
    {
      id: 'hotel',
      icon: '🏨',
      title: '호텔·숙소',
      subtitle: 'Hotel & Accommodation',
      description:
        '예약 확인, 체크인·체크아웃, 객실 요청과 숙소 문제를 설명할 때 유용한 표현입니다.',
      phrases: [
        {
          en: 'I have a reservation under Kim.',
          ko: '김이라는 이름으로 예약했습니다.',
          query: 'I have a reservation under Kim.',
        },
        {
          en: 'What time is check-out?',
          ko: '체크아웃은 몇 시인가요?',
          query: 'What time is check-out?',
        },
        {
          en: 'Could I get another towel?',
          ko: '수건을 하나 더 받을 수 있을까요?',
          query: 'Could I get another towel?',
        },
      ],
    },
    {
      id: 'restaurant',
      icon: '🍽️',
      title: '식당·카페',
      subtitle: 'Restaurant & Cafe',
      description:
        '자리 요청, 주문, 음식 확인, 계산 등 식당에서 반복해서 쓰이는 표현을 모았습니다.',
      phrases: [
        {
          en: 'A table for two, please.',
          ko: '두 명 자리 부탁합니다.',
          query: 'A table for two, please.',
        },
        {
          en: "I'd like this, please.",
          ko: '이걸로 주세요.',
          query: "I'd like this, please.",
        },
        {
          en: 'Could we have the bill, please?',
          ko: '계산서 부탁합니다.',
          query: 'Could we have the bill, please?',
        },
      ],
    },
    {
      id: 'shopping',
      icon: '🛍️',
      title: '쇼핑·결제',
      subtitle: 'Shopping & Payment',
      description:
        '가격, 사이즈, 교환, 카드 결제와 영수증 등 쇼핑할 때 바로 사용할 수 있는 표현입니다.',
      phrases: [
        {
          en: 'How much is this?',
          ko: '이것은 얼마인가요?',
          query: 'How much is this?',
        },
        {
          en: "I'd like to exchange this for something else.",
          ko: '다른 제품으로 교환하고 싶습니다.',
          query: "I'd like to exchange this for something else.",
        },
        {
          en: 'Can I pay by card?',
          ko: '카드로 결제할 수 있나요?',
          query: 'Can I pay by card?',
        },
      ],
    },
    {
      id: 'directions',
      icon: '🗺️',
      title: '길찾기·관광',
      subtitle: 'Directions & Sightseeing',
      description:
        '장소를 찾거나 이동 시간, 입장, 사진 촬영 가능 여부 등을 물을 때 사용하는 표현입니다.',
      phrases: [
        {
          en: 'How can I get to the station?',
          ko: '역에 어떻게 가나요?',
          query: 'How can I get to the station?',
        },
        {
          en: 'How long does it take?',
          ko: '얼마나 걸리나요?',
          query: 'How long does it take?',
        },
        {
          en: 'Can I take pictures here?',
          ko: '여기서 사진을 찍어도 되나요?',
          query: 'Can I take pictures here?',
        },
      ],
    },
    {
      id: 'trouble',
      icon: '🆘',
      title: '문제·도움 요청',
      subtitle: 'Problems & Help',
      description:
        '분실, 고장, 몸 상태, 의사소통 문제처럼 여행 중 곤란한 상황에서 필요한 표현입니다.',
      phrases: [
        {
          en: 'I lost my wallet.',
          ko: '지갑을 잃어버렸어요.',
          query: 'I lost my wallet.',
        },
        {
          en: "It's not working.",
          ko: '작동하지 않아요.',
          query: "It's not working.",
        },
        {
          en: 'Could you help me, please?',
          ko: '도와주시겠어요?',
          query: 'Could you help me, please?',
        },
      ],
    },
  ];

  const intentGroups = [
    {
      icon: '📍',
      title: '장소를 물을 때',
      intent: '“어디에 있나요?”를 상황에 맞게 바꾸어 말합니다.',
      items: [
        ['Where is the restroom?', '화장실이 어디에 있나요?'],
        ['Where can I find a taxi?', '택시는 어디에서 탈 수 있나요?'],
        ['Which way is the station?', '역은 어느 쪽인가요?'],
      ],
    },
    {
      icon: '🙋',
      title: '정중하게 요청할 때',
      intent: '여행지에서는 짧아도 정중한 요청 표현이 실용적입니다.',
      items: [
        ['Could you help me?', '도와주시겠어요?'],
        ['Could I have some water?', '물 좀 주시겠어요?'],
        ['Could you write it down?', '적어 주시겠어요?'],
      ],
    },
    {
      icon: '🧾',
      title: '원하는 것을 말할 때',
      intent: '주문·구매·예약에서 “원합니다”를 자연스럽게 표현합니다.',
      items: [
        ["I'd like this one.", '이걸로 하겠습니다.'],
        ["I'd like to book a room.", '방을 예약하고 싶습니다.'],
        ["I'd like a coffee, please.", '커피 한 잔 주세요.'],
      ],
    },
    {
      icon: '❓',
      title: '가능 여부를 확인할 때',
      intent: '규칙, 결제, 이용 가능 여부를 묻는 대표 구조입니다.',
      items: [
        ['Can I use this ticket?', '이 표를 사용할 수 있나요?'],
        ['Can I pay by card?', '카드로 결제할 수 있나요?'],
        ['Is Wi-Fi available?', '와이파이를 사용할 수 있나요?'],
      ],
    },
  ];

  const politenessGuide = [
    {
      expression: 'Can I ...?',
      ko: '제가 …해도 될까요?',
      level: '기본적이고 직접적인 허가·가능 여부 확인',
      example: 'Can I leave my luggage here?',
      exampleKo: '짐을 여기에 맡겨도 될까요?',
    },
    {
      expression: 'Could I ...?',
      ko: '제가 …할 수 있을까요?',
      level: 'Can I보다 조금 더 정중하게 들릴 수 있는 요청',
      example: 'Could I have a window seat?',
      exampleKo: '창가 쪽 좌석으로 받을 수 있을까요?',
    },
    {
      expression: 'Could you ...?',
      ko: '…해주시겠어요?',
      level: '상대방에게 도움이나 행동을 정중하게 부탁',
      example: 'Could you call a taxi for me?',
      exampleKo: '택시를 불러주시겠어요?',
    },
    {
      expression: "I'd like ...",
      ko: '…을 원합니다 / …하고 싶습니다',
      level: '주문·예약·구매에서 부드럽게 의사를 표현',
      example: "I'd like a room for two nights.",
      exampleKo: '이틀 묵을 방을 원합니다.',
    },
  ];

  const miniGlossary = [
    {
      term: 'boarding pass',
      ko: '탑승권',
      query: 'boarding pass',
      note:
        '항공기에 탑승할 때 필요한 탑승 정보를 담은 문서나 전자 증표를 가리킵니다.',
    },
    {
      term: 'carry-on',
      ko: '기내 반입 수하물',
      query: 'carry-on luggage',
      note:
        '항공기 화물칸에 부치지 않고 승객이 기내로 가져가는 짐을 가리키는 표현입니다.',
    },
    {
      term: 'reservation',
      ko: '예약',
      query: 'reservation',
      note:
        '호텔·식당·교통편 등을 미리 확보해 두는 예약을 나타내는 대표 여행 표현입니다.',
    },
    {
      term: 'vacancy',
      ko: '빈방 / 공석',
      query: 'vacancy hotel',
      note:
        '호텔 문맥에서는 이용 가능한 빈 객실이 있다는 뜻으로 쓰일 수 있습니다.',
    },
    {
      term: 'receipt',
      ko: '영수증',
      query: 'receipt',
      note:
        '물건이나 서비스의 결제 사실과 금액을 확인하는 문서를 가리킵니다.',
    },
    {
      term: 'change',
      ko: '거스름돈 / 잔돈',
      query: 'change money',
      note:
        '쇼핑·결제 문맥에서는 거스름돈이나 잔돈을 뜻할 수 있으므로 일반적인 change의 뜻과 구분해야 합니다.',
    },
    {
      term: 'platform',
      ko: '승강장',
      query: 'platform station',
      note:
        '철도·지하철 문맥에서는 열차를 타고 내리는 승강장을 가리키는 대표적인 여행 용어입니다.',
    },
    {
      term: 'transfer',
      ko: '환승하다 / 갈아타다',
      query: 'transfer transportation',
      note:
        '한 교통편에서 다른 교통편으로 바꾸어 타는 상황을 설명할 때 자주 사용됩니다.',
    },
  ];

  const miniDialogues = [
    {
      icon: '✈️',
      title: '공항에서 좌석 요청',
      lines: [
        ['Traveler', 'Could I have an aisle seat?', '통로 쪽 좌석으로 받을 수 있을까요?'],
        ['Staff', 'Sure. Let me check.', '네. 확인해 볼게요.'],
      ],
    },
    {
      icon: '🏨',
      title: '호텔에서 예약 확인',
      lines: [
        ['Traveler', 'I have a reservation under Park.', '박이라는 이름으로 예약했습니다.'],
        ['Staff', 'May I see your passport?', '여권을 보여주시겠어요?'],
      ],
    },
    {
      icon: '🍽️',
      title: '식당에서 주문',
      lines: [
        ['Traveler', "I'd like this, please.", '이걸로 주세요.'],
        ['Staff', 'Anything to drink?', '마실 것은 필요하신가요?'],
      ],
    },
    {
      icon: '🛍️',
      title: '가게에서 교환 요청',
      lines: [
        ['Traveler', "I'd like to exchange this.", '이것을 교환하고 싶습니다.'],
        ['Staff', 'Do you have the receipt?', '영수증을 가지고 계신가요?'],
      ],
    },
  ];

  const searchPaths = [
    {
      title: '공항 출발 흐름',
      terms: ['check-in', 'boarding pass', 'security check', 'boarding gate'],
    },
    {
      title: '호텔 이용 흐름',
      terms: ['reservation', 'check-in', 'room key', 'check-out'],
    },
    {
      title: '식당 이용 흐름',
      terms: ['table for two', 'menu', 'order', 'bill'],
    },
    {
      title: '쇼핑·교환 흐름',
      terms: ['price', 'size', 'receipt', 'exchange'],
    },
  ];

  const recommendedPhrases = [
    'Excuse me.',
    'Could you help me?',
    'How much is this?',
    'Where is the restroom?',
    'How can I get there?',
    'Could you say that again?',
    'Could you speak more slowly?',
    "I'd like this, please.",
    'Can I pay by card?',
    'Could I have the bill, please?',
    'I have a reservation.',
    'What time is check-out?',
    'Where is the boarding gate?',
    'How long does it take?',
    'I lost my wallet.',
    "It's not working.",
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-blue-700 transition-colors font-bold text-[11px] md:text-xs bg-slate-50 hover:bg-blue-50 px-2.5 py-1 rounded-full"
          >
            <span>←</span> 메인으로 <span className="text-slate-400 font-semibold">· Home</span>
          </Link>

          <div className="text-[12px] md:text-[13px] font-black text-slate-800 tracking-tighter">
            <span className="text-blue-600">X</span>-DIC
            <span className="text-slate-400 ml-1">TRAVEL</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-16 md:pt-20 pb-20">
        <section className="text-center mb-4 md:mb-5">
          <p className="text-[9px] md:text-[10px] font-extrabold tracking-[0.12em] text-blue-600 uppercase mb-1">
            X-DIC Practical English
          </p>

          <h1 className="text-[24px] md:text-[30px] font-black text-slate-900 leading-tight tracking-tight">
            실용 여행 영어
            <span className="ml-1.5 text-[11px] md:text-[13px] font-bold text-blue-600 align-middle">
              X-DIC Travel
            </span>
          </h1>

          <p className="mt-1.5 text-[10px] md:text-[12px] font-bold tracking-tight text-slate-500">
            <span className="text-blue-600">Practical Travel English</span>
            <span className="text-slate-300"> · </span>
            <span className="text-slate-500">Ko-En / En-Ko</span>
          </p>

          <p className="max-w-3xl mx-auto mt-2 text-[11px] md:text-[12.5px] text-slate-500 leading-5 md:leading-[1.65] break-keep">
            공항, 호텔, 식당, 쇼핑, 길찾기와 문제 상황에서 바로 사용할 수 있는 여행 영어를
            한영·영한 검색과 연결해 살펴보세요. 문장 하나를 외우는 데 그치지 않고,
            같은 의도를 여러 방식으로 말하는 법과 표현의 정중도 차이도 함께 확인할 수 있습니다.
          </p>

          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <a
              href="#travel-situations"
              className="px-2.5 py-1 rounded-full border border-blue-100 bg-blue-50 text-[10px] md:text-[11px] font-bold text-blue-700"
            >
              상황별 여행 영어
            </a>
            <a
              href="#travel-intents"
              className="px-2.5 py-1 rounded-full border border-violet-100 bg-violet-50 text-[10px] md:text-[11px] font-bold text-violet-700"
            >
              같은 의도 여러 표현
            </a>
            <Link
              href="/conversation?type=travel"
              className="px-2.5 py-1 rounded-full border border-slate-200 bg-white text-[10px] md:text-[11px] font-bold text-slate-600 hover:border-blue-200 hover:text-blue-700 transition-colors"
            >
              여행 영어회화 더 보기 →
            </Link>
          </div>
        </section>

        <section aria-labelledby="travel-search-title" className="mb-5 md:mb-6">
          <h2 id="travel-search-title" className="sr-only">
            여행 영어 문장과 표현 검색
          </h2>

          <div className="relative max-w-2xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full h-12 md:h-14 bg-white rounded-xl border border-blue-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 transition-all"
            >
              <div className="pl-4 md:pl-5 text-blue-500">
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
                placeholder="예: 계산서 부탁합니다 / Where is the station?"
                className="flex-grow min-w-0 h-full px-3 md:px-4 text-sm md:text-base outline-none font-medium text-slate-800"
                autoComplete="off"
              />

              <button
                type="submit"
                className="h-full px-5 md:px-6 bg-blue-600 text-white font-black text-sm md:text-base hover:bg-blue-700 transition-colors"
              >
                검색
              </button>
            </form>

            <p className="mt-1.5 text-center text-[10px] md:text-[11px] text-slate-400 font-medium">
              검색하면 X-DIC 메인 결과로 이동하며 최근 검색어는 현재 브라우저에 저장됩니다.
            </p>
          </div>
        </section>

        <section aria-labelledby="travel-guide-title" className="mb-8 md:mb-10">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:p-6">
            <p className="text-[11px] md:text-xs font-bold text-blue-600 mb-1">
              Practical Travel English Guide
            </p>
            <h2
              id="travel-guide-title"
              className="text-lg md:text-2xl font-black text-slate-900"
            >
              X-DIC Travel을 활용하는 방법
            </h2>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {[
                [
                  '① 한국어·영어 문장 검색',
                  '말하고 싶은 한국어 문장이나 들은 영어 표현을 검색해 X-DIC의 추천 번역과 병렬 예문을 확인합니다.',
                ],
                [
                  '② 상황별 핵심 표현 확인',
                  '공항·호텔·식당·쇼핑처럼 여행에서 자주 반복되는 상황을 중심으로 먼저 대표 표현을 살펴봅니다.',
                ],
                [
                  '③ 한 가지 의도를 여러 표현으로 비교',
                  '“어디에 있나요?”, “도와주세요”, “원합니다”처럼 같은 의도를 다른 영어 문장으로 표현하는 방법을 비교합니다.',
                ],
                [
                  '④ 기존 여행 영어회화로 확장',
                  '더 많은 회화 예문과 번역가 해설이 필요하면 기존 X-DIC 필수 영어회화의 여행 카테고리로 이어서 탐색합니다.',
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
          id="travel-situations"
          aria-labelledby="travel-situations-title"
          className="scroll-mt-20 mb-8 md:mb-10"
        >
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-blue-600 mb-1">
              Travel by Situation
            </p>
            <h2
              id="travel-situations-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              여행 상황별 바로 쓰는 영어
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              여행 중 자주 만나는 상황을 여섯 가지로 나누었습니다. 영어 또는 한국어 문장을 누르면
              X-DIC 메인 검색 결과에서 관련 표현과 실제 병렬 예문을 이어서 확인할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {situations.map((situation) => (
              <article
                key={situation.id}
                id={situation.id}
                className="scroll-mt-20 rounded-2xl border border-blue-100 bg-blue-50/20 p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl" aria-hidden="true">{situation.icon}</div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] md:text-[17px] font-extrabold text-slate-900">
                      {situation.title}
                      <span className="ml-2 text-[11px] md:text-[12px] font-bold text-blue-500">
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
                      className="block rounded-xl border border-white bg-white p-3 hover:border-blue-200 hover:shadow-sm transition-all"
                    >
                      <p className="text-[12px] md:text-[14px] font-extrabold text-blue-700 leading-snug">
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
          id="travel-intents"
          aria-labelledby="travel-intents-title"
          className="scroll-mt-20 mb-8 md:mb-10"
        >
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-violet-600 mb-1">
              One Intention, Several Expressions
            </p>
            <h2
              id="travel-intents-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              같은 의도를 여러 영어 표현으로 말해 보세요
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              실제 여행에서는 외운 문장이 정확히 맞지 않는 경우가 많습니다.
              문장 하나보다 “무엇을 말하려는지”를 중심으로 여러 표현을 알아두면 응용하기 쉽습니다.
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

        <section aria-labelledby="travel-politeness-title" className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-emerald-600 mb-1">
              Polite Travel English
            </p>
            <h2
              id="travel-politeness-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              여행에서 자주 쓰는 정중한 요청 구조
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              아래 표현은 모두 여행에서 자주 쓰이지만 역할이 조금씩 다릅니다.
              문법 이름보다 실제 요청 상황과 함께 익혀 보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {politenessGuide.map((item) => (
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
                <p className="mt-2 text-[11px] md:text-[13px] text-slate-600 leading-relaxed">
                  {item.level}
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

        <section aria-labelledby="travel-mini-glossary-title" className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-sky-600 mb-1">
              Travel Mini Glossary
            </p>
            <h2
              id="travel-mini-glossary-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              여행에서 자주 만나는 핵심 단어 미니 해설
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {miniGlossary.map((item) => (
              <article
                key={item.term}
                className="rounded-2xl border border-sky-100 bg-sky-50/20 p-4 md:p-5"
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
                    className="shrink-0 px-2.5 py-1 rounded-full border border-sky-200 bg-white text-[10px] md:text-[11px] font-bold text-sky-700 hover:bg-sky-50 transition-colors"
                  >
                    검색 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="travel-dialogues-title" className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-amber-600 mb-1">
              Mini Travel Dialogues
            </p>
            <h2
              id="travel-dialogues-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              짧은 대화로 여행 표현을 연결해 보세요
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              한 문장만 볼 때보다 질문과 응답이 이어지는 상황을 함께 보면 표현의 역할을 이해하기 쉽습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {miniDialogues.map((dialogue) => (
              <article
                key={dialogue.title}
                className="rounded-2xl border border-amber-100 bg-amber-50/20 p-4 md:p-5"
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
                      className="block rounded-xl border border-white bg-white p-3 hover:border-amber-200 transition-colors"
                    >
                      <p className="text-[10px] md:text-[11px] font-black text-amber-600">
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

        <section aria-labelledby="travel-search-paths-title" className="mb-8 md:mb-10">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-4 md:p-6">
            <p className="text-[11px] md:text-xs font-bold text-blue-600 mb-1">
              Related Travel Search Paths
            </p>
            <h2
              id="travel-search-paths-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              여행 흐름을 따라 관련 표현을 이어서 검색해 보세요
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
                          className="px-2.5 py-1 rounded-full border border-blue-100 bg-blue-50/60 text-[11px] md:text-[12px] font-bold text-blue-700 hover:border-blue-300 hover:bg-blue-100 transition-colors"
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

        <section aria-labelledby="travel-treasure-title" className="mb-8 md:mb-10">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2
              id="travel-treasure-title"
              className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2"
            >
              <span className="text-xl">🎁</span> 나만의 여행 영어 보물창고
            </h2>

            {myHistory.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('보물창고를 비울까요?')) {
                    setMyHistory([]);
                    localStorage.removeItem('xdic_travel_treasure');
                  }
                }}
                className="text-slate-400 hover:text-red-500 text-[11px] font-bold"
              >
                비우기
              </button>
            )}
          </div>

          <div className="bg-blue-50/35 rounded-2xl p-4 md:p-5 border border-blue-100 min-h-[82px]">
            {myHistory.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {myHistory.map((item, index) => (
                  <Link
                    key={`${item}-${index}`}
                    href={`/?q=${encodeURIComponent(item)}`}
                    className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-[12px] md:text-sm font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center text-slate-400 text-[12px] md:text-sm italic py-3">
                아직 저장된 검색어가 없습니다. 위 검색창에서 여행 표현을 찾아보세요.
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="recommended-travel-title" className="mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-3">
            <div>
              <p className="text-[11px] md:text-xs font-bold text-blue-600 mb-1">
                Recommended Travel English
              </p>
              <h2
                id="recommended-travel-title"
                className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2"
              >
                <span className="text-xl">🧳</span> 추천 실용 여행 표현
              </h2>
            </div>

            <Link
              href="/conversation?type=travel"
              className="text-[11px] md:text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              여행 영어회화 더 보기 →
            </Link>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-4 md:p-5 border border-slate-200">
            <div className="flex flex-wrap gap-2">
              {recommendedPhrases.map((phrase) => (
                <Link
                  key={phrase}
                  href={`/?q=${encodeURIComponent(phrase)}`}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] md:text-[12px] font-bold rounded-full hover:border-blue-300 hover:text-blue-700 transition-all"
                >
                  # {phrase}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="travel-faq-title" className="mb-8 md:mb-10">
          <p className="text-[11px] md:text-xs font-bold text-blue-600 mb-1">
            Travel English FAQ
          </p>
          <h2
            id="travel-faq-title"
            className="text-lg md:text-xl font-black text-slate-900 mb-3"
          >
            X-DIC Travel FAQ
          </h2>

          <div className="space-y-2.5">
            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-extrabold text-[13px] md:text-sm text-slate-900">
                한국어 여행 문장도 검색할 수 있나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                네. 한국어 또는 영어 문장을 검색하면 X-DIC 메인 검색 결과에서 추천 번역, 참고 표현,
                병렬 예문을 확인할 수 있습니다.
              </p>
            </details>

            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-extrabold text-[13px] md:text-sm text-slate-900">
                Can I와 Could I는 어떤 차이가 있나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                둘 다 허가나 가능 여부를 물을 수 있지만 Could I가 조금 더 정중하게 들리는 경우가 많습니다.
                실제 상황에서는 말투와 앞뒤 문맥도 함께 작용하므로 하나의 절대적인 규칙으로 보지는 않는 것이 좋습니다.
              </p>
            </details>

            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-extrabold text-[13px] md:text-sm text-slate-900">
                이 페이지와 ‘필수 영어회화’의 차이는 무엇인가요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                X-DIC Travel은 여행 상황별 표현, 의도별 표현과 핵심 단어를 한 페이지에서 탐색하는 허브입니다.
                기존 필수 영어회화는 더 많은 개별 회화 예문과 번역가 해설을 살펴보는 콘텐츠입니다.
              </p>
            </details>

            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-extrabold text-[13px] md:text-sm text-slate-900">
                여행지에서 문장을 그대로 읽어도 되나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                간단한 요청에는 활용할 수 있지만 실제 상황과 상대방의 답변에 따라 표현이 달라질 수 있습니다.
                중요한 예약·교통·의료·안전 정보는 현지 직원이나 공식 안내와 다시 확인해 주세요.
              </p>
            </details>
          </div>
        </section>

        <section
          aria-labelledby="travel-notice-title"
          className="rounded-2xl border border-blue-100 bg-blue-50/30 p-4 md:p-5"
        >
          <h2
            id="travel-notice-title"
            className="text-sm md:text-base font-extrabold text-slate-900 mb-2"
          >
            X-DIC Travel 이용 안내
          </h2>
          <p className="text-[11px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
            X-DIC Travel은 여행 중 필요한 영어 표현을 빠르게 탐색하고 한영·영한 사전 결과와 연결하기 위한 실용 영어 허브입니다.
            교통 시간, 요금, 입국 절차, 의료·안전 관련 정보처럼 실제 상황에서 달라질 수 있는 내용은 현지 공식 안내를 함께 확인해 주세요.
          </p>
        </section>
      </main>
    </div>
  );
}
