import { performance } from 'node:perf_hooks';

const origin = new URL(process.env.SMOKE_SITE_URL ?? 'http://127.0.0.1:3100');
if (!['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname) || origin.username || origin.password) {
  throw new Error('This smoke check is restricted to a local site. Set SMOKE_SITE_URL to a localhost origin.');
}
const paths = ['/en/contact', '/en/practitioners/apply', '/en/privacy', '/admin/login'];
const concurrency = 8;
const requests = 48;
const durations = [];
let next = 0;
let failures = 0;

// Warm each route before measuring concurrency, especially when using next dev.
for (const path of paths) {
  const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(30_000) });
  await response.arrayBuffer();
  if (!response.ok) throw new Error(`Warmup failed for ${path}: HTTP ${response.status}`);
}
await Promise.all(Array.from({ length: concurrency }, async () => {
  while (next < requests) {
    const index = next++;
    const start = performance.now();
    try {
      const response = await fetch(new URL(paths[index % paths.length], origin), { signal: AbortSignal.timeout(15_000) });
      await response.arrayBuffer();
      if (!response.ok) failures++;
    } catch { failures++; }
    durations.push(performance.now() - start);
  }
}));
durations.sort((a, b) => a - b);
console.log(JSON.stringify({ requests, concurrency, failures, p95Ms: Math.round(durations[Math.ceil(durations.length * 0.95) - 1]) }, null, 2));
if (failures) process.exitCode = 1;
