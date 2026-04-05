import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInYears, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// ─── CLASSNAMES ───────────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── DATAS ────────────────────────────────────────────────────────────────────
export function formatDate(date: string | Date, pattern = "dd 'de' MMMM 'de' yyyy") {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern, { locale: ptBR });
}

export function formatDateShort(date: string | Date) {
  return formatDate(date, "dd/MM/yyyy");
}

export function calcAge(birthDate: string, deathDate?: string): number {
  const birth = parseISO(birthDate);
  const end = deathDate ? parseISO(deathDate) : new Date();
  return differenceInYears(end, birth);
}

export function formatLifespan(birthDate?: string, deathDate?: string): string {
  if (!birthDate && !deathDate) return "";
  if (birthDate && deathDate) {
    return `${formatDate(birthDate, "dd/MM/yyyy")} — ${formatDate(deathDate, "dd/MM/yyyy")}`;
  }
  if (birthDate) return `Nascido em ${formatDate(birthDate, "dd/MM/yyyy")}`;
  return "";
}

// ─── SLUG ─────────────────────────────────────────────────────────────────────
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// ─── STORAGE ──────────────────────────────────────────────────────────────────
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── TEXTO ────────────────────────────────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// ─── MEMORIAL ─────────────────────────────────────────────────────────────────
export function getMemorialUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl}/${slug}`;
}

export function getMemorialShareText(name: string, slug: string): string {
  const url = getMemorialUrl(slug);
  return `Conheça o Legado de ${name} ✨\n${url}`;
}

// ─── PLANOS ───────────────────────────────────────────────────────────────────
export const PLAN_LABELS = {
  free:     "Gratuito",
  monthly:  "Mensal",
  lifetime: "Eterno",
  b2b:      "Parceiro",
} as const;

export const PLAN_PRICES = {
  monthly:  29,
  lifetime: 197,
} as const;

// ─── MÓDULOS ──────────────────────────────────────────────────────────────────
export const MODULE_LABELS: Record<string, string> = {
  biography:   "Biografia",
  photos:      "Galeria de Fotos",
  videos:      "Galeria de Vídeos",
  timeline:    "Linha do Tempo",
  family_tree: "Raízes",
  memory_wall: "Livro de Memórias",
  candles:     "Velas Virtuais",
  music:       "Música",
  service:     "Serviço Fúnebre",
  prayers:     "Orações e Missas",
  rsvp:        "Confirmação de Presença",
  location:    "Localização",
};

// ─── VALIDAÇÃO ────────────────────────────────────────────────────────────────
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 3;
}
