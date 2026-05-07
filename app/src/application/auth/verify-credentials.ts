/**
 * Application service: credential verification.
 *
 * Verifies email/password against the database and returns a session payload
 * containing the user's role and linked domain entity ID (patientId or doctorId).
 * Returns null on any failure so callers cannot distinguish unknown email from
 * wrong password (prevents user enumeration).
 */
import { compare } from "bcryptjs";
import type { PrismaClient } from "@/generated/prisma/client";
import type { SessionPayload } from "@/domain/auth/types";

export async function verifyCredentials(
  email: string,
  password: string,
  db: PrismaClient
): Promise<SessionPayload | null> {
  const user = await db.user.findUnique({
    where: { email },
    include: { patient: true, doctor: true },
  });

  if (!user) return null;

  const passwordMatch = await compare(password, user.hashedPassword);
  if (!passwordMatch) return null;

  const domainEntityId =
    user.role === "PATIENT" ? user.patient?.id : user.doctor?.id;

  if (!domainEntityId) return null;

  return {
    userId: user.id,
    role: user.role,
    domainEntityId,
  };
}
