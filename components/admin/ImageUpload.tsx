"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadSimple, X, CircleNotch } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";

export function ImageUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void;
}) {
  const t = useT();
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const upload = async (file: File | null | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = (await res.json().catch(() => ({}))) as { url?: string };
      if (!res.ok || !json.url) {
        setError(t("admin.imgError"));
        setUploading(false);
        return;
      }
      onChange(json.url);
    } catch {
      setError(t("admin.imgError"));
    }
    setUploading(false);
  };

  if (value) {
    return (
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[10px] border border-[var(--color-hairline)] bg-[var(--color-canvas-soft)]">
        <Image src={value} alt="" fill sizes="320px" className="object-cover" />
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={t("admin.imgRemove")}
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(8,8,8,0.6)] text-white hover:bg-[rgba(8,8,8,0.8)]"
        >
          <X size={16} weight="bold" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          upload(e.dataTransfer.files?.[0]);
        }}
        className={`flex aspect-[16/11] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed px-4 text-center transition-colors ${
          drag
            ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
            : "border-[var(--color-hairline-strong)] bg-[var(--color-canvas-soft)] hover:border-[var(--color-ink)]"
        }`}
      >
        {uploading ? (
          <>
            <CircleNotch size={22} className="animate-spin text-[var(--color-mute)]" />
            <span className="text-[13px] text-[var(--color-mute)]">{t("admin.imgUploading")}</span>
          </>
        ) : (
          <>
            <UploadSimple size={22} className="text-[var(--color-mute)]" />
            <span className="text-[13px] text-[var(--color-body-mid)]">{t("admin.imgDrop")}</span>
          </>
        )}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={(e) => upload(e.target.files?.[0])}
      />
      {error && (
        <p className="mt-2 text-[12px] font-semibold text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}
