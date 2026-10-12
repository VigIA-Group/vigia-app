import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View } from "tamagui";

export default function IndustryIndex() {
  const { industry } = useLocalSearchParams<{ industry: string }>();

  useEffect(() => {
    if (industry) {
      router.replace(`/${industry}/home` as any);
    } else {
      router.replace("/menu" as any);
    }
  }, [industry]);

  return <View flex={1} />;
}

