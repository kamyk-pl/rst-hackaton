import { redirect } from "next/navigation";
import { getSession } from "@/infrastructure/auth/session";
import { prisma } from "@/infrastructure/db/prisma";
import { PrismaPatientRepository } from "@/infrastructure/patient/prisma-patient-repository";
import { getPatientProfile } from "@/application/patient/patient-profile";
import { logoutAction } from "@/app/logout/actions";
import { ProfileForm } from "@/presentation/patient/ProfileForm";
import {
  updateProfileAction,
  addAllergyAction,
  updateAllergyAction,
  removeAllergyAction,
  addDiseaseAction,
  removeDiseaseAction,
  addMedicationAction,
  removeMedicationAction,
} from "./actions";

export default async function PatientDashboard() {
  const session = await getSession();
  if (!session || session.role !== "PATIENT") redirect("/login");

  const repo = new PrismaPatientRepository(prisma);
  const profile = await getPatientProfile(session.domainEntityId, repo);
  if (!profile) redirect("/login");

  return (
    <main className="flex flex-col items-center py-12 px-4 min-h-full">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Patient Dashboard</h1>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50"
            >
              Logout
            </button>
          </form>
        </div>

        <ProfileForm
          profile={profile}
          actions={{
            updateProfile: updateProfileAction,
            addAllergy: addAllergyAction,
            updateAllergy: updateAllergyAction,
            removeAllergy: removeAllergyAction,
            addDisease: addDiseaseAction,
            removeDisease: removeDiseaseAction,
            addMedication: addMedicationAction,
            removeMedication: removeMedicationAction,
          }}
        />
      </div>
    </main>
  );
}
