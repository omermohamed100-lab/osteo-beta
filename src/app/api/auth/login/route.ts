import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { setAdminSessionCookie, signJWT } from '@/lib/auth';
import {
  cleanupExpiredRateLimits,
  consumeRateLimit,
  getClientAddress,
  normalizeRateLimitIdentity,
  rateLimitExceededResponse,
  rateLimitUnavailableResponse,
} from '@/lib/rate-limit';
import { enforceMutationRequest } from '@/lib/request-security';
import { z } from 'zod';

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const DUMMY_PASSWORD_HASH = '$2b$10$kEWiWOTwZF.Rze7Fu3PmVuQoW0tqGpVBboa9gc1u/FXYMy0Rx315W';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const rejected = enforceMutationRequest(request);
    if (rejected) return rejected;

    try {
      await cleanupExpiredRateLimits();
      const addressLimit = await consumeRateLimit({
        scope: 'admin-login-address',
        key: getClientAddress(request),
        limit: 10,
        windowMs: LOGIN_WINDOW_MS,
      });
      if (!addressLimit.allowed) {
        return rateLimitExceededResponse(addressLimit.retryAfterSeconds);
      }
    } catch {
      return rateLimitUnavailableResponse();
    }

    const body = await request.json();
    const data = loginSchema.parse(body);

    const normalizedEmail = normalizeRateLimitIdentity(data.email);

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user?.password ?? DUMMY_PASSWORD_HASH,
    );

    if (!user || !isPasswordValid || user.role !== 'admin' || !user.isActive) {
      try {
        const accountLimit = await consumeRateLimit({
          scope: 'admin-login-account-failure',
          key: normalizedEmail,
          limit: 8,
          windowMs: LOGIN_WINDOW_MS,
        });
        if (!accountLimit.allowed) {
          return rateLimitExceededResponse(accountLimit.retryAfterSeconds);
        }
      } catch {
        return rateLimitUnavailableResponse();
      }
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT
    const token = await signJWT({
      id: user.id,
      email: user.email,
      role: user.role,
      sessionVersion: user.sessionVersion,
    });

    const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    setAdminSessionCookie(response, token);

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
