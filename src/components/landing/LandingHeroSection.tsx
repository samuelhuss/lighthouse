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
      className="relative min-h-[100dvh] flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden"
    >
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 w-full flex flex-col items-center justify-center px-2"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center justify-center px-4 -mt-16 lg:-mt-40"
        >
          <img
            src="/brand/lighthouse-hero-text.webp"
            alt="LIGHTHOUSE'27"
            className="w-[95vw] sm:w-[85vw] max-w-[1000px] lg:scale-110 xl:scale-125 h-auto object-contain drop-shadow-[0_8px_60px_rgba(0,0,0,0.35)]"
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-0 right-0 z-10 text-center"
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
