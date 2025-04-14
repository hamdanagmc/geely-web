import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);
const localePattern = /^\/(en|ar)(\/|$)/;

export default function middleware(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get('lang');

  if (lang === 'ar' || lang === 'en') {
    const url = request.nextUrl.clone();

    // Remove existing locale from pathname if present
    url.pathname = url.pathname.replace(localePattern, '/');

    // Add new locale prefix
    url.pathname = `/${lang}${url.pathname}`.replace(/\/+$/, ''); 

    url.searchParams.delete('lang'); 
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/((?!_next|_vercel|api/|.*\\..*).*)',
  ]
};
