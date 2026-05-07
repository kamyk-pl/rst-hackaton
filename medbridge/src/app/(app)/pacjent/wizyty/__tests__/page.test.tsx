import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { appointment: { findMany: vi.fn() } },
}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import PatientVisitsPage from "../page";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const mockAuth = vi.mocked(auth);
const mockFindMany = vi.mocked(prisma.appointment.findMany);
const session = { user: { id: "1", email: "pacjent@test.pl", role: "PACJENT" } };

const makeAppointment = (status: string) => ({
  id: "apt-1",
  status,
  slot: { dateTime: new Date("2026-06-01T10:00:00") },
  doctor: {
    patientProfile: null,
    doctorProfile: { firstName: "Jan", lastName: "Nowak", specialization: "Kardiolog" },
  },
  visitSummary: null,
});

describe("PatientVisitsPage", () => {
  it("pokazuje komunikat gdy brak wizyt", async () => {
    mockAuth.mockResolvedValueOnce(session as never);
    mockFindMany.mockResolvedValueOnce([] as never);
    render(await PatientVisitsPage());
    expect(screen.getByText("Brak wizyt.")).toBeInTheDocument();
  });

  it("wyświetla zaplanowaną wizytę z nazwiskiem lekarza", async () => {
    mockAuth.mockResolvedValueOnce(session as never);
    mockFindMany.mockResolvedValueOnce([makeAppointment("ZAPLANOWANA")] as never);
    render(await PatientVisitsPage());
    expect(screen.getByText(/Jan Nowak/)).toBeInTheDocument();
    expect(screen.getByText("Zaplanowana")).toBeInTheDocument();
  });

  it("pokazuje link do szczegółów dla wizyty zakończonej", async () => {
    mockAuth.mockResolvedValueOnce(session as never);
    mockFindMany.mockResolvedValueOnce([makeAppointment("ZAKONCZONA")] as never);
    render(await PatientVisitsPage());
    expect(screen.getByText("Zakończona")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "" })).toHaveAttribute(
      "href",
      "/pacjent/wizyty/apt-1"
    );
  });
});
