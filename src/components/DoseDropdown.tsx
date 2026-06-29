import React, { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Check, ChevronDown } from "lucide-react-native";
import { colors, cardStyle, shadow } from "../constants/theme";
import { lightHaptic } from "../utils/haptics";

type Props = {
  medicationName: string;
  value: string;
  onChange: (value: string) => void;
};

const doseOptionsByMedication: Record<string, string[]> = {
  Ozempic: ["0.25 mg", "0.5 mg", "1.0 mg", "2.0 mg"],
  Wegovy: ["0.25 mg", "0.5 mg", "1.0 mg", "1.7 mg", "2.4 mg"],
  Mounjaro: ["2.5 mg", "5 mg", "7.5 mg", "10 mg", "12.5 mg", "15 mg"],
  Zepbound: ["2.5 mg", "5 mg", "7.5 mg", "10 mg", "12.5 mg", "15 mg"],
  Other: ["Starter dose", "Maintenance dose", "Dose changed recently"]
};

export function DoseDropdown({ medicationName, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const options = useMemo(() => doseOptionsByMedication[medicationName] ?? doseOptionsByMedication.Other, [medicationName]);
  const isCustom = Boolean(value) && !options.includes(value);

  function pickDose(nextValue: string) {
    lightHaptic();
    onChange(nextValue);
    setOpen(false);
  }

  return (
    <View style={styles.shell}>
      <Text style={styles.label}>Current dose</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Choose current dose"
        onPress={() => setOpen(true)}
        style={[styles.trigger, shadow.card]}
      >
        <View>
          <Text style={styles.triggerValue}>{value || "Choose dose"}</Text>
          <Text style={styles.triggerHint}>For tracking only. Use your prescription label.</Text>
        </View>
        <ChevronDown size={19} color={colors.plum} strokeWidth={2.6} />
      </Pressable>

      {isCustom ? (
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Type dose exactly as written"
          placeholderTextColor={colors.mutedText}
          style={styles.customInput}
        />
      ) : null}

      <Modal animationType="fade" transparent visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.scrim} onPress={() => setOpen(false)}>
          <View style={[styles.menu, cardStyle, shadow.soft]}>
            <Text style={styles.menuTitle}>{medicationName || "Medication"} dose</Text>
            <Text style={styles.menuBody}>Select the dose label you want tracked. This is not dosing guidance.</Text>
            <View style={styles.optionGrid}>
              {options.map((option) => {
                const active = option === value;
                return (
                  <Pressable key={option} onPress={() => pickDose(option)} style={[styles.option, active && styles.optionActive]}>
                    {active ? <Check size={15} color={colors.porcelain} strokeWidth={3} /> : null}
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>{option}</Text>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={() => {
                  lightHaptic();
                  if (!isCustom) {
                    onChange("");
                  }
                  setOpen(false);
                }}
                style={styles.customOption}
              >
                <Text style={styles.customOptionText}>Different label</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    gap: 9,
    marginBottom: 16
  },
  label: {
    color: colors.navy,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800"
  },
  trigger: {
    minHeight: 66,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.76)",
    borderWidth: 1,
    borderColor: "rgba(24,33,59,0.08)",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  triggerValue: {
    color: colors.navy,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "900"
  },
  triggerHint: {
    color: colors.mutedText,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 3
  },
  customInput: {
    minHeight: 52,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(24,33,59,0.08)",
    paddingHorizontal: 16,
    color: colors.navy,
    fontSize: 14,
    lineHeight: 18
  },
  scrim: {
    flex: 1,
    backgroundColor: "rgba(24,33,59,0.25)",
    justifyContent: "flex-end",
    padding: 14
  },
  menu: {
    padding: 18,
    gap: 10
  },
  menuTitle: {
    color: colors.navy,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900"
  },
  menuBody: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  option: {
    minHeight: 46,
    borderRadius: 999,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(24,33,59,0.08)"
  },
  optionActive: {
    backgroundColor: colors.navy
  },
  optionText: {
    color: colors.softNavy,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900"
  },
  optionTextActive: {
    color: colors.porcelain
  },
  customOption: {
    minHeight: 46,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.champagne
  },
  customOptionText: {
    color: colors.navy,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900"
  }
});
