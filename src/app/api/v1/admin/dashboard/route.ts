import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, getRequestId } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  try {
    await requireAdmin(request);

    const [total, paid, pending, failed, cancelled, capacity, revenue] = await Promise.all([
      prisma.registration.count(),
      prisma.registration.count({ where: { status: "PAID" } }),
      prisma.registration.count({ where: { status: "PENDING_PAYMENT" } }),
      prisma.registration.count({ where: { status: "PAYMENT_FAILED" } }),
      prisma.registration.count({ where: { status: "CANCELLED" } }),
      prisma.batch.aggregate({
        _sum: { capacity: true, reservedCount: true },
      }),
      prisma.payment.aggregate({
        where: { status: "APPROVED" },
        _sum: { amountCents: true },
      }),
    ]);

    return NextResponse.json(
      {
        registrations: {
          total,
          paid,
          pending,
          failed,
          cancelled,
        },
        capacity: {
          total: Number(capacity._sum.capacity ?? 0),
          reserved: Number(capacity._sum.reservedCount ?? 0),
          available: Math.max(Number(capacity._sum.capacity ?? 0) - Number(capacity._sum.reservedCount ?? 0), 0),
        },
        revenue: {
          paidCents: Number(revenue._sum.amountCents ?? 0),
          pendingCents: 0,
        },
      },
      { status: 200, headers: { "x-request-id": requestId } }
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
