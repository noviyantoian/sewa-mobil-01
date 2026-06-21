"use client";

import { Fragment, type ReactNode } from "react";
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
  expandedContent,
  isRowExpanded,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  actions?: (row: T) => ReactNode;
  actionsHeader?: ReactNode;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  /** Full-width sub-row rendered under a row when `isRowExpanded(row)` is true. */
  expandedContent?: (row: T) => ReactNode;
  isRowExpanded?: (row: T) => boolean;
}) {
  const totalCols = columns.length + (actions ? 1 : 0);
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
          {rows.map((row) => {
            const expanded = isRowExpanded?.(row) ?? false;
            return (
              <Fragment key={rowKey(row)}>
                <tr
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b border-[var(--color-hairline)] transition-colors duration-150",
                    expanded && "border-b-0",
                    !expanded && "last:border-0",
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
                {expanded && expandedContent && (
                  <tr className="border-b border-[var(--color-hairline)] last:border-0">
                    <td colSpan={totalCols} className="bg-[var(--color-canvas-soft)] px-4 pb-4 pt-0 align-top">
                      {expandedContent(row)}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
