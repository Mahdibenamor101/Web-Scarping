import type { Metadata } from "next";
import { Manrope, Big_Shoulders_Display, JetBrains_Mono } from "next/font/google";
import { APP_NAME } from "@/lib/brand";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
// Display font for headlines only ("Comanda" direction, see CONTEXT.md) --
// condensed/industrial, evokes stamped ticket signage. Body/UI stays on Manrope.
const shoulders = Big_Shoulders_Display({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-shoulders" });
// Numbers/prices/timestamps/order details -- the "thermal printer" motif
// running through the whole system, not just decorative monospace.
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: `${APP_NAME} — Menu QR & commande à table`,
  description: "Menu QR digital et commande à table pour restaurants",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The app itself (dashboard, auth) is French; only the landing page is
  // Italian (see CONTEXT.md) -- that page sets lang="it" on its own <main>
  // to override this default for that subtree.
  return (
    <html lang="fr" className={`${manrope.variable} ${shoulders.variable} ${jetbrains.variable}`}>
      <body className="bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
