/**
 * Unit tests: proxy routing logic
 *
 * Tests the proxy function directly — no browser, no Next.js server needed.
 * Verifies that route protection decisions are correct for every combination
 * of path × session state.
 *
 * Run: tsx --test tests/unit/proxy.test.ts
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { proxy } from "../../src/proxy.js";
import { encrypt } from "../../src/infrastructure/auth/session.js";

async function makeRequest(
  pathname: string,
  role?: "PATIENT" | "DOCTOR"
): Promise<NextRequest> {
  const url = new URL(`http://localhost${pathname}`);
  if (!role) return new NextRequest(url);

  const token = await encrypt({
    userId: "test-user",
    role,
    domainEntityId: "test-entity",
  });
  return new NextRequest(url, {
    headers: { cookie: `medbridge-session=${token}` },
  });
}

function redirectTarget(response: Response): string {
  return new URL(response.headers.get("location") ?? "").pathname;
}

describe("proxy — /patient/* route protection", () => {
  it("unauthenticated → redirects to /login", async () => {
    const req = await makeRequest("/patient/dashboard");
    const res = await proxy(req);
    assert.equal(res.status, 307);
    assert.equal(redirectTarget(res), "/login");
  });

  it("DOCTOR role → redirects to /login", async () => {
    const req = await makeRequest("/patient/dashboard", "DOCTOR");
    const res = await proxy(req);
    assert.equal(res.status, 307);
    assert.equal(redirectTarget(res), "/login");
  });

  it("PATIENT role → passes through", async () => {
    const req = await makeRequest("/patient/dashboard", "PATIENT");
    const res = await proxy(req);
    // NextResponse.next() has no location header
    assert.equal(res.headers.get("location"), null);
  });
});

describe("proxy — /doctor/* route protection", () => {
  it("unauthenticated → redirects to /login", async () => {
    const req = await makeRequest("/doctor/dashboard");
    const res = await proxy(req);
    assert.equal(res.status, 307);
    assert.equal(redirectTarget(res), "/login");
  });

  it("PATIENT role → redirects to /login", async () => {
    const req = await makeRequest("/doctor/dashboard", "PATIENT");
    const res = await proxy(req);
    assert.equal(res.status, 307);
    assert.equal(redirectTarget(res), "/login");
  });

  it("DOCTOR role → passes through", async () => {
    const req = await makeRequest("/doctor/dashboard", "DOCTOR");
    const res = await proxy(req);
    assert.equal(res.headers.get("location"), null);
  });
});

describe("proxy — unprotected routes pass through", () => {
  it("/ unauthenticated → passes through", async () => {
    const req = await makeRequest("/");
    const res = await proxy(req);
    assert.equal(res.headers.get("location"), null);
  });

  it("/login unauthenticated → passes through", async () => {
    const req = await makeRequest("/login");
    const res = await proxy(req);
    assert.equal(res.headers.get("location"), null);
  });

  it("/login authenticated → passes through (login page renders for all)", async () => {
    const req = await makeRequest("/login", "PATIENT");
    const res = await proxy(req);
    assert.equal(res.headers.get("location"), null);
  });
});
