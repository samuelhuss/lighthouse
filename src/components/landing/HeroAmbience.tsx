"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Fundo âmbar/crepuscular do hero — iluminação de farol orgânica e difusa */
export function HeroAmbience() {
  const reduzir = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Gradiente crepuscular base */}
      <div className="absolute inset-0 bg-[linear-gradient(165deg,#fff9eb_0%,#f6e7bd_22%,#e8c76655_42%,#3462ac33_58%,#223164_78%,#0e2043_100%)]" />
      
      {/* Aura de iluminação do farol no topo central (difusão natural sem feixe cortado) */}
      <motion.div
        animate={reduzir ? undefined : { opacity: [0.85, 1, 0.85], scale: [1, 1.03, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        {/* Glow principal do farol expandido suavemente */}
        <div className="hero-beacon-glow absolute left-1/2 -top-[25%] h-[110vmin] w-[110vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,246,215,0.95)_0%,rgba(232,199,102,0.45)_32%,rgba(232,175,46,0.18)_55%,transparent_75%)] blur-2xl" />
        
        {/* Aura atmosférica sutil de suporte */}
        <div className="absolute left-1/2 -top-[10%] h-[70vmin] w-[85vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.5)_0%,rgba(232,199,102,0.22)_45%,transparent_75%)] blur-xl" />
      </motion.div>

      {/* Textura de granulado sutil */}
      <div className="landing-grain absolute inset-0 opacity-[0.25]" />
      
      {/* Transição suave para a base navy escura */}
      <div className="absolute inset-x-0 bottom-0 h-[50%] bg-[linear-gradient(180deg,transparent_0%,rgba(14,32,67,.45)_50%,rgba(6,13,28,.88)_100%)]" />
    </div>
  );
}
