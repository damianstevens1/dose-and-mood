import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Bell, Clock3, Plus, Trash2 } from "lucide-react-native";
import { colors, cardStyle, shadow } from "../constants/theme";
import { ReminderPreference, ReminderSettings as ReminderSettingsType } from "../types";
import { MoodBubbleSelector } from "./MoodBubbleSelector";
import { lightHaptic } from "../utils/haptics";

type Props = {
  settings: ReminderSettingsType;
  onChange: (settings: ReminderSettingsType) => void;
};

const presets: Record<ReminderPreference, string[]> = {
  "once daily": ["8:30 PM"],
  "twice daily": ["9:00 AM", "8:30 PM"],
  "three times daily": ["9:00 AM", "2:00 PM", "8:30 PM"],
  custom: ["8:30 PM"]
};

export function ReminderSettings({ settings, onChange }: Props) {
  const copy = useMemo(() => {
    if (settings.preference === "once daily") {
      return "Quick check-in?";
    }
    if (settings.preference === "twice daily") {
      return "How are you feeling today?";
    }
    return "Your 30-second mood log is ready.";
  }, [settings.preference]);

  function setPreference(value: ReminderPreference) {
    lightHaptic();
    onChange({
      ...settings,
      preference: value,
      times: value === "custom" ? settings.times : presets[value]
    });
  }

  function updateTime(index: number, value: string) {
    onChange({
      ...settings,
      times: settings.times.map((time, currentIndex) => (currentIndex === index ? value : time))
    });
  }

  function addTime() {
    lightHaptic();
    onChange({
      ...settings,
      preference: "custom",
      times: [...settings.times, "6:00 PM"]
    });
  }

  function removeTime(index: number) {
    lightHaptic();
    onChange({
      ...settings,
      preference: "custom",
      times: settings.times.filter((_, currentIndex) => currentIndex !== index)
    });
  }

  return (
    <View style={styles.shell}>
      <View style={[styles.hero, cardStyle, shadow.card]}>
        <View style={styles.iconBubble}>
          <Bell size={19} color={colors.plum} strokeWidth={2.4} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.title}>Reminder settings</Text>
          <Text style={styles.body}>{copy}</Text>
        </View>
        <Pressable
          onPress={() => onChange({ ...settings, enabled: !settings.enabled })}
          style={[styles.toggle, settings.enabled && styles.toggleActive]}
        >
          <View style={[styles.toggleDot, settings.enabled && styles.toggleDotActive]} />
        </Pressable>
      </View>

      <MoodBubbleSelector
        label="Check-in frequency"
        value={settings.preference}
        options={[
          { value: "once daily", label: "Once daily" },
          { value: "twice daily", label: "Morning + evening" },
          { value: "three times daily", label: "Three times" },
          { value: "custom", label: "Custom" }
        ]}
        onChange={(value) => setPreference(value as ReminderPreference)}
        columns={2}
      />

      <View style={[styles.timesCard, cardStyle]}>
        <Text style={styles.cardTitle}>Times</Text>
        {settings.times.map((time, index) => (
          <View key={`${time}-${index}`} style={styles.timeRow}>
            <Clock3 size={17} color={colors.plum} strokeWidth={2.4} />
            <TextInput value={time} onChangeText={(value) => updateTime(index, value)} style={styles.timeInput} />
            <Pressable onPress={() => removeTime(index)} style={styles.iconButton}>
              <Trash2 size={16} color={colors.roseText} strokeWidth={2.4} />
            </Pressable>
          </View>
        ))}
        <Pressable onPress={addTime} style={styles.addButton}>
          <Plus size={17} color={colors.navy} strokeWidth={2.5} />
          <Text style={styles.addText}>Add custom time</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    gap: 16
  },
  hero: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  iconBubble: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.66)"
  },
  heroCopy: {
    flex: 1
  },
  title: {
    color: colors.navy,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900"
  },
  body: {
    color: colors.mutedText,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2
  },
  toggle: {
    width: 54,
    height: 32,
    borderRadius: 999,
    padding: 3,
    backgroundColor: "rgba(24,33,59,0.12)",
    justifyContent: "center"
  },
  toggleActive: {
    backgroundColor: colors.navy
  },
  toggleDot: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: colors.porcelain
  },
  toggleDotActive: {
    alignSelf: "flex-end"
  },
  timesCard: {
    padding: 15,
    gap: 10
  },
  cardTitle: {
    color: colors.navy,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900"
  },
  timeRow: {
    minHeight: 50,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.66)",
    borderWidth: 1,
    borderColor: "rgba(24,33,59,0.06)"
  },
  timeInput: {
    flex: 1,
    color: colors.navy,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "800"
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.72)"
  },
  addButton: {
    minHeight: 46,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: colors.champagne
  },
  addText: {
    color: colors.navy,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900"
  }
});
