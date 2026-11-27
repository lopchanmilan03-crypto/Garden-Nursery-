"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export function TableRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/order?table=${encodeURIComponent(id)}`);
  }, [id, router]);

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-[var(--garden-sand)] text-sm text-[var(--garden-ink)]/60">
      Opening order…
    </main>
  );
}
