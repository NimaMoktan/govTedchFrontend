import { NextResponse } from "next/server";

export function middleware(request: any) {
    const token = request.cookies.get("token")?.value;

    // If token exists and user is trying to access login page, redirect to dashboard
    if (token && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If no token and user tries to access protected routes, redirect to login
    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/master-management', '/user-management', '/((?!api/).*)']
}