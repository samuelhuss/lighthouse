import { NextResponse } from "next/server";
import { registrationRepository } from "@/modules/registration/registration.repository";
import { errorResponse, getRequestId } from "@/lib/http";
import { RegistrationNotFoundError } from "@/lib/errors";

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const requestId = getRequestId(request);
  const { code } = await params;

  try {
    const registration = await registrationRepository.findByCode(code);
    if (!registration) {
      throw new RegistrationNotFoundError();
    }

    return NextResponse.json(
      {
        code: registration.registrationCode,
        name: registration.name,
        status: registration.status,
        amountCents: registration.amountCents,
        paidAt: registration.paidAt,
        paymentExpiresAt: registration.paymentExpiresAt,
      },
      { status: 200, headers: { "x-request-id": requestId } }
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
