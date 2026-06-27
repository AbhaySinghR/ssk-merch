"use client";

import { motion } from "framer-motion";

export default function HeritageCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className="px-0 py-10 sm:px-10 sm:py-0"
    >
      {children}
    </motion.div>
  );
}
