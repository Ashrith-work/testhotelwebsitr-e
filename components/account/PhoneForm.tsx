"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updatePhone, type PhoneState } from "@/app/account/actions";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-forest shrink-0 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export default function PhoneForm({ phone }: { phone: string | null }) {
  const [state, formAction] = useFormState<PhoneState, FormData>(
    updatePhone,
    null,
  );

  return (
    <form action={formAction} className="mt-2">
      <label htmlFor="phone" className="input-label">
        Phone number
      </label>
      <div className="flex gap-2">
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={phone ?? ""}
          placeholder="+91 …"
          className="input-field"
        />
        <SaveButton />
      </div>
      {state && (
        <p
          className={`mt-1.5 text-xs ${
            state.ok ? "text-forest" : "text-maroon"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
