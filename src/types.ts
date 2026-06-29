export type ScreenKey = "checkin" | "dashboard" | "insights" | "support" | "more";

export type MoodLevel = "great" | "good" | "neutral" | "low" | "very low";
export type AnxietyLevel = "none" | "mild" | "medium" | "high";
export type EnergyLevel = "low" | "okay" | "good" | "wired";
export type AppetiteLevel = "none" | "low" | "normal" | "high";
export type FoodLevel = "barely ate" | "light meal" | "balanced" | "heavy" | "sugar craving";
export type SeverityLevel = "none" | "mild" | "medium" | "severe";
export type SleepLevel = "poor" | "okay" | "good";
export type TookDose = "yes" | "no" | "not dose day";
export type ConcernLevel = "no" | "maybe" | "yes";
export type Substance = "caffeine" | "nicotine" | "alcohol" | "cannabis" | "other";
export type ReminderPreference = "once daily" | "twice daily" | "three times daily" | "custom";
export type MoodContextTag =
  | "less interest"
  | "irritable"
  | "emotionally flat"
  | "body image sensitive"
  | "more confident";

export type TrustedContact = {
  name: string;
  phone: string;
};

export type UserProfile = {
  nickname: string;
  ageRange: string;
  gender: string;
  medicationName: string;
  currentDose: string;
  doseDay: string;
  goal: string;
  reminderPreference: ReminderPreference;
  mentalBaseline: string;
  mentalHealthHistory?: string;
  careSupport?: string;
  recentStress?: string;
  prescriptionMeds: boolean;
  prescriptionList: string;
  substancesToTrack: Substance[];
  crisisCountry: string;
  medicationStartDate?: string;
  lastDoseChangeDate?: string;
  medicationTimelineNotes?: string;
  trustedContact?: TrustedContact;
};

export type DailyLog = {
  id: string;
  source?: "sample" | "user" | "demo";
  date: string;
  mood: MoodLevel;
  anxiety: AnxietyLevel;
  energy: EnergyLevel;
  appetite: AppetiteLevel;
  food: FoodLevel;
  nausea: SeverityLevel;
  sleep: SleepLevel;
  tookGlp1: TookDose;
  substances: Substance[];
  moodContext?: MoodContextTag[];
  concerningThoughts: ConcernLevel;
  note: string;
};

export type ReminderSettings = {
  preference: ReminderPreference;
  times: string[];
  enabled: boolean;
};

export type Insight = {
  id: string;
  title: string;
  body: string;
  detail: string;
  tone: "calm" | "watch" | "support";
};
