"use client";

import { useEffect, useState } from "react";
import { ALLERGEN_LABELS } from "@/lib/allergens";
import ItemForm, { type ItemFormValues } from "./item-form";

type Category = { id: string; nameIt: string; nameEn: string | null; sortOrder: number };
type Item = {
  id: string;
  categoryId: string;
  nameIt: string;
  nameEn: string | null;
  descriptionIt: string | null;
  price: number;
  photoUrl: string | null;
  isAvailable: boolean;
  allergens: string[];
};

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingItemFor, setAddingItemFor] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const [catRes, itemRes] = await Promise.all([fetch("/api/menu/categories"), fetch("/api/menu/items")]);
    if (catRes.ok) setCategories((await catRes.json()).categories);
    if (itemRes.ok) setItems((await itemRes.json()).items);
  }

  useEffect(() => {
    load();
  }, []);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/menu/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameIt: newCategoryName }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Erreur inconnue");
      return;
    }
    setNewCategoryName("");
    load();
  }

  async function deleteCategory(id: string) {
    if (!confirm("Supprimer cette catégorie et tous ses plats ?")) return;
    const res = await fetch(`/api/menu/categories/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  async function createItem(categoryId: string, values: ItemFormValues) {
    const res = await fetch("/api/menu/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(categoryId, values)),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Erreur inconnue");
    }
    setAddingItemFor(null);
    load();
  }

  async function updateItem(itemId: string, categoryId: string, values: ItemFormValues) {
    const res = await fetch(`/api/menu/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(categoryId, values)),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Erreur inconnue");
    }
    setEditingItem(null);
    load();
  }

  async function toggleAvailable(item: Item) {
    const res = await fetch(`/api/menu/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !item.isAvailable }),
    });
    if (res.ok) load();
  }

  async function deleteItem(id: string) {
    if (!confirm("Supprimer ce plat ?")) return;
    const res = await fetch(`/api/menu/items/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-lg font-semibold">Menu</h1>

      <section>
        <h2 className="mb-3 text-base font-semibold">Nouvelle catégorie</h2>
        <form onSubmit={addCategory} className="flex max-w-md gap-2">
          <input
            required
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Antipasti, Primi, Dolci…"
            className="input flex-1"
          />
          <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Ajouter
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </section>

      {categories.length === 0 && (
        <p className="text-sm text-slate-500">Aucune catégorie pour l&apos;instant — commencez par en créer une.</p>
      )}

      {categories.map((category) => {
        const categoryItems = items.filter((i) => i.categoryId === category.id);
        return (
          <section key={category.id} className="rounded-md border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">
                {category.nameIt} {category.nameEn && <span className="text-slate-400">({category.nameEn})</span>}
              </h2>
              <div className="flex gap-3 text-xs">
                <button
                  onClick={() => setAddingItemFor(addingItemFor === category.id ? null : category.id)}
                  className="text-slate-600 underline"
                >
                  + Ajouter un plat
                </button>
                <button onClick={() => deleteCategory(category.id)} className="text-red-600 underline">
                  Supprimer la catégorie
                </button>
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {categoryItems.map((item) =>
                editingItem === item.id ? (
                  <li key={item.id}>
                    <ItemForm
                      submitLabel="Enregistrer"
                      initial={{
                        nameIt: item.nameIt,
                        nameEn: item.nameEn ?? "",
                        descriptionIt: item.descriptionIt ?? "",
                        price: String(item.price),
                        photoUrl: item.photoUrl ?? "",
                        allergens: item.allergens,
                      }}
                      onSubmit={(values) => updateItem(item.id, category.id, values)}
                      onCancel={() => setEditingItem(null)}
                    />
                  </li>
                ) : (
                  <li key={item.id} className="flex items-start justify-between rounded-md border border-slate-100 px-3 py-2 text-sm">
                    <div>
                      <p className="font-medium">
                        {item.nameIt} — {item.price.toFixed(2)} €{" "}
                        {!item.isAvailable && <span className="text-red-600">(indisponible)</span>}
                      </p>
                      {item.descriptionIt && <p className="text-slate-500">{item.descriptionIt}</p>}
                      {item.allergens.length > 0 && (
                        <p className="mt-1 text-xs text-slate-400">
                          Allergènes : {item.allergens.map((a) => ALLERGEN_LABELS[a as keyof typeof ALLERGEN_LABELS]).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-3 text-xs">
                      <button onClick={() => toggleAvailable(item)} className="text-slate-600 underline">
                        {item.isAvailable ? "Marquer indisponible" : "Marquer disponible"}
                      </button>
                      <button onClick={() => setEditingItem(item.id)} className="text-slate-600 underline">
                        Modifier
                      </button>
                      <button onClick={() => deleteItem(item.id)} className="text-red-600 underline">
                        Supprimer
                      </button>
                    </div>
                  </li>
                ),
              )}
              {categoryItems.length === 0 && addingItemFor !== category.id && (
                <p className="text-sm text-slate-400">Aucun plat dans cette catégorie.</p>
              )}
            </ul>

            {addingItemFor === category.id && (
              <div className="mt-3">
                <ItemForm
                  submitLabel="Ajouter le plat"
                  onSubmit={(values) => createItem(category.id, values)}
                  onCancel={() => setAddingItemFor(null)}
                />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function toPayload(categoryId: string, values: ItemFormValues) {
  return {
    categoryId,
    nameIt: values.nameIt,
    nameEn: values.nameEn || undefined,
    descriptionIt: values.descriptionIt || undefined,
    price: Number(values.price),
    photoUrl: values.photoUrl || undefined,
    allergens: values.allergens,
  };
}
