import { Text, Theme, YStack } from "tamagui";

export default function HomeScreen() {
  return (
    <Theme name="dark">
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Text fontSize={48} fontWeight="bold" color="$primary">
          VigIA
        </Text>
      </YStack>
    </Theme>
  );
}
