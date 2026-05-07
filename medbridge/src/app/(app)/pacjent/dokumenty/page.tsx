import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ROLE } from "@/lib/constants";
import { DocumentUploadForm } from "@/components/document-upload-form";
import { DocumentList } from "@/components/document-list";
import { Upload, FileText } from "lucide-react";

export default async function DocumentsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== ROLE.PACJENT) redirect("/login");

  const documents = await prisma.medicalDocument.findMany({
    where: { patientId: session.user.id },
    orderBy: { uploadedAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#00bfa5" }}>Pacjent</p>
        <h1 className="text-3xl font-bold text-gray-900">Dokumentacja medyczna</h1>
        <p className="text-gray-400 mt-1 text-sm">Przechowuj wyniki badań i inne dokumenty w jednym miejscu.</p>
      </div>

      {documents.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard label="Wgrane dokumenty" value={documents.length} icon={<FileText className="h-4 w-4" />} />
          <StatCard label="Dostępne formaty" value="PDF, JPG" text />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
          <Upload className="h-4 w-4" style={{ color: "#00bfa5" }} />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Wgraj dokument</span>
        </div>
        <div className="p-6">
          <DocumentUploadForm />
        </div>
      </div>

      <DocumentList documents={documents} />
    </div>
  );
}

function StatCard({ label, value, icon, text }: { label: string; value: any; icon?: React.ReactNode; text?: boolean }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      {icon && (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "rgba(0,191,165,0.1)", color: "#00bfa5" }}>
          {icon}
        </div>
      )}
      <div>
        <p className={text ? "text-base font-bold text-gray-800" : "text-3xl font-bold"} style={{ color: text ? undefined : "#0d0d0d" }}>{value}</p>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
      </div>
    </div>
  );
}
