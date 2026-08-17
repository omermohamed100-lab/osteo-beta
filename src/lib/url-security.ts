import { z } from 'zod';

function normalizedHostname(value: string) {
  return value.trim().toLowerCase().replace(/^\[|\]$/g, '');
}

function isPrivateHostname(hostname: string) {
  const host = normalizedHostname(hostname);
  if (host === 'localhost' || host.endsWith('.localhost')) return true;
  if (
    host === '::1' ||
    (host.includes(':') && (host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80:')))
  ) return true;

  const octets = host.split('.').map(Number);
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }

  return (
    octets[0] === 0 ||
    octets[0] === 10 ||
    octets[0] === 127 ||
    (octets[0] === 169 && octets[1] === 254) ||
    (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (octets[0] === 192 && octets[1] === 168)
  );
}

function configuredMediaHosts() {
  return new Set(
    (process.env.ALLOWED_MEDIA_HOSTS ?? '')
      .split(',')
      .map(normalizedHostname)
      .filter(Boolean),
  );
}

function parseSafeHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    if (isPrivateHostname(url.hostname)) return null;
    return url;
  } catch {
    return null;
  }
}

export function isSafeExternalUrl(value: string) {
  return value === '' || Boolean(parseSafeHttpsUrl(value));
}

export function isSafeMediaUrl(value: string) {
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) {
    return true;
  }

  const url = parseSafeHttpsUrl(value);
  return Boolean(url && configuredMediaHosts().has(normalizedHostname(url.hostname)));
}

export function isSafeSocialUrl(value: string, allowedHosts: readonly string[]) {
  const url = parseSafeHttpsUrl(value);
  if (!url) return false;

  const hostname = normalizedHostname(url.hostname);
  return allowedHosts.some((allowedHost) => {
    const allowed = normalizedHostname(allowedHost);
    return hostname === allowed || hostname.endsWith(`.${allowed}`);
  });
}

export const mediaUrlSchema = z.string().refine(isSafeMediaUrl, {
  message: 'Use a local media path or an HTTPS URL from an approved media host',
});

export const externalUrlSchema = z.string().refine(isSafeExternalUrl, {
  message: 'Use a public HTTPS URL without credentials',
});

export function socialUrlSchema(allowedHosts: readonly string[]) {
  return z.string().refine(
    (value) => value === '' || isSafeSocialUrl(value, allowedHosts),
    { message: 'Use an HTTPS URL from the expected social platform' },
  );
}
