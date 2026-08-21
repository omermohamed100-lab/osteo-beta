import { NextResponse, type NextRequest } from 'next/server';
import {
  DEFAULT_LANGUAGE,
  getLanguageFromPathname,
  getPublicPathFromPathname,
  isPublicPagePath,
  isSiteLanguage,
  LANGUAGE_REQUEST_HEADER,
  localizePublicPath,
} from '@/lib/i18n-routing';

const LANGUAGE_COOKIE = 'egsom-language';
const INTERNAL_REWRITE_HEADER = 'x-egsom-internal-localized-rewrite';
const ONE_YEAR = 60 * 60 * 24 * 365;

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const routeLanguage = getLanguageFromPathname(pathname);

  // A localized public URL is internally rewritten to its existing unprefixed
  // page. On that narrowly scoped second pass, continue to the page instead of
  // treating the internal target as a legacy browser URL and redirecting again.
  const internalRewriteLanguage = request.headers.get(INTERNAL_REWRITE_HEADER);
  if (
    !routeLanguage
    && isPublicPagePath(pathname)
    && isSiteLanguage(internalRewriteLanguage)
    && request.headers.get(LANGUAGE_REQUEST_HEADER) === internalRewriteLanguage
  ) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.delete(INTERNAL_REWRITE_HEADER);
    requestHeaders.set(LANGUAGE_REQUEST_HEADER, internalRewriteLanguage);

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set('Content-Language', internalRewriteLanguage);
    return response;
  }

  if (routeLanguage) {
    const publicPath = getPublicPathFromPathname(pathname);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LANGUAGE_REQUEST_HEADER, routeLanguage);

    let response: NextResponse;
    if (isPublicPagePath(publicPath)) {
      requestHeaders.set(INTERNAL_REWRITE_HEADER, routeLanguage);
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = publicPath;
      response = NextResponse.rewrite(rewriteUrl, {
        request: { headers: requestHeaders },
      });
    } else {
      response = NextResponse.next({ request: { headers: requestHeaders } });
    }
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
    '/privacy',
    '/en',
    '/en/:path*',
    '/ar',
    '/ar/:path*',
  ],
};
