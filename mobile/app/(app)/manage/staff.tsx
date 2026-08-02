import { useCallback, useEffect, useState } from "react";
import { FlatList, Modal, Pressable, RefreshControl, Text, View } from "react-native";
import { Badge, Card, ErrorText, PrimaryButton, Screen, ScreenTitle, SecondaryButton, TextField } from "@/components/ui";
import { colors, spacing } from "@/lib/theme";
import { apiFetch, ApiError } from "@/lib/api";

type Role = "OWNER" | "MANAGER" | "SERVER" | "KITCHEN";

type StaffMember = { id: string; name: string; email: string; role: Role; isActive: boolean };
type PendingInvitation = { id: string; email: string; role: Role; expiresAt: string };

const ROLES: Role[] = ["OWNER", "MANAGER", "SERVER", "KITCHEN"];
const ROLE_LABEL: Record<Role, string> = { OWNER: "Propriétaire", MANAGER: "Manager", SERVER: "Serveur", KITCHEN: "Cuisine" };

export default function StaffScreen() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const { staff, invitations } = await apiFetch<{ staff: StaffMember[]; invitations: PendingInvitation[] }>("/api/staff");
      setStaff(staff);
      setInvitations(invitations);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function toggleActive(member: StaffMember) {
    try {
      await apiFetch(`/api/staff/${member.id}`, { method: "PATCH", body: { isActive: !member.isActive } });
      load();
    } catch {
      load();
    }
  }

  return (
    <Screen>
      <View style={{ padding: spacing.lg, gap: spacing.md, flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <ScreenTitle>Équipe</ScreenTitle>
          <SecondaryButton title="+ Inviter" onPress={() => setInviteOpen(true)} />
        </View>

        <FlatList
          data={staff}
          keyExtractor={(m) => m.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
          ListEmptyComponent={!loading ? <Text style={{ color: colors.white40 }}>Aucun membre.</Text> : null}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          ListFooterComponent={
            invitations.length > 0 ? (
              <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
                <Text style={{ color: colors.white40, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Invitations en attente
                </Text>
                {invitations.map((inv) => (
                  <Card key={inv.id} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ color: colors.white70, fontSize: 13 }}>{inv.email}</Text>
                    <Badge variant="todo">{ROLE_LABEL[inv.role]}</Badge>
                  </Card>
                ))}
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <Card style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>{item.name}</Text>
                <Text style={{ color: colors.white40, fontSize: 12 }}>{item.email}</Text>
                <View style={{ flexDirection: "row", gap: 6, marginTop: 2 }}>
                  <Badge variant="muted">{ROLE_LABEL[item.role]}</Badge>
                  {!item.isActive && <Badge variant="danger">Désactivé</Badge>}
                </View>
              </View>
              <Pressable onPress={() => toggleActive(item)}>
                <Text style={{ color: item.isActive ? colors.dangerLight : colors.readyLight, fontSize: 12, fontWeight: "600" }}>
                  {item.isActive ? "Désactiver" : "Réactiver"}
                </Text>
              </Pressable>
            </Card>
          )}
        />
      </View>

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} onInvited={load} />
    </Screen>
  );
}

function InviteModal({ open, onClose, onInvited }: { open: boolean; onClose: () => void; onInvited: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("SERVER");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setEmail("");
    setRole("SERVER");
    setError(null);
    setResult(null);
  }

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const body = await apiFetch<{ inviteUrl: string; emailSent: boolean }>("/api/staff/invite", {
        method: "POST",
        body: { email, role },
      });
      setResult(body.emailSent ? "Email envoyé." : `Aucun email configuré — lien : ${body.inviteUrl}`);
      onInvited();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur inconnue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: colors.dashBg, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: spacing.lg, gap: spacing.md }}>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>Inviter un membre</Text>
          <TextField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <View style={{ gap: 6 }}>
            <Text style={{ color: colors.white70, fontSize: 13, fontWeight: "600" }}>Rôle</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              {ROLES.map((r) => (
                <Pressable
                  key={r}
                  onPress={() => setRole(r)}
                  style={{
                    borderRadius: 999,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    backgroundColor: role === r ? colors.brand : "rgba(255,255,255,0.06)",
                  }}
                >
                  <Text style={{ color: role === r ? "#fff" : colors.white70, fontSize: 13, fontWeight: "600" }}>
                    {ROLE_LABEL[r]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          {error && <ErrorText>{error}</ErrorText>}
          {result && <Text style={{ color: colors.readyLight, fontSize: 12 }}>{result}</Text>}
          <PrimaryButton title="Envoyer l'invitation" onPress={submit} loading={submitting} disabled={!email} />
          <SecondaryButton
            title="Fermer"
            onPress={() => {
              reset();
              onClose();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
