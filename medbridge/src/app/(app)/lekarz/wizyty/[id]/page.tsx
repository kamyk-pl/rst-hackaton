import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROLE, SLOT_STATUS, APPOINTMENT_STATUS } from "@/lib/constants";
import {
  Calendar,
  Clock,
  ChevronLeft,
  FileText,
  Image,
  ExternalLink,
  ClipboardList,
} from "lucide-react";

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== ROLE.LEKARZ) redirect("/login");

  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      slot: true,
      patient: {
        include: {
          patientProfile: true,
          documents: { orderBy: { uploadedAt: "desc" } },
        },
      },
      visitSummary: true,
    },
  });

  if (!appointment || appointment.doctorId !== session.id) notFound();

  const dt = new Date(appointment.slot.dateTime);
  const isDone = appointment.status === APPOINTMENT_STATUS.ZAKONCZONA;
  const profile = appointment.patient.patientProfile;

  return (
    <div className="max-w-2xl">
      <Link
        href="/lekarz/wizyty"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Powrót do harmonogramu
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {profile?.firstName} {profile?.lastName || appointment.patient.email}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              {dt.toLocaleDateString("pl-PL", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {dt.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
        <Badge
          className={
            isDone
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-blue-100 text-blue-800 border-blue-200"
          }
        >
          {isDone ? "Zakończona" : "Zaplanowana"}
        </Badge>
      </div>

      {!appointment.consentGranted ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            Pacjent nie wyraził zgody na udostępnienie danych.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dane osobowe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProfileRow
                label="Imię i nazwisko"
                value={`${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() || "—"}
              />
              <ProfileRow label="Data urodzenia" value={profile?.dateOfBirth || "—"} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informacje medyczne</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProfileRow label="Alergie" value={profile?.allergies || "—"} />
              <ProfileRow label="Choroby przewlekłe" value={profile?.chronicDiseases || "—"} />
              <ProfileRow label="Leki stałe" value={profile?.medications || "—"} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Dokumentacja medyczna ({appointment.patient.documents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointment.patient.documents.length === 0 ? (
                <p className="text-sm text-gray-500">Brak dokumentów.</p>
              ) : (
                <div className="space-y-2">
                  {appointment.patient.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50"
                    >
                      {doc.mimeType === "application/pdf" ? (
                        <FileText className="h-4 w-4 text-red-500 shrink-0" />
                      ) : (
                        <Image className="h-4 w-4 text-blue-500 shrink-0" />
                      )}
                      <span className="text-sm text-gray-700 flex-1 truncate">
                        {doc.filename}
                      </span>
                      <a
                        href={doc.storagePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {!isDone && (
            <Link
              href={`/lekarz/wizyty/${id}/podsumowanie`}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <ClipboardList className="h-4 w-4" />
              Dodaj podsumowanie wizyty
            </Link>
          )}

          {isDone && appointment.visitSummary && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-base text-green-800">
                  Podsumowanie wizyty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ProfileRow label="Rozpoznanie" value={appointment.visitSummary.diagnosis || "—"} />
                <ProfileRow label="Zalecenia" value={appointment.visitSummary.recommendations || "—"} />
                <ProfileRow label="Przepisane leki" value={appointment.visitSummary.prescribedMedications || "—"} />
                <ProfileRow label="Skierowania" value={appointment.visitSummary.referrals || "—"} />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="text-sm text-gray-500 w-44 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 whitespace-pre-wrap">{value}</span>
    </div>
  );
}
