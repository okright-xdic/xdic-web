import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title:
    "don't, do not, doesn't 차이 | 영어 부정문을 자연스럽게 번역하는 기준",
  description:
    "한국어의 '~하지 않아요'를 영어로 옮길 때 don't, doesn't, do not, does not, didn't를 어떻게 구별하는지 설명합니다. 주어, 시제, 일반동사, be동사, 조동사와 문체 차이를 실제 번역 예문으로 정리합니다.",
  alternates: {
    canonical: '/english/dont-do-not-doesnt',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const presentExamples = [
  {
    ko: '나는 커피를 마시지 않아요.',
    en: "I don't drink coffee.",
    note: "주어가 I이고 현재의 일반동사 drink를 부정하므로 don't + 동사원형을 사용합니다.",
  },
  {
    ko: '우리는 영어를 공부하지 않아요.',
    en: "We don't study English.",
    note: "we처럼 3인칭 단수 이외의 주어는 현재 부정문에서 don't를 사용합니다.",
  },
  {
    ko: '그는 커피를 마시지 않아요.',
    en: "He doesn't drink coffee.",
    note: "현재시제에서 주어가 he이므로 doesn't를 사용하고, 뒤의 동사는 drinks가 아니라 원형 drink가 됩니다.",
  },
  {
    ko: '그녀는 그 책을 읽지 않아요.',
    en: "She doesn't read the book.",
    note: "she는 3인칭 단수이므로 doesn't + read가 자연스럽습니다.",
  },
  {
    ko: '민수는 오늘 일하지 않아요.',
    en: "Minsu doesn't work today.",
    note: "사람 이름처럼 하나의 사람을 가리키는 단수 주어도 3인칭 단수로 처리합니다.",
  },
  {
    ko: '그들은 오늘 일하지 않아요.',
    en: "They don't work today.",
    note: "they는 복수 주어이므로 doesn't가 아니라 don't를 사용합니다.",
  },
];

const tenseExamples = [
  {
    label: '현재',
    ko: '나는 학교에 가지 않아요.',
    en: "I don't go to school.",
    note: "현재의 습관·일반 사실을 부정합니다.",
  },
  {
    label: '현재 · 3인칭 단수',
    ko: '그는 학교에 가지 않아요.',
    en: "He doesn't go to school.",
    note: "he이므로 doesn't + go를 사용합니다.",
  },
  {
    label: '과거',
    ko: '나는 어제 학교에 가지 않았어요.',
    en: "I didn't go to school yesterday.",
    note: "과거 부정은 주어와 관계없이 did not / didn't + 동사원형을 사용합니다.",
  },
  {
    label: '미래',
    ko: '나는 내일 학교에 가지 않을 거예요.',
    en: "I won't go to school tomorrow.",
    note: "미래의 부정은 문맥에 따라 will not / won't가 자연스럽습니다.",
  },
];

const contractionRows = [
  {
    form: "don't",
    full: 'do not',
    subject: 'I / you / we / they, 복수명사',
    example: "We don't agree.",
  },
  {
    form: "doesn't",
    full: 'does not',
    subject: 'he / she / it, 단수 3인칭 주어',
    example: "She doesn't agree.",
  },
  {
    form: "didn't",
    full: 'did not',
    subject: '모든 주어',
    example: "They didn't agree.",
  },
  {
    form: "won't",
    full: 'will not',
    subject: '모든 주어',
    example: "I won't go.",
  },
];

const wantExamples = [
  {
    ko: '나는 학교에 가고 싶지 않아요.',
    en: "I don't want to go to school.",
    note: "부정되는 중심 동사가 want이므로 don't want to + 동사원형 구조가 됩니다.",
  },
  {
    ko: '그는 일찍 출발하고 싶지 않아요.',
    en: "He doesn't want to leave early.",
    note: "주어 he 때문에 doesn't를 사용하지만 want 자체에는 -s를 붙이지 않습니다.",
  },
  {
    ko: '그녀는 그 책을 읽고 싶지 않아요.',
    en: "She doesn't want to read the book.",
    note: "doesn't가 현재시제와 3인칭 단수 표시를 담당하므로 뒤에는 want 원형이 옵니다.",
  },
  {
    ko: '우리는 물을 마시고 싶지 않아요.',
    en: "We don't want to drink water.",
    note: "we이므로 don't want to를 사용합니다.",
  },
];

const notDoSupportExamples = [
  {
    group: 'be동사',
    wrong: "I don't am tired.",
    correct: "I'm not tired.",
    ko: '나는 피곤하지 않아요.',
    note: 'be동사는 일반동사처럼 do를 빌려 부정하지 않습니다.',
  },
  {
    group: 'be동사',
    wrong: "She doesn't be busy.",
    correct: "She isn't busy.",
    ko: '그녀는 바쁘지 않아요.',
    note: 'is 자체에 not을 붙여 is not / isn’t로 만듭니다.',
  },
  {
    group: 'can',
    wrong: "I don't can swim.",
    correct: "I can't swim.",
    ko: '나는 수영할 수 없어요.',
    note: 'can 같은 조동사도 do-support를 사용하지 않습니다.',
  },
  {
    group: 'will',
    wrong: "He doesn't will come.",
    correct: "He won't come.",
    ko: '그는 오지 않을 거예요.',
    note: 'will의 부정은 will not / won’t입니다.',
  },
];

export default function DontDoNotDoesntPage() {
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
          <span className="text-slate-700">
            don&apos;t · do not · doesn&apos;t
          </span>
        </nav>

        <header className="border-b border-slate-200 pb-7 md:pb-9">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            don&apos;t, do not, doesn&apos;t
            <br className="hidden md:block" />
            한국어의 ‘~하지 않아요’를 어떻게 옮길까?
          </h1>

          <p className="mt-5 max-w-3xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            한국어에서는 ‘가지 않아요’, ‘읽지 않아요’, ‘하고 싶지 않아요’처럼
            비슷한 부정형을 사용할 수 있지만 영어에서는
            <strong className="text-slate-900">
              {' '}
              주어와 시제, 중심 동사의 종류
            </strong>
            에 따라 don&apos;t, doesn&apos;t, didn&apos;t 또는 다른
            부정형을 선택해야 합니다.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
            번역가 한줄 정리
          </h2>

          <p className="mt-3 leading-7 text-slate-700">
            현재시제의 일반동사를 부정할 때
            <strong> I / you / we / they에는 don&apos;t</strong>,
            <strong> he / she / it에는 doesn&apos;t</strong>를 쓰는 것이
            기본입니다. 축약하지 않은 <strong>do not / does not</strong>은
            뜻 자체가 달라지는 것이 아니라 문체나 강조 정도가 달라질 수
            있습니다.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-extrabold">
            1. don&apos;t와 doesn&apos;t의 핵심은 주어입니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-blue-600">
                I · you · we · they
              </p>

              <p className="mt-2 text-lg font-bold">
                I don&apos;t work today.
              </p>

              <p className="mt-1 text-slate-700">
                나는 오늘 일하지 않아요.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                현재의 일반동사를 부정할 때 I, you, we, they와 복수 주어에는
                don&apos;t를 사용합니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-emerald-600">
                he · she · it
              </p>

              <p className="mt-2 text-lg font-bold">
                He doesn&apos;t work today.
              </p>

              <p className="mt-1 text-slate-700">
                그는 오늘 일하지 않아요.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                he, she, it 또는 하나의 사람·사물을 나타내는 3인칭 단수
                주어에는 doesn&apos;t를 사용합니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            2. 실제 번역에서 주어를 바꿔 보기
          </h2>

          <div className="mt-5 space-y-4">
            {presentExamples.map((item, index) => (
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
            3. doesn&apos;t 뒤에는 동사원형이 옵니다
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <p className="font-bold text-slate-900">
                He doesn&apos;t go to school. ✓
              </p>
              <p className="mt-1 text-slate-500">
                He doesn&apos;t goes to school. ✗
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                She doesn&apos;t read the book. ✓
              </p>
              <p className="mt-1 text-slate-500">
                She doesn&apos;t reads the book. ✗
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                Minsu doesn&apos;t work today. ✓
              </p>
              <p className="mt-1 text-slate-500">
                Minsu doesn&apos;t works today. ✗
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm md:text-[15px] leading-6 text-slate-600">
            긍정문 <strong>He goes</strong>에서는 goes가 3인칭 단수를
            나타내지만, 부정문에서는 <strong>does</strong>가 그 역할을
            맡습니다. 따라서 뒤의 본동사는 원형 <strong>go</strong>로
            돌아갑니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            4. don&apos;t와 do not은 뜻보다 문체의 차이가 큽니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm font-extrabold text-blue-600">
                축약형
              </p>
              <p className="mt-2 text-lg font-bold">
                I don&apos;t agree.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                일상 회화와 자연스러운 일반 문장에서는 축약형이 매우
                흔합니다. don&apos;t가 ‘덜 정확한 영어’인 것은 아닙니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm font-extrabold text-emerald-600">
                비축약형
              </p>
              <p className="mt-2 text-lg font-bold">
                I do not agree.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                공식적인 문체, 강한 대조나 강조, 규칙·안내문처럼 축약을
                피하고 싶은 상황에서는 do not이 더 잘 어울릴 수 있습니다.
              </p>
            </article>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-5">
            <p className="font-bold">
              I don&apos;t want to go.
            </p>
            <p className="mt-1 text-slate-600">
              나는 가고 싶지 않아요.
            </p>

            <p className="mt-5 font-bold">
              I do not want to go.
            </p>
            <p className="mt-1 text-slate-600">
              나는 가고 싶지 않습니다 / 정말 가고 싶지 않습니다.
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              두 문장의 기본적인 부정 의미는 같습니다. 실제 번역에서는
              원문의 말투와 강조, 격식 정도를 보고 축약 여부를 결정합니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            5. ‘~하고 싶지 않아요’는 주어에 따라 don&apos;t와 doesn&apos;t가 갈립니다
          </h2>

          <div className="mt-5 space-y-4">
            {wantExamples.map((item) => (
              <article
                key={item.en}
                className="rounded-2xl border border-slate-200 bg-white p-5"
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

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            6. 현재·과거·미래에서는 부정형도 달라집니다
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    시제
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    한국어
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    영어
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    판단
                  </th>
                </tr>
              </thead>

              <tbody>
                {tenseExamples.map((row) => (
                  <tr
                    key={row.label}
                    className="border-t border-slate-100 align-top"
                  >
                    <td className="px-4 py-4 text-sm font-extrabold text-blue-700">
                      {row.label}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {row.ko}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold">
                      {row.en}
                    </td>
                    <td className="px-4 py-4 text-sm leading-6 text-slate-600">
                      {row.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            7. 과거의 didn&apos;t는 주어에 따라 변하지 않습니다
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
            <p className="font-bold">
              I didn&apos;t go.
            </p>
            <p className="mt-2 font-bold">
              He didn&apos;t go.
            </p>
            <p className="mt-2 font-bold">
              They didn&apos;t go.
            </p>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              현재에서는 don&apos;t / doesn&apos;t를 주어에 따라 구별하지만,
              과거의 일반동사 부정은 모든 주어에서
              <strong> did not / didn&apos;t + 동사원형</strong> 구조를
              사용합니다.
            </p>

            <p className="mt-5 font-bold text-slate-900">
              He didn&apos;t went to school. ✗
            </p>
            <p className="mt-1 font-bold text-emerald-700">
              He didn&apos;t go to school. ✓
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              과거 표시는 did가 담당하므로 뒤의 본동사는 went가 아니라
              원형 go가 됩니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            8. 모든 부정문이 don&apos;t / doesn&apos;t를 쓰는 것은 아닙니다
          </h2>

          <div className="mt-5 space-y-4">
            {notDoSupportExamples.map((item) => (
              <article
                key={item.correct}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <p className="text-xs font-extrabold text-blue-600">
                  {item.group}
                </p>
                <p className="mt-2 font-bold text-slate-500">
                  {item.wrong} ✗
                </p>
                <p className="mt-1 font-extrabold text-emerald-700">
                  {item.correct} ✓
                </p>
                <p className="mt-1 text-slate-700">
                  {item.ko}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.note}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            9. 명령문에서는 Don&apos;t와 Do not 모두 가능합니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold text-blue-700">
                Don&apos;t open the door.
              </p>
              <p className="mt-1 text-slate-700">
                문을 열지 마세요.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                일상적인 지시나 대화에서는 Don&apos;t로 시작하는 부정 명령문이
                자연스럽고 흔합니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold text-emerald-700">
                Do not enter.
              </p>
              <p className="mt-1 text-slate-700">
                들어가지 마십시오.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                표지판, 규칙, 공식 안내처럼 간결하고 강한 지시에서는
                Do not 형태가 자주 사용됩니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            10. 축약형과 비축약형 한눈에 보기
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[820px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    축약형
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    비축약형
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    주어
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    예문
                  </th>
                </tr>
              </thead>

              <tbody>
                {contractionRows.map((row) => (
                  <tr
                    key={row.form}
                    className="border-t border-slate-100"
                  >
                    <td className="px-4 py-4 font-extrabold text-blue-700">
                      {row.form}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold">
                      {row.full}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {row.subject}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {row.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-red-100 bg-red-50/40 p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-extrabold">
            11. 자주 생기는 번역 오류
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <p className="font-bold text-emerald-700">
                He doesn&apos;t work today. ✓
              </p>
              <p className="mt-1 text-slate-500">
                He don&apos;t work today. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                현재시제에서 he는 3인칭 단수이므로 doesn&apos;t를 사용합니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-emerald-700">
                He doesn&apos;t want to go. ✓
              </p>
              <p className="mt-1 text-slate-500">
                He doesn&apos;t wants to go. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                does에 이미 3인칭 단수 정보가 있으므로 뒤의 want에는
                -s를 붙이지 않습니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-emerald-700">
                She didn&apos;t read the book. ✓
              </p>
              <p className="mt-1 text-slate-500">
                She didn&apos;t readed the book. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                didn&apos;t 뒤에는 과거형이 아니라 동사원형을 사용합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            12. X-DIC에서 판단하는 순서
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            한국어의 ‘~하지 않다’를 영어로 옮길 때는 먼저
            <strong> 중심 서술어가 일반동사인지, be동사인지, 조동사인지</strong>
            를 확인합니다. 일반동사라면
            <strong> 현재인지 과거인지</strong>를 판단하고, 현재라면 다시
            <strong> 주어가 3인칭 단수인지</strong>를 확인하여
            don&apos;t와 doesn&apos;t를 구별합니다. 그다음 원문의 말투와
            격식·강조를 고려해 축약형과 do not / does not 같은
            비축약형 중 자연스러운 표현을 선택합니다.
          </p>
        </section>

        <aside className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <h2 className="text-lg font-extrabold">
            직접 비교해 볼 검색어
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              '나는 학교에 가고 싶지 않아요',
              '그는 일찍 출발하고 싶지 않아요',
              '그녀는 그 책을 읽고 싶지 않아요',
              '우리는 영어를 공부하고 싶지 않아요',
              '그는 오늘 일하지 않아요',
              "I don't want to go",
              "He doesn't work today",
              "I didn't go",
              'Do not enter',
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
            X-DIC 검색 결과는 실제 사전·병렬문장·번역 결과를 확인하는 도구
            영역입니다. 이 페이지는 한국어 부정 표현을 영어의 주어·시제·
            동사 구조에 맞게 선택하는 기준을 설명하는 편집 콘텐츠입니다.
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