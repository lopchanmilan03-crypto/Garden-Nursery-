import { Suspense } from "react";
import { OrderClient } from "./order-client";

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[100svh] items-center justify-center bg-[var(--garden-sand)] text-sm text-[var(--garden-ink)]/60">
          Loading…
        </main>
      }
    >
      <OrderClient />
    </Suspense>
  );
}
