# #19 — Crash na null w formData

## What to build

Zabezpieczyć wszystkie server actions przed crashem gdy `formData.get()` zwraca `null`. Wzorzec `(formData.get("x") as string).trim()` rzuca `TypeError: Cannot read properties of null` gdy pole nie zostanie przesłane.

## Acceptance criteria

- [ ] Wszystkie server actions w `src/app/actions/` używają bezpiecznego odczytu pól: `((formData.get("x") ?? "") as string).trim()` lub odpowiednika
- [ ] Dotyczy plików: `patient.ts`, `doctor.ts`, `slots.ts`, `visits.ts`, `documents.ts`
- [ ] Brak `as string` bez null-guard na `formData.get()`
- [ ] Testy weryfikują zachowanie przy brakujących polach formularza

## Blocked by

None — can start immediately
