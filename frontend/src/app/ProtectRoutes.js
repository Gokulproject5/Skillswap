import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;

    // Check if the route is protected
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

    if (isProtectedRoute && !token) {
        // Create the login URL
        const loginUrl = new URL('/auth/login', request.url);
        
        // Add the current page as a 'callback' so they can return after login
        loginUrl.searchParams.set('callbackUrl', pathname);
        
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
};
