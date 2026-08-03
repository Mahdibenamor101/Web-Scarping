"use client";

import { useEffect, useState } from "react";
import Skeleton from "@/components/skeleton";
import HelpTip from "@/components/help-tip";

type Branding = { logoUrl: string | null; backgroundUrl: string | null };

export default function BrandingPage() {
  const [branding, setBranding] = useState<Branding | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<"logo" | "background" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/branding");
    if (res.ok) setBranding(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function upload(kind: "logo" | "background", file: File) {
    setUploading(kind);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/branding/upload", { method: "POST", body: formData });
      const uploadBody = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok) {
        throw new Error(
          uploadRes.status === 501
            ? "Upload non configuré sur cet environnement."
            : (uploadBody.error ?? "Échec de l'envoi"),
        );
      }
      const field = kind === "logo" ? "logoUrl" : "backgroundUrl";
      const patchRes = await fetch("/api/branding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: uploadBody.url }),
      });
      if (!patchRes.ok) throw new Error("Échec de l'enregistrement");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setUploading(null);
    }
  }

  async function clear(kind: "logo" | "background") {
    const field = kind === "logo" ? "logoUrl" : "backgroundUrl";
    const res = await fetch("/api/branding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: null }),
    });
    if (res.ok) load();
  }

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Marque</h1>
          <HelpTip>
            Formats acceptés : JPG, PNG, WebP. Un logo carré (ex. 512×512) et une image de fond au format
            portrait rendent le mieux sur le téléphone du client. Laissez un champ vide pour revenir à
            l&apos;habillage Tavolino par défaut.
          </HelpTip>
        </div>
        <p className="mt-1 text-sm text-white/50">
          Logo et image de fond affichés sur le menu public de vos clients (<code className="font-mono">/menu/...</code>).
          Le tableau de bord reste toujours Tavolino — cette personnalisation ne concerne que ce que vos clients voient
          après avoir scanné le QR.
        </p>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          <BrandingSlot
            title="Logo"
            body="Remplace le logo Tavolino en haut du menu du client."
            imageUrl={branding?.logoUrl ?? null}
            uploading={uploading === "logo"}
            onUpload={(file) => upload("logo", file)}
            onClear={() => clear("logo")}
          />
          <BrandingSlot
            title="Image de fond"
            body="Une photo du local, des plats, ou une couleur — visible derrière le menu."
            imageUrl={branding?.backgroundUrl ?? null}
            uploading={uploading === "background"}
            onUpload={(file) => upload("background", file)}
            onClear={() => clear("background")}
          />
        </div>
      )}

      {error && <p className="text-sm text-danger-light">{error}</p>}
    </div>
  );
}

function BrandingSlot({
  title,
  body,
  imageUrl,
  uploading,
  onUpload,
  onClear,
}: {
  title: string;
  body: string;
  imageUrl: string | null;
  uploading: boolean;
  onUpload: (file: File) => void;
  onClear: () => void;
}) {
  return (
    <div className="card-dash flex flex-col gap-3">
      <div>
        <h2 className="font-display text-lg font-extrabold text-white">{title}</h2>
        <p className="mt-0.5 text-xs text-white/50">{body}</p>
      </div>
      <div className="flex h-32 items-center justify-center overflow-hidden rounded-card border border-dashed border-white/15 bg-white/[0.03]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded/external URL
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="font-mono text-xs text-white/30">Nessuna immagine</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <label className="btn-link-dash cursor-pointer text-xs">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) onUpload(file);
            }}
          />
          {uploading ? "Envoi…" : imageUrl ? "Remplacer" : "Importer"}
        </label>
        {imageUrl && (
          <button onClick={onClear} className="btn-link-dash-danger text-xs">
            Retirer
          </button>
        )}
      </div>
    </div>
  );
}
