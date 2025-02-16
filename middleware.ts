import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isAdminPath = path.startsWith('/admin');
  const token = request.cookies.get('access_token')?.value;

  if (isAdminPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminPath && token) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin'],
};
