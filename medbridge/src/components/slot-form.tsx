"use client";

import { useActionState, useRef, useEffect } from "react";
import { createSlot } from "@/app/actions/slots";

export function SlotForm() {
  const [state, action, pending] = useActionState(createSlot, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === null && !pending) formRef.current?.reset();
  }, [state, pending]);

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent transition-all";

  return (
    <form ref={formRef} action={action}>
      <div className="flex gap-3 items-end">
        <div className="flex-1 space-y-1.5">
          <label className="text-xs font-medium text-gray-500">Data</label>
          <input type="date" name="date" required className={inputCls}
            style={{ ["--tw-ring-color" as string]: "#00bfa5" }} />
        </div>
        <div className="flex-1 space-y-1.5">
          <label className="text-xs font-medium text-gray-500">Godzina</label>
          <input type="time" name="time" required className={inputCls} />
        </div>
        <button type="submit" disabled={pending}
          className="px-4 py-2 rounded-md text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
          style={{ backgroundColor: "#0d0d0d", color: "white" }}>
          {pending ? "Dodawanie..." : "Dodaj termin"}
        </button>
      </div>
      {state?.error && <p className="text-xs text-red-500 mt-2">{state.error}</p>}
    </form>
  );
}
