import { cn } from "@/lib/utils";

/** Decorative demo QR — not a real encoded payload. */
export function DemoQr({
  seed = "garden",
  className,
  size = 120,
}: {
  seed?: string;
  className?: string;
  size?: number;
}) {
  const cells = 11;
  const bits: boolean[] = [];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = 0; i < cells * cells; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const r = Math.floor(i / cells);
    const c = i % cells;
    const finder =
      (r < 3 && c < 3) ||
      (r < 3 && c > cells - 4) ||
      (r > cells - 4 && c < 3);
    bits.push(finder || h % 3 !== 0);
  }

  return (
    <div
      className={cn(
        "grid gap-[2px] rounded-md border border-[var(--garden-leaf)]/20 bg-white p-2",
        className,
      )}
      style={{
        width: size,
        height: size,
        gridTemplateColumns: `repeat(${cells}, minmax(0, 1fr))`,
      }}
      aria-hidden
    >
      {bits.map((on, i) => (
        <span
          key={i}
          className={cn(
            "rounded-[1px]",
            on ? "bg-[var(--garden-deep)]" : "bg-transparent",
          )}
        />
      ))}
    </div>
  );
}
