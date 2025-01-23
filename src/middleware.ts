import { NextResponse } from "next/server"

export function middleware(request : any){

    const token = request.cookies.get("token")?.value;

    if(!token){
        return NextResponse.redirect(
            new URL('/', request.url)
        )
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/master-management', '/user-management']
}