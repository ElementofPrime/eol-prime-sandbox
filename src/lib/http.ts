// Small helpers for API routes
export function json(data: any, init?: ResponseInit | number) {
  const resInit = typeof init === 'number' ? { status: init } : init;
  return Response.json(data, resInit);
}

export function error(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
