"use client";

import { useActionState } from "react";
import type { PatientProfile, AllergySeverity } from "@/domain/patient/types";

// Action types are defined inline to avoid importing from a "use server" module
// in a "use client" component, which violates the server/client module boundary.
type ServerAction = (formData: FormData) => Promise<void>;

type Actions = {
  updateProfile: ServerAction;
  addAllergy: ServerAction;
  updateAllergy: ServerAction;
  removeAllergy: ServerAction;
  addDisease: ServerAction;
  removeDisease: ServerAction;
  addMedication: ServerAction;
  removeMedication: ServerAction;
};

interface Props {
  profile: PatientProfile;
  actions: Actions;
}

const SEVERITIES: AllergySeverity[] = ["MILD", "MODERATE", "SEVERE"];

export function ProfileForm({ profile, actions }: Props) {
  const [, updateProfileFormAction, updatingProfile] = useActionState(
    (_prev: void, formData: FormData) => actions.updateProfile(formData),
    undefined
  );

  const [, addAllergyFormAction, addingAllergy] = useActionState(
    (_prev: void, formData: FormData) => actions.addAllergy(formData),
    undefined
  );

  const [, addDiseaseFormAction, addingDisease] = useActionState(
    (_prev: void, formData: FormData) => actions.addDisease(formData),
    undefined
  );

  const [, addMedicationFormAction, addingMedication] = useActionState(
    (_prev: void, formData: FormData) => actions.addMedication(formData),
    undefined
  );

  const dobStr = profile.dateOfBirth.toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-10 w-full max-w-2xl">

      {/* ── Identity fields ── */}
      <section>
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Personal Information</h2>
        <form action={updateProfileFormAction} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" name="firstName" defaultValue={profile.firstName} />
            <Field label="Last Name" name="lastName" defaultValue={profile.lastName} />
          </div>
          <Field label="Date of Birth" name="dateOfBirth" type="date" defaultValue={dobStr} />
          <SaveButton pending={updatingProfile} />
        </form>
      </section>

      {/* ── Allergies ── */}
      <section>
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Allergies</h2>
        <ul className="flex flex-col gap-3 mb-6">
          {profile.allergies.map((allergy) => (
            <li key={allergy.id} className="rounded border border-zinc-200 p-3">
              {/*
               * Single form with two submit buttons using formAction — avoids
               * invalid nested <form> elements. Each button's formAction
               * determines which server action handles the submission.
               */}
              <form className="flex flex-col gap-2">
                <input type="hidden" name="allergyId" value={allergy.id} />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Allergen" name="allergen" defaultValue={allergy.allergen} compact />
                  <Field label="Reaction Type" name="reactionType" defaultValue={allergy.reactionType} compact />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-zinc-600">Severity</label>
                    <select
                      name="severity"
                      defaultValue={allergy.severity}
                      className="rounded border border-zinc-300 px-2 py-1.5 text-sm"
                    >
                      {SEVERITIES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <Field
                    label="Date Identified"
                    name="dateIdentified"
                    type="date"
                    defaultValue={allergy.dateIdentified?.toISOString().slice(0, 10) ?? ""}
                    compact
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    formAction={actions.updateAllergy}
                    className="rounded bg-zinc-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
                  >
                    Save
                  </button>
                  <button
                    type="submit"
                    formAction={actions.removeAllergy}
                    className="rounded border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </form>
            </li>
          ))}
        </ul>

        <form action={addAllergyFormAction} className="rounded border border-dashed border-zinc-300 p-4 flex flex-col gap-3">
          <p className="text-sm font-medium text-zinc-600">Add Allergy</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Allergen" name="allergen" required compact />
            <Field label="Reaction Type" name="reactionType" required compact />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-600">Severity</label>
              <select name="severity" className="rounded border border-zinc-300 px-2 py-1.5 text-sm">
                {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Field label="Date Identified (optional)" name="dateIdentified" type="date" compact />
          </div>
          <SaveButton label="Add Allergy" pending={addingAllergy} />
        </form>
      </section>

      {/* ── Chronic Diseases ── */}
      <section>
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Chronic Diseases</h2>
        <ul className="flex flex-col gap-2 mb-4">
          {profile.diseases.map((disease) => (
            <li key={disease.id} className="flex items-center justify-between rounded border border-zinc-200 px-3 py-2 text-sm">
              <span>{disease.name}</span>
              <form>
                <input type="hidden" name="diseaseId" value={disease.id} />
                <button
                  type="submit"
                  formAction={actions.removeDisease}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addDiseaseFormAction} className="flex gap-2">
          <input
            name="name"
            required
            placeholder="Disease name"
            className="flex-1 rounded border border-zinc-300 px-3 py-1.5 text-sm"
          />
          <SaveButton label="Add" pending={addingDisease} />
        </form>
      </section>

      {/* ── Medications ── */}
      <section>
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Permanent Medications</h2>
        <ul className="flex flex-col gap-2 mb-4">
          {profile.medications.map((med) => (
            <li key={med.id} className="flex items-center justify-between rounded border border-zinc-200 px-3 py-2 text-sm">
              <span>{med.name}</span>
              <form>
                <input type="hidden" name="medicationId" value={med.id} />
                <button
                  type="submit"
                  formAction={actions.removeMedication}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addMedicationFormAction} className="flex gap-2">
          <input
            name="name"
            required
            placeholder="Medication name and dosage"
            className="flex-1 rounded border border-zinc-300 px-3 py-1.5 text-sm"
          />
          <SaveButton label="Add" pending={addingMedication} />
        </form>
      </section>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  compact?: boolean;
}

function Field({ label, name, type = "text", defaultValue, required, compact }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`font-medium text-zinc-600 ${compact ? "text-xs" : "text-sm"}`}>{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className={`rounded border border-zinc-300 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-500 ${compact ? "py-1.5 text-sm" : "py-2 text-sm"}`}
      />
    </div>
  );
}

interface SaveButtonProps {
  pending: boolean;
  label?: string;
}

function SaveButton({ pending, label = "Save Changes" }: SaveButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
