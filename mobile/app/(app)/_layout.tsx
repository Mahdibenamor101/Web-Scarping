import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth, canManageStaff } from "@/lib/auth";
import { colors } from "@/lib/theme";

// Four tabs, not one per screen: a bottom bar with 7-8 items (Commandes,
// Analytics, Staff, Menu, Tables, Marque, Abonnement, Profil) would be
// cramped on a phone. Owner/manager-only screens live behind "Gérer", a
// hub tab (see (app)/manage/index.tsx) -- same role split as the web
// dashboard nav, just grouped differently for a small screen.
export default function AppLayout() {
  const { status, user } = useAuth();

  if (status === "loading") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.dashBg }}>
        <ActivityIndicator color={colors.brand} size="large" />
      </View>
    );
  }
  if (status !== "signedIn" || !user) {
    return <Redirect href="/login" />;
  }

  const canManage = canManageStaff(user.role);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.white40,
        tabBarStyle: { backgroundColor: colors.dashCard, borderTopColor: colors.white10 },
      }}
    >
      <Tabs.Screen name="orders" options={{ title: "Commandes" }} />
      <Tabs.Screen name="analytics" options={{ title: "Analytics", href: canManage ? undefined : null }} />
      <Tabs.Screen name="manage" options={{ title: "Gérer", href: canManage ? undefined : null }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}
