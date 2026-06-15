"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/format";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const shots = images.filter(Boolean);
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] bg-[var(--color-canvas-soft)]">
        <Image
          key={shots[active]}
          src={shots[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
      </div>

      {shots.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {shots.map((src, i) => {
            const isActive = i === active;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${alt} ${i + 1}`}
                aria-pressed={isActive}
                className={cn(
                  "relative aspect-[16/11] cursor-pointer overflow-hidden rounded-[10px] bg-[var(--color-canvas-soft)] transition-[box-shadow,opacity] duration-200",
                  isActive
                    ? "ring-2 ring-[var(--color-accent)] ring-offset-2"
                    : "opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 33vw, 20vw"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
