import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, getRequestId, parseJsonBody } from "@/lib/http";
import { batchService } from "@/modules/batch/batch.service";

const updateBatchSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  priceCents: z.number().int().positive().optional(),
  capacity: z.number().int().positive().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const { id } = await params;

  try {
    await requireAdmin(request);
    const body = await parseJsonBody(request, updateBatchSchema);

    const batch = await batchService.update(id, {
      ...body,
      startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
      endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
    });

    return NextResponse.json({ batch }, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}