import Link from "next/link";
import { APP_NAME } from "@/lib/brand";

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
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6 py-12">
      <Link href="/" className="text-lg font-bold tracking-tight text-navy">
        {APP_NAME}
      </Link>
      <div className="w-full max-w-sm">
        <div className="card px-6 py-8 shadow-md shadow-slate-200/80">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
