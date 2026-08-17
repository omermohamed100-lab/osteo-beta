import { NextResponse, type NextRequest } from 'next/server';
import {
  DEFAULT_LANGUAGE,
  getLanguageFromPathname,
  getPublicPathFromPathname,
  isPublicPagePath,
  LANGUAGE_REQUEST_HEADER,
  localizePublicPath,
} from '@/lib/i18n-routing';

const LANGUAGE_COOKIE = 'egsom-language';
const ONE_YEAR = 60 * 60 * 24 * 365;

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const routeLanguage = getLanguageFromPathname(pathname);

  if (routeLanguage) {
    const publicPath = getPublicPathFromPathname(pathname);
    if (!isPublicPagePath(publicPath)) return NextResponse.next();

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = publicPath;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LANGUAGE_REQUEST_HEADER, routeLanguage);

    const response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
    response.headers.set('Content-Language', routeLanguage);
    response.cookies.set(LANGUAGE_COOKIE, routeLanguage, {
      httpOnly: false,
      maxAge: ONE_YEAR,
      path: '/',
      sameSite: 'lax',
      secure: request.nextUrl.protocol === 'https:',
    });
    return response;
  }

  if (isPublicPagePath(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = localizePublicPath(pathname, DEFAULT_LANGUAGE);
    return NextResponse.redirect(redirectUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/about',
    '/courses',
    '/activities',
    '/find-osteopath',
    '/find-osteopath/:path*',
    '/practitioners',
    '/courses/:path*',
    '/activities/:path*',
    '/gallery',
    '/contact',
    '/en',
    '/en/:path*',
    '/ar',
    '/ar/:path*',
  ],
};
