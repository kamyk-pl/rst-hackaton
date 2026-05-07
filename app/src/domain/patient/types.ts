/**
 * Domain types for the Patient profile bounded context.
 * Pure TypeScript — no framework or infrastructure dependencies.
 */

export type AllergySeverity = "MILD" | "MODERATE" | "SEVERE";

export interface AllergyEntry {
  id: string;
  allergen: string;
  reactionType: string;
  severity: AllergySeverity;
  dateIdentified: Date | null;
}

export interface ChronicDiseaseEntry {
  id: string;
  name: string;
}

export interface MedicationEntry {
  id: string;
  name: string;
}

export interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  allergies: AllergyEntry[];
  diseases: ChronicDiseaseEntry[];
  medications: MedicationEntry[];
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
}

export interface CreateAllergyInput {
  allergen: string;
  reactionType: string;
  severity: AllergySeverity;
  dateIdentified?: Date | null;
}

export type UpdateAllergyInput = Partial<CreateAllergyInput>;
