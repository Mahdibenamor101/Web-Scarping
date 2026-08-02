import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { APP_NAME } from "@/lib/brand";
import "./globals.css";

// "Liquid Glass" direction (see CONTEXT.md): the type system is a single
// stack -- -apple-system first, so Apple hardware renders real San
// Francisco -- rather than separate display/mono Google Fonts. Manrope
// stays loaded only as the cross-platform fallback (tailwind.config.ts
// puts it after -apple-system/SF Pro in every font-* family), not as a
// distinct display face anymore.
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: `${APP_NAME} — Menu QR & commande à table`,
  description: "Menu QR digital et commande à table pour restaurants",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The app itself (dashboard, auth) is French; only the landing page is
  // Italian (see CONTEXT.md) -- that page sets lang="it" on its own <main>
  // to override this default for that subtree.
  return (
    <html lang="fr" className={manrope.variable}>
      <body className="bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
