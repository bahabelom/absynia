import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Firebase Auth is client-side, so authentication checks happen in components
// This proxy is kept for potential future server-side logic
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

