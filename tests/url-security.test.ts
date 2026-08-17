import assert from 'node:assert/strict';
import test from 'node:test';
import { isSafeMediaUrl, isSafeSocialUrl } from '../src/lib/url-security';

const originalMediaHosts = process.env.ALLOWED_MEDIA_HOSTS;

test.afterEach(() => {
  if (originalMediaHosts === undefined) delete process.env.ALLOWED_MEDIA_HOSTS;
  else process.env.ALLOWED_MEDIA_HOSTS = originalMediaHosts;
});

test('allows single-slash local media paths', () => {
  assert.equal(isSafeMediaUrl('/images/example.webp'), true);
  assert.equal(isSafeMediaUrl('//attacker.example/image.webp'), false);
  assert.equal(isSafeMediaUrl('/\\attacker.example/image.webp'), false);
});

test('allows HTTPS media only from explicitly configured hosts', () => {
  process.env.ALLOWED_MEDIA_HOSTS = 'media.egsom.example,cdn.egsom.example';

  assert.equal(isSafeMediaUrl('https://media.egsom.example/image.webp'), true);
  assert.equal(isSafeMediaUrl('https://cdn.egsom.example/path/image.webp'), true);
  assert.equal(isSafeMediaUrl('https://sub.media.egsom.example/image.webp'), false);
  assert.equal(isSafeMediaUrl('https://unlisted.example/image.webp'), false);
});

test('rejects unsafe schemes, credentials, loopback, and private-network hosts', () => {
  process.env.ALLOWED_MEDIA_HOSTS = 'localhost,127.0.0.1,192.168.1.20,media.egsom.example';

  for (const value of [
    'http://media.egsom.example/image.webp',
    'javascript:alert(1)',
    'data:text/plain,hello',
    'file:///etc/passwd',
    'https://user:pass@media.egsom.example/image.webp',
    'https://localhost/image.webp',
    'https://127.0.0.1/image.webp',
    'https://192.168.1.20/image.webp',
  ]) {
    assert.equal(isSafeMediaUrl(value), false, value);
  }
});

test('restricts social links to HTTPS on the expected platform', () => {
  assert.equal(isSafeSocialUrl('https://www.facebook.com/egsom', ['facebook.com']), true);
  assert.equal(isSafeSocialUrl('https://facebook.com/egsom', ['facebook.com']), true);
  assert.equal(isSafeSocialUrl('http://facebook.com/egsom', ['facebook.com']), false);
  assert.equal(isSafeSocialUrl('https://facebook.com.attacker.example/egsom', ['facebook.com']), false);
  assert.equal(isSafeSocialUrl('javascript:alert(1)', ['facebook.com']), false);
});
