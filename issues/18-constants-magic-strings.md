# #18 — Stałe zamiast magic strings

## What to build

Wyekstrahować wszystkie magic stringi dla ról, statusów slotów i statusów wizyt do jednego pliku `src/lib/constants.ts`, a następnie zastąpić wszystkie wystąpienia w kodzie.

## Acceptance criteria

- [ ] Plik `src/lib/constants.ts` zawiera stałe: `ROLE`, `SLOT_STATUS`, `APPOINTMENT_STATUS`
- [ ] Wszystkie server actions używają stałych zamiast literałów (`"PACJENT"`, `"LEKARZ"`, `"DOSTEPNY"`, `"ZAREZERWOWANY"`, `"ZAPLANOWANA"`, `"ZAKONCZONA"`)
- [ ] Wszystkie strony (page.tsx) używają stałych w porównaniach statusów
- [ ] Brak wystąpień literałów statusów/ról poza `constants.ts` i plikami testowymi
- [ ] Testy przechodzą po zmianie

## Blocked by

None — can start immediately
