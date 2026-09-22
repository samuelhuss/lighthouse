import { NextResponse } from "next/server";
import { reconcilePayments } from "@/jobs/reconcile-payments";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, getRequestId } from "@/lib/http";

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  try {
    await requireAdmin(request);
    const result = await reconcilePayments();
    return NextResponse.json({ ok: true, ...result }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}