// @vitest-environment node
import { describe, it, expect } from "vitest";
import { t, pl } from "../i18n";

describe("i18n", () => {
  it("t() zwraca string dla istniejącego klucza", () => {
    expect(t("nav.myProfile")).toBe("Mój profil");
    expect(t("nav.documents")).toBe("Dokumentacja");
    expect(t("nav.bookVisit")).toBe("Umów wizytę");
  });

  it("t() zwraca klucz gdy tłumaczenie nie istnieje", () => {
    expect(t("nieistniejacy.klucz" as never)).toBe("nieistniejacy.klucz");
  });

  it("pl zawiera wszystkie sekcje nawigacji", () => {
    expect(pl.nav).toBeDefined();
    expect(pl.errors).toBeDefined();
    expect(pl.status).toBeDefined();
  });

  it("statusy wizyt są przetłumaczone", () => {
    expect(t("status.planned")).toBe("Zaplanowana");
    expect(t("status.completed")).toBe("Zakończona");
  });

  it("komunikaty błędów istnieją", () => {
    expect(t("errors.noAccess")).toBe("Brak dostępu");
    expect(t("errors.invalidCredentials")).toBe("Nieprawidłowy email lub hasło");
  });
});
