import { Suspense } from "react";
import { TableRedirect } from "./table-redirect";

export default function TablePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[100svh] items-center justify-center bg-[var(--garden-sand)] text-sm text-[var(--garden-ink)]/60">
          Opening order…
        </main>
      }
    >
      <TableRedirect params={params} />
    </Suspense>
  );
}
