import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        console.log("Logout route hit");

        // Use nextUrl.origin to get the absolute URL
        const url = new URL(request.url);
        const response = NextResponse.redirect(`${url.origin}/`);

        console.log("Redirect created");

        // Clear the token by setting an expired Set-Cookie header
        response.cookies.set('token', '', {
            expires: new Date(0),
            path: '/',
        });

        console.log("Cookie cleared");

        return response;
    } catch (error) {
        console.error('Logout Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
