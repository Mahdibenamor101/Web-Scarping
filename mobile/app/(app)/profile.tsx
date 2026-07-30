import { Alert, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
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
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <ScreenTitle>Profil</ScreenTitle>
        <Card style={{ gap: 4 }}>
          <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}>{user.name}</Text>
          <Text style={{ color: colors.white40, fontSize: 13 }}>{user.email}</Text>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            <Badge variant="muted">{ROLE_LABEL[user.role] ?? user.role}</Badge>
            {!user.emailVerifiedAt && <Badge variant="todo">Email non vérifié</Badge>}
          </View>
        </Card>
        <Card>
          <Text style={{ color: colors.white40, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Restaurant
          </Text>
          <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600", marginTop: 4 }}>{user.organization.name}</Text>
        </Card>
        <SecondaryButton title="Se déconnecter" onPress={confirmLogout} danger />
      </ScrollView>
    </Screen>
  );
}
