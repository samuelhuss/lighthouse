import { NextResponse } from "next/server";
import { errorResponse, getRequestId } from "@/lib/http";
import { requireInternalJobAuth } from "@/lib/internal-jobs";
import { reconcilePayments } from "@/jobs/reconcile-payments";

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  try {
    requireInternalJobAuth(request);
    const result = await reconcilePayments();

    return NextResponse.json({ ok: true, ...result }, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}