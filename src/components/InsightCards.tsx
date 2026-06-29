import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AlertCircle, HeartHandshake, Sparkles } from "lucide-react-native";
import { colors, cardStyle, shadow } from "../constants/theme";
import { Insight } from "../types";

type Props = {
  insights: Insight[];
};

export function InsightCards({ insights }: Props) {
  return (
    <View style={styles.list}>
      {insights.map((insight) => {
        const Icon = insight.tone === "watch" ? AlertCircle : insight.tone === "support" ? HeartHandshake : Sparkles;
        const iconColor = insight.tone === "watch" ? colors.warning : insight.tone === "support" ? colors.success : colors.plum;
        return (
          <View key={insight.id} style={[styles.card, cardStyle, shadow.card]}>
            <View style={styles.iconBubble}>
              <Icon size={18} color={iconColor} strokeWidth={2.4} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>{insight.title}</Text>
              <Text style={styles.body}>{insight.body}</Text>
              <Text style={styles.detail}>{insight.detail}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12
  },
  card: {
    padding: 15,
    flexDirection: "row",
    gap: 12
  },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.62)",
    borderWidth: 1,
    borderColor: "rgba(24,33,59,0.06)"
  },
  copy: {
    flex: 1,
    gap: 5
  },
  title: {
    color: colors.navy,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900"
  },
  body: {
    color: colors.softNavy,
    fontSize: 13,
    lineHeight: 19
  },
  detail: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700"
  }
});
