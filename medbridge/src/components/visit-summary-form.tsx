"use client";

import { useActionState } from "react";
import { addVisitSummary } from "@/app/actions/visits";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export function VisitSummaryForm({ appointmentId }: { appointmentId: string }) {
  const [state, action, pending] = useActionState(addVisitSummary, null);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="diagnosis">Rozpoznanie</Label>
            <Textarea
              id="diagnosis"
              name="diagnosis"
              placeholder="Np. Nadciśnienie tętnicze I stopnia (I10)"
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="recommendations">Zalecenia</Label>
            <Textarea
              id="recommendations"
              name="recommendations"
              placeholder="Np. Dieta niskosodowa, regularna aktywność fizyczna..."
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prescribedMedications">Przepisane leki</Label>
            <Textarea
              id="prescribedMedications"
              name="prescribedMedications"
              placeholder="Np. Amlodypina 5mg 1x1 rano"
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="referrals">Skierowania na badania</Label>
            <Textarea
              id="referrals"
              name="referrals"
              placeholder="Np. EKG, Holter ciśnieniowy 24h"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {pending ? "Zapisywanie..." : "Zapisz podsumowanie"}
        </button>
        <Link
          href={`/lekarz/wizyty/${appointmentId}`}
          className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Anuluj
        </Link>
      </div>
    </form>
  );
}
