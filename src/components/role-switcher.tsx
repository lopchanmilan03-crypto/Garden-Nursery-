"use client";

import { roles, type Role } from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";
import { cn } from "@/lib/utils";

export function RoleSwitcher({ compact = false }: { compact?: boolean }) {
  const { state, setRole } = useOps();

  return (
    <div className={cn("flex flex-wrap gap-1.5", compact && "justify-end")}>
      {roles.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => setRole(r.id as Role)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition",
            state.role === r.id
              ? "bg-[var(--garden-deep)] text-[var(--garden-mist)]"
              : "bg-white/80 text-[var(--garden-ink)]/70 ring-1 ring-[var(--garden-leaf)]/15 hover:bg-[var(--garden-fog)]/60",
          )}
          title={r.hint}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
