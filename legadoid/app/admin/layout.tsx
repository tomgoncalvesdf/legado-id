import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { AdminSidebarWrapper } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/painel");

  return (
    <div className="min-h-screen bg-stone-950 flex">
      {/* Sidebar (desktop fixo + mobile drawer) */}
      <AdminSidebarWrapper adminEmail={admin.email} />

      {/* ── Conteúdo principal ──────────────────────────────────────── */}
      <div className="flex-1 lg:pl-56 min-w-0">
        {/* Header sticky */}
        <header className="h-14 flex items-center px-4 sm:px-8 border-b border-white/8 bg-stone-950/90 backdrop-blur-sm sticky top-0 z-20">
          {/* Espaço para o botão hamburguer no mobile */}
          <div className="w-10 lg:hidden" />
          <p className="text-xs text-white/25 font-mono">
            admin console · legadoid.com
          </p>
        </header>

        <main className="px-4 sm:px-8 py-6 sm:py-8 max-w-6xl animate-fade-up">
          {children}
        </main>
      </div>
    </div>
  );
}
