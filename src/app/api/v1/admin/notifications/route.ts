import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  await requireAdmin(request);
  const items = await prisma.notificationRule.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  await requireAdmin(request);
  const body = await request.json();
  const rule = await prisma.notificationRule.create({
    data: {
      event: body.event,
      action: body.action,
      target: body.target,
    }
  });
  return NextResponse.json({ rule });
}
