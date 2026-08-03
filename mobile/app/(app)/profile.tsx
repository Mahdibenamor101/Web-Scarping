import { Alert, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/lib/auth";
import { unregisterCurrentPushToken } from "@/lib/push";
import { Screen, ScreenTitle, Card, SecondaryButton, Badge } from "@/components/ui";
import { colors } from "@/lib/theme";

const ROLE_LABEL: Record<string, string> = {
  OWNER: "Propriétaire",
  MANAGER: "Manager",
  SERVER: "Serveur",
  KITCHEN: "Cuisine",
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  if (!user) return null;

  function confirmLogout() {
    Alert.alert("Se déconnecter ?", undefined, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se déconnecter",
        style: "destructive",
        onPress: async () => {
          await unregisterCurrentPushToken();
          await logout();
          router.replace("/login");
        },
      },
    ]);
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, flexGrow: 1 }}>
        <ScreenTitle>Profil</ScreenTitle>

        <Card style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.brand,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>
              {user.name.trim().charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}>{user.name}</Text>
            <Text style={{ color: colors.white40, fontSize: 13 }}>{user.email}</Text>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
              <Badge variant="muted">{ROLE_LABEL[user.role] ?? user.role}</Badge>
              {!user.emailVerifiedAt && <Badge variant="todo">Email non vérifié</Badge>}
            </View>
          </View>
        </Card>

        <Card style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              backgroundColor: colors.progress + "26",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="storefront-outline" size={18} color={colors.progressLight} />
          </View>
          <View>
            <Text style={{ color: colors.white40, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Restaurant
            </Text>
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600", marginTop: 2 }}>{user.organization.name}</Text>
          </View>
        </Card>

        <SecondaryButton title="Se déconnecter" onPress={confirmLogout} danger />

        <View style={{ flex: 1 }} />
        <Text style={{ color: colors.white40, fontSize: 11, textAlign: "center" }}>Tavolino Staff</Text>
      </ScrollView>
    </Screen>
  );
}
