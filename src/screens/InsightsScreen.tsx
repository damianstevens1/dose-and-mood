import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ShieldCheck } from "lucide-react-native";
import { colors, gradients, cardStyle, shadow } from "../constants/theme";
import { InsightCards } from "../components/InsightCards";
import { DailyLog, UserProfile } from "../types";
import { detectInsights } from "../utils/insights";

type Props = {
  profile: UserProfile;
  logs: DailyLog[];
};

export function InsightsScreen({ profile, logs }: Props) {
  const insights = useMemo(() => detectInsights(logs, profile), [logs, profile]);

  return (
    <View style={styles.shell}>
      <LinearGradient colors={gradients.sage} style={[styles.hero, shadow.card]}>
        <Text style={styles.kicker}>Possible patterns</Text>
        <Text style={styles.title}>Signals, not conclusions</Text>
        <Text style={styles.body}>
          FDA has not found evidence of increased suicide risk with GLP-1 receptor agonists. Case reports can be safety
          signals, but they do not prove cause. Tracking changes can make clinician conversations easier.
        </Text>
      </LinearGradient>

      <InsightCards insights={insights} />

      <View style={[styles.safetyCard, cardStyle]}>
        <ShieldCheck size={19} color={colors.success} strokeWidth={2.4} />
        <View style={styles.safetyCopy}>
          <Text style={styles.safetyTitle}>Gentle guardrails</Text>
          <Text style={styles.safetyText}>
            Insights use "possible pattern" and "worth discussing" language. Dose & Mood never diagnoses, proves cause, or
            recommends medication changes.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    gap: 14
  },
  hero: {
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.74)"
  },
  kicker: {
    color: colors.success,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.navy,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    marginTop: 5
  },
  body: {
    color: colors.softNavy,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8
  },
  safetyCard: {
    padding: 15,
    flexDirection: "row",
    gap: 12
  },
  safetyCopy: {
    flex: 1
  },
  safetyTitle: {
    color: colors.navy,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900"
  },
  safetyText: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4
  }
});
