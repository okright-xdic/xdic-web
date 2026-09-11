import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'to와 for 차이 | 방향·수신자·수혜·목적을 자연스럽게 번역하는 기준',
  description:
    '한국어의 에게, 을 위해, 로 같은 표현을 영어로 번역할 때 to와 for를 어떻게 구별하는지 설명합니다. 방향, 도착점, 수신자, 수혜자, 목적과 기간을 중심으로 실제 예문과 자주 생기는 오류를 정리합니다.',
  alternates: {
    canonical: '/english/to-vs-for',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const examples = [
  {
    ko: '이 편지를 민수에게 보내 주세요.',
    en: 'Please send this letter to Minsu.',
    note: '편지가 도달하는 수신자를 나타내므로 to가 자연스럽습니다.',
  },
  {
    ko: '이 선물은 민수를 위해 샀어요.',
    en: 'I bought this gift for Minsu.',
    note: '민수가 선물의 수혜자이므로 for를 사용합니다.',
  },
  {
    ko: '그녀에게 책을 주세요.',
    en: 'Give the book to her.',
    note: '책이 전달되는 도착점 또는 수신자를 나타내므로 to를 사용합니다.',
  },
  {
    ko: '그녀를 위해 저녁을 만들었어요.',
    en: 'I made dinner for her.',
    note: '저녁을 만드는 행동의 혜택을 받는 사람이므로 for가 자연스럽습니다.',
  },
  {
    ko: '그 문제를 나에게 설명해 주세요.',
    en: 'Please explain the problem to me.',
    note: 'explain은 내용을 전달받는 사람 앞에 일반적으로 to를 사용합니다.',
  },
  {
    ko: '나는 서울에 갔어요.',
    en: 'I went to Seoul.',
    note: '이동의 목적지나 도착점을 나타낼 때 to를 사용합니다.',
  },
  {
    ko: '우리는 서울로 출발했어요.',
    en: 'We left for Seoul.',
    note: 'leave와 함께 목적지를 나타낼 때는 leave for + 장소라는 결합이 자연스럽습니다.',
  },
  {
    ko: '나는 두 시간 동안 공부했어요.',
    en: 'I studied for two hours.',
    note: '행동이 지속된 기간을 나타낼 때 for를 사용합니다.',
  },
  {
    ko: '나는 우유를 사려고 가게에 갔어요.',
    en: 'I went to the store to buy milk.',
    note: '첫 번째 to는 이동 목적지 앞의 전치사이고, 두 번째 to는 목적을 나타내는 to부정사의 일부입니다.',
  },
  {
    ko: '이 가위는 종이를 자르는 데 사용합니다.',
    en: 'These scissors are for cutting paper.',
    note: '물건의 용도나 목적을 설명할 때 for + 동명사 형태를 사용할 수 있습니다.',
  },
];

const comparisonRows = [
  {
    expression: 'to',
    focus: '방향 · 도착점 · 수신자',
    example: 'send it to me',
    translation: '그것을 나에게 보내다',
  },
  {
    expression: 'for',
    focus: '수혜자 · 용도 · 목적',
    example: 'buy it for me',
    translation: '그것을 나를 위해 사다',
  },
  {
    expression: 'to',
    focus: '이동 목적지',
    example: 'go to school',
    translation: '학교에 가다',
  },
  {
    expression: 'for',
    focus: '행동의 지속 기간',
    example: 'for two hours',
    translation: '두 시간 동안',
  },
];

const toPatterns = [
  ['give something to someone', '무언가를 누군가에게 주다'],
  ['send something to someone', '무언가를 누군가에게 보내다'],
  ['explain something to someone', '무언가를 누군가에게 설명하다'],
  ['say something to someone', '무언가를 누군가에게 말하다'],
  ['go to a place', '어떤 장소로 가다'],
  ['listen to something', '무언가를 듣다'],
];

const forPatterns = [
  ['buy something for someone', '누군가를 위해 무언가를 사다'],
  ['make something for someone', '누군가를 위해 무언가를 만들다'],
  ['wait for someone', '누군가를 기다리다'],
  ['look for something', '무언가를 찾다'],
  ['for two hours', '두 시간 동안'],
  ['for cutting paper', '종이를 자르는 용도로'],
];

export default function ToVsForPage() {
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
          <span className="text-slate-700">to · for</span>
        </nav>

        <header className="border-b border-slate-200 pb-7 md:pb-9">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            to와 for
            <br className="hidden md:block" />
            ‘에게·을 위해·로’를 어떻게 번역할까?
          </h1>

          <p className="mt-5 max-w-3xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            한국어에서는 ‘민수에게’, ‘민수를 위해’, ‘서울로’처럼 조사와
            문맥으로 관계를 나타내지만 영어에서는
            <strong className="text-slate-900">
              {' '}어디로 향하는지, 누가 받는지, 누구를 위한 행동인지,
              무엇을 위한 용도인지
            </strong>
            에 따라 to와 for의 선택이 달라집니다.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
            번역가 한줄 정리
          </h2>

          <p className="mt-3 leading-7 text-slate-700">
            <strong>to</strong>는 대체로 어떤 대상이나 장소를 향하는
            <strong> 방향·도착점·수신자</strong>를 나타내고,
            <strong> for</strong>는 행동의 혜택을 받는
            <strong> 수혜자·용도·목적·기간</strong>을 나타내는 경우가
            많습니다. 하지만 실제 번역에서는 동사와 함께 굳어진 결합도
            반드시 확인해야 합니다.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-extrabold">
            1. ‘누구에게’와 ‘누구를 위해’를 먼저 구별합니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-blue-600">
                TO · 수신자
              </p>

              <p className="mt-2 text-lg font-bold">
                I sent the file to her.
              </p>

              <p className="mt-1 text-slate-700">
                나는 그녀에게 파일을 보냈어요.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                파일이 실제로 전달되는 상대방이므로 her는 전달의
                도착점 또는 수신자입니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-emerald-600">
                FOR · 수혜자
              </p>

              <p className="mt-2 text-lg font-bold">
                I bought the book for her.
              </p>

              <p className="mt-1 text-slate-700">
                나는 그녀를 위해 책을 샀어요.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                그녀가 구매 행동의 혜택을 받는 사람이므로 for가
                자연스럽습니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            2. to와 for 핵심 비교
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    표현
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    번역 판단
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    대표 표현
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
                    <p className="text-[15px] md:text-[17px] font-bold">
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
                Please explain it to me. ✓
              </p>
              <p className="mt-1 text-slate-500">
                Please explain me it. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                explain은 일반적으로 설명의 내용을 목적어로 두고,
                설명을 듣는 사람 앞에는 to를 사용합니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                I bought this for her. ✓
              </p>
              <p className="mt-1 text-slate-500">
                I bought this to her. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                물건을 사는 행동의 수혜자를 표시할 때는 for가 자연스럽습니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                I sent this to her. ✓
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                반대로 send에서는 전달물이 도달하는 수신자를 to로 표시할 수
                있습니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            5. 같은 ‘에게’라도 동사에 따라 구조가 달라집니다
          </h2>

          <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-5 md:p-6">
            <p className="font-bold text-slate-900">
              Give the book to her.
            </p>
            <p className="mt-1 text-slate-700">
              그 책을 그녀에게 주세요.
            </p>

            <p className="mt-6 font-bold text-slate-900">
              Tell her the truth.
            </p>
            <p className="mt-1 text-slate-700">
              그녀에게 진실을 말해 주세요.
            </p>

            <p className="mt-5 text-sm md:text-[15px] leading-6 text-slate-600">
              두 한국어 문장 모두 ‘그녀에게’가 있지만 영어 문장 구조는
              같지 않습니다. give는
              <strong> give something to someone</strong> 형태를 사용할 수
              있지만, tell은
              <strong> tell someone something</strong>처럼 사람을 바로
              목적어로 둘 수 있습니다. 따라서 한국어 조사 하나만으로
              영어 전치사를 결정해서는 안 됩니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            6. 목적을 나타내는 to와 for도 구조가 다릅니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold text-blue-700">
                to + 동사원형
              </p>
              <p className="mt-2 font-bold text-slate-900">
                I went outside to get some air.
              </p>
              <p className="mt-1 text-slate-700">
                나는 바람을 쐬려고 밖에 나갔어요.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                어떤 행동을 하는 목적을 나타낼 때 to부정사를 사용할 수
                있습니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold text-emerald-700">
                for + 명사 / 동명사
              </p>
              <p className="mt-2 font-bold text-slate-900">
                This knife is for cutting bread.
              </p>
              <p className="mt-1 text-slate-700">
                이 칼은 빵을 자르는 용도입니다.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                물건이나 행동의 용도·목적을 설명할 때 for + 명사 또는
                동명사 구조를 사용할 수 있습니다.
              </p>
            </article>
          </div>

          <p className="mt-4 text-sm md:text-[15px] leading-6 text-slate-600">
            여기서 <strong>to + 동사원형</strong>의 to는 전치사 to와
            문법적 역할이 다릅니다. 따라서 단순히 to와 for를 한 종류의
            전치사 선택 문제로만 보면 안 됩니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            7. to와 자주 함께 쓰이는 구조
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {toPatterns.map(([en, ko]) => (
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
            8. for와 자주 함께 쓰이는 구조
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {forPatterns.map(([en, ko]) => (
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
            9. X-DIC에서 판단하는 순서
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            to와 for를 선택할 때 먼저 문장에서
            <strong> 이동이나 전달의 도착점</strong>을 나타내는지,
            <strong> 행동의 혜택을 받는 사람</strong>을 나타내는지,
            <strong> 용도나 목적</strong>을 설명하는지,
            <strong> 지속 기간</strong>을 나타내는지 구별합니다.
            그다음 send to, buy for, explain to, wait for처럼
            실제 영어 동사와 전치사가 어떤 방식으로 결합하는지 확인합니다.
          </p>
        </section>

        <aside className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <h2 className="text-lg font-extrabold">
            직접 비교해 볼 검색어
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              '민수에게 보내 주세요',
              '민수를 위해 샀어요',
              '그녀에게 설명해 주세요',
              '서울에 가요',
              '서울로 출발해요',
              '두 시간 동안 공부했어요',
              'send it to me',
              'buy it for me',
              'explain it to me',
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
            영역입니다. 이 페이지는 방향, 수신자, 수혜자, 용도와 문장 구조를
            바탕으로 to와 for를 선택하는 기준을 설명하는 편집 콘텐츠입니다.
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

            <Link
              href="/english/do-vs-make"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              do와 make — ‘하다·만들다’ 번역 기준 →
            </Link>

            <Link
              href="/english/in-on-at"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              in · on · at — 장소·시간 전치사 번역 기준 →
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