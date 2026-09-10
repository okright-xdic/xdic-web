import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title:
    'plant 뜻과 번역 | 식물·공장·설비·심다를 문맥으로 구별하는 기준',
  description:
    "영어 plant는 식물을 뜻하는 명사, 공장·산업시설·설비를 뜻하는 명사, 나무·씨앗을 심는다는 동사로 쓰입니다. The plant is large, Plant a tree, power plant 같은 예문으로 문맥에 따른 번역 기준을 설명합니다.",
  alternates: {
    canonical: '/english/plant-noun-verb',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const coreExamples = [
  {
    label: '명사 · 식물',
    en: 'The plant needs more sunlight.',
    ko: '그 식물은 햇빛이 더 필요합니다.',
    note:
      '햇빛, 물, 잎, 뿌리, 성장처럼 생물과 관련된 문맥에서는 plant를 식물로 해석합니다.',
  },
  {
    label: '동사 · 심다',
    en: 'Plant a tree.',
    ko: '나무 한 그루를 심으세요.',
    note:
      '문장 첫머리의 plant가 tree를 목적어로 취하는 명령문이므로 여기서는 “심다”라는 동사입니다.',
  },
  {
    label: '명사 · 발전소',
    en: 'The power plant supplies electricity to the city.',
    ko: '그 발전소는 도시에 전기를 공급합니다.',
    note:
      'power plant는 전력을 생산하는 산업시설이므로 “발전소”라고 번역하는 것이 자연스럽습니다.',
  },
  {
    label: '명사 · 생산 공장',
    en: 'The company opened a new manufacturing plant.',
    ko: '그 회사는 새로운 생산 공장을 열었습니다.',
    note:
      'manufacturing plant에서 plant는 식물이 아니라 제품을 생산하는 공장·산업시설을 뜻합니다.',
  },
  {
    label: '명사 · 화학 공장',
    en: 'The chemical plant is outside the city.',
    ko: '그 화학 공장은 도시 외곽에 있습니다.',
    note:
      'chemical, industrial, manufacturing 같은 단어가 plant를 수식하면 산업시설 의미가 강해집니다.',
  },
  {
    label: '동사 · 씨앗을 심다',
    en: 'Plant the seeds two centimeters deep.',
    ko: '씨앗을 2센티미터 깊이로 심으세요.',
    note:
      'seed를 목적어로 취하면 plant는 땅에 씨앗을 심는다는 기본적인 동사 의미로 쓰입니다.',
  },
  {
    label: '동사 · 꽃을 심다',
    en: 'They planted flowers along the road.',
    ko: '그들은 길가에 꽃을 심었습니다.',
    note:
      'flowers가 목적어이고 장소 표현이 이어지므로 식물을 땅에 심는 동작입니다.',
  },
  {
    label: '명사 · 모호한 문장',
    en: 'The plant is large.',
    ko: '그 식물은 큽니다 / 그 공장은 큽니다.',
    note:
      'plant 앞뒤에 의미를 확정할 단서가 없으면 식물과 산업시설 두 해석이 모두 가능합니다.',
  },
];

const nounPatterns = [
  {
    pattern: 'a plant',
    meaning: '식물 / 공장·시설',
    example: 'This is a rare plant.',
  },
  {
    pattern: 'potted plant',
    meaning: '화분 식물',
    example: 'She bought a potted plant.',
  },
  {
    pattern: 'native plant',
    meaning: '토종 식물 / 자생 식물',
    example: 'This is a native plant.',
  },
  {
    pattern: 'power plant',
    meaning: '발전소',
    example: 'The power plant generates electricity.',
  },
  {
    pattern: 'chemical plant',
    meaning: '화학 공장',
    example: 'He works at a chemical plant.',
  },
  {
    pattern: 'manufacturing plant',
    meaning: '생산 공장 / 제조 시설',
    example: 'The company built a manufacturing plant.',
  },
  {
    pattern: 'treatment plant',
    meaning: '처리 시설',
    example: 'The city operates a water treatment plant.',
  },
];

const verbPatterns = [
  {
    pattern: 'plant a tree',
    meaning: '나무를 심다',
    example: 'We planted a tree in the garden.',
  },
  {
    pattern: 'plant seeds',
    meaning: '씨앗을 심다',
    example: 'Plant the seeds in spring.',
  },
  {
    pattern: 'plant flowers',
    meaning: '꽃을 심다',
    example: 'She planted flowers by the window.',
  },
  {
    pattern: 'plant crops',
    meaning: '농작물을 심다',
    example: 'Farmers plant crops in the field.',
  },
  {
    pattern: 'plant an idea',
    meaning: '생각을 심어 주다 / 생각이 떠오르게 하다',
    example: 'The conversation planted an idea in my mind.',
  },
  {
    pattern: 'plant evidence',
    meaning: '증거를 몰래 갖다 놓다 / 증거를 심다',
    example: 'Someone planted evidence at the scene.',
  },
];

const contextSignals = [
  {
    signal: 'leaf / root / flower / sunlight / water',
    judgment: '식물 의미 가능성이 높음',
    example: 'The plant needs water.',
  },
  {
    signal: 'power / chemical / manufacturing + plant',
    judgment: '산업시설·공장 의미',
    example: 'power plant',
  },
  {
    signal: 'plant + tree / seed / flower / crop',
    judgment: '“심다”라는 동사 의미',
    example: 'plant a tree',
  },
  {
    signal: 'work at / operate / build + plant',
    judgment: '공장·산업시설 의미가 강함',
    example: 'work at a plant',
  },
  {
    signal: 'grow / bloom / die + plant',
    judgment: '식물 의미가 강함',
    example: 'The plant is growing.',
  },
  {
    signal: 'plant + idea / evidence',
    judgment: '비유적·확장된 동사 의미',
    example: 'plant an idea',
  },
];

const ambiguousExamples = [
  {
    en: 'The plant is large.',
    ko: '그 식물은 큽니다 / 그 공장은 큽니다.',
    point:
      'large만으로는 plant의 의미를 확정할 수 없습니다. 앞뒤 문장에서 정원 이야기인지 산업시설 이야기인지 확인해야 합니다.',
  },
  {
    en: 'They visited the plant yesterday.',
    ko: '그들은 어제 그 공장을 방문했습니다 / 그 식물을 보러 갔습니다.',
    point:
      'visit의 목적어가 되었다는 사실만으로는 plant가 반드시 공장이라고 단정할 수 없습니다. 다만 기업·산업 문맥에서는 공장 의미가 훨씬 자연스러울 수 있습니다.',
  },
  {
    en: 'The plant is growing quickly.',
    ko: '그 식물은 빠르게 자라고 있습니다.',
    point:
      'grow가 생물의 성장 의미로 사용되면 식물 해석이 매우 강해집니다. 산업시설 규모가 확대된다는 별도 문맥이 없다면 식물로 보는 것이 자연스럽습니다.',
  },
  {
    en: 'The plant employs 500 workers.',
    ko: '그 공장은 직원 500명을 고용하고 있습니다.',
    point:
      '근로자를 고용한다는 의미는 식물과 맞지 않으므로 plant가 공장·산업시설이라는 강한 문맥 단서가 됩니다.',
  },
];

const facilityExamples = [
  {
    term: 'power plant',
    ko: '발전소',
    note:
      '전기를 생산하는 시설입니다. “전력 공장”처럼 문자 그대로 옮기기보다 한국어 관용 명칭인 “발전소”를 사용합니다.',
  },
  {
    term: 'water treatment plant',
    ko: '정수 처리 시설 / 수처리 시설',
    note:
      'plant를 무조건 “공장”이라고 번역하면 부자연스러울 수 있습니다. 시설의 기능에 맞게 “처리 시설”로 번역합니다.',
  },
  {
    term: 'manufacturing plant',
    ko: '제조 공장 / 생산 공장',
    note:
      '제품을 생산하는 산업시설이므로 일반적인 한국어에서는 “공장”이 자연스럽습니다.',
  },
  {
    term: 'industrial plant',
    ko: '산업시설 / 공장',
    note:
      '구체적인 산업 분야와 문맥에 따라 “산업시설”, “공장”, 때로는 기술 분야의 “플랜트”가 적절할 수 있습니다.',
  },
];

const equipmentExamples = [
  {
    en: 'The company invested in new plant and machinery.',
    ko: '그 회사는 새로운 설비와 기계에 투자했습니다.',
    note:
      '산업·회계 문맥에서 plant는 생산에 사용되는 설비나 고정시설을 가리킬 수 있습니다.',
  },
  {
    en: 'The plant equipment requires regular maintenance.',
    ko: '공장 설비는 정기적인 유지보수가 필요합니다.',
    note:
      'plant가 equipment를 수식하면 “공장의”, “산업시설의”라는 관계로 해석할 수 있습니다.',
  },
];

const errorExamples = [
  {
    good: 'Plant a tree. → 나무 한 그루를 심으세요. ✓',
    bad: 'Plant a tree. → 식물 한 그루의 나무. ✗',
    reason:
      '명령문에서 plant가 tree를 목적어로 취하는 동사라는 점을 먼저 확인해야 합니다.',
  },
  {
    good: 'The power plant is large. → 그 발전소는 큽니다. ✓',
    bad: 'The power plant is large. → 그 전력 식물은 큽니다. ✗',
    reason:
      'power plant는 하나의 산업시설 개념으로 판단해야 합니다.',
  },
  {
    good: 'The plant needs water. → 그 식물은 물이 필요합니다. ✓',
    bad: 'The plant needs water. → 그 공장은 물이 필요합니다. △',
    reason:
      '공장도 물을 사용할 수 있으므로 문법적으로 불가능한 해석은 아니지만, 일반적인 일상 문맥에서는 식물이 더 자연스러울 가능성이 높습니다.',
  },
  {
    good: 'The plant employs 500 workers. → 그 공장은 직원 500명을 고용합니다. ✓',
    bad: 'The plant employs 500 workers. → 그 식물은 직원 500명을 고용합니다. ✗',
    reason:
      'employ와 workers라는 의미 관계가 산업시설 해석을 강하게 결정합니다.',
  },
];

export default function PlantNounVerbPage() {
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
            plant · 식물 / 공장 / 심다
          </span>
        </nav>

        <header className="border-b border-slate-200 pb-7 md:pb-9">
          <p className="text-sm font-extrabold text-blue-600 mb-2">
            X-DIC 번역가 해설 · Translation Notes
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            plant는 ‘식물’일까, ‘공장’일까, ‘심다’일까?
            <br className="hidden md:block" />
            품사와 문맥으로 뜻을 구별하는 기준
          </h1>

          <p className="mt-5 max-w-3xl text-[15px] md:text-[17px] leading-7 text-slate-600">
            영어 <strong className="text-slate-900">plant</strong>는
            일상적인 ‘식물’을 뜻할 수도 있고,
            <strong className="text-slate-900">
              {' '}
              발전소·공장·산업시설
            </strong>
            을 뜻할 수도 있습니다. 동사로 쓰이면 나무·꽃·씨앗을
            <strong className="text-slate-900"> 심다</strong>라는 뜻이
            됩니다. 따라서 단어 하나만 보는 것이 아니라 품사와 주변
            단어를 함께 확인해야 합니다.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-extrabold">
            번역가 한줄 정리
          </h2>

          <p className="mt-3 leading-7 text-slate-700">
            <strong>The plant is large.</strong>는 문맥이 없으면
            ‘그 식물은 크다’와 ‘그 공장은 크다’가 모두 가능하지만,
            <strong> Plant a tree.</strong>에서는 plant가 명령문의
            동사이므로 ‘나무를 심다’가 됩니다. 특히
            <strong> power plant, chemical plant</strong>처럼 앞 단어와
            결합하면 산업시설 의미를 먼저 확인해야 합니다.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-extrabold">
            1. The plant is large와 Plant a tree는 구조부터 다릅니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-sm font-extrabold text-blue-600">
                명사 plant
              </p>

              <p className="mt-2 text-lg font-bold">
                The plant is large.
              </p>

              <p className="mt-1 text-slate-700">
                그 식물은 큽니다 / 그 공장은 큽니다.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                the가 plant를 한정하고 plant가 문장의 주어이므로
                명사입니다. 하지만 명사라는 사실만으로 ‘식물’과
                ‘공장’을 결정할 수는 없습니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-sm font-extrabold text-emerald-600">
                동사 plant
              </p>

              <p className="mt-2 text-lg font-bold">
                Plant a tree.
              </p>

              <p className="mt-1 text-slate-700">
                나무 한 그루를 심으세요.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                문장 첫머리에서 plant가 tree를 목적어로 취하는
                명령문이므로 동사 ‘심다’입니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            2. 실제 문장에서 plant의 뜻을 비교해 보기
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
            3. 명사 plant는 ‘식물’과 ‘산업시설’을 모두 나타냅니다
          </h2>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[850px] text-left">
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
            4. 동사 plant는 무엇을 심는지 보면 쉽게 판단할 수 있습니다
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
                {verbPatterns.map((row) => (
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
            5. power plant의 plant를 ‘식물’이나 단순한 ‘공장’으로 옮기면 안 됩니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {facilityExamples.map((item) => (
              <article
                key={item.term}
                className="rounded-2xl border border-orange-100 bg-white p-5"
              >
                <p className="font-extrabold text-blue-700">
                  {item.term}
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  → {item.ko}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.note}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-600">
            한국어 번역에서는 영어 단어 plant 자체보다
            <strong> 그 시설이 실제로 무슨 기능을 하는지</strong>를
            반영하는 것이 중요합니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            6. 주변 단어가 plant의 뜻을 결정하는 강한 단서입니다
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
            7. The plant is large처럼 짧은 문장은 문맥이 필요합니다
          </h2>

          <div className="mt-5 space-y-4">
            {ambiguousExamples.map((item) => (
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
            8. 산업·회계 문맥에서는 plant가 ‘설비’를 뜻하기도 합니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {equipmentExamples.map((item) => (
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
            이런 경우 plant를 무조건 ‘식물’ 또는 ‘공장’으로 번역하지 않고
            <strong> 설비, 시설, 기계류</strong>처럼 전문 분야에 맞는
            표현을 검토해야 합니다.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            9. plant는 비유적으로도 사용됩니다
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold text-blue-700">
                The conversation planted an idea in my mind.
              </p>

              <p className="mt-1 text-slate-700">
                그 대화는 내 마음속에 하나의 생각을 심어 주었습니다.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                idea를 실제 땅에 심는 것은 아니므로 여기서는
                생각이나 가능성을 마음속에 생기게 한다는 비유적인
                표현입니다.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-5">
              <p className="font-extrabold text-blue-700">
                Someone planted evidence at the scene.
              </p>

              <p className="mt-1 text-slate-700">
                누군가 현장에 증거를 몰래 갖다 놓았습니다.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                이 경우 plant는 어떤 물건을 특정 장소에 몰래 두어
                원래부터 있었던 것처럼 보이게 한다는 확장된 의미입니다.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-red-100 bg-red-50/40 p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-extrabold">
            10. 자주 생기는 번역 오류
          </h2>

          <div className="mt-5 space-y-5">
            {errorExamples.map((item) => (
              <div key={item.good}>
                <p className="font-bold text-emerald-700">
                  {item.good}
                </p>

                <p className="mt-1 text-slate-500">
                  {item.bad}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-extrabold">
            11. X-DIC에서 판단하는 순서
          </h2>

          <p className="mt-4 leading-7 text-slate-700">
            plant를 만나면 먼저
            <strong> 명사 자리인지 동사 자리인지</strong> 확인합니다.
            동사라면 tree, seed, flower, crop 같은 목적어를 보고
            ‘심다’ 의미를 우선 판단합니다. 명사라면
            <strong> sunlight, leaf, water, grow</strong> 같은 생물 문맥과
            <strong> power, chemical, manufacturing, workers,
            electricity</strong> 같은 산업 문맥을 비교합니다.
            이어서 power plant, treatment plant처럼
            <strong> 여러 단어가 하나의 시설 개념을 만드는 표현</strong>
            을 확인하고, 전문 분야에서는 설비·시설이라는 번역 가능성까지
            검토합니다.
          </p>
        </section>

        <aside className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <h2 className="text-lg font-extrabold">
            직접 비교해 볼 검색어
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              'The plant is large.',
              'Plant a tree.',
              'The plant needs water.',
              'The power plant is large.',
              'The plant employs 500 workers.',
              'The chemical plant is outside the city.',
              'Plant the seeds in spring.',
              'They planted flowers along the road.',
              'The company opened a manufacturing plant.',
              'The city operates a water treatment plant.',
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
            도구 영역입니다. 이 페이지는 하나의 영어 표제어가 품사와
            문맥에 따라 서로 다른 한국어 의미로 바뀌는 과정을 설명하는
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

            <Link
              href="/english/file-noun-verb"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              file — ‘파일·제출하다’ 다의어 번역 기준 →
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