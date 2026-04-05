"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Flame,
  LayoutDashboard,
  BookHeart,
  PlusCircle,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";

// ─── Nav links ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: "Painel",
    href: "/painel",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Meus Memoriais",
    href: "/painel/memoriais",
    icon: BookHeart,
    exact: false,
  },
  {
    label: "Criar Memorial",
    href: "/criar",
    icon: PlusCircle,
    exact: false,
    highlight: true,
  },
  {
    label: "Fazer Upgrade",
    href: "/painel/upgrade",
    icon: Sparkles,
    exact: false,
    highlight: false,
  },
];

const BOTTOM_ITEMS = [
  {
    label: "Configurações",
    href: "/painel/configuracoes",
    icon: Settings,
  },
  {
    label: "Ajuda",
    href: "/ajuda",
    icon: HelpCircle,
  },
];

// ─── Nav item component ───────────────────────────────────────────────────────
function NavItem({
  href,
  icon: Icon,
  label,
  exact = false,
  highlight = false,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
  highlight?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-amber-soft text-amber-deep shadow-sm"
          : highlight
          ? "text-amber-medium hover:bg-amber-soft/60 hover:text-amber-deep"
          : "text-stone/60 hover:bg-stone/5 hover:text-stone"
      )}
    >
      <Icon
        className={cn(
          "w-4.5 h-4.5 flex-shrink-0",
          isActive ? "text-amber-deep" : highlight ? "text-amber-medium" : ""
        )}
        strokeWidth={isActive ? 2 : 1.5}
        size={18}
      />
      {label}
    </Link>
  );
}

// ─── Sidebar content ─────────────────────────────────────────────────────────
interface SidebarProps {
  onSignOut: () => void;
  onClose?: () => void;
  userName?: string;
}

export function Sidebar({ onSignOut, onClose, userName }: SidebarProps) {
  return (
    <aside className="flex flex-col h-full bg-mist border-r border-stone/8">
      {/* Logo + fechar (mobile) */}
      <div className="flex items-center justify-between px-5 py-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-stone hover:text-amber-medium transition-colors"
          onClick={onClose}
        >
          <Flame className="w-5 h-5 text-amber-medium" strokeWidth={1.5} />
          <span className="font-display text-lg font-semibold tracking-wide">
            Legado ID
          </span>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone/40 hover:text-stone hover:bg-stone/5 transition-colors lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Saudação */}
      {userName && (
        <div className="px-5 pb-3">
          <p className="text-xs text-stone/40">
            Olá,{" "}
            <span className="text-stone/70 font-medium">
              {userName.split(" ")[0]}
            </span>
          </p>
        </div>
      )}

      <div className="px-3 pb-3">
        <div className="h-px bg-stone/8" />
      </div>

      {/* Nav principal */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} {...item} onClick={onClose} />
        ))}
      </nav>

      {/* Nav inferior */}
      <div className="px-3 pb-4 pt-3 border-t border-stone/8 space-y-0.5">
        {BOTTOM_ITEMS.map((item) => (
          <NavItem key={item.href} {...item} onClick={onClose} />
        ))}

        <button
          onClick={onSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone/60 hover:bg-red-50 hover:text-red-600 transition-all duration-150 w-full"
        >
          <LogOut size={18} strokeWidth={1.5} className="flex-shrink-0" />
          Sair da conta
        </button>
      </div>
    </aside>
  );
}
