# #12 — Rezerwacja wizyty + zgoda na dane

## What to build

Finalizacja procesu umawiania wizyty: pacjent wybiera slot, wyraża zgodę na udostępnienie danych, tworzy wizytę.

## Acceptance criteria

- [ ] Po wyborze slotu — ekran potwierdzenia z checkbox "Wyrażam zgodę na udostępnienie mojego profilu i dokumentacji medycznej temu lekarzowi"
- [ ] Nie można zarezerwować bez zaznaczenia zgody
- [ ] Po potwierdzeniu: wizyta tworzona ze statusem ZAPLANOWANA, slot oznaczany jako ZAREZERWOWANY
- [ ] Zarezerwowany slot znika z listy dostępnych terminów
- [ ] Przekierowanie na historię wizyt z komunikatem sukcesu
- [ ] Dostęp tylko dla zalogowanego pacjenta

## Blocked by

- #11
