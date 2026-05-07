"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROLE } from "@/lib/constants";
import {
  User, FileText, Calendar, ClipboardList,
  Clock, LogOut, Heart,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

const patientNav = [
  { href: "/pacjent/profil", label: "Mój profil", icon: User },
  { href: "/pacjent/dokumenty", label: "Dokumentacja", icon: FileText },
  { href: "/pacjent/umow-wizyte", label: "Umów wizytę", icon: Calendar },
  { href: "/pacjent/wizyty", label: "Historia wizyt", icon: ClipboardList },
];

const doctorNav = [
  { href: "/lekarz/profil", label: "Mój profil", icon: User },
  { href: "/lekarz/terminy", label: "Moje terminy", icon: Clock },
  { href: "/lekarz/wizyty", label: "Harmonogram wizyt", icon: Calendar },
];

interface SidebarProps {
  role: string;
  email: string;
}

export function Sidebar({ role, email }: SidebarProps) {
  const pathname = usePathname();
  const navItems = role === ROLE.LEKARZ ? doctorNav : patientNav;
  const roleLabel = role === ROLE.LEKARZ ? "Lekarz" : "Pacjent";

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ backgroundColor: "#0d0d0d" }}>
      {/* Logo */}
      <div className="px-6 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2 mb-5">
          <Heart className="h-5 w-5" style={{ color: "#00bfa5" }} />
          <span className="text-white font-bold text-base tracking-tight">MedBridge</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: "rgba(0,191,165,0.15)", color: "#00bfa5" }}>
            {email[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">{email}</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{roleLabel}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3"
          style={{ color: "rgba(255,255,255,0.2)" }}>
          Menu
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all"
              style={active
                ? { backgroundColor: "rgba(0,191,165,0.12)", color: "#00bfa5" }
                : { color: "rgba(255,255,255,0.5)" }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {active && (
                <span className="ml-auto w-1 h-4 rounded-full" style={{ backgroundColor: "#00bfa5" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Wyloguj się
          </button>
        </form>
      </div>
    </aside>
  );
}
