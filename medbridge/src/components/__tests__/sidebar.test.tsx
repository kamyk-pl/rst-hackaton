import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "../sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/pacjent/profil",
}));

vi.mock("@/app/actions/auth", () => ({
  logout: vi.fn(),
}));

describe("Sidebar", () => {
  it("pokazuje nawigację pacjenta dla roli PACJENT", () => {
    render(<Sidebar role="PACJENT" email="pacjent@test.pl" />);

    expect(screen.getByText("Mój profil")).toBeInTheDocument();
    expect(screen.getByText("Dokumentacja")).toBeInTheDocument();
    expect(screen.getByText("Umów wizytę")).toBeInTheDocument();
    expect(screen.getByText("Historia wizyt")).toBeInTheDocument();
    expect(screen.queryByText("Harmonogram wizyt")).not.toBeInTheDocument();
  });

  it("pokazuje nawigację lekarza dla roli LEKARZ", () => {
    render(<Sidebar role="LEKARZ" email="lekarz@test.pl" />);

    expect(screen.getByText("Mój profil")).toBeInTheDocument();
    expect(screen.getByText("Moje terminy")).toBeInTheDocument();
    expect(screen.getByText("Harmonogram wizyt")).toBeInTheDocument();
    expect(screen.queryByText("Umów wizytę")).not.toBeInTheDocument();
  });

  it("wyświetla email i rolę użytkownika", () => {
    render(<Sidebar role="PACJENT" email="pacjent@test.pl" />);

    expect(screen.getByText("pacjent@test.pl")).toBeInTheDocument();
    expect(screen.getByText("Pacjent")).toBeInTheDocument();
  });

  it("wyświetla przycisk wylogowania", () => {
    render(<Sidebar role="PACJENT" email="pacjent@test.pl" />);

    expect(screen.getByText("Wyloguj się")).toBeInTheDocument();
  });
});
