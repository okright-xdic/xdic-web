import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import ConversationClient from './ConversationClient';

// 최초 HTML부터 실제 회화 콘텐츠가 포함되도록 서버에서 선조회합니다.
export const dynamic = 'force-dynamic';

export default async function ConversationPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from('conversation_lines')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[conversation SSR] 초기 데이터 불러오기 실패:', error.message);
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold">
          회화 콘텐츠를 준비하고 있습니다...
        </div>
      }
    >
      <ConversationClient initialData={data ?? []} />
    </Suspense>
  );
}
