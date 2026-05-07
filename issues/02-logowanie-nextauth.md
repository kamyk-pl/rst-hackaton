# #02 — Strona logowania + NextAuth

## What to build

Zaimplementować autentykację: strona `/login` z formularzem email + hasło, NextAuth.js z Credentials provider, middleware chroniący trasy, przekierowanie po zalogowaniu zgodne z rolą.

## Acceptance criteria

- [ ] Strona `/login` z formularzem (email, hasło)
- [ ] NextAuth.js skonfigurowany z Credentials provider, hasła weryfikowane przez bcrypt
- [ ] Middleware przekierowuje niezalogowanych użytkowników na `/login`
- [ ] Po zalogowaniu: PACJENT → `/pacjent/dashboard`, LEKARZ → `/lekarz/dashboard`
- [ ] Wylogowanie działa i czyści sesję
- [ ] Błędne dane logowania pokazują komunikat błędu

## Blocked by

- #01
