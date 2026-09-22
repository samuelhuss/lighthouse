import { NextResponse } from "next/server";
import { campService } from "@/modules/camp/camp.service";
import { errorResponse, getRequestId } from "@/lib/http";

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  try {
    const data = await campService.getPublicInfo();
    return NextResponse.json(data, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
