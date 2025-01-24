import Cookies from "js-cookie";
import { NextResponse, NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    // Access request properties like `req.method`, `req.nextUrl`, `req.headers`, etc.
    const { method } = req;
  
    if (method !== 'POST') {
      return NextResponse.json({ error: 'Invalid method' }, { status: 405 });
    }
  
    return NextResponse.json({ success: true });
  }