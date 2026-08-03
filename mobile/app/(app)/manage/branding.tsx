import { useCallback, useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Card, ErrorText, Screen, ScreenTitle, SecondaryButton } from "@/components/ui";
import { colors, spacing } from "@/lib/theme";
import { apiFetch, apiUpload, ApiError } from "@/lib/api";

type Branding = { logoUrl: string | null; backgroundUrl: string | null };
type Slot = "logo" | "background";

export default function BrandingScreen() {
  const [branding, setBranding] = useState<Branding | null>(null);
  const [uploading, setUploading] = useState<Slot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setBranding(await apiFetch<Branding>("/api/branding"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function pick(slot: Slot) {
    setError(null);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (result.canceled || !result.assets[0]) return;

    setUploading(slot);
    try {
      const asset = result.assets[0];
      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        name: asset.fileName ?? "photo.jpg",
        type: asset.mimeType ?? "image/jpeg",
      } as unknown as Blob);
      const { url } = await apiUpload<{ url: string }>("/api/branding/upload", formData);
      const field = slot === "logo" ? "logoUrl" : "backgroundUrl";
      await apiFetch("/api/branding", { method: "PATCH", body: { [field]: url } });
      await load();
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 501
          ? "Upload non configuré sur cet environnement."
          : err instanceof ApiError
            ? err.message
            : "Échec de l'envoi.",
      );
    } finally {
      setUploading(null);
    }
  }

  async function clear(slot: Slot) {
    const field = slot === "logo" ? "logoUrl" : "backgroundUrl";
    await apiFetch("/api/branding", { method: "PATCH", body: { [field]: null } });
    load();
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
      >
        <View>
          <ScreenTitle>Marque</ScreenTitle>
          <Text style={{ color: colors.white40, fontSize: 12, marginTop: 4 }}>
            Logo et image de fond affichés sur le menu public de vos clients. Le tableau de bord reste toujours
            Tavolino.
          </Text>
        </View>

        <BrandingSlot
          title="Logo"
          body="Remplace le logo Tavolino en haut du menu du client."
          imageUrl={branding?.logoUrl ?? null}
          uploading={uploading === "logo"}
          onUpload={() => pick("logo")}
          onClear={() => clear("logo")}
        />
        <BrandingSlot
          title="Image de fond"
          body="Une photo du local, des plats, ou une couleur — visible derrière le menu."
          imageUrl={branding?.backgroundUrl ?? null}
          uploading={uploading === "background"}
          onUpload={() => pick("background")}
          onClear={() => clear("background")}
        />

        {error && <ErrorText>{error}</ErrorText>}
      </ScrollView>
    </Screen>
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
  onUpload: () => void;
  onClear: () => void;
}) {
  return (
    <Card style={{ gap: spacing.sm }}>
      <View>
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>{title}</Text>
        <Text style={{ color: colors.white40, fontSize: 12, marginTop: 2 }}>{body}</Text>
      </View>
      <View
        style={{
          height: 120,
          borderRadius: 6,
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: colors.white15,
          backgroundColor: "rgba(255,255,255,0.03)",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        ) : (
          <Text style={{ color: colors.white40, fontSize: 11 }}>Aucune image</Text>
        )}
      </View>
      <View style={{ flexDirection: "row", gap: spacing.lg }}>
        <SecondaryButton title={uploading ? "Envoi…" : imageUrl ? "Remplacer" : "Importer"} onPress={onUpload} />
        {imageUrl && <SecondaryButton title="Retirer" onPress={onClear} danger />}
      </View>
    </Card>
  );
}
