# MedBridge — Design Spec (iteratec-inspired)

## Inspiracja
iteratec.com: czarny/granatowy header + hero z białym tekstem, teal/mint akcent,
minimalistyczne przyciski, czyste białe sekcje, profesjonalny B2B look.

---

## Paleta

| Token          | Hex        | Użycie                          |
|----------------|------------|---------------------------------|
| `--black`      | `#0d0d0d`  | Navbar, hero tło, footer        |
| `--teal`       | `#00bfa5`  | Akcenty, ikony, CTA hover       |
| `--white`      | `#ffffff`  | Tekst na ciemnym, tło sekcji    |
| `--gray-50`    | `#f8fafc`  | Alternating sections            |
| `--gray-100`   | `#f1f5f9`  | Karty, obramowania              |
| `--gray-600`   | `#475569`  | Body text secondary             |
| `--gray-900`   | `#0f172a`  | Body text primary               |
| `--blue-600`   | `#1a56db`  | Linki w appce, badge'y          |

---

## Typografia — Inter

| Rola       | Size      | Weight |
|------------|-----------|--------|
| Hero H1    | 3.75rem   | 800    |
| Section H2 | 2.5rem    | 700    |
| Card H3    | 1.25rem   | 600    |
| Body       | 1rem      | 400    |
| Caption    | 0.875rem  | 400    |

---

## Landing Page Struktura

```
┌──────────────── NAVBAR (black, sticky) ─────────────────┐
│  ♥ MedBridge              O nas   Kontakt   [Zaloguj →]  │
└─────────────────────────────────────────────────────────┘

┌──────────────── HERO (#0d0d0d bg) ──────────────────────┐
│                                                          │
│   TWOJA DOKUMENTACJA                                     │
│   MEDYCZNA W JEDNYM MIEJSCU                              │
│                                                          │
│   Koniec z przepisywaniem historii choroby.             │
│   Udostępnij lekarzowi dokładnie to, co potrzebuje.     │
│                                                          │
│   [Zaloguj się →]                                        │
│                          ↓                              │
└─────────────────────────────────────────────────────────┘

┌──────────────── HOW IT WORKS (white) ───────────────────┐
│   Jak działa MedBridge?                                  │
│                                                          │
│   ①  ②  ③                                              │
│  Profil  Dokumenty  Wizyta                               │
└─────────────────────────────────────────────────────────┘

┌──────────────── FOR WHO (gray-50) ──────────────────────┐
│   [DLA PACJENTÓW]     │     [DLA LEKARZY]               │
└─────────────────────────────────────────────────────────┘

┌──────────────── CTA (#0d0d0d) ──────────────────────────┐
│        Gotowy żeby zacząć?    [Zaloguj się →]            │
└─────────────────────────────────────────────────────────┘
```
