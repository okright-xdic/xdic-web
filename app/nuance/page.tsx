import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import NuanceClient from './NuanceClient';

// 최초 HTML부터 실제 뉘앙스 게시물 제목/내용이 포함되도록 서버에서 선조회합니다.
export const dynamic = 'force-dynamic';

export default async function NuancePage() {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from('nuances')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[nuance SSR] 초기 데이터 불러오기 실패:', error.message);
  }

  return <NuanceClient initialData={data ?? []} />;
}
