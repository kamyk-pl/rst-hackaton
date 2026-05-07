# #01 — Scaffold projektu + schemat DB + seed

## What to build

Zainicjalizować projekt Next.js z TypeScript, skonfigurować Prisma z SQLite, zdefiniować pełny schemat bazy danych i zaseedować dwóch użytkowników testowych.

## Acceptance criteria

- [ ] Projekt Next.js (App Router) z TypeScript działa lokalnie (`npm run dev`)
- [ ] Tailwind CSS + shadcn/ui skonfigurowane
- [ ] Prisma skonfigurowane z SQLite (`dev.db`)
- [ ] Schemat zawiera modele: `User`, `PatientProfile`, `DoctorProfile`, `MedicalDocument`, `Slot`, `Appointment`, `VisitSummary`
- [ ] `prisma/seed.ts` tworzy konta: `pacjent@test.pl` / `haslo123` (rola PACJENT) i `lekarz@test.pl` / `haslo123` (rola LEKARZ)
- [ ] `npx prisma db seed` działa bez błędów

## Blocked by

None — can start immediately
