"use client";

import { useEffect, useState } from "react";
import { ALLERGEN_LABELS } from "@/lib/allergens";
import ItemForm, { type ItemFormValues } from "./item-form";
import ConfirmDialog from "@/components/confirm-dialog";
import Skeleton from "@/components/skeleton";
import HelpTip from "@/components/help-tip";
import TranslationsPanel from "./translations-panel";
import { useLocale } from "@/lib/i18n/use-locale";
import { isRtl } from "@/lib/i18n/languages";
import { MENU_DICT } from "@/lib/i18n/dictionaries/menu";

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
  const locale = useLocale("fr");
  const t = MENU_DICT[locale];
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingItemFor, setAddingItemFor] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState<string | null>(null);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<string | null>(null);

  async function load() {
    const [catRes, itemRes] = await Promise.all([fetch("/api/menu/categories"), fetch("/api/menu/items")]);
    if (catRes.ok) setCategories((await catRes.json()).categories);
    if (itemRes.ok) setItems((await itemRes.json()).items);
    setLoading(false);
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
      setError(body.error ?? t.genericError);
      return;
    }
    setNewCategoryName("");
    load();
  }

  async function deleteCategory(id: string) {
    const res = await fetch(`/api/menu/categories/${id}`, { method: "DELETE" });
    setConfirmDeleteCategory(null);
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
      throw new Error(body.error ?? t.genericError);
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
      throw new Error(body.error ?? t.genericError);
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
    const res = await fetch(`/api/menu/items/${id}`, { method: "DELETE" });
    setConfirmDeleteItem(null);
    if (res.ok) load();
  }

  return (
    <div dir={isRtl(locale) ? "rtl" : "ltr"} className="flex max-w-3xl flex-col gap-8">
      <div className="flex items-center gap-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">{t.title}</h1>
        <HelpTip>
          {t.help.before}
          <strong className="text-white">{t.help.bold}</strong>
          {t.help.after}
        </HelpTip>
      </div>

      <TranslationsPanel locale={locale} />

      <section className="card-dash">
        <h2 className="mb-3 text-base font-semibold text-white">{t.newCategory.heading}</h2>
        <form onSubmit={addCategory} className="flex max-w-md gap-2">
          <input
            required
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder={t.newCategory.placeholder}
            className="input-dash flex-1"
          />
          <button type="submit" className="btn-primary shrink-0">
            {t.newCategory.add}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      </section>

      {loading &&
        Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card-dash-static flex flex-col gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ))}

      {!loading && categories.length === 0 && (
        <p className="text-sm text-white/40">{t.noCategoriesYet}</p>
      )}

      {!loading && categories.map((category) => {
        const categoryItems = items.filter((i) => i.categoryId === category.id);
        return (
          <section key={category.id} className="card-dash animate-bump-in">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                {category.nameIt} {category.nameEn && <span className="text-white/40">({category.nameEn})</span>}
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setAddingItemFor(addingItemFor === category.id ? null : category.id)}
                  className="btn-link-dash"
                >
                  {t.addItem}
                </button>
                <button onClick={() => setConfirmDeleteCategory(category.id)} className="btn-link-dash-danger">
                  {t.deleteCategory}
                </button>
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {categoryItems.map((item) =>
                editingItem === item.id ? (
                  <li key={item.id}>
                    <ItemForm
                      locale={locale}
                      submitLabel={t.form.save}
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
                  <li
                    key={item.id}
                    className="flex animate-bump-in items-start justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm transition hover:border-white/10 hover:bg-white/[0.06]"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {item.nameIt} <span className="text-white/40">—</span> {item.price.toFixed(2)} €{" "}
                        {!item.isAvailable && <span className="badge-pill bg-danger/10 text-danger">{t.unavailableBadge}</span>}
                      </p>
                      {item.descriptionIt && <p className="text-white/40">{item.descriptionIt}</p>}
                      {item.allergens.length > 0 && (
                        <p className="mt-1 text-xs text-white/40">
                          {t.allergensPrefix}
                          {item.allergens.map((a) => ALLERGEN_LABELS[a as keyof typeof ALLERGEN_LABELS]).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-3">
                      <button onClick={() => toggleAvailable(item)} className="btn-link-dash">
                        {item.isAvailable ? t.markUnavailable : t.markAvailable}
                      </button>
                      <button onClick={() => setEditingItem(item.id)} className="btn-link-dash">
                        {t.edit}
                      </button>
                      <button onClick={() => setConfirmDeleteItem(item.id)} className="btn-link-dash-danger">
                        {t.delete}
                      </button>
                    </div>
                  </li>
                ),
              )}
              {categoryItems.length === 0 && addingItemFor !== category.id && (
                <p className="text-sm text-white/40">{t.noItemsInCategory}</p>
              )}
            </ul>

            {addingItemFor === category.id && (
              <div className="mt-3">
                <ItemForm
                  locale={locale}
                  submitLabel={t.form.addDish}
                  onSubmit={(values) => createItem(category.id, values)}
                  onCancel={() => setAddingItemFor(null)}
                />
              </div>
            )}
          </section>
        );
      })}

      <ConfirmDialog
        open={confirmDeleteCategory !== null}
        title={t.confirmDeleteCategory.title}
        body={t.confirmDeleteCategory.body}
        confirmLabel={t.confirmDeleteCategory.confirm}
        danger
        onConfirm={() => confirmDeleteCategory && deleteCategory(confirmDeleteCategory)}
        onCancel={() => setConfirmDeleteCategory(null)}
      />
      <ConfirmDialog
        open={confirmDeleteItem !== null}
        title={t.confirmDeleteItem.title}
        body={t.confirmDeleteItem.body}
        confirmLabel={t.confirmDeleteItem.confirm}
        danger
        onConfirm={() => confirmDeleteItem && deleteItem(confirmDeleteItem)}
        onCancel={() => setConfirmDeleteItem(null)}
      />
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
