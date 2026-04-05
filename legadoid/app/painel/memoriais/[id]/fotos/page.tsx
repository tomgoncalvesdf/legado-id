"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Trash2, Loader2, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { PhotoUploader } from "@/components/painel/PhotoUploader";
import {
  setCoverPhotoAction,
  deletePhotoAction,
} from "./actions";
import { toast } from "sonner";

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  display_order: number;
  storage_path: string | null;
}

interface PageProps {
  params: { id: string };
}

export default function FotosPage({ params }: PageProps) {
  const memorialId = params.id;
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Buscar fotos ──────────────────────────────────────────────────────────
  async function loadPhotos() {
    const supabase = createClient();

    const [photosResult, memorialResult] = await Promise.all([
      supabase
        .from("memorial_photos")
        .select("id, url, caption, display_order, storage_path")
        .eq("memorial_id", memorialId)
        .order("display_order", { ascending: true }),
      supabase
        .from("memorials")
        .select("cover_photo_url")
        .eq("id", memorialId)
        .single(),
    ]);

    setPhotos((photosResult.data ?? []) as Photo[]);
    setCoverUrl(memorialResult.data?.cover_photo_url ?? null);
    setLoading(false);
  }

  useEffect(() => {
    loadPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Definir capa ──────────────────────────────────────────────────────────
  async function handleSetCover(photoUrl: string) {
    startTransition(async () => {
      const result = await setCoverPhotoAction(memorialId, photoUrl);
      if (result.error) {
        toast.error(result.error);
      } else {
        setCoverUrl(photoUrl);
        toast.success("Foto de capa atualizada!");
      }
    });
  }

  // ── Excluir foto ──────────────────────────────────────────────────────────
  async function handleDelete(photoId: string) {
    if (!confirm("Tem certeza que deseja remover esta foto?")) return;
    setDeletingId(photoId);

    startTransition(async () => {
      const result = await deletePhotoAction(memorialId, photoId);
      if (result.error) {
        toast.error(result.error);
      } else {
        setPhotos((prev) => prev.filter((p) => p.id !== photoId));
        toast.success("Foto removida.");
      }
      setDeletingId(null);
    });
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <Link
          href={`/painel/memoriais/${memorialId}`}
          className="inline-flex items-center gap-1.5 text-sm text-stone/50 hover:text-stone transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Voltar ao memorial
        </Link>
        <h1 className="font-display text-3xl font-semibold text-stone">
          Galeria de fotos
        </h1>
        <p className="text-sm text-stone/50 mt-1">
          {photos.length} foto{photos.length !== 1 ? "s" : ""} · A foto marcada
          com ★ é a capa do memorial.
        </p>
      </div>

      {/* Uploader */}
      <div className="card-base p-6">
        <h2 className="font-semibold text-stone text-sm mb-4">
          Adicionar fotos
        </h2>
        <PhotoUploader
          memorialId={memorialId}
          onUploaded={loadPhotos}
          maxFiles={10}
        />
      </div>

      {/* Grid de fotos */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton aspect-square rounded-xl" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-stone/8 flex items-center justify-center mx-auto">
            <ImageIcon size={24} className="text-stone/25" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-stone/40">
            Nenhuma foto ainda. Adicione acima!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo) => {
            const isCover = photo.url === coverUrl;
            const isDeleting = deletingId === photo.id;

            return (
              <div
                key={photo.id}
                className={cn(
                  "group relative aspect-square rounded-xl overflow-hidden bg-stone/8 border-2 transition-all duration-150",
                  isCover
                    ? "border-amber-medium shadow-amber"
                    : "border-transparent hover:border-stone/20"
                )}
              >
                {/* Imagem */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption ?? "Foto do memorial"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay de ações */}
                <div
                  className={cn(
                    "absolute inset-0 bg-stone/50 backdrop-blur-[1px] flex items-center justify-center gap-2 transition-opacity duration-200",
                    isDeleting ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                >
                  {isDeleting ? (
                    <Loader2 size={22} className="animate-spin text-white" />
                  ) : (
                    <>
                      {/* Definir capa */}
                      <button
                        onClick={() => handleSetCover(photo.url)}
                        disabled={isPending || isCover}
                        title={isCover ? "Foto de capa atual" : "Usar como capa"}
                        className={cn(
                          "p-2.5 rounded-xl transition-colors",
                          isCover
                            ? "bg-amber-medium text-white cursor-default"
                            : "bg-white/90 text-stone hover:bg-amber-soft hover:text-amber-deep"
                        )}
                      >
                        <Star
                          size={16}
                          strokeWidth={isCover ? 0 : 1.5}
                          fill={isCover ? "currentColor" : "none"}
                        />
                      </button>

                      {/* Excluir */}
                      <button
                        onClick={() => handleDelete(photo.id)}
                        disabled={isPending}
                        title="Remover foto"
                        className="p-2.5 rounded-xl bg-white/90 text-stone hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </>
                  )}
                </div>

                {/* Badge de capa */}
                {isCover && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-medium text-white text-[10px] font-semibold flex items-center gap-1">
                    <Star size={9} fill="currentColor" strokeWidth={0} />
                    Capa
                  </div>
                )}

                {/* Legenda */}
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 px-2.5 py-1.5 bg-gradient-to-t from-stone/80 to-transparent">
                    <p className="text-white text-[11px] leading-snug line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
