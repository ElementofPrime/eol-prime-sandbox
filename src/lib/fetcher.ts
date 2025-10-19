export async function fetcher<T = any>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { cache: 'no-store', ...init });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
