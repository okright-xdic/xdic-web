import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'in, on, at 차이 | 장소와 시간 전치사를 자연스럽게 번역하는 기준',
  description:
    '한국어의 에, 에서 같은 표현을 영어로 번역할 때 in, on, at을 어떻게 구별하는지 설명합니다. 공간의 내부, 표면, 지점과 시간 범위를 중심으로 실제 예문과 자주 생기는 오류를 정리합니다.',
  alternates: {
    canonical: '/english/in-on-at',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const placeExamples = [
  {
    ko: '그는 방 안에 있어요.',
    en: 'He is in the room.',
    note: '방이라는 공간의 내부에 있다는 뜻이므로 in이 자연스럽습니다.',
  },
  {
    ko: '책이 탁자 위에 있어요.',
    en: 'The book is on the table.',
    note: '탁자의 표면에 책이 놓여 있으므로 on을 사용합니다.',
  },
  {
    ko: '역에서 만나요.',
    en: 'Meet me at the station.',
    note: '역을 하나의 만남 지점이나 장소로 볼 때 at이 자연스럽습니다.',
  },
  {
    ko: '나는 서울에 살아요.',
    en: 'I live in Seoul.',
    note: '도시처럼 일정한 범위를 가진 장소 안에서 생활한다는 의미에는 in을 사용합니다.',
  },
  {
    ko: '사진이 벽에 걸려 있어요.',
    en: 'The picture is on the wall.',
    note: '벽의 표면에 붙거나 걸려 있는 관계이므로 on이 자연스럽습니다.',
  },
  {
    ko: '그녀는 지금 학교에 있어요.',
    en: 'She is at school now.',
    note: '학교를 현재 있는 장소나 활동의 지점으로 표현할 때 at school이 자연스럽습니다.',
  },
  {
    ko: '그는 학교 건물 안에 있어요.',
    en: 'He is in the school building.',
    note: '건물 내부라는 물리적인 공간을 강조하면 in을 사용하는 것이 분명합니다.',
  },
  {
    ko: '나는 집에 있어요.',
    en: 'I am at home.',
    note: 'home은 현재 위치를 나타낼 때 at home이라는 결합이 매우 자연스럽습니다.',
  },
];

const timeExamples = [
  {
    ko: '회의는 3시에 시작합니다.',
    en: 'The meeting starts at 3 p.m.',
    note: '정확한 시각처럼 하나의 시간 지점을 나타낼 때 at을 사용합니다.',
  },
  {
    ko: '월요일에 다시 연락드리겠습니다.',
    en: "I'll contact you again on Monday.",
    note: '요일이나 특정 날짜 앞에는 일반적으로 on을 사용합니다.',
  },
  {
    ko: '우리는 9월에 출발합니다.',
    en: 'We leave in September.',
    note: '월, 연도, 계절처럼 비교적 넓은 시간 범위에는 in을 사용합니다.',
  },
  {
    ko: '그는 2025년에 그곳에서 일했어요.',
    en: 'He worked there in 2025.',
    note: '연도는 시간의 넓은 범위로 보므로 in을 사용합니다.',
  },
  {
    ko: '금요일 아침에 만나요.',
    en: 'See you on Friday morning.',
    note: '특정 요일과 결합한 morning은 그 날짜를 특정하므로 on이 자연스럽습니다.',
  },
  {
    ko: '밤에 운전할 때 조심하세요.',
    en: 'Be careful when driving at night.',
    note: 'night은 일반적인 시간 표현에서 at night이라는 관용적인 결합을 자주 사용합니다.',
  },
];

const comparisonRows = [
  {
    expression: 'in',
    place: '공간·지역의 내부 또는 범위',
    time: '월·연도·계절 등 넓은 시간 범위',
    example: 'in the room / in July',
  },
  {
    expression: 'on',
    place: '표면에 닿아 있거나 붙어 있는 관계',
    time: '요일·날짜',
    example: 'on the table / on Monday',
  },
  {
    expression: 'at',
    place: '특정 지점·장소·활동의 위치',
    time: '정확한 시각·특정 시간 지점',
    example: 'at the station / at 7 p.m.',
  },
];

export default function InOnAtPage() {
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
          <span className="text-slate-700">in · on · at</span>
        </nav>

        <header className="border-b border-slate-200 pb-7 md:pb-9">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            in, on, at
            <br className="hidden md:block" />
            장소와 시간 전치사를 어떻게 번역할까?
          </h1>

          <p className="mt-5 max-w-3xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            한국어의 ‘에’, ‘에서’, ‘안에’, ‘위에’가 영어의 특정 전치사 하나와
            항상 일대일로 대응하는 것은 아닙니다. 영어에서는
            <strong className="text-slate-900">
              {' '}공간의 내부인지, 표면인지, 하나의 지점인지
            </strong>
            를 구별하고, 시간에서도
            <strong className="text-slate-900">
              {' '}넓은 범위인지, 특정 날짜인지, 정확한 시각인지
            </strong>
            를 살펴 in, on, at을 선택합니다.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
            번역가 한줄 정리
          </h2>

          <p className="mt-3 leading-7 text-slate-700">
            장소에서 <strong>in</strong>은 내부나 범위,
            <strong> on</strong>은 표면,
            <strong> at</strong>은 하나의 지점이나 장소에 초점을 두는 경우가
            많습니다. 시간에서는 대체로
            <strong> in → 넓은 범위</strong>,
            <strong> on → 날짜·요일</strong>,
            <strong> at → 정확한 시각</strong>으로 생각하면 출발점이 됩니다.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-extrabold">
            1. 장소에서는 공간을 어떻게 바라보는지가 중요합니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-blue-600">
                IN
              </p>
              <p className="mt-2 text-lg font-bold">
                He is in the room.
              </p>
              <p className="mt-1 text-slate-700">
                그는 방 안에 있어요.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                방이라는 경계가 있는 공간의 내부에 있습니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-emerald-600">
                ON
              </p>
              <p className="mt-2 text-lg font-bold">
                The book is on the table.
              </p>
              <p className="mt-1 text-slate-700">
                책이 탁자 위에 있어요.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                책이 탁자의 표면과 접해 있는 관계를 나타냅니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-orange-600">
                AT
              </p>
              <p className="mt-2 text-lg font-bold">
                Meet me at the station.
              </p>
              <p className="mt-1 text-slate-700">
                역에서 만나요.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                역을 내부 공간보다 하나의 만남 지점으로 바라봅니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            2. in · on · at 핵심 비교
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[820px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    전치사
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    장소
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    시간
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    대표 예
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
                      {row.place}
                    </td>
                    <td className="px-4 py-4 text-sm leading-6 text-slate-600">
                      {row.time}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold">
                      {row.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            3. 장소 표현을 실제 번역에서 비교해 보기
          </h2>

          <div className="mt-5 space-y-4">
            {placeExamples.map((item, index) => (
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

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            4. 시간에서는 범위의 크기를 먼저 봅니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold text-blue-700">
                in September
              </p>
              <p className="mt-1 text-slate-700">
                9월에
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                월·연도·계절처럼 비교적 넓은 시간 범위에는 in이 자주
                사용됩니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold text-emerald-700">
                on Monday
              </p>
              <p className="mt-1 text-slate-700">
                월요일에
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                특정 요일이나 날짜에는 on을 사용합니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold text-orange-700">
                at 3 p.m.
              </p>
              <p className="mt-1 text-slate-700">
                오후 3시에
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                정확한 시각처럼 하나의 시간 지점에는 at을 사용합니다.
              </p>
            </article>
          </div>

          <div className="mt-5 space-y-4">
            {timeExamples.map((item, index) => (
              <article
                key={`${item.en}-${index}`}
                className="rounded-2xl border border-slate-200 p-5 md:p-6 bg-white"
              >
                <p className="font-bold text-slate-900">
                  {item.ko}
                </p>
                <p className="mt-1 font-extrabold text-blue-700">
                  {item.en}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.note}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-orange-200 bg-orange-50/50 p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-extrabold">
            5. 자주 생기는 번역 오류
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <p className="font-bold text-slate-900">
                I live in Seoul. ✓
              </p>
              <p className="mt-1 text-slate-500">
                I live at Seoul. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                도시나 국가처럼 넓은 지역 안에서 거주한다는 의미에는
                일반적으로 in을 사용합니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                The meeting is on Monday. ✓
              </p>
              <p className="mt-1 text-slate-500">
                The meeting is in Monday. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                요일은 특정 날짜 단위이므로 on을 사용합니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                The meeting starts at 3 p.m. ✓
              </p>
              <p className="mt-1 text-slate-500">
                The meeting starts in 3 p.m. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                정확한 시각에는 at을 사용합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            6. 같은 장소도 관점에 따라 전치사가 달라질 수 있습니다
          </h2>

          <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-5 md:p-6">
            <p className="font-bold text-slate-900">
              She is at the station.
            </p>
            <p className="mt-1 text-slate-700">
              그녀는 역에 있어요.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              역을 하나의 위치나 지점으로 표현합니다.
            </p>

            <p className="mt-6 font-bold text-slate-900">
              She is in the station building.
            </p>
            <p className="mt-1 text-slate-700">
              그녀는 역 건물 안에 있어요.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              건물 내부라는 물리적인 공간을 강조합니다.
            </p>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              따라서 ‘역에’라는 한국어 표현만으로 전치사를 고정하기보다,
              문장에서 장소를 <strong>지점</strong>으로 보는지
              <strong> 내부 공간</strong>으로 보는지 확인하는 것이 중요합니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            7. 자주 기억해 두면 좋은 고정 표현
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ['at home', '집에, 집에서'],
              ['at work', '직장에, 근무 중'],
              ['at school', '학교에'],
              ['at night', '밤에'],
              ['in the morning', '아침에'],
              ['in the afternoon', '오후에'],
              ['on Monday', '월요일에'],
              ['on the wall', '벽에'],
            ].map(([en, ko]) => (
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
            8. X-DIC에서 판단하는 순서
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            장소 전치사를 번역할 때는 먼저 대상이
            <strong> 공간의 내부</strong>에 있는지,
            <strong> 표면과 관계</strong>가 있는지,
            <strong> 하나의 위치나 지점</strong>으로 표현되는지를 확인합니다.
            시간에서는 월·연도 같은 넓은 범위인지, 요일·날짜인지,
            정확한 시각인지를 구별합니다. 그다음
            <strong> at home, at night</strong>처럼 실제 영어에서 굳어진
            결합 표현까지 확인하여 in, on, at을 결정합니다.
          </p>
        </section>

        <aside className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <h2 className="text-lg font-extrabold">
            직접 비교해 볼 검색어
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              '방 안에 있어요',
              '탁자 위에 있어요',
              '역에서 만나요',
              '서울에 살아요',
              '월요일에 만나요',
              '오후 3시에 시작해요',
              'at home',
              'in September',
              'on Monday',
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
            영역입니다. 이 페이지는 장소와 시간의 관점에 따라 in, on, at을
            선택하는 기준을 설명하는 편집 콘텐츠입니다.
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