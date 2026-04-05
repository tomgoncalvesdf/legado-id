"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookHeart,
  MessageSquareHeart,
  ShieldCheck,
  Flame,
  ExternalLink,
  X,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/usuarios", label: "Usuários", icon: Users, exact: false },
  { href: "/admin/memoriais", label: "Memoriais", icon: BookHeart, exact: false },
  { href: "/admin/memorias", label: "Moderação", icon: MessageSquareHeart, exact: false },
];

function NavLink({
  href,
  label,
  icon: Icon,
  exact,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  exact: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-white/10 text-white"
          : "text-white/50 hover:text-white hover:bg-white/6"
      )}
    >
      <Icon
        size={16}
        strokeWidth={isActive ? 2 : 1.5}
        className={isActive ? "text-amber-light" : ""}
      />
      {label}
      {isActive && (
        <div className="ml-auto w-1 h-1 rounded-full bg-amber-medium" />
      )}
    </Link>
  );
}

interface AdminSidebarContentProps {
  adminEmail: string;
  onClose?: () => void;
}

function AdminSidebarContent({ adminEmail, onClose }: AdminSidebarContentProps) {
  return (
    <aside className="flex flex-col h-full bg-stone-950 border-r border-white/8 w-56">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2 border-b border-white/8">
        <Flame size={18} className="text-amber-medium" strokeWidth={1.5} />
        <span className="font-display text-base font-semibold text-white tracking-wide">
          Legado ID
        </span>
        <span className="ml-auto px-1.5 py-0.5 rounded bg-amber-medium/20 text-amber-light text-[10px] font-bold uppercase tracking-wide">
          Admin
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-1 p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-colors lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} onClick={onClose} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/8 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-amber-medium" strokeWidth={1.5} />
          <p className="text-xs text-white/40 truncate">{adminEmail}</p>
        </div>
        <Link
          href="/painel"
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          <ExternalLink size={12} />
          Voltar ao painel
        </Link>
      </div>
    </aside>
  );
}

// ─── Wrapper com suporte a mobile drawer ──────────────────────────────────────
export function AdminSidebarWrapper({ adminEmail }: { adminEmail: string }) {
  const [open, setOpen] = useState(false);

  // Fecha ao redimensionar para desktop
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* Desktop sidebar (fixo) */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-30">
        <AdminSidebarContent adminEmail={adminEmail} />
      </div>

      {/* Mobile: botão hamburguer no header — emitido via evento customizado */}
      {/* O header lê esse estado via prop */}

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AdminSidebarContent
          adminEmail={adminEmail}
          onClose={() => setOpen(false)}
        />
      </div>

      {/* Botão toggle mobile — exibido no header via portal não é trivial em RSC,
          então expomos um botão flutuante que abre o drawer */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-stone-900 border border-white/10 text-white/50 hover:text-white hover:bg-stone-800 transition-all shadow-lg"
        aria-label="Abrir menu"
      >
        <Menu size={16} strokeWidth={1.5} />
      </button>
    </>
  );
}
