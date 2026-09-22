import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * Looks up a previously stored response for the given idempotency key/endpoint
 * pair. If found, the original response should be replayed instead of
 * re-executing the operation (prevents duplicate registrations/charges when a
 * client retries a request).
 */
export async function findIdempotentResponse(key: string, endpoint: string) {
  return prisma.idempotencyKey.findUnique({
    where: { key_endpoint: { key, endpoint } },
  });
}

export async function saveIdempotentResponse(
  key: string,
  endpoint: string,
  statusCode: number,
  response: unknown
) {
  try {
    await prisma.idempotencyKey.create({
      data: {
        key,
        endpoint,
        statusCode,
        response: response as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || (error as { code?: string }).code !== "P2002") {
      throw error;
    }
  }
}
