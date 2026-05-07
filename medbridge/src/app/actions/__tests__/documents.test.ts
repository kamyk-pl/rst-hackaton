// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/session", () => ({ getSession: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    medicalDocument: { create: vi.fn(), findUnique: vi.fn(), delete: vi.fn() },
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("fs/promises", () => ({
  writeFile: vi.fn(),
  mkdir: vi.fn(),
  unlink: vi.fn(),
}));

import { uploadDocument, deleteDocument } from "../documents";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const mockGetSession = vi.mocked(getSession);
const mockCreate = vi.mocked(prisma.medicalDocument.create);
const session = { id: "1", email: "pacjent@test.pl", role: "PACJENT" };

describe("uploadDocument", () => {
  beforeEach(() => vi.clearAllMocks());

  it("zwraca błąd gdy brak pliku", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    const formData = new FormData();
    const result = await uploadDocument(null, formData);
    expect(result).toEqual({ error: "Wybierz plik" });
  });

  it("zwraca błąd dla niedozwolonego formatu", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    const formData = new FormData();
    const file = new File(["content"], "test.png", { type: "image/png" });
    formData.set("file", file);
    const result = await uploadDocument(null, formData);
    expect(result).toEqual({ error: "Dozwolone formaty: PDF, JPG" });
  });

  it("zwraca błąd gdy plik za duży", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    const formData = new FormData();
    const bigContent = new Uint8Array(11 * 1024 * 1024);
    const file = new File([bigContent], "big.pdf", { type: "application/pdf" });
    formData.set("file", file);
    const result = await uploadDocument(null, formData);
    expect(result).toEqual({ error: "Plik nie może być większy niż 10 MB" });
  });

  it("zapisuje PDF i zwraca null przy sukcesie", async () => {
    mockGetSession.mockResolvedValueOnce(session as never);
    mockCreate.mockResolvedValueOnce({} as never);
    const formData = new FormData();
    const file = new File(["pdf content"], "wynik.pdf", { type: "application/pdf" });
    formData.set("file", file);
    const result = await uploadDocument(null, formData);
    expect(result).toBeNull();
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ filename: "wynik.pdf", mimeType: "application/pdf" }),
      })
    );
  });
});
