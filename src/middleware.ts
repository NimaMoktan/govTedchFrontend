import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    console.log("Incoming request:", request.nextUrl.href);

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

// Ensure it matches all necessary paths
export const config = {
    matcher: ['/', '/dashboard/:path*', '/master-management/:path*', '/user-management/:path*']
};

