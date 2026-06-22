"use client";

import { motion } from "framer-motion";

const columns = [
  {
    numeral: "I",
    title: "School History",
    body: "Founded in 1961, Sainik School Kapurthala has shaped generations of students who went on to serve, build, lead, and create — each carrying a part of these grounds with them.",
  },
  {
    numeral: "II",
    title: "Our Mission",
    body: "To carry forward the discipline, friendships, and pride found within these walls into the everyday lives of every Saikapian, one piece of merchandise at a time.",
  },
  {
    numeral: "III",
    title: "Alumni Community",
    body: "A growing community spanning professions, countries, and decades — united not by one path, but by the same school, the same memories, and the same pride.",
  },
];

export default function Heritage() {
  return (
    <section className="bg-maroon-dark px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 border-b border-gold/20 pb-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.3em] text-gold">
              THE LEGACY
            </p>
            <h2 className="mt-6 max-w-xl font-display text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
              Heritage, in three movements.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-warm-grey">
            Every collection we release is rooted in the same institution
            that shaped us — its history, its purpose, and the community it
            continues to build long after we walked out of its gates.
          </p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-gold/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {columns.map((column, i) => (
            <motion.div
              key={column.numeral}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              className="px-0 py-10 sm:px-10 sm:py-0"
            >
              <span className="font-display text-3xl italic text-gold">
                {column.numeral}
              </span>
              <h3 className="mt-6 font-display text-2xl text-cream">
                {column.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-warm-grey">
                {column.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
