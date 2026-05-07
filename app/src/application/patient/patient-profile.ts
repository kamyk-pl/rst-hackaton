/**
 * Application use cases: Patient profile management.
 *
 * Each function accepts a PatientRepository port so the dependency is inverted —
 * callers inject the concrete adapter (Prisma) but these functions remain
 * infrastructure-agnostic and fully testable without a database.
 */
import type { PatientRepository } from "@/domain/patient/patient-repository";
import type {
  PatientProfile,
  AllergyEntry,
  ChronicDiseaseEntry,
  MedicationEntry,
  UpdateProfileInput,
  CreateAllergyInput,
  UpdateAllergyInput,
} from "@/domain/patient/types";

export async function getPatientProfile(
  patientId: string,
  repo: PatientRepository
): Promise<PatientProfile | null> {
  return repo.getProfile(patientId);
}

export async function updatePatientProfile(
  patientId: string,
  data: UpdateProfileInput,
  repo: PatientRepository
): Promise<PatientProfile> {
  return repo.updateProfile(patientId, data);
}

export async function addAllergy(
  patientId: string,
  input: CreateAllergyInput,
  repo: PatientRepository
): Promise<AllergyEntry> {
  return repo.addAllergy(patientId, input);
}

export async function updateAllergy(
  allergyId: string,
  data: UpdateAllergyInput,
  repo: PatientRepository
): Promise<AllergyEntry> {
  return repo.updateAllergy(allergyId, data);
}

export async function removeAllergy(
  allergyId: string,
  repo: PatientRepository
): Promise<void> {
  return repo.removeAllergy(allergyId);
}

export async function addDisease(
  patientId: string,
  name: string,
  repo: PatientRepository
): Promise<ChronicDiseaseEntry> {
  return repo.addDisease(patientId, name);
}

export async function removeDisease(
  diseaseId: string,
  repo: PatientRepository
): Promise<void> {
  return repo.removeDisease(diseaseId);
}

export async function addMedication(
  patientId: string,
  name: string,
  repo: PatientRepository
): Promise<MedicationEntry> {
  return repo.addMedication(patientId, name);
}

export async function removeMedication(
  medicationId: string,
  repo: PatientRepository
): Promise<void> {
  return repo.removeMedication(medicationId);
}
