"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Photo {
  id: string;
  url: string;
  caption: string | null;
}

interface PhotoGalleryProps {
  photos: Photo[];
  memorialName: string;
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[currentIndex];

  // Fechar com Escape
  if (typeof window !== "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Fechar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Fechar"
      >
        <X size={20} />
      </button>

      {/* Contador */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Foto anterior"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Imagem */}
      <div
        className="max-w-4xl max-h-[80vh] mx-16 flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt={photo.caption ?? "Foto do memorial"}
          className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
        />
        {photo.caption && (
          <p className="text-white/70 text-sm text-center px-4">{photo.caption}</p>
        )}
      </div>

      {/* Next */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Próxima foto"
        >
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  );
}

// ─── Galeria principal ────────────────────────────────────────────────────────
export function PhotoGallery({ photos, memorialName }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  function openLightbox(index: number) {
    setLightboxIndex(index);
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  function prevPhoto() {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + photos.length) % photos.length
    );
  }

  function nextPhoto() {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % photos.length
    );
  }

  // Layout especial para poucas fotos
  const isSmall = photos.length <= 3;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <ImageIcon size={20} className="text-amber-medium" strokeWidth={1.5} />
        <h2 className="font-display text-xl font-semibold text-stone">
          Galeria de fotos
        </h2>
        <span className="text-sm text-stone/40">({photos.length})</span>
      </div>

      {/* Grid responsivo */}
      <div
        className={cn(
          "grid gap-2 sm:gap-3",
          isSmall
            ? "grid-cols-1 sm:grid-cols-3"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        )}
      >
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => openLightbox(index)}
            className={cn(
              "group relative overflow-hidden rounded-xl bg-stone/8 cursor-pointer",
              // Primeira foto maior quando há muitas
              index === 0 && photos.length >= 4
                ? "col-span-2 row-span-2 aspect-square"
                : "aspect-square"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.caption ?? `Foto ${index + 1} de ${memorialName}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Overlay hover */}
            <div className="absolute inset-0 bg-stone/0 group-hover:bg-stone/20 transition-colors duration-200" />

            {/* Legenda no hover */}
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-stone/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-white text-xs line-clamp-2">{photo.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </section>
  );
}
