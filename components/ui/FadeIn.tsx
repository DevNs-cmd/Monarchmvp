"use client";

import { motion } from "framer-motion";
import type { HTMLAttributes } from "react";

export default function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
}: HTMLAttributes<HTMLDivElement> & { delay?: number; duration?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
