import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, getRequestId } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { getEnv } from "@/lib/env";

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  try {
    await requireAdmin(request);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const env = getEnv();
    const [total, paid, pending, failed, cancelled, capacity, revenue, todayRegistrations, todayPayments, averageTicket, latestRegistrations] = await Promise.all([
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
      prisma.registration.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.payment.count({ where: { createdAt: { gte: startOfDay }, status: "APPROVED" } }),
      prisma.payment.aggregate({ where: { status: "APPROVED" }, _avg: { amountCents: true } }),
      prisma.registration.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, registrationCode: true, name: true, status: true, amountCents: true, createdAt: true },
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
          averageTicketCents: Math.round(Number(averageTicket._avg.amountCents ?? 0)),
        },
        today: { registrations: todayRegistrations, payments: todayPayments },
        latestRegistrations: latestRegistrations.map((registration) => ({ ...registration, code: registration.registrationCode })),
        googleSheets: {
          configured: Boolean(env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY && env.GOOGLE_SHEET_ID),
        },
      },
      { status: 200, headers: { "x-request-id": requestId } }
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
