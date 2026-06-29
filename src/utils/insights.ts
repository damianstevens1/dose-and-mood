import { DailyLog, Insight, UserProfile } from "../types";

export const moodScore = {
  "very low": 1,
  low: 2,
  neutral: 3,
  good: 4,
  great: 5
};

export const anxietyScore = {
  none: 1,
  mild: 2,
  medium: 3,
  high: 4
};

export const severityScore = {
  none: 1,
  mild: 2,
  medium: 3,
  severe: 4
};

export const sleepScore = {
  poor: 1,
  okay: 2,
  good: 3
};

export const appetiteScore = {
  none: 1,
  low: 2,
  normal: 3,
  high: 4
};

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function sortLogs(logs: DailyLog[]) {
  return [...logs].sort((a, b) => a.date.localeCompare(b.date));
}

export function recentLogs(logs: DailyLog[], count = 7) {
  return sortLogs(logs).slice(-count);
}

export function average(values: number[]) {
  if (!values.length) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function formatScore(value: number, max: number) {
  if (!value) {
    return "No logs yet";
  }
  return `${value.toFixed(1)} / ${max}`;
}

export function dayOffsetFromDose(date: string, doseDay: string) {
  const dayIndex = weekdays.indexOf(doseDay);
  const current = new Date(`${date}T12:00:00`);
  if (dayIndex < 0) {
    return 0;
  }
  const diff = (current.getDay() - dayIndex + 7) % 7;
  return diff;
}

export function detectInsights(logs: DailyLog[], profile: UserProfile): Insight[] {
  const sorted = sortLogs(logs);
  const last14 = sorted.slice(-14);
  const last7 = sorted.slice(-7);
  const insights: Insight[] = [];

  const afterDose = last14.filter((log) => {
    const offset = dayOffsetFromDose(log.date, profile.doseDay);
    return offset >= 1 && offset <= 2;
  });
  const afterDoseLowMood = afterDose.filter((log) => moodScore[log.mood] <= 2 && severityScore[log.nausea] >= 3);
  const concerningThoughtLogs = last14.filter((log) => log.concerningThoughts === "yes" || log.concerningThoughts === "maybe");
  const lowInterestOrFlat = last14.filter((log) =>
    (log.moodContext ?? []).some((item) => item === "less interest" || item === "emotionally flat")
  );
  const bodyImageOrIrritable = last14.filter((log) =>
    (log.moodContext ?? []).some((item) => item === "body image sensitive" || item === "irritable")
  );

  if (concerningThoughtLogs.some((log) => log.concerningThoughts === "yes")) {
    insights.push({
      id: "support-signal",
      title: "Support signal logged",
      body: "You logged concerning thoughts at least once in the recent window.",
      detail: "You are not alone. Consider contacting a clinician or trusted person. If this feels urgent, use 988 or emergency support now.",
      tone: "support"
    });
  }

  if (afterDoseLowMood.length >= 2) {
    insights.push({
      id: "dose-window",
      title: "Possible pattern after dose day",
      body: "You logged lower mood and higher nausea within 1 to 2 days after dose day more than once.",
      detail: "Worth sharing with your prescriber. This is not a diagnosis or a dose recommendation.",
      tone: "watch"
    });
  }

  if (lowInterestOrFlat.length >= 2) {
    insights.push({
      id: "interest-flatness",
      title: "Interest or emotional flatness repeated",
      body: "Less interest or emotional flatness was logged more than once recently.",
      detail: "Worth sharing as timing context with a clinician. This does not prove what caused it.",
      tone: "watch"
    });
  }

  if (bodyImageOrIrritable.length >= 2) {
    insights.push({
      id: "body-image-irritability",
      title: "Body-image sensitivity or irritability repeated",
      body: "Some recent logs included body-image sensitivity or irritability.",
      detail: "This can be useful context alongside sleep, food intake, stress, and medication timing.",
      tone: "calm"
    });
  }

  const lowFoodAnxiety = last7.filter(
    (log) => (log.food === "barely ate" || log.appetite === "none" || log.appetite === "low") && anxietyScore[log.anxiety] >= 3
  );

  if (lowFoodAnxiety.length >= 2) {
    insights.push({
      id: "food-anxiety",
      title: "Low intake and anxiety showed up together",
      body: "On a few days, lower food intake appeared near medium or high anxiety logs.",
      detail: "A gentle note to discuss nutrition, hydration, and medication routines with a clinician.",
      tone: "calm"
    });
  }

  const poorSleepLowMood = last7.filter((log) => sleepScore[log.sleep] === 1 && moodScore[log.mood] <= 2);

  if (poorSleepLowMood.length >= 1) {
    insights.push({
      id: "sleep-mood",
      title: "Sleep may be part of the picture",
      body: "Poor sleep appeared near at least one lower mood log this week.",
      detail: "This may be worth noting alongside stress, meals, dose timing, and side effects.",
      tone: "calm"
    });
  }

  const substanceChanges = last14.filter(
    (log) => log.substances.some((item) => item === "alcohol" || item === "cannabis" || item === "nicotine") && anxietyScore[log.anxiety] >= 3
  );

  if (substanceChanges.length >= 1) {
    insights.push({
      id: "substances",
      title: "Substances and anxiety are worth watching",
      body: "Some tracked substance use appeared near higher anxiety logs.",
      detail: "Possible pattern only. Share it if it feels relevant to your care team.",
      tone: "watch"
    });
  }

  const nauseaLowEnergy = last7.filter(
    (log) => severityScore[log.nausea] >= 3 && (log.energy === "low" || log.appetite === "none" || log.appetite === "low")
  );

  if (nauseaLowEnergy.length >= 2) {
    insights.push({
      id: "nausea-energy",
      title: "Nausea, appetite, and fatigue clustered",
      body: "Higher nausea appeared with lower appetite or energy more than once.",
      detail: "This can be useful context for a clinician visit or message.",
      tone: "support"
    });
  }

  if (!insights.length) {
    insights.push({
      id: "steady",
      title: "No strong pattern yet",
      body: "Your recent logs do not show a repeated pattern that stands out.",
      detail: "Keep logging gently. A few more days can make trends easier to discuss.",
      tone: "calm"
    });
  }

  return insights.slice(0, 5);
}

export function trendValues(logs: DailyLog[], type: "mood" | "anxiety" | "sleep" | "nausea" | "appetite") {
  return recentLogs(logs, 7).map((log) => {
    if (type === "mood") {
      return moodScore[log.mood];
    }
    if (type === "anxiety") {
      return anxietyScore[log.anxiety];
    }
    if (type === "sleep") {
      return sleepScore[log.sleep];
    }
    if (type === "nausea") {
      return severityScore[log.nausea];
    }
    return appetiteScore[log.appetite];
  });
}

export function trendLabel(logs: DailyLog[], type: "mood" | "anxiety" | "sleep" | "nausea" | "appetite") {
  const values = trendValues(logs, type);
  const latest = values[values.length - 1] ?? 0;
  const prior = values.length > 1 ? average(values.slice(0, -1)) : latest;
  const delta = latest - prior;

  if (Math.abs(delta) < 0.35) {
    return "steady";
  }
  if (type === "anxiety" || type === "nausea") {
    return delta > 0 ? "higher today" : "easier today";
  }
  return delta > 0 ? "brighter today" : "lower today";
}
