import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, getRequestId, parseJsonBody } from "@/lib/http";
import { RegistrationNotFoundError } from "@/lib/errors";
import { batchService } from "@/modules/batch/batch.service";
import { registrationRepository } from "@/modules/registration/registration.repository";
import { adminUpdateRegistrationSchema } from "@/modules/registration/registration.schema";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const { id } = await params;

  try {
    await requireAdmin(request);

    const registration = await registrationRepository.findByIdWithPayments(id);
    if (!registration) {
      throw new RegistrationNotFoundError();
    }

    return NextResponse.json({ registration }, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const { id } = await params;

  try {
    await requireAdmin(request);
    const body = await parseJsonBody(request, adminUpdateRegistrationSchema);

    const registration = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const current = await tx.registration.findUnique({ where: { id } });
      if (!current) {
        throw new RegistrationNotFoundError();
      }

      const updated = await tx.registration.update({
        where: { id },
        data: { status: body.status },
      });

      if (
        current.batchId &&
        current.status === "PENDING_PAYMENT" &&
        (body.status === "CANCELLED" || body.status === "EXPIRED")
      ) {
        await batchService.releaseSlot(tx, current.batchId);
      }

      return updated;
    });

    return NextResponse.json({ registration }, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}