import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, getRequestId, parseJsonBody } from "@/lib/http";
import { campService } from "@/modules/camp/camp.service";

const updateCampSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  location: z.string().trim().max(255).nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  maxCapacity: z.number().int().positive().optional(),
  active: z.boolean().optional(),
});

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  try {
    await requireAdmin(request);
    const camp = await campService.getActiveCamp();

    return NextResponse.json({ camp }, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

export async function PATCH(request: Request) {
  const requestId = getRequestId(request);

  try {
    await requireAdmin(request);
    const camp = await campService.getActiveCamp();
    const body = await parseJsonBody(request, updateCampSchema);

    const updated = await campService.update(camp.id, {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : body.startDate,
      endDate: body.endDate ? new Date(body.endDate) : body.endDate,
    });

    return NextResponse.json({ camp: updated }, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}