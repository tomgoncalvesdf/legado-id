import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatLifespan } from "@/lib/utils";
import { MemorialHero } from "@/components/memorial/MemorialHero";
import { MemorialBio } from "@/components/memorial/MemorialBio";
import { MemorialTraits } from "@/components/memorial/MemorialTraits";
import { PhotoGallery } from "@/components/memorial/PhotoGallery";
import { CandleSection } from "@/components/memorial/CandleSection";
import { MemoryFeed } from "@/components/memorial/MemoryFeed";
import type { Memorial } from "@/types";

// ─── Helpers de privacidade ───────────────────────────────────────────────────
const COOKIE_PREFIX = "memorial_access_";

function hasCookieAccess(slug: string): boolean {
  const cookieStore = cookies();
  return cookieStore.get(`${COOKIE_PREFIX}${slug}`)?.value === "granted";
}

async function isOwner(memorialId: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return false;

  const { data: profile } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", authUser.id)
    .single();
  if (!profile) return false;

  const { data } = await supabase
    .from("memorials")
    .select("id")
    .eq("id", memorialId)
    .eq("owner_id", profile.id)
    .single();

  return !!data;
}

// ─── Metadata dinâmico ────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data: memorial } = await supabase
    .from("memorials")
    .select("name, bio, cover_photo_url, birth_date, death_date, privacy")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!memorial || memorial.privacy === "private") {
    return { title: "Memorial | Legado ID" };
  }

  const lifespan = formatLifespan(memorial.birth_date, memorial.death_date);
  const description =
    memorial.bio?.slice(0, 155) ??
    `Memorial de ${memorial.name}${lifespan ? ` (${lifespan})` : ""} no Legado ID.`;

  // Memorials com senha: não indexar com conteúdo real
  if (memorial.privacy === "password") {
    return {
      title: `Memorial protegido | Legado ID`,
      robots: { index: false },
    };
  }

  return {
    title: `${memorial.name} — Memorial | Legado ID`,
    description,
    openGraph: {
      title: `Em memória de ${memorial.name}`,
      description,
      images: memorial.cover_photo_url
        ? [{ url: memorial.cover_photo_url, width: 1200, height: 630 }]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Em memória de ${memorial.name}`,
      description,
    },
  };
}

// ─── Page (Server Component) ──────────────────────────────────────────────────
export default async function MemorialPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();
  const { slug } = params;

  // Buscar memorial
  const { data: memorial } = await supabase
    .from("memorials")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!memorial) notFound();
  if (memorial.status !== "published") notFound();

  // ── Enforcement de privacidade ────────────────────────────────────────────
  if (memorial.privacy === "private") {
    // Apenas o dono pode ver
    const owner = await isOwner(memorial.id);
    if (!owner) notFound();
  }

  if (memorial.privacy === "password") {
    // Verificar cookie de acesso; se não tiver, redirecionar para tela de senha
    if (!hasCookieAccess(slug)) {
      redirect(`/${slug}/senha`);
    }
  }

  // Registrar visualização (fire-and-forget)
  supabase.rpc("increment_memorial_views", { memorial_id: memorial.id }).then(() => {});

  // Buscar dados relacionados em paralelo
  const [candlesResult, memoriesResult, photosResult] = await Promise.all([
    supabase
      .from("candles")
      .select("id, author_name, created_at")
      .eq("memorial_id", memorial.id)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("memory_posts")
      .select("id, author_name, content, created_at, approved")
      .eq("memorial_id", memorial.id)
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("memorial_photos")
      .select("id, url, caption, display_order")
      .eq("memorial_id", memorial.id)
      .order("display_order", { ascending: true })
      .limit(40),
  ]);

  const candles = candlesResult.data ?? [];
  const memories = memoriesResult.data ?? [];
  const photos = photosResult.data ?? [];
  const m = memorial as Memorial;

  return (
    <div className="min-h-screen bg-mist">
      {/* Hero */}
      <MemorialHero memorial={m} candleCount={m.candles_count ?? candles.length} />

      {/* Corpo */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Biografia e citação */}
        {(m.bio || m.favorite_quote) && (
          <MemorialBio bio={m.bio} quote={m.favorite_quote} name={m.name} />
        )}

        {/* Traços de personalidade e hobbies */}
        {((m.personality_traits?.length ?? 0) > 0 ||
          (m.hobbies?.length ?? 0) > 0) && (
          <MemorialTraits
            traits={m.personality_traits ?? []}
            hobbies={m.hobbies ?? []}
          />
        )}

        {/* Galeria de fotos */}
        {photos.length > 0 && (
          <PhotoGallery photos={photos} memorialName={m.name} />
        )}

        {/* Seção de velas */}
        <CandleSection
          memorialId={m.id}
          memorialName={m.name}
          candles={candles}
          initialCount={m.candles_count ?? candles.length}
        />

        {/* Feed de memórias */}
        <MemoryFeed
          memorialId={m.id}
          initialMemories={memories}
          memorialName={m.name}
        />
      </div>

      {/* Footer do memorial */}
      <footer className="border-t border-stone/8 py-8 text-center space-y-2">
        {/* Indicador de privacidade para memorials com senha */}
        {m.privacy === "password" && (
          <p className="text-xs text-stone/30 flex items-center justify-center gap-1">
            🔒 Memorial protegido por senha
          </p>
        )}
        <p className="text-xs text-stone/30">
          Memorial criado com{" "}
          <a
            href="https://legadoid.com"
            className="hover:text-stone/60 transition-colors underline"
          >
            Legado ID
          </a>{" "}
          · Preservando memórias para sempre
        </p>
      </footer>
    </div>
  );
}
