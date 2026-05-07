"use client";

import { useActionState, useState } from "react";
import { bookAppointment } from "@/app/actions/appointments";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface Slot {
  id: string;
  dateTime: Date;
}

export function BookingForm({ slots }: { slots: Slot[] }) {
  const [state, action, pending] = useActionState(bookAppointment, null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-700">Wybierz termin</h2>

      <div className="grid grid-cols-2 gap-2">
        {slots.map((slot) => {
          const dt = new Date(slot.dateTime);
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => setSelectedSlot(slot.id)}
              className={`p-3 border rounded-md text-left transition-colors ${
                selectedSlot === slot.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                <Calendar className="h-3.5 w-3.5" />
                {dt.toLocaleDateString("pl-PL", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                })}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                <Clock className="h-3 w-3" />
                {dt.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </button>
          );
        })}
      </div>

      {selectedSlot && (
        <form action={action}>
          <input type="hidden" name="slotId" value={selectedSlot} />
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4 pb-4 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Potwierdzenie rezerwacji</h3>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consent"
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600"
                  required
                />
                <span className="text-sm text-gray-700">
                  Wyrażam zgodę na udostępnienie mojego profilu zdrowotnego oraz
                  dokumentacji medycznej wybranemu lekarzowi w celu realizacji wizyty.
                </span>
              </label>

              {state?.error && (
                <p className="text-sm text-red-600">{state.error}</p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {pending ? "Rezerwowanie..." : "Potwierdź rezerwację"}
              </button>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
