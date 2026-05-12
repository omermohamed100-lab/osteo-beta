import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const secretKey = process.env.JWT_SECRET || 'super-secret-key-change-in-production';
const encodedKey = new TextEncoder().encode(secretKey);

export async function signJWT(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(encodedKey);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedKey);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  return await verifyJWT(token);
}
