// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

const { MockAuthError } = vi.hoisted(() => {
  class MockAuthError extends Error {
    constructor(message?: string) {
      super(message);
      this.name = "AuthError";
    }
  }
  return { MockAuthError };
});

vi.mock("next-auth", () => ({ AuthError: MockAuthError }));
vi.mock("@/lib/auth", () => ({ signIn: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: vi.fn() } },
}));

import { login } from "../auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

const mockSignIn = vi.mocked(signIn);
const mockFindUnique = vi.mocked(prisma.user.findUnique);
const mockRedirect = vi.mocked(redirect);

describe("login action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("zwraca błąd przy nieprawidłowych danych logowania", async () => {
    mockSignIn.mockRejectedValueOnce(new MockAuthError("CredentialsSignin"));

    const formData = new FormData();
    formData.set("email", "zly@test.pl");
    formData.set("password", "zlehaslo");

    const result = await login(null, formData);

    expect(result).toEqual({ error: "Nieprawidłowy email lub hasło" });
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("przekierowuje pacjenta na /pacjent/profil", async () => {
    mockSignIn.mockResolvedValueOnce(undefined);
    mockFindUnique.mockResolvedValueOnce({
      id: "1",
      email: "pacjent@test.pl",
      role: "PACJENT",
      hashedPassword: "hash",
      createdAt: new Date(),
    });

    const formData = new FormData();
    formData.set("email", "pacjent@test.pl");
    formData.set("password", "haslo123");

    await login(null, formData).catch(() => {});

    expect(mockRedirect).toHaveBeenCalledWith("/pacjent/profil");
  });

  it("przekierowuje lekarza na /lekarz/wizyty", async () => {
    mockSignIn.mockResolvedValueOnce(undefined);
    mockFindUnique.mockResolvedValueOnce({
      id: "2",
      email: "lekarz@test.pl",
      role: "LEKARZ",
      hashedPassword: "hash",
      createdAt: new Date(),
    });

    const formData = new FormData();
    formData.set("email", "lekarz@test.pl");
    formData.set("password", "haslo123");

    await login(null, formData).catch(() => {});

    expect(mockRedirect).toHaveBeenCalledWith("/lekarz/wizyty");
  });
});
