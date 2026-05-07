# #22 — Odrzucanie rezerwacji przeterminowanych slotów

## What to build

Dodać warunek `dateTime > now` w dwóch miejscach: w server action `bookAppointment` (blokada zapisu) oraz w zapytaniu listującym dostępne sloty dla pacjenta (blokada wyświetlania).

## Acceptance criteria

- [ ] `bookAppointment` zwraca błąd gdy `slot.dateTime <= new Date()` — komunikat "Wybrany termin już minął"
- [ ] Strona `/pacjent/umow-wizyte` pokazuje tylko sloty z `dateTime > new Date()`
- [ ] Strona `/pacjent/umow-wizyte/[doctorId]` pokazuje tylko sloty z `dateTime > new Date()`
- [ ] Lekarz z listą slotów (`/lekarz/terminy`) nadal widzi wszystkie swoje sloty (przeszłe i przyszłe) — tylko booking jest blokowany
- [ ] Test: próba rezerwacji przeterminowanego slotu zwraca odpowiedni błąd

## Blocked by

None — can start immediately
