import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PatientProfileForm } from "@/components/patient-profile-form";
import { ROLE, SLOT_STATUS, APPOINTMENT_STATUS } from "@/lib/constants";

export default async function EditPatientProfilePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== ROLE.PACJENT) redirect("/login");

  const profile = await prisma.patientProfile.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edytuj profil</h1>
      <PatientProfileForm profile={profile} />
    </div>
  );
}
