import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { APP_NAME } from "@/lib/brand";
import "./globals.css";

// "Oriental Luxury" direction (see CONTEXT.md, design-tokens.ts): Playfair
// Display for headings (an elegant serif, the founder's own suggested
// Latin equivalent to Amiri/Reem Kufi), Poppins for everything else
// (equivalent to Cairo/Tajawal). Both loaded as CSS variables consumed by
// tailwind.config.ts's font-display/font-sans/font-mono.
const playfair = Playfair_Display({
  subsets: ["latin"],
  // 400 added for the Logo wordmark (CONTEXT.md §12.36): a light weight
  // for its fine serifs, distinct from the bold 600-900 range used for
  // headings everywhere else.
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-playfair",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: `${APP_NAME} — Menu QR & commande à table`,
  description: "Menu QR digital et commande à table pour restaurants",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The app itself (dashboard, auth) is French; only the landing page is
  // Italian (see CONTEXT.md) -- that page sets lang="it" on its own <main>
  // to override this default for that subtree. Stays LTR throughout: the
  // oriental visual language is deliberately independent of script
  // direction here, see design-tokens.ts.
  return (
    <html lang="fr" dir="ltr" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
