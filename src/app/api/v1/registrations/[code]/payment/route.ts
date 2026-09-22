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

    const payment = await (await import("@/lib/prisma")).prisma.payment.findFirst({
      where: { registrationId: registration.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        status: payment?.status ?? "PENDING",
        paidAt: registration.paidAt,
      },
      { status: 200, headers: { "x-request-id": requestId } }
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
