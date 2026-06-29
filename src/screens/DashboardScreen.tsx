import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Polyline } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { Activity, CalendarDays, Moon, Pill, Utensils } from "lucide-react-native";
import { colors, gradients, cardStyle, shadow } from "../constants/theme";
import { DailyLog, UserProfile } from "../types";
import {
  average,
  detectInsights,
  formatScore,
  moodScore,
  recentLogs,
  severityScore,
  sleepScore,
  trendLabel,
  trendValues
} from "../utils/insights";
import { LogHistory } from "../components/LogHistory";

type Props = {
  profile: UserProfile;
  logs: DailyLog[];
  isSampleMode: boolean;
  demoLabel?: string;
  onLogToday: () => void;
};

export function DashboardScreen({ profile, logs, isSampleMode, demoLabel, onLogToday }: Props) {
  const last7 = recentLogs(logs, 7);
  const today = logs.find((log) => log.date === new Date().toISOString().slice(0, 10));
  const insights = useMemo(() => detectInsights(logs, profile), [logs, profile]);
  const moodAverage = average(last7.map((log) => moodScore[log.mood]));
  const nauseaAverage = average(last7.map((log) => severityScore[log.nausea]));
  const sleepAverage = average(last7.map((log) => sleepScore[log.sleep]));

  return (
    <View style={styles.shell}>
      <LinearGradient colors={gradients.hero} style={[styles.todayCard, shadow.card]}>
        <View style={styles.todayHeader}>
          <View>
            <Text style={styles.kicker}>Today's mood card</Text>
            <Text style={styles.todayTitle}>{today ? sentenceCase(today.mood) : "Not logged yet"}</Text>
          </View>
          <Pressable onPress={onLogToday} style={styles.logButton}>
            <Text style={styles.logButtonText}>{today ? "Edit log" : "Log now"}</Text>
          </Pressable>
        </View>
        <Text style={styles.todayBody}>
          {today
            ? `${sentenceCase(today.anxiety)} anxiety, ${today.appetite} appetite, ${today.nausea} nausea/GI.`
            : "Your sample dashboard is ready. Add today's log when you want a fresh trend."}
        </Text>
      </LinearGradient>

      <View style={styles.grid}>
        <TrendCard title="Mood" value={formatScore(moodAverage, 5)} label={trendLabel(logs, "mood")} values={trendValues(logs, "mood")} color={colors.plum} />
        <TrendCard title="Anxiety" value={trendLabel(logs, "anxiety")} label="weekly signal" values={trendValues(logs, "anxiety")} color={colors.roseText} />
        <TrendCard title="Appetite" value={trendLabel(logs, "appetite")} label="food context" values={trendValues(logs, "appetite")} color={colors.sageDeep} />
        <TrendCard title="Sleep" value={formatScore(sleepAverage, 3)} label={trendLabel(logs, "sleep")} values={trendValues(logs, "sleep")} color={colors.lavenderDeep} />
      </View>

      <View style={[styles.doseCard, cardStyle, shadow.card]}>
        <View style={styles.doseIcon}>
          <Pill size={19} color={colors.plum} strokeWidth={2.5} />
        </View>
        <View style={styles.doseCopy}>
          <Text style={styles.cardTitle}>{profile.medicationName} routine</Text>
          <Text style={styles.cardBody}>
            {profile.currentDose} logged with {profile.doseDay} as dose day. This tracker never recommends dose changes.
          </Text>
        </View>
      </View>

      <View style={styles.metricRow}>
        <MiniMetric Icon={Utensils} label="Food trend" value={foodSummary(last7)} />
        <MiniMetric Icon={Activity} label="Side effects" value={`GI ${nauseaAverage.toFixed(1)} / 4`} />
        <MiniMetric Icon={Moon} label="Sleep" value={`${sleepAverage.toFixed(1)} / 3`} />
        <MiniMetric Icon={CalendarDays} label="Dose marker" value={profile.doseDay.slice(0, 3)} />
      </View>

      <View style={[styles.patternCard, cardStyle, shadow.card]}>
        <Text style={styles.cardTitle}>Patterns to discuss with your clinician</Text>
        <Text style={styles.cardBody}>{insights[0].body}</Text>
        <Text style={styles.safeLine}>Possible pattern only. Not a diagnosis, cause claim, or dose recommendation.</Text>
      </View>

      <LogHistory profile={profile} logs={logs} isSampleMode={isSampleMode} demoLabel={demoLabel} />
    </View>
  );
}

function TrendCard({
  title,
  value,
  label,
  values,
  color
}: {
  title: string;
  value: string;
  label: string;
  values: number[];
  color: string;
}) {
  return (
    <View style={[styles.trendCard, cardStyle, shadow.card]}>
      <View style={styles.trendHeader}>
        <Text style={styles.trendTitle}>{title}</Text>
        <Text style={styles.trendValue}>{value}</Text>
      </View>
      <Sparkline values={values} color={color} />
      <Text style={styles.trendLabel}>{label}</Text>
    </View>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const width = 132;
  const height = 46;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 1);
  const range = Math.max(max - min, 1);
  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 12) - 6;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <Polyline points={points} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((value, index) => {
        const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
        const y = height - ((value - min) / range) * (height - 12) - 6;
        return <Circle key={`${value}-${index}`} cx={x} cy={y} r="3.5" fill={colors.porcelain} stroke={color} strokeWidth="2" />;
      })}
    </Svg>
  );
}

function MiniMetric({
  Icon,
  label,
  value
}: {
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <View style={[styles.miniMetric, cardStyle]}>
      <Icon size={18} color={colors.plum} strokeWidth={2.4} />
      <Text style={styles.miniLabel}>{label}</Text>
      <Text style={styles.miniValue}>{value}</Text>
    </View>
  );
}

function foodSummary(logs: DailyLog[]) {
  const balanced = logs.filter((log) => log.food === "balanced").length;
  const light = logs.filter((log) => log.food === "light meal" || log.food === "barely ate").length;
  if (balanced >= light) {
    return "more balanced";
  }
  return "lighter intake";
}

function sentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  shell: {
    gap: 14
  },
  todayCard: {
    borderRadius: 8,
    padding: 17,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.74)"
  },
  todayHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12
  },
  kicker: {
    color: colors.plum,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  todayTitle: {
    color: colors.navy,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    marginTop: 4
  },
  todayBody: {
    color: colors.softNavy,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10
  },
  logButton: {
    minHeight: 40,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.navy
  },
  logButtonText: {
    color: colors.porcelain,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  trendCard: {
    flexBasis: "48.6%",
    padding: 13,
    minHeight: 150
  },
  trendHeader: {
    minHeight: 48
  },
  trendTitle: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900"
  },
  trendValue: {
    color: colors.navy,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
    marginTop: 2
  },
  trendLabel: {
    color: colors.mutedText,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
    marginTop: 6
  },
  doseCard: {
    padding: 15,
    flexDirection: "row",
    gap: 12
  },
  doseIcon: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.champagne
  },
  doseCopy: {
    flex: 1
  },
  cardTitle: {
    color: colors.navy,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900"
  },
  cardBody: {
    color: colors.softNavy,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4
  },
  metricRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9
  },
  miniMetric: {
    flexBasis: "48.7%",
    padding: 13,
    minHeight: 96,
    gap: 5
  },
  miniLabel: {
    color: colors.mutedText,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "900"
  },
  miniValue: {
    color: colors.navy,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900"
  },
  patternCard: {
    padding: 15
  },
  safeLine: {
    color: colors.roseText,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800",
    marginTop: 8
  }
});
