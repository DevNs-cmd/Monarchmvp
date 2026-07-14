import clsx from "clsx";
import { ReactNode } from "react";

type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  emptyLabel?: string;
};

export default function MonarchTable<T extends object>({
  columns,
  rows,
  emptyLabel = "No records.",
}: Props<T>) {
  return (
    <div className="overflow-x-auto border border-white/10">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-black">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={clsx(
                  "px-4 py-4 text-left text-[11px] uppercase tracking-widest4 text-grey-dim",
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-8 text-center text-[13px] italic text-grey"
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={clsx("px-4 py-4 text-[14px] text-grey-light", col.className)}
                  >
                    {col.render ? col.render(row) : (row[col.key as keyof T] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
