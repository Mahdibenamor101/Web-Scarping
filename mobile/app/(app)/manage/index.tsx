import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, BILLING_MANAGEMENT_ROLES } from "@/lib/auth";
import { Screen, Card } from "@/components/ui";
import { colors } from "@/lib/theme";

const ITEMS = [
  { href: "/(app)/manage/staff", label: "Équipe", hint: "Inviter, rôles, retirer", icon: "people-outline" },
  { href: "/(app)/manage/menu", label: "Menu", hint: "Catégories, plats, photos", icon: "restaurant-outline" },
  { href: "/(app)/manage/tables", label: "Tables", hint: "QR codes, modes de commande", icon: "qr-code-outline" },
  {
    href: "/(app)/manage/branding",
    label: "Marque",
    hint: "Logo, image de fond du menu public",
    icon: "color-palette-outline",
  },
] as const;

export default function ManageHubScreen() {
  const { user } = useAuth();
  const items = BILLING_MANAGEMENT_ROLES.includes(user!.role)
    ? [...ITEMS, { href: "/(app)/manage/billing" as const, label: "Abonnement", hint: "Statut, facturation", icon: "card-outline" as const }]
    : ITEMS;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
        {items.map((item) => (
          <Pressable key={item.href} onPress={() => router.push(item.href)}>
            <Card style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: colors.brand + "1f",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={item.icon} size={20} color={colors.brandLight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>{item.label}</Text>
                <Text style={{ color: colors.white40, fontSize: 12, marginTop: 2 }}>{item.hint}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.white40} />
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}
