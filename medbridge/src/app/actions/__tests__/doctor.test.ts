// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/session", () => ({ getSession: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { doctorProfile: { upsert: vi.fn() } },
}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { updateDoctorProfile } from "../doctor";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const mockGetSession = vi.mocked(getSession);
const mockUpsert = vi.mocked(prisma.doctorProfile.upsert);
const mockRedirect = vi.mocked(redirect);
const session = { id: "2", email: "lekarz@test.pl", role: "LEKARZ" };

describe("updateDoctorProfile", () => {
  beforeEach(() => vi.clearAllMocks());

  it("zwraca błąd gdy brakuje wymaganego pola", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    const formData = new FormData();
    formData.set("firstName", "Jan");
    formData.set("lastName", "Nowak");
    formData.set("specialization", "");

    const result = await updateDoctorProfile(null, formData);
    expect(result).toEqual({ error: "Wszystkie pola są wymagane" });
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it("zapisuje profil i przekierowuje przy poprawnych danych", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    mockUpsert.mockResolvedValueOnce({} as never);
    const formData = new FormData();
    formData.set("firstName", "Jan");
    formData.set("lastName", "Nowak");
    formData.set("specialization", "Kardiolog");

    await updateDoctorProfile(null, formData).catch(() => {});

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "2" },
        update: { firstName: "Jan", lastName: "Nowak", specialization: "Kardiolog" },
      })
    );
    expect(mockRedirect).toHaveBeenCalledWith("/lekarz/profil");
  });
});
