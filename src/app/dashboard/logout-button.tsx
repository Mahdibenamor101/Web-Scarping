"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ label = "Se déconnecter" }: { label?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
      }}
      className="text-sm font-medium text-white/40 transition hover:text-white"
    >
      {label}
    </button>
  );
}
