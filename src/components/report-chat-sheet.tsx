/**
 * ReportChatSheet — AI assistant chat per report context.
 * Opens as a bottom sheet. Uses mock AI responses from getAIResponse().
 */
import BottomSheet, { BottomSheetScrollView } from "@/src/components/bottom-sheet";
import { type AIChatMessage, getAIResponse } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import { LinearGradient } from "expo-linear-gradient";
import { Bot, Send, Sparkles, X } from "lucide-react-native";
import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

const SUGGESTED_QUESTIONS = [
  "¿Por qué hubo un incremento el sábado?",
  "Hicimos una campaña de marketing",
  "¿Qué día tiene menor afluencia?",
  "¿Qué recomiendas para reducir alertas?",
  "Compara con el período anterior",
];

let msgCounter = 0;
function makeId() {
  return `msg-${++msgCounter}-${Date.now()}`;
}

interface ReportChatSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  contextLabel?: string;
}

export function ReportChatSheet({
  sheetRef,
  contextLabel = "Reporte actual",
}: ReportChatSheetProps) {
  const colors = useColors();
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: makeId(),
      role: "assistant",
      text: `Hola, soy el asistente de análisis de VigIA. Puedes preguntarme sobre los datos del **${contextLabel}**.\n\nPor ejemplo: ¿por qué incrementó el tráfico?, ¿qué día es más tranquilo?, ¿qué significa un pico de alertas en bodega?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: AIChatMessage = {
      id: makeId(),
      role: "user",
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking time (800–1400ms)
    setTimeout(
      () => {
        const response = getAIResponse(text);
        const aiMsg: AIChatMessage = {
          id: makeId(),
          role: "assistant",
          text: response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      },
      800 + Math.random() * 600
    );
  }, []);

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={["92%", "100%"]}
      index={-1}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: colors.bg }}
    >
      <View style={{ flex: 1, maxWidth: 800, alignSelf: "center", width: "100%" }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={20}
        >
          {/* Chat header */}
          <XStack
            paddingHorizontal={20}
            paddingVertical={14}
            borderBottomWidth={1}
            borderBottomColor={colors.borderSoft}
            alignItems="center"
            gap={10}
          >
            <View
              width={34}
              height={34}
              borderRadius={10}
              overflow="hidden"
              alignItems="center"
              justifyContent="center"
            >
              <LinearGradient
                colors={["#1e3a8a", "#3b82f6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Sparkles size={18} color="#ffffff" />
            </View>
            <YStack flex={1}>
              <Text fontSize={14} fontWeight="700" color={colors.text} fontFamily="$body">
                Asistente VigIA
              </Text>
              <Text fontSize={11} color={colors.textTer} fontFamily="$body">
                {contextLabel}
              </Text>
            </YStack>
            <View
              width={30}
              height={30}
              borderRadius={8}
              backgroundColor={colors.cardAlt}
              alignItems="center"
              justifyContent="center"
              pressStyle={{ opacity: 0.7 }}
              onPress={() => sheetRef.current?.close()}
            >
              <X size={16} color={colors.textLabel} />
            </View>
          </XStack>

          {/* Messages */}
          <BottomSheetScrollView
            contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 8 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <YStack key={msg.id} alignItems={msg.role === "user" ? "flex-end" : "flex-start"}>
                {msg.role === "assistant" && (
                  <XStack gap={6} alignItems="flex-start" maxWidth="90%">
                    <View
                      width={24}
                      height={24}
                      borderRadius={12}
                      backgroundColor="rgba(59,130,246,0.15)"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                      marginTop={2}
                    >
                      <Bot size={12} color="#3b82f6" />
                    </View>
                    <View
                      backgroundColor={colors.card}
                      borderRadius={12}
                      borderTopLeftRadius={4}
                      borderWidth={1}
                      borderColor={colors.borderSoft}
                      padding={12}
                      flex={1}
                    >
                      <Text fontSize={13} color={colors.text} fontFamily="$body" lineHeight={19}>
                        {msg.text}
                      </Text>
                    </View>
                  </XStack>
                )}
                {msg.role === "user" && (
                  <View
                    borderRadius={12}
                    borderBottomRightRadius={4}
                    overflow="hidden"
                    padding={12}
                    maxWidth="85%"
                  >
                    <LinearGradient
                      colors={["#1e3a8a", "#3b82f6"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <Text fontSize={13} color="#ffffff" fontFamily="$body" lineHeight={19}>
                      {msg.text}
                    </Text>
                  </View>
                )}
              </YStack>
            ))}

            {isTyping && (
              <XStack gap={6} alignItems="center">
                <View
                  width={24}
                  height={24}
                  borderRadius={12}
                  backgroundColor="rgba(59,130,246,0.15)"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Bot size={12} color="#3b82f6" />
                </View>
                <View
                  backgroundColor={colors.card}
                  borderRadius={10}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  paddingHorizontal={14}
                  paddingVertical={10}
                >
                  <XStack gap={4} alignItems="center">
                    {[0, 1, 2].map((i) => (
                      <View
                        key={i}
                        width={6}
                        height={6}
                        borderRadius={3}
                        backgroundColor="#3b82f6"
                        opacity={0.4 + i * 0.2}
                      />
                    ))}
                  </XStack>
                </View>
              </XStack>
            )}

            {/* Suggested questions */}
            {messages.length <= 1 && (
              <YStack gap={6} marginTop={4}>
                <Text fontSize={11} color={colors.textLabel} fontFamily="$body" fontWeight="600">
                  PREGUNTAS SUGERIDAS
                </Text>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <View
                    key={q}
                    backgroundColor={colors.cardAlt}
                    borderRadius={10}
                    borderWidth={1}
                    borderColor={colors.border}
                    paddingHorizontal={12}
                    paddingVertical={9}
                    pressStyle={{ opacity: 0.7 }}
                    onPress={() => sendMessage(q)}
                  >
                    <Text fontSize={12} color={colors.textSec} fontFamily="$body">
                      {q}
                    </Text>
                  </View>
                ))}
              </YStack>
            )}
          </BottomSheetScrollView>

          {/* Input bar */}
          <XStack
            paddingHorizontal={16}
            paddingVertical={12}
            borderTopWidth={1}
            borderTopColor={colors.borderSoft}
            gap={10}
            alignItems="flex-end"
            backgroundColor={colors.bg}
          >
            <View
              flex={1}
              backgroundColor={colors.card}
              borderRadius={12}
              borderWidth={1}
              borderColor={colors.border}
              paddingHorizontal={14}
              paddingVertical={10}
              minHeight={42}
              justifyContent="center"
            >
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Pregunta sobre estos datos..."
                placeholderTextColor={colors.textLabel}
                style={{
                  color: colors.text,
                  fontSize: 14,
                  fontFamily: "DM Sans",
                  maxHeight: 80,
                  padding: 0,
                }}
                multiline
                returnKeyType="send"
                onSubmitEditing={() => sendMessage(input)}
                blurOnSubmit
              />
            </View>
            <View
              width={42}
              height={42}
              borderRadius={12}
              overflow="hidden"
              backgroundColor={input.trim() ? undefined : colors.cardAlt}
              alignItems="center"
              justifyContent="center"
              pressStyle={{ opacity: 0.7 }}
              onPress={() => sendMessage(input)}
            >
              {input.trim() ? (
                <LinearGradient
                  colors={["#1e3a8a", "#3b82f6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
              <Send size={18} color={input.trim() ? "#ffffff" : colors.textLabel} />
            </View>
          </XStack>
        </KeyboardAvoidingView>
      </View>
    </BottomSheet>
  );
}
