"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Como funciona", href: "/como-funciona" },
  { label: "Exemplos",      href: "/exemplos" },
  { label: "Preços",        href: "/precos" },
  { label: "Para Funerárias", href: "/para-funerarias" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="section-container">
        <nav className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-amber-deep flex items-center justify-center
                            transition-transform group-hover:scale-105">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-semibold text-stone tracking-wide">
              LEGADO <span className="text-amber-deep">ID</span>
            </span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-stone/70 hover:text-stone
                           transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTAs desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/entrar"
              className="text-sm font-medium text-stone/70 hover:text-stone transition-colors"
            >
              Entrar
            </Link>
            <Link href="/criar" className="btn-primary text-sm py-2.5 px-5">
              Criar meu Legado
            </Link>
          </div>

          {/* Botão mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-sand transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Menu mobile */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-border mt-0 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col gap-1 pt-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-stone/70 hover:text-stone
                             hover:bg-sand rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 px-4 flex flex-col gap-2 border-t border-border mt-2">
                <Link
                  href="/entrar"
                  className="btn-secondary text-sm text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  href="/criar"
                  className="btn-primary text-sm text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Criar meu Legado
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
