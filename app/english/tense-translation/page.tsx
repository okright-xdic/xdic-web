import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title:
    '영어 현재·과거·미래 표현 | 한국어 시제와 진행형을 자연스럽게 번역하는 기준',
  description:
    "한국어의 '~아요', '~었어요', '~고 있어요', '~할 거예요'를 영어의 현재형, 과거형, 진행형, will, be going to 등으로 어떻게 옮기는지 실제 번역 예문과 함께 설명합니다.",
  alternates: {
    canonical: '/english/tense-translation',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const basicExamples = [
  {
    ko: '나는 매일 학교에 가요.',
    en: 'I go to school every day.',
    label: '현재 · 습관',
    note: '매일 반복되는 습관이므로 단순현재 go가 자연스럽습니다.',
  },
  {
    ko: '나는 지금 학교에 가고 있어요.',
    en: 'I am going to school now.',
    label: '현재진행',
    note: '지금 진행 중인 행동이므로 be + -ing 형태를 사용합니다.',
  },
  {
    ko: '나는 어제 학교에 갔어요.',
    en: 'I went to school yesterday.',
    label: '과거',
    note: '어제 완료된 행동이므로 go의 과거형 went를 사용합니다.',
  },
  {
    ko: '나는 내일 학교에 갈 거예요.',
    en: 'I will go to school tomorrow.',
    label: '미래 표현',
    note: '미래의 행동을 나타내는 기본적인 번역으로 will을 사용할 수 있습니다. 계획이 이미 정해진 문맥에서는 다른 미래 표현도 가능합니다.',
  },
  {
    ko: '나는 책을 읽어요.',
    en: 'I read books.',
    label: '현재 · 일반적 활동',
    note: '문맥 없이 반복적이거나 일반적인 활동을 말한다면 단순현재가 자연스럽습니다.',
  },
  {
    ko: '나는 지금 책을 읽고 있어요.',
    en: 'I am reading a book now.',
    label: '현재진행',
    note: '지금 실제로 읽는 중이라는 뜻이므로 am reading을 사용합니다.',
  },
  {
    ko: '나는 그 책을 읽었어요.',
    en: 'I read the book.',
    label: '과거',
    note: 'read는 철자는 같지만 과거형에서는 발음이 달라집니다. 문맥상 특정 책이면 the book이 자연스럽습니다.',
  },
  {
    ko: '그는 지금 일하고 있어요.',
    en: 'He is working now.',
    label: '현재진행',
    note: '주어가 he이므로 be동사는 is가 되고 work는 working이 됩니다.',
  },
];

const tenseComparison = [
  {
    type: '단순현재',
    form: 'I work.',
    meaning: '습관·일반 사실·반복',
    korean: '나는 일해요 / 나는 일을 합니다',
  },
  {
    type: '현재진행',
    form: 'I am working.',
    meaning: '지금 진행 중인 행동',
    korean: '나는 지금 일하고 있어요',
  },
  {
    type: '단순과거',
    form: 'I worked.',
    meaning: '과거에 일어난 행동',
    korean: '나는 일했어요',
  },
  {
    type: 'will',
    form: 'I will work.',
    meaning: '미래 행동·의지·예측 등',
    korean: '나는 일할 거예요',
  },
];

const futureExamples = [
  {
    form: 'I will call you tonight.',
    ko: '오늘 밤 전화할게요.',
    note: '말하는 순간의 의지·약속처럼 will이 자연스러운 문맥입니다.',
  },
  {
    form: 'I am going to study tonight.',
    ko: '오늘 밤 공부할 계획이에요.',
    note: '이미 가지고 있는 계획이나 의도를 나타낼 때 be going to가 잘 어울립니다.',
  },
  {
    form: 'I am meeting Minsu tomorrow.',
    ko: '나는 내일 민수를 만나요.',
    note: '이미 정해진 개인 일정은 현재진행형으로 미래를 나타낼 수 있습니다.',
  },
  {
    form: 'The train leaves at seven.',
    ko: '기차는 7시에 출발합니다.',
    note: '시간표·공식 일정은 단순현재로 미래를 나타내는 경우가 많습니다.',
  },
];

const contextExamples = [
  {
    korean: '나는 학교에 가요.',
    possible: 'I go to school.',
    reason: '습관이나 일반적인 사실이라면 단순현재',
  },
  {
    korean: '나는 학교에 가요.',
    possible: "I'm going to school.",
    reason: '지금 출발하거나 이동 중이라는 상황이라면 현재진행',
  },
  {
    korean: '내일 서울에 가요.',
    possible: "I'm going to Seoul tomorrow.",
    reason: '이미 정해진 미래 일정이라면 현재진행형도 가능',
  },
];

const progressiveExamples = [
  {
    base: 'read',
    sentence: 'She is reading the book.',
    korean: '그녀는 그 책을 읽고 있어요.',
  },
  {
    base: 'work',
    sentence: 'They are working now.',
    korean: '그들은 지금 일하고 있어요.',
  },
  {
    base: 'open',
    sentence: 'He is opening the door.',
    korean: '그는 문을 열고 있어요.',
  },
  {
    base: 'go',
    sentence: 'We are going to school.',
    korean: '우리는 학교에 가고 있어요.',
  },
];

const negativeExamples = [
  {
    ko: '나는 학교에 가지 않아요.',
    en: "I don't go to school.",
    point: '현재 일반동사 부정',
  },
  {
    ko: '그는 학교에 가지 않아요.',
    en: "He doesn't go to school.",
    point: '현재 3인칭 단수 부정',
  },
  {
    ko: '나는 어제 학교에 가지 않았어요.',
    en: "I didn't go to school yesterday.",
    point: '과거 부정',
  },
  {
    ko: '나는 지금 학교에 가고 있지 않아요.',
    en: "I'm not going to school now.",
    point: '현재진행 부정',
  },
  {
    ko: '나는 내일 학교에 가지 않을 거예요.',
    en: "I won't go to school tomorrow.",
    point: '미래 부정',
  },
];

export default function TenseTranslationPage() {
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
          <span className="text-slate-700">현재 · 과거 · 미래 표현</span>
        </nav>

        <header className="border-b border-slate-200 pb-7 md:pb-9">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            현재·과거·미래 표현
            <br className="hidden md:block" />
            한국어 시제를 영어로 어떻게 옮길까?
          </h1>

          <p className="mt-5 max-w-3xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            한국어의 어미 하나를 영어의 특정 시제 하나에 기계적으로 대응시키면
            자연스럽지 않은 번역이 생길 수 있습니다. 영어에서는
            <strong className="text-slate-900">
              {' '}
              사건의 시간뿐 아니라 반복인지, 지금 진행 중인지, 계획인지,
              이미 정해진 일정인지
            </strong>
            도 함께 판단해야 합니다.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-extrabold">
            번역가 한줄 정리
          </h2>

          <p className="mt-3 leading-7 text-slate-700">
            한국어의 <strong>‘~아요’가 항상 영어 단순현재</strong>인 것도,
            <strong> ‘~할 거예요’가 항상 will</strong>인 것도 아닙니다.
            시간 표현과 문맥을 먼저 보고
            <strong> 습관·진행·완료된 과거·계획·일정</strong> 가운데
            무엇을 말하는지 판단해야 합니다.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-extrabold">
            1. 같은 현재 표현도 문맥에 따라 달라집니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-sm font-extrabold text-blue-600">
                반복되는 습관
              </p>
              <p className="mt-2 text-lg font-bold">
                I go to school every day.
              </p>
              <p className="mt-1 text-slate-700">
                나는 매일 학교에 가요.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                every day가 반복되는 습관을 분명하게 해 주므로
                단순현재 go를 사용합니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-sm font-extrabold text-emerald-600">
                지금 진행 중
              </p>
              <p className="mt-2 text-lg font-bold">
                I am going to school now.
              </p>
              <p className="mt-1 text-slate-700">
                나는 지금 학교에 가고 있어요.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                now와 ‘~고 있어요’가 현재 진행 중인 행동을 나타내므로
                am going이 자연스럽습니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            2. 단순현재·현재진행·과거·미래 표현 비교
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    형태
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    영어 예문
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    중심 의미
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    한국어 예
                  </th>
                </tr>
              </thead>

              <tbody>
                {tenseComparison.map((row) => (
                  <tr
                    key={row.type}
                    className="border-t border-slate-100 align-top"
                  >
                    <td className="px-4 py-4 font-extrabold text-blue-700">
                      {row.type}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold">
                      {row.form}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {row.meaning}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {row.korean}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            3. 실제 한·영 번역에서 비교해 보기
          </h2>

          <div className="mt-5 space-y-4">
            {basicExamples.map((item, index) => (
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
                      {item.ko}
                    </p>

                    <p className="mt-1 text-[15px] md:text-[17px] font-extrabold text-blue-700">
                      {item.en}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
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
            4. ‘~고 있어요’는 진행 중인 행동을 먼저 확인합니다
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {progressiveExamples.map((item) => (
              <article
                key={item.sentence}
                className="rounded-xl border border-slate-200 p-4"
              >
                <p className="text-xs font-extrabold text-slate-500">
                  {item.base}
                </p>
                <p className="mt-1 font-bold text-blue-700">
                  {item.sentence}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {item.korean}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-5 text-sm md:text-[15px] leading-6 text-slate-600">
            영어 현재진행형은 기본적으로
            <strong> am / is / are + 동사-ing</strong> 구조입니다.
            따라서 주어까지 함께 분석해야 하며, 단순히 한국어의
            ‘~고 있어요’를 영어 동사에 -ing만 붙여 처리해서는 안 됩니다.
          </p>
        </section>

        <section className="mt-12 rounded-2xl border border-orange-200 bg-orange-50/50 p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-extrabold">
            5. 한국어 ‘~아요’가 항상 단순현재는 아닙니다
          </h2>

          <div className="mt-5 space-y-5">
            {contextExamples.map((item, index) => (
              <div
                key={`${item.possible}-${index}`}
                className="border-b border-orange-100 pb-5 last:border-0 last:pb-0"
              >
                <p className="font-bold text-slate-900">
                  {item.korean}
                </p>
                <p className="mt-1 font-extrabold text-blue-700">
                  {item.possible}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-600">
            한국어 현재형은 문맥에 따라 현재의 습관, 지금 일어나는 행동,
            가까운 미래의 일정까지 표현할 수 있습니다. 그래서
            <strong> 시간 부사와 상황 정보</strong>를 함께 보는 것이 중요합니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            6. ‘~할 거예요’를 무조건 will로 번역하지 않습니다
          </h2>

          <div className="mt-5 space-y-4">
            {futureExamples.map((item) => (
              <article
                key={item.form}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <p className="font-extrabold text-blue-700">
                  {item.form}
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

          <p className="mt-5 text-sm md:text-[15px] leading-6 text-slate-600">
            영어의 미래는 하나의 형태만으로 표현되지 않습니다.
            <strong> will, be going to, 현재진행형, 단순현재</strong> 등이
            문맥에 따라 미래를 나타낼 수 있습니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            7. 시간 표현은 시제 판단의 강한 단서입니다
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
            <p className="font-bold">
              every day → 반복·습관
            </p>
            <p className="mt-1 text-sm text-slate-600">
              I study English every day.
            </p>

            <p className="mt-5 font-bold">
              now / right now → 현재 진행
            </p>
            <p className="mt-1 text-sm text-slate-600">
              I am studying English now.
            </p>

            <p className="mt-5 font-bold">
              yesterday / last week → 과거
            </p>
            <p className="mt-1 text-sm text-slate-600">
              I studied English yesterday.
            </p>

            <p className="mt-5 font-bold">
              tomorrow / next week → 미래 문맥
            </p>
            <p className="mt-1 text-sm text-slate-600">
              I will study English tomorrow.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            8. 상태를 나타내는 동사는 진행형이 자연스럽지 않을 수 있습니다
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 p-5 md:p-6">
            <p className="font-bold text-emerald-700">
              I know the answer. ✓
            </p>
            <p className="mt-1 text-slate-500">
              I am knowing the answer. ✗
            </p>

            <p className="mt-5 font-bold text-emerald-700">
              I want some water. ✓
            </p>
            <p className="mt-1 text-slate-500">
              I am wanting some water. ✗
            </p>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              know, want처럼 상태를 나타내는 많은 동사는 일반적인 의미에서
              진행형보다 단순형이 자연스럽습니다. 따라서 한국어 표현만 보고
              무조건 be + -ing로 바꾸면 안 됩니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            9. 부정문에서는 시제와 주어를 함께 봅니다
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    한국어
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    영어
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    구조
                  </th>
                </tr>
              </thead>

              <tbody>
                {negativeExamples.map((row) => (
                  <tr
                    key={row.en}
                    className="border-t border-slate-100 align-top"
                  >
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {row.ko}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-blue-700">
                      {row.en}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {row.point}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-600">
            현재 일반동사의 부정은 don&apos;t / doesn&apos;t,
            과거는 didn&apos;t, 진행형은 be동사 + not,
            미래의 will 부정은 won&apos;t처럼
            <strong> 시제와 동사 구조에 따라 부정 방식도 달라집니다.</strong>
          </p>
        </section>

        <section className="mt-12 rounded-2xl border border-red-100 bg-red-50/40 p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-extrabold">
            10. 자주 생기는 번역 오류
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <p className="font-bold text-emerald-700">
                He is working now. ✓
              </p>
              <p className="mt-1 text-slate-500">
                He working now. ✗
              </p>
              <p className="mt-2 text-sm text-slate-600">
                진행형에는 주어에 맞는 be동사가 필요합니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-emerald-700">
                She went to school yesterday. ✓
              </p>
              <p className="mt-1 text-slate-500">
                She goes to school yesterday. ✗
              </p>
              <p className="mt-2 text-sm text-slate-600">
                yesterday가 완료된 과거 시점을 나타내므로 과거형이 필요합니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-emerald-700">
                He doesn&apos;t work today. ✓
              </p>
              <p className="mt-1 text-slate-500">
                He doesn&apos;t works today. ✗
              </p>
              <p className="mt-2 text-sm text-slate-600">
                doesn&apos;t가 시제와 3인칭 단수를 표시하므로
                본동사는 원형 work가 됩니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-emerald-700">
                I am reading a book now. ✓
              </p>
              <p className="mt-1 text-slate-500">
                I read a book now. △
              </p>
              <p className="mt-2 text-sm text-slate-600">
                ‘바로 지금 읽는 중’이라는 의미라면 현재진행형이
                문맥을 더 정확하게 표현합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            11. X-DIC에서 판단하는 순서
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            먼저 문장에
            <strong> 어제·지금·매일·내일 같은 시간 단서</strong>가 있는지
            확인합니다. 그다음 행동이
            <strong> 반복되는 습관인지, 지금 진행 중인지, 이미 끝난 과거인지,
            앞으로의 계획·예측·일정인지</strong>를 판단합니다.
            이후 주어에 맞는 동사 형태와 be동사·조동사를 결정하고,
            마지막으로 부정·관사·전치사 같은 주변 문법 요소를 조정합니다.
          </p>
        </section>

        <aside className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <h2 className="text-lg font-extrabold">
            직접 비교해 볼 검색어
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              '나는 매일 학교에 가요',
              '나는 학교에 갔어요',
              '나는 학교에 가고 있어요',
              '나는 내일 학교에 갈 거예요',
              '나는 책을 읽어요',
              '나는 책을 읽었어요',
              '나는 책을 읽고 있어요',
              '그는 지금 일하고 있어요',
              'I go to school every day',
              'I am going to school now',
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
            도구 영역입니다. 이 페이지는 한국어의 시간 표현과 문맥을
            영어의 단순형·진행형·미래 표현에 연결하는 기준을 설명하는
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