import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, getRequestId } from "@/lib/http";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);

  try {
    await requireAdmin(request);
    const { id } = await params;
    const payment = await prisma.payment.findUnique({
      where: { id },
      select: {
        id: true,
        provider: true,
        providerPaymentId: true,
        providerPreferenceId: true,
        externalReference: true,
        amountCents: true,
        status: true,
        statusDetail: true,
        paymentMethod: true,
        paidAt: true,
        createdAt: true,
        updatedAt: true,
        registration: { select: { id: true, registrationCode: true, name: true, email: true, status: true } },
      },
    });

    if (!payment) return NextResponse.json({ error: { code: "PAYMENT_NOT_FOUND", message: "Pagamento não encontrado." } }, { status: 404 });
    return NextResponse.json({ payment }, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
