"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface PainelHeaderProps {
  onMenuToggle: () => void;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onSignOut: () => void;
  title?: string;
}

// ─── Avatar placeholder ───────────────────────────────────────────────────────
function Avatar({
  name,
  src,
  size = "md",
}: {
  name?: string;
  src?: string;
  size?: "sm" | "md";
}) {
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const sizeClass = size === "sm" ? "w-7 h-7 text-xs" : "w-8 h-8 text-sm";

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ?? "avatar"}
        className={cn("rounded-full object-cover", sizeClass)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-amber-soft text-amber-deep font-semibold flex items-center justify-center flex-shrink-0",
        sizeClass
      )}
    >
      {initials}
    </div>
  );
}

// ─── User dropdown ────────────────────────────────────────────────────────────
function UserMenu({
  userName,
  userEmail,
  userAvatar,
  onSignOut,
}: {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-stone/5 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Avatar name={userName} src={userAvatar} />
        <span className="hidden sm:block text-sm font-medium text-stone/80 max-w-[120px] truncate">
          {userName?.split(" ")[0] ?? "Conta"}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-stone/40 transition-transform duration-150",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-card border border-stone/8 py-2 z-50 animate-fade-in">
          {/* Info do usuário */}
          <div className="px-4 py-3 border-b border-stone/8">
            <p className="text-sm font-medium text-stone truncate">
              {userName ?? "Usuário"}
            </p>
            <p className="text-xs text-stone/50 truncate">{userEmail}</p>
          </div>

          {/* Links */}
          <nav className="py-2 px-2">
            <Link
              href="/painel/configuracoes"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-stone/70 hover:bg-stone/5 hover:text-stone transition-colors"
            >
              <Settings size={15} strokeWidth={1.5} />
              Configurações
            </Link>
            <Link
              href="/painel/perfil"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-stone/70 hover:bg-stone/5 hover:text-stone transition-colors"
            >
              <User size={15} strokeWidth={1.5} />
              Meu perfil
            </Link>
          </nav>

          <div className="mx-2 border-t border-stone/8" />

          <div className="py-2 px-2">
            <button
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} strokeWidth={1.5} />
              Sair da conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Header principal ─────────────────────────────────────────────────────────
export function PainelHeader({
  onMenuToggle,
  userName,
  userEmail,
  userAvatar,
  onSignOut,
  title,
}: PainelHeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-mist/90 backdrop-blur-sm border-b border-stone/8 sticky top-0 z-30">
      {/* Esquerda: hamburguer + título */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-stone/50 hover:text-stone hover:bg-stone/5 transition-colors lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>

        {title && (
          <h1 className="text-base font-semibold text-stone hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      {/* Direita: notificações + usuário */}
      <div className="flex items-center gap-1">
        {/* Notificações (placeholder) */}
        <button className="p-2 rounded-xl text-stone/40 hover:text-stone hover:bg-stone/5 transition-colors relative">
          <Bell size={18} strokeWidth={1.5} />
        </button>

        <UserMenu
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
          onSignOut={onSignOut}
        />
      </div>
    </header>
  );
}
