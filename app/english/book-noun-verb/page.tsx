import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title:
    'book 뜻과 번역 | 책인가 예약하다인가? 명사·동사를 문맥으로 구별하는 기준',
  description:
    "영어 book은 명사로는 '책', 동사로는 '예약하다'라는 전혀 다른 뜻을 가질 수 있습니다. book a room, book a flight, read a book 같은 실제 예문을 통해 품사와 문장 구조로 의미를 구별하는 방법을 설명합니다.",
  alternates: {
    canonical: '/english/book-noun-verb',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const coreExamples = [
  {
    label: '명사',
    en: 'Pick up the book.',
    ko: '그 책을 집어 드세요.',
    note: 'the 뒤에 오는 book은 명사입니다. 여기서는 물건인 “책”을 뜻합니다.',
  },
  {
    label: '동사',
    en: 'Book a room.',
    ko: '방을 예약하세요.',
    note: '문장 맨 앞에서 목적어 a room을 취하는 book은 동사이며 “예약하다”라는 뜻입니다.',
  },
  {
    label: '명사',
    en: 'I bought a book yesterday.',
    ko: '나는 어제 책 한 권을 샀어요.',
    note: 'a가 book 앞에 있으므로 셀 수 있는 단수 명사로 쓰였습니다.',
  },
  {
    label: '동사',
    en: 'I booked a hotel room.',
    ko: '나는 호텔 방을 예약했어요.',
    note: 'booked는 동사 book의 과거형입니다. 문맥상 숙박 예약을 뜻합니다.',
  },
  {
    label: '동사',
    en: 'We booked a flight to Seoul.',
    ko: '우리는 서울행 항공편을 예약했어요.',
    note: 'flight를 목적어로 취하므로 “항공편을 예약하다”라는 의미입니다.',
  },
  {
    label: '동사',
    en: 'She booked an appointment with the doctor.',
    ko: '그녀는 의사 진료 예약을 잡았어요.',
    note: 'appointment와 함께 쓰인 book은 “예약을 잡다”에 가깝습니다.',
  },
  {
    label: '명사',
    en: 'This book is easy to read.',
    ko: '이 책은 읽기 쉬워요.',
    note: 'this가 book을 한정하고 있으므로 명사입니다.',
  },
  {
    label: '동사',
    en: 'Can I book a table for two?',
    ko: '두 명 자리로 예약할 수 있을까요?',
    note: '식당 좌석이나 테이블을 미리 확보하는 뜻의 동사입니다.',
  },
];

const nounPatterns = [
  {
    pattern: 'a book',
    meaning: '책 한 권',
    example: 'I bought a book.',
  },
  {
    pattern: 'the book',
    meaning: '그 책 / 특정한 책',
    example: 'Open the book.',
  },
  {
    pattern: 'this book',
    meaning: '이 책',
    example: 'This book is useful.',
  },
  {
    pattern: 'books',
    meaning: '책들 / 책 일반',
    example: 'I like books.',
  },
  {
    pattern: 'read a book',
    meaning: '책을 읽다',
    example: 'She is reading a book.',
  },
];

const verbPatterns = [
  {
    pattern: 'book a room',
    meaning: '방을 예약하다',
    example: 'I booked a room for two nights.',
  },
  {
    pattern: 'book a flight',
    meaning: '항공편을 예약하다',
    example: 'We booked a flight to Busan.',
  },
  {
    pattern: 'book a table',
    meaning: '식당 자리를 예약하다',
    example: 'Can we book a table for four?',
  },
  {
    pattern: 'book an appointment',
    meaning: '예약을 잡다',
    example: 'I booked an appointment for Friday.',
  },
  {
    pattern: 'book a ticket',
    meaning: '표를 예약하다',
    example: 'She booked a train ticket online.',
  },
];

const formSignals = [
  {
    signal: 'a / the / this + book',
    judgment: '명사일 가능성이 매우 높음',
    example: 'the book',
  },
  {
    signal: 'book + 목적어',
    judgment: '동사일 가능성이 높음',
    example: 'book a room',
  },
  {
    signal: 'books',
    judgment: '문맥에 따라 복수명사 또는 3인칭 단수 동사',
    example: 'books on the shelf / She books flights',
  },
  {
    signal: 'booked',
    judgment: '대개 동사의 과거형·과거분사',
    example: 'I booked a room',
  },
  {
    signal: 'booking',
    judgment: '동명사·현재분사 또는 예약 관련 명사',
    example: 'booking a flight / a booking',
  },
];

const ambiguityExamples = [
  {
    en: 'She books flights for the company.',
    ko: '그녀는 회사를 위해 항공편을 예약합니다.',
    point:
      'books에 -s가 있다고 반드시 “책들”은 아닙니다. 주어 she 뒤에서는 동사 book의 3인칭 단수형이 될 수 있습니다.',
  },
  {
    en: 'The books are on the desk.',
    ko: '책들이 책상 위에 있어요.',
    point:
      'books 뒤에 are가 이어지고 문장의 주어 역할을 하므로 여기서는 복수 명사입니다.',
  },
  {
    en: 'The hotel is fully booked.',
    ko: '그 호텔은 예약이 꽉 찼어요.',
    point:
      'booked가 단순히 “예약했다”라는 능동 과거가 아니라, 예약이 모두 찬 상태를 나타냅니다.',
  },
  {
    en: 'I am booking a flight now.',
    ko: '나는 지금 항공편을 예약하고 있어요.',
    point:
      'am + booking 구조이므로 현재진행형 동사입니다.',
  },
];

export default function BookNounVerbPage() {
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
          <span className="text-slate-700">book · 책 / 예약하다</span>
        </nav>

        <header className="border-b border-slate-200 pb-7 md:pb-9">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            book은 ‘책’일까, ‘예약하다’일까?
            <br className="hidden md:block" />
            품사와 문맥으로 뜻을 구별하는 기준
          </h1>

          <p className="mt-5 max-w-3xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            영어의 <strong className="text-slate-900">book</strong>은
            같은 철자를 사용하지만 문장 안에서 맡는 역할에 따라
            <strong className="text-slate-900">
              {' '}
              명사 ‘책’ 또는 동사 ‘예약하다’
            </strong>
            로 해석될 수 있습니다. 사전의 첫 번째 뜻만 고르면
            <em> Book a room.</em>을 ‘책 방’처럼 잘못 분석할 수 있으므로
            주변 단어와 문장 구조를 함께 봐야 합니다.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-extrabold">
            번역가 한줄 정리
          </h2>

          <p className="mt-3 leading-7 text-slate-700">
            <strong>a / the / this + book</strong>처럼 한정사가 앞에 오면
            명사 ‘책’을 먼저 의심하고,
            <strong> book + room / flight / table / appointment</strong>
            처럼 목적어가 뒤따르면 동사 ‘예약하다’를 먼저 확인합니다.
            핵심은 단어 자체보다 <strong>문장에서 맡는 역할</strong>입니다.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-extrabold">
            1. Pick up the book과 Book a room은 완전히 다릅니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-sm font-extrabold text-blue-600">
                명사 book
              </p>

              <p className="mt-2 text-lg font-bold">
                Pick up the book.
              </p>

              <p className="mt-1 text-slate-700">
                그 책을 집어 드세요.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                the가 book 앞에 있고 book이 pick up의 목적어이므로
                여기서는 물건인 ‘책’을 뜻합니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-sm font-extrabold text-emerald-600">
                동사 book
              </p>

              <p className="mt-2 text-lg font-bold">
                Book a room.
              </p>

              <p className="mt-1 text-slate-700">
                방을 예약하세요.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                book이 명령문의 동사 자리에 있고 a room이 목적어이므로
                ‘예약하다’라고 해석합니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            2. 실제 문장에서 book의 뜻을 비교해 보기
          </h2>

          <div className="mt-5 space-y-4">
            {coreExamples.map((item, index) => (
              <article
                key={`${item.en}-${index}`}
                className="rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-none w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-blue-600">
                      {item.label}
                    </p>

                    <p className="mt-2 text-[15px] md:text-[17px] font-bold">
                      {item.en}
                    </p>

                    <p className="mt-1 text-[15px] md:text-[17px] font-extrabold text-blue-700">
                      {item.ko}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {item.note}
                    </p>

                    <Link
                      href={`/?q=${encodeURIComponent(item.en)}`}
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
            3. 명사 book에서 자주 보이는 구조
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[820px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    구조
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    의미
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    예문
                  </th>
                </tr>
              </thead>

              <tbody>
                {nounPatterns.map((row) => (
                  <tr
                    key={row.pattern}
                    className="border-t border-slate-100"
                  >
                    <td className="px-4 py-4 font-extrabold text-blue-700">
                      {row.pattern}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {row.meaning}
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
            4. 동사 book에서 자주 보이는 목적어
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[820px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    결합
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    한국어
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    예문
                  </th>
                </tr>
              </thead>

              <tbody>
                {verbPatterns.map((row) => (
                  <tr
                    key={row.pattern}
                    className="border-t border-slate-100"
                  >
                    <td className="px-4 py-4 font-extrabold text-emerald-700">
                      {row.pattern}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {row.meaning}
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

        <section className="mt-12 rounded-2xl border border-orange-200 bg-orange-50/50 p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-extrabold">
            5. books라고 해서 항상 ‘책들’은 아닙니다
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <p className="font-bold text-slate-900">
                The books are on the desk.
              </p>
              <p className="mt-1 text-slate-700">
                책들이 책상 위에 있어요.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                books가 문장의 주어이고 are와 연결되므로
                book의 복수 명사입니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                She books flights for the company.
              </p>
              <p className="mt-1 text-slate-700">
                그녀는 회사를 위해 항공편을 예약합니다.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                she 뒤에서 flights를 목적어로 취하므로 books는
                동사 book의 3인칭 단수형입니다.
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-600">
            철자만 보면 두 경우 모두 <strong>books</strong>이지만
            문장 안의 위치와 뒤따르는 성분을 확인하면 품사를 구별할 수
            있습니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            6. 형태 변화도 품사 판단의 단서가 됩니다
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    형태
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    우선 판단
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    예
                  </th>
                </tr>
              </thead>

              <tbody>
                {formSignals.map((row) => (
                  <tr
                    key={row.signal}
                    className="border-t border-slate-100 align-top"
                  >
                    <td className="px-4 py-4 font-extrabold text-blue-700">
                      {row.signal}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {row.judgment}
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
            7. booked와 booking도 문장 구조를 봐야 합니다
          </h2>

          <div className="mt-5 space-y-4">
            {ambiguityExamples.map((item) => (
              <article
                key={item.en}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <p className="font-extrabold text-blue-700">
                  {item.en}
                </p>

                <p className="mt-1 text-slate-700">
                  {item.ko}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.point}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            8. book과 reserve는 겹치지만 항상 똑같지는 않습니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm font-extrabold text-blue-600">
                book
              </p>
              <p className="mt-2 font-bold">
                I booked a hotel room.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                여행·숙박·항공편·식당·약속처럼 서비스나 자리를
                예약하는 일상 문맥에서 매우 흔합니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm font-extrabold text-emerald-600">
                reserve
              </p>
              <p className="mt-2 font-bold">
                I reserved a table.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                ‘미리 확보해 두다’라는 의미로 book과 겹치는 경우가 많지만,
                reserve는 자리·공간·물건 등을 따로 확보한다는 느낌에서도
                넓게 사용할 수 있습니다.
              </p>
            </article>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-600">
            따라서 한국어 ‘예약하다’가 나왔다고 항상 하나의 영어 동사만
            고정하는 것보다, 예약 대상과 상황을 확인하는 것이 좋습니다.
          </p>
        </section>

        <section className="mt-12 rounded-2xl border border-red-100 bg-red-50/40 p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-extrabold">
            9. 자주 생기는 번역 오류
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <p className="font-bold text-emerald-700">
                Book a room. → 방을 예약하세요. ✓
              </p>
              <p className="mt-1 text-slate-500">
                Book a room. → 책 방. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                명령문 첫 위치의 book을 명사 ‘책’으로만 고정하면
                문장 구조를 놓치게 됩니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-emerald-700">
                I bought a book. → 책 한 권을 샀어요. ✓
              </p>
              <p className="mt-1 text-slate-500">
                I bought a book. → 예약했어요. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                a가 book을 한정하고 bought의 목적어가 되므로
                이 book은 명사입니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-emerald-700">
                She books flights. → 그녀는 항공편을 예약합니다. ✓
              </p>
              <p className="mt-1 text-slate-500">
                She books flights. → 그녀 책들 항공편. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                books의 -s가 복수 표시인지 3인칭 단수 동사 표시인지
                문장 구조로 판별해야 합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            10. X-DIC에서 판단하는 순서
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            book을 만나면 먼저 앞에
            <strong> a, the, this 같은 한정사가 있는지</strong> 확인합니다.
            다음으로 book이
            <strong> 문장의 주어·목적어인지, 아니면 목적어를 취하는 동사인지</strong>
            를 판단합니다. 동사라면 room, flight, table, appointment,
            ticket처럼 예약과 자주 결합하는 목적어가 있는지 확인합니다.
            마지막으로 books, booked, booking 같은 형태 변화와 시제를 함께
            분석하여 가장 자연스러운 한국어 뜻을 선택합니다.
          </p>
        </section>

        <aside className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <h2 className="text-lg font-extrabold">
            직접 비교해 볼 검색어
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              'Pick up the book.',
              'Book a room.',
              'Open the book.',
              'I bought a book.',
              'I booked a hotel room.',
              'Book a flight.',
              'She books flights.',
              'The books are on the desk.',
              'The hotel is fully booked.',
              'Can I book a table for two?',
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
            X-DIC 검색 결과는 실제 사전·병렬문장·번역 결과를 확인하는
            도구 영역입니다. 이 페이지는 하나의 영어 표제어가 여러 품사와
            의미를 가질 때 주변 문맥으로 뜻을 판별하는 기준을 설명하는
            편집 콘텐츠입니다.
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

            <Link
              href="/english/to-vs-for"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              to와 for — 방향·수혜·목적 번역 기준 →
            </Link>

            <Link
              href="/english/articles-a-an-the"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              a · an · the — 영어 관사 번역 기준 →
            </Link>

            <Link
              href="/english/dont-do-not-doesnt"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              don&apos;t · do not · doesn&apos;t — 부정문 번역 기준 →
            </Link>

            <Link
              href="/english/tense-translation"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              현재·과거·미래 — 시제 번역 기준 →
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