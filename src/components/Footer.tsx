export default function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-maroon-dark">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-[11px] tracking-[0.2em] text-warm-grey sm:flex-row lg:px-10">
        <p>
          &copy; {new Date().getFullYear()} Sainik School Kapurthala Merch.
          All rights reserved.
        </p>
        <p>
          DISCIPLINE <span className="text-gold/40">&middot;</span> HONOUR{" "}
          <span className="text-gold/40">&middot;</span> SERVICE
        </p>
      </div>
    </footer>
  );
}
