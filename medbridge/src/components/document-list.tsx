"use client";
import { deleteDocument } from "@/app/actions/documents";
import { FileText, Image, Trash2, ExternalLink } from "lucide-react";

interface Document { id: string; filename: string; storagePath: string; mimeType: string; uploadedAt: Date; }

export function DocumentList({ documents }: { documents: Document[] }) {
  if (documents.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-4">Brak dokumentów. Wgraj pierwszy plik powyżej.</p>;
  }
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Wgrane dokumenty ({documents.length})</p>
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center gap-3 bg-white rounded-xl px-5 py-3.5 border border-gray-100 shadow-sm">
          {doc.mimeType === "application/pdf"
            ? <FileText className="h-4 w-4 text-red-400 shrink-0" />
            : <Image className="h-4 w-4 text-blue-400 shrink-0" />}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{doc.filename}</p>
            <p className="text-xs text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString("pl-PL")}</p>
          </div>
          <a href={doc.storagePath} target="_blank" rel="noopener noreferrer"
            className="p-1.5 text-gray-300 hover:text-blue-500 transition-colors">
            <ExternalLink className="h-4 w-4" />
          </a>
          <form action={deleteDocument.bind(null, doc.id)}>
            <button type="submit" className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
