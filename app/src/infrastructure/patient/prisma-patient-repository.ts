/**
 * Infrastructure adapter: Prisma implementation of PatientRepository.
 *
 * Translates between the Prisma persistence model and the domain types used
 * by application use cases. All data access for patient profiles goes through
 * this adapter.
 */
import type { PrismaClient } from "@/generated/prisma/client";
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

export class PrismaPatientRepository implements PatientRepository {
  constructor(private readonly db: PrismaClient) {}

  async getProfile(patientId: string): Promise<PatientProfile | null> {
    const patient = await this.db.patient.findUnique({
      where: { id: patientId },
      include: { allergies: true, diseases: true, medications: true },
    });
    if (!patient) return null;
    return toProfile(patient);
  }

  async updateProfile(patientId: string, data: UpdateProfileInput): Promise<PatientProfile> {
    const patient = await this.db.patient.update({
      where: { id: patientId },
      data,
      include: { allergies: true, diseases: true, medications: true },
    });
    return toProfile(patient);
  }

  async addAllergy(patientId: string, input: CreateAllergyInput): Promise<AllergyEntry> {
    const allergy = await this.db.allergy.create({
      data: {
        patientId,
        allergen: input.allergen,
        reactionType: input.reactionType,
        severity: input.severity,
        dateIdentified: input.dateIdentified ?? null,
      },
    });
    return toAllergy(allergy);
  }

  async updateAllergy(allergyId: string, data: UpdateAllergyInput): Promise<AllergyEntry> {
    const allergy = await this.db.allergy.update({
      where: { id: allergyId },
      data,
    });
    return toAllergy(allergy);
  }

  async removeAllergy(allergyId: string): Promise<void> {
    await this.db.allergy.delete({ where: { id: allergyId } });
  }

  async addDisease(patientId: string, name: string): Promise<ChronicDiseaseEntry> {
    const disease = await this.db.chronicDisease.create({
      data: { patientId, name },
    });
    return { id: disease.id, name: disease.name };
  }

  async removeDisease(diseaseId: string): Promise<void> {
    await this.db.chronicDisease.delete({ where: { id: diseaseId } });
  }

  async addMedication(patientId: string, name: string): Promise<MedicationEntry> {
    const med = await this.db.patientMedication.create({
      data: { patientId, name },
    });
    return { id: med.id, name: med.name };
  }

  async removeMedication(medicationId: string): Promise<void> {
    await this.db.patientMedication.delete({ where: { id: medicationId } });
  }
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

type PrismaPatientWithIncludes = Awaited<
  ReturnType<PrismaClient["patient"]["findUniqueOrThrow"]> & {
    allergies: Awaited<ReturnType<PrismaClient["allergy"]["findMany"]>>;
    diseases: Awaited<ReturnType<PrismaClient["chronicDisease"]["findMany"]>>;
    medications: Awaited<ReturnType<PrismaClient["patientMedication"]["findMany"]>>;
  }
>;

function toProfile(patient: {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  allergies: Array<{
    id: string;
    allergen: string;
    reactionType: string;
    severity: string;
    dateIdentified: Date | null;
  }>;
  diseases: Array<{ id: string; name: string }>;
  medications: Array<{ id: string; name: string }>;
}): PatientProfile {
  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    dateOfBirth: patient.dateOfBirth,
    allergies: patient.allergies.map(toAllergy),
    diseases: patient.diseases.map((d) => ({ id: d.id, name: d.name })),
    medications: patient.medications.map((m) => ({ id: m.id, name: m.name })),
  };
}

function toAllergy(a: {
  id: string;
  allergen: string;
  reactionType: string;
  severity: string;
  dateIdentified: Date | null;
}): AllergyEntry {
  return {
    id: a.id,
    allergen: a.allergen,
    reactionType: a.reactionType,
    severity: a.severity as AllergyEntry["severity"],
    dateIdentified: a.dateIdentified,
  };
}
