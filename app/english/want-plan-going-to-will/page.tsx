import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title:
    'want to, plan to, be going to, will 차이 | 희망·계획·미래 번역 기준',
  description:
    '한국어의 “~하고 싶어요”, “~할 계획이에요”, “~할 거예요”를 영어로 옮길 때 want to, plan to, be going to, will을 어떻게 구별하는지 설명합니다. 부정문, 의문문, 과거의 의도와 실제 번역 예문도 함께 정리합니다.',
  alternates: {
    canonical: '/english/want-plan-going-to-will',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const comparisonRows = [
  {
    expression: 'want to + V',
    focus: '희망·바람·욕구',
    example: 'I want to study English.',
    translation: '나는 영어를 공부하고 싶어요.',
  },
  {
    expression: 'plan to + V',
    focus: '생각해 둔 계획·예정',
    example: 'I plan to leave early.',
    translation: '나는 일찍 출발할 계획이에요.',
  },
  {
    expression: 'be going to + V',
    focus: '이미 생긴 의도·계획 또는 근거가 보이는 예측',
    example: "I'm going to call him tonight.",
    translation: '나는 오늘 밤 그에게 전화할 거예요.',
  },
  {
    expression: 'will + V',
    focus: '즉석 결정·의지·약속·중립적 미래 예측',
    example: "I'll call him now.",
    translation: '제가 지금 그에게 전화할게요.',
  },
];

const examples = [
  {
    ko: '나는 영어를 배우고 싶어요.',
    en: 'I want to learn English.',
    note:
      '원하는 마음이나 희망이 핵심이므로 want to가 자연스럽습니다. 아직 구체적인 계획이 있다는 뜻까지 포함하지는 않습니다.',
  },
  {
    ko: '나는 내일 학교에 갈 계획이에요.',
    en: 'I plan to go to school tomorrow.',
    note:
      '미리 생각해 둔 계획 자체를 말하므로 plan to가 잘 맞습니다.',
  },
  {
    ko: '나는 오늘 저녁에 민수에게 전화할 거예요.',
    en: "I'm going to call Minsu this evening.",
    note:
      '이미 전화할 의도가 정해져 있다는 문맥이면 be going to가 자연스럽습니다.',
  },
  {
    ko: '제가 문을 닫을게요.',
    en: "I'll close the door.",
    note:
      '말하는 순간 자기가 하겠다고 결정하거나 자원하는 상황에서는 will이 자연스럽습니다.',
  },
  {
    ko: '그는 컴퓨터를 사용하고 싶지 않아요.',
    en: "He doesn't want to use the computer.",
    note:
      'want to의 부정은 주어에 따라 do not / does not + want to 구조를 사용합니다.',
  },
  {
    ko: '그는 일찍 출발할 계획이 아니에요.',
    en: "He doesn't plan to leave early.",
    note:
      '현재의 계획이 없다는 뜻이면 does not plan to가 자연스럽습니다.',
  },
  {
    ko: '비가 올 것 같아요.',
    en: "It's going to rain.",
    note:
      '현재 보이는 징후나 근거를 바탕으로 가까운 미래를 예측할 때 be going to가 자주 쓰입니다.',
  },
  {
    ko: '내일은 더 추울 거예요.',
    en: 'It will be colder tomorrow.',
    note:
      '단순한 미래 예측이나 전망을 말할 때 will이 자연스럽게 쓰일 수 있습니다.',
  },
];

const negativeRows = [
  {
    label: 'want to',
    en: "I don't want to go.",
    ko: '나는 가고 싶지 않아요.',
  },
  {
    label: 'plan to',
    en: "I don't plan to go.",
    ko: '나는 갈 계획이 아니에요.',
  },
  {
    label: 'be going to',
    en: "I'm not going to go.",
    ko: '나는 가지 않을 거예요 / 갈 생각이 없어요.',
  },
  {
    label: 'will',
    en: "I won't go.",
    ko: '나는 가지 않을 거예요.',
  },
];

const questionRows = [
  {
    label: 'want to',
    en: 'Do you want to go?',
    ko: '가고 싶어요?',
  },
  {
    label: 'plan to',
    en: 'Do you plan to go?',
    ko: '갈 계획이에요?',
  },
  {
    label: 'be going to',
    en: 'Are you going to go?',
    ko: '갈 거예요?',
  },
  {
    label: 'will',
    en: 'Will you go?',
    ko: '갈 거예요? / 가실 건가요?',
  },
];

export default function WantPlanGoingToWillPage() {
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
          <Link href="/english" className="hover:text-blue-700 font-medium">
            번역가 해설
          </Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">
            want to · plan to · be going to · will
          </span>
        </nav>

        <header className="border-b border-slate-200 pb-7 md:pb-9">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            want to, plan to, be going to, will
            <br className="hidden md:block" />
            희망·계획·미래를 어떻게 구별할까?
          </h1>

          <p className="mt-5 max-w-4xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            한국어의 ‘~할 거예요’는 영어의 미래 표현 하나와 일대일로 대응하지
            않습니다. 어떤 일을 <strong className="text-slate-900">원하는지</strong>,
            이미 <strong className="text-slate-900">계획을 세웠는지</strong>,
            현재의 <strong className="text-slate-900">의도나 징후가 있는지</strong>,
            또는 말하는 순간의 <strong className="text-slate-900">결정·약속·예측인지</strong>
            에 따라 표현이 달라질 수 있습니다.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-extrabold">
            번역가 한줄 정리
          </h2>
          <p className="mt-3 leading-7 text-slate-700">
            <strong>want to</strong>는 희망,
            <strong> plan to</strong>는 계획,
            <strong> be going to</strong>는 이미 정해진 의도나 근거 있는 예측,
            <strong> will</strong>은 즉석 결정·의지·약속·일반적인 미래 예측에
            자주 쓰입니다. 실제 문맥에서는 의미가 겹치는 경우도 있으므로
            하나의 한국어 어미만 보고 기계적으로 고르지 않습니다.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-extrabold">
            1. 네 표현의 핵심 차이
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[880px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">표현</th>
                  <th className="px-4 py-3 text-sm font-extrabold">핵심 의미</th>
                  <th className="px-4 py-3 text-sm font-extrabold">예문</th>
                  <th className="px-4 py-3 text-sm font-extrabold">한국어</th>
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
            2. want to — 하고 싶은 마음을 말할 때
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 p-5 md:p-6">
            <p className="font-extrabold text-blue-700">
              I want to learn English.
            </p>
            <p className="mt-1 text-slate-700">
              나는 영어를 배우고 싶어요.
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              <strong>want to + 동사원형</strong>은 어떤 행동을 하고 싶은
              희망이나 욕구를 나타냅니다. 하고 싶다는 마음이 있다는 뜻이지,
              그 행동을 이미 일정에 넣었거나 실행 계획을 세웠다는 뜻까지
              자동으로 포함하지는 않습니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            3. plan to — 생각해 둔 계획을 말할 때
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 p-5 md:p-6">
            <p className="font-extrabold text-blue-700">
              I plan to leave early tomorrow.
            </p>
            <p className="mt-1 text-slate-700">
              나는 내일 일찍 출발할 계획이에요.
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              <strong>plan to + 동사원형</strong>은 앞으로 할 일을 미리
              생각하고 계획해 둔 상태를 직접 말합니다. 단순한 바람보다
              구체적이지만, 계획이 반드시 실행된다는 보장은 없습니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            4. be going to — 이미 생긴 의도 또는 근거 있는 예측
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-extrabold text-blue-600">의도·계획</p>
              <p className="mt-2 font-extrabold">
                I&apos;m going to call him tonight.
              </p>
              <p className="mt-1 text-slate-700">
                나는 오늘 밤 그에게 전화할 거예요.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                말하기 전부터 어느 정도 정해져 있던 의도나 계획을 나타낼 수 있습니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-extrabold text-blue-600">근거 있는 예측</p>
              <p className="mt-2 font-extrabold">It&apos;s going to rain.</p>
              <p className="mt-1 text-slate-700">비가 올 것 같아요.</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                현재 보이는 구름이나 상황처럼 예측의 근거가 눈앞에 있을 때도
                be going to가 자주 쓰입니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            5. will — 즉석 결정·의지·약속·미래 예측
          </h2>

          <div className="mt-5 space-y-3">
            {[
              ['즉석 결정', "I'll answer the phone.", '제가 전화를 받을게요.'],
              ['의지·자원', "I'll help you.", '제가 도와드릴게요.'],
              ['약속', "I'll call you tomorrow.", '내일 전화할게요.'],
              ['미래 예측', 'It will be cold tomorrow.', '내일은 추울 거예요.'],
            ].map(([label, en, ko]) => (
              <article
                key={label}
                className="rounded-xl border border-slate-200 px-4 py-3"
              >
                <p className="text-xs font-extrabold text-blue-600">{label}</p>
                <p className="mt-1 font-bold">{en}</p>
                <p className="mt-1 text-sm text-slate-600">{ko}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            6. 같은 ‘~할 거예요’라도 문맥이 다릅니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold">
                I&apos;m going to close the door.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                문을 닫으려는 의도가 이미 있었거나 계획이 정해져 있는 느낌입니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold">I&apos;ll close the door.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                지금 상황에서 ‘제가 닫을게요’라고 결정하거나 자원하는 느낌이
                자연스럽습니다.
              </p>
            </article>
          </div>

          <p className="mt-4 leading-7 text-slate-700">
            두 문장 모두 한국어로는 ‘문을 닫을 거예요’라고 번역될 수 있지만,
            영어에서는 말하는 시점의 의도와 결정 과정이 다를 수 있습니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            7. 부정문은 구조가 각각 다릅니다
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">표현</th>
                  <th className="px-4 py-3 text-sm font-extrabold">부정문</th>
                  <th className="px-4 py-3 text-sm font-extrabold">한국어</th>
                </tr>
              </thead>
              <tbody>
                {negativeRows.map((row) => (
                  <tr key={row.label} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-extrabold text-blue-700">
                      {row.label}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold">{row.en}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{row.ko}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            8. 의문문도 보조동사가 달라집니다
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">표현</th>
                  <th className="px-4 py-3 text-sm font-extrabold">의문문</th>
                  <th className="px-4 py-3 text-sm font-extrabold">한국어</th>
                </tr>
              </thead>
              <tbody>
                {questionRows.map((row) => (
                  <tr key={row.label} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-extrabold text-blue-700">
                      {row.label}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold">{row.en}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{row.ko}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            9. 과거의 희망·계획·의도도 구별합니다
          </h2>

          <div className="mt-5 space-y-3">
            <article className="rounded-xl border border-slate-200 px-4 py-3">
              <p className="font-bold">I wanted to call him.</p>
              <p className="mt-1 text-sm text-slate-600">
                그에게 전화하고 싶었어요. — 과거의 희망
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 px-4 py-3">
              <p className="font-bold">I planned to call him.</p>
              <p className="mt-1 text-sm text-slate-600">
                그에게 전화할 계획이었어요. — 과거에 세운 계획
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 px-4 py-3">
              <p className="font-bold">I was going to call him.</p>
              <p className="mt-1 text-sm text-slate-600">
                그에게 전화하려고 했어요. — 당시의 의도·예정
              </p>
            </article>
          </div>

          <p className="mt-4 leading-7 text-slate-700">
            <strong>was/were going to</strong>는 과거에 그런 의도나 예정이
            있었다는 뜻이며, 문맥에 따라 실제로 실행되지 않았다는 느낌이
            따라올 수 있습니다. 하지만 문장 하나만 보고 무조건 ‘실행하지
            않았다’고 단정하지는 않습니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            10. 실제 번역에서 비교해 보기
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
            11. 자주 생기는 번역 오류
          </h2>

          <div className="mt-4 space-y-4 leading-7 text-slate-700">
            <p>
              <strong>‘~할 거예요’를 무조건 will로 바꾸지 않습니다.</strong>{' '}
              이미 정해진 의도나 현재 근거가 있다면 be going to가 더 자연스러울
              수 있습니다.
            </p>
            <p>
              <strong>‘~하고 싶어요’를 미래 시제로 보지 않습니다.</strong>{' '}
              want to는 희망을 말하는 구조이며, 그 자체로 계획이나 확정된 미래를
              뜻하지 않습니다.
            </p>
            <p>
              <strong>plan to와 be going to를 완전히 같은 표현으로 보지 않습니다.</strong>{' '}
              plan to는 ‘계획’이라는 사실을 직접 말하고, be going to는 이미 생긴
              의도나 예정 자체에 초점을 둘 수 있습니다.
            </p>
            <p>
              <strong>will과 be going to의 차이를 절대 규칙으로 만들지도 않습니다.</strong>{' '}
              실제 회화에서는 둘의 의미 영역이 겹칠 수 있으므로 문맥과 화자의
              관점을 함께 봅니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            12. X-DIC에서 판단하는 순서
          </h2>

          <ol className="mt-5 space-y-3 text-slate-700">
            {[
              '한국어 문장이 희망, 계획, 이미 정해진 의도, 즉석 결정, 약속, 예측 중 무엇을 나타내는지 먼저 확인합니다.',
              '“~하고 싶다”라면 want to가 맞는지 확인합니다.',
              '계획 자체를 직접 말한다면 plan to를 우선 검토합니다.',
              '말하기 전에 이미 생긴 의도나 현재 근거가 있는 예측이라면 be going to를 검토합니다.',
              '즉석 결정·의지·약속·일반적 미래 예측이라면 will을 검토합니다.',
              '부정문과 의문문에서는 do/does, be동사, will의 문장 구조를 각각 맞춥니다.',
              '과거의 의도라면 wanted to, planned to, was/were going to 중 의미에 맞는 구조를 고릅니다.',
              '마지막으로 X-DIC 검색과 병렬 예문을 비교해 실제 쓰임을 확인합니다.',
            ].map((item, index) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-slate-200 px-4 py-3"
              >
                <span className="font-extrabold text-blue-700">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>

        <aside className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <h2 className="text-lg font-extrabold">직접 비교해 볼 검색어</h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              '나는 영어를 배우고 싶어요',
              '나는 내일 학교에 갈 계획이에요',
              '나는 오늘 저녁에 민수에게 전화할 거예요',
              '제가 문을 닫을게요',
              '그는 컴퓨터를 사용하고 싶지 않아요',
              '그는 일찍 출발할 계획이 아니에요',
              'I want to learn English.',
              'I plan to leave early.',
              "I'm going to call him tonight.",
              "I'll close the door.",
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
            영역입니다. 이 페이지는 희망·계획·의도·미래 표현을 문맥에 따라
            구별하는 번역 판단 기준을 설명하는 편집 콘텐츠입니다.
          </p>
        </aside>

        <section className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 md:p-6">
          <h2 className="text-lg font-extrabold">작성·편집 및 검토 정보</h2>

          <dl className="mt-4 grid gap-3 text-sm leading-6 md:grid-cols-2">
            <div>
              <dt className="font-extrabold text-slate-800">작성·편집</dt>
              <dd className="text-slate-600">X-DIC</dd>
            </div>
            <div>
              <dt className="font-extrabold text-slate-800">최종 검토</dt>
              <dd className="text-slate-600">
                <time dateTime="2026-09-22">2026-09-22</time>
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="font-extrabold text-slate-800">검토 기준</dt>
              <dd className="text-slate-600">
                X-DIC 검색 데이터 · CORE 대표 회귀 테스트 · 문장 구조 및
                의미 대응 검토
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/data-policy"
              className="text-sm font-extrabold text-emerald-700 hover:text-emerald-900"
            >
              데이터·편집 원칙 →
            </Link>
            <Link
              href="/guide"
              className="text-sm font-extrabold text-blue-700 hover:text-blue-900"
            >
              X-DIC 이용 안내 →
            </Link>
          </div>
        </section>

        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-lg font-extrabold">관련 번역가 해설</h2>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/english/tense-translation"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              현재 · 과거 · 미래 →
            </Link>
            <Link
              href="/english/dont-do-not-doesnt"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              don&apos;t · do not · doesn&apos;t →
            </Link>
            <Link
              href="/english/ask-tell-require-persuade"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              ask · tell · require · persuade →
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
