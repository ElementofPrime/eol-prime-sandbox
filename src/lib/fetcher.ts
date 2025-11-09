export const fetcher = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, { credentials: "include", ...init });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: any = new Error("API error");
    err.status = res.status;
    err.info = data;
    throw err;
  }
  return data;
};
