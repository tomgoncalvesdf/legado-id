"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { Sidebar } from "@/components/painel/Sidebar";
import { PainelHeader } from "@/components/painel/PainelHeader";

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Proteger rota client-side (o middleware já faz server-side, mas redundância é boa)
  useEffect(() => {
    if (!loading && !user) {
      router.push("/entrar");
    }
  }, [loading, user, router]);

  // Fechar sidebar ao redimensionar para desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-medium border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone/50">Carregando…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-sand flex">
      {/* ── Overlay mobile ─────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-stone/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar desktop (fixa) ──────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 lg:z-30">
        <Sidebar
          onSignOut={handleSignOut}
          userName={user.name ?? undefined}
        />
      </div>

      {/* ── Sidebar mobile (drawer) ─────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar
          onSignOut={handleSignOut}
          userName={user.name ?? undefined}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* ── Conteúdo principal ─────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 lg:pl-60 min-w-0">
        <PainelHeader
          onMenuToggle={() => setSidebarOpen(true)}
          userName={user.name ?? undefined}
          userEmail={user.email}
          userAvatar={user.avatar_url ?? undefined}
          onSignOut={handleSignOut}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
