"use client";

import { useActionState } from "react";
import { updatePatientProfile } from "@/app/actions/patient";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface Profile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  allergies: string;
  chronicDiseases: string;
  medications: string;
}

export function PatientProfileForm({ profile }: { profile: Profile | null }) {
  const [state, action, pending] = useActionState(updatePatientProfile, null);

  return (
    <form action={action} className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Dane osobowe</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">Imię *</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={profile?.firstName ?? ""}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Nazwisko *</Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={profile?.lastName ?? ""}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dateOfBirth">Data urodzenia</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              defaultValue={profile?.dateOfBirth ?? ""}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Informacje medyczne</h2>
          <div className="space-y-1.5">
            <Label htmlFor="allergies">Alergie</Label>
            <Textarea
              id="allergies"
              name="allergies"
              defaultValue={profile?.allergies ?? ""}
              placeholder="np. Penicylina, pyłki traw"
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="chronicDiseases">Choroby przewlekłe</Label>
            <Textarea
              id="chronicDiseases"
              name="chronicDiseases"
              defaultValue={profile?.chronicDiseases ?? ""}
              placeholder="np. Nadciśnienie tętnicze, cukrzyca typu 2"
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="medications">Leki przyjmowane na stałe</Label>
            <Textarea
              id="medications"
              name="medications"
              defaultValue={profile?.medications ?? ""}
              placeholder="np. Amlodypina 5mg, Metformina 500mg"
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
          {pending ? "Zapisywanie..." : "Zapisz"}
        </button>
        <Link
          href="/pacjent/profil"
          className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Anuluj
        </Link>
      </div>
    </form>
  );
}
