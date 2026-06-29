import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Coffee, Leaf, Wine, Cigarette, Plus, Check } from "lucide-react-native";
import { colors } from "../constants/theme";
import { Substance } from "../types";
import { lightHaptic } from "../utils/haptics";

type Props = {
  value: Substance[];
  onChange: (value: Substance[]) => void;
};

const substances: Array<{
  value: Substance | "none";
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}> = [
  { value: "caffeine", label: "Caffeine", Icon: Coffee },
  { value: "nicotine", label: "Nicotine", Icon: Cigarette },
  { value: "alcohol", label: "Alcohol", Icon: Wine },
  { value: "cannabis", label: "Cannabis", Icon: Leaf },
  { value: "other", label: "Other", Icon: Plus },
  { value: "none", label: "None", Icon: Check }
];

export function SubstanceTracker({ value, onChange }: Props) {
  function toggle(item: Substance | "none") {
    lightHaptic();
    if (item === "none") {
      onChange([]);
      return;
    }

    const exists = value.includes(item);
    onChange(exists ? value.filter((current) => current !== item) : [...value, item]);
  }

  return (
    <View style={styles.group}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Any substances today?</Text>
        <Text style={styles.helper}>Optional context only</Text>
      </View>
      <View style={styles.options}>
        {substances.map(({ value: item, label, Icon }) => {
          const selected = item === "none" ? value.length === 0 : value.includes(item);
          return (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => toggle(item)}
              style={[styles.pill, selected && styles.pillActive]}
            >
              <Icon size={16} color={selected ? colors.porcelain : colors.plum} strokeWidth={2.4} />
              <Text style={[styles.pillText, selected && styles.pillTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 10,
    marginBottom: 18
  },
  labelRow: {
    gap: 3
  },
  label: {
    color: colors.navy,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800"
  },
  helper: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 17
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  pill: {
    minHeight: 42,
    borderRadius: 999,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "rgba(24,33,59,0.08)"
  },
  pillActive: {
    backgroundColor: colors.navy
  },
  pillText: {
    color: colors.softNavy,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800"
  },
  pillTextActive: {
    color: colors.porcelain
  }
});
