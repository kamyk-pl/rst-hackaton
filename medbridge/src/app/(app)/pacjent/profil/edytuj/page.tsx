import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PatientProfileForm } from "@/components/patient-profile-form";
import { ROLE } from "@/lib/constants";

export default async function EditPatientProfilePage() {
  const session = await getSession();
  if (!session || session.role !== ROLE.PACJENT) redirect("/login");

  const profile = await prisma.patientProfile.findUnique({
    where: { userId: session.id },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edytuj profil</h1>
      <PatientProfileForm profile={profile} />
    </div>
  );
}
