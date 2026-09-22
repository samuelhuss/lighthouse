import { NextResponse } from "next/server";
import { Prisma, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, getRequestId } from "@/lib/http";

const paymentStatuses = Object.values(PaymentStatus);

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  try {
    await requireAdmin(request);

    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status");
    const search = url.searchParams.get("search")?.trim();
    const requestedLimit = Number(url.searchParams.get("limit") ?? 20);
    const requestedOffset = Number(url.searchParams.get("offset") ?? 0);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 100) : 20;
    const offset = Number.isFinite(requestedOffset) ? Math.max(Math.trunc(requestedOffset), 0) : 0;
    const status = statusParam && paymentStatuses.includes(statusParam as PaymentStatus) ? (statusParam as PaymentStatus) : undefined;

    const where: Prisma.PaymentWhereInput = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { externalReference: { contains: search, mode: "insensitive" } },
              { providerPaymentId: { contains: search, mode: "insensitive" } },
              { registration: { registrationCode: { contains: search, mode: "insensitive" } } },
              { registration: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({ where, include: { registration: true }, orderBy: { createdAt: "desc" }, skip: offset, take: limit }),
      prisma.payment.count({ where }),
    ]);

    return NextResponse.json({ items: payments, pagination: { page: Math.floor(offset / limit) + 1, limit, offset, total } }, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
