/**
 * Integration tests: patient profile management use cases
 *
 * Tests all profile use cases through the Prisma repository adapter.
 * No mocks — real SQLite, real Prisma. Covers every acceptance criterion
 * from issue #3:
 *   - getProfile returns all nested data (allergies, diseases, medications)
 *   - updateProfile persists firstName / lastName / dateOfBirth
 *   - addAllergy, updateAllergy, removeAllergy with full field coverage
 *   - addDisease, removeDisease
 *   - addMedication, removeMedication
 *
 * Run: tsx --test tests/integration/patient-profile.test.ts
 */
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { createPrismaClient } from "../../src/infrastructure/db/prisma.js";
import { PrismaPatientRepository } from "../../src/infrastructure/patient/prisma-patient-repository.js";
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
} from "../../src/application/patient/patient-profile.js";

const APP_ROOT = path.resolve(__dirname, "../..");
const TEST_DB_PATH = path.resolve(APP_ROOT, "prisma/patient-profile-test.db");
const TEST_DB_URL = `file:${TEST_DB_PATH}`;

let prisma: ReturnType<typeof createPrismaClient>;
let repo: PrismaPatientRepository;
let patientId: string;

describe("patient profile use cases", () => {
  before(async () => {
    for (const suffix of ["", "-wal", "-shm"]) {
      const p = TEST_DB_PATH + suffix;
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    execSync("npx prisma migrate deploy", {
      cwd: APP_ROOT,
      env: { ...process.env, DATABASE_URL: TEST_DB_URL },
      stdio: "pipe",
    });
    execSync("npx prisma db seed", {
      cwd: APP_ROOT,
      env: { ...process.env, DATABASE_URL: TEST_DB_URL },
      stdio: "pipe",
    });
    prisma = createPrismaClient(TEST_DB_URL);
    repo = new PrismaPatientRepository(prisma);

    const seededPatient = await prisma.patient.findFirst();
    assert.ok(seededPatient, "seed must create a patient");
    patientId = seededPatient.id;
  });

  after(async () => {
    await prisma.$disconnect();
    for (const suffix of ["", "-wal", "-shm"]) {
      const p = TEST_DB_PATH + suffix;
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  });

  // ─── AC: dashboard shows current profile values ───────────────────────────

  describe("getPatientProfile", () => {
    it("returns all identity fields", async () => {
      const profile = await getPatientProfile(patientId, repo);
      assert.ok(profile, "profile must not be null");
      assert.ok(profile.id);
      assert.ok(profile.firstName);
      assert.ok(profile.lastName);
      assert.ok(profile.dateOfBirth instanceof Date);
    });

    it("returns allergies with all fields including optional dateIdentified", async () => {
      const profile = await getPatientProfile(patientId, repo);
      assert.ok(profile!.allergies.length > 0, "seeded patient should have allergies");

      const withDate = profile!.allergies.find((a) => a.dateIdentified !== null);
      assert.ok(withDate, "at least one allergy should have dateIdentified");
      assert.ok(withDate.allergen);
      assert.ok(withDate.reactionType);
      assert.ok(["MILD", "MODERATE", "SEVERE"].includes(withDate.severity));
      assert.ok(withDate.dateIdentified instanceof Date);

      const withoutDate = profile!.allergies.find((a) => a.dateIdentified === null);
      assert.ok(withoutDate, "at least one allergy should have null dateIdentified");
    });

    it("returns chronic diseases", async () => {
      const profile = await getPatientProfile(patientId, repo);
      assert.ok(profile!.diseases.length > 0, "seeded patient should have diseases");
      assert.ok(profile!.diseases[0].id);
      assert.ok(profile!.diseases[0].name);
    });

    it("returns medications", async () => {
      const profile = await getPatientProfile(patientId, repo);
      assert.ok(profile!.medications.length > 0, "seeded patient should have medications");
      assert.ok(profile!.medications[0].id);
      assert.ok(profile!.medications[0].name);
    });

    it("returns null for unknown patientId", async () => {
      const profile = await getPatientProfile("nonexistent-id", repo);
      assert.equal(profile, null);
    });
  });

  // ─── AC: edit first name / last name / date of birth ─────────────────────

  describe("updatePatientProfile", () => {
    it("persists updated firstName and lastName", async () => {
      await updatePatientProfile(patientId, { firstName: "Anne", lastName: "Smith" }, repo);
      const profile = await getPatientProfile(patientId, repo);
      assert.equal(profile!.firstName, "Anne");
      assert.equal(profile!.lastName, "Smith");
    });

    it("persists updated dateOfBirth", async () => {
      const newDob = new Date("1985-07-20");
      await updatePatientProfile(patientId, { dateOfBirth: newDob }, repo);
      const profile = await getPatientProfile(patientId, repo);
      assert.equal(
        profile!.dateOfBirth.toISOString().slice(0, 10),
        "1985-07-20"
      );
    });

    it("returns the updated profile", async () => {
      const result = await updatePatientProfile(
        patientId,
        { firstName: "Anna", lastName: "Kowalska" },
        repo
      );
      assert.equal(result.firstName, "Anna");
      assert.equal(result.lastName, "Kowalska");
    });
  });

  // ─── AC: allergy CRUD ─────────────────────────────────────────────────────

  describe("addAllergy", () => {
    it("persists new allergy entry with all fields", async () => {
      const entry = await addAllergy(
        patientId,
        {
          allergen: "Peanuts",
          reactionType: "Hives",
          severity: "MODERATE",
          dateIdentified: new Date("2020-03-15"),
        },
        repo
      );
      assert.ok(entry.id, "returned entry must have an id");
      assert.equal(entry.allergen, "Peanuts");
      assert.equal(entry.reactionType, "Hives");
      assert.equal(entry.severity, "MODERATE");
      assert.ok(entry.dateIdentified instanceof Date);
    });

    it("persists allergy without optional dateIdentified", async () => {
      const entry = await addAllergy(
        patientId,
        { allergen: "Latex", reactionType: "Contact dermatitis", severity: "MILD" },
        repo
      );
      assert.ok(entry.id);
      assert.equal(entry.dateIdentified, null);
    });

    it("new allergy appears in subsequent getProfile", async () => {
      const entry = await addAllergy(
        patientId,
        { allergen: "Shellfish", reactionType: "Anaphylaxis", severity: "SEVERE" },
        repo
      );
      const profile = await getPatientProfile(patientId, repo);
      assert.ok(profile!.allergies.some((a) => a.id === entry.id));
    });
  });

  describe("updateAllergy", () => {
    it("updates severity and reactionType in DB", async () => {
      const profile = await getPatientProfile(patientId, repo);
      const allergyId = profile!.allergies[0].id;

      await updateAllergy(allergyId, { severity: "MILD", reactionType: "Rash" }, repo);

      const updated = await getPatientProfile(patientId, repo);
      const allergy = updated!.allergies.find((a) => a.id === allergyId);
      assert.equal(allergy!.severity, "MILD");
      assert.equal(allergy!.reactionType, "Rash");
    });

    it("returns the updated allergy", async () => {
      const profile = await getPatientProfile(patientId, repo);
      const allergyId = profile!.allergies[0].id;

      const result = await updateAllergy(allergyId, { allergen: "Aspirin" }, repo);
      assert.equal(result.id, allergyId);
      assert.equal(result.allergen, "Aspirin");
    });
  });

  describe("removeAllergy", () => {
    it("removes allergy from DB", async () => {
      const before = await getPatientProfile(patientId, repo);
      const allergyId = before!.allergies[0].id;

      await removeAllergy(allergyId, repo);

      const after = await getPatientProfile(patientId, repo);
      assert.ok(!after!.allergies.some((a) => a.id === allergyId));
    });
  });

  // ─── AC: chronic disease add / remove ────────────────────────────────────

  describe("addDisease", () => {
    it("persists new chronic disease entry", async () => {
      const entry = await addDisease(patientId, "Type 2 Diabetes", repo);
      assert.ok(entry.id);
      assert.equal(entry.name, "Type 2 Diabetes");
    });

    it("new disease appears in subsequent getProfile", async () => {
      const entry = await addDisease(patientId, "Hypertension", repo);
      const profile = await getPatientProfile(patientId, repo);
      assert.ok(profile!.diseases.some((d) => d.id === entry.id));
    });
  });

  describe("removeDisease", () => {
    it("removes disease from DB", async () => {
      const profile = await getPatientProfile(patientId, repo);
      const diseaseId = profile!.diseases[0].id;

      await removeDisease(diseaseId, repo);

      const after = await getPatientProfile(patientId, repo);
      assert.ok(!after!.diseases.some((d) => d.id === diseaseId));
    });
  });

  // ─── AC: medication add / remove ─────────────────────────────────────────

  describe("addMedication", () => {
    it("persists new medication entry", async () => {
      const entry = await addMedication(patientId, "Metformin 500 mg", repo);
      assert.ok(entry.id);
      assert.equal(entry.name, "Metformin 500 mg");
    });

    it("new medication appears in subsequent getProfile", async () => {
      const entry = await addMedication(patientId, "Aspirin 75 mg", repo);
      const profile = await getPatientProfile(patientId, repo);
      assert.ok(profile!.medications.some((m) => m.id === entry.id));
    });
  });

  describe("removeMedication", () => {
    it("removes medication from DB", async () => {
      const profile = await getPatientProfile(patientId, repo);
      const medId = profile!.medications[0].id;

      await removeMedication(medId, repo);

      const after = await getPatientProfile(patientId, repo);
      assert.ok(!after!.medications.some((m) => m.id === medId));
    });
  });
});
