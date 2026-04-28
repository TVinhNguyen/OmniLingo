import { NextRequest, NextResponse } from "next/server";
import { serverVerifyEmail } from "@/lib/api/auth";

/**
 * POST /api/auth/verify-email
 * Bridge for client components that cannot call server-side functions directly.
 * Delegates to serverVerifyEmail which calls identity-service.
 */
export async function POST(req: NextRequest) {
  try {
    const { token } = (await req.json()) as { token?: string };
    if (!token) {
      return NextResponse.json({ message: "token is required" }, { status: 400 });
    }
    await serverVerifyEmail(token);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Xác thực thất bại";
    return NextResponse.json({ message }, { status: 400 });
  }
}
