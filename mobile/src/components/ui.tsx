import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, spacing } from "@/lib/theme";

/** Full-screen dark surface + safe-area insets, every screen's root. */
export function Screen({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <SafeAreaView style={[styles.screen, style]}>{children}</SafeAreaView>;
}

/**
 * Glass card: `expo-blur`'s BlurView gives a real backdrop-blur (not a
 * translucent-color approximation) the same way the web app's
 * `backdrop-blur-2xl` classes do -- both surfaces are meant to read as
 * the same material. `tint="dark"` since every mobile screen lives on
 * the dashboard's always-dark ground (see theme.ts), never the light
 * marketing surface.
 */
export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <BlurView intensity={40} tint="dark" style={[styles.card, style]}>
      {children}
    </BlurView>
  );
}

/** Kept as a name for every existing call site (the order-board/ticket
 * motif) -- same glass material as `Card` now, the torn-paper look
 * retired with the "Comanda" direction it belonged to (see CONTEXT.md). */
export function TicketCard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <Card style={style}>{children}</Card>;
}

export function ScreenTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

type BadgeVariant = "todo" | "progress" | "ready" | "danger" | "muted";
const BADGE_COLORS: Record<BadgeVariant, { border: string; bg: string; text: string }> = {
  todo: { border: colors.brandLight + "4d", bg: colors.brandLight + "26", text: colors.brandLight },
  progress: { border: colors.progressLight + "4d", bg: colors.progressLight + "26", text: colors.progressLight },
  ready: { border: colors.readyLight + "4d", bg: colors.readyLight + "26", text: colors.readyLight },
  danger: { border: colors.dangerLight + "4d", bg: colors.dangerLight + "26", text: colors.dangerLight },
  muted: { border: colors.white15, bg: colors.white10, text: colors.white70 },
};

export function Badge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  const c = BADGE_COLORS[variant];
  return (
    <View style={[styles.badge, { borderColor: c.border, backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.text }]}>{children}</Text>
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [styles.primaryBtn, (disabled || loading) && styles.btnDisabled, pressed && styles.btnPressed]}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{title}</Text>}
    </Pressable>
  );
}

export function SecondaryButton({ title, onPress, danger }: { title: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}>
      <Text style={[styles.secondaryBtnText, danger && { color: colors.dangerLight }]}>{title}</Text>
    </Pressable>
  );
}

export function TextField({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.white40} style={styles.input} {...props} />
    </View>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <View style={{ padding: spacing.lg }}>
      <Text style={styles.empty}>{text}</Text>
    </View>
  );
}

export function ErrorText({ children }: { children: React.ReactNode }) {
  return <Text style={styles.error}>{children}</Text>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.dashBg },
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.white15,
    padding: spacing.lg,
    overflow: "hidden",
  },
  title: { fontSize: 28, fontWeight: "800", color: "#fff", letterSpacing: -0.5 },
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.3 },
  primaryBtn: {
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  secondaryBtn: { paddingVertical: 8 },
  secondaryBtnText: { color: colors.white70, fontWeight: "600", fontSize: 14 },
  btnDisabled: { opacity: 0.5 },
  btnPressed: { opacity: 0.8 },
  label: { color: colors.white70, fontSize: 13, fontWeight: "600" },
  input: {
    backgroundColor: colors.white10,
    borderWidth: 1,
    borderColor: colors.white15,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 15,
  },
  empty: { color: colors.white40, fontSize: 14, textAlign: "center" },
  error: { color: colors.dangerLight, fontSize: 13 },
});
