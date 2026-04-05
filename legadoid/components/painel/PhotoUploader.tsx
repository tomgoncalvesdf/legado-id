"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, ImageIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadPhotoAction } from "@/app/painel/memoriais/[id]/fotos/actions";

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  caption: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

interface PhotoUploaderProps {
  memorialId: string;
  onUploaded?: () => void;
  maxFiles?: number;
}

export function PhotoUploader({
  memorialId,
  onUploaded,
  maxFiles = 10,
}: PhotoUploaderProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Adicionar arquivos ───────────────────────────────────────────────────
  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const arr = Array.from(newFiles).slice(0, maxFiles - files.length);
      const mapped: UploadFile[] = arr.map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        preview: URL.createObjectURL(f),
        caption: "",
        status: "pending",
      }));
      setFiles((prev) => [...prev, ...mapped]);
    },
    [files.length, maxFiles]
  );

  // ── Drag & drop ──────────────────────────────────────────────────────────
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(e.dataTransfer.files);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  // ── Remover do preview ───────────────────────────────────────────────────
  function removeFile(id: string) {
    setFiles((prev) => {
      const f = prev.find((f) => f.id === id);
      if (f) URL.revokeObjectURL(f.preview);
      return prev.filter((f) => f.id !== id);
    });
  }

  // ── Upload individual ────────────────────────────────────────────────────
  async function uploadFile(item: UploadFile) {
    setFiles((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, status: "uploading" } : f))
    );

    const formData = new FormData();
    formData.append("file", item.file);
    if (item.caption.trim()) formData.append("caption", item.caption.trim());

    const result = await uploadPhotoAction(memorialId, formData);

    setFiles((prev) =>
      prev.map((f) =>
        f.id === item.id
          ? {
              ...f,
              status: result.error ? "error" : "done",
              error: result.error,
            }
          : f
      )
    );

    if (!result.error) {
      onUploaded?.();
    }
  }

  // ── Upload em lote ───────────────────────────────────────────────────────
  async function uploadAll() {
    const pending = files.filter((f) => f.status === "pending");
    for (const item of pending) {
      await uploadFile(item);
    }
  }

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const uploadingCount = files.filter((f) => f.status === "uploading").length;
  const isUploading = uploadingCount > 0;

  return (
    <div className="space-y-4">
      {/* Área de drop */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200",
          isDragOver
            ? "border-amber-medium bg-amber-soft/40 scale-[1.01]"
            : "border-stone/15 bg-stone/3 hover:border-amber-medium/50 hover:bg-amber-soft/20"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />

        <div className="w-12 h-12 rounded-xl bg-amber-soft flex items-center justify-center">
          <Upload size={22} className="text-amber-medium" strokeWidth={1.5} />
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-stone">
            Arraste fotos aqui ou{" "}
            <span className="text-amber-medium">clique para selecionar</span>
          </p>
          <p className="text-xs text-stone/40">
            JPG, PNG, WebP ou GIF · Máx. 8MB por foto
          </p>
        </div>
      </div>

      {/* Preview das fotos selecionadas */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-stone/10 bg-white"
            >
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-stone/8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info + caption */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <p className="text-xs text-stone/50 truncate">{item.file.name}</p>
                {item.status === "pending" && (
                  <input
                    type="text"
                    value={item.caption}
                    onChange={(e) =>
                      setFiles((prev) =>
                        prev.map((f) =>
                          f.id === item.id
                            ? { ...f, caption: e.target.value }
                            : f
                        )
                      )
                    }
                    placeholder="Legenda (opcional)"
                    maxLength={150}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone/15 focus:outline-none focus:ring-1 focus:ring-amber-medium/40 focus:border-amber-medium/60 text-stone placeholder:text-stone/30"
                  />
                )}
                {item.status === "error" && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={11} />
                    {item.error}
                  </p>
                )}
              </div>

              {/* Status / remover */}
              <div className="flex-shrink-0">
                {item.status === "pending" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(item.id);
                    }}
                    className="p-1.5 rounded-lg text-stone/30 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Remover"
                  >
                    <X size={15} />
                  </button>
                )}
                {item.status === "uploading" && (
                  <Loader2 size={18} className="animate-spin text-amber-medium" />
                )}
                {item.status === "done" && (
                  <CheckCircle2 size={18} className="text-green-500" />
                )}
                {item.status === "error" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFiles((prev) =>
                        prev.map((f) =>
                          f.id === item.id ? { ...f, status: "pending", error: undefined } : f
                        )
                      );
                    }}
                    className="text-xs text-amber-medium hover:underline"
                  >
                    Tentar novamente
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Botão enviar */}
          {pendingCount > 0 && (
            <button
              onClick={uploadAll}
              disabled={isUploading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isUploading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Enviando…
                </>
              ) : (
                <>
                  <ImageIcon size={15} strokeWidth={1.5} />
                  Enviar {pendingCount} {pendingCount === 1 ? "foto" : "fotos"}
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
