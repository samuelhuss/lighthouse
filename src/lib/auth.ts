import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/env";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";

export type AdminRole = "ADMIN" | "STAFF";

export interface AdminUser {
  id: string;
  email: string | null;
  roles: AdminRole[];
}

function getSupabaseAdminClient() {
  const env = getEnv();

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase não está configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }

  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function extractBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
}

function extractCookieToken(request: Request): string | null {
  const cookies = request.headers.get("cookie")?.split(";") ?? [];
  const accessCookie = cookies.find((cookie) => cookie.trim().startsWith("admin_access_token="));
  return accessCookie?.split("=").slice(1).join("=").trim() || null;
}

/**
 * Validates the caller's Supabase access token and ensures it carries an
 * admin-level role (ADMIN or STAFF) before allowing access to /api/v1/admin/*.
 */
export async function requireAdmin(request: Request, allowedRoles: AdminRole[] = ["ADMIN", "STAFF"]): Promise<AdminUser> {
  const token = extractBearerToken(request) ?? extractCookieToken(request);
  if (!token) {
    throw new UnauthorizedError();
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new UnauthorizedError();
  }

  const roles = (data.user.app_metadata?.roles ?? []) as AdminRole[];

  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw new ForbiddenError();
  }

  return { id: data.user.id, email: data.user.email ?? null, roles };
}
