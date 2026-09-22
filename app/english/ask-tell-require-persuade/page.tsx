import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title:
    'ask, tell, require, persuade 차이 | 사람 + to부정사 번역 기준',
  description:
    '한국어의 부탁하다·말하다·요구하다·설득하다를 영어로 옮길 때 ask, tell, require, persuade + 사람 + to부정사를 어떻게 구별하는지 설명합니다. 목적격, 부정문, 시제, 의문문과 실제 번역 예문을 함께 정리합니다.',
  alternates: {
    canonical: '/english/ask-tell-require-persuade',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const comparisonRows = [
  {
    expression: 'ask + 사람 + to V',
    focus: '상대에게 어떤 행동을 부탁하거나 요청하다',
    example: 'She asked me to wait.',
    translation: '그녀는 나에게 기다려 달라고 부탁했어요.',
  },
  {
    expression: 'tell + 사람 + to V',
    focus: '상대에게 어떤 행동을 하라고 지시하거나 말하다',
    example: 'She told me to wait.',
    translation: '그녀는 나에게 기다리라고 말했어요.',
  },
  {
    expression: 'require + 사람 + to V',
    focus: '규정·조건·절차상 어떤 행동을 요구하다',
    example: 'The company requires staff to wear ID cards.',
    translation: '회사는 직원들에게 신분증을 착용하도록 요구합니다.',
  },
  {
    expression: 'persuade + 사람 + to V',
    focus: '상대가 실제로 행동하도록 설득하다',
    example: 'She persuaded me to apply.',
    translation: '그녀는 내가 지원하도록 설득했어요.',
  },
];

const examples = [
  {
    ko: '그는 나에게 보고서를 제출해 달라고 부탁해요.',
    en: 'He asks me to submit the report.',
    note:
      '부탁이나 요청의 의미가 중심이므로 ask + 사람 + to부정사 구조가 자연스럽습니다.',
  },
  {
    ko: '그는 나에게 보고서를 제출하라고 말해요.',
    en: 'He tells me to submit the report.',
    note:
      '행동을 하도록 직접 지시하거나 말하는 의미이므로 tell + 사람 + to부정사를 씁니다.',
  },
  {
    ko: '회사는 직원에게 보고서를 제출하도록 요구해요.',
    en: 'The company requires the employee to submit the report.',
    note:
      '규정이나 절차처럼 공식적인 요구라면 require가 잘 맞습니다.',
  },
  {
    ko: '그는 나에게 보고서를 제출하도록 설득해요.',
    en: 'He persuades me to submit the report.',
    note:
      '상대가 그 행동을 하도록 설득하는 의미입니다. 현재형은 반복적이거나 일반적인 상황에서 특히 자연스럽습니다.',
  },
  {
    ko: '그녀는 나에게 일찍 도착해 달라고 부탁했어요.',
    en: 'She asked me to arrive early.',
    note:
      'ask의 과거형은 asked입니다. 목적어 me 뒤에는 to + 동사원형이 이어집니다.',
  },
  {
    ko: '그는 나에게 밖에 나가라고 말했어요.',
    en: 'He told me to go outside.',
    note:
      'tell의 과거형은 told입니다. tell은 이 구조에서 듣는 사람을 목적어로 직접 취합니다.',
  },
  {
    ko: '규정은 방문객에게 신분증을 제시하도록 요구합니다.',
    en: 'The rule requires visitors to show identification.',
    note:
      '개인의 감정적 요구라기보다 규정·조건이 요구하는 상황에서는 require가 자연스럽습니다.',
  },
  {
    ko: '그녀는 그가 계획을 바꾸도록 설득했어요.',
    en: 'She persuaded him to change the plan.',
    note:
      'persuade는 보통 설득의 결과로 상대가 행동하게 되었다는 뉘앙스를 포함합니다.',
  },
];

const pronounRows = [
  { subject: 'I', object: 'me', example: 'She asked me to wait.' },
  { subject: 'he', object: 'him', example: 'I told him to call.' },
  { subject: 'she', object: 'her', example: 'They persuaded her to stay.' },
  { subject: 'we', object: 'us', example: 'The rule requires us to register.' },
  { subject: 'they', object: 'them', example: 'She asked them to leave.' },
];

export default function AskTellRequirePersuadePage() {
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
            ask · tell · require · persuade
          </span>
        </nav>

        <header className="border-b border-slate-200 pb-7 md:pb-9">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            ask, tell, require, persuade
            <br className="hidden md:block" />
            사람 + to부정사를 어떻게 구별할까?
          </h1>

          <p className="mt-5 max-w-4xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            한국어에서는 ‘부탁하다’, ‘말하다’, ‘요구하다’, ‘설득하다’가
            모두 뒤에 사람과 행동을 이어 받을 수 있습니다. 영어에서도 네 동사
            모두 <strong className="text-slate-900">사람 + to + 동사원형</strong>
            구조를 취할 수 있지만, 문장이 나타내는 관계는 서로 다릅니다.
            부탁인지, 지시인지, 규정상 요구인지, 실제 행동을 이끌어 낸
            설득인지 먼저 구별해야 합니다.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-extrabold">
            번역가 한줄 정리
          </h2>
          <p className="mt-3 leading-7 text-slate-700">
            <strong>ask</strong>는 부탁·요청,
            <strong> tell</strong>은 지시·전달,
            <strong> require</strong>는 규정이나 조건에 따른 요구,
            <strong> persuade</strong>는 상대가 실제 행동하도록 설득하는
            의미가 중심입니다. 네 동사가 같은 문형에 들어간다고 해서 서로
            바꾸어 쓸 수 있는 것은 아닙니다.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-extrabold">
            1. 구조는 비슷하지만 의미 관계가 다릅니다
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[840px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">구조</th>
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
            2. ask — 부탁하거나 요청할 때
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 p-5 md:p-6">
            <p className="font-extrabold text-blue-700">
              She asked me to wait.
            </p>
            <p className="mt-1 text-slate-700">
              그녀는 나에게 기다려 달라고 부탁했어요.
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              <strong>ask + 사람 + to V</strong>는 상대에게 어떤 행동을
              해 달라고 요청하는 구조입니다. 명령의 강도보다 부탁이나 요청의
              의미가 중심입니다. 한국어의 ‘~해 달라고 부탁하다’, ‘~하도록
              요청하다’에 자주 대응합니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            3. tell — 하라고 지시하거나 말할 때
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 p-5 md:p-6">
            <p className="font-extrabold text-blue-700">
              She told me to wait.
            </p>
            <p className="mt-1 text-slate-700">
              그녀는 나에게 기다리라고 말했어요.
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              <strong>tell + 사람 + to V</strong>는 듣는 사람에게 어떤
              행동을 하라고 지시하거나 전달할 때 씁니다. 단순히 ‘말하다’라는
              한국어만 보고 <strong>say</strong>를 고르면 안 됩니다.
              <strong> say</strong>는 보통 이 구조에서 사람 목적어를 바로
              두지 않습니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            4. require — 규정·조건·절차상 요구할 때
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 p-5 md:p-6">
            <p className="font-extrabold text-blue-700">
              The company requires employees to wear ID cards.
            </p>
            <p className="mt-1 text-slate-700">
              회사는 직원들에게 신분증을 착용하도록 요구합니다.
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              <strong>require</strong>는 개인적인 부탁보다 규정, 절차,
              자격 조건, 업무상 의무처럼 공식적인 요구를 나타낼 때 특히
              자연스럽습니다. 한국어의 ‘요구하다’가 언제나 require가 되는 것은
              아닙니다. 감정적으로 강하게 요구하거나 주장하는 상황이라면
              문맥에 따라 다른 구조가 더 적절할 수 있습니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            5. persuade — 상대가 실제로 행동하도록 설득할 때
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 p-5 md:p-6">
            <p className="font-extrabold text-blue-700">
              She persuaded him to change the plan.
            </p>
            <p className="mt-1 text-slate-700">
              그녀는 그가 계획을 바꾸도록 설득했어요.
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              <strong>persuade + 사람 + to V</strong>는 단순히 설득을
              시도했다는 뜻보다, 설득이 효과를 내어 상대가 그 행동을 하게
              되었다는 뉘앙스를 자주 포함합니다. 성공 여부가 아직 정해지지
              않았다면 <strong>try to persuade</strong>처럼 표현하는 것이
              더 정확할 수 있습니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            6. 사람 목적어는 목적격을 씁니다
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            네 동사 뒤의 사람은 문장의 목적어이므로 인칭대명사를 쓸 때
            <strong> I / he / she / we / they</strong>가 아니라
            <strong> me / him / her / us / them</strong>을 씁니다.
          </p>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">주격</th>
                  <th className="px-4 py-3 text-sm font-extrabold">목적격</th>
                  <th className="px-4 py-3 text-sm font-extrabold">예문</th>
                </tr>
              </thead>
              <tbody>
                {pronounRows.map((row) => (
                  <tr
                    key={row.subject}
                    className="border-t border-slate-100"
                  >
                    <td className="px-4 py-3 text-sm">{row.subject}</td>
                    <td className="px-4 py-3 text-sm font-extrabold text-blue-700">
                      {row.object}
                    </td>
                    <td className="px-4 py-3 text-sm">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            7. 부정은 두 위치를 구별해야 합니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold">He didn&apos;t tell me to leave.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                ‘말하지 않았다’처럼 주동사 자체를 부정합니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold">He told me not to leave.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                ‘떠나지 말라고 말했다’처럼 뒤의 행동을 부정합니다.
              </p>
            </article>
          </div>

          <p className="mt-4 leading-7 text-slate-700">
            이 차이는 ask, require, persuade에서도 중요합니다.
            <strong> ask me not to go</strong>와
            <strong> didn&apos;t ask me to go</strong>는 서로 다른 뜻입니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            8. 현재·과거·미래와 의문문
          </h2>

          <div className="mt-5 space-y-3">
            {[
              ['현재', 'He tells me to wait.', '그는 나에게 기다리라고 말해요.'],
              ['과거', 'He told me to wait.', '그는 나에게 기다리라고 말했어요.'],
              ['미래', 'He will tell me to wait.', '그는 나에게 기다리라고 말할 거예요.'],
              ['의문', 'Did he tell me to wait?', '그는 나에게 기다리라고 말했어요?'],
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

          <p className="mt-4 leading-7 text-slate-700">
            현재 단순형 의문문인 <strong>Does he persuade me to ...?</strong>
            는 문법적으로 가능하지만, 한 번의 구체적인 설득 사건보다 반복적이거나
            일반적인 행동을 묻는 느낌이 강할 수 있습니다. 특정한 과거 사건이라면
            <strong> Did he persuade ...?</strong>가 더 자연스러운 경우가 많습니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            9. a report와 the report는 문맥에 따라 달라집니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold">submit a report</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                처음 언급되는 보고서 하나를 제출한다는 의미가 자연스럽습니다.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold">submit the report</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                화자와 청자가 이미 알고 있는 특정 보고서를 가리킬 때 자연스럽습니다.
              </p>
            </article>
          </div>

          <p className="mt-4 leading-7 text-slate-700">
            따라서 한국어의 ‘보고서를 제출하도록’만 보고 관사를 하나로 고정하면
            안 됩니다. 문맥상 특정성이 있는지 함께 확인해야 합니다.
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
              <strong>ask와 tell을 모두 ‘말하다’로 처리하지 않습니다.</strong>{' '}
              부탁인지 지시인지에 따라 의미가 달라집니다.
            </p>
            <p>
              <strong>require를 모든 ‘요구하다’에 기계적으로 쓰지 않습니다.</strong>{' '}
              규정이나 의무의 성격이 있는지 먼저 봅니다.
            </p>
            <p>
              <strong>persuade를 단순한 설득 시도와 동일시하지 않습니다.</strong>{' '}
              실제로 상대의 행동을 이끌어 냈는지가 중요한 단서가 될 수 있습니다.
            </p>
            <p>
              <strong>사람 목적어 뒤에는 동사원형이 아니라 to + 동사원형이 옵니다.</strong>{' '}
              tell me submit이 아니라 tell me to submit입니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            12. X-DIC에서 판단하는 순서
          </h2>

          <ol className="mt-5 space-y-3 text-slate-700">
            {[
              '한국어 문장이 부탁, 지시, 공식적 요구, 설득 중 무엇을 나타내는지 먼저 확인합니다.',
              '동사 뒤에 행동의 주체가 되는 사람 목적어가 있는지 확인합니다.',
              '그 사람 목적어를 me, him, her, us, them 같은 목적격으로 만듭니다.',
              '사람 뒤에 to + 동사원형 구조를 붙입니다.',
              '현재·과거·미래·부정·의문문에 맞게 주동사의 형태를 바꿉니다.',
              '보고서·계약서 같은 명사의 a/the 여부를 문맥상 특정성에 맞게 결정합니다.',
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
              '그는 나에게 기다리라고 말해요',
              '그녀는 나에게 기다려 달라고 부탁해요',
              '그는 나에게 보고서를 제출하도록 요구해요',
              '그는 나에게 보고서를 제출하도록 설득해요',
              'She asked me to wait.',
              'He told me to leave.',
              'They required us to register.',
              'She persuaded him to apply.',
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
            영역입니다. 이 페이지는 같은 문형 안에서 동사의 의미 차이와 번역
            판단 기준을 설명하는 편집 콘텐츠입니다.
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
              href="/english/say-tell-speak-talk"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              say · tell · speak · talk →
            </Link>
            <Link
              href="/english/dont-do-not-doesnt"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              don&apos;t · do not · doesn&apos;t →
            </Link>
            <Link
              href="/english/tense-translation"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              현재 · 과거 · 미래 →
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
