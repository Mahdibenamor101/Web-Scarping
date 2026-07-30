import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, spacing } from "@/lib/theme";

/** Full-screen dark surface + safe-area insets, every screen's root. */
export function Screen({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <SafeAreaView style={[styles.screen, style]}>{children}</SafeAreaView>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** The signature "comanda" motif on web (ticket.tsx) -- a dashed top edge stands in for the CSS perforation here. */
export function TicketCard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[styles.card, styles.ticket, style]}>
      <View style={styles.ticketPerforation} />
      {children}
    </View>
  );
}

export function ScreenTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

type BadgeVariant = "todo" | "progress" | "ready" | "danger" | "muted";
const BADGE_COLORS: Record<BadgeVariant, { border: string; bg: string; text: string }> = {
  todo: { border: colors.brandLight + "66", bg: colors.brandLight + "26", text: colors.brandLight },
  progress: { border: colors.progressLight + "66", bg: colors.progressLight + "26", text: colors.progressLight },
  ready: { border: colors.readyLight + "66", bg: colors.readyLight + "26", text: colors.readyLight },
  danger: { border: colors.dangerLight + "66", bg: colors.dangerLight + "26", text: colors.dangerLight },
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
    backgroundColor: colors.dashCard,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.white10,
    padding: spacing.lg,
  },
  ticket: { paddingTop: spacing.xl, position: "relative" },
  ticketPerforation: {
    position: "absolute",
    top: 10,
    left: 12,
    right: 12,
    height: 0,
    borderTopWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.white15,
  },
  title: { fontSize: 28, fontWeight: "800", color: "#fff", letterSpacing: -0.5 },
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  primaryBtn: {
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  secondaryBtn: { paddingVertical: 8 },
  secondaryBtnText: { color: colors.white70, fontWeight: "600", fontSize: 14 },
  btnDisabled: { opacity: 0.5 },
  btnPressed: { opacity: 0.8 },
  label: { color: colors.white70, fontSize: 13, fontWeight: "600" },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.white10,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 15,
  },
  empty: { color: colors.white40, fontSize: 14, textAlign: "center" },
  error: { color: colors.dangerLight, fontSize: 13 },
});
