# #16 — Formularz podsumowania wizyty (lekarz)

## What to build

Formularz umożliwiający lekarzowi dodanie podsumowania wizyty po jej przeprowadzeniu.

## Acceptance criteria

- [ ] Strona `/lekarz/wizyty/[id]/podsumowanie` dostępna tylko dla lekarza tej wizyty
- [ ] Formularz z polami (textarea): rozpoznanie, zalecenia, przepisane leki, skierowania na badania
- [ ] Wszystkie pola opcjonalne (lekarz może zostawić puste)
- [ ] Po zapisaniu: tworzony rekord `VisitSummary`, status wizyty zmieniony na ZAKOŃCZONA
- [ ] Po zapisaniu: przekierowanie do harmonogramu z komunikatem sukcesu
- [ ] Formularz niedostępny jeśli wizyta ma już status ZAKOŃCZONA

## Blocked by

- #15
