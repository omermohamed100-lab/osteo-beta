import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const JWT_ISSUER = 'egsom-website';
export const JWT_AUDIENCE = 'egsom-admin';
export const JWT_SECRET_MIN_BYTES = 32;
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  sessionVersion: number;
};

export type AdminUserLookup = (id: string) => Promise<AdminUser | null>;

export class JWTConfigurationError extends Error {
  constructor() {
    super(`JWT_SECRET must be configured with at least ${JWT_SECRET_MIN_BYTES} bytes.`);
    this.name = 'JWTConfigurationError';
  }
}

function getEncodedKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new JWTConfigurationError();

  const encodedKey = new TextEncoder().encode(secret);
  if (encodedKey.byteLength < JWT_SECRET_MIN_BYTES) {
    throw new JWTConfigurationError();
  }

  return encodedKey;
}

export async function signJWT(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(getEncodedKey());
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function getSession(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  return await verifyJWT(token);
}

export function setAdminSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
}

const findAdminUser: AdminUserLookup = (id) =>
  db.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      sessionVersion: true,
    },
  });

export async function requireAdmin(
  request: NextRequest,
  lookupUser: AdminUserLookup = findAdminUser,
): Promise<AdminUser | null> {
  const session = await getSession(request);
  const userId = session?.id;
  const sessionVersion = session?.sessionVersion;
  if (
    typeof userId !== 'string'
    || !userId
    || typeof sessionVersion !== 'number'
    || !Number.isInteger(sessionVersion)
  ) return null;

  const user = await lookupUser(userId);
  if (
    !user
    || user.role !== 'admin'
    || !user.isActive
    || user.sessionVersion !== sessionVersion
  ) return null;

  return user;
}
