import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth, BILLING_MANAGEMENT_ROLES } from "@/lib/auth";
import { Screen, Card } from "@/components/ui";
import { colors } from "@/lib/theme";

const ITEMS = [
  { href: "/(app)/manage/staff", label: "Équipe", hint: "Inviter, rôles, retirer" },
  { href: "/(app)/manage/menu", label: "Menu", hint: "Catégories, plats, photos" },
  { href: "/(app)/manage/tables", label: "Tables", hint: "QR codes, modes de commande" },
  { href: "/(app)/manage/branding", label: "Marque", hint: "Logo, image de fond du menu public" },
] as const;

export default function ManageHubScreen() {
  const { user } = useAuth();
  const items = BILLING_MANAGEMENT_ROLES.includes(user!.role)
    ? [...ITEMS, { href: "/(app)/manage/billing" as const, label: "Abonnement", hint: "Statut, facturation" }]
    : ITEMS;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
        {items.map((item) => (
          <Pressable key={item.href} onPress={() => router.push(item.href)}>
            <Card style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View>
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>{item.label}</Text>
                <Text style={{ color: colors.white40, fontSize: 12, marginTop: 2 }}>{item.hint}</Text>
              </View>
              <Text style={{ color: colors.white40, fontSize: 20 }}>›</Text>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}
