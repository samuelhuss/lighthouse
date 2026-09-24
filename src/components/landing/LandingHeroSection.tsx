"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function LandingHeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax: title sobe devagar enquanto o usuario rola
  const rawY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const y = useSpring(rawY, { stiffness: 80, damping: 20 });

  // Fade out suave conforme rola
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Escala leve — começa ligeiramente maior e encolhe
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative min-h-[100dvh] flex flex-col justify-between pt-20 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden"
    >
      {/* Title com parallax */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 w-full my-auto flex flex-col items-center justify-center px-2"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif font-black tracking-tighter text-white leading-none select-none w-full max-w-[100vw]"
          style={{
            fontSize: "clamp(2rem, 12.5vw, 9.5rem)",
            textShadow: "0 8px 60px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          LIGHTHOUSE'27
        </motion.h1>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative z-10 text-center pb-2 sm:pb-0"
      >
        <button
          onClick={() => scrollToSection("sobre")}
          className="inline-flex flex-col items-center gap-2 text-[10px] font-mono tracking-widest text-white/60 hover:text-white transition uppercase cursor-pointer"
        >
          <span>Role para explorar</span>
          <div className="h-5 w-0.5 bg-white/60 animate-pulse" />
        </button>
      </motion.div>
    </section>
  );
}
