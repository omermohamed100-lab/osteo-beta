import { NextRequest, NextResponse } from 'next/server';
import { enforceMutationRequest } from '@/lib/request-security';

export async function POST(request: NextRequest) {
  const rejected = enforceMutationRequest(request, { requireJson: false });
  if (rejected) return rejected;

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
