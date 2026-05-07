// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/session", () => ({ getSession: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    appointment: { findUnique: vi.fn(), update: vi.fn() },
    visitSummary: { create: vi.fn() },
    $transaction: vi.fn((ops: unknown[]) => Promise.all(ops)),
  },
}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { addVisitSummary } from "../visits";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const mockGetSession = vi.mocked(getSession);
const mockFindUnique = vi.mocked(prisma.appointment.findUnique);
const mockTransaction = vi.mocked(prisma.$transaction);
const mockRedirect = vi.mocked(redirect);
const session = { id: "2", email: "lekarz@test.pl", role: "LEKARZ" };

describe("addVisitSummary", () => {
  beforeEach(() => vi.clearAllMocks());

  it("zwraca błąd gdy wizyta już zakończona", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    mockFindUnique.mockResolvedValueOnce({
      id: "apt-1",
      doctorId: "2",
      status: "ZAKONCZONA",
    } as never);

    const formData = new FormData();
    formData.set("appointmentId", "apt-1");

    const result = await addVisitSummary(null, formData);
    expect(result).toEqual({ error: "Ta wizyta została już zakończona" });
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it("zapisuje podsumowanie i przekierowuje", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    mockFindUnique.mockResolvedValueOnce({
      id: "apt-1",
      doctorId: "2",
      status: "ZAPLANOWANA",
    } as never);
    mockTransaction.mockResolvedValueOnce([] as never);

    const formData = new FormData();
    formData.set("appointmentId", "apt-1");
    formData.set("diagnosis", "Nadciśnienie");
    formData.set("recommendations", "Dieta");
    formData.set("prescribedMedications", "Amlodypina");
    formData.set("referrals", "EKG");

    await addVisitSummary(null, formData).catch(() => {});

    expect(mockTransaction).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith("/lekarz/wizyty");
  });
});
