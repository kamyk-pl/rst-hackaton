import { SLOT_STATUS } from "@/lib/constants";
import { Calendar, Clock } from "lucide-react";

interface Slot { id: string; dateTime: Date; status: string; }

export function SlotList({ slots }: { slots: Slot[] }) {
  if (slots.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-6">Brak terminów. Dodaj pierwszy termin powyżej.</p>;
  }
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Wszystkie terminy ({slots.length})</p>
      {slots.map((slot) => {
        const dt = new Date(slot.dateTime);
        const isAvail = slot.status === SLOT_STATUS.DOSTEPNY;
        return (
          <div key={slot.id} className="flex items-center gap-4 bg-white rounded-xl px-5 py-3.5 border border-gray-100 shadow-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: isAvail ? "rgba(0,191,165,0.1)" : "#f1f5f9" }}>
              <Calendar className="h-4 w-4" style={{ color: isAvail ? "#00bfa5" : "#94a3b8" }} />
            </div>
            <div className="flex items-center gap-3 flex-1 text-sm text-gray-600">
              <span className="font-medium">{dt.toLocaleDateString("pl-PL", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}</span>
              <span className="flex items-center gap-1 text-gray-400">
                <Clock className="h-3 w-3" />
                {dt.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={isAvail ? { backgroundColor: "rgba(0,191,165,0.1)", color: "#00bfa5" } : { backgroundColor: "#f1f5f9", color: "#94a3b8" }}>
              {isAvail ? "Dostępny" : "Zarezerwowany"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
