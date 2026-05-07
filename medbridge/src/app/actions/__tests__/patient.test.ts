// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/session", () => ({ getSession: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { patientProfile: { upsert: vi.fn() } },
}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { updatePatientProfile } from "../patient";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const mockGetSession = vi.mocked(getSession);
const mockUpsert = vi.mocked(prisma.patientProfile.upsert);
const mockRedirect = vi.mocked(redirect);

const session = { id: "1", email: "pacjent@test.pl", role: "PACJENT" };

describe("updatePatientProfile", () => {
  beforeEach(() => vi.clearAllMocks());

  it("nie crashuje gdy pola formularza są null (brak pól w FormData)", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    const formData = new FormData(); // brak jakichkolwiek pól
    const result = await updatePatientProfile(null, formData);
    expect(result).toEqual({ error: "Imię i nazwisko są wymagane" });
  });

  it("zwraca błąd gdy brak imienia", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);

    const formData = new FormData();
    formData.set("firstName", "");
    formData.set("lastName", "Kowalska");

    const result = await updatePatientProfile(null, formData);
    expect(result).toEqual({ error: "Imię i nazwisko są wymagane" });
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it("zwraca błąd gdy brak nazwiska", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);

    const formData = new FormData();
    formData.set("firstName", "Anna");
    formData.set("lastName", "");

    const result = await updatePatientProfile(null, formData);
    expect(result).toEqual({ error: "Imię i nazwisko są wymagane" });
  });

  it("zapisuje profil i przekierowuje przy poprawnych danych", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    mockUpsert.mockResolvedValueOnce({} as never);

    const formData = new FormData();
    formData.set("firstName", "Anna");
    formData.set("lastName", "Kowalska");
    formData.set("dateOfBirth", "1985-03-15");
    formData.set("allergies", "Penicylina");
    formData.set("chronicDiseases", "");
    formData.set("medications", "");

    await updatePatientProfile(null, formData).catch(() => {});

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "1" },
        update: expect.objectContaining({ firstName: "Anna", lastName: "Kowalska" }),
      })
    );
    expect(mockRedirect).toHaveBeenCalledWith("/pacjent/profil");
  });
});
