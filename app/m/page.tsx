import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function MPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams?.q ? `?q=${encodeURIComponent(searchParams.q)}` : '';
  redirect('/' + q);
}
