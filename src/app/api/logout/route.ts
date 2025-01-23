import Cookies from "js-cookie";
import { NextResponse } from "next/server";

export async function POST(req: { method: string; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; }){

    if (req.method === "POST") {
        console.log(req.method, "here")
        // req.s
        Cookies.remove("token");
    }

    return NextResponse.json('success');

}