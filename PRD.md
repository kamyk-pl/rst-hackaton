# PRD: MedBridge — System zarządzania dokumentacją medyczną i wizytami

## Problem Statement

Pacjenci odwiedzający lekarzy specjalistów tracą czas na każdorazowe odtwarzanie historii choroby, a ich dokumentacja medyczna jest rozproszona po wielu miejscach. Lekarze nie mają szybkiego dostępu do pełnego obrazu zdrowia pacjenta przed wizytą, co obniża jakość i efektywność konsultacji.

## Solution

MedBridge to aplikacja webowa umożliwiająca pacjentowi prowadzenie scentralizowanego profilu zdrowotnego i dokumentacji medycznej oraz udostępnianie ich wybranemu lekarzowi w ramach konkretnej wizyty. Lekarz otrzymuje dostęp do danych pacjenta przed wizytą i dokumentuje jej przebieg w formie podsumowania widocznego dla pacjenta.

## User Stories

### Autentykacja

1. Jako pacjent, chcę zalogować się do systemu za pomocą adresu e-mail i hasła, żeby uzyskać dostęp do swojego profilu.
2. Jako lekarz, chcę zalogować się do systemu za pomocą adresu e-mail i hasła, żeby uzyskać dostęp do swojego panelu.
3. Jako zalogowany użytkownik, chcę móc się wylogować, żeby chronić dostęp do moich danych.
4. Jako użytkownik, chcę żeby system przekierowywał mnie na odpowiedni widok po zalogowaniu (pacjent → swój panel, lekarz → swój panel), żeby od razu znaleźć się we właściwym miejscu.

### Profil pacjenta

5. Jako pacjent, chcę edytować swój profil (imię, nazwisko, data urodzenia), żeby moje dane były aktualne.
6. Jako pacjent, chcę dodawać i edytować listę alergii, żeby lekarz wiedział na co jestem uczulony.
7. Jako pacjent, chcę dodawać i edytować listę chorób przewlekłych, żeby lekarz miał pełen obraz mojego stanu zdrowia.
8. Jako pacjent, chcę dodawać i edytować listę leków przyjmowanych na stałe, żeby lekarz wiedział jaką farmakoterapię stosuję.

### Dokumentacja medyczna

9. Jako pacjent, chcę uploadować pliki (PDF, JPG) jako dokumentację medyczną, żeby przechowywać wyniki badań i inne dokumenty w jednym miejscu.
10. Jako pacjent, chcę widzieć listę wszystkich wgranych przeze mnie dokumentów, żeby zarządzać swoją dokumentacją.
11. Jako pacjent, chcę usuwać wgrane dokumenty, żeby utrzymać porządek w dokumentacji.
12. Jako lekarz, chcę widzieć dokumentację medyczną pacjenta który umówił się do mnie na wizytę i wyraził zgodę, żeby przygotować się do konsultacji.

### Profil lekarza

13. Jako lekarz, chcę edytować swój profil (imię, nazwisko, specjalizacja), żeby pacjenci widzieli aktualne informacje.
14. Jako lekarz, chcę dodawać dostępne terminy wizyt (sloty), żeby pacjenci mogli się do mnie rejestrować.
15. Jako lekarz, chcę widzieć listę swoich dostępnych slotów, żeby zarządzać harmonogramem.

### Umawianie wizyt

16. Jako pacjent, chcę widzieć listę lekarzy z dostępnymi terminami, żeby wybrać odpowiedniego specjalistę.
17. Jako pacjent, chcę widzieć dostępne terminy wybranego lekarza, żeby umówić się na odpowiedni czas.
18. Jako pacjent, chcę zarezerwować wybrany slot u lekarza, żeby umówić wizytę.
19. Jako pacjent, chcę przy rezerwacji wyrazić zgodę na udostępnienie mojego profilu i dokumentacji lekarzowi, żeby mógł się przygotować do wizyty.
20. Jako pacjent, chcę widzieć listę swoich zaplanowanych wizyt, żeby wiedzieć kiedy mam konsultacje.
21. Jako lekarz, chcę widzieć harmonogram umówionych wizyt z datami i danymi pacjentów, żeby planować swój dzień pracy.

### Podgląd danych pacjenta przez lekarza

22. Jako lekarz, chcę zobaczyć profil zdrowotny pacjenta (alergie, choroby, leki) przy konkretnej wizycie, żeby mieć pełen obraz przed konsultacją.
23. Jako lekarz, chcę zobaczyć dokumentację medyczną pacjenta (lista plików z możliwością pobrania) przy konkretnej wizycie, żeby przejrzeć wyniki badań.
24. Jako lekarz, chcę mieć dostęp do danych pacjenta wyłącznie gdy pacjent wyraził zgodę przy rezerwacji wizyty, żeby respektować jego prywatność.

### Podsumowanie wizyty

25. Jako lekarz, chcę dodać podsumowanie wizyty (rozpoznanie, zalecenia, przepisane leki, skierowania na badania), żeby udokumentować przebieg konsultacji.
26. Jako lekarz, chcę że podsumowanie wizyty zmienia status wizyty na ZAKOŃCZONA, żeby wiedzieć które wizyty są już obsłużone.
27. Jako pacjent, chcę widzieć pełne podsumowanie zrealizowanej wizyty (rozpoznanie, zalecenia, leki, skierowania), żeby pamiętać zalecenia lekarza.
28. Jako pacjent, chcę mieć dostęp do historii wszystkich zakończonych wizyt, żeby śledzić swój stan zdrowia w czasie.

### Nawigacja i UX

29. Jako zalogowany użytkownik, chcę widzieć boczny panel nawigacyjny z odpowiednimi sekcjami dla mojej roli, żeby łatwo poruszać się po aplikacji.
30. Jako użytkownik niezalogowany, chcę być przekierowany na stronę logowania, żeby nie mieć dostępu do chronionych zasobów.

## Implementation Decisions

### Architektura

- **Framework:** Next.js App Router + TypeScript — fullstack w jednym repo, server actions zamiast osobnego REST API
- **Baza danych:** SQLite + Prisma ORM — zero konfiguracji serwera, plik lokalny, type-safe queries
- **UI:** shadcn/ui + Tailwind CSS — gotowe komponenty, profesjonalny wygląd
- **Autentykacja:** NextAuth.js z Credentials provider — integracja z Next.js, zarządzanie sesją out of the box
- **Pliki:** lokalny filesystem (`public/uploads/`) — ścieżka pliku przechowywana w bazie danych
- **Język:** polski

### Moduły

**1. Auth**
- NextAuth.js Credentials provider, hashowanie haseł (bcrypt)
- Middleware chroniący wszystkie trasy poza `/login`
- Role: `PACJENT` | `LEKARZ` w sesji

**2. Profil**
- Edycja profilu pacjenta: imię, nazwisko, data urodzenia, alergie (tekstowe), choroby przewlekłe (tekstowe), leki stałe (tekstowe)
- Edycja profilu lekarza: imię, nazwisko, specjalizacja

**3. Dokumenty medyczne**
- Upload plików PDF/JPG (limit 10 MB)
- Przechowywanie na lokalnym systemie plików, metadane w bazie
- Dostęp: właściciel (pacjent) + lekarz z aktywną wizytą i zgodą

**4. Sloty (terminy wizyt)**
- Lekarz tworzy sloty: data + godzina
- Slot może być: `DOSTĘPNY` | `ZAREZERWOWANY`
- Po rezerwacji slot znika z listy dostępnych

**5. Wizyty**
- Rezerwacja = pacjent wybiera lekarza → wybiera slot → zaznacza zgodę → tworzy wizytę
- Status wizyty: `ZAPLANOWANA` | `ZAKOŃCZONA`
- Zgoda na dane (boolean) przechowywana przy wizycie

**6. Podsumowanie wizyty**
- Lekarz wypełnia formularz: rozpoznanie, zalecenia, przepisane leki, skierowania
- Wszystkie pola tekstowe (textarea)
- Zapis nieodwracalny — brak edycji po zapisaniu
- Zapis zmienia status wizyty na `ZAKOŃCZONA`

**7. Layout / nawigacja**
- Wspólny layout z sidebarem
- Treść sidebarów różna per rola (linki do odpowiednich sekcji)
- Middleware przekierowuje niezalogowanych na `/login`

### Schemat bazy danych

- `User` — id, email, hashedPassword, role (PACJENT|LEKARZ), createdAt
- `PatientProfile` — userId (FK), firstName, lastName, dateOfBirth, allergies, chronicDiseases, medications
- `DoctorProfile` — userId (FK), firstName, lastName, specialization
- `MedicalDocument` — id, patientId (FK), filename, storagePath, mimeType, uploadedAt
- `Slot` — id, doctorId (FK), dateTime, status (DOSTĘPNY|ZAREZERWOWANY)
- `Appointment` — id, patientId (FK), doctorId (FK), slotId (FK), consentGranted (boolean), status (ZAPLANOWANA|ZAKOŃCZONA), createdAt
- `VisitSummary` — id, appointmentId (FK), diagnosis, recommendations, prescribedMedications, referrals, createdAt

### Seed

- `pacjent@test.pl` / `haslo123` — rola PACJENT
- `lekarz@test.pl` / `haslo123` — rola LEKARZ

## Testing Decisions

Hackathon — brak testów automatycznych. Focus na działający prototyp end-to-end zgodny z Definition of Done.

## Out of Scope

- Rejestracja nowych użytkowników
- Anulowanie wizyt
- Płatności
- Wysyłka e-mail (powiadomienia)
- Zgodność z RODO / HIPAA
- Wiele stref czasowych
- Edycja podsumowania wizyty po zapisaniu
- Granularne zarządzanie zgodami (per dokument)
- Środowisko produkcyjne

## Further Notes

- Prezentacja odbywa się na środowisku lokalnym — brak wymagań deploymentowych
- Dwie role, dwa seedowane konta — wystarczające do demonstracji pełnego flow Definition of Done
- Pliki: tylko PDF i JPG, max 10 MB per plik
- Lekarz widzi dane pacjenta wyłącznie gdy: (a) pacjent umówił się do niego AND (b) zaznaczył zgodę przy rezerwacji
