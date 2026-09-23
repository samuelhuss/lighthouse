"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Deslocamento inicial maior para blocos principais */
  distance?: number;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  distance = 28,
}: RevealOnScrollProps) {
  const reduzir = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduzir ? false : { opacity: 0, y: distance }}
      whileInView={reduzir ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "-60px" }}
      transition={{ duration: 0.75, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

/** Envolve filhos diretos com entrada escalonada ao rolar */
export function RevealStagger({ children, className, stagger = 0.1 }: StaggerProps) {
  const reduzir = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "-40px" }}
      variants={{
        hidden: {},
        show: {
          transition: reduzir ? { staggerChildren: 0 } : { staggerChildren: stagger },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealStaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduzir = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={
        reduzir
          ? undefined
          : {
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easeOut } },
            }
      }
    >
      {children}
    </motion.div>
  );
}
