import { randomInt } from "crypto";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 to avoid ambiguity
const CODE_LENGTH = 6;

/**
 * Generates a human-friendly registration code, e.g. "REG-A83F21".
 * Uniqueness must still be enforced at the database level (unique constraint)
 * and the caller should retry generation on conflict.
 */
export function generateRegistrationCode(): string {
  let suffix = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    suffix += CODE_ALPHABET[randomInt(0, CODE_ALPHABET.length)];
  }
  return `REG-${suffix}`;
}
