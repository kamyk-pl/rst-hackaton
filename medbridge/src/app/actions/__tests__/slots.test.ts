// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/session", () => ({ getSession: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { slot: { create: vi.fn() } },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { createSlot } from "../slots";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const mockGetSession = vi.mocked(getSession);
const mockCreate = vi.mocked(prisma.slot.create);
const session = { id: "2", email: "lekarz@test.pl", role: "LEKARZ" };

const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
const futureDateStr = futureDate.toISOString().split("T")[0];

describe("createSlot", () => {
  beforeEach(() => vi.clearAllMocks());

  it("zwraca błąd gdy brak daty lub godziny", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    const formData = new FormData();
    formData.set("date", "");
    formData.set("time", "");
    const result = await createSlot(null, formData);
    expect(result).toEqual({ error: "Data i godzina są wymagane" });
  });

  it("zwraca błąd gdy termin jest w przeszłości", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    const formData = new FormData();
    formData.set("date", "2020-01-01");
    formData.set("time", "10:00");
    const result = await createSlot(null, formData);
    expect(result).toEqual({ error: "Termin musi być w przyszłości" });
  });

  it("tworzy slot i zwraca null przy poprawnych danych", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    mockCreate.mockResolvedValueOnce({} as never);
    const formData = new FormData();
    formData.set("date", futureDateStr);
    formData.set("time", "10:00");
    const result = await createSlot(null, formData);
    expect(result).toBeNull();
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          doctorId: "2",
          status: "DOSTEPNY",
        }),
      })
    );
  });
});
