import Link from "next/link";
import { Heart, FileText, Calendar, Shield, ArrowRight, ChevronDown } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ fontFamily: "var(--font-inter, sans-serif)" }}>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5" style={{ backgroundColor: "#0d0d0d" }}>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5" style={{ color: "#00bfa5" }} />
          <span className="text-white font-bold text-lg tracking-tight">MedBridge</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#how" className="text-sm text-white/60 hover:text-white transition-colors">Jak działa</a>
          <a href="#for-who" className="text-sm text-white/60 hover:text-white transition-colors">Dla kogo</a>
        </div>
        <Link
          href="/login"
          className="flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-md transition-colors"
          style={{ backgroundColor: "#00bfa5", color: "#0d0d0d" }}
        >
          Zaloguj się <ArrowRight className="h-4 w-4" />
        </Link>
      </nav>

      {/* HERO */}
      <section
        className="flex flex-col items-center justify-center text-center px-6 py-40 flex-1"
        style={{ backgroundColor: "#0d0d0d", minHeight: "90vh" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-8 border"
          style={{ borderColor: "#00bfa5", color: "#00bfa5" }}>
          Prototyp — Hackathon 2026
        </div>
        <h1 className="text-white font-extrabold tracking-tight max-w-3xl leading-none mb-6"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.05 }}>
          TWOJA DOKUMENTACJA<br />MEDYCZNA W JEDNYM<br />MIEJSCU
        </h1>
        <p className="max-w-xl text-lg mb-12" style={{ color: "rgba(255,255,255,0.6)" }}>
          Koniec z przepisywaniem historii choroby na każdej wizycie.
          Udostępnij lekarzowi dokładnie to, czego potrzebuje — jednym kliknięciem.
        </p>
        <Link
          href="/login"
          className="flex items-center gap-2 font-bold px-8 py-4 rounded-md text-base transition-all hover:opacity-90 hover:translate-y-[-1px]"
          style={{ backgroundColor: "#00bfa5", color: "#0d0d0d" }}
        >
          Zaloguj się teraz <ArrowRight className="h-5 w-5" />
        </Link>
        <div className="mt-20 flex flex-col items-center gap-1" style={{ color: "rgba(255,255,255,0.3)" }}>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#00bfa5" }}>
            Jak to działa
          </p>
          <h2 className="font-bold text-gray-900 mb-16" style={{ fontSize: "2.25rem" }}>
            Trzy kroki do lepszej opieki
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="group p-8 rounded-xl border border-gray-100 hover:border-teal-400 transition-all hover:shadow-lg"
                style={{ "--tw-border-color": "#00bfa5" } as React.CSSProperties}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                  style={{ backgroundColor: "rgba(0,191,165,0.1)" }}>
                  <s.icon className="h-6 w-6" style={{ color: "#00bfa5" }} />
                </div>
                <div className="text-4xl font-black text-gray-100 mb-2">0{i + 1}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR WHO */}
      <section id="for-who" className="py-28 px-6" style={{ backgroundColor: "#f8fafc" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#00bfa5" }}>
            Dla kogo
          </p>
          <h2 className="font-bold text-gray-900 mb-16" style={{ fontSize: "2.25rem" }}>
            Jedno narzędzie, dwie perspektywy
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {personas.map((p, i) => (
              <div key={i} className="p-10 rounded-2xl"
                style={{ backgroundColor: i === 0 ? "#0d0d0d" : "white", border: i === 1 ? "1px solid #e2e8f0" : "none" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4"
                  style={{ color: "#00bfa5" }}>{p.role}</p>
                <h3 className="text-2xl font-bold mb-4"
                  style={{ color: i === 0 ? "white" : "#0f172a" }}>{p.title}</h3>
                <ul className="space-y-3">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className="mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "rgba(0,191,165,0.15)" }}>
                        <span className="text-xs" style={{ color: "#00bfa5" }}>✓</span>
                      </span>
                      <span className="text-sm" style={{ color: i === 0 ? "rgba(255,255,255,0.75)" : "#475569" }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24 px-6 text-center" style={{ backgroundColor: "#0d0d0d" }}>
        <h2 className="text-white font-bold mb-4" style={{ fontSize: "2rem" }}>
          Gotowy żeby zacząć?
        </h2>
        <p className="mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
          Zaloguj się na konto testowe i przejdź pełny flow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login"
            className="flex items-center gap-2 font-semibold px-8 py-4 rounded-md transition-all hover:opacity-90"
            style={{ backgroundColor: "#00bfa5", color: "#0d0d0d" }}>
            Zaloguj się jako pacjent <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            lub użyj konta lekarza
          </div>
        </div>
        <div className="mt-8 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          pacjent@test.pl / haslo123 &nbsp;·&nbsp; lekarz@test.pl / haslo123
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-8 py-6 flex items-center justify-between border-t"
        style={{ backgroundColor: "#0d0d0d", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4" style={{ color: "#00bfa5" }} />
          <span className="text-sm font-semibold text-white">MedBridge</span>
        </div>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          Hackathon 2026 · Prototyp
        </p>
      </footer>
    </div>
  );
}

const steps = [
  {
    icon: FileText,
    title: "Uzupełnij profil i dokumenty",
    desc: "Wprowadź swoje dane zdrowotne, alergie, choroby przewlekłe i wgraj wyniki badań.",
  },
  {
    icon: Calendar,
    title: "Umów wizytę",
    desc: "Wybierz lekarza i termin. Wyraź zgodę na udostępnienie danych jednym kliknięciem.",
  },
  {
    icon: Shield,
    title: "Lekarz jest przygotowany",
    desc: "Specjalista przegląda Twoją dokumentację przed wizytą i dodaje podsumowanie po.",
  },
];

const personas = [
  {
    role: "Pacjent",
    title: "Masz kontrolę nad swoją historią medyczną",
    features: [
      "Centralny profil zdrowotny w jednym miejscu",
      "Upload dokumentów PDF i JPG",
      "Łatwe umawianie wizyt online",
      "Dostęp do zaleceń po każdej wizycie",
    ],
  },
  {
    role: "Lekarz",
    title: "Kompletne dane przed każdą konsultacją",
    features: [
      "Harmonogram wizyt z podglądem pacjentów",
      "Dostęp do dokumentacji za zgodą pacjenta",
      "Dokumentowanie przebiegu wizyty",
      "Wystawianie zaleceń i skierowań",
    ],
  },
];
