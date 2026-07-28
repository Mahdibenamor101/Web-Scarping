"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active ? "bg-brand-gradient text-white shadow-soft" : "text-white/60 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
