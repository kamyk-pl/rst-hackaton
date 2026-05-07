import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DoctorProfileForm } from "@/components/doctor-profile-form";
import { ROLE, SLOT_STATUS, APPOINTMENT_STATUS } from "@/lib/constants";

export default async function EditDoctorProfilePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== ROLE.LEKARZ) redirect("/login");

  const profile = await prisma.doctorProfile.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edytuj profil</h1>
      <DoctorProfileForm profile={profile} />
    </div>
  );
}
