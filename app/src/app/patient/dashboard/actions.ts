"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/infrastructure/auth/session";
import { prisma } from "@/infrastructure/db/prisma";
import { PrismaPatientRepository } from "@/infrastructure/patient/prisma-patient-repository";
import {
  getPatientProfile,
  updatePatientProfile,
  addAllergy,
  updateAllergy,
  removeAllergy,
  addDisease,
  removeDisease,
  addMedication,
  removeMedication,
} from "@/application/patient/patient-profile";
import type { AllergySeverity } from "@/domain/patient/types";

const DASHBOARD_PATH = "/patient/dashboard";

function getRepo() {
  return new PrismaPatientRepository(prisma);
}

async function requirePatientId(): Promise<string> {
  const session = await getSession();
  if (!session || session.role !== "PATIENT") {
    throw new Error("Unauthorized");
  }
  return session.domainEntityId;
}

// ─── Identity fields ──────────────────────────────────────────────────────────

export async function updateProfileAction(formData: FormData): Promise<void> {
  const patientId = await requirePatientId();
  const firstName = (formData.get("firstName") as string | null)?.trim();
  const lastName = (formData.get("lastName") as string | null)?.trim();
  const dateOfBirth = (formData.get("dateOfBirth") as string | null)?.trim();

  await updatePatientProfile(
    patientId,
    {
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
      ...(dateOfBirth ? { dateOfBirth: new Date(dateOfBirth) } : {}),
    },
    getRepo()
  );
  revalidatePath(DASHBOARD_PATH);
}

// ─── Allergies ────────────────────────────────────────────────────────────────

export async function addAllergyAction(formData: FormData): Promise<void> {
  const patientId = await requirePatientId();
  const allergen = (formData.get("allergen") as string | null)?.trim() ?? "";
  const reactionType = (formData.get("reactionType") as string | null)?.trim() ?? "";
  const severity = (formData.get("severity") as AllergySeverity) ?? "MILD";
  const dateIdentifiedRaw = (formData.get("dateIdentified") as string | null)?.trim();

  await addAllergy(
    patientId,
    {
      allergen,
      reactionType,
      severity,
      dateIdentified: dateIdentifiedRaw ? new Date(dateIdentifiedRaw) : undefined,
    },
    getRepo()
  );
  revalidatePath(DASHBOARD_PATH);
}

export async function updateAllergyAction(formData: FormData): Promise<void> {
  const patientId = await requirePatientId();
  const allergyId = formData.get("allergyId") as string;

  // Ownership check: ensure this allergy belongs to the authenticated patient.
  // A patient must not be able to modify another patient's allergy by crafting
  // a request with a foreign allergyId.
  const profile = await getPatientProfile(patientId, getRepo());
  if (!profile?.allergies.some((a) => a.id === allergyId)) return;

  const allergen = (formData.get("allergen") as string | null)?.trim();
  const reactionType = (formData.get("reactionType") as string | null)?.trim();
  const severity = formData.get("severity") as AllergySeverity | null;
  const dateIdentifiedRaw = (formData.get("dateIdentified") as string | null)?.trim();

  await updateAllergy(
    allergyId,
    {
      ...(allergen ? { allergen } : {}),
      ...(reactionType ? { reactionType } : {}),
      ...(severity ? { severity } : {}),
      // Empty string → explicit null (clear the date); absent → omit (don't update)
      ...(dateIdentifiedRaw !== undefined
        ? { dateIdentified: dateIdentifiedRaw ? new Date(dateIdentifiedRaw) : null }
        : {}),
    },
    getRepo()
  );
  revalidatePath(DASHBOARD_PATH);
}

export async function removeAllergyAction(formData: FormData): Promise<void> {
  const patientId = await requirePatientId();
  const allergyId = formData.get("allergyId") as string;

  // Ownership check before deletion.
  const profile = await getPatientProfile(patientId, getRepo());
  if (!profile?.allergies.some((a) => a.id === allergyId)) return;

  await removeAllergy(allergyId, getRepo());
  revalidatePath(DASHBOARD_PATH);
}

// ─── Chronic diseases ─────────────────────────────────────────────────────────

export async function addDiseaseAction(formData: FormData): Promise<void> {
  const patientId = await requirePatientId();
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  await addDisease(patientId, name, getRepo());
  revalidatePath(DASHBOARD_PATH);
}

export async function removeDiseaseAction(formData: FormData): Promise<void> {
  const patientId = await requirePatientId();
  const diseaseId = formData.get("diseaseId") as string;

  // Ownership check.
  const profile = await getPatientProfile(patientId, getRepo());
  if (!profile?.diseases.some((d) => d.id === diseaseId)) return;

  await removeDisease(diseaseId, getRepo());
  revalidatePath(DASHBOARD_PATH);
}

// ─── Medications ──────────────────────────────────────────────────────────────

export async function addMedicationAction(formData: FormData): Promise<void> {
  const patientId = await requirePatientId();
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  await addMedication(patientId, name, getRepo());
  revalidatePath(DASHBOARD_PATH);
}

export async function removeMedicationAction(formData: FormData): Promise<void> {
  const patientId = await requirePatientId();
  const medicationId = formData.get("medicationId") as string;

  // Ownership check.
  const profile = await getPatientProfile(patientId, getRepo());
  if (!profile?.medications.some((m) => m.id === medicationId)) return;

  await removeMedication(medicationId, getRepo());
  revalidatePath(DASHBOARD_PATH);
}
