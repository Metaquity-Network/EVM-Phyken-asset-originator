import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Define your known routes
  const knownRoutes = ['/', '/dashboard', '/upload-license', '/assets', '/wallet', 'transactions'];

  // If the request path is not in the known routes and is not a file or API route, redirect to home
  if (!knownRoutes.includes(pathname) && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
