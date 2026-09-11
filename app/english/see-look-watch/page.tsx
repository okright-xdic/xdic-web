import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'see, look at, watch 차이 | 보다를 자연스럽게 영어로 번역하는 기준',
  description:
    '한국어의 보다를 영어로 번역할 때 see, look at, watch를 어떻게 구별하는지 설명합니다. 시선의 의도, 움직임, 지속성, 상황을 중심으로 실제 번역 예문과 자주 생기는 오류를 정리합니다.',
  alternates: {
    canonical: '/english/see-look-watch',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const examples = [
  {
    ko: '창밖에 새가 보여요.',
    en: 'I can see a bird outside the window.',
    note: '의도적으로 관찰한다기보다 시야에 들어와 보이는 상황이므로 see가 자연스럽습니다.',
  },
  {
    ko: '이 사진을 보세요.',
    en: 'Look at this picture.',
    note: '상대방에게 특정 대상 쪽으로 시선을 돌리라고 할 때는 look at을 씁니다.',
  },
  {
    ko: '나는 사진을 보고 있어요.',
    en: "I'm looking at a photo.",
    note: '사진이라는 정적인 대상을 의식적으로 바라보고 있는 동작을 강조하므로 looking at이 자연스럽습니다.',
  },
  {
    ko: '우리는 텔레비전을 보고 있어요.',
    en: "We're watching TV.",
    note: '영상처럼 움직이고 변화하는 대상을 일정 시간 계속 보는 상황에서는 watch가 자연스럽습니다.',
  },
  {
    ko: '그는 축구 경기를 봤어요.',
    en: 'He watched the soccer game.',
    note: '경기 진행을 일정 시간 관찰했다는 의미이므로 watch를 쓰는 것이 일반적입니다.',
  },
  {
    ko: '어제 그 영화를 봤어요.',
    en: 'I saw that movie yesterday.',
    note: '영화 한 편을 관람했다는 경험 전체를 말할 때는 saw가 매우 자연스럽습니다.',
  },
  {
    ko: '저 사람을 봐.',
    en: 'Look at that person.',
    note: '상대방의 시선을 특정 사람에게 향하게 하는 명령이므로 look at을 씁니다.',
  },
  {
    ko: '길을 건널 때 차를 잘 보세요.',
    en: 'Watch for cars when you cross the street.',
    note: '위험 요소가 나타나는지 계속 주의해서 살피라는 의미에서는 watch 또는 watch for가 적절합니다.',
  },
];

const comparisonRows = [
  {
    expression: 'see',
    focus: '눈에 들어오다 · 보이다 · 관람 경험',
    example: 'I can see the mountain.',
    translation: '산이 보여요.',
  },
  {
    expression: 'look at',
    focus: '의도적으로 시선을 대상에 향하다',
    example: 'Look at the screen.',
    translation: '화면을 보세요.',
  },
  {
    expression: 'watch',
    focus: '움직임이나 변화를 일정 시간 관찰하다',
    example: 'We watched the game.',
    translation: '우리는 경기를 봤어요.',
  },
];

export default function SeeLookWatchPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <nav
          aria-label="현재 위치"
          className="mb-6 text-xs md:text-sm text-slate-500"
        >
          <Link href="/" className="hover:text-blue-700 font-medium">
            X-DIC 홈
          </Link>
          <span className="mx-2">›</span>
          <span>번역가 해설</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">see · look at · watch</span>
        </nav>

        <header className="border-b border-slate-200 pb-7 md:pb-9">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            see, look at, watch
            <br className="hidden md:block" />
            한국어의 ‘보다’를 어떻게 번역할까?
          </h1>

          <p className="mt-5 max-w-3xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            한국어에서는 사진을 <strong className="text-slate-900">보다</strong>,
            영화를 <strong className="text-slate-900">보다</strong>,
            사람이 <strong className="text-slate-900">보이다</strong>처럼
            하나의 동사가 넓게 사용됩니다. 영어에서는
            <strong className="text-slate-900">
              {' '}시선의 의도, 대상의 움직임, 보는 시간과 상황
            </strong>
            에 따라 see, look at, watch를 구별하는 것이 자연스럽습니다.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
            번역가 한줄 정리
          </h2>

          <p className="mt-3 leading-7 text-slate-700">
            <strong>see</strong>는 대체로 어떤 것이 눈에 들어오거나
            관람·경험한 사실을 말하고,
            <strong> look at</strong>은 특정 대상에 의식적으로 시선을 향하며,
            <strong> watch</strong>는 움직이거나 변하는 대상을 일정 시간
            지켜보는 의미가 강합니다.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-extrabold">
            1. ‘보다’라는 한국어 단어 하나만 보고 결정하지 않습니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-blue-600">
                SEE
              </p>
              <p className="mt-2 text-lg font-bold">
                I can see a bird.
              </p>
              <p className="mt-1 text-slate-700">
                새가 보여요.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                대상을 일부러 응시했다기보다 시야에 들어와 인식되는 상황입니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-emerald-600">
                LOOK AT
              </p>
              <p className="mt-2 text-lg font-bold">
                Look at this picture.
              </p>
              <p className="mt-1 text-slate-700">
                이 사진을 보세요.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                특정 대상에 의도적으로 시선을 향하게 하는 표현입니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-orange-600">
                WATCH
              </p>
              <p className="mt-2 text-lg font-bold">
                We watched the game.
              </p>
              <p className="mt-1 text-slate-700">
                우리는 경기를 봤어요.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                움직이고 변화하는 경기의 진행을 일정 시간 관찰하는 상황입니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            2. see · look at · watch 핵심 비교
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    표현
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    번역 판단
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    예문
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    한국어
                  </th>
                </tr>
              </thead>

              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    key={row.expression}
                    className="border-t border-slate-100 align-top"
                  >
                    <td className="px-4 py-4 font-extrabold text-blue-700">
                      {row.expression}
                    </td>
                    <td className="px-4 py-4 text-sm leading-6 text-slate-600">
                      {row.focus}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold">
                      {row.example}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {row.translation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            3. 실제 번역에서 비교해 보기
          </h2>

          <div className="mt-5 space-y-4">
            {examples.map((item, index) => (
              <article
                key={`${item.en}-${index}`}
                className="rounded-2xl border border-slate-200 p-5 md:p-6 bg-white shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-none w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="text-[15px] md:text-[17px] font-bold text-slate-900">
                      {item.ko}
                    </p>

                    <p className="mt-1 text-[15px] md:text-[17px] font-extrabold text-blue-700">
                      {item.en}
                    </p>

                    <p className="mt-3 text-sm md:text-[15px] leading-6 text-slate-600">
                      {item.note}
                    </p>

                    <Link
                      href={`/?q=${encodeURIComponent(item.ko)}`}
                      className="inline-flex mt-3 text-sm font-bold text-blue-600 hover:text-blue-800"
                    >
                      X-DIC에서 검색 →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-orange-200 bg-orange-50/50 p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-extrabold">
            4. 자주 생기는 번역 오류
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            한국어 문장에 ‘보다’가 있다는 이유만으로 모든 경우를
            <strong> see</strong>로 바꾸면 자연스럽지 않은 문장이 생길 수
            있습니다. 예를 들어 사진을 지금 의식적으로 바라보고 있다면
            <strong> I&apos;m seeing a photo</strong>보다는
            <strong> I&apos;m looking at a photo</strong>가 일반적으로
            자연스럽습니다.
          </p>

          <p className="mt-4 leading-7 text-slate-700">
            반대로 영화나 공연의 관람 경험을 말할 때는
            <strong> see</strong>가 자연스러운 경우가 많습니다.
            “어제 그 영화를 봤어요”는
            <strong> I saw that movie yesterday.</strong>라고 말할 수
            있습니다. 따라서 단순히 대상이 움직이는지 여부 하나만으로
            세 동사를 기계적으로 나누어서도 안 됩니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            5. 영화는 see도 되고 watch도 됩니다
          </h2>

          <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-5 md:p-6">
            <p className="font-bold text-slate-900">
              I saw the movie yesterday. ✓
            </p>

            <p className="mt-2 text-sm md:text-[15px] leading-6 text-slate-600">
              영화 한 편을 관람했다는 경험이나 사실을 중심으로 말합니다.
            </p>

            <p className="mt-5 font-bold text-slate-900">
              I watched the movie at home. ✓
            </p>

            <p className="mt-2 text-sm md:text-[15px] leading-6 text-slate-600">
              영화를 실제로 일정 시간 시청한 행동에 초점을 둘 수 있습니다.
            </p>

            <p className="mt-4 text-sm md:text-[15px] leading-6 text-slate-600">
              따라서 see와 watch가 항상 서로 배타적인 것은 아닙니다.
              같은 대상이라도 문장이 무엇을 강조하는지에 따라 선택이 달라질
              수 있습니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            6. X-DIC에서 판단하는 순서
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            ‘보다’를 번역할 때는 먼저 대상이 단순히 눈에 들어오는지,
            의도적으로 시선을 향하는지, 움직임이나 변화를 지속적으로
            관찰하는지를 확인합니다. 그다음 문장이 관람 경험 전체를 말하는지,
            현재 진행 중인 행동을 말하는지까지 살펴
            <strong> see / saw</strong>,
            <strong> look at / looking at</strong>,
            <strong> watch / watched / watching</strong> 가운데
            자연스러운 표현을 선택합니다.
          </p>
        </section>

        <aside className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <h2 className="text-lg font-extrabold">
            직접 비교해 볼 검색어
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              '나는 사진을 봐요',
              '나는 사진을 보고 있어요',
              '이 사진을 보세요',
              '우리는 텔레비전을 보고 있어요',
              'I can see a bird.',
              'Look at this picture.',
              'We watched the game.',
            ].map((query) => (
              <Link
                key={query}
                href={`/?q=${encodeURIComponent(query)}`}
                className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-sm font-bold text-blue-700 hover:bg-blue-50"
              >
                {query}
              </Link>
            ))}
          </div>

          <p className="mt-4 text-xs md:text-sm leading-6 text-slate-500">
            X-DIC 검색 결과는 사전과 병렬문장, 번역 결과를 확인하는 도구
            영역입니다. 이 페이지는 여러 영어 표현 가운데 어떤 표현을
            선택할 것인지 번역 관점에서 설명하는 편집 콘텐츠입니다.
          </p>
        </aside>

        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-lg font-extrabold">
            관련 번역가 해설
          </h2>

          <div className="mt-4">
            <Link
              href="/english/go-vs-come"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              go와 come — ‘가다·오다’ 번역 기준 →
            </Link>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            ← X-DIC 홈
          </Link>

          <Link
            href="/english"
            className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            영어 번역가 해설 전체
          </Link>

          <Link
            href="/about"
            className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-5 py-2 text-sm font-bold text-sky-700 hover:bg-sky-100"
          >
            About X-DIC
          </Link>

          <Link
            href="/data-policy"
            className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
          >
            데이터·편집 원칙
          </Link>

          <Link
            href="/guide"
            className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100"
          >
            X-DIC 이용 안내
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}