// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/session", () => ({ getSession: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    slot: { findUnique: vi.fn(), update: vi.fn() },
    appointment: { create: vi.fn() },
    $transaction: vi.fn((ops: unknown[]) => Promise.all(ops)),
  },
}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { bookAppointment } from "../appointments";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const mockGetSession = vi.mocked(getSession);
const mockFindSlot = vi.mocked(prisma.slot.findUnique);
const mockTransaction = vi.mocked(prisma.$transaction);
const mockRedirect = vi.mocked(redirect);
const session = { id: "1", email: "pacjent@test.pl", role: "PACJENT" };

describe("bookAppointment", () => {
  beforeEach(() => vi.clearAllMocks());

  it("zwraca błąd gdy brak zgody", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    const formData = new FormData();
    formData.set("slotId", "slot-1");
    const result = await bookAppointment(null, formData);
    expect(result).toEqual({ error: "Zgoda na udostępnienie danych jest wymagana" });
  });

  it("zwraca błąd gdy slot niedostępny", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    mockFindSlot.mockResolvedValueOnce({
      id: "slot-1",
      status: "ZAREZERWOWANY",
      doctorId: "2",
    } as never);

    const formData = new FormData();
    formData.set("slotId", "slot-1");
    formData.set("consent", "on");

    const result = await bookAppointment(null, formData);
    expect(result).toEqual({ error: "Wybrany termin nie jest już dostępny" });
  });

  it("tworzy wizytę i przekierowuje przy poprawnych danych", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    mockFindSlot.mockResolvedValueOnce({
      id: "slot-1",
      status: "DOSTEPNY",
      doctorId: "2",
    } as never);
    mockTransaction.mockResolvedValueOnce([] as never);

    const formData = new FormData();
    formData.set("slotId", "slot-1");
    formData.set("consent", "on");

    await bookAppointment(null, formData).catch(() => {});

    expect(mockTransaction).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith("/pacjent/wizyty");
  });
});
