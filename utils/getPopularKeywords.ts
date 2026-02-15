export async function getPopularKeywords() {
  const res = await fetch('/api/popular');
  const data = await res.json();
  return data.keywords || [];
}
