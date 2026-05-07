# #06 — Upload dokumentów medycznych

## What to build

Funkcjonalność wgrywania plików medycznych przez pacjenta (PDF i JPG, max 10 MB).

## Acceptance criteria

- [ ] Formularz uploadu na stronie `/pacjent/dokumenty`
- [ ] Akceptowane typy: PDF, JPG/JPEG
- [ ] Limit rozmiaru pliku: 10 MB — błąd przy przekroczeniu
- [ ] Plik zapisywany na lokalnym filesystemie (`public/uploads/`)
- [ ] Metadane pliku (nazwa, ścieżka, typ, data uploadu) zapisywane w bazie
- [ ] Po wgraniu — plik pojawia się na liście dokumentów

## Blocked by

- #03
