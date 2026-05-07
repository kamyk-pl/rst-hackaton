# #17 — Widok podsumowania wizyty (pacjent)

## What to build

Widok szczegółów zakończonej wizyty dla pacjenta z pełnym podsumowaniem lekarskim.

## Acceptance criteria

- [ ] Strona `/pacjent/wizyty/[id]` dostępna tylko dla pacjenta tej wizyty
- [ ] Wyświetla: datę wizyty, lekarza (imię, nazwisko, specjalizacja)
- [ ] Wyświetla podsumowanie: rozpoznanie, zalecenia, przepisane leki, skierowania
- [ ] Jeśli wizyta ZAPLANOWANA i brak podsumowania — komunikat "Wizyta jeszcze się nie odbyła"
- [ ] Dostęp tylko dla zalogowanego pacjenta będącego właścicielem wizyty

## Blocked by

- #13 #16
