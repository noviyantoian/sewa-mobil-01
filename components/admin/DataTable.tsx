"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export type Column<T> = {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  hideOnMobile?: boolean;
};

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  actions,
  actionsHeader,
  onRowClick,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  actions?: (row: T) => ReactNode;
  actionsHeader?: ReactNode;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-[var(--color-hairline)]">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "label-caps whitespace-nowrap px-4 py-3 font-semibold",
                  alignClass[c.align ?? "left"],
                  c.hideOnMobile && "hidden md:table-cell"
                )}
              >
                {c.header}
              </th>
            ))}
            {actions && (
              <th className="label-caps px-4 py-3 text-right font-semibold">{actionsHeader}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-4 py-10 text-center text-[14px] text-[var(--color-mute)]"
              >
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "border-b border-[var(--color-hairline)] transition-colors duration-150 last:border-0",
                onRowClick && "cursor-pointer hover:bg-[var(--color-canvas-soft)]"
              )}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    "px-4 py-3.5 align-middle text-[var(--color-body)]",
                    alignClass[c.align ?? "left"],
                    c.hideOnMobile && "hidden md:table-cell",
                    c.className
                  )}
                >
                  {c.render(row)}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3.5 text-right align-middle" onClick={(e) => e.stopPropagation()}>
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
