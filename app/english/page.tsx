import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title:
    '영어 번역가 해설 | 문맥·품사·시제로 보는 X-DIC 번역 가이드',
  description:
    'go와 come, see·look·watch, 관사, 전치사, 시제, book·file·plant 다의어까지 영어 번역에서 자주 헷갈리는 표현을 문맥과 문장 구조로 설명하는 X-DIC 번역가 해설 모음입니다.',
  alternates: {
    canonical: '/english',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const guideGroups = [
  {
    id: 'word-choice',
    title: '1. 기본 동사와 표현 선택',
    description:
      '한국어 하나에 여러 영어 동사가 대응할 때, 단어 대 단어로 바꾸기보다 시점·목적어·행동 방식·문장 구조를 함께 봅니다.',
    guides: [
      {
        href: '/english/go-vs-come',
        label: '이동 동사',
        title: 'go와 come',
        subtitle: '‘가다·오다’를 화자의 기준점으로 구별하기',
        summary:
          '같은 이동이라도 어디를 기준으로 움직이는지에 따라 go와 come이 달라집니다.',
        examples: 'Go home. · Come here.',
      },
      {
        href: '/english/see-look-watch',
        label: '지각 동사',
        title: 'see · look at · watch',
        subtitle: '‘보다’를 상황에 따라 나누기',
        summary:
          '자연스럽게 보이는지, 의도적으로 시선을 두는지, 움직임을 계속 지켜보는지를 구별합니다.',
        examples: 'I see a bird. · Look at this. · Watch TV.',
      },
      {
        href: '/english/say-tell-speak-talk',
        label: '말하기 동사',
        title: 'say · tell · speak · talk',
        subtitle: '‘말하다’의 목적어와 상대를 구별하기',
        summary:
          '말의 내용, 듣는 사람, 언어 능력, 대화의 상호성을 기준으로 네 동사를 비교합니다.',
        examples: 'Say hello. · Tell me. · Speak English. · Talk to me.',
      },
      {
        href: '/english/do-vs-make',
        label: '행위 동사',
        title: 'do와 make',
        subtitle: '‘하다·만들다’를 결합 표현으로 판단하기',
        summary:
          '활동·업무를 수행하는 경우와 결과물을 만들어 내는 경우를 구별하고 자주 쓰는 결합도 함께 봅니다.',
        examples: 'Do some exercise. · Make a decision.',
      },
    ],
  },
  {
    id: 'grammar',
    title: '2. 문법과 문장 구조',
    description:
      '전치사·관사·부정문·시제는 한국어와 영어가 일대일로 대응하지 않습니다. 문장의 기능과 시간 관계를 기준으로 번역합니다.',
    guides: [
      {
        href: '/english/in-on-at',
        label: '전치사',
        title: 'in · on · at',
        subtitle: '장소와 시간의 범위를 구별하기',
        summary:
          '안쪽 공간, 표면·날짜, 특정 지점·시각처럼 전치사가 나타내는 관계를 문맥으로 판단합니다.',
        examples: 'in Seoul · on Monday · at 7 o’clock',
      },
      {
        href: '/english/to-vs-for',
        label: '전치사',
        title: 'to와 for',
        subtitle: '방향·전달과 수혜·목적을 구별하기',
        summary:
          '누군가에게 전달되는 방향인지, 누군가를 위한 행위인지에 따라 to와 for의 선택이 달라집니다.',
        examples: 'Give it to me. · I bought it for you.',
      },
      {
        href: '/english/articles-a-an-the',
        label: '관사',
        title: 'a · an · the',
        subtitle: '한국어에 없는 관사를 문맥으로 이해하기',
        summary:
          '처음 소개하는 하나의 대상인지, 이미 특정된 대상인지, 무관사로 쓰이는 일반 개념인지 구별합니다.',
        examples: 'a book · an apple · the book',
      },
      {
        href: '/english/dont-do-not-doesnt',
        label: '부정문',
        title: "don't · do not · doesn't",
        subtitle: '축약형과 주어에 따른 부정 표현',
        summary:
          '축약형과 비축약형의 차이, 주어에 따른 do·does 선택, 자연스러운 일상 영어를 함께 설명합니다.',
        examples: "I don't know. · He doesn't know.",
      },
      {
        href: '/english/tense-translation',
        label: '시제',
        title: '현재 · 과거 · 미래',
        subtitle: '한국어 어미만 보고 영어 시제를 고르지 않기',
        summary:
          '시간 부사, 진행 여부, 상태 동사, 문맥상 시간 관계를 함께 보고 영어 시제를 결정합니다.',
        examples: 'I go. · I went. · I will go.',
      },
    ],
  },
  {
    id: 'polysemy',
    title: '3. 다의어와 품사 판별',
    description:
      '같은 철자의 영어 단어가 명사와 동사로 쓰이거나 서로 전혀 다른 뜻을 가질 때, 문장 안의 위치와 주변 단어를 먼저 봅니다.',
    guides: [
      {
        href: '/english/book-noun-verb',
        label: '다의어',
        title: 'book',
        subtitle: '‘책’과 ‘예약하다’를 구별하기',
        summary:
          'book이 명사인지 동사인지 먼저 판별한 뒤, room·flight·appointment 같은 목적어를 통해 예약 의미를 확인합니다.',
        examples: 'Pick up the book. · Book a room.',
      },
      {
        href: '/english/file-noun-verb',
        label: '다의어',
        title: 'file',
        subtitle: '‘파일·서류’와 ‘제출·제기하다’를 구별하기',
        summary:
          '컴퓨터 파일, 사건 기록, 법률 문서 제출, 민원 제기, 서류 보관 등 문맥에 따라 여러 의미를 나눕니다.',
        examples: 'Open the file. · File a complaint.',
      },
      {
        href: '/english/plant-noun-verb',
        label: '다의어',
        title: 'plant',
        subtitle: '‘식물·공장·설비’와 ‘심다’를 구별하기',
        summary:
          '품사와 주변 단어를 이용해 식물, 발전소·공장, 산업 설비, 심다의 의미를 구별합니다.',
        examples: 'The plant is large. · Plant a tree.',
      },
    ],
  },
];

const editorialPrinciples = [
  {
    title: '단어 하나보다 문장 구조를 먼저 봅니다',
    text:
      '영어 단어에는 여러 뜻이 있을 수 있으므로 주어·동사·목적어 중 어디에 놓였는지부터 확인합니다.',
  },
  {
    title: '짧은 문장은 억지로 하나의 뜻으로 고정하지 않습니다',
    text:
      'The plant is large.처럼 문맥이 부족한 문장은 식물과 공장처럼 둘 이상의 해석이 가능하다는 점을 그대로 설명합니다.',
  },
  {
    title: '한국어와 영어의 차이를 함께 설명합니다',
    text:
      '관사나 전치사처럼 한국어에 직접 대응하지 않는 요소는 단순 치환보다 문장에서 맡는 기능을 중심으로 다룹니다.',
  },
  {
    title: '실제 검색과 해설의 역할을 구분합니다',
    text:
      'X-DIC 검색은 사전·병렬문장·번역 결과를 확인하는 도구이고, 번역가 해설은 왜 그런 표현을 선택하는지 판단 기준을 설명합니다.',
  },
];

export default function EnglishGuideHubPage() {
  const totalGuides = guideGroups.reduce(
    (sum, group) => sum + group.guides.length,
    0
  );

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <nav
          aria-label="현재 위치"
          className="mb-6 text-xs md:text-sm text-slate-500"
        >
          <Link href="/" className="font-medium hover:text-blue-700">
            X-DIC 홈
          </Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">번역가 해설</span>
        </nav>

        <header className="border-b border-slate-200 pb-8 md:pb-10">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            영어를 단어 하나가 아니라
            <br className="hidden md:block" />
            문맥과 문장 구조로 이해하는 번역 가이드
          </h1>

          <p className="mt-5 max-w-4xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            같은 한국어 표현도 영어에서는 여러 단어로 나뉘고,
            같은 영어 단어도 문장에 따라 전혀 다른 뜻이 될 수 있습니다.
            X-DIC 번역가 해설은 단순한 뜻 목록보다
            <strong className="text-slate-900">
              {' '}
              품사, 목적어, 전치사, 시제, 주변 문맥
            </strong>
            을 살펴 실제 번역에서 어떤 기준으로 표현을 선택하는지
            설명합니다.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-blue-50 px-3 py-1.5 font-bold text-blue-700">
              총 {totalGuides}개 해설
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 font-bold text-slate-700">
              직접 작성한 번역 판단 기준
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 font-bold text-slate-700">
              실제 예문 중심
            </span>
          </div>
        </header>

        <section className="mt-10 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-extrabold">
            번역가 해설과 X-DIC 검색은 역할이 다릅니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl bg-white border border-blue-100 p-5">
              <p className="text-sm font-extrabold text-blue-600">
                번역가 해설
              </p>
              <p className="mt-2 font-bold">
                왜 이 표현을 선택하는지 설명합니다.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                문법 규칙 하나만 제시하기보다 실제 문장에서 어떤 단서가
                의미를 결정하는지, 어떤 경우에는 두 해석이 모두 가능한지
                설명합니다.
              </p>
            </article>

            <article className="rounded-2xl bg-white border border-blue-100 p-5">
              <p className="text-sm font-extrabold text-emerald-600">
                X-DIC 검색
              </p>
              <p className="mt-2 font-bold">
                실제 사전·병렬문장·번역 결과를 확인합니다.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                해설에서 기준을 확인한 뒤 같은 단어나 문장을 X-DIC에서
                직접 검색하여 다양한 실제 결과와 비교할 수 있습니다.
              </p>

              <Link
                href="/"
                className="inline-flex mt-4 text-sm font-extrabold text-blue-700 hover:text-blue-900"
              >
                X-DIC 검색으로 이동 →
              </Link>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl md:text-3xl font-extrabold">
            해설 주제 한눈에 보기
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            현재 해설은 기본 동사 선택, 문법과 문장 구조, 다의어와
            품사 판별의 세 영역으로 나누어 정리했습니다.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {guideGroups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-700"
              >
                {group.title}
              </a>
            ))}
          </div>
        </section>

        {guideGroups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            className="mt-14 scroll-mt-20"
          >
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-2xl md:text-3xl font-extrabold">
                {group.title}
              </h2>

              <p className="mt-3 max-w-4xl text-sm md:text-base leading-7 text-slate-600">
                {group.description}
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {group.guides.map((guide) => (
                <article
                  key={guide.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm"
                >
                  <p className="text-xs font-extrabold text-blue-600">
                    {guide.label}
                  </p>

                  <h3 className="mt-2 text-xl font-extrabold">
                    {guide.title}
                  </h3>

                  <p className="mt-1 font-bold text-slate-700">
                    {guide.subtitle}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {guide.summary}
                  </p>

                  <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    {guide.examples}
                  </div>

                  <Link
                    href={guide.href}
                    className="inline-flex mt-5 text-sm font-extrabold text-blue-700 hover:text-blue-900"
                  >
                    해설 읽기 →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-7">
          <h2 className="text-2xl font-extrabold">
            X-DIC 번역가 해설의 편집 원칙
          </h2>

          <p className="mt-3 max-w-4xl leading-7 text-slate-600">
            좋은 번역은 사전의 첫 번째 뜻을 그대로 옮기는 작업과 다릅니다.
            X-DIC 해설에서는 다음과 같은 판단 과정을 반복해서 적용합니다.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {editorialPrinciples.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <h3 className="font-extrabold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">
            예문 하나로 보는 문맥 판단
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-extrabold text-blue-600">
                BOOK
              </p>
              <p className="mt-2 font-extrabold">
                Pick up the book.
              </p>
              <p className="mt-1 text-slate-700">
                책을 집어 드세요.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                the book은 동사 pick up의 목적어이므로 여기서 book은
                명사입니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-extrabold text-blue-600">
                FILE
              </p>
              <p className="mt-2 font-extrabold">
                File a complaint.
              </p>
              <p className="mt-1 text-slate-700">
                민원이나 불만을 제기하세요.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                file이 complaint를 목적어로 취하는 동사이므로 컴퓨터
                파일이라는 뜻으로 번역하지 않습니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-extrabold text-blue-600">
                PLANT
              </p>
              <p className="mt-2 font-extrabold">
                The plant is large.
              </p>
              <p className="mt-1 text-slate-700">
                그 식물은 큽니다 / 그 공장은 큽니다.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                plant가 명사라는 것은 알 수 있지만 주변 문맥이 없으면
                식물인지 산업시설인지 하나로 확정할 수 없습니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-14 border-t border-slate-200 pt-8">
          <h2 className="text-xl font-extrabold">
            X-DIC에서 직접 확인하기
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            위 해설은 표현을 고르는 기준을 설명합니다. 실제 검색에서는
            사전 의미와 병렬문장, 번역 결과를 함께 비교하면서 문맥에 맞는
            표현을 확인할 수 있습니다.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              'go',
              'see',
              'say',
              'make',
              'in',
              'for',
              'book',
              'file',
              'plant',
            ].map((query) => (
              <Link
                key={query}
                href={`/?q=${encodeURIComponent(query)}`}
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700 hover:bg-blue-100"
              >
                {query} 검색 →
              </Link>
            ))}
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