import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { registrationCode } = await request.json();

    if (!registrationCode) {
      return NextResponse.json({ error: "Código do ingresso não fornecido" }, { status: 400 });
    }

    // 1. Encontrar o ingresso
    const registration = await prisma.registration.findUnique({
      where: { registrationCode },
      include: {
        batch: true,
      },
    });

    if (!registration) {
      return NextResponse.json({ 
        error: "Ingresso não encontrado no sistema.",
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    // 2. Verificar Status do Pagamento
    if (registration.status !== "PAID") {
      return NextResponse.json({ 
        error: `Atenção: O pagamento consta como ${registration.status}.`,
        code: "NOT_PAID" 
      }, { status: 400 });
    }

    // 3. Verificar se já não fez check-in antes
    if (registration.checkedInAt) {
      return NextResponse.json({ 
        error: `Este ingresso já foi utilizado em ${registration.checkedInAt.toLocaleString("pt-BR")}.`,
        code: "ALREADY_CHECKED_IN" 
      }, { status: 400 });
    }

    // 4. Realizar o check-in!
    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: { checkedInAt: new Date() },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Check-in realizado com sucesso!",
      registration: {
        name: updated.name,
        code: updated.registrationCode,
        batchName: registration.batch?.name || "Lote Oficial",
        phone: updated.phone,
        cpf: updated.cpf,
        gender: updated.gender,
        medications: updated.medications,
        allergies: updated.allergies,
      }
    });

  } catch (error) {
    console.error("Erro no check-in:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
