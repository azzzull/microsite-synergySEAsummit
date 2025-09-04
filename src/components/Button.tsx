import React from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

export const Button = ({ children, ...props }: HTMLMotionProps<"button">) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="px-6 py-2 rounded-lg font-semibold bg-[var(--color-navy)] text-[var(--color-lightgrey)] border border-[var(--color-lightgrey)] shadow-sm transition-colors duration-200 hover:bg-[var(--color-navy)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] active:text-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] cursor-pointer"
    {...props}
  >
    {children}
  </motion.button>
);
