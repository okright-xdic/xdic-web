import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'go와 come 차이 | 가다·오다를 자연스럽게 번역하는 기준',
  description:
    '한국어의 가다·오다가 영어에서 항상 go·come으로 일대일 대응하지 않는 이유를 번역 관점에서 설명합니다. 화자, 청자, 목적지와 기준점을 중심으로 go와 come의 차이를 예문과 함께 정리합니다.',
  alternates: {
    canonical: '/english/go-vs-come',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const examples = [
  {
    ko: '나는 매일 학교에 가요.',
    en: 'I go to school every day.',
    note: '일상적인 이동을 말하며 화자 쪽으로 오는 움직임이라는 특별한 기준점이 없으므로 go가 자연스럽습니다.',
  },
  {
    ko: '그녀는 어제 부산에 갔어요.',
    en: 'She went to Busan yesterday.',
    note: '과거의 이동 목적지를 객관적으로 설명하는 문장입니다.',
  },
  {
    ko: '여기로 와 주세요.',
    en: 'Please come here.',
    note: '목적지가 화자가 있는 here이므로 come이 자연스럽습니다.',
  },
  {
    ko: '지금 갈게요.',
    en: "I'll come now.",
    note: '상대방이 있는 곳으로 이동하겠다는 뜻이라면 한국어는 가다를 쓰더라도 영어에서는 come이 자연스러울 수 있습니다.',
  },
  {
    ko: '내일 당신 사무실로 갈게요.',
    en: "I'll come to your office tomorrow.",
    note: '사무실에 있는 상대방에게 말하는 상황이라면 목적지가 청자의 위치이므로 come을 선택할 수 있습니다.',
  },
  {
    ko: '내일 사무실에 갈 거예요.',
    en: "I'll go to the office tomorrow.",
    note: '단순히 자신의 이동 계획을 설명할 때는 go가 자연스럽습니다.',
  },
  {
    ko: '지금 집에 가고 있어요.',
    en: "I'm going home now.",
    note: '현재 위치에서 집으로 이동하고 있다는 사실 자체를 말할 때 흔히 쓰는 표현입니다.',
  },
  {
    ko: '지금 집으로 가고 있어.',
    en: "I'm coming home now.",
    note: '집에 있는 가족이나 상대방에게 말한다면 그 사람의 위치를 기준점으로 삼아 coming을 쓸 수 있습니다.',
  },
];

const comparisonRows = [
  {
    expression: 'go',
    focus: '현재 기준점에서 다른 곳으로 이동',
    example: 'I have to go to work.',
    translation: '나는 출근해야 해요.',
  },
  {
    expression: 'come',
    focus: '화자·청자 또는 대화의 기준점 쪽으로 이동',
    example: 'Can you come here?',
    translation: '여기로 와 줄래요?',
  },
  {
    expression: 'go home',
    focus: '집으로 이동',
    example: "I'm going home.",
    translation: '나는 집에 가고 있어요.',
  },
  {
    expression: 'come home',
    focus: '집을 대화의 기준점으로 보는 이동',
    example: 'What time are you coming home?',
    translation: '몇 시에 집에 와요?',
  },
];

export default function GoVsComePage() {
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
          <span className="text-slate-700">go와 come</span>
        </nav>

        <header className="border-b border-slate-200 pb-7 md:pb-9">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            go와 come, 한국어의 ‘가다·오다’를
            <br className="hidden md:block" /> 어떻게 구별해서 번역할까?
          </h1>

          <p className="mt-5 max-w-3xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            <strong className="text-slate-900">go = 가다, come = 오다</strong>라고
            외우는 것만으로는 실제 번역을 정확하게 처리하기 어렵습니다.
            영어의 go와 come은 단순한 이동 방향뿐 아니라
            <strong className="text-slate-900">
              {' '}화자, 청자, 목적지와 대화의 기준점
            </strong>
            을 함께 봐야 합니다.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
            번역가 한줄 정리
          </h2>
          <p className="mt-3 leading-7 text-slate-700">
            <strong>go</strong>는 대체로 현재 기준점에서 다른 곳으로 이동하는
            느낌이고, <strong>come</strong>은 화자·청자 또는 대화에서 중심이 되는
            장소 쪽으로 이동하는 느낌입니다. 그래서 한국어 문장에
            <strong> ‘가다’</strong>가 있어도 영어에서는
            <strong> come</strong>이 더 자연스러운 경우가 있습니다.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-extrabold">
            1. 사전 뜻보다 먼저 ‘누구 쪽으로 움직이는가’를 봅니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-blue-600">GO</p>
              <p className="mt-2 text-lg font-bold">
                I&apos;ll go to the office tomorrow.
              </p>
              <p className="mt-1 text-slate-700">
                내일 사무실에 갈 거예요.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                자신의 이동 계획을 객관적으로 말합니다. 목적지를 특별한
                대화의 중심으로 두지 않을 때 자연스럽습니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-emerald-600">COME</p>
              <p className="mt-2 text-lg font-bold">
                I&apos;ll come to your office tomorrow.
              </p>
              <p className="mt-1 text-slate-700">
                내일 당신 사무실로 갈게요.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                사무실에 있는 상대방에게 말한다면 목적지가 청자의 위치가
                됩니다. 한국어는 ‘갈게요’지만 영어는 come이 자연스러울 수
                있습니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            2. go와 come의 핵심 차이
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">표현</th>
                  <th className="px-4 py-3 text-sm font-extrabold">번역 판단</th>
                  <th className="px-4 py-3 text-sm font-extrabold">예문</th>
                  <th className="px-4 py-3 text-sm font-extrabold">한국어</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    key={row.example}
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
            한국어의 ‘가다’를 발견할 때마다 기계적으로 go로 바꾸거나,
            ‘오다’를 발견할 때마다 come으로 바꾸면 문맥을 놓칠 수 있습니다.
            특히 전화나 메시지에서 상대방이 있는 장소로 이동하겠다고 할 때
            한국어의 “지금 갈게”는 영어의 “I&apos;ll come now.” 또는
            “I&apos;m coming.”이 자연스러운 상황이 많습니다.
          </p>

          <p className="mt-4 leading-7 text-slate-700">
            반대로 go를 썼다고 해서 언제나 문법적으로 틀렸다고 판단해서도
            안 됩니다. 두 동사가 모두 가능한 상황에서는
            <strong className="text-slate-900">
              {' '}말하는 사람이 어떤 장소를 대화의 기준점으로 잡고 있는지
            </strong>
            에 따라 뉘앙스가 달라집니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            5. home 앞에는 보통 to를 쓰지 않습니다
          </h2>

          <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-5 md:p-6">
            <p className="font-bold text-slate-900">
              I&apos;m going home. ✓
            </p>
            <p className="mt-2 font-bold text-slate-900">
              I&apos;m coming home. ✓
            </p>
            <p className="mt-4 text-sm md:text-[15px] leading-6 text-slate-600">
              이동을 나타내는 go 또는 come과 함께 쓰이는 home은 일반적으로
              방향을 나타내므로 <strong>go to home</strong>,
              <strong> come to home</strong>처럼 쓰지 않습니다.
              이런 작은 결합 차이도 단어 대 단어 대응만으로는 잡기 어렵습니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            6. X-DIC에서 판단하는 순서
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            한·영 번역에서 go와 come을 선택할 때는 먼저 한국어 표면형이
            ‘가다’인지 ‘오다’인지만 보는 것이 아니라, 문장의 이동 주체와
            목적지, 상대방의 위치, 현재 대화의 중심을 함께 보는 편이
            안전합니다. 그다음 시제와 진행형을 적용하여
            <strong> go / went / going</strong> 또는
            <strong> come / came / coming</strong>을 결정합니다.
          </p>
        </section>

        <aside className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <h2 className="text-lg font-extrabold">
            직접 비교해 볼 검색어
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              '나는 학교에 가요',
              '나는 집에 가고 있어요',
              '여기로 와 주세요',
              '지금 갈게요',
              'I am going home.',
              'I am coming home.',
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
            X-DIC 검색 결과 페이지는 사전·병렬문장·번역 결과를 확인하기 위한
            도구 영역이며, 이 페이지는 표현 선택의 기준과 번역 판단을 설명하는
            편집 콘텐츠입니다.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/about"
              className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-100"
            >
              About X-DIC
            </Link>

            <Link
              href="/data-policy"
              className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
            >
              데이터·편집 원칙
            </Link>
          </div>
        </aside>

        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-lg font-extrabold">
            관련 번역가 해설
          </h2>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/english/in-on-at"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              in · on · at — 장소와 위치의 전치사 선택 →
            </Link>

            <Link
              href="/english/to-vs-for"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              to와 for — 방향·대상·목적의 차이 →
            </Link>

            <Link
              href="/english/tense-translation"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              영어 시제 — 현재·과거·미래 번역 기준 →
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