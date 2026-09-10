import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'a, an, the 차이 | 한국어에 없는 영어 관사를 자연스럽게 번역하는 기준',
  description:
    '한국어에는 직접 대응하는 관사가 없지만 영어에서는 a, an, the와 무관사가 중요한 역할을 합니다. 처음 언급, 특정 대상, 발음, 단수·복수와 셀 수 없는 명사를 중심으로 실제 번역 예문과 오류를 설명합니다.',
  alternates: {
    canonical: '/english/articles-a-an-the',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const examples = [
  {
    ko: '책 한 권을 샀어요.',
    en: 'I bought a book.',
    note: '처음 언급하는 셀 수 있는 단수 명사 book 앞에는 보통 a가 필요합니다.',
  },
  {
    ko: '그 책은 비쌌어요.',
    en: 'The book was expensive.',
    note: '앞 문장에서 이미 언급된 책을 다시 가리키므로 the를 사용합니다.',
  },
  {
    ko: '사과 하나 주세요.',
    en: 'Please give me an apple.',
    note: 'apple은 모음 소리로 시작하므로 a가 아니라 an을 사용합니다.',
  },
  {
    ko: '그녀는 선생님이에요.',
    en: 'She is a teacher.',
    note: '직업을 나타내는 셀 수 있는 단수 명사 앞에는 일반적으로 a 또는 an이 필요합니다.',
  },
  {
    ko: '한 시간 기다렸어요.',
    en: 'I waited for an hour.',
    note: 'hour의 h는 발음되지 않아 모음 소리로 시작하므로 an hour라고 합니다.',
  },
  {
    ko: '그는 대학생이에요.',
    en: 'He is a university student.',
    note: 'university는 철자는 모음 u로 시작하지만 발음이 /j/ 계열의 자음 소리로 시작하므로 a university student라고 합니다.',
  },
  {
    ko: '문을 닫아 주세요.',
    en: 'Please close the door.',
    note: '대화 상황에서 어떤 문인지 서로 알 수 있다면 특정한 대상을 가리키므로 the가 자연스럽습니다.',
  },
  {
    ko: '태양은 동쪽에서 떠요.',
    en: 'The sun rises in the east.',
    note: '문맥상 유일하다고 보는 대상에는 the가 사용되는 경우가 많습니다.',
  },
  {
    ko: '나는 음악을 좋아해요.',
    en: 'I like music.',
    note: 'music처럼 셀 수 없는 명사를 일반적인 의미로 말할 때는 관사를 쓰지 않는 경우가 많습니다.',
  },
  {
    ko: '개는 충성스러운 동물이에요.',
    en: 'Dogs are loyal animals.',
    note: '복수 명사를 종류 전체에 대한 일반적인 의미로 말할 때는 무관사를 사용할 수 있습니다.',
  },
  {
    ko: '나는 학교에 가요.',
    en: 'I go to school.',
    note: '학생이 교육을 받으러 학교에 간다는 일반적인 제도적 의미에서는 school 앞에 관사를 쓰지 않는 것이 자연스럽습니다.',
  },
  {
    ko: '나는 그 학교에 갔어요.',
    en: 'I went to the school.',
    note: '특정 학교나 학교 건물을 가리키는 문맥에서는 the school이라고 할 수 있습니다.',
  },
];

const comparisonRows = [
  {
    expression: 'a',
    focus: '처음 언급하는 셀 수 있는 단수 명사',
    example: 'a book',
    translation: '책 한 권 / 어떤 책',
  },
  {
    expression: 'an',
    focus: '모음 소리로 시작하는 셀 수 있는 단수 명사',
    example: 'an apple',
    translation: '사과 하나 / 어떤 사과',
  },
  {
    expression: 'the',
    focus: '화자와 청자가 특정할 수 있는 대상',
    example: 'the book',
    translation: '그 책 / 해당 책',
  },
  {
    expression: '무관사',
    focus: '일반적인 복수명사·셀 수 없는 명사 등',
    example: 'books / water',
    translation: '책들 / 물',
  },
];

const aAnExamples = [
  ['a book', 'book은 자음 소리로 시작'],
  ['an apple', 'apple은 모음 소리로 시작'],
  ['an hour', 'hour의 h는 발음되지 않음'],
  ['an honest person', 'honest의 h는 발음되지 않음'],
  ['a university', 'university는 /j/ 계열 자음 소리로 시작'],
  ['a European country', 'European도 /j/ 계열 자음 소리로 시작'],
];

const zeroArticleExamples = [
  ['I like coffee.', '커피를 일반적인 의미로 말함'],
  ['Water is important.', '물을 일반적인 물질로 말함'],
  ['Children need sleep.', '어린이 전체를 일반적으로 말함'],
  ['Books can be expensive.', '책이라는 종류를 일반적으로 말함'],
  ['I go to school.', '학생으로서 학교에 다니는 제도적 의미'],
  ['She is at work.', '근무 중이라는 일반적인 표현'],
];

export default function ArticlesAAnThePage() {
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
          <span className="text-slate-700">a · an · the</span>
        </nav>

        <header className="border-b border-slate-200 pb-7 md:pb-9">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            a, an, the
            <br className="hidden md:block" />
            한국어에 없는 관사를 어떻게 번역할까?
          </h1>

          <p className="mt-5 max-w-3xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            한국어 문장에는 영어의 a, an, the에 정확히 일대일 대응하는
            요소가 없는 경우가 많습니다. 그래서 한·영 번역에서는
            <strong className="text-slate-900">
              {' '}명사가 셀 수 있는지, 단수인지 복수인지, 처음 언급되는지,
              이미 특정된 대상인지
            </strong>
            를 문맥에서 판단해야 합니다.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
            번역가 한줄 정리
          </h2>

          <p className="mt-3 leading-7 text-slate-700">
            셀 수 있는 단수 명사를 처음 소개할 때는
            <strong> a / an</strong>, 화자와 청자가 어떤 대상인지 특정할 수
            있을 때는 <strong>the</strong>를 사용하는 것이 기본적인
            출발점입니다. 하지만 복수명사와 셀 수 없는 명사, 고정 표현에서는
            <strong> 관사를 쓰지 않는 경우</strong>도 반드시 함께 봐야 합니다.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-extrabold">
            1. 한국어에 관사가 없다고 영어에서도 생략할 수 있는 것은 아닙니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-blue-600">
                처음 언급
              </p>

              <p className="mt-2 text-lg font-bold">
                I bought a book.
              </p>

              <p className="mt-1 text-slate-700">
                책 한 권을 샀어요.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                book은 셀 수 있는 단수 명사이고 아직 어떤 책인지 특정되지
                않았으므로 a book이라고 합니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-emerald-600">
                다시 언급
              </p>

              <p className="mt-2 text-lg font-bold">
                The book was expensive.
              </p>

              <p className="mt-1 text-slate-700">
                그 책은 비쌌어요.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                앞에서 이미 소개된 책이므로 듣는 사람도 어떤 책인지 알 수
                있습니다. 이때는 the book으로 특정합니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            2. a · an · the · 무관사 핵심 비교
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[820px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    형태
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    판단 기준
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    대표 예
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    한국어에서의 느낌
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
            4. a와 an은 철자가 아니라 ‘소리’로 결정합니다
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {aAnExamples.map(([en, note]) => (
              <div
                key={en}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <p className="font-bold text-blue-700">
                  {en}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {note}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm md:text-[15px] leading-6 text-slate-600">
            따라서 <strong>an hour</strong>처럼 자음 글자로 시작해도
            모음 소리로 시작하면 an을 쓰고,
            <strong> a university</strong>처럼 모음 글자로 시작해도
            자음 소리로 시작하면 a를 사용합니다.
          </p>
        </section>

        <section className="mt-12 rounded-2xl border border-orange-200 bg-orange-50/50 p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-extrabold">
            5. 자주 생기는 번역 오류
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <p className="font-bold text-slate-900">
                I bought a book. ✓
              </p>
              <p className="mt-1 text-slate-500">
                I bought book. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                셀 수 있는 단수 명사 book을 일반적인 보통명사로 사용할 때는
                보통 관사나 다른 한정사가 필요합니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                She is a teacher. ✓
              </p>
              <p className="mt-1 text-slate-500">
                She is teacher. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                직업을 나타내는 셀 수 있는 단수 명사에도 일반적으로
                a 또는 an이 필요합니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                I need information. ✓
              </p>
              <p className="mt-1 text-slate-500">
                I need an information. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                information은 일반적으로 셀 수 없는 명사이므로
                하나의 정보를 뜻한다고 해서 an information이라고 하지
                않습니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            6. the는 단순히 한국어의 ‘그’와 같은 말이 아닙니다
          </h2>

          <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-5 md:p-6">
            <p className="font-bold text-slate-900">
              Please close the door.
            </p>
            <p className="mt-1 text-slate-700">
              문을 닫아 주세요.
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              한국어에는 ‘그 문’이라는 말이 없지만, 같은 방에 있는 화자와
              청자가 어떤 문을 가리키는지 알 수 있다면 영어에서는
              the door가 자연스럽습니다.
            </p>

            <p className="mt-6 font-bold text-slate-900">
              I saw a dog. The dog was sleeping.
            </p>
            <p className="mt-1 text-slate-700">
              개 한 마리를 봤어요. 그 개는 자고 있었어요.
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              처음에는 a dog로 새 대상을 소개하고, 다시 언급할 때는
              이미 특정된 대상이므로 the dog라고 합니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            7. 관사를 쓰지 않는 경우도 중요한 번역 판단입니다
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {zeroArticleExamples.map(([en, note]) => (
              <div
                key={en}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <p className="font-bold text-emerald-700">
                  {en}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {note}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm md:text-[15px] leading-6 text-slate-600">
            무관사는 ‘관사를 빼먹은 것’이 아니라 영어 문법에서 하나의
            정상적인 선택입니다. 특히 일반적인 의미의 복수명사와
            셀 수 없는 명사에서는 관사를 쓰지 않는 경우가 많습니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            8. school과 the school은 뜻의 초점이 달라질 수 있습니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold text-blue-700">
                I go to school.
              </p>
              <p className="mt-1 text-slate-700">
                나는 학교에 다녀요.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                학생으로서 교육을 받으러 다닌다는 제도적·일반적 의미가
                중심입니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold text-emerald-700">
                I went to the school.
              </p>
              <p className="mt-1 text-slate-700">
                나는 그 학교에 갔어요.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                문맥에서 특정한 학교나 그 장소를 가리키는 의미가
                중심이 될 수 있습니다.
              </p>
            </article>
          </div>

          <p className="mt-5 text-sm md:text-[15px] leading-6 text-slate-600">
            따라서 한국어의 ‘학교에’만 보고 school 앞의 관사를 기계적으로
            결정해서는 안 됩니다. 문장이 학교라는
            <strong> 제도적 활동</strong>을 말하는지,
            <strong> 특정 장소</strong>를 가리키는지 살펴야 합니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            9. 셀 수 있는 명사인지 먼저 확인합니다
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
            <p className="font-bold text-slate-900">
              a contract · a receipt · a file · a book
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              contract, receipt, file, book처럼 셀 수 있는 단수 명사를
              하나의 개별 대상으로 말할 때는 보통 a/an, the, my, this 같은
              한정 표현이 필요합니다.
            </p>

            <p className="mt-6 font-bold text-slate-900">
              information · advice · water · music
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              이런 명사들은 일반적인 의미에서 셀 수 없는 명사로 쓰이는 경우가
              많으므로 단순히 한국어에서 ‘하나’처럼 해석된다는 이유만으로
              a/an을 붙이면 안 됩니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            10. X-DIC에서 판단하는 순서
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            한국어 명사를 영어로 번역할 때 먼저
            <strong> 셀 수 있는 명사인지</strong>,
            <strong> 단수인지 복수인지</strong>를 확인합니다.
            셀 수 있는 단수라면 새로 소개하는 대상인지,
            이미 언급되었거나 상황상 특정할 수 있는 대상인지 살펴
            <strong> a / an / the</strong>를 결정합니다.
            이후 발음에 따라 a와 an을 구별하고,
            복수명사·셀 수 없는 명사·고정 표현에서는
            <strong> 무관사</strong>가 자연스러운지도 확인합니다.
          </p>
        </section>

        <aside className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <h2 className="text-lg font-extrabold">
            직접 비교해 볼 검색어
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              '책을 샀어요',
              '그 책은 비쌌어요',
              '그녀는 선생님이에요',
              '문을 닫아 주세요',
              '계약서를 보내 주세요',
              'a book',
              'an hour',
              'the door',
              'I go to school.',
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
            영역입니다. 이 페이지는 한국어에 직접 나타나지 않는 관사를
            문맥과 명사의 성격에 따라 선택하는 기준을 설명하는 편집
            콘텐츠입니다.
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