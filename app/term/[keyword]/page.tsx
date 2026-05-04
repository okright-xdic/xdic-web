import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import SearchPage from '@/components/SearchPage';

type Props = {
  params: { keyword: string };
};

// 🌟 [핵심 수술] SearchInput과 동일한 검색어 보정 마법! (단일 단어 2글자 이상이면 뒤에 공백 추가)
const normalizeQuery = (rawQuery: string) => {
  const trimmed = (rawQuery || '').trim();
  if (!trimmed) return '';
  const isSingleWord = !trimmed.includes(' ');
  if (isSingleWord && trimmed.length >= 2) return trimmed + ' ';
  return trimmed;
};

// 구글 봇이 긁어갈 자동 간판(SEO) - 에러 없는 깔끔한 URL!
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const keyword = decodeURIComponent(params.keyword);

  return {
    title: `${keyword} 영어로 뜻 | 한영/영한 복합어 사전 X-DIC`,
    description: `엑스딕(X-DIC)에서 '${keyword}'의 정확한 영어 표현, 전문 용어, 실생활 예문과 번역가 해설을 확인해보세요.`,
    metadataBase: new URL('https://x-dic.com'), // 👈 불순물 싹 제거했습니다!
    keywords: [keyword, `${keyword} 영어로`, `${keyword} 뜻`, '엑스딕', 'XDIC', '복합어 사전', '전문용어 번역'],
    openGraph: {
      title: `${keyword} 영어로 뜻 | 전문 복합어 X-DIC`,
      description: `'${keyword}' 실무 번역과 예문 뉘앙스 보기.`,
      url: `https://x-dic.com/term/${encodeURIComponent(keyword)}`,
      siteName: 'X-DIC',
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${keyword} 영어로 뜻 | X-DIC`,
      description: `'${keyword}'의 정확한 영단어와 예문을 확인하세요.`,
    },
  };
}

export default async function TermPage({ params }: Props) {
  const originalKeyword = decodeURIComponent(params.keyword);
  const supabase = createServerComponentClient({ cookies });
  
  let safeResults: any[] = [];
  const seenIds = new Set(); // 중복 데이터 방지용 거름망

  const addResults = (items: any[]) => {
    if (!items) return;
    items.forEach((item) => {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        safeResults.push(item);
      }
    });
  };

  const trimmed = originalKeyword.trim();
  const isSingleWord = !trimmed.includes(' ');
  const searchKeyword = (isSingleWord && trimmed.length >= 2) ? trimmed + ' ' : trimmed;

  // 🌟 [핵심 수술 2] 35건을 긁어모으는 '4단계 스마트 폴백 검색 엔진'

  // 1단계: 검색창 입력 보정 검색 (예: "전세보증금 ")
  const { data: r1 } = await supabase.rpc('search_dictionary_v8', { keyword: searchKeyword });
  addResults(r1);

  // 2단계: 결과가 부족하면, 원본 단어 그대로 빡빡하게 검색 (예: "전세보증금")
  if (safeResults.length < 5) {
    const { data: r2 } = await supabase.rpc('search_dictionary_v8', { keyword: trimmed });
    addResults(r2);
  }

  // 3단계: 그래도 부족하면, 띄어쓰기를 완전 제거하고 검색
  if (safeResults.length < 5) {
    const noSpace = trimmed.replace(/\s+/g, '');
    if (noSpace !== trimmed) {
      const { data: r3 } = await supabase.rpc('search_dictionary_v8', { keyword: noSpace });
      addResults(r3);
    }
  }

  // 4단계: 💡[비밀 병기] 35건 폭발의 주역! 복합어 강제 분리 검색 (예: "전세 보증금")
  if (safeResults.length < 5 && isSingleWord && trimmed.length >= 4) {
    const splitKeyword = trimmed.slice(0, 2) + ' ' + trimmed.slice(2);
    const { data: r4 } = await supabase.rpc('search_dictionary_v8', { keyword: splitKeyword });
    addResults(r4);
  }

  return (
    <SearchPage 
      query={originalKeyword} 
      results={safeResults} 
      orangeKeys={[originalKeyword]} 
    />
  );
}