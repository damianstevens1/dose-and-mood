import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CalendarDays, ClipboardCheck, List, Pill } from "lucide-react-native";
import { colors, cardStyle, shadow } from "../constants/theme";
import { DailyLog, UserProfile } from "../types";
import { anxietyScore, average, detectInsights, moodScore, recentLogs, severityScore, sleepScore, sortLogs } from "../utils/insights";

type Props = {
  logs: DailyLog[];
  profile: UserProfile;
  isSampleMode: boolean;
  demoLabel?: string;
};

type ViewMode = "list" | "calendar";

export function LogHistory({ logs, profile, isSampleMode, demoLabel }: Props) {
  const [mode, setMode] = useState<ViewMode>("list");
  const sorted = useMemo(() => sortLogs(logs), [logs]);
  const newestFirst = useMemo(() => [...sorted].reverse(), [sorted]);
  const calendarDays = useMemo(() => buildCalendarDays(sorted), [sorted]);
  const latest = newestFirst[0];
  const [selectedDate, setSelectedDate] = useState(latest?.date ?? "");
  const selectedLog = useMemo(
    () => sorted.find((log) => log.date === selectedDate) ?? latest,
    [latest, selectedDate, sorted]
  );
  const insights = useMemo(() => detectInsights(sorted, profile), [sorted, profile]);

  return (
    <View style={styles.shell}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.kicker}>Logbook</Text>
          <Text style={styles.title}>
            {demoLabel ?? (isSampleMode ? "Sample history" : `${sorted.length} logged day${sorted.length === 1 ? "" : "s"}`)}
          </Text>
        </View>
        <View style={styles.segment}>
          <Pressable onPress={() => setMode("list")} style={[styles.segmentItem, mode === "list" && styles.segmentActive]}>
            <List size={15} color={mode === "list" ? colors.porcelain : colors.mutedText} strokeWidth={2.5} />
            <Text style={[styles.segmentText, mode === "list" && styles.segmentTextActive]}>List</Text>
          </Pressable>
          <Pressable onPress={() => setMode("calendar")} style={[styles.segmentItem, mode === "calendar" && styles.segmentActive]}>
            <CalendarDays size={15} color={mode === "calendar" ? colors.porcelain : colors.mutedText} strokeWidth={2.5} />
            <Text style={[styles.segmentText, mode === "calendar" && styles.segmentTextActive]}>Calendar</Text>
          </Pressable>
        </View>
      </View>

      {demoLabel ? (
        <View style={[styles.demoNote, cardStyle]}>
            <Text style={styles.demoText}>
            Example view only: this shows how a month of logs could look. It does not change your saved data.
          </Text>
        </View>
      ) : null}

      {isSampleMode ? (
        <View style={[styles.sampleNote, cardStyle]}>
          <Text style={styles.sampleText}>
            These are demo rows. Once you save a real check-in, trends, logbook, insights, and export switch to your own logs.
          </Text>
        </View>
      ) : null}

      {mode === "list" ? (
        <View style={styles.list}>
          <Text style={styles.rangeText}>
            Showing all {newestFirst.length} logged days, newest first. Tap a row to review that day's details.
          </Text>
          {newestFirst.map((log) => (
            <LogRow
              key={log.id}
              log={log}
              profile={profile}
              selected={selectedLog?.date === log.date}
              onPress={() => setSelectedDate(log.date)}
            />
          ))}
        </View>
      ) : (
        <View style={[styles.calendarCard, cardStyle, shadow.card]}>
          <Text style={styles.rangeText}>{calendarRangeLabel(sorted)}. Tap any logged day to review it.</Text>
          <View style={styles.weekHeader}>
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <Text key={`${day}-${index}`} style={styles.weekText}>
                {day}
              </Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {calendarDays.map((day) => (
              <Pressable
                key={day.iso}
                disabled={!day.log}
                onPress={() => day.log && setSelectedDate(day.log.date)}
                style={[
                  styles.dayCell,
                  day.inMonth ? null : styles.dayCellMuted,
                  day.log?.date === selectedLog?.date && styles.dayCellSelected
                ]}
              >
                <Text style={[styles.dayNumber, day.log && styles.dayNumberLogged]}>{day.date.getDate()}</Text>
                {day.log ? <View style={[styles.moodDot, { backgroundColor: moodColor(day.log.mood) }]} /> : null}
                {day.log?.tookGlp1 === "yes" ? <Text style={styles.doseMark}>D</Text> : null}
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {selectedLog ? <SelectedLogCard log={selectedLog} profile={profile} /> : null}

      <View style={[styles.assessment, cardStyle, shadow.card]}>
        <View style={styles.assessmentHead}>
          <View style={styles.assessmentIcon}>
            <ClipboardCheck size={18} color={colors.success} strokeWidth={2.5} />
          </View>
          <View style={styles.assessmentCopy}>
            <Text style={styles.assessmentTitle}>{demoLabel ? "30-day tracking summary" : "Tracking summary"}</Text>
            <Text style={styles.assessmentBody}>For your own notes or a clinician visit. Timing only, not a diagnosis.</Text>
          </View>
        </View>
        <View style={styles.scoreGrid}>
          <ScorePill label="Mood avg" value={scoreAverage(sorted, "mood")} />
          <ScorePill label="Anxiety avg" value={scoreAverage(sorted, "anxiety")} />
          <ScorePill label="Nausea avg" value={scoreAverage(sorted, "nausea")} />
          <ScorePill label="Sleep avg" value={scoreAverage(sorted, "sleep")} />
        </View>
        {latest ? (
          <Text style={styles.latestLine}>
            Latest: {formatDate(latest.date)} logged {latest.mood} mood, {latest.anxiety} anxiety, {latest.food}, and{" "}
            {latest.nausea} nausea/GI.
          </Text>
        ) : null}
        <Text style={styles.patternLine}>{insights[0].title}: {insights[0].body}</Text>
        {demoLabel ? (
          <Text style={styles.clinicianLine}>
            Clinician discussion note: repeated 1 to 2 day post-dose nausea and lower mood logs, plus low-intake/high-anxiety
            days, may be worth sharing. This does not prove cause.
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function LogRow({
  log,
  profile,
  selected,
  onPress
}: {
  log: DailyLog;
  profile: UserProfile;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.logRow, selected && styles.logRowSelected, cardStyle, shadow.card]}>
      <View style={[styles.dateBadge, { backgroundColor: moodColor(log.mood) }]}>
        <Text style={styles.dateMonth}>{new Date(`${log.date}T12:00:00`).toLocaleDateString("en-US", { month: "short" })}</Text>
        <Text style={styles.dateDay}>{new Date(`${log.date}T12:00:00`).getDate()}</Text>
      </View>
      <View style={styles.logCopy}>
        <View style={styles.logTop}>
          <Text style={styles.logTitle}>{sentenceCase(log.mood)} mood</Text>
          {log.tookGlp1 === "yes" ? (
            <View style={styles.dosePill}>
              <Pill size={12} color={colors.navy} strokeWidth={2.4} />
              <Text style={styles.dosePillText}>Dose logged: {profile.medicationName}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.logMeta}>
          {sentenceCase(log.anxiety)} anxiety / {log.appetite} appetite / {log.sleep} sleep / {log.nausea} GI
        </Text>
        <Text style={styles.logMeta}>
          Food: {log.food}. Substances: {log.substances.length ? log.substances.join(", ") : "none"}.
        </Text>
        {(log.moodContext ?? []).length ? (
          <Text style={styles.logMeta}>Context: {(log.moodContext ?? []).join(", ")}.</Text>
        ) : null}
        {log.note ? <Text style={styles.logNote}>{log.note}</Text> : null}
      </View>
    </Pressable>
  );
}

function SelectedLogCard({ log, profile }: { log: DailyLog; profile: UserProfile }) {
  return (
    <View style={[styles.selectedCard, cardStyle, shadow.card]}>
      <View style={styles.selectedHead}>
        <View style={[styles.selectedMood, { backgroundColor: moodColor(log.mood) }]} />
        <View style={styles.selectedCopy}>
          <Text style={styles.selectedTitle}>{formatLongDate(log.date)}</Text>
          <Text style={styles.selectedSubhead}>{sentenceCase(log.mood)} mood review</Text>
        </View>
      </View>
      <View style={styles.detailGrid}>
        <DetailPill label="Anxiety" value={log.anxiety} />
        <DetailPill label="Appetite" value={log.appetite} />
        <DetailPill label="Food" value={log.food} />
        <DetailPill label="Sleep" value={log.sleep} />
        <DetailPill label="GI" value={log.nausea} />
        <DetailPill label="Thoughts" value={log.concerningThoughts} />
      </View>
      {(log.moodContext ?? []).length ? (
        <Text style={styles.selectedMeta}>Mood context: {(log.moodContext ?? []).join(", ")}.</Text>
      ) : null}
      {log.tookGlp1 === "yes" ? (
        <View style={styles.doseDetail}>
          <Pill size={15} color={colors.navy} strokeWidth={2.5} />
          <Text style={styles.doseDetailText}>
            Dose logged this day: {profile.medicationName} {profile.currentDose}
          </Text>
        </View>
      ) : (
        <Text style={styles.noDoseText}>No GLP-1 dose logged for this day.</Text>
      )}
      <Text style={styles.selectedMeta}>
        Substances: {log.substances.length ? log.substances.join(", ") : "none"}.
      </Text>
      {log.note ? <Text style={styles.selectedNote}>{log.note}</Text> : null}
    </View>
  );
}

function DetailPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailPill}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function ScorePill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.scorePill}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <Text style={styles.scoreValue}>{value}</Text>
    </View>
  );
}

function buildCalendarDays(logs: DailyLog[]) {
  const byDate = new Map(logs.map((log) => [log.date, log]));
  const sorted = sortLogs(logs);
  const first = sorted[0]?.date;
  const latest = sorted[sorted.length - 1]?.date;
  const start = first ? new Date(`${first}T12:00:00`) : new Date();
  const end = latest ? new Date(`${latest}T12:00:00`) : new Date(start);
  start.setDate(start.getDate() - start.getDay());
  end.setDate(end.getDate() + (6 - end.getDay()));
  const totalDays = Math.max(35, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const iso = date.toISOString().slice(0, 10);
    return {
      date,
      iso,
      inMonth: Boolean(byDate.get(iso)),
      log: byDate.get(iso)
    };
  });
}

function calendarRangeLabel(logs: DailyLog[]) {
  const sorted = sortLogs(logs);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  if (!first || !last) {
    return "No logged days yet";
  }

  return `${formatDate(first.date)} to ${formatDate(last.date)} (${sorted.length} logged days)`;
}

function scoreAverage(logs: DailyLog[], type: "mood" | "anxiety" | "nausea" | "sleep") {
  const scoped = recentLogs(logs, Math.min(30, logs.length || 30));
  if (!scoped.length) {
    return "No logs";
  }
  if (type === "mood") {
    return `${average(scoped.map((log) => moodScore[log.mood])).toFixed(1)}/5`;
  }
  if (type === "anxiety") {
    return `${average(scoped.map((log) => anxietyScore[log.anxiety])).toFixed(1)}/4`;
  }
  if (type === "nausea") {
    return `${average(scoped.map((log) => severityScore[log.nausea])).toFixed(1)}/4`;
  }
  return `${average(scoped.map((log) => sleepScore[log.sleep])).toFixed(1)}/3`;
}

function moodColor(mood: DailyLog["mood"]) {
  if (mood === "great" || mood === "good") {
    return colors.sageDeep;
  }
  if (mood === "neutral") {
    return colors.lavenderDeep;
  }
  return colors.roseText;
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatLongDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  });
}

function sentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  shell: {
    gap: 12
  },
  headerRow: {
    gap: 10
  },
  kicker: {
    color: colors.plum,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.navy,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900"
  },
  segment: {
    alignSelf: "stretch",
    minHeight: 40,
    borderRadius: 999,
    padding: 4,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(24,33,59,0.07)"
  },
  segmentItem: {
    flex: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5
  },
  segmentActive: {
    backgroundColor: colors.navy
  },
  segmentText: {
    color: colors.mutedText,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "900"
  },
  segmentTextActive: {
    color: colors.porcelain
  },
  sampleNote: {
    padding: 12
  },
  demoNote: {
    padding: 12,
    backgroundColor: "rgba(243,225,190,0.62)"
  },
  sampleText: {
    color: colors.softNavy,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700"
  },
  demoText: {
    color: colors.navy,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800"
  },
  list: {
    gap: 10
  },
  rangeText: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800"
  },
  logRow: {
    padding: 12,
    flexDirection: "row",
    gap: 12
  },
  logRowSelected: {
    borderColor: "rgba(24,33,59,0.24)",
    backgroundColor: "rgba(255,255,255,0.84)"
  },
  dateBadge: {
    width: 50,
    height: 58,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  dateMonth: {
    color: colors.porcelain,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  dateDay: {
    color: colors.porcelain,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "900"
  },
  logCopy: {
    flex: 1,
    gap: 4
  },
  logTop: {
    minHeight: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  },
  logTitle: {
    color: colors.navy,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "900"
  },
  dosePill: {
    minHeight: 24,
    borderRadius: 999,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.champagne
  },
  dosePillText: {
    color: colors.navy,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "900"
  },
  logMeta: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700"
  },
  logNote: {
    color: colors.softNavy,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2
  },
  calendarCard: {
    padding: 13,
    gap: 8
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  weekText: {
    width: "14.28%",
    textAlign: "center",
    color: colors.mutedText,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "900"
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    position: "relative"
  },
  dayCellSelected: {
    backgroundColor: "rgba(24,33,59,0.08)",
    borderWidth: 1,
    borderColor: "rgba(24,33,59,0.18)"
  },
  dayCellMuted: {
    opacity: 0.45
  },
  dayNumber: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "800"
  },
  dayNumberLogged: {
    color: colors.navy
  },
  moodDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    marginTop: 4
  },
  doseMark: {
    position: "absolute",
    right: 7,
    bottom: 5,
    color: colors.navy,
    fontSize: 9,
    lineHeight: 11,
    fontWeight: "900"
  },
  selectedCard: {
    padding: 15,
    gap: 12
  },
  selectedHead: {
    flexDirection: "row",
    gap: 11,
    alignItems: "center"
  },
  selectedMood: {
    width: 14,
    height: 44,
    borderRadius: 999
  },
  selectedCopy: {
    flex: 1
  },
  selectedTitle: {
    color: colors.navy,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900"
  },
  selectedSubhead: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800",
    marginTop: 2
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  detailPill: {
    flexBasis: "48.6%",
    minHeight: 48,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.62)"
  },
  detailLabel: {
    color: colors.mutedText,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  detailValue: {
    color: colors.navy,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
    marginTop: 2
  },
  doseDetail: {
    minHeight: 42,
    borderRadius: 999,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.champagne
  },
  doseDetailText: {
    flex: 1,
    color: colors.navy,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "900"
  },
  noDoseText: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800"
  },
  selectedMeta: {
    color: colors.softNavy,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800"
  },
  selectedNote: {
    color: colors.softNavy,
    fontSize: 13,
    lineHeight: 19
  },
  assessment: {
    padding: 15,
    gap: 12
  },
  assessmentHead: {
    flexDirection: "row",
    gap: 11
  },
  assessmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.66)"
  },
  assessmentCopy: {
    flex: 1
  },
  assessmentTitle: {
    color: colors.navy,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900"
  },
  assessmentBody: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3
  },
  scoreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  scorePill: {
    flexBasis: "48.6%",
    minHeight: 50,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.6)"
  },
  scoreLabel: {
    color: colors.mutedText,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  scoreValue: {
    color: colors.navy,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
    marginTop: 2
  },
  latestLine: {
    color: colors.softNavy,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700"
  },
  patternLine: {
    color: colors.roseText,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800"
  },
  clinicianLine: {
    color: colors.softNavy,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800"
  }
});
