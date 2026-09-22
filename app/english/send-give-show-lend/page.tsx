import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title:
    'send, give, show, lend 차이 | 사람 + 사물 4형식 번역 기준',
  description:
    'send, give, show, lend가 사람 + 사물 구조와 사물 + to + 사람 구조에서 어떻게 쓰이는지 설명합니다. 대명사 어순, lend와 borrow 차이, 부정문·시제·실제 번역 예문까지 함께 정리합니다.',
  alternates: {
    canonical: '/english/send-give-show-lend',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const comparisonRows = [
  {
    expression: 'send + 사람 + 사물',
    focus: '사람에게 사물·문서·메시지를 보내다',
    example: 'Send me the report.',
    translation: '나에게 보고서를 보내 주세요.',
  },
  {
    expression: 'give + 사람 + 사물',
    focus: '사람에게 사물을 주다',
    example: 'Give me the key.',
    translation: '나에게 열쇠를 주세요.',
  },
  {
    expression: 'show + 사람 + 사물',
    focus: '사람에게 사물·정보를 보여 주다',
    example: 'Show me the photo.',
    translation: '나에게 그 사진을 보여 주세요.',
  },
  {
    expression: 'lend + 사람 + 사물',
    focus: '사람에게 사물을 빌려주다',
    example: 'Lend me the book.',
    translation: '나에게 그 책을 빌려 주세요.',
  },
];

const examples = [
  {
    ko: '자료를 보내 주세요.',
    en: 'Please send me the material.',
    note:
      '받는 사람이 문맥에서 명확하면 send + 사람 + 사물 구조가 자연스럽습니다. 자료의 종류가 특정되지 않았다면 material보다 자료의 성격에 따라 file, document, materials 등이 더 적절할 수 있습니다.',
  },
  {
    ko: '계약서를 보내 주세요.',
    en: 'Please send me the contract.',
    note:
      '화자와 청자가 이미 알고 있는 특정 계약서라면 the contract가 자연스럽습니다.',
  },
  {
    ko: '영수증을 다시 보내 주세요.',
    en: 'Please send me the receipt again.',
    note:
      'send + 사람 + 사물 뒤에 again을 두어 재전송 의미를 자연스럽게 만들 수 있습니다.',
  },
  {
    ko: '그는 나에게 열쇠를 줬어요.',
    en: 'He gave me the key.',
    note:
      'give의 과거형은 gave입니다. 사람 목적어 me가 사물 the key보다 먼저 옵니다.',
  },
  {
    ko: '그녀는 나에게 사진을 보여 줬어요.',
    en: 'She showed me the picture.',
    note:
      'show는 사람에게 시각적 정보나 내용을 보여 주는 동사입니다. show me the picture와 show the picture to me가 모두 가능합니다.',
  },
  {
    ko: '우리는 시민들에게 많은 책을 빌려줬어요.',
    en: 'We lent the citizens many books.',
    note:
      'lend는 “빌려주다”입니다. lend + 사람 + 사물 구조를 사용할 수 있고, 과거형과 과거분사는 lent입니다.',
  },
  {
    ko: '그녀는 나에게 보고서를 보내지 않았어요.',
    en: "She didn't send me the report.",
    note:
      '과거 부정은 did not + 동사원형을 사용하므로 sent가 아니라 send가 옵니다.',
  },
  {
    ko: '그가 나에게 그 파일을 보여 줬어요?',
    en: 'Did he show me the file?',
    note:
      '과거 의문문은 Did + 주어 + 동사원형 구조입니다.',
  },
];

const wordOrderRows = [
  {
    type: '사람 먼저',
    en: 'Send me the file.',
    ko: '나에게 그 파일을 보내 주세요.',
  },
  {
    type: '사물 먼저 + to',
    en: 'Send the file to me.',
    ko: '그 파일을 나에게 보내 주세요.',
  },
  {
    type: '사람 먼저',
    en: 'Show her the photo.',
    ko: '그녀에게 그 사진을 보여 주세요.',
  },
  {
    type: '사물 먼저 + to',
    en: 'Show the photo to her.',
    ko: '그 사진을 그녀에게 보여 주세요.',
  },
];

const tenseRows = [
  {
    label: '현재',
    en: 'He gives me the report.',
    ko: '그는 나에게 보고서를 줘요.',
  },
  {
    label: '과거',
    en: 'He gave me the report.',
    ko: '그는 나에게 보고서를 줬어요.',
  },
  {
    label: '미래',
    en: 'He will give me the report.',
    ko: '그는 나에게 보고서를 줄 거예요.',
  },
  {
    label: '현재 부정',
    en: "He doesn't give me the report.",
    ko: '그는 나에게 보고서를 주지 않아요.',
  },
  {
    label: '과거 부정',
    en: "He didn't give me the report.",
    ko: '그는 나에게 보고서를 주지 않았어요.',
  },
];

export default function SendGiveShowLendPage() {
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
            send · give · show · lend
          </span>
        </nav>

        <header className="border-b border-slate-200 pb-7 md:pb-9">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            send, give, show, lend
            <br className="hidden md:block" />
            사람 + 사물 어순을 어떻게 고를까?
          </h1>

          <p className="mt-5 max-w-4xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            한국어에서는 ‘나에게 보고서를 보내다’, ‘그에게 책을 주다’처럼
            조사로 관계를 표시하지만, 영어에서는
            <strong className="text-slate-900"> 사람 + 사물</strong>과
            <strong className="text-slate-900"> 사물 + to + 사람</strong>
            두 구조를 자주 사용합니다. send, give, show, lend는 이 구조를
            공유하지만 의미와 실제 쓰임은 서로 다릅니다.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-extrabold">
            번역가 한줄 정리
          </h2>
          <p className="mt-3 leading-7 text-slate-700">
            <strong>send</strong>는 보내기,
            <strong> give</strong>는 주기,
            <strong> show</strong>는 보여 주기,
            <strong> lend</strong>는 빌려주기입니다. 네 동사는
            <strong> 사람 + 사물</strong> 구조를 자주 취하며,
            필요하면 <strong>사물 + to + 사람</strong> 구조로도 바꿀 수 있습니다.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-extrabold">
            1. 네 동사의 기본 의미
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[880px] text-left">
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
            2. 사람 + 사물과 사물 + to + 사람
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            네 동사는 받는 사람을 먼저 두는 구조와 사물을 먼저 두고
            <strong> to</strong>를 쓰는 구조를 모두 자주 사용합니다.
            문맥과 정보의 초점에 따라 어느 쪽이 더 자연스러운지가 달라질 수 있습니다.
          </p>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">형식</th>
                  <th className="px-4 py-3 text-sm font-extrabold">영어</th>
                  <th className="px-4 py-3 text-sm font-extrabold">한국어</th>
                </tr>
              </thead>
              <tbody>
                {wordOrderRows.map((row, index) => (
                  <tr
                    key={`${row.en}-${index}`}
                    className="border-t border-slate-100"
                  >
                    <td className="px-4 py-4 font-extrabold text-blue-700">
                      {row.type}
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
            3. send — 문서·메시지·물건을 보내다
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 p-5 md:p-6">
            <p className="font-extrabold text-blue-700">
              Please send me the receipt again.
            </p>
            <p className="mt-1 text-slate-700">
              영수증을 다시 보내 주세요.
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              X-DIC에서 자주 테스트한 ‘자료를 보내 주세요’, ‘계약서를 보내 주세요’,
              ‘영수증을 다시 보내 주세요’ 같은 문장은
              <strong> send + 사람 + 사물</strong> 구조로 자연스럽게 만들 수 있습니다.
              특정 문서라면 <strong>the report / the contract / the receipt</strong>
              같은 관사 선택도 함께 봐야 합니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            4. give — 소유나 제공이 상대에게 넘어가다
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 p-5 md:p-6">
            <p className="font-extrabold text-blue-700">
              He gave me the key.
            </p>
            <p className="mt-1 text-slate-700">
              그는 나에게 열쇠를 줬어요.
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              <strong>give</strong>는 가장 기본적인 ‘주다’ 동사입니다.
              과거형은 <strong>gave</strong>, 과거분사는 <strong>given</strong>입니다.
              주는 행위 자체가 중심이며, 문맥에 따라 give the key to me처럼
              사물을 먼저 둘 수도 있습니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            5. show — 사물·정보를 보게 하다
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 p-5 md:p-6">
            <p className="font-extrabold text-blue-700">
              She showed me the picture.
            </p>
            <p className="mt-1 text-slate-700">
              그녀는 나에게 그 사진을 보여 줬어요.
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              <strong>show</strong>는 단순히 사물을 넘겨주는 것이 아니라
              상대가 보거나 알 수 있게 하는 뜻입니다. 화면, 사진, 문서, 위치,
              방법 등을 보여 주는 문장에서 넓게 쓰입니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            6. lend — 빌려주다
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 p-5 md:p-6">
            <p className="font-extrabold text-blue-700">
              We lent the citizens many books.
            </p>
            <p className="mt-1 text-slate-700">
              우리는 시민들에게 많은 책을 빌려줬어요.
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              <strong>lend</strong>는 ‘빌려주다’입니다.
              과거형과 과거분사는 모두 <strong>lent</strong>입니다.
              반대로 ‘빌리다’는 <strong>borrow</strong>이므로
              I borrowed a book from him처럼 방향이 바뀝니다.
            </p>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-orange-200 bg-orange-50/50 p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-extrabold">
            7. lend와 borrow를 바꾸면 뜻이 반대가 됩니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-orange-200 bg-white p-5">
              <p className="font-extrabold">I lent him a book.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                나는 그에게 책 한 권을 빌려줬어요.
              </p>
            </article>
            <article className="rounded-2xl border border-orange-200 bg-white p-5">
              <p className="font-extrabold">I borrowed a book from him.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                나는 그에게서 책 한 권을 빌렸어요.
              </p>
            </article>
          </div>

          <p className="mt-4 leading-7 text-slate-700">
            한국어에서는 ‘빌리다/빌려주다’가 가까워 보이지만 영어에서는
            누가 누구에게 주는 방향인지가 동사 선택에 직접 반영됩니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            8. 대명사와 어순
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold">Send me the file.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                me는 목적격입니다. I가 아니라 me를 씁니다.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold">Show it to me.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                사물이 짧은 대명사 it일 때는 이런 to 구조가 특히 자연스럽습니다.
              </p>
            </article>
          </div>

          <p className="mt-4 leading-7 text-slate-700">
            사람 목적어는 <strong>me / him / her / us / them</strong> 같은
            목적격을 씁니다. 사물과 사람 모두 대명사인 경우에는
            <strong> give it to me</strong>처럼 사물 + to + 사람 구조가
            자연스러운 경우가 많습니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            9. 시제와 부정문
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">형태</th>
                  <th className="px-4 py-3 text-sm font-extrabold">영어</th>
                  <th className="px-4 py-3 text-sm font-extrabold">한국어</th>
                </tr>
              </thead>
              <tbody>
                {tenseRows.map((row) => (
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

          <p className="mt-4 leading-7 text-slate-700">
            과거 부정문에서는 <strong>didn&apos;t gave</strong>가 아니라
            <strong> didn&apos;t give</strong>처럼 조동사 뒤에 동사원형을 씁니다.
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
              <strong>사람 목적어를 주격으로 쓰지 않습니다.</strong>{' '}
              send I the file이 아니라 send me the file입니다.
            </p>
            <p>
              <strong>lend와 borrow의 방향을 혼동하지 않습니다.</strong>{' '}
              lend는 빌려주고, borrow는 빌립니다.
            </p>
            <p>
              <strong>과거 부정문에서 과거형을 중복하지 않습니다.</strong>{' '}
              didn&apos;t sent가 아니라 didn&apos;t send입니다.
            </p>
            <p>
              <strong>관사를 문맥 없이 고정하지 않습니다.</strong>{' '}
              report, contract, receipt가 처음 언급되는지 이미 특정되어 있는지에
              따라 a/the가 달라질 수 있습니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            12. X-DIC에서 판단하는 순서
          </h2>

          <ol className="mt-5 space-y-3 text-slate-700">
            {[
              '문장이 보내다, 주다, 보여 주다, 빌려주다 중 어떤 의미인지 먼저 구별합니다.',
              '받는 사람과 전달되는 사물이 모두 있는지 확인합니다.',
              '사람 목적어를 me, him, her, us, them 같은 목적격으로 만듭니다.',
              '사람 + 사물 구조가 자연스러운지 먼저 확인합니다.',
              '사물을 강조하거나 대명사 어순이 더 자연스러우면 사물 + to + 사람 구조를 검토합니다.',
              '현재·과거·미래·부정·의문문에 맞게 동사 형태를 조정합니다.',
              'report, contract, receipt 같은 명사의 관사를 문맥상 특정성에 맞게 결정합니다.',
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
              '자료를 보내 주세요',
              '계약서를 보내 주세요',
              '영수증을 다시 보내 주세요',
              '그는 나에게 열쇠를 줬어요',
              '그녀는 나에게 사진을 보여 줬어요',
              '우리는 시민들에게 많은 책을 빌려줬어요',
              'Send me the report.',
              'Give me the key.',
              'Show me the photo.',
              'Lend me the book.',
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
            영역입니다. 이 페이지는 사람과 사물의 관계, 어순, 동사 의미 차이를
            설명하는 편집 콘텐츠입니다.
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
              href="/english/ask-tell-require-persuade"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              ask · tell · require · persuade →
            </Link>
            <Link
              href="/english/articles-a-an-the"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              a · an · the →
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
