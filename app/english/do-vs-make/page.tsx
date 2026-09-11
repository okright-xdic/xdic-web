import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'do와 make 차이 | 하다·만들다를 자연스럽게 영어로 번역하는 기준',
  description:
    '한국어의 하다와 만들다를 영어로 번역할 때 do와 make를 어떻게 구별하는지 설명합니다. 활동, 업무, 결과물, 변화와 자주 쓰이는 결합 표현을 중심으로 실제 번역 예문과 오역 사례를 정리합니다.',
  alternates: {
    canonical: '/english/do-vs-make',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const examples = [
  {
    ko: '나는 숙제를 해야 해요.',
    en: 'I have to do my homework.',
    note: '숙제는 수행해야 하는 과제나 활동이므로 do homework라는 결합이 자연스럽습니다.',
  },
  {
    ko: '나는 설거지를 했어요.',
    en: 'I did the dishes.',
    note: '집안일이나 반복적인 일을 수행하는 의미에서는 do가 자주 사용됩니다.',
  },
  {
    ko: '그는 실수했어요.',
    en: 'He made a mistake.',
    note: '영어에서는 실수를 하나의 발생한 결과로 표현하여 make a mistake라고 합니다.',
  },
  {
    ko: '우리는 결정을 내려야 해요.',
    en: 'We need to make a decision.',
    note: '결정을 만들어 낸 결과에 초점이 있으므로 make a decision이 자연스럽습니다.',
  },
  {
    ko: '그녀는 케이크를 만들었어요.',
    en: 'She made a cake.',
    note: '구체적인 결과물이 생기는 상황이므로 make를 사용합니다.',
  },
  {
    ko: '그는 돈을 많이 벌어요.',
    en: 'He makes a lot of money.',
    note: '한국어에는 만들다라는 표현이 없지만 영어에서는 make money라는 고정적인 결합을 사용합니다.',
  },
  {
    ko: '우리는 그 회사와 거래합니다.',
    en: 'We do business with the company.',
    note: '사업이나 거래 활동을 수행한다는 의미이므로 do business가 자연스럽습니다.',
  },
  {
    ko: '계획을 세워 봅시다.',
    en: "Let's make a plan.",
    note: '계획이라는 결과를 만들어 내는 의미에서는 make a plan을 사용합니다.',
  },
  {
    ko: '최선을 다하세요.',
    en: 'Do your best.',
    note: '한국어의 다하다와 영어의 do가 대응하는 관용적인 표현입니다.',
  },
  {
    ko: '그 소식이 나를 행복하게 했어요.',
    en: 'The news made me happy.',
    note: 'make + 목적어 + 형용사 구조는 어떤 대상의 상태를 변화시키는 의미를 나타냅니다.',
  },
];

const comparisonRows = [
  {
    expression: 'do',
    focus: '활동 · 업무 · 과제 · 수행',
    example: 'do homework',
    translation: '숙제를 하다',
  },
  {
    expression: 'make',
    focus: '결과물 · 생성 · 변화',
    example: 'make a cake',
    translation: '케이크를 만들다',
  },
  {
    expression: 'do',
    focus: '일·집안일·사업 같은 활동',
    example: 'do the dishes',
    translation: '설거지를 하다',
  },
  {
    expression: 'make',
    focus: '결정·계획·실수처럼 결과가 생기는 표현',
    example: 'make a decision',
    translation: '결정을 내리다',
  },
];

const doCollocations = [
  ['do homework', '숙제를 하다'],
  ['do the dishes', '설거지를 하다'],
  ['do housework', '집안일을 하다'],
  ['do business', '사업·거래를 하다'],
  ['do your best', '최선을 다하다'],
  ['do exercise', '운동을 하다'],
];

const makeCollocations = [
  ['make a decision', '결정을 내리다'],
  ['make a mistake', '실수하다'],
  ['make a plan', '계획을 세우다'],
  ['make money', '돈을 벌다'],
  ['make a promise', '약속하다'],
  ['make progress', '진전을 이루다'],
];

export default function DoVsMakePage() {
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
          <span className="text-slate-700">do · make</span>
        </nav>

        <header className="border-b border-slate-200 pb-7 md:pb-9">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            do와 make
            <br className="hidden md:block" />
            한국어의 ‘하다·만들다’를 어떻게 번역할까?
          </h1>

          <p className="mt-5 max-w-3xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            한국어의 ‘하다’가 영어에서 항상 <strong>do</strong>가 되는 것도
            아니고, ‘만들다’가 있는 경우에만 <strong>make</strong>를 쓰는 것도
            아닙니다. 영어에서는
            <strong className="text-slate-900">
              {' '}활동을 수행하는지, 어떤 결과를 만들어 내는지,
              특정 명사와 어떤 동사가 자연스럽게 결합하는지
            </strong>
            를 함께 봐야 합니다.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
            번역가 한줄 정리
          </h2>

          <p className="mt-3 leading-7 text-slate-700">
            <strong>do</strong>는 활동·과제·업무를 수행하는 의미에 자주
            사용되고, <strong>make</strong>는 무언가를 만들거나 결과를
            발생시키는 의미에 자주 사용됩니다. 그러나 실제 번역에서는
            <strong> do homework, make a decision</strong>처럼
            명사와의 자연스러운 결합을 반드시 함께 확인해야 합니다.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-extrabold">
            1. ‘하다’를 발견했다고 바로 do로 번역하지 않습니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-blue-600">
                DO
              </p>

              <p className="mt-2 text-lg font-bold">
                I have to do my homework.
              </p>

              <p className="mt-1 text-slate-700">
                나는 숙제를 해야 해요.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                숙제라는 과제를 수행하는 것이므로 do homework라고 합니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-emerald-600">
                MAKE
              </p>

              <p className="mt-2 text-lg font-bold">
                We need to make a decision.
              </p>

              <p className="mt-1 text-slate-700">
                우리는 결정을 내려야 해요.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                한국어에는 ‘만들다’가 없지만 영어에서는
                make a decision이라는 결합이 자연스럽습니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            2. do와 make 핵심 비교
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
                    대표 결합
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    한국어
                  </th>
                </tr>
              </thead>

              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr
                    key={`${row.expression}-${index}`}
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

          <div className="mt-5 space-y-5">
            <div>
              <p className="font-bold text-slate-900">
                I made a mistake. ✓
              </p>
              <p className="mt-1 text-slate-500">
                I did a mistake. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                ‘실수하다’에는 일반적으로 make a mistake를 사용합니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                I did my homework. ✓
              </p>
              <p className="mt-1 text-slate-500">
                I made my homework. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                숙제를 수행한다는 의미이므로 do homework가 자연스럽습니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                We made a decision. ✓
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                한국어의 ‘결정을 내리다’를 단어별로 대응시키기보다
                영어의 자연스러운 결합인 make a decision으로 번역합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            5. do와 자주 함께 쓰이는 표현
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {doCollocations.map(([en, ko]) => (
              <div
                key={en}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <p className="font-bold text-blue-700">
                  {en}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {ko}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            6. make와 자주 함께 쓰이는 표현
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {makeCollocations.map(([en, ko]) => (
              <div
                key={en}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <p className="font-bold text-emerald-700">
                  {en}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {ko}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            7. make는 ‘어떤 상태가 되게 하다’라는 뜻도 있습니다
          </h2>

          <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-5 md:p-6">
            <p className="font-bold text-slate-900">
              The news made me happy.
            </p>
            <p className="mt-1 text-slate-700">
              그 소식이 나를 행복하게 했어요.
            </p>

            <p className="mt-5 font-bold text-slate-900">
              The movie made him sad.
            </p>
            <p className="mt-1 text-slate-700">
              그 영화는 그를 슬프게 했어요.
            </p>

            <p className="mt-4 text-sm md:text-[15px] leading-6 text-slate-600">
              이때 make는 물건을 ‘만들다’라는 뜻이 아니라
              <strong> make + 목적어 + 형용사</strong> 구조로
              어떤 사람이나 대상의 상태를 변화시키는 의미입니다.
              한국어 표면형만 보면 놓치기 쉬운 용법입니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            8. X-DIC에서 판단하는 순서
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            한국어의 ‘하다’나 ‘만들다’를 번역할 때 먼저
            <strong> 어떤 활동을 수행하는지</strong>,
            <strong> 결과나 변화가 생기는지</strong>를 확인합니다.
            그다음 목적어와 동사가 실제 영어에서 자연스럽게 결합하는지
            살펴봅니다. 따라서 do와 make의 선택은 단순한 사전 뜻보다
            <strong> 문맥과 결합 관계</strong>가 더 중요한 경우가 많습니다.
          </p>
        </section>

        <aside className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <h2 className="text-lg font-extrabold">
            직접 비교해 볼 검색어
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              '숙제를 하다',
              '실수하다',
              '결정을 내리다',
              '계획을 세우다',
              '돈을 벌다',
              'Do your best.',
              'Make a decision.',
              'Make a mistake.',
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
            X-DIC 검색 결과는 사전·병렬문장·번역 결과를 확인하는 도구
            영역입니다. 이 페이지는 do와 make 가운데 어떤 동사를 선택할지
            번역과 실제 결합 표현의 관점에서 설명하는 편집 콘텐츠입니다.
          </p>
        </aside>

        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-lg font-extrabold">
            관련 번역가 해설
          </h2>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/english/go-vs-come"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              go와 come — ‘가다·오다’ 번역 기준 →
            </Link>

            <Link
              href="/english/see-look-watch"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              see · look at · watch — ‘보다’ 번역 기준 →
            </Link>

            <Link
              href="/english/say-tell-speak-talk"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              say · tell · speak · talk — ‘말하다’ 번역 기준 →
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