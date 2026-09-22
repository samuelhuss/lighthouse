import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, getRequestId } from "@/lib/http";
import { registrationRepository } from "@/modules/registration/registration.repository";
import { listRegistrationsQuerySchema } from "@/modules/registration/registration.schema";

function maskCpf(cpf: string | null): string | null {
  if (!cpf) return null;
  const digits = cpf.replace(/\D/g, "");
  if (digits.length < 2) return null;
  return `***.***.***-${digits.slice(-2)}`;
}

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  try {
    await requireAdmin(request);

    const url = new URL(request.url);
    const query = listRegistrationsQuerySchema.parse(Object.fromEntries(url.searchParams));
    const result = await registrationRepository.list(query);

    return NextResponse.json(
      {
        items: result.items.map((registration) => ({
          id: registration.id,
          code: registration.registrationCode,
          name: registration.name,
          email: registration.email,
          phone: registration.phone,
          cpf: maskCpf(registration.cpf),
          status: registration.status,
          amountCents: registration.amountCents,
          paidAt: registration.paidAt,
          createdAt: registration.createdAt,
        })),
        pagination: {
          page: query.page,
          limit: query.limit,
          total: result.total,
        },
      },
      { status: 200, headers: { "x-request-id": requestId } }
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}