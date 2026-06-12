/**
 * VigIA Super-Admin Panel
 *
 * Only visible to @vigia.world email accounts.
 * Allows Vigia staff to grant / revoke licenses and inspect all tenants.
 */
import { useColors } from "@/src/hooks/use-colors";
import { useAuth, useUser } from "@clerk/expo";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle,
  ChevronRight,
  MoreVertical,
  Users,
  XCircle,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

// ── Types ────────────────────────────────────────────────────────────────────

interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
  is_active: boolean;
  clerk_org_id: string | null;
  created_at: string;
}

interface GlobalStats {
  total_tenants: number;
  active_tenants: number;
  inactive_tenants: number;
  total_users: number;
  by_plan: Record<string, number>;
}

const PLAN_COLORS: Record<string, string> = {
  free: "#6b7280",
  starter: "#3b82f6",
  pro: "#8b5cf6",
  enterprise: "#f59e0b",
};

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

// ── Main screen ──────────────────────────────────────────────────────────────

export default function VigiaAdminScreen() {
  const colors = useColors();
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();

  const primaryEmail =
    user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ?? "";

  const isVigiaStaff = primaryEmail.endsWith("@vigia.world");

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);

  // ── Fetch ----------------------------------------------------------------

  const fetchToken = useCallback(async () => {
    return getToken() ?? null;
  }, [getToken]);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const token = await fetchToken();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [tenantsRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/vigia-admin/tenants`, { headers }),
          fetch(`${API_BASE}/vigia-admin/stats`, { headers }),
        ]);

        if (tenantsRes.ok) setTenants(await tenantsRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
      } catch (e) {
        console.error("vigia-admin fetch error", e);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fetchToken]
  );

  useEffect(() => {
    if (isLoaded && isVigiaStaff) fetchData();
  }, [isLoaded, isVigiaStaff, fetchData]);

  // ── License actions -------------------------------------------------------

  const patchLicense = async (tenantId: string, patch: { is_active?: boolean; plan?: string }) => {
    try {
      const token = await fetchToken();
      const res = await fetch(`${API_BASE}/vigia-admin/tenants/${tenantId}/license`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchData(true);
    } catch (e: unknown) {
      Alert.alert("Error", e instanceof Error ? e.message : "Error al actualizar");
    }
  };

  const confirmRevoke = (tenant: Tenant) => {
    Alert.alert(
      "Revocar licencia",
      `¿Revocar la licencia de "${tenant.name}"? Sus usuarios no podrán acceder.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Revocar",
          style: "destructive",
          onPress: () => patchLicense(tenant.id, { is_active: false }),
        },
      ]
    );
  };

  const showPlanPicker = (tenant: Tenant) => {
    Alert.alert("Cambiar plan", `Plan actual: ${tenant.plan}`, [
      { text: "Cancelar", style: "cancel" },
      { text: "free", onPress: () => patchLicense(tenant.id, { plan: "free" }) },
      { text: "starter", onPress: () => patchLicense(tenant.id, { plan: "starter" }) },
      { text: "pro", onPress: () => patchLicense(tenant.id, { plan: "pro" }) },
      { text: "enterprise", onPress: () => patchLicense(tenant.id, { plan: "enterprise" }) },
    ]);
  };

  // ── Access guard ----------------------------------------------------------

  if (!isLoaded) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" backgroundColor={colors.bg}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!isVigiaStaff) {
    return (
      <View
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor={colors.bg}
        padding="$6"
      >
        <AlertTriangle size={48} color="#f87171" />
        <Text color={colors.text} fontSize={18} fontWeight="600" mt="$4" textAlign="center">
          Acceso restringido
        </Text>
        <Text color={colors.textTer} textAlign="center" mt="$2">
          Esta sección es exclusiva para el equipo VigIA (@vigia.world).
        </Text>
        <TouchableOpacity style={{ marginTop: 24 }} onPress={() => router.back()}>
          <Text color={colors.accent}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Render ----------------------------------------------------------------

  const renderStatCard = (label: string, value: number, Icon: React.ElementType, color: string) => (
    <View
      flex={1}
      backgroundColor={colors.card}
      borderRadius={12}
      padding="$3"
      margin="$1"
      alignItems="center"
    >
      <Icon size={20} color={color} />
      <Text color={colors.text} fontSize={22} fontWeight="700" mt="$1">
        {value}
      </Text>
      <Text color={colors.textTer} fontSize={11} textAlign="center">
        {label}
      </Text>
    </View>
  );

  const renderTenant = ({ item }: { item: Tenant }) => (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => {
        setSelectedTenant(item);
        setActionMenuVisible(true);
      }}
    >
      <XStack
        backgroundColor={colors.card}
        borderRadius={12}
        padding="$4"
        marginBottom="$2"
        alignItems="center"
        gap="$3"
      >
        <View
          width={40}
          height={40}
          borderRadius={20}
          backgroundColor={item.is_active ? "#1d4ed820" : "#6b728020"}
          justifyContent="center"
          alignItems="center"
        >
          <Building2 size={20} color={item.is_active ? "#60a5fa" : "#6b7280"} />
        </View>

        <YStack flex={1} gap="$1">
          <XStack alignItems="center" gap="$2">
            <Text color={colors.text} fontWeight="600" fontSize={14}>
              {item.name}
            </Text>
            {item.is_active ? (
              <CheckCircle size={14} color="#34d399" />
            ) : (
              <XCircle size={14} color="#f87171" />
            )}
          </XStack>
          <XStack gap="$2" alignItems="center">
            <View
              backgroundColor={(PLAN_COLORS[item.plan] ?? "#6b7280") + "20"}
              borderRadius={6}
              paddingHorizontal={6}
              paddingVertical={2}
            >
              <Text fontSize={10} fontWeight="700" color={PLAN_COLORS[item.plan] ?? "#6b7280"}>
                {item.plan.toUpperCase()}
              </Text>
            </View>
            <Text color={colors.textTer} fontSize={11}>
              {item.slug}
            </Text>
          </XStack>
        </YStack>

        <ChevronRight size={16} color={colors.textTer} />
      </XStack>
    </TouchableOpacity>
  );

  return (
    <View flex={1} backgroundColor={colors.bg}>
      {/* Header */}
      <LinearGradient colors={["#1e3a5f", "#0f172a"]} style={styles.header}>
        <XStack alignItems="center" gap="$3" mt="$10" mb="$4" paddingHorizontal="$4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <YStack flex={1}>
            <Text color="#fff" fontSize={20} fontWeight="700">
              Super Admin
            </Text>
            <Text color="#93c5fd" fontSize={12}>
              {primaryEmail}
            </Text>
          </YStack>
          <Activity size={22} color="#60a5fa" />
        </XStack>
      </LinearGradient>

      <FlatList
        data={tenants}
        keyExtractor={(t) => t.id}
        renderItem={renderTenant}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchData(true)}
            tintColor={colors.accent}
          />
        }
        ListHeaderComponent={
          <>
            {/* Stats row */}
            {stats && (
              <XStack mb="$4" flexWrap="wrap">
                {renderStatCard("Tenants", stats.total_tenants, Building2, "#60a5fa")}
                {renderStatCard("Activos", stats.active_tenants, CheckCircle, "#34d399")}
                {renderStatCard("Inactivos", stats.inactive_tenants, XCircle, "#f87171")}
                {renderStatCard("Usuarios", stats.total_users, Users, "#a78bfa")}
              </XStack>
            )}

            {/* Plan breakdown */}
            {stats?.by_plan && (
              <View backgroundColor={colors.card} borderRadius={12} padding="$4" mb="$4">
                <Text color={colors.textTer} fontSize={12} fontWeight="600" mb="$3">
                  DISTRIBUCIÓN POR PLAN
                </Text>
                <XStack gap="$2" flexWrap="wrap">
                  {Object.entries(stats.by_plan).map(([plan, count]) => (
                    <View
                      key={plan}
                      backgroundColor={(PLAN_COLORS[plan] ?? "#6b7280") + "20"}
                      borderRadius={8}
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                    >
                      <Text color={PLAN_COLORS[plan] ?? "#6b7280"} fontSize={12} fontWeight="700">
                        {plan}: {count}
                      </Text>
                    </View>
                  ))}
                </XStack>
              </View>
            )}

            <Text color={colors.textTer} fontSize={12} fontWeight="600" mb="$2">
              TODOS LOS TENANTS ({tenants.length})
            </Text>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
          ) : (
            <Text color={colors.textTer} textAlign="center" mt="$8">
              No hay tenants registrados.
            </Text>
          )
        }
      />

      {/* Action sheet modal */}
      <Modal
        visible={actionMenuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setActionMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActionMenuVisible(false)}
        >
          <View
            backgroundColor={colors.card}
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            padding="$5"
            paddingBottom="$8"
          >
            {selectedTenant && (
              <>
                <XStack alignItems="center" gap="$3" mb="$4">
                  <Building2 size={24} color={colors.accent} />
                  <YStack>
                    <Text color={colors.text} fontSize={16} fontWeight="700">
                      {selectedTenant.name}
                    </Text>
                    <Text color={colors.textTer} fontSize={12}>
                      {selectedTenant.is_active ? "Activo" : "Inactivo"} · {selectedTenant.plan}
                    </Text>
                  </YStack>
                </XStack>

                {/* Grant / Revoke */}
                {selectedTenant.is_active ? (
                  <TouchableOpacity
                    style={[styles.actionButton, { borderColor: "#f87171" }]}
                    onPress={() => {
                      setActionMenuVisible(false);
                      confirmRevoke(selectedTenant);
                    }}
                  >
                    <XCircle size={18} color="#f87171" />
                    <Text color="#f87171" ml="$2" fontWeight="600">
                      Revocar licencia
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.actionButton, { borderColor: "#34d399" }]}
                    onPress={() => {
                      setActionMenuVisible(false);
                      patchLicense(selectedTenant.id, { is_active: true });
                    }}
                  >
                    <CheckCircle size={18} color="#34d399" />
                    <Text color="#34d399" ml="$2" fontWeight="600">
                      Activar licencia
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Change plan */}
                <TouchableOpacity
                  style={[styles.actionButton, { borderColor: colors.accent, marginTop: 12 }]}
                  onPress={() => {
                    setActionMenuVisible(false);
                    showPlanPicker(selectedTenant);
                  }}
                >
                  <MoreVertical size={18} color={colors.accent} />
                  <Text color={colors.accent} ml="$2" fontWeight="600">
                    Cambiar plan
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
