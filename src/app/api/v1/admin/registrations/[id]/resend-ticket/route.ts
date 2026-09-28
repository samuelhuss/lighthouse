import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, getRequestId } from "@/lib/http";
import { RegistrationNotFoundError } from "@/lib/errors";
import { registrationRepository } from "@/modules/registration/registration.repository";
import { emailService } from "@/modules/email/email.service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = getRequestId(request);
  const { id } = await params;

  try {
    await requireAdmin(request);

    const registration = await registrationRepository.findByIdWithPayments(id);
    if (!registration) {
      throw new RegistrationNotFoundError();
    }

    if (registration.status !== "PAID") {
      throw new Error("Apenas inscrições pagas podem ter o ingresso reenviado.");
    }

    await emailService.sendTicketResend({
      registrationId: registration.id,
      name: registration.name,
      email: registration.email,
      registrationCode: registration.registrationCode,
    });

    return NextResponse.json({ success: true }, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
