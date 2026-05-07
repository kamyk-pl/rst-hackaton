import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0d0d0d" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ backgroundColor: "#0a0a0a", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5" style={{ color: "#00bfa5" }} />
          <span className="text-white font-bold text-lg">MedBridge</span>
        </div>
        <div>
          <h2 className="text-white font-bold text-4xl leading-tight mb-6">
            Twoja historia<br />medyczna zawsze<br />pod ręką.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
            Centralne zarządzanie dokumentacją medyczną
            i wizytami lekarskimi dla pacjentów i lekarzy.
          </p>
        </div>
        <div className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          Hackathon 2026 · Prototyp
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.4)" }}>
            <ArrowLeft className="h-4 w-4" /> Powrót
          </Link>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden mb-8">
            <Heart className="h-5 w-5" style={{ color: "#00bfa5" }} />
            <span className="text-white font-bold text-lg">MedBridge</span>
          </div>

          <h1 className="text-white text-2xl font-bold mb-2">Zaloguj się</h1>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
            Konta testowe: pacjent@test.pl / lekarz@test.pl
          </p>

          <LoginForm dark />

          <p className="text-center text-xs mt-8" style={{ color: "rgba(255,255,255,0.2)" }}>
            Hasło do obu kont: <span style={{ color: "rgba(255,255,255,0.4)" }}>haslo123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
