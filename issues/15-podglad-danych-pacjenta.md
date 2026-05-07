# #15 — Podgląd danych pacjenta przez lekarza

## What to build

Widok szczegółów wizyty dla lekarza: profil zdrowotny pacjenta i jego dokumentacja medyczna (tylko gdy pacjent wyraził zgodę).

## Acceptance criteria

- [ ] Strona `/lekarz/wizyty/[id]` dostępna tylko dla lekarza przypisanego do tej wizyty
- [ ] Wyświetla profil pacjenta: imię, nazwisko, data urodzenia, alergie, choroby przewlekłe, leki stałe
- [ ] Wyświetla listę dokumentów medycznych pacjenta z możliwością pobrania
- [ ] Widok dostępny TYLKO jeśli `consentGranted = true` — w przeciwnym razie komunikat o braku zgody
- [ ] Link do formularza podsumowania wizyty (jeśli status ZAPLANOWANA)

## Blocked by

- #04 #07 #14
