import { DailyLog, ReminderSettings, UserProfile } from "../types";

export const loggerStarterProfile: UserProfile = {
  nickname: "",
  ageRange: "",
  gender: "",
  medicationName: "",
  currentDose: "",
  doseDay: "",
  goal: "",
  reminderPreference: "once daily",
  mentalBaseline: "",
  mentalHealthHistory: "",
  careSupport: "",
  recentStress: "",
  prescriptionMeds: false,
  prescriptionList: "",
  substancesToTrack: [],
  crisisCountry: "United States - 988",
  medicationStartDate: "",
  lastDoseChangeDate: "",
  medicationTimelineNotes: "",
  trustedContact: {
    name: "",
    phone: ""
  }
};

export const defaultProfile: UserProfile = {
  nickname: "Maya",
  ageRange: "40-49",
  gender: "Woman",
  medicationName: "Wegovy",
  currentDose: "1.0 mg",
  doseDay: "Tuesday",
  goal: "Weight loss",
  reminderPreference: "once daily",
  mentalBaseline: "okay",
  mentalHealthHistory: "Prefer not to say",
  careSupport: "Primary care clinician",
  recentStress: "Work or family stress",
  prescriptionMeds: true,
  prescriptionList: "",
  substancesToTrack: ["caffeine", "alcohol"],
  crisisCountry: "United States - 988",
  medicationStartDate: "",
  lastDoseChangeDate: "",
  medicationTimelineNotes: "",
  trustedContact: {
    name: "",
    phone: ""
  }
};

export const defaultReminderSettings: ReminderSettings = {
  preference: "once daily",
  times: ["8:30 PM"],
  enabled: true
};

export const summerDemoProfile: UserProfile = {
  nickname: "Summer",
  ageRange: "40-49",
  gender: "Woman",
  medicationName: "Zepbound",
  currentDose: "5 mg",
  doseDay: "Monday",
  goal: "Weight loss",
  reminderPreference: "twice daily",
  mentalBaseline: "stressed",
  mentalHealthHistory: "Anxiety or depression history",
  careSupport: "Therapist or psychiatrist",
  recentStress: "Body changes and family workload",
  prescriptionMeds: true,
  prescriptionList: "Blood pressure medication, SSRI",
  substancesToTrack: ["caffeine", "alcohol", "cannabis"],
  crisisCountry: "United States - 988",
  medicationStartDate: "2026-04-20",
  lastDoseChangeDate: "2026-06-01",
  medicationTimelineNotes: "Switched to 5 mg after a clinician visit. Tracking timing only.",
  trustedContact: {
    name: "Jordan",
    phone: ""
  }
};

const sampleRows: Array<Omit<DailyLog, "id" | "date" | "source">> = [
  {
    mood: "good",
    anxiety: "mild",
    energy: "good",
    appetite: "normal",
    food: "balanced",
    nausea: "none",
    sleep: "good",
    tookGlp1: "not dose day",
    substances: ["caffeine"],
    moodContext: ["more confident"],
    concerningThoughts: "no",
    note: "Felt steady after a walk and a full lunch."
  },
  {
    mood: "neutral",
    anxiety: "mild",
    energy: "okay",
    appetite: "low",
    food: "light meal",
    nausea: "mild",
    sleep: "okay",
    tookGlp1: "yes",
    substances: ["caffeine"],
    moodContext: [],
    concerningThoughts: "no",
    note: "Dose day. Gentle nausea in the evening."
  },
  {
    mood: "low",
    anxiety: "medium",
    energy: "low",
    appetite: "none",
    food: "barely ate",
    nausea: "medium",
    sleep: "poor",
    tookGlp1: "not dose day",
    substances: ["caffeine"],
    moodContext: ["less interest", "body image sensitive"],
    concerningThoughts: "maybe",
    note: "Low food intake and a stressful work call."
  },
  {
    mood: "low",
    anxiety: "medium",
    energy: "low",
    appetite: "low",
    food: "light meal",
    nausea: "medium",
    sleep: "okay",
    tookGlp1: "not dose day",
    substances: [],
    moodContext: ["emotionally flat"],
    concerningThoughts: "no",
    note: "Nausea eased by bedtime."
  },
  {
    mood: "neutral",
    anxiety: "mild",
    energy: "okay",
    appetite: "normal",
    food: "balanced",
    nausea: "mild",
    sleep: "good",
    tookGlp1: "not dose day",
    substances: ["caffeine"],
    moodContext: [],
    concerningThoughts: "no",
    note: "More stable after eating earlier."
  },
  {
    mood: "good",
    anxiety: "none",
    energy: "good",
    appetite: "normal",
    food: "balanced",
    nausea: "none",
    sleep: "good",
    tookGlp1: "not dose day",
    substances: ["alcohol"],
    moodContext: ["more confident"],
    concerningThoughts: "no",
    note: "Dinner out, one glass of wine."
  },
  {
    mood: "great",
    anxiety: "none",
    energy: "good",
    appetite: "normal",
    food: "balanced",
    nausea: "none",
    sleep: "good",
    tookGlp1: "not dose day",
    substances: ["caffeine"],
    moodContext: ["more confident"],
    concerningThoughts: "no",
    note: "Confident and rested."
  }
];

export function buildSampleLogs(doseDay: string): DailyLog[] {
  const today = new Date();
  const rows: DailyLog[] = [];

  for (let i = 13; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const iso = date.toISOString().slice(0, 10);
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    const template = sampleRows[(13 - i) % sampleRows.length];

    rows.push({
      ...template,
      id: `sample-${iso}`,
      source: "sample",
      date: iso,
      tookGlp1: weekday === doseDay ? "yes" : template.tookGlp1 === "yes" ? "not dose day" : template.tookGlp1
    });
  }

  return rows;
}

const summerMonthTemplates: Array<Omit<DailyLog, "id" | "date" | "source" | "tookGlp1">> = [
  {
    mood: "good",
    anxiety: "mild",
    energy: "good",
    appetite: "normal",
    food: "balanced",
    nausea: "none",
    sleep: "good",
    substances: ["caffeine"],
    moodContext: ["more confident"],
    concerningThoughts: "no",
    note: "Started the month feeling organized. Packed lunch helped."
  },
  {
    mood: "neutral",
    anxiety: "mild",
    energy: "okay",
    appetite: "low",
    food: "light meal",
    nausea: "mild",
    sleep: "okay",
    substances: ["caffeine"],
    moodContext: [],
    concerningThoughts: "no",
    note: "Dose day. Appetite dipped by dinner."
  },
  {
    mood: "low",
    anxiety: "medium",
    energy: "low",
    appetite: "none",
    food: "barely ate",
    nausea: "medium",
    sleep: "poor",
    substances: ["caffeine"],
    moodContext: ["less interest", "body image sensitive"],
    concerningThoughts: "maybe",
    note: "Nausea and low food made the afternoon feel harder."
  },
  {
    mood: "low",
    anxiety: "medium",
    energy: "low",
    appetite: "low",
    food: "light meal",
    nausea: "medium",
    sleep: "okay",
    substances: [],
    moodContext: ["emotionally flat"],
    concerningThoughts: "no",
    note: "Still queasy. Wanted to note this for my prescriber."
  },
  {
    mood: "neutral",
    anxiety: "mild",
    energy: "okay",
    appetite: "normal",
    food: "balanced",
    nausea: "mild",
    sleep: "good",
    substances: ["caffeine"],
    moodContext: [],
    concerningThoughts: "no",
    note: "Eating earlier seemed to help mood and energy."
  },
  {
    mood: "good",
    anxiety: "none",
    energy: "good",
    appetite: "normal",
    food: "balanced",
    nausea: "none",
    sleep: "good",
    substances: ["caffeine", "alcohol"],
    moodContext: ["more confident"],
    concerningThoughts: "no",
    note: "Dinner out. One glass of wine, felt fine."
  },
  {
    mood: "great",
    anxiety: "none",
    energy: "good",
    appetite: "normal",
    food: "balanced",
    nausea: "none",
    sleep: "good",
    substances: ["caffeine"],
    moodContext: ["more confident"],
    concerningThoughts: "no",
    note: "Felt confident in clothes and had a calmer day."
  },
  {
    mood: "good",
    anxiety: "mild",
    energy: "okay",
    appetite: "low",
    food: "balanced",
    nausea: "mild",
    sleep: "okay",
    substances: ["caffeine"],
    moodContext: [],
    concerningThoughts: "no",
    note: "Busy family day, but steady overall."
  },
  {
    mood: "neutral",
    anxiety: "mild",
    energy: "okay",
    appetite: "low",
    food: "light meal",
    nausea: "mild",
    sleep: "good",
    substances: ["caffeine"],
    moodContext: ["body image sensitive"],
    concerningThoughts: "no",
    note: "Dose day again. Mild nausea at night."
  },
  {
    mood: "low",
    anxiety: "high",
    energy: "low",
    appetite: "none",
    food: "barely ate",
    nausea: "severe",
    sleep: "poor",
    substances: ["caffeine"],
    moodContext: ["irritable", "less interest", "body image sensitive"],
    concerningThoughts: "maybe",
    note: "Skipped breakfast and felt anxious by noon."
  },
  {
    mood: "low",
    anxiety: "medium",
    energy: "low",
    appetite: "low",
    food: "light meal",
    nausea: "medium",
    sleep: "okay",
    substances: ["cannabis"],
    moodContext: ["emotionally flat"],
    concerningThoughts: "no",
    note: "Cannabis helped nausea a little but anxiety stayed present."
  },
  {
    mood: "neutral",
    anxiety: "mild",
    energy: "okay",
    appetite: "normal",
    food: "balanced",
    nausea: "mild",
    sleep: "good",
    substances: ["caffeine"],
    moodContext: [],
    concerningThoughts: "no",
    note: "Mood improved after a protein snack."
  },
  {
    mood: "good",
    anxiety: "mild",
    energy: "good",
    appetite: "normal",
    food: "balanced",
    nausea: "none",
    sleep: "good",
    substances: ["caffeine"],
    moodContext: ["more confident"],
    concerningThoughts: "no",
    note: "Good workday. Less body checking."
  },
  {
    mood: "neutral",
    anxiety: "medium",
    energy: "okay",
    appetite: "high",
    food: "sugar craving",
    nausea: "none",
    sleep: "poor",
    substances: ["caffeine", "alcohol"],
    moodContext: ["irritable"],
    concerningThoughts: "no",
    note: "Poor sleep and cravings after a late night."
  },
  {
    mood: "good",
    anxiety: "mild",
    energy: "good",
    appetite: "normal",
    food: "balanced",
    nausea: "none",
    sleep: "good",
    substances: ["caffeine"],
    moodContext: ["more confident"],
    concerningThoughts: "no",
    note: "Reset day. Walked after dinner."
  }
];

export function buildSummerMonthLogs(): DailyLog[] {
  const today = new Date();
  const rows: DailyLog[] = [];

  for (let i = 29; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const iso = date.toISOString().slice(0, 10);
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    const template = summerMonthTemplates[(29 - i) % summerMonthTemplates.length];

    rows.push({
      ...template,
      id: `summer-demo-${iso}`,
      source: "demo",
      date: iso,
      tookGlp1: weekday === summerDemoProfile.doseDay ? "yes" : "not dose day"
    });
  }

  return rows;
}
