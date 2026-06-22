"use client";

import { useActionState, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { registerUser } from "@/app/sign-in/actions";
import { initialRegisterState } from "@/app/sign-in/types";

const TITLES = ["Mr", "Mrs", "Ms", "Dr", "Maj", "Col", "Brig", "Gen"];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-300">{message}</p>;
}

const inputClass =
  "w-full border border-cream/20 bg-transparent px-4 py-3 text-sm text-cream placeholder:text-warm-grey/60 outline-none transition-colors focus:border-gold";

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerUser,
    initialRegisterState,
  );
  const [phone, setPhone] = useState<string>("");

  if (state.success) {
    return (
      <div className="border border-gold/30 bg-maroon-dark/60 px-8 py-12 text-center">
        <p className="text-xs font-medium tracking-[0.3em] text-gold">
          REGISTRATION COMPLETE
        </p>
        <h2 className="mt-4 font-display text-3xl text-cream">
          Welcome to the family.
        </h2>
        <p className="mt-3 text-sm text-warm-grey">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[120px_1fr_1fr]">
        <div>
          <label htmlFor="title" className="text-xs tracking-[0.2em] text-warm-grey">
            TITLE
          </label>
          <select
            id="title"
            name="title"
            defaultValue=""
            className={`${inputClass} mt-2 bg-maroon-dark`}
          >
            <option value="" disabled>
              Select
            </option>
            {TITLES.map((t) => (
              <option key={t} value={t} className="bg-maroon-dark">
                {t}
              </option>
            ))}
          </select>
          <FieldError message={state.errors.title} />
        </div>

        <div>
          <label htmlFor="firstName" className="text-xs tracking-[0.2em] text-warm-grey">
            FIRST NAME
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Arjun"
            className={`${inputClass} mt-2`}
          />
          <FieldError message={state.errors.firstName} />
        </div>

        <div>
          <label htmlFor="lastName" className="text-xs tracking-[0.2em] text-warm-grey">
            LAST NAME
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Singh"
            className={`${inputClass} mt-2`}
          />
          <FieldError message={state.errors.lastName} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="text-xs tracking-[0.2em] text-warm-grey">
          EMAIL ID
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className={`${inputClass} mt-2`}
        />
        <FieldError message={state.errors.email} />
      </div>

      <div>
        <label htmlFor="phone" className="text-xs tracking-[0.2em] text-warm-grey">
          PHONE NUMBER
        </label>
        <div className="ssk-phone-input mt-2">
          <PhoneInput
            id="phone"
            name="phone"
            international
            defaultCountry="IN"
            placeholder="Enter phone number"
            value={phone}
            onChange={(value) => setPhone(value ?? "")}
          />
        </div>
        <FieldError message={state.errors.phone} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="schoolNumber"
            className="text-xs tracking-[0.2em] text-warm-grey"
          >
            SCHOOL NUMBER
          </label>
          <input
            id="schoolNumber"
            name="schoolNumber"
            type="text"
            placeholder="e.g. 1234"
            className={`${inputClass} mt-2`}
          />
          <FieldError message={state.errors.schoolNumber} />
        </div>

        <div>
          <label htmlFor="batch" className="text-xs tracking-[0.2em] text-warm-grey">
            BATCH
          </label>
          <input
            id="batch"
            name="batch"
            type="text"
            placeholder="e.g. 2010-2017"
            className={`${inputClass} mt-2`}
          />
          <FieldError message={state.errors.batch} />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-gold px-8 py-4 text-xs font-semibold tracking-[0.2em] text-maroon-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "SUBMITTING..." : "REGISTER"}
      </button>
    </form>
  );
}
