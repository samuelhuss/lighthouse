import { getEnv } from "@/lib/env";
import { UnauthorizedError } from "@/lib/errors";

export function requireInternalJobAuth(request: Request): void {
  const header = request.headers.get("authorization");
  const expected = `Bearer ${getEnv().INTERNAL_JOBS_SECRET}`;

  if (header !== expected) {
    throw new UnauthorizedError();
  }
}