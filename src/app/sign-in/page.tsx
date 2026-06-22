import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Sign In | Sainik School Kapurthala Merch",
  description: "Register as a Sainik School Kapurthala alumnus to get connected.",
};

export default function SignInPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1 bg-maroon">
        <section className="mx-auto w-full max-w-2xl px-6 py-20 lg:px-10">
          <p className="text-xs font-medium tracking-[0.3em] text-gold">
            ALUMNI REGISTRATION
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-cream sm:text-6xl">
            Let&apos;s get <span className="italic text-gold">connected</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-warm-grey">
            Register below to join the Sainik School Kapurthala Merch alumni
            community. We&apos;ll
            send you a confirmation by email once you&apos;re in.
          </p>

          <div className="mt-12">
            <RegisterForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
