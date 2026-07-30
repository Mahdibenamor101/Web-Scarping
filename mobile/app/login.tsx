import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { registerForPushNotifications } from "@/lib/push";
import { PrimaryButton, ErrorText, TextField, Screen } from "@/components/ui";
import { colors } from "@/lib/theme";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      // Best-effort, never blocks getting into the app -- see
      // src/lib/push.ts for why this can fail harmlessly (no EAS project
      // id configured in this environment).
      registerForPushNotifications();
      router.replace("/(app)/orders");
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                backgroundColor: colors.brand,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>M</Text>
            </View>
            <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>mbQr Staff</Text>
            <Text style={{ fontSize: 13, color: colors.white40, marginTop: 4 }}>
              Connectez-vous avec votre compte de l&apos;équipe
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <TextField
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
            {error && <ErrorText>{error}</ErrorText>}
            <PrimaryButton title="Se connecter" onPress={onSubmit} loading={loading} disabled={!email || !password} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
