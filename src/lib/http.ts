import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type { ZodType } from "zod";
import { AppError, ValidationError, InternalError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export function getRequestId(request: Request): string {
  return request.headers.get("x-request-id") ?? randomUUID();
}

export async function parseJsonBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ValidationError("Corpo da requisição inválido (JSON esperado).");
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ValidationError("Dados inválidos.", result.error.flatten());
  }

  return result.data;
}

export function errorResponse(error: unknown, requestId?: string): NextResponse {
  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      logger.error({ err: error, code: error.code, requestId }, error.message);
    } else {
      logger.warn({ code: error.code, requestId }, error.message);
    }

    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        },
      },
      { status: error.statusCode }
    );
  }

  const internal = new InternalError();
  logger.error({ err: error, requestId }, "Unhandled error");

  return NextResponse.json(
    { error: { code: internal.code, message: internal.message } },
    { status: internal.statusCode }
  );
}
