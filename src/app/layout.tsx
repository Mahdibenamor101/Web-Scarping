import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import { APP_NAME } from "@/lib/brand";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Display font for section headings only (DESIGN.md typography table) --
// body/UI text stays on Inter.
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });

export const metadata: Metadata = {
  title: `${APP_NAME} — Menu QR & commande à table`,
  description: "Menu QR digital et commande à table pour restaurants",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The app itself (dashboard, auth) is French; only the landing page is
  // Italian (see CONTEXT.md) -- that page sets lang="it" on its own <main>
  // to override this default for that subtree.
  return (
    <html lang="fr" className={`${inter.variable} ${bricolage.variable}`}>
      <body className="bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
