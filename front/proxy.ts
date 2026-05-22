import { NextRequest, NextResponse } from 'next/server';

const ROLE_PATHS: Record<string, string> = {
  super_admin: '/admin',
  university_staff: '/university',
  company_mentor: '/company',
  student: '/student',
};

const PROTECTED_PREFIXES = ['/admin', '/university', '/company', '/student'];

function decodeJwt(token: string): { role: string; exp: number } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function isExpired(payload: { exp: number }): boolean {
  return payload.exp < Date.now() / 1000;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('ims_token')?.value;
  const payload = token ? decodeJwt(token) : null;
  const isAuthenticated = !!payload && !isExpired(payload);

  // Root → redirect to dashboard or login
  if (pathname === '/') {
    if (!isAuthenticated) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.redirect(new URL(ROLE_PATHS[payload.role] ?? '/login', request.url));
  }

  // Login page → redirect already-authenticated users to their dashboard
  if (pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(ROLE_PATHS[payload.role] ?? '/login', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // No valid token → go to login
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Wrong role → redirect to correct dashboard (prevents URL guessing)
  const ownPath = ROLE_PATHS[payload.role];
  if (ownPath && !pathname.startsWith(ownPath)) {
    return NextResponse.redirect(new URL(ownPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/admin/:path*', '/university/:path*', '/company/:path*', '/student/:path*'],
};
