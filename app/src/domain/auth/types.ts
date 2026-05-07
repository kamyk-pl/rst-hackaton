/**
 * Domain types for authentication.
 * These types are the language of the auth domain — no framework dependencies.
 */

export type UserRole = "PATIENT" | "DOCTOR";

export interface SessionPayload {
  userId: string;
  role: UserRole;
  /** The ID of the domain entity linked to this user (patientId or doctorId). */
  domainEntityId: string;
}
