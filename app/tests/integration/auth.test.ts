/**
 * Integration tests: credentials verification
 *
 * Tests the verifyCredentials application service through the Prisma port.
 * No mocks — real SQLite, real bcrypt. Covers:
 *   - correct patient credentials → session payload with PATIENT role + patientId
 *   - correct doctor credentials  → session payload with DOCTOR role + doctorId
 *   - wrong password              → null
 *   - unknown email               → null
 *
 * Run: tsx --test tests/integration/auth.test.ts
 */
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { createPrismaClient } from "../../src/infrastructure/db/prisma.js";
import { verifyCredentials } from "../../src/application/auth/verify-credentials.js";

const APP_ROOT = path.resolve(__dirname, "../..");
const TEST_DB_PATH = path.resolve(APP_ROOT, "prisma/auth-test.db");
const TEST_DB_URL = `file:${TEST_DB_PATH}`;

let prisma: ReturnType<typeof createPrismaClient>;

describe("verifyCredentials", () => {
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
  });

  after(async () => {
    await prisma.$disconnect();
    for (const suffix of ["", "-wal", "-shm"]) {
      const p = TEST_DB_PATH + suffix;
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  });

  it("accepts correct patient credentials and returns PATIENT session payload", async () => {
    const result = await verifyCredentials("patient@medbridge.dev", "patient123", prisma);
    assert.ok(result, "should return a session payload");
    assert.equal(result.role, "PATIENT");
    assert.ok(result.userId, "session must contain userId");
    assert.ok(result.domainEntityId, "session must contain domainEntityId (patientId)");
  });

  it("accepts correct doctor credentials and returns DOCTOR session payload", async () => {
    const result = await verifyCredentials("doctor@medbridge.dev", "doctor123", prisma);
    assert.ok(result, "should return a session payload");
    assert.equal(result.role, "DOCTOR");
    assert.ok(result.userId, "session must contain userId");
    assert.ok(result.domainEntityId, "session must contain domainEntityId (doctorId)");
  });

  it("rejects wrong password", async () => {
    const result = await verifyCredentials("patient@medbridge.dev", "wrongpassword", prisma);
    assert.equal(result, null, "wrong password must return null");
  });

  it("rejects unknown email", async () => {
    const result = await verifyCredentials("nobody@medbridge.dev", "patient123", prisma);
    assert.equal(result, null, "unknown email must return null");
  });
});
