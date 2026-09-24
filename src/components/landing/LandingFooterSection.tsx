"use client";

export function LandingFooterSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative z-10 px-4 sm:px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Divisor suave — sem fundo diferente */}
        <div className="border-t border-white/10 pt-10 flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
          <img
            src="/brand/lighthouse-icon.webp"
            alt="Farol Lighthouse"
            className="h-10 sm:h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity drop-shadow-md"
          />

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-white/40 font-medium">
            {[
              { id: "inicio", label: "Início" },
              { id: "sobre", label: "Sobre Nós" },
              { id: "regras", label: "Regras" },
              { id: "local", label: "O Lugar" },
              { id: "faq", label: "FAQ" },
              { id: "inscricao", label: "Inscrição" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="hover:text-white/80 transition cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-white/30 font-mono">
            © 2027 D'One, Rota&Link
          </span>
        </div>
      </div>
    </footer>
  );
}
