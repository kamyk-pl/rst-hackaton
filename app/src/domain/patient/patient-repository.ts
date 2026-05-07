/**
 * Repository port for the Patient profile bounded context.
 * This interface is the boundary between the application and infrastructure layers.
 * All use cases depend on this abstraction, never on Prisma directly.
 */
import type {
  PatientProfile,
  AllergyEntry,
  ChronicDiseaseEntry,
  MedicationEntry,
  UpdateProfileInput,
  CreateAllergyInput,
  UpdateAllergyInput,
} from "./types";

export interface PatientRepository {
  getProfile(patientId: string): Promise<PatientProfile | null>;
  updateProfile(patientId: string, data: UpdateProfileInput): Promise<PatientProfile>;

  addAllergy(patientId: string, allergy: CreateAllergyInput): Promise<AllergyEntry>;
  updateAllergy(allergyId: string, data: UpdateAllergyInput): Promise<AllergyEntry>;
  removeAllergy(allergyId: string): Promise<void>;

  addDisease(patientId: string, name: string): Promise<ChronicDiseaseEntry>;
  removeDisease(diseaseId: string): Promise<void>;

  addMedication(patientId: string, name: string): Promise<MedicationEntry>;
  removeMedication(medicationId: string): Promise<void>;
}
