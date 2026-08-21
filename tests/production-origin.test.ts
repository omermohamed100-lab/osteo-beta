import assert from 'node:assert/strict';
import test from 'node:test';
import robots from '../src/app/robots';
import sitemap from '../src/app/sitemap';
import { buildLocalizedMetadata } from '../src/lib/localized-metadata';
import { getSiteUrl, VERCEL_FALLBACK_SITE_URL } from '../src/lib/site-url';

const SITE_ENVIRONMENT_VARIABLES = [
  'NEXT_PUBLIC_SITE_URL',
  'VERCEL',
  'VERCEL_PROJECT_PRODUCTION_URL',
  'VERCEL_URL',
] as const;

function withSiteEnvironment(
  values: Partial<Record<(typeof SITE_ENVIRONMENT_VARIABLES)[number], string>>,
  assertion: () => void,
) {
  const previous = Object.fromEntries(
    SITE_ENVIRONMENT_VARIABLES.map((name) => [name, process.env[name]]),
  );

  for (const name of SITE_ENVIRONMENT_VARIABLES) {
    const value = values[name];
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }

  try {
    assertion();
  } finally {
    for (const name of SITE_ENVIRONMENT_VARIABLES) {
      const value = previous[name];
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
}

test('the verified custom origin drives metadata, robots, and sitemap URLs', () => {
  withSiteEnvironment(
    {
      NEXT_PUBLIC_SITE_URL: 'https://eg-som.com',
      VERCEL: '1',
      VERCEL_PROJECT_PRODUCTION_URL: 'osteo-beta.vercel.app',
      VERCEL_URL: 'osteo-beta-preview.vercel.app',
    },
    () => {
      const metadata = buildLocalizedMetadata('/courses', 'en');
      const robotsManifest = robots();
      const sitemapEntries = sitemap();

      assert.equal(getSiteUrl().origin, 'https://eg-som.com');
      assert.equal(metadata.metadataBase?.toString(), 'https://eg-som.com/');
      assert.equal(robotsManifest.host, 'https://eg-som.com');
      assert.equal(robotsManifest.sitemap, 'https://eg-som.com/sitemap.xml');
      assert.ok(
        sitemapEntries.every((entry) => entry.url.startsWith('https://eg-som.com/')),
      );
    },
  );
});

test('Vercel deployments keep the stable project URL until the custom origin is verified', () => {
  withSiteEnvironment(
    {
      VERCEL: '1',
      VERCEL_PROJECT_PRODUCTION_URL: 'unverified-custom.example',
      VERCEL_URL: 'osteo-beta-preview.vercel.app',
    },
    () => {
      assert.equal(getSiteUrl().origin, VERCEL_FALLBACK_SITE_URL);
    },
  );
});

test('an invalid custom origin falls through safely instead of producing localhost metadata', () => {
  withSiteEnvironment(
    {
      NEXT_PUBLIC_SITE_URL: 'http://eg-som.com/path',
      VERCEL_PROJECT_PRODUCTION_URL: 'osteo-beta.vercel.app',
    },
    () => {
      assert.equal(getSiteUrl().origin, 'https://osteo-beta.vercel.app');
    },
  );
});
