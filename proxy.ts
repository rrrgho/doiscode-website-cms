import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Protect all /admin/* routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('cms_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyJwt(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('cms_token');
      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
