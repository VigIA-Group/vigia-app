/**
 * Admin Panel — Clerk Organizations user management
 * Accessible only to org:admin / org:owner
 */
import { useApiClient } from "@/src/hooks/use-api-client";
import { useOrganization } from "@clerk/expo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Ban,
  CheckCircle,
  ChevronDown,
  Key,
  MailPlus,
  Shield,
  UserMinus,
  UserPlus,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, TextInput } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

type Role = "owner" | "admin" | "viewer";
type OrgUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  is_active: boolean;
  clerk_user_id: string;
};

const ROLE_LABELS: Record<Role, string> = {
  owner: "Propietario",
  admin: "Administrador",
  viewer: "Observador",
};

const ROLES: Role[] = ["viewer", "admin", "owner"];

export default function AdminScreen() {
  const router = useRouter();
  const api = useApiClient();
  const { membership } = useOrganization();
  const isOwner = membership?.role === "org:owner";

  const [users, setUsers] = useState<OrgUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Invite modal
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("viewer");
  const [inviteLoading, setInviteLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listUsers();
      setUsers(data);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviteLoading(true);
    try {
      await api.inviteUser(inviteEmail, inviteRole as "admin" | "viewer");
      setShowInvite(false);
      setInviteEmail("");
      await loadUsers();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo invitar al usuario");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleBlock = (user: OrgUser) => {
    Alert.alert(
      user.is_active ? "Bloquear usuario" : "Desbloquear usuario",
      `¿${user.is_active ? "Bloquear" : "Desbloquear"} a ${user.email}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: user.is_active ? "destructive" : "default",
          onPress: async () => {
            try {
              if (user.is_active) {
                await api.blockUser(user.id);
              } else {
                await api.unblockUser(user.id);
              }
              await loadUsers();
            } catch (e: any) {
              Alert.alert("Error", e?.message ?? "Acción fallida");
            }
          },
        },
      ]
    );
  };

  const handleResetPassword = (user: OrgUser) => {
    Alert.alert(
      "Restablecer contraseña",
      `Se enviará un email de restablecimiento a ${user.email}`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar",
          onPress: async () => {
            try {
              await api.resetPassword(user.id);
              Alert.alert("Listo", "Email enviado");
            } catch (e: any) {
              Alert.alert("Error", e?.message ?? "No se pudo enviar");
            }
          },
        },
      ]
    );
  };

  const handleRoleChange = (user: OrgUser, newRole: Role) => {
    if (!isOwner) return;
    Alert.alert("Cambiar rol", `Cambiar rol de ${user.email} a ${ROLE_LABELS[newRole]}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: async () => {
          try {
            await api.changeRole(user.id, newRole as "admin" | "viewer");
            await loadUsers();
          } catch (e: any) {
            Alert.alert("Error", e?.message ?? "No se pudo cambiar el rol");
          }
        },
      },
    ]);
  };

  return (
    <View flex={1}>
      <LinearGradient colors={["#020617", "#0c1a3a", "#020617"]} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <YStack paddingTop={56} paddingHorizontal={20} paddingBottom={16}>
        <XStack alignItems="center" gap={12} marginBottom={4}>
          <View
            width={36}
            height={36}
            borderRadius={10}
            backgroundColor="#0f172a"
            alignItems="center"
            justifyContent="center"
            pressStyle={{ opacity: 0.6 }}
            onPress={() => router.back()}
          >
            <ArrowLeft size={18} color="#94a3b8" />
          </View>
          <XStack alignItems="center" gap={8}>
            <Shield size={20} color="#3b82f6" />
            <Text fontSize={20} fontWeight="700" color="#ffffff" fontFamily="$body">
              Administración
            </Text>
          </XStack>
        </XStack>
        <Text fontSize={13} color="#64748b" fontFamily="$body" marginLeft={48}>
          Gestión de usuarios de la organización
        </Text>
      </YStack>

      {/* Invite button */}
      <View marginHorizontal={20} marginBottom={16}>
        <XStack
          height={44}
          borderRadius={12}
          backgroundColor="rgba(59,130,246,0.12)"
          borderWidth={1}
          borderColor="rgba(59,130,246,0.3)"
          alignItems="center"
          justifyContent="center"
          gap={8}
          pressStyle={{ opacity: 0.7 }}
          onPress={() => setShowInvite(true)}
        >
          <MailPlus size={16} color="#3b82f6" />
          <Text fontSize={14} fontWeight="600" color="#3b82f6" fontFamily="$body">
            Invitar usuario
          </Text>
        </XStack>
      </View>

      {/* User list */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {loading ? (
          <ActivityIndicator color="#3b82f6" style={{ marginTop: 40 }} />
        ) : error ? (
          <Text color="#ef4444" fontFamily="$body" textAlign="center" marginTop={40}>
            {error}
          </Text>
        ) : (
          <YStack gap={10}>
            {users.map((user) => (
              <YStack
                key={user.id}
                backgroundColor="#0f172a"
                borderRadius={14}
                borderWidth={1}
                borderColor={user.is_active ? "#1e293b" : "rgba(248,113,113,0.2)"}
                padding={16}
                gap={10}
              >
                {/* User info row */}
                <XStack alignItems="center" justifyContent="space-between">
                  <YStack flex={1}>
                    <Text
                      fontSize={14}
                      fontWeight="600"
                      color={user.is_active ? "#ffffff" : "#94a3b8"}
                      fontFamily="$body"
                    >
                      {user.name || user.email}
                    </Text>
                    <Text fontSize={12} color="#64748b" fontFamily="$body">
                      {user.email}
                    </Text>
                  </YStack>
                  <View
                    paddingHorizontal={10}
                    paddingVertical={4}
                    borderRadius={20}
                    backgroundColor={
                      user.is_active ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)"
                    }
                    borderWidth={1}
                    borderColor={user.is_active ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}
                  >
                    <Text
                      fontSize={11}
                      fontWeight="600"
                      color={user.is_active ? "#34d399" : "#f87171"}
                      fontFamily="$body"
                    >
                      {user.is_active ? "Activo" : "Bloqueado"}
                    </Text>
                  </View>
                </XStack>

                {/* Role badge + role picker (owner only) */}
                <XStack alignItems="center" gap={8}>
                  <View
                    paddingHorizontal={10}
                    paddingVertical={4}
                    borderRadius={20}
                    backgroundColor="rgba(59,130,246,0.1)"
                    borderWidth={1}
                    borderColor="rgba(59,130,246,0.25)"
                  >
                    <Text fontSize={11} fontWeight="600" color="#3b82f6" fontFamily="$body">
                      {ROLE_LABELS[user.role]}
                    </Text>
                  </View>
                  {isOwner && (
                    <XStack gap={6}>
                      {ROLES.filter((r) => r !== user.role).map((r) => (
                        <View
                          key={r}
                          paddingHorizontal={8}
                          paddingVertical={3}
                          borderRadius={8}
                          backgroundColor="#1e293b"
                          pressStyle={{ opacity: 0.6 }}
                          onPress={() => handleRoleChange(user, r)}
                        >
                          <Text fontSize={10} color="#94a3b8" fontFamily="$body">
                            → {ROLE_LABELS[r]}
                          </Text>
                        </View>
                      ))}
                    </XStack>
                  )}
                </XStack>

                {/* Action buttons */}
                <XStack gap={8}>
                  <ActionBtn
                    icon={
                      user.is_active ? (
                        <Ban size={14} color="#f87171" />
                      ) : (
                        <CheckCircle size={14} color="#34d399" />
                      )
                    }
                    label={user.is_active ? "Bloquear" : "Activar"}
                    color={user.is_active ? "#f87171" : "#34d399"}
                    onPress={() => handleBlock(user)}
                  />
                  <ActionBtn
                    icon={<Key size={14} color="#fbbf24" />}
                    label="Reset pwd"
                    color="#fbbf24"
                    onPress={() => handleResetPassword(user)}
                  />
                </XStack>
              </YStack>
            ))}
          </YStack>
        )}
      </ScrollView>

      {/* Invite Modal */}
      <Modal
        visible={showInvite}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInvite(false)}
      >
        <View flex={1} justifyContent="flex-end">
          <View
            backgroundColor="#020617"
            style={{
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderTopWidth: 1,
              borderColor: "#1e293b",
            }}
          >
            <LinearGradient
              colors={["#0c1a3a", "#020617"]}
              style={[
                StyleSheet.absoluteFill,
                { borderTopLeftRadius: 24, borderTopRightRadius: 24 },
              ]}
            />
            <YStack padding={24} gap={16}>
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center" gap={8}>
                  <UserPlus size={18} color="#3b82f6" />
                  <Text fontSize={17} fontWeight="700" color="#ffffff" fontFamily="$body">
                    Invitar usuario
                  </Text>
                </XStack>
                <View pressStyle={{ opacity: 0.6 }} onPress={() => setShowInvite(false)}>
                  <Text fontSize={13} color="#64748b" fontFamily="$body">
                    Cancelar
                  </Text>
                </View>
              </XStack>

              <XStack
                backgroundColor="#0f172a"
                borderRadius={12}
                borderWidth={1}
                borderColor="#334155"
                alignItems="center"
                paddingHorizontal={14}
              >
                <TextInput
                  style={{ flex: 1, color: "#ffffff", fontSize: 14, height: 48 }}
                  placeholder="email@empresa.com"
                  placeholderTextColor="#64748b"
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </XStack>

              {/* Role selector */}
              <YStack gap={8}>
                <Text fontSize={12} fontWeight="600" color="#94a3b8" fontFamily="$body">
                  Rol
                </Text>
                <XStack gap={8}>
                  {ROLES.map((r) => (
                    <View
                      key={r}
                      flex={1}
                      height={40}
                      borderRadius={10}
                      backgroundColor={inviteRole === r ? "rgba(59,130,246,0.15)" : "#0f172a"}
                      borderWidth={1}
                      borderColor={inviteRole === r ? "#3b82f6" : "#334155"}
                      alignItems="center"
                      justifyContent="center"
                      pressStyle={{ opacity: 0.7 }}
                      onPress={() => setInviteRole(r)}
                    >
                      <Text
                        fontSize={12}
                        fontWeight="600"
                        color={inviteRole === r ? "#3b82f6" : "#94a3b8"}
                        fontFamily="$body"
                      >
                        {ROLE_LABELS[r]}
                      </Text>
                    </View>
                  ))}
                </XStack>
              </YStack>

              <View
                height={50}
                borderRadius={14}
                overflow="hidden"
                pressStyle={{ opacity: 0.85 }}
                onPress={handleInvite}
                opacity={!inviteEmail || inviteLoading ? 0.6 : 1}
              >
                <LinearGradient
                  colors={["#1e3a8a", "#2563eb", "#60a5fa"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                <View flex={1} alignItems="center" justifyContent="center">
                  {inviteLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text fontSize={14} fontWeight="700" color="#ffffff" fontFamily="$body">
                      Enviar invitación
                    </Text>
                  )}
                </View>
              </View>
              <YStack height={24} />
            </YStack>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ActionBtn({
  icon,
  label,
  color,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <XStack
      height={34}
      paddingHorizontal={12}
      borderRadius={10}
      backgroundColor="#1e293b"
      alignItems="center"
      gap={6}
      pressStyle={{ opacity: 0.7 }}
      onPress={onPress}
    >
      {icon}
      <Text fontSize={12} fontWeight="600" color={color} fontFamily="$body">
        {label}
      </Text>
    </XStack>
  );
}
