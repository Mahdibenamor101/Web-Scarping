import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/lib/auth";
import { colors } from "@/lib/theme";

export default function Index() {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.dashBg }}>
        <ActivityIndicator color={colors.brand} size="large" />
      </View>
    );
  }

  return <Redirect href={status === "signedIn" ? "/(app)/orders" : "/login"} />;
}
