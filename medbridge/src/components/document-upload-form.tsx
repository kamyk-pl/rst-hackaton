"use client";

import { useActionState, useRef, useEffect } from "react";
import { uploadDocument } from "@/app/actions/documents";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export function DocumentUploadForm() {
  const [state, action, pending] = useActionState(uploadDocument, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === null && !pending) formRef.current?.reset();
  }, [state, pending]);

  return (
    <form ref={formRef} action={action}>
      <Card>
        <CardContent className="pt-6">
          <label className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Kliknij, aby wybrać plik</p>
              <p className="text-xs text-gray-500 mt-1">PDF lub JPG, max 10 MB</p>
            </div>
            <input
              type="file"
              name="file"
              accept=".pdf,.jpg,.jpeg"
              className="sr-only"
              onChange={(e) => e.target.form?.requestSubmit()}
            />
          </label>

          {pending && (
            <p className="text-sm text-blue-600 mt-3 text-center">Wgrywanie...</p>
          )}
          {state?.error && (
            <p className="text-sm text-red-600 mt-3 text-center">{state.error}</p>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
