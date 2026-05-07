import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { patientProfile: { findUnique: vi.fn() } } }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import PatientProfilePage from "../page";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const mockAuth = vi.mocked(auth);
const mockFindUnique = vi.mocked(prisma.patientProfile.findUnique);

const session = { user: { id: "1", email: "pacjent@test.pl", role: "PACJENT" } };

describe("PatientProfilePage", () => {
  it("pokazuje zachętę do uzupełnienia gdy profil pusty", async () => {
    mockAuth.mockResolvedValueOnce(session as never);
    mockFindUnique.mockResolvedValueOnce({ firstName: "", lastName: "" } as never);

    render(await PatientProfilePage());

    expect(screen.getByText("Uzupełnij swój profil")).toBeInTheDocument();
  });

  it("wyświetla dane profilu gdy są uzupełnione", async () => {
    mockAuth.mockResolvedValueOnce(session as never);
    mockFindUnique.mockResolvedValueOnce({
      firstName: "Anna",
      lastName: "Kowalska",
      dateOfBirth: "1985-03-15",
      allergies: "Penicylina",
      chronicDiseases: "Nadciśnienie",
      medications: "Amlodypina",
    } as never);

    render(await PatientProfilePage());

    expect(screen.getAllByText("Anna Kowalska").length).toBeGreaterThan(0);
    expect(screen.getByText("1985-03-15")).toBeInTheDocument();
    expect(screen.getByText("Penicylina")).toBeInTheDocument();
    expect(screen.getByText("Nadciśnienie")).toBeInTheDocument();
  });
});
