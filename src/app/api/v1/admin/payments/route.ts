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

    const payments = await prisma.payment.findMany({
      where,
      include: { registration: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ items: payments }, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
