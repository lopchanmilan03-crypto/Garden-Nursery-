import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Garden Restaurant · Ops",
    template: "%s · Garden Restaurant",
  },
  description:
    "Garden Restaurant cafe ops — Owner, Staff, Kitchen, Cashier. Sales, stock, attendance, billing. Kathmandu demo.",
  appleWebApp: {
    capable: true,
    title: "Garden Ops",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0f2e1f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--garden-deep)] font-[family-name:var(--font-body)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
