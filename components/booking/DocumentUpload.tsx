"use client";

import { useRef, useState, type DragEvent } from "react";
import { UploadSimple, CheckCircle, FileArrowUp } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/format";

export function DocumentUpload({
  label,
  onChange,
}: {
  label: string;
  onChange?: (fileName: string | null) => void;
}) {
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const accept = (name: string | null) => {
    setFileName(name);
    onChange?.(name);
  };

  const onDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) accept(file.name);
  };

  return (
    <div className="flex flex-col">
      <span className="label-caps mb-2 flex items-center justify-between">
        {label}
        {fileName && (
          <Badge tone="success">
            <CheckCircle size={13} weight="fill" />
            {t("checkout.uploaded")}
          </Badge>
        )}
      </span>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "group flex w-full cursor-pointer items-center gap-3 rounded-[12px] border border-dashed px-4 py-4 text-left transition-colors",
          dragging
            ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
            : fileName
              ? "border-[var(--color-success)] bg-[var(--color-success-soft)]"
              : "border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] hover:border-[var(--color-ink)]"
        )}
      >
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]",
            fileName
              ? "bg-[var(--color-success)] text-white"
              : "bg-[var(--color-canvas-soft)] text-[var(--color-ink)]"
          )}
        >
          {fileName ? <FileArrowUp size={20} weight="fill" /> : <UploadSimple size={20} weight="bold" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-semibold text-[var(--color-ink)]">
            {fileName ?? t("checkout.uploadCta")}
          </span>
          <span className="block text-[12px] text-[var(--color-mute)]">{t("checkout.uploadHint")}</span>
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        onChange={(e) => accept(e.target.files?.[0]?.name ?? null)}
      />
    </div>
  );
}
