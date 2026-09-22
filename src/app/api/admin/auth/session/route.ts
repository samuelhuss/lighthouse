import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/env";

const sessionSchema = z.object({ accessToken: z.string().min(1) });

export async function POST(request: Request) {
  try {
    const { accessToken } = sessionSchema.parse(await request.json());
    const env = getEnv();
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: { message: "Autenticação ainda não está configurada." } }, { status: 503 });
    }

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user) return NextResponse.json({ error: { message: "Sessão inválida." } }, { status: 401 });

    const roles = (data.user.app_metadata?.roles ?? []) as string[];
    if (!roles.includes("ADMIN") && !roles.includes("STAFF")) {
      return NextResponse.json({ error: { message: "Esta conta não possui acesso administrativo." } }, { status: 403 });
    }

    const response = NextResponse.json({ user: { email: data.user.email, roles } });
    response.cookies.set("admin_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
    return response;
  } catch {
    return NextResponse.json({ error: { message: "Não foi possível criar a sessão." } }, { status: 400 });
  }
}