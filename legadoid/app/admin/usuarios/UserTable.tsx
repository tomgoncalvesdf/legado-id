"use client";

import { useState, useTransition } from "react";
import { updateUserPlanAction, toggleAdminAction } from "./actions";
import { ShieldCheck, ShieldOff, Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  plan: string;
  is_admin: boolean | null;
  created_at: string;
  memorial_count: number;
}

// ─── Plan selector ────────────────────────────────────────────────────────────
function PlanSelector({ user }: { user: User }) {
  const [pending, startTransition] = useTransition();
  const [optimisticPlan, setOptimisticPlan] = useState(user.plan);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newPlan = e.target.value as "free" | "monthly" | "lifetime";
    const prev = optimisticPlan;
    setOptimisticPlan(newPlan);
    setError(null);

    startTransition(async () => {
      const result = await updateUserPlanAction(user.id, newPlan);
      if (!result.success) {
        setOptimisticPlan(prev);
        setError(result.error ?? "Erro ao atualizar plano");
      }
    });
  }

  const styles: Record<string, string> = {
    lifetime: "text-amber-light bg-amber-medium/15 border-amber-medium/30",
    monthly: "text-blue-300 bg-blue-500/10 border-blue-500/20",
    free: "text-white/40 bg-white/5 border-white/10",
  };

  return (
    <div className="relative inline-flex items-center gap-1.5">
      {pending && (
        <Loader2 size={12} className="animate-spin text-white/40 absolute -left-4" />
      )}
      <select
        value={optimisticPlan}
        onChange={handleChange}
        disabled={pending}
        className={`text-xs font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 border cursor-pointer outline-none appearance-none pr-5 ${
          styles[optimisticPlan] ?? styles.free
        } disabled:opacity-50`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 24 24' fill='none' stroke='%23ffffff40' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 4px center",
        }}
        title={error ?? "Alterar plano"}
      >
        <option value="free">Gratuito</option>
        <option value="monthly">Mensal</option>
        <option value="lifetime">Eterno</option>
      </select>
      {error && (
        <span className="text-xs text-red-400 absolute top-full left-0 mt-0.5 whitespace-nowrap">
          {error}
        </span>
      )}
    </div>
  );
}

// ─── Admin toggle ─────────────────────────────────────────────────────────────
function AdminToggle({ user }: { user: User }) {
  const [pending, startTransition] = useTransition();
  const [isAdmin, setIsAdmin] = useState(user.is_admin ?? false);
  const [error, setError] = useState<string | null>(null);

  function handleToggle() {
    const newValue = !isAdmin;
    setIsAdmin(newValue);
    setError(null);

    startTransition(async () => {
      const result = await toggleAdminAction(user.id, newValue);
      if (!result.success) {
        setIsAdmin(!newValue);
        setError(result.error ?? "Erro");
      }
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      className={`p-1.5 rounded-lg transition-all disabled:opacity-50 ${
        isAdmin
          ? "text-amber-light bg-amber-medium/15 hover:bg-amber-medium/25"
          : "text-white/20 hover:text-white/50 hover:bg-white/8"
      }`}
      title={error ?? (isAdmin ? "Remover admin" : "Tornar admin")}
    >
      {pending ? (
        <Loader2 size={13} className="animate-spin" />
      ) : isAdmin ? (
        <ShieldCheck size={13} strokeWidth={1.5} />
      ) : (
        <ShieldOff size={13} strokeWidth={1.5} />
      )}
    </button>
  );
}

// ─── User table ───────────────────────────────────────────────────────────────
export function UserTable({ users }: { users: User[] }) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/4 py-16 text-center">
        <p className="text-sm text-white/20">Nenhum usuário encontrado</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/8 bg-white/4">
            <th className="px-4 py-3 text-left text-xs text-white/30 font-medium">
              Usuário
            </th>
            <th className="px-4 py-3 text-left text-xs text-white/30 font-medium">
              Plano
            </th>
            <th className="px-4 py-3 text-center text-xs text-white/30 font-medium">
              Memoriais
            </th>
            <th className="px-4 py-3 text-left text-xs text-white/30 font-medium">
              Cadastro
            </th>
            <th className="px-4 py-3 text-center text-xs text-white/30 font-medium">
              Admin
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/4">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-white/2 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-white/50">
                      {((user.name ?? user.email)[0] ?? "?").toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/80 truncate max-w-[160px]">
                      {user.name ?? "—"}
                    </p>
                    <p className="text-xs text-white/30 truncate max-w-[160px]">
                      {user.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <PlanSelector user={user} />
              </td>
              <td className="px-4 py-3 text-center tabular-nums text-white/50">
                {user.memorial_count}
              </td>
              <td className="px-4 py-3 text-xs text-white/30 whitespace-nowrap">
                {new Date(user.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3 text-center">
                <AdminToggle user={user} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
