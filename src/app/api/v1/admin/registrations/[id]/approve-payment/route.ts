import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, getRequestId } from "@/lib/http";
import { RegistrationNotFoundError } from "@/lib/errors";
import { emailService } from "@/modules/email/email.service";
import { registrationRepository } from "@/modules/registration/registration.repository";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const { id } = await params;

  try {
    await requireAdmin(request);
    
    let justification = "";
    try {
      const body = await request.json();
      justification = body.justification || "";
    } catch (e) {}

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const registration = await tx.registration.findUnique({
        where: { id },
      });
      if (!registration) throw new RegistrationNotFoundError();
      if (registration.status === "PAID") throw new Error("A inscrição já está paga.");

      // Create a manual payment record
      const payment = await tx.payment.create({
        data: {
          registrationId: registration.id,
          amountCents: registration.amountCents,
          status: "APPROVED",
          provider: "MANUAL",
          providerPaymentId: `manual_${Date.now()}`,
          externalReference: registration.registrationCode,
          paymentMethod: justification || "Manual",
          paidAt: new Date(),
        },
      });

      // Update registration status
      const updated = await tx.registration.update({
        where: { id: registration.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });

      return { registration: updated, payment };
    });

    // Send ticket email
    await emailService.sendPaymentApproved({
      paymentId: result.payment.id,
      registrationId: result.registration.id,
      name: result.registration.name,
      email: result.registration.email,
      registrationCode: result.registration.registrationCode,
      amountCents: result.registration.amountCents,
    });

    try {
      const { notificationService } = await import("@/modules/notification/notification.service");
      await notificationService.notifyAdmin("PAGAMENTO_APROVADO", {
        nome: result.registration.name,
        email: result.registration.email,
        codigo: result.registration.registrationCode,
        valor: (result.registration.amountCents / 100).toFixed(2),
        metodo: "MANUAL",
      });
    } catch (e) {}

    return NextResponse.json({ success: true }, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
