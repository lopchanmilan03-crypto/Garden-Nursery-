"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useOps } from "@/lib/ops-store";
import { menuCategories, type MenuCategory } from "@/lib/demo-data";
import { cn, formatNpr } from "@/lib/utils";
import { Reveal } from "@/components/marketing/reveal";

export function MenuBrowser({
  limit,
  showFilters = true,
}: {
  limit?: number;
  showFilters?: boolean;
}) {
  const { state, ready } = useOps();
  const [cat, setCat] = useState<MenuCategory | "all">("all");

  const items = useMemo(() => {
    const list =
      cat === "all"
        ? state.menuItems
        : state.menuItems.filter((m) => m.category === cat);
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }, [state.menuItems, cat, limit]);

  if (!ready) {
    return (
      <p className="text-sm text-[var(--garden-ink)]/60">Loading menu…</p>
    );
  }

  return (
    <div>
      {showFilters ? (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCat("all")}
            className={cn(
              "rounded-md px-3.5 py-2 text-sm transition",
              cat === "all"
                ? "bg-[var(--garden-deep)] text-white"
                : "bg-white text-[var(--garden-deep)] ring-1 ring-[var(--garden-leaf)]/15",
            )}
          >
            All
          </button>
          {menuCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              className={cn(
                "rounded-md px-3.5 py-2 text-sm transition",
                cat === c.id
                  ? "bg-[var(--garden-deep)] text-white"
                  : "bg-white text-[var(--garden-deep)] ring-1 ring-[var(--garden-leaf)]/15",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 50}>
            <article className="group overflow-hidden rounded-2xl bg-white ring-1 ring-[var(--garden-leaf)]/10 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-28px_rgba(15,46,31,0.45)]">
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--garden-fog)]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-[var(--garden-leaf)]">
                    No image
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
                    {item.name}
                  </h3>
                  <p className="shrink-0 text-sm font-semibold text-[var(--garden-leaf)]">
                    {formatNpr(item.price)}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--garden-ink)]/70">
                  {item.description}
                </p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[var(--garden-moss)]">
                  {item.category}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
