import React, { useMemo, useState } from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import { Clipboard, Download, FileText, Send } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradients, cardStyle, shadow } from "../constants/theme";
import { DailyLog, UserProfile } from "../types";
import { average, detectInsights, moodScore, recentLogs, severityScore, sleepScore, sortLogs } from "../utils/insights";

type Props = {
  profile: UserProfile;
  logs: DailyLog[];
};

type Period = "7" | "30" | "dose";

export function ExportSummary({ profile, logs }: Props) {
  const [period, setPeriod] = useState<Period>("7");
  const selectedLogs = useMemo(() => {
    if (period === "7") {
      return recentLogs(logs, 7);
    }
    if (period === "30") {
      return recentLogs(logs, 30);
    }
    if (profile.lastDoseChangeDate) {
      const sorted = sortLogs(logs);
      const sinceChange = sorted.filter((log) => log.date >= profile.lastDoseChangeDate!);
      return sinceChange.length ? sinceChange : recentLogs(logs, 7);
    }
    const sorted = sortLogs(logs);
    const lastDoseIndex = [...sorted].reverse().findIndex((log) => log.tookGlp1 === "yes");
    if (lastDoseIndex < 0) {
      return recentLogs(logs, 7);
    }
    return sorted.slice(sorted.length - lastDoseIndex - 1);
  }, [logs, period, profile.lastDoseChangeDate]);

  const insights = useMemo(() => detectInsights(selectedLogs, profile), [selectedLogs, profile]);
  const summary = useMemo(() => buildSummary(profile, selectedLogs, insights.map((insight) => insight.title)), [
    profile,
    selectedLogs,
    insights
  ]);

  async function shareSummary() {
    await Share.share({ message: summary });
  }

  return (
    <View style={styles.shell}>
      <LinearGradient colors={gradients.lavender} style={[styles.hero, shadow.card]}>
        <View style={styles.heroIcon}>
          <FileText size={20} color={colors.plum} strokeWidth={2.5} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.title}>Clinician-friendly tracking summary</Text>
          <Text style={styles.body}>A PDF-ready pattern summary you choose to share. It does not diagnose or prove cause.</Text>
        </View>
      </LinearGradient>

      <View style={styles.segment}>
        {[
          { key: "7", label: "7 days" },
          { key: "30", label: "30 days" },
          { key: "dose", label: "Since change" }
        ].map((item) => {
          const active = period === item.key;
          return (
            <Pressable key={item.key} onPress={() => setPeriod(item.key as Period)} style={[styles.segmentItem, active && styles.segmentActive]}>
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.summaryCard, cardStyle, shadow.card]}>
        <Text style={styles.cardKicker}>Dose & Mood summary</Text>
        <Text style={styles.cardTitle}>{profile.nickname || "User"}'s tracking snapshot</Text>
        <View style={styles.summaryRows}>
          <SummaryRow label="Medication" value={`${profile.medicationName}, ${profile.currentDose}`} />
          <SummaryRow label="Dose day" value={profile.doseDay} />
          <SummaryRow label="Medication start" value={profile.medicationStartDate || "Not listed"} />
          <SummaryRow label="Last dose change" value={profile.lastDoseChangeDate || "Not listed"} />
          <SummaryRow label="Baseline" value={profile.mentalBaseline || "Not listed"} />
          <SummaryRow label="Care support" value={profile.careSupport || "Not listed"} />
          <SummaryRow label="Logs included" value={`${selectedLogs.length}`} />
          <SummaryRow label="Mood trend" value={trendAverage(selectedLogs, "mood")} />
          <SummaryRow label="Nausea / GI" value={trendAverage(selectedLogs, "nausea")} />
          <SummaryRow label="Sleep" value={trendAverage(selectedLogs, "sleep")} />
          <SummaryRow label="Mood context" value={summarizeMoodContext(selectedLogs)} />
          <SummaryRow label="Substances" value={summarizeSubstances(selectedLogs)} />
        </View>

        <View style={styles.patternBlock}>
          <Text style={styles.patternTitle}>Possible patterns to discuss</Text>
          {insights.slice(0, 3).map((insight) => (
            <Text key={insight.id} style={styles.patternText}>
              {insight.title}: {insight.body}
            </Text>
          ))}
          <Text style={styles.safetyText}>
            Not a diagnosis. Not medical advice. Timing and patterns do not prove medication caused a symptom.
          </Text>
        </View>

        <View style={styles.notesBlock}>
          <Text style={styles.patternTitle}>Recent notes</Text>
          {selectedLogs
            .filter((log) => log.note.trim().length)
            .slice(-3)
            .map((log) => (
              <Text key={log.id} style={styles.noteText}>
                {log.date}: {log.note}
              </Text>
            ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryAction} onPress={shareSummary}>
          <Send size={17} color={colors.porcelain} strokeWidth={2.5} />
          <Text style={styles.primaryActionText}>Share summary</Text>
        </Pressable>
        <Pressable style={styles.secondaryAction} onPress={shareSummary}>
          <Download size={17} color={colors.navy} strokeWidth={2.5} />
          <Text style={styles.secondaryActionText}>PDF-ready preview</Text>
        </Pressable>
        <View style={styles.hintRow}>
          <Clipboard size={15} color={colors.mutedText} strokeWidth={2.4} />
          <Text style={styles.hintText}>MVP export uses the native share sheet. PDF generation is ready for the next build.</Text>
        </View>
      </View>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function trendAverage(logs: DailyLog[], type: "mood" | "nausea" | "sleep") {
  if (!logs.length) {
    return "No logs yet";
  }
  if (type === "mood") {
    return `${average(logs.map((log) => moodScore[log.mood])).toFixed(1)} / 5`;
  }
  if (type === "nausea") {
    return `${average(logs.map((log) => severityScore[log.nausea])).toFixed(1)} / 4`;
  }
  return `${average(logs.map((log) => sleepScore[log.sleep])).toFixed(1)} / 3`;
}

function summarizeSubstances(logs: DailyLog[]) {
  const counts = new Map<string, number>();
  logs.forEach((log) => {
    log.substances.forEach((item) => counts.set(item, (counts.get(item) ?? 0) + 1));
  });
  if (!counts.size) {
    return "None logged";
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => `${name} ${count}x`)
    .join(", ");
}

function summarizeMoodContext(logs: DailyLog[]) {
  const counts = new Map<string, number>();
  logs.forEach((log) => {
    (log.moodContext ?? []).forEach((item) => counts.set(item, (counts.get(item) ?? 0) + 1));
  });
  if (!counts.size) {
    return "None logged";
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => `${name} ${count}x`)
    .join(", ");
}

function buildSummary(profile: UserProfile, logs: DailyLog[], patterns: string[]) {
  const latest = sortLogs(logs).slice(-1)[0];
  return [
    "Dose & Mood clinician tracking summary",
    `Name: ${profile.nickname || "Not provided"}`,
    `Medication: ${profile.medicationName} ${profile.currentDose}`,
    `Dose day: ${profile.doseDay}`,
    `Medication start: ${profile.medicationStartDate || "Not listed"}`,
    `Last dose change: ${profile.lastDoseChangeDate || "Not listed"}`,
    `Baseline: ${profile.mentalBaseline || "Not listed"}`,
    `Mental health history: ${profile.mentalHealthHistory || "Not listed"}`,
    `Care support: ${profile.careSupport || "Not listed"}`,
    `Recent stress context: ${profile.recentStress || "Not listed"}`,
    `Logs included: ${logs.length}`,
    `Latest mood: ${latest?.mood ?? "No logs"}`,
    `Latest anxiety: ${latest?.anxiety ?? "No logs"}`,
    `Latest nausea/GI: ${latest?.nausea ?? "No logs"}`,
    `Mood context: ${summarizeMoodContext(logs)}`,
    `Possible patterns: ${patterns.join("; ")}`,
    "This is a personal tracking tool, not medical advice. Timing and patterns do not prove cause."
  ].join("\n");
}

const styles = StyleSheet.create({
  shell: {
    gap: 14
  },
  hero: {
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.74)"
  },
  heroIcon: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.7)"
  },
  heroCopy: {
    flex: 1
  },
  title: {
    color: colors.navy,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "900"
  },
  body: {
    color: colors.softNavy,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3
  },
  segment: {
    minHeight: 50,
    borderRadius: 999,
    flexDirection: "row",
    padding: 5,
    backgroundColor: "rgba(255,255,255,0.68)",
    borderWidth: 1,
    borderColor: "rgba(24,33,59,0.07)"
  },
  segmentItem: {
    flex: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center"
  },
  segmentActive: {
    backgroundColor: colors.navy
  },
  segmentText: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900"
  },
  segmentTextActive: {
    color: colors.porcelain
  },
  summaryCard: {
    padding: 16
  },
  cardKicker: {
    color: colors.plum,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  cardTitle: {
    color: colors.navy,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "900",
    marginTop: 5,
    marginBottom: 13
  },
  summaryRows: {
    gap: 8
  },
  summaryRow: {
    minHeight: 38,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.58)"
  },
  summaryLabel: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800"
  },
  summaryValue: {
    flex: 1,
    color: colors.navy,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
    textAlign: "right"
  },
  patternBlock: {
    marginTop: 14,
    gap: 6
  },
  patternTitle: {
    color: colors.navy,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900"
  },
  patternText: {
    color: colors.softNavy,
    fontSize: 12,
    lineHeight: 18
  },
  safetyText: {
    color: colors.roseText,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800",
    marginTop: 3
  },
  notesBlock: {
    marginTop: 14,
    gap: 6
  },
  noteText: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 17
  },
  actions: {
    gap: 9
  },
  primaryAction: {
    minHeight: 52,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.navy
  },
  primaryActionText: {
    color: colors.porcelain,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "900"
  },
  secondaryAction: {
    minHeight: 52,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.champagne
  },
  secondaryActionText: {
    color: colors.navy,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900"
  },
  hintRow: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    paddingHorizontal: 4
  },
  hintText: {
    flex: 1,
    color: colors.mutedText,
    fontSize: 11,
    lineHeight: 16
  }
});
