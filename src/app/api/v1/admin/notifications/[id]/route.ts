import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(request);
  const { id } = await params;
  await prisma.notificationRule.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
