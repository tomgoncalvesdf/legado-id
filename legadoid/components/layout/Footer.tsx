import Link from "next/link";
import { Flame } from "lucide-react";

const FOOTER_LINKS = {
  Produto: [
    { label: "Como funciona", href: "/como-funciona" },
    { label: "Exemplos",      href: "/exemplos" },
    { label: "Temas",         href: "/temas" },
    { label: "Preços",        href: "/precos" },
  ],
  Blog: [
    { label: "Luto e memória",   href: "/blog/luto" },
    { label: "Dia de Finados",   href: "/blog/finados" },
    { label: "Dicas de legado",  href: "/blog/dicas" },
  ],
  Empresa: [
    { label: "Sobre nós",          href: "/sobre" },
    { label: "Para Funerárias",    href: "/para-funerarias" },
    { label: "Contato",            href: "/contato" },
  ],
  Legal: [
    { label: "Privacidade", href: "/privacidade" },
    { label: "Termos de uso", href: "/termos" },
    { label: "LGPD",         href: "/lgpd" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-stone text-white/80">
      <div className="section-container py-16">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-amber-deep flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-semibold text-white tracking-wide">
                LEGADO <span className="text-amber-light">ID</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-[200px]">
              O lugar onde quem você amou nunca some de verdade.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-white mb-4">{section}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} LEGADO ID. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/40 flex items-center gap-1.5">
              🔒 Pagamento seguro via Mercado Pago
            </span>
            <span className="text-xs text-white/40">🇧🇷 Produto brasileiro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
