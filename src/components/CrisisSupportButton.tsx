import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CircleAlert } from "lucide-react-native";
import { colors, gradients, shadow } from "../constants/theme";
import { lightHaptic } from "../utils/haptics";

type Props = {
  onPress: () => void;
  compact?: boolean;
};

export function CrisisSupportButton({ onPress, compact }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Need help now?"
      onPress={() => {
        lightHaptic();
        onPress();
      }}
    >
      <LinearGradient colors={gradients.support} style={[styles.button, compact && styles.compact, shadow.card]}>
        <CircleAlert size={compact ? 15 : 18} color={colors.danger} strokeWidth={2.4} />
        <Text style={[styles.text, compact && styles.compactText]}>Need help now?</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(155,53,74,0.14)"
  },
  compact: {
    minHeight: 34,
    paddingHorizontal: 10
  },
  text: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
    letterSpacing: 0
  },
  compactText: {
    fontSize: 11,
    lineHeight: 14
  }
});
