import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, getRequestId, parseJsonBody } from "@/lib/http";
import { batchService } from "@/modules/batch/batch.service";
import { campService } from "@/modules/camp/camp.service";

const createBatchSchema = z.object({
  name: z.string().trim().min(1).max(100),
  priceCents: z.number().int().positive(),
  capacity: z.number().int().positive(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
});

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  try {
    await requireAdmin(request);
    const camp = await campService.getActiveCamp();
    const batches = await batchService.list(camp.id);

    return NextResponse.json({ items: batches }, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  try {
    await requireAdmin(request);
    const body = await parseJsonBody(request, createBatchSchema);
    const camp = await campService.getActiveCamp();

    const batch = await batchService.create({
      campId: camp.id,
      name: body.name,
      priceCents: body.priceCents,
      capacity: body.capacity,
      startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
      endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
    });

    return NextResponse.json({ batch }, { status: 201, headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}