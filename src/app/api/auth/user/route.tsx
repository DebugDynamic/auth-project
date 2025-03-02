import { auth } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const user = await auth.getUser(request)
    return NextResponse.json({ success: user.success, id: user.data?.id, email: user.data?.email }, { status: 200 });
}
