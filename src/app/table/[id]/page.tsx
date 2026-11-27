import { Suspense } from "react";
import { GuestTableClient } from "./guest-table-client";

export default function GuestTablePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[var(--garden-sand)] px-5 py-16 text-center text-[var(--garden-deep)]">
          Loading table menu…
        </main>
      }
    >
      <GuestTableClient params={params} />
    </Suspense>
  );
}
