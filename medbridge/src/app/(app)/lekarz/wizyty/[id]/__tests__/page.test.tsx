import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { appointment: { findUnique: vi.fn() } },
}));
vi.mock("next/navigation", () => ({ redirect: vi.fn(), notFound: vi.fn() }));

import AppointmentDetailPage from "../page";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const mockAuth = vi.mocked(auth);
const mockFindUnique = vi.mocked(prisma.appointment.findUnique);
const session = { user: { id: "2", email: "lekarz@test.pl", role: "LEKARZ" } };

const makeAppointment = (overrides = {}) => ({
  id: "apt-1",
  doctorId: "2",
  status: "ZAPLANOWANA",
  consentGranted: true,
  slot: { dateTime: new Date("2026-06-01T10:00:00") },
  patient: {
    email: "pacjent@test.pl",
    patientProfile: {
      firstName: "Anna",
      lastName: "Kowalska",
      dateOfBirth: "1985-03-15",
      allergies: "Penicylina",
      chronicDiseases: "Nadciśnienie",
      medications: "Amlodypina",
    },
    documents: [],
  },
  visitSummary: null,
  ...overrides,
});

describe("AppointmentDetailPage", () => {
  it("pokazuje dane pacjenta gdy zgoda wyrażona", async () => {
    mockAuth.mockResolvedValueOnce(session as never);
    mockFindUnique.mockResolvedValueOnce(makeAppointment() as never);
    render(await AppointmentDetailPage({ params: Promise.resolve({ id: "apt-1" }) }));
    expect(screen.getAllByText("Anna Kowalska").length).toBeGreaterThan(0);
    expect(screen.getByText("Penicylina")).toBeInTheDocument();
    expect(screen.getByText("Nadciśnienie")).toBeInTheDocument();
  });

  it("pokazuje komunikat o braku zgody gdy consentGranted=false", async () => {
    mockAuth.mockResolvedValueOnce(session as never);
    mockFindUnique.mockResolvedValueOnce(
      makeAppointment({ consentGranted: false }) as never
    );
    render(await AppointmentDetailPage({ params: Promise.resolve({ id: "apt-1" }) }));
    expect(
      screen.getByText(/nie wyraził zgody na udostępnienie danych/)
    ).toBeInTheDocument();
  });

  it("pokazuje link do podsumowania gdy wizyta ZAPLANOWANA", async () => {
    mockAuth.mockResolvedValueOnce(session as never);
    mockFindUnique.mockResolvedValueOnce(makeAppointment() as never);
    render(await AppointmentDetailPage({ params: Promise.resolve({ id: "apt-1" }) }));
    expect(screen.getByText("Dodaj podsumowanie wizyty")).toBeInTheDocument();
  });
});
