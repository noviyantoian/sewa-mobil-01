"use client";

import { Badge } from "@/components/ui/Badge";
import { useT } from "@/lib/i18n/I18nProvider";
import type { BookingStatus } from "@/lib/mock/bookings";

type Tone = "neutral" | "accent" | "success" | "warning" | "error";

const statusTone: Record<BookingStatus, Tone> = {
  pending: "warning",
  confirmed: "accent",
  active: "success",
  completed: "neutral",
  cancelled: "error",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  const t = useT();
  return <Badge tone={statusTone[status]}>{t(`status.${status}`)}</Badge>;
}
