import Link from "next/link";
import Logo from "@/components/logo";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-dot-grid px-6 py-12">
      <Link href="/">
        <Logo wordmarkClassName="font-display text-xl font-extrabold tracking-tight text-ink" />
      </Link>
      <div className="w-full max-w-sm animate-bump-in">
        <div className="card-static px-6 py-8">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
