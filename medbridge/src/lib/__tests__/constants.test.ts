// @vitest-environment node
import { describe, it, expect } from "vitest";
import { ROLE, SLOT_STATUS, APPOINTMENT_STATUS } from "../constants";

describe("constants", () => {
  it("ROLE zawiera PACJENT i LEKARZ", () => {
    expect(ROLE.PACJENT).toBe("PACJENT");
    expect(ROLE.LEKARZ).toBe("LEKARZ");
  });

  it("SLOT_STATUS zawiera DOSTEPNY i ZAREZERWOWANY", () => {
    expect(SLOT_STATUS.DOSTEPNY).toBe("DOSTEPNY");
    expect(SLOT_STATUS.ZAREZERWOWANY).toBe("ZAREZERWOWANY");
  });

  it("APPOINTMENT_STATUS zawiera ZAPLANOWANA i ZAKONCZONA", () => {
    expect(APPOINTMENT_STATUS.ZAPLANOWANA).toBe("ZAPLANOWANA");
    expect(APPOINTMENT_STATUS.ZAKONCZONA).toBe("ZAKONCZONA");
  });
});
