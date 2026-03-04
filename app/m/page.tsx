import { redirect } from 'next/navigation';

// export const dynamic = 'force-dynamic';
// export const dynamic = 'force-static';

export default function MPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams?.q ? `?q=${encodeURIComponent(searchParams.q)}` : '';
  redirect('/' + q);
}
