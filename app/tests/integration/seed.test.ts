/**
 * Integration test: seed.ts creates correct domain entities
 *
 * Tests behavior through the Prisma repository port — no mocks, real SQLite.
 * Runs via: tsx --test tests/integration/seed.test.ts
 */
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { createPrismaClient } from "../../src/infrastructure/db/prisma.js";
import type { PrismaClient } from "../../src/generated/prisma/client.js";

const APP_ROOT = path.resolve(__dirname, "../..");
const TEST_DB_PATH = path.resolve(APP_ROOT, "prisma/test.db");
const TEST_DB_URL = `file:${TEST_DB_PATH}`;

let prisma: ReturnType<typeof createPrismaClient>;

describe("seed", () => {
  before(async () => {
    // Delete any stale test DB from a previous crashed run to guarantee isolation
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
  });

  after(async () => {
    await prisma.$disconnect();
    for (const suffix of ["", "-wal", "-shm"]) {
      const p = TEST_DB_PATH + suffix;
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  });

  it("creates exactly one PATIENT user", async () => {
    const patients = await prisma.user.findMany({ where: { role: "PATIENT" } });
    assert.equal(patients.length, 1);
    assert.ok(patients[0].email);
  });

  it("creates exactly one DOCTOR user", async () => {
    const doctors = await prisma.user.findMany({ where: { role: "DOCTOR" } });
    assert.equal(doctors.length, 1);
    assert.ok(doctors[0].email);
  });

  it("seeded patient has a complete profile with allergies, diseases, and medications", async () => {
    const patient = await prisma.patient.findFirst({
      include: { allergies: true, diseases: true, medications: true },
    });

    assert.ok(patient, "patient should exist");
    assert.ok(patient.firstName);
    assert.ok(patient.lastName);
    assert.ok(patient.dateOfBirth);
    assert.ok(patient.allergies.length > 0, "patient should have allergies");
    assert.ok(patient.diseases.length > 0, "patient should have chronic diseases");
    assert.ok(patient.medications.length > 0, "patient should have medications");

    const allergy = patient.allergies[0];
    assert.ok(allergy.allergen);
    assert.ok(allergy.reactionType);
    assert.ok(["MILD", "MODERATE", "SEVERE"].includes(allergy.severity));
  });

  it("seeded doctor has a complete profile with a schedule", async () => {
    const doctor = await prisma.doctor.findFirst({ include: { schedule: true } });

    assert.ok(doctor, "doctor should exist");
    assert.ok(doctor.firstName);
    assert.ok(doctor.lastName);
    assert.ok(doctor.specialization);

    const schedule = doctor.schedule;
    assert.ok(schedule, "doctor should have a schedule");
    assert.ok(schedule.activeDays);
    assert.ok(JSON.parse(schedule.activeDays).length > 0, "schedule should have active days");
    assert.match(schedule.startTime, /^\d{2}:\d{2}$/);
    assert.match(schedule.endTime, /^\d{2}:\d{2}$/);
    assert.ok(schedule.slotDurationMinutes > 0);
  });

  it("creates exactly two users total", async () => {
    const total = await prisma.user.count();
    assert.equal(total, 2);
  });
});
