"use client";

import { OpsProvider } from "@/lib/ops-store";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <OpsProvider>{children}</OpsProvider>;
}
