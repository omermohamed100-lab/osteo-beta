import { NextRequest, NextResponse } from 'next/server';

type MutationRequestOptions = {
  requireJson?: boolean;
};

export class RequestBodyTooLargeError extends Error {
  constructor(public readonly maxBytes: number) {
    super(`Request body exceeds the ${maxBytes}-byte limit.`);
    this.name = 'RequestBodyTooLargeError';
  }
}

export class InvalidJsonBodyError extends Error {
  constructor() {
    super('Request body must contain valid JSON.');
    this.name = 'InvalidJsonBodyError';
  }
}

function normalizeOrigin(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url.origin;
  } catch {
    return null;
  }
}

function configuredTrustedOrigins() {
  return (process.env.TRUSTED_ORIGINS ?? '')
    .split(',')
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter((origin): origin is string => Boolean(origin));
}

function firstForwardedValue(value: string | null) {
  return value?.split(',', 1)[0].trim() || null;
}

function requestHostOrigin(request: NextRequest) {
  const host = firstForwardedValue(request.headers.get('x-forwarded-host'))
    ?? firstForwardedValue(request.headers.get('host'));
  if (!host) return null;

  const protocol = firstForwardedValue(request.headers.get('x-forwarded-proto'))
    ?? request.nextUrl.protocol.replace(':', '');
  return normalizeOrigin(`${protocol}://${host}`);
}

export function enforceMutationRequest(
  request: NextRequest,
  { requireJson = true }: MutationRequestOptions = {},
) {
  const requestOrigin = normalizeOrigin(request.headers.get('origin') ?? '');
  const trustedOrigins = new Set(
    [request.nextUrl.origin, requestHostOrigin(request), ...configuredTrustedOrigins()]
      .filter((origin): origin is string => Boolean(origin)),
  );

  if (!requestOrigin || !trustedOrigins.has(requestOrigin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (requireJson) {
    const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
    if (contentType !== 'application/json') {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 },
      );
    }
  }

  return null;
}

export async function readBoundedJsonBody(request: NextRequest, maxBytes: number): Promise<unknown> {
  if (!Number.isInteger(maxBytes) || maxBytes < 1) {
    throw new RangeError('maxBytes must be a positive integer.');
  }

  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new RequestBodyTooLargeError(maxBytes);
  }

  const reader = request.body?.getReader();
  if (!reader) throw new InvalidJsonBodyError();

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        throw new RequestBodyTooLargeError(maxBytes);
      }
      chunks.push(value);
    }
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) throw error;
    throw new InvalidJsonBodyError();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return JSON.parse(text) as unknown;
  } catch {
    throw new InvalidJsonBodyError();
  }
}
