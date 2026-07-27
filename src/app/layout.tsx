import type { Metadata } from "next";
import { APP_NAME } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: `${APP_NAME} — Menu QR & commande à table`,
  description: "Menu QR digital et commande à table pour restaurants",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="antialiased">{children}</body>
    </html>
  );
}
