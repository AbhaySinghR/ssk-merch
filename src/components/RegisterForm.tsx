"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";
import { registerUser } from "@/app/sign-in/actions";
import { initialRegisterState } from "@/app/sign-in/types";

const TITLES = ["Mr", "Mrs", "Ms", "Dr", "Maj", "Col", "Brig", "Gen"];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-300">{message}</p>;
}

const inputClass =
  "w-full border border-cream/20 bg-transparent px-4 py-3 text-sm text-cream placeholder:text-warm-grey/60 outline-none transition-colors focus:border-gold";

function TitleDropdown({
  error,
  value,
  onChange,
}: {
  error?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Hidden input so the value is included in the form data */}
      <input type="hidden" name="title" value={value} />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${inputClass} mt-2 flex items-center justify-between`}
      >
        <span className={value ? "text-cream" : "text-warm-grey/60"}>
          {value || "Select"}
        </span>
        <ChevronDown
          size={14}
          className={`text-warm-grey transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 border border-gold/20 bg-maroon-dark shadow-xl">
          {TITLES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                onChange(t);
                setOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-maroon hover:text-gold ${
                value === t ? "text-gold" : "text-cream"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <FieldError message={error} />
    </div>
  );
}

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerUser,
    initialRegisterState,
  );
  const [phone, setPhone] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    if (state.success) {
      toast.success("Registration complete! Check your inbox.");
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

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
          <label className="text-xs tracking-[0.2em] text-warm-grey">
            TITLE
          </label>
          <TitleDropdown
            value={title}
            onChange={setTitle}
            error={state.errors.title}
          />
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

      {!state.success && state.message && (
        <p className="border border-red-400/30 bg-red-900/20 px-4 py-3 text-xs text-red-300">
          {state.message}
        </p>
      )}

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
