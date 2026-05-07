# #23 — Sanityzacja rozszerzenia przy zapisie pliku

## What to build

Zastąpić oryginalne rozszerzenie z `file.name` rozszerzeniem wyliczonym z zweryfikowanego MIME type. Zapobiega to scenariuszowi gdzie klient deklaruje `image/jpeg` z nazwą `exploit.html`, co mogłoby umożliwić same-origin XSS gdy plik byłby serwowany.

## Acceptance criteria

- [ ] Zmienna `ext` obliczana z MIME type jest używana jako rozszerzenie zapisanego pliku (`.pdf` dla `application/pdf`, `.jpg` dla `image/jpeg`/`image/jpg`)
- [ ] Oryginalna nazwa pliku (`file.name`) może być zachowana jako `filename` w bazie (wyświetlana użytkownikowi), ale rozszerzenie w `storagePath` pochodzi wyłącznie z MIME
- [ ] Nieużywana deklaracja `const ext = ...` z `documents.ts:17` zostaje usunięta lub podłączona do logiki
- [ ] Test: upload pliku z nazwą `exploit.html` i MIME `image/jpeg` zapisuje plik z rozszerzeniem `.jpg`

## Blocked by

None — can start immediately
