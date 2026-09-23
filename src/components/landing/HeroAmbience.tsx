"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Fundo âmbar/crepuscular do hero — reutilizado no cartão de visita */
export function HeroAmbience() {
  const reduzir = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(165deg,#fff9eb_0%,#f6e7bd_22%,#e8c76655_42%,#3462ac33_58%,#223164_78%,#0e2043_100%)]" />
      <motion.div
        animate={reduzir ? undefined : { y: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <div className="hero-beacon-glow absolute left-1/2 top-[-18%] h-[95vmin] w-[95vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,236,180,.95)_0%,rgba(232,175,46,.35)_35%,transparent_68%)]" />
        <div className="hero-beacon-glow absolute -right-[10%] top-[8%] h-[55vmin] w-[55vmin] rounded-full bg-[radial-gradient(circle,rgba(232,199,102,.5)_0%,transparent_70%)] [animation-delay:-3s]" />
      </motion.div>
      <div className="hero-beacon-beam absolute left-[18%] top-0 h-[70%] w-[45%] opacity-40" />
      <div className="landing-grain absolute inset-0 opacity-[0.35]" />
      <div className="absolute inset-x-0 bottom-0 h-[50%] bg-[linear-gradient(180deg,transparent_0%,rgba(14,32,67,.45)_50%,rgba(6,13,28,.88)_100%)]" />
    </div>
  );
}
