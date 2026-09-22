import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";

export async function GET() {
  const env = getEnv();
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: { message: "Autenticação ainda não está configurada." } }, { status: 503 });
  }

  return NextResponse.json({ url: env.SUPABASE_URL, anonKey: env.SUPABASE_ANON_KEY }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}