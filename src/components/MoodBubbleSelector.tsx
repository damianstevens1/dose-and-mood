import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Check } from "lucide-react-native";
import { colors, gradients, shadow } from "../constants/theme";
import { lightHaptic } from "../utils/haptics";

export type BubbleOption = {
  value: string;
  label: string;
  detail?: string;
};

type Props = {
  label: string;
  helper?: string;
  value: string;
  options: BubbleOption[];
  onChange: (value: string) => void;
  columns?: 2 | 3;
};

export function MoodBubbleSelector({ label, helper, value, options, onChange, columns = 3 }: Props) {
  return (
    <View style={styles.group}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {helper ? <Text style={styles.helper}>{helper}</Text> : null}
      </View>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => {
                lightHaptic();
                onChange(option.value);
              }}
              style={[styles.optionShell, columns === 2 ? styles.twoColumn : styles.threeColumn]}
            >
              {selected ? (
                <LinearGradient colors={gradients.navyButton} style={[styles.option, styles.selectedOption]}>
                  <View style={styles.selectedIcon}>
                    <Check size={12} color={colors.navy} strokeWidth={3} />
                  </View>
                  <Text style={styles.selectedLabel}>{option.label}</Text>
                  {option.detail ? <Text style={styles.selectedDetail}>{option.detail}</Text> : null}
                </LinearGradient>
              ) : (
                <View style={styles.option}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  {option.detail ? <Text style={styles.optionDetail}>{option.detail}</Text> : null}
                </View>
              )}
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
    fontWeight: "800",
    letterSpacing: 0
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
  optionShell: {
    minHeight: 64
  },
  twoColumn: {
    flexBasis: "48.7%"
  },
  threeColumn: {
    flexBasis: "31.8%"
  },
  option: {
    minHeight: 64,
    flex: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.66)",
    borderWidth: 1,
    borderColor: "rgba(24,33,59,0.08)"
  },
  selectedOption: {
    borderColor: "rgba(24,33,59,0.12)",
    ...shadow.card
  },
  selectedIcon: {
    width: 18,
    height: 18,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.champagne,
    marginBottom: 4
  },
  optionLabel: {
    color: colors.softNavy,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
    textAlign: "center"
  },
  selectedLabel: {
    color: colors.porcelain,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
    textAlign: "center"
  },
  optionDetail: {
    color: colors.mutedText,
    fontSize: 10,
    lineHeight: 13,
    marginTop: 2,
    textAlign: "center"
  },
  selectedDetail: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 10,
    lineHeight: 13,
    marginTop: 2,
    textAlign: "center"
  }
});
