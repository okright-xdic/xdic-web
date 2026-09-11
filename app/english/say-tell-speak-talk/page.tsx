import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'say, tell, speak, talk 차이 | 말하다를 자연스럽게 영어로 번역하는 기준',
  description:
    '한국어의 말하다를 영어로 번역할 때 say, tell, speak, talk를 어떻게 구별하는지 설명합니다. 말의 내용, 듣는 사람, 언어, 대화 상황과 문체를 중심으로 실제 예문과 자주 생기는 오류를 정리합니다.',
  alternates: {
    canonical: '/english/say-tell-speak-talk',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const examples = [
  {
    ko: '그는 미안하다고 말했어요.',
    en: 'He said he was sorry.',
    note: '말한 내용 자체에 초점이 있으므로 say가 자연스럽습니다.',
  },
  {
    ko: '그는 나에게 미안하다고 말했어요.',
    en: 'He told me he was sorry.',
    note: '누구에게 말했는지가 직접 목적어로 나타날 때 tell이 매우 자연스럽습니다.',
  },
  {
    ko: '그녀가 뭐라고 말했어요?',
    en: 'What did she say?',
    note: '말의 내용이 무엇이었는지를 묻는 경우에는 say를 씁니다.',
  },
  {
    ko: '그녀가 당신에게 뭐라고 말했어요?',
    en: 'What did she tell you?',
    note: '듣는 사람인 you가 중요한 문장이므로 tell이 자연스럽습니다.',
  },
  {
    ko: '저는 영어를 할 수 있어요.',
    en: 'I can speak English.',
    note: '어떤 언어를 구사한다는 의미에서는 일반적으로 speak를 사용합니다.',
  },
  {
    ko: '관리자와 이야기하고 싶습니다.',
    en: "I'd like to speak to the manager.",
    note: '공식적이거나 업무적인 상황에서 누군가와 이야기하겠다고 할 때 speak to가 자연스럽습니다.',
  },
  {
    ko: '우리는 그 문제에 대해 이야기했어요.',
    en: 'We talked about the problem.',
    note: '서로 대화를 나누고 특정 주제를 이야기한 상황이므로 talk about을 씁니다.',
  },
  {
    ko: '나중에 이야기하자.',
    en: "Let's talk later.",
    note: '일상적인 대화를 제안하는 자연스러운 표현입니다.',
  },
  {
    ko: '그에게 진실을 말해 주세요.',
    en: 'Please tell him the truth.',
    note: 'tell + 사람 + 내용 구조가 자연스럽습니다. say him the truth라고 하지 않습니다.',
  },
  {
    ko: '그는 나에게 “기다려”라고 말했어요.',
    en: 'He said to me, “Wait.”',
    note: '직접 인용문에서 say 뒤에 듣는 사람을 표시하려면 say to someone 구조를 사용할 수 있습니다.',
  },
];

const comparisonRows = [
  {
    expression: 'say',
    focus: '말한 내용에 초점',
    pattern: 'say + 내용 / say to + 사람',
    example: 'She said hello.',
    translation: '그녀는 인사했어요.',
  },
  {
    expression: 'tell',
    focus: '누구에게 정보를 전달했는지에 초점',
    pattern: 'tell + 사람 + 내용',
    example: 'Tell me the truth.',
    translation: '나에게 진실을 말해 주세요.',
  },
  {
    expression: 'speak',
    focus: '언어 능력 · 비교적 공식적인 말하기',
    pattern: 'speak + 언어 / speak to + 사람',
    example: 'She speaks Korean.',
    translation: '그녀는 한국어를 합니다.',
  },
  {
    expression: 'talk',
    focus: '대화 · 서로 이야기를 나누는 행위',
    pattern: 'talk to/with + 사람 / talk about + 주제',
    example: 'We talked about work.',
    translation: '우리는 일에 대해 이야기했어요.',
  },
];

export default function SayTellSpeakTalkPage() {
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
            say · tell · speak · talk
          </span>
        </nav>

        <header className="border-b border-slate-200 pb-7 md:pb-9">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            say, tell, speak, talk
            <br className="hidden md:block" />
            한국어의 ‘말하다’를 어떻게 번역할까?
          </h1>

          <p className="mt-5 max-w-3xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            한국어에서는 ‘말하다’, ‘이야기하다’가 매우 넓게 쓰이지만
            영어에서는
            <strong className="text-slate-900">
              {' '}무엇을 말했는지, 누구에게 말했는지, 어떤 언어를 쓰는지,
              서로 대화하는 상황인지
            </strong>
            에 따라 say, tell, speak, talk의 선택이 달라집니다.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
            번역가 한줄 정리
          </h2>

          <p className="mt-3 leading-7 text-slate-700">
            <strong>say</strong>는 말한 내용,
            <strong> tell</strong>은 정보를 전달받는 사람,
            <strong> speak</strong>는 언어 능력이나 비교적 공식적인 말하기,
            <strong> talk</strong>는 서로 이야기를 나누는 대화에 초점을 두는
            경우가 많습니다.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-extrabold">
            1. 가장 먼저 ‘내용’과 ‘사람’을 구별합니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-blue-600">
                SAY
              </p>

              <p className="mt-2 text-lg font-bold">
                What did she say?
              </p>

              <p className="mt-1 text-slate-700">
                그녀가 뭐라고 말했어요?
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                중요한 것은 ‘무엇을 말했는가’입니다. 말의 내용에 초점이
                있으므로 say가 자연스럽습니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm">
              <p className="text-sm font-extrabold text-emerald-600">
                TELL
              </p>

              <p className="mt-2 text-lg font-bold">
                What did she tell you?
              </p>

              <p className="mt-1 text-slate-700">
                그녀가 당신에게 뭐라고 말했어요?
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                정보를 전달받은 사람인 you가 직접 나타납니다.
                tell + 사람 구조가 자연스럽습니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            2. say · tell · speak · talk 핵심 비교
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    표현
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    번역 판단
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    기본 구조
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    예문
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    한국어
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

                    <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                      {row.pattern}
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
                Tell me the truth. ✓
              </p>
              <p className="mt-1 text-slate-500">
                Say me the truth. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                tell은 사람을 바로 목적어로 취할 수 있지만, say 뒤에 사람을
                바로 붙이지 않습니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                She said hello to me. ✓
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                say로 듣는 사람을 표시해야 할 때는
                <strong> say something to someone</strong> 구조를 사용할 수
                있습니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                I speak English. ✓
              </p>
              <p className="mt-1 text-slate-500">
                I talk English. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                영어·한국어처럼 언어를 구사한다는 의미에는 일반적으로
                speak를 사용합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            5. speak와 talk는 모두 ‘이야기하다’가 될 수 있습니다
          </h2>

          <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-5 md:p-6">
            <p className="font-bold text-slate-900">
              I need to speak to the manager.
            </p>
            <p className="mt-1 text-slate-700">
              관리자와 이야기해야 합니다.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              업무나 공식적인 요청에서는 speak to가 비교적 자연스럽게
              사용될 수 있습니다.
            </p>

            <p className="mt-6 font-bold text-slate-900">
              I talked with my friend for an hour.
            </p>
            <p className="mt-1 text-slate-700">
              친구와 한 시간 동안 이야기했어요.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              서로 편하게 대화를 주고받는 상황에서는 talk가 자연스럽습니다.
            </p>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              다만 실제 영어에서는 speak와 talk의 사용 영역이 완전히
              분리되는 것은 아닙니다. 문맥과 격식의 정도에 따라 둘 다 가능한
              경우도 있으므로 하나를 무조건 정답으로 고정해서는 안 됩니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            6. tell에는 자주 함께 쓰이는 고정 구조가 있습니다
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ['tell the truth', '진실을 말하다'],
              ['tell a story', '이야기를 들려주다'],
              ['tell a lie', '거짓말을 하다'],
              ['tell someone the time', '누군가에게 시간을 알려주다'],
              ['tell someone to wait', '누군가에게 기다리라고 말하다'],
              ['tell the difference', '차이를 구별하다'],
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

          <p className="mt-4 text-sm md:text-[15px] leading-6 text-slate-600">
            동사의 사전 뜻뿐 아니라 어떤 명사나 문형과 자연스럽게 결합하는지도
            실제 번역에서는 중요합니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            7. X-DIC에서 판단하는 순서
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            한국어의 ‘말하다’를 번역할 때 먼저
            <strong> 말의 내용</strong>이 중심인지,
            <strong> 듣는 사람</strong>이 직접 나타나는지,
            <strong> 언어 능력</strong>을 말하는지,
            <strong> 서로 대화를 나누는 상황</strong>인지를 구별합니다.
            이후 목적어 구조와 전치사, 문체와 상황을 확인하여
            <strong> say / tell / speak / talk</strong> 가운데 자연스러운
            표현을 선택합니다.
          </p>
        </section>

        <aside className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <h2 className="text-lg font-extrabold">
            직접 비교해 볼 검색어
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              '그는 미안하다고 말했어요',
              '그는 나에게 진실을 말했어요',
              '영어를 할 수 있어요',
              '관리자와 이야기하고 싶어요',
              'What did she say?',
              'Tell me the truth.',
              'I speak English.',
              'We talked about the problem.',
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
            영역입니다. 이 페이지는 여러 영어 동사 가운데 어떤 표현을
            선택할 것인지 번역 관점에서 설명하는 편집 콘텐츠입니다.
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