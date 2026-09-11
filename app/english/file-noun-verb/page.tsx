import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title:
    'file 뜻과 번역 | 파일·서류·제출하다·제기하다를 문맥으로 구별하는 기준',
  description:
    "영어 file은 컴퓨터 파일, 서류철·기록을 뜻하는 명사뿐 아니라 complaint, lawsuit, tax return 등을 제출하거나 제기한다는 동사로도 쓰입니다. Open the file, file a complaint, file for bankruptcy 같은 실제 예문으로 의미를 구별합니다.",
  alternates: {
    canonical: '/english/file-noun-verb',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const coreExamples = [
  {
    label: '명사 · 디지털',
    en: 'Open the file.',
    ko: '파일을 여세요.',
    note:
      '컴퓨터·문서 프로그램 문맥에서는 file을 디지털 파일로 해석하는 것이 자연스럽습니다.',
  },
  {
    label: '동사 · 민원/불만',
    en: 'File a complaint.',
    ko: '민원이나 불만을 제기하세요.',
    note:
      'complaint를 목적어로 취하는 file은 “파일”이 아니라 공식적으로 민원·불만을 제기하거나 접수한다는 동사입니다.',
  },
  {
    label: '명사 · 기록',
    en: 'The police checked the case file.',
    ko: '경찰은 사건 기록을 확인했습니다.',
    note:
      'case file은 한 사건에 관한 문서와 기록의 묶음을 뜻하므로 “사건 파일”보다 “사건 기록·서류”가 자연스러울 수 있습니다.',
  },
  {
    label: '동사 · 소송',
    en: 'She filed a lawsuit against the company.',
    ko: '그녀는 그 회사를 상대로 소송을 제기했습니다.',
    note:
      'lawsuit와 함께 쓰인 file은 법원에 정식 절차를 시작한다는 의미이므로 “소송을 제기하다”라고 번역합니다.',
  },
  {
    label: '동사 · 세금 신고',
    en: 'I filed my tax return yesterday.',
    ko: '나는 어제 세금 신고를 했습니다.',
    note:
      'tax return을 file한다고 할 때는 세금 신고서를 제출하거나 세금 신고를 한다는 뜻입니다.',
  },
  {
    label: '동사 · 신청',
    en: 'The company filed for bankruptcy.',
    ko: '그 회사는 파산 신청을 했습니다.',
    note:
      'file for + 법적 절차는 그 절차를 공식적으로 신청한다는 의미가 될 수 있습니다.',
  },
  {
    label: '동사 · 제출',
    en: 'We filed the documents with the court.',
    ko: '우리는 그 서류를 법원에 제출했습니다.',
    note:
      'file + 문서 + with + 기관 구조에서는 해당 기관에 공식 서류를 제출·접수한다는 의미가 강합니다.',
  },
  {
    label: '동사 · 정리/보관',
    en: 'Please file these documents.',
    ko: '이 서류들을 정리해서 보관해 주세요.',
    note:
      '사무실 정리 문맥에서는 file이 서류를 분류해 파일이나 기록 체계에 넣는다는 뜻이 될 수 있습니다.',
  },
];

const nounPatterns = [
  {
    pattern: 'a file',
    meaning: '파일 / 서류철 / 기록 묶음',
    example: 'I opened a file.',
  },
  {
    pattern: 'the file',
    meaning: '그 파일 / 해당 기록',
    example: 'Please send me the file.',
  },
  {
    pattern: 'computer file',
    meaning: '컴퓨터 파일',
    example: 'The computer file is damaged.',
  },
  {
    pattern: 'case file',
    meaning: '사건 기록 / 사건 서류',
    example: 'The lawyer reviewed the case file.',
  },
  {
    pattern: 'personnel file',
    meaning: '인사 기록 / 인사 파일',
    example: 'The document is in her personnel file.',
  },
];

const legalVerbPatterns = [
  {
    pattern: 'file a complaint',
    meaning: '민원·불만을 제기하다',
    example: 'He filed a complaint with the agency.',
  },
  {
    pattern: 'file a lawsuit',
    meaning: '소송을 제기하다',
    example: 'They filed a lawsuit against the company.',
  },
  {
    pattern: 'file a claim',
    meaning: '청구·신청을 제기하다',
    example: 'She filed an insurance claim.',
  },
  {
    pattern: 'file a tax return',
    meaning: '세금 신고서를 제출하다 / 세금 신고하다',
    example: 'You must file a tax return.',
  },
  {
    pattern: 'file an application',
    meaning: '신청서를 제출하다',
    example: 'He filed an application for a permit.',
  },
  {
    pattern: 'file for bankruptcy',
    meaning: '파산을 신청하다',
    example: 'The company filed for bankruptcy.',
  },
];

const contextSignals = [
  {
    signal: 'open / save / download + file',
    judgment: '디지털 파일일 가능성이 높음',
    example: 'Download the file.',
  },
  {
    signal: 'case / personnel + file',
    judgment: '기록·서류 묶음일 가능성이 높음',
    example: 'case file',
  },
  {
    signal: 'file + complaint / lawsuit / claim',
    judgment: '공식적으로 제기·접수하는 동사',
    example: 'file a complaint',
  },
  {
    signal: 'file + document + with + 기관',
    judgment: '기관에 공식 제출·접수하는 의미',
    example: 'file the papers with the court',
  },
  {
    signal: 'file + documents, 사무실 정리 문맥',
    judgment: '분류하여 보관하는 의미일 수 있음',
    example: 'Please file these documents.',
  },
  {
    signal: 'file for + 법적 절차',
    judgment: '공식 신청 의미',
    example: 'file for bankruptcy',
  },
];

const ambiguityExamples = [
  {
    en: 'Please file the report.',
    ko: '보고서를 제출해 주세요 / 보고서를 정리해서 보관해 주세요.',
    point:
      '이 문장만으로는 “제출”과 “보관”이 모두 가능할 수 있습니다. 기관 제출 상황인지 사무실 문서 정리 상황인지 문맥이 필요합니다.',
  },
  {
    en: 'The file is on my desk.',
    ko: '그 파일/서류철은 내 책상 위에 있습니다.',
    point:
      '물리적인 책상이라는 문맥에서는 서류철이나 문서 묶음을 뜻할 가능성이 있지만, 노트북 속 파일을 비유적으로 말하는 상황도 배제할 수 없어 주변 문맥이 중요합니다.',
  },
  {
    en: 'I filed the papers yesterday.',
    ko: '나는 어제 그 서류를 제출했습니다 / 정리해 보관했습니다.',
    point:
      'papers 자체만으로 file의 의미를 하나로 확정하기 어렵습니다. 어디에, 왜, 어떤 절차로 처리했는지가 필요합니다.',
  },
  {
    en: 'The application is on file.',
    ko: '그 신청서는 기록으로 보관되어 있습니다.',
    point:
      'on file은 “파일 위에”가 아니라 공식적으로 기록·보관되어 있다는 관용적인 의미입니다.',
  },
];

const otherMeanings = [
  {
    en: 'She filed her nails.',
    ko: '그녀는 손톱을 갈았습니다.',
    note:
      'file은 줄이나 손톱줄로 표면을 갈아 다듬는 동사로도 쓰입니다. 이 의미는 컴퓨터 파일이나 서류 제출과 전혀 다릅니다.',
  },
  {
    en: 'I need a nail file.',
    ko: '손톱줄이 필요해요.',
    note:
      'nail file에서 file은 손톱을 다듬는 도구인 “손톱줄”을 뜻하는 명사입니다.',
  },
];

export default function FileNounVerbPage() {
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
            file · 파일 / 서류 / 제출하다
          </span>
        </nav>

        <header className="border-b border-slate-200 pb-7 md:pb-9">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            file은 ‘파일’일까, ‘제출하다’일까?
            <br className="hidden md:block" />
            명사·동사와 문맥으로 뜻을 구별하는 기준
          </h1>

          <p className="mt-5 max-w-3xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            영어 <strong className="text-slate-900">file</strong>은
            컴퓨터의 ‘파일’을 뜻할 수도 있고, 사건 기록이나 서류 묶음을
            뜻할 수도 있습니다. 동사로 쓰이면
            <strong className="text-slate-900">
              {' '}
              제출하다, 접수하다, 제기하다, 신청하다, 정리해 보관하다
            </strong>
            처럼 목적어와 상황에 따라 한국어 번역이 달라집니다.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-extrabold">
            번역가 한줄 정리
          </h2>

          <p className="mt-3 leading-7 text-slate-700">
            <strong>Open the file.</strong>에서는 명사 ‘파일’을,
            <strong> File a complaint.</strong>에서는 동사 ‘제기하다’를
            먼저 생각합니다. 그러나 <strong>file documents</strong>처럼
            문맥에 따라 ‘제출하다’와 ‘정리해 보관하다’가 모두 가능한 구조도
            있으므로 <strong>목적어와 기관·장소 표현</strong>까지 함께
            확인해야 합니다.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-extrabold">
            1. Open the file과 File a complaint는 완전히 다릅니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-sm font-extrabold text-blue-600">
                명사 file
              </p>

              <p className="mt-2 text-lg font-bold">
                Open the file.
              </p>

              <p className="mt-1 text-slate-700">
                파일을 여세요.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                the가 file을 한정하고 file이 open의 목적어이므로
                여기서는 명사입니다. 컴퓨터 사용 상황이라면
                ‘파일’이라는 번역이 가장 자연스럽습니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-sm font-extrabold text-emerald-600">
                동사 file
              </p>

              <p className="mt-2 text-lg font-bold">
                File a complaint.
              </p>

              <p className="mt-1 text-slate-700">
                민원이나 불만을 제기하세요.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                file이 명령문의 동사 자리에 있고 complaint를 목적어로
                취하므로 공식적으로 민원·불만을 제기하거나 접수한다는
                의미입니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            2. 실제 문장에서 file의 뜻을 비교해 보기
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
            3. 명사 file은 ‘컴퓨터 파일’만 뜻하지 않습니다
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[820px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    구조
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    가능한 번역
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
            4. 동사 file은 목적어에 따라 한국어가 달라집니다
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    결합
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    자연스러운 번역
                  </th>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    예문
                  </th>
                </tr>
              </thead>

              <tbody>
                {legalVerbPatterns.map((row) => (
                  <tr
                    key={row.pattern}
                    className="border-t border-slate-100 align-top"
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
            5. file documents는 문맥 없이 하나의 뜻으로 고정하면 안 됩니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-orange-100 bg-white p-5">
              <p className="text-sm font-extrabold text-blue-600">
                기관에 제출
              </p>

              <p className="mt-2 font-bold">
                We filed the documents with the court.
              </p>

              <p className="mt-1 text-slate-700">
                우리는 그 서류를 법원에 제출했습니다.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                with the court가 공식적인 제출·접수 대상 기관을
                분명하게 보여 줍니다.
              </p>
            </article>

            <article className="rounded-2xl border border-orange-100 bg-white p-5">
              <p className="text-sm font-extrabold text-emerald-600">
                사무실에서 보관
              </p>

              <p className="mt-2 font-bold">
                Please file these documents.
              </p>

              <p className="mt-1 text-slate-700">
                이 서류들을 정리해서 보관해 주세요.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                문서 정리 업무를 지시하는 상황이라면 서류를 분류해서
                기록 체계나 파일에 넣는다는 뜻이 자연스럽습니다.
              </p>
            </article>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-600">
            따라서 file의 동사 뜻을 결정할 때는
            <strong> 무엇을 file하는지뿐 아니라 어디에, 어떤 목적으로
            처리하는지</strong>까지 확인해야 합니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            6. 주변 단어가 의미를 판별하는 강한 단서입니다
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-extrabold">
                    문맥 단서
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
                {contextSignals.map((row) => (
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
            7. 짧은 문장일수록 여러 해석이 가능할 수 있습니다
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
            8. on file은 ‘파일 위에’가 아닙니다
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
            <p className="font-bold text-blue-700">
              We have your application on file.
            </p>

            <p className="mt-1 text-slate-700">
              귀하의 신청서는 기록으로 보관되어 있습니다.
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              <strong>on file</strong>은 어떤 정보나 문서가 공식 기록으로
              등록·보관되어 있다는 의미입니다. 전치사 on과 명사 file을
              각각 직역해 ‘파일 위에’라고 처리하면 뜻이 달라집니다.
            </p>

            <p className="mt-6 font-bold text-blue-700">
              Your address is on file.
            </p>

            <p className="mt-1 text-slate-700">
              귀하의 주소는 등록되어 있습니다.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            9. file에는 ‘갈아 다듬다’라는 별도의 뜻도 있습니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {otherMeanings.map((item) => (
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
                  {item.note}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-600">
            이런 의미까지 포함하면 file은 단순히 ‘파일’이라는 하나의
            번역어로 고정하기 어려운 대표적인 다의어입니다.
          </p>
        </section>

        <section className="mt-12 rounded-2xl border border-red-100 bg-red-50/40 p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-extrabold">
            10. 자주 생기는 번역 오류
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <p className="font-bold text-emerald-700">
                File a complaint. → 민원·불만을 제기하세요. ✓
              </p>
              <p className="mt-1 text-slate-500">
                File a complaint. → 파일 하나의 불만. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                문장 첫 위치의 file이 complaint를 목적어로 취하는
                동사라는 점을 확인해야 합니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-emerald-700">
                Open the file. → 파일을 여세요. ✓
              </p>
              <p className="mt-1 text-slate-500">
                Open the file. → 제출하세요. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                the file은 open의 목적어이므로 명사입니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-emerald-700">
                She filed a lawsuit. → 그녀는 소송을 제기했습니다. ✓
              </p>
              <p className="mt-1 text-slate-500">
                She filed a lawsuit. → 그녀는 소송을 파일했습니다. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                lawsuit와 결합하는 동사 file은 법률 문맥에 맞는 한국어
                표현으로 번역해야 합니다.
              </p>
            </div>

            <div>
              <p className="font-bold text-emerald-700">
                The application is on file. → 신청서는 기록으로 보관되어 있습니다. ✓
              </p>
              <p className="mt-1 text-slate-500">
                The application is on file. → 신청서는 파일 위에 있습니다. ✗
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                on file 전체를 하나의 표현으로 인식해야 합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            11. X-DIC에서 판단하는 순서
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            file을 만나면 먼저
            <strong> 명사 자리인지 동사 자리인지</strong> 확인합니다.
            명사라면 컴퓨터·문서·사건 기록 중 어떤 문맥인지 살펴보고,
            동사라면
            <strong> complaint, lawsuit, claim, tax return, application,
            documents 같은 목적어</strong>를 확인합니다. 이어서
            <strong> with the court, with the agency, for bankruptcy</strong>
            같은 기관·절차 표현을 살펴 제출·제기·신청 의미를 구별합니다.
            마지막으로 <strong>on file</strong> 같은 고정 표현과
            문서 정리 문맥까지 확인하여 자연스러운 한국어를 선택합니다.
          </p>
        </section>

        <aside className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <h2 className="text-lg font-extrabold">
            직접 비교해 볼 검색어
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              'Open the file.',
              'File a complaint.',
              'Please send me the file.',
              'She filed a lawsuit.',
              'I filed my tax return.',
              'The company filed for bankruptcy.',
              'Please file these documents.',
              'We filed the documents with the court.',
              'The application is on file.',
              'She filed her nails.',
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
            의미를 가질 때 목적어와 문맥으로 뜻을 판별하는 기준을 설명하는
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

            <Link
              href="/english/book-noun-verb"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              book — ‘책·예약하다’ 다의어 번역 기준 →
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