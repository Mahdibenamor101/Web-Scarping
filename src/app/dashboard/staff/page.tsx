"use client";

import { useEffect, useState } from "react";

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
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="mb-4 text-lg font-semibold">Équipe</h1>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="py-2">Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {staff.map((m) => (
              <tr key={m.id} className="border-b">
                <td className="py-2">{m.name}</td>
                <td>{m.email}</td>
                <td>{m.role}</td>
                <td>{m.isActive ? "Actif" : "Désactivé"}</td>
                <td>
                  <button onClick={() => toggleActive(m)} className="text-xs text-slate-500 underline">
                    {m.isActive ? "Désactiver" : "Réactiver"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold">Invitations en attente</h2>
        {invitations.length === 0 && <p className="text-sm text-slate-500">Aucune invitation en attente.</p>}
        <ul className="flex flex-col gap-2 text-sm">
          {invitations.map((inv) => (
            <li key={inv.id} className="flex justify-between rounded-md border border-slate-200 px-3 py-2">
              <span>
                {inv.email} — {inv.role}
              </span>
              <span className="text-slate-400">
                expire le {new Date(inv.expiresAt).toLocaleDateString("it-IT")}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold">Inviter un membre</h2>
        <form onSubmit={onInvite} className="flex max-w-md flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-600">Email</span>
            <input
              required
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="input"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-600">Rôle</span>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as (typeof ROLES)[number])}
              className="input"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {lastInviteUrl && (
            <p className="break-all text-sm text-green-700">
              Lien d&apos;invitation (aucun email n&apos;est envoyé pour l&apos;instant — transmettez-le
              manuellement) : {lastInviteUrl}
            </p>
          )}
          <button
            type="submit"
            className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Envoyer l&apos;invitation
          </button>
        </form>
      </section>
    </div>
  );
}
