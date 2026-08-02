import { Stack } from "expo-router";
import { colors } from "@/lib/theme";

export default function ManageLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.dashCard },
        headerTintColor: "#fff",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Gérer" }} />
      <Stack.Screen name="staff" options={{ title: "Équipe" }} />
      <Stack.Screen name="menu" options={{ title: "Menu" }} />
      <Stack.Screen name="tables" options={{ title: "Tables" }} />
      <Stack.Screen name="branding" options={{ title: "Marque" }} />
      <Stack.Screen name="billing" options={{ title: "Abonnement" }} />
    </Stack>
  );
}
