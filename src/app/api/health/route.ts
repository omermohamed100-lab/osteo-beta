import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSMTPConfiguration } from '@/lib/email';
import { reportOperationalError } from '@/lib/operational-monitoring';

export const dynamic = 'force-dynamic';

type CheckStatus = 'available' | 'degraded' | 'unavailable';

const responseHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow',
};

async function databaseHealth(): Promise<CheckStatus> {
  try {
    await db.$queryRaw`SELECT 1`;
    return 'available';
  } catch (error) {
    reportOperationalError('health.database_unavailable', error);
    return 'unavailable';
  }
}

async function emailHealth(): Promise<CheckStatus> {
  try {
    getSMTPConfiguration();
  } catch (error) {
    reportOperationalError('health.email_configuration_unavailable', error);
    return 'unavailable';
  }

  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [attempted, failed] = await Promise.all([
      db.contactSubmission.count({
        where: { notificationLastAttemptedAt: { gte: since } },
      }),
      db.contactSubmission.count({
        where: {
          notificationLastAttemptedAt: { gte: since },
          notificationStatus: 'failed',
        },
      }),
    ]);

    if (attempted >= 3 && failed === attempted) {
      reportOperationalError('health.email_delivery_degraded');
      return 'degraded';
    }
    return 'available';
  } catch (error) {
    reportOperationalError('health.database_unavailable', error);
    return 'unavailable';
  }
}

export async function GET() {
  const [database, email] = await Promise.all([
    databaseHealth(),
    emailHealth(),
  ]);
  const ready = database === 'available';
  const healthy = ready && email === 'available';

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      checks: { database, email },
      checkedAt: new Date().toISOString(),
    },
    { status: ready ? 200 : 503, headers: responseHeaders },
  );
}
