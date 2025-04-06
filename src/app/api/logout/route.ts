import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        // Use nextUrl.origin to get the absolute URL
        const url = new URL(request.url);
        const response = NextResponse.redirect(`/`);

        // Clear the token by setting an expired Set-Cookie header
        response.cookies.set('token', '', {
            expires: new Date(0),
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Logout Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
