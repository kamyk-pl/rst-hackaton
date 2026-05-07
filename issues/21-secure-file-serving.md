# #21 — Pliki medyczne poza public/ z auth route handler

## What to build

Przenieść uploadowane pliki medyczne z `public/uploads/` do katalogu poza `public/` (np. `uploads/` w root projektu) i serwować je przez authenticated Route Handler który weryfikuje sesję i uprawnienia przed zwróceniem pliku.

## Acceptance criteria

- [ ] Pliki zapisywane w `uploads/[userId]/` poza katalogiem `public/`
- [ ] Route Handler `GET /api/files/[...path]` weryfikuje sesję użytkownika
- [ ] Lekarz może pobrać plik tylko jeśli ma aktywną wizytę z `consentGranted=true` dla tego pacjenta
- [ ] Pacjent może pobrać tylko swoje własne pliki
- [ ] Żaden plik nie jest dostępny bez autentykacji (matcher w middleware nie wyklucza już `/uploads`)
- [ ] Istniejące rekordy `storagePath` w bazie zaktualizowane do nowej ścieżki
- [ ] `public/uploads/` usunięty lub pusty

## Blocked by

None — can start immediately
