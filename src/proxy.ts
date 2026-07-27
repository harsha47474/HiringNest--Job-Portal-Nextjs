import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const session = request.cookies.get('session');
    
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/applicant') || request.nextUrl.pathname.startsWith('/employer');
    
    if (!session && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
