"use client";

import { useEffect, useState } from "react";
import Skeleton from "@/components/skeleton";

type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "MANAGER" | "SERVER" | "KITCHEN";
  isActive: boolean;
};

type PendingInvitation = {
  id: string;
  email: string;
  role: string;
  token: string;
  expiresAt: string;
};

const ROLES = ["OWNER", "MANAGER", "SERVER", "KITCHEN"] as const;

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<(typeof ROLES)[number]>("SERVER");
  const [lastInviteUrl, setLastInviteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/staff");
    if (res.ok) {
      const body = await res.json();
      setStaff(body.staff);
      setInvitations(body.invitations);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLastInviteUrl(null);
    const res = await fetch("/api/staff/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Erreur inconnue");
      return;
    }
    setLastInviteUrl(body.inviteUrl);
    setInviteEmail("");
    load();
  }

  async function toggleActive(member: StaffMember) {
    const res = await fetch(`/api/staff/${member.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !member.isActive }),
    });
    if (res.ok) load();
  }

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-white">Équipe</h1>

      {loading && (
        <div className="card-dash-static flex flex-col gap-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}

      {!loading && (
      <section className="card-dash overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.03] text-left text-xs font-medium uppercase tracking-wide text-white/40">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {staff.map((m) => (
              <tr key={m.id} className="border-b border-white/5 transition last:border-0 hover:bg-white/[0.03]">
                <td className="px-4 py-3 font-medium text-white">{m.name}</td>
                <td className="px-4 py-3 text-white/40">{m.email}</td>
                <td className="px-4 py-3">
                  <span className="badge-pill bg-brand-light/15 text-brand-light">{m.role}</span>
                </td>
                <td className="px-4 py-3 text-white/40">{m.isActive ? "Actif" : "Désactivé"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => toggleActive(m)} className="btn-link-dash">
                    {m.isActive ? "Désactiver" : "Réactiver"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      )}

      {!loading && (
      <section>
        <h2 className="mb-3 text-base font-semibold text-white">Invitations en attente</h2>
        {invitations.length === 0 && <p className="text-sm text-white/40">Aucune invitation en attente.</p>}
        <ul className="flex flex-col gap-2 text-sm">
          {invitations.map((inv) => (
            <li key={inv.id} className="card-dash-static flex justify-between px-4 py-3">
              <span className="text-white/60">
                {inv.email} — <span className="badge-pill bg-brand-light/15 text-brand-light">{inv.role}</span>
              </span>
              <span className="text-white/40">expire le {new Date(inv.expiresAt).toLocaleDateString("it-IT")}</span>
            </li>
          ))}
        </ul>
      </section>
      )}

      <section className="card-dash">
        <h2 className="mb-4 text-base font-semibold text-white">Inviter un membre</h2>
        <form onSubmit={onInvite} className="flex max-w-md flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-white/60">Email</span>
            <input
              required
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="input-dash"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-white/60">Rôle</span>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as (typeof ROLES)[number])}
              className="input-dash"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          {error && <p className="text-sm text-signal">{error}</p>}
          {lastInviteUrl && (
            <p className="animate-bump-in break-all rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              Lien d&apos;invitation (aucun email n&apos;est envoyé pour l&apos;instant — transmettez-le
              manuellement) : {lastInviteUrl}
            </p>
          )}
          <button type="submit" className="btn-primary w-fit">
            Envoyer l&apos;invitation
          </button>
        </form>
      </section>
    </div>
  );
}
