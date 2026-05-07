"use client";

import { useActionState } from "react";
import { updateDoctorProfile } from "@/app/actions/doctor";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface Profile {
  firstName: string;
  lastName: string;
  specialization: string;
}

export function DoctorProfileForm({ profile }: { profile: Profile | null }) {
  const [state, action, pending] = useActionState(updateDoctorProfile, null);

  return (
    <form action={action} className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
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
            <Label htmlFor="specialization">Specjalizacja *</Label>
            <Input
              id="specialization"
              name="specialization"
              defaultValue={profile?.specialization ?? ""}
              placeholder="np. Kardiolog, Internista"
              required
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
          href="/lekarz/profil"
          className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Anuluj
        </Link>
      </div>
    </form>
  );
}
