import { useCallback, useEffect, useState } from "react";
import { Alert, Image, Modal, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Badge, Card, ErrorText, PrimaryButton, Screen, ScreenTitle, SecondaryButton, TextField } from "@/components/ui";
import { colors, spacing } from "@/lib/theme";
import { apiFetch, apiUpload, ApiError } from "@/lib/api";

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

const ALLERGEN_LABELS: Record<string, string> = {
  GLUTEN: "Gluten",
  CRUSTACEANS: "Crustacés",
  EGGS: "Œufs",
  FISH: "Poisson",
  PEANUTS: "Arachides",
  SOYBEANS: "Soja",
  MILK: "Lait",
  NUTS: "Fruits à coque",
  CELERY: "Céleri",
  MUSTARD: "Moutarde",
  SESAME: "Sésame",
  SULPHITES: "Sulfites",
  LUPIN: "Lupin",
  MOLLUSCS: "Mollusques",
};
const ALL_ALLERGENS = Object.keys(ALLERGEN_LABELS);

export default function MenuScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ categoryId: string; item: Item | null } | null>(null);

  const load = useCallback(async () => {
    const [{ categories }, { items }] = await Promise.all([
      apiFetch<{ categories: Category[] }>("/api/menu/categories"),
      apiFetch<{ items: Item[] }>("/api/menu/items"),
    ]);
    setCategories(categories);
    setItems(items);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function addCategory() {
    setCategoryError(null);
    try {
      await apiFetch("/api/menu/categories", { method: "POST", body: { nameIt: newCategory } });
      setNewCategory("");
      load();
    } catch (err) {
      setCategoryError(err instanceof ApiError ? err.message : "Erreur inconnue.");
    }
  }

  function confirmDeleteCategory(category: Category) {
    Alert.alert("Supprimer cette catégorie ?", "Tous les plats qu'elle contient seront supprimés avec elle.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await apiFetch(`/api/menu/categories/${category.id}`, { method: "DELETE" });
          load();
        },
      },
    ]);
  }

  function confirmDeleteItem(item: Item) {
    Alert.alert("Supprimer ce plat ?", "Cette action est définitive.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await apiFetch(`/api/menu/items/${item.id}`, { method: "DELETE" });
          load();
        },
      },
    ]);
  }

  async function toggleAvailable(item: Item) {
    await apiFetch(`/api/menu/items/${item.id}`, { method: "PATCH", body: { isAvailable: !item.isAvailable } });
    load();
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
      >
        <ScreenTitle>Menu</ScreenTitle>

        <Card style={{ gap: spacing.sm }}>
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Nouvelle catégorie</Text>
          <TextField label="Nom" placeholder="Antipasti, Primi, Dolci…" value={newCategory} onChangeText={setNewCategory} />
          {categoryError && <ErrorText>{categoryError}</ErrorText>}
          <PrimaryButton title="Ajouter" onPress={addCategory} disabled={!newCategory.trim()} />
        </Card>

        {categories.length === 0 && (
          <Text style={{ color: colors.white40, fontSize: 13 }}>Aucune catégorie pour l&apos;instant.</Text>
        )}

        {categories.map((category) => {
          const categoryItems = items.filter((i) => i.categoryId === category.id);
          return (
            <View key={category.id} style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>{category.nameIt}</Text>
                <View style={{ flexDirection: "row", gap: spacing.md }}>
                  <Pressable onPress={() => setEditing({ categoryId: category.id, item: null })}>
                    <Text style={{ color: colors.brandLight, fontSize: 12, fontWeight: "600" }}>+ Plat</Text>
                  </Pressable>
                  <Pressable onPress={() => confirmDeleteCategory(category)}>
                    <Text style={{ color: colors.dangerLight, fontSize: 12, fontWeight: "600" }}>Supprimer</Text>
                  </Pressable>
                </View>
              </View>

              {categoryItems.length === 0 && (
                <Text style={{ color: colors.white40, fontSize: 12 }}>Aucun plat dans cette catégorie.</Text>
              )}

              {categoryItems.map((item) => (
                <Card key={item.id} style={{ flexDirection: "row", gap: spacing.md, alignItems: "center" }}>
                  {item.photoUrl ? (
                    <Image source={{ uri: item.photoUrl }} style={{ width: 48, height: 48, borderRadius: 6 }} />
                  ) : null}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
                      {item.nameIt} — {item.price.toFixed(2)} €
                    </Text>
                    {item.descriptionIt ? (
                      <Text style={{ color: colors.white40, fontSize: 12 }}>{item.descriptionIt}</Text>
                    ) : null}
                    <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
                      {!item.isAvailable && <Badge variant="danger">Indisponible</Badge>}
                      {item.allergens.map((a) => (
                        <Badge key={a} variant="muted">
                          {ALLERGEN_LABELS[a] ?? a}
                        </Badge>
                      ))}
                    </View>
                    <View style={{ flexDirection: "row", gap: spacing.md, marginTop: 2 }}>
                      <Pressable onPress={() => toggleAvailable(item)}>
                        <Text style={{ color: colors.white70, fontSize: 12, fontWeight: "600" }}>
                          {item.isAvailable ? "Marquer indisponible" : "Marquer disponible"}
                        </Text>
                      </Pressable>
                      <Pressable onPress={() => setEditing({ categoryId: category.id, item })}>
                        <Text style={{ color: colors.brandLight, fontSize: 12, fontWeight: "600" }}>Modifier</Text>
                      </Pressable>
                      <Pressable onPress={() => confirmDeleteItem(item)}>
                        <Text style={{ color: colors.dangerLight, fontSize: 12, fontWeight: "600" }}>Supprimer</Text>
                      </Pressable>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          );
        })}
      </ScrollView>

      {editing && (
        <ItemModal
          categoryId={editing.categoryId}
          item={editing.item}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </Screen>
  );
}

function ItemModal({
  categoryId,
  item,
  onClose,
  onSaved,
}: {
  categoryId: string;
  item: Item | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nameIt, setNameIt] = useState(item?.nameIt ?? "");
  const [nameEn, setNameEn] = useState(item?.nameEn ?? "");
  const [descriptionIt, setDescriptionIt] = useState(item?.descriptionIt ?? "");
  const [price, setPrice] = useState(item ? String(item.price) : "");
  const [photoUrl, setPhotoUrl] = useState(item?.photoUrl ?? "");
  const [allergens, setAllergens] = useState<string[]>(item?.allergens ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleAllergen(a: string) {
    setAllergens((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  async function pickPhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.7 });
    if (result.canceled || !result.assets[0]) return;

    setUploading(true);
    try {
      const asset = result.assets[0];
      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        name: asset.fileName ?? "photo.jpg",
        type: asset.mimeType ?? "image/jpeg",
      } as unknown as Blob);
      const { url } = await apiUpload<{ url: string }>("/api/menu/photo-upload", formData);
      setPhotoUrl(url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Échec de l'envoi de la photo.");
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    setError(null);
    const priceNumber = Number(price);
    if (!nameIt.trim() || !Number.isFinite(priceNumber) || priceNumber < 0) {
      setError("Nom et prix valides requis.");
      return;
    }
    setSaving(true);
    try {
      const body = {
        categoryId,
        nameIt: nameIt.trim(),
        nameEn: nameEn.trim() || undefined,
        descriptionIt: descriptionIt.trim() || undefined,
        price: priceNumber,
        photoUrl: photoUrl.trim() || undefined,
        allergens,
      };
      if (item) {
        await apiFetch(`/api/menu/items/${item.id}`, { method: "PATCH", body });
      } else {
        await apiFetch("/api/menu/items", { method: "POST", body });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur inconnue.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" }}>
        <View
          style={{
            backgroundColor: colors.dashBg,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: spacing.lg,
            maxHeight: "88%",
          }}
        >
          <ScrollView contentContainerStyle={{ gap: spacing.md }}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>{item ? "Modifier le plat" : "Ajouter un plat"}</Text>
            <TextField label="Nom (IT)" value={nameIt} onChangeText={setNameIt} />
            <TextField label="Nom (EN)" value={nameEn} onChangeText={setNameEn} />
            <TextField label="Description" value={descriptionIt} onChangeText={setDescriptionIt} multiline />
            <TextField label="Prix (€)" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />

            <View style={{ gap: 6 }}>
              <Text style={{ color: colors.white70, fontSize: 13, fontWeight: "600" }}>Photo</Text>
              {photoUrl ? <Image source={{ uri: photoUrl }} style={{ width: 80, height: 80, borderRadius: 8 }} /> : null}
              <SecondaryButton title={uploading ? "Envoi…" : "Choisir une photo"} onPress={pickPhoto} />
            </View>

            <View style={{ gap: 6 }}>
              <Text style={{ color: colors.white70, fontSize: 13, fontWeight: "600" }}>Allergènes</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
                {ALL_ALLERGENS.map((a) => {
                  const active = allergens.includes(a);
                  return (
                    <Pressable
                      key={a}
                      onPress={() => toggleAllergen(a)}
                      style={{
                        borderRadius: 999,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        backgroundColor: active ? colors.brand : "rgba(255,255,255,0.06)",
                      }}
                    >
                      <Text style={{ color: active ? "#fff" : colors.white70, fontSize: 12, fontWeight: "600" }}>
                        {ALLERGEN_LABELS[a]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {error && <ErrorText>{error}</ErrorText>}
            <PrimaryButton title={item ? "Enregistrer" : "Ajouter le plat"} onPress={submit} loading={saving} />
            <SecondaryButton title="Annuler" onPress={onClose} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
