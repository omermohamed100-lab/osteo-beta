export class RequestTimeoutError extends Error {
  constructor() {
    super('The request took too long.');
    this.name = 'RequestTimeoutError';
  }
}

/** Covers both response headers and body reading; never retries a mutation. */
export async function withRequestTimeout<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  timeoutMs = 30_000,
  signal?: AbortSignal,
): Promise<T> {
  const controller = new AbortController();
  let timedOut = false;
  const cancel = () => controller.abort(signal?.reason);
  if (signal?.aborted) cancel();
  else signal?.addEventListener('abort', cancel, { once: true });
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  try {
    return await operation(controller.signal);
  } catch (error) {
    if (timedOut) throw new RequestTimeoutError();
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
  }
}

export function fetchJsonWithTimeout<T>(url: string, init: RequestInit = {}, timeoutMs = 30_000) {
  return withRequestTimeout(async (signal) => {
    const response = await fetch(url, { ...init, signal });
    const data = await response.json() as T;
    return { response, data };
  }, timeoutMs, init.signal ?? undefined);
}
