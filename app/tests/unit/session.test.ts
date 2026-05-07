/**
 * Unit tests: session JWT encrypt/decrypt roundtrip
 *
 * Tests the pure crypto layer — no Next.js cookies(), no DB.
 * Verifies that encrypted tokens faithfully preserve userId, role, domainEntityId,
 * and that invalid / expired / malformed tokens are safely rejected.
 *
 * Run: tsx --test tests/unit/session.test.ts
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SignJWT } from "jose";
import { encrypt, decrypt } from "../../src/infrastructure/auth/session.js";

const PATIENT_PAYLOAD = {
  userId: "user-patient-1",
  role: "PATIENT" as const,
  domainEntityId: "patient-1",
};

const DOCTOR_PAYLOAD = {
  userId: "user-doctor-1",
  role: "DOCTOR" as const,
  domainEntityId: "doctor-1",
};

describe("session encrypt/decrypt", () => {
  it("roundtrip preserves all fields for PATIENT session", async () => {
    const token = await encrypt(PATIENT_PAYLOAD);
    assert.ok(typeof token === "string" && token.length > 0, "token should be a non-empty string");

    const payload = await decrypt(token);
    assert.ok(payload, "decrypted payload should not be null");
    assert.equal(payload.userId, PATIENT_PAYLOAD.userId);
    assert.equal(payload.role, "PATIENT");
    assert.equal(payload.domainEntityId, PATIENT_PAYLOAD.domainEntityId);
  });

  it("roundtrip preserves all fields for DOCTOR session", async () => {
    const token = await encrypt(DOCTOR_PAYLOAD);
    const payload = await decrypt(token);
    assert.ok(payload, "decrypted payload should not be null");
    assert.equal(payload.userId, DOCTOR_PAYLOAD.userId);
    assert.equal(payload.role, "DOCTOR");
    assert.equal(payload.domainEntityId, DOCTOR_PAYLOAD.domainEntityId);
  });

  it("returns null for a tampered token", async () => {
    const token = await encrypt(PATIENT_PAYLOAD);
    const tampered = token.slice(0, -5) + "XXXXX";
    const payload = await decrypt(tampered);
    assert.equal(payload, null, "tampered token should return null");
  });

  it("returns null for an empty string", async () => {
    const payload = await decrypt("");
    assert.equal(payload, null);
  });
});

describe("session decrypt — malformed or invalid tokens", () => {
  // Build a JWT with the same key the module uses (dev secret)
  const secret = new TextEncoder().encode("dev-secret-change-me-in-production");

  it("returns null for a JWT that is already expired", async () => {
    const token = await new SignJWT({ userId: "u1", role: "PATIENT", domainEntityId: "e1" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("-1s") // expired 1 second ago
      .sign(secret);

    const payload = await decrypt(token);
    assert.equal(payload, null, "expired token must return null");
  });

  it("returns null for a JWT with a missing role field", async () => {
    const token = await new SignJWT({ userId: "u1", domainEntityId: "e1" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const payload = await decrypt(token);
    assert.equal(payload, null, "JWT without role must return null");
  });

  it("returns null for a JWT with an unrecognised role value", async () => {
    const token = await new SignJWT({ userId: "u1", role: "ADMIN", domainEntityId: "e1" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const payload = await decrypt(token);
    assert.equal(payload, null, "JWT with unknown role must return null");
  });

  it("returns null for a JWT with a missing userId", async () => {
    const token = await new SignJWT({ role: "PATIENT", domainEntityId: "e1" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const payload = await decrypt(token);
    assert.equal(payload, null, "JWT without userId must return null");
  });
});
