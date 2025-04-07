// import { NextResponse } from "next/server";

// export function middleware(request: any) {
//   const token = request.cookies.get("token")?.value;
//   const { pathname } = request.nextUrl;

//   // Public routes
//   const publicRoutes = ['/', '/signin', '/signup'];
  
//   // Protected routes (including all dynamic paths)
//   const protectedRoutes = [
//     '/dashboard',
//     '/user-management',
//     '/master-management'
//   ];

//   // 1. Redirect authenticated users from public routes
//   if (token && publicRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   // 2. Protect all routes starting with protected paths
//   if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
//     return NextResponse.redirect(new URL('/signin', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };

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
    matcher: ['/', '/dashboard', '/((?!api/).*)']
};

