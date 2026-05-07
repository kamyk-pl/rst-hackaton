import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ROLE, SLOT_STATUS } from "@/lib/constants";
import { SlotForm } from "@/components/slot-form";
import { SlotList } from "@/components/slot-list";
import { Clock } from "lucide-react";

export default async function TerminyPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== ROLE.LEKARZ) redirect("/login");

  const slots = await prisma.slot.findMany({
    where: { doctorId: session.user.id },
    orderBy: { dateTime: "asc" },
  });

  const available = slots.filter(s => s.status === SLOT_STATUS.DOSTEPNY).length;
  const reserved = slots.filter(s => s.status === SLOT_STATUS.ZAREZERWOWANY).length;

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#00bfa5" }}>Lekarz</p>
        <h1 className="text-3xl font-bold text-gray-900">Moje terminy</h1>
        <p className="text-gray-400 mt-1 text-sm">Zarządzaj dostępnymi terminami wizyt.</p>
      </div>

      {slots.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Wszystkie" value={slots.length} />
          <StatCard label="Dostępne" value={available} accent />
          <StatCard label="Zarezerwowane" value={reserved} />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
          <Clock className="h-4 w-4" style={{ color: "#00bfa5" }} />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Dodaj nowy termin</span>
        </div>
        <div className="p-6">
          <SlotForm />
        </div>
      </div>

      <SlotList slots={slots} />
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <p className="text-3xl font-bold mb-1" style={{ color: accent ? "#00bfa5" : "#0d0d0d" }}>{value}</p>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
    </div>
  );
}
