import { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://legadoid.com";

export const revalidate = 3600; // Regenerar a cada 1 hora

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ─── Páginas estáticas ────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/entrar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cadastrar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // ─── Memoriais públicos ───────────────────────────────────────────────────
  let memorialPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = createAdminClient();

    const { data: memorials } = await supabase
      .from("memorials")
      .select("slug, updated_at")
      .eq("published", true)
      .eq("privacy", "public")
      .order("updated_at", { ascending: false })
      .limit(5000); // Limite para sitemaps grandes

    if (memorials) {
      memorialPages = memorials.map((m) => ({
        url: `${BASE_URL}/${m.slug}`,
        lastModified: new Date(m.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (err) {
    // Em caso de erro no DB, retorna apenas as estáticas
    console.error("[sitemap] Erro ao buscar memoriais:", err);
  }

  return [...staticPages, ...memorialPages];
}
