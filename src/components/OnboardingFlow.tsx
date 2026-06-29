import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, HeartPulse, LockKeyhole, Pill, ShieldCheck } from "lucide-react-native";
import { colors, gradients, cardStyle, shadow } from "../constants/theme";
import { ReminderPreference, Substance, UserProfile } from "../types";
import { MoodBubbleSelector } from "./MoodBubbleSelector";
import { MascotCompanion } from "./MascotCompanion";
import { DoseDropdown } from "./DoseDropdown";
import { lightHaptic, successHaptic } from "../utils/haptics";

type Props = {
  defaultProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
};

const ageOptions = ["18-29", "30-39", "40-49", "50-60", "60+"];
const genderOptions = ["Woman", "Man", "Nonbinary", "Prefer not"];
const medicationOptions = ["Ozempic", "Wegovy", "Mounjaro", "Zepbound", "Other"];
const doseDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const goalOptions = ["Weight loss", "Diabetes", "PCOS/metabolic", "Other"];
const baselineOptions = ["great", "okay", "stressed", "anxious", "low", "struggling"];
const reminderOptions: ReminderPreference[] = ["once daily", "twice daily", "three times daily", "custom"];
const substanceOptions: Substance[] = ["alcohol", "nicotine", "cannabis", "caffeine", "other"];

export function OnboardingFlow({ defaultProfile, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<UserProfile>(defaultProfile);
  const progress = useMemo(() => ((step + 1) / 5) * 100, [step]);

  function update<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleSubstance(value: Substance) {
    setForm((current) => {
      const exists = current.substancesToTrack.includes(value);
      return {
        ...current,
        substancesToTrack: exists
          ? current.substancesToTrack.filter((item) => item !== value)
          : [...current.substancesToTrack, value]
      };
    });
  }

  function next() {
    lightHaptic();
    if (step < 4) {
      setStep((current) => current + 1);
      return;
    }
    successHaptic();
    onComplete(form);
  }

  function back() {
    lightHaptic();
    setStep((current) => Math.max(0, current - 1));
  }

  return (
    <View style={styles.shell}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView style={styles.stepScroller} contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
      {step === 0 && (
        <View style={styles.step}>
          <LinearGradient colors={gradients.hero} style={[styles.hero, shadow.soft]}>
            <View style={styles.heroCopy}>
              <Text style={styles.kicker}>Private GLP-1 wellness tracker</Text>
              <Text style={styles.title}>Dose & Mood</Text>
              <Text style={styles.subtitle}>
                Track mood, appetite, sleep, side effects, substances, and dose timing so patterns are easier to share.
              </Text>
            </View>
            <MascotCompanion phrase="You can go slowly." />
          </LinearGradient>

          <View style={[styles.notice, cardStyle, shadow.card]}>
            <ShieldCheck size={18} color={colors.success} strokeWidth={2.4} />
            <View style={styles.noticeCopy}>
              <Text style={styles.noticeTitle}>This is a local personal logger, not medical advice.</Text>
              <Text style={styles.noticeText}>
                Your entries stay on this device for the MVP. The app does not diagnose, claim cause, or tell you to
                change a dose.
              </Text>
            </View>
          </View>

          <View style={[styles.notice, cardStyle]}>
            <HeartPulse size={18} color={colors.roseText} strokeWidth={2.4} />
            <View style={styles.noticeCopy}>
              <Text style={styles.noticeTitle}>If concerning thoughts appear, support is one tap away.</Text>
              <Text style={styles.noticeText}>
                U.S. users can call, text, or chat with 988. Outside the U.S., use local emergency or crisis services.
              </Text>
            </View>
          </View>
        </View>
      )}

      {step === 1 && (
        <View style={styles.step}>
          <Text style={styles.sectionTitle}>First, the essentials</Text>
          <Text style={styles.sectionText}>
            Use a nickname or leave it blank. This is only to make your private log easier to read.
          </Text>
          <TextInput
            value={form.nickname}
            onChangeText={(value) => update("nickname", value)}
            placeholder="Nickname (optional)"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
          />
          <MoodBubbleSelector
            label="Age range"
            value={form.ageRange}
            options={ageOptions.map((value) => ({ value, label: value }))}
            onChange={(value) => update("ageRange", value)}
            columns={2}
          />
          <MoodBubbleSelector
            label="Gender"
            value={form.gender}
            options={genderOptions.map((value) => ({ value, label: value }))}
            onChange={(value) => update("gender", value)}
            columns={2}
          />
        </View>
      )}

      {step === 2 && (
        <View style={styles.step}>
          <View style={styles.iconTitle}>
            <Pill size={19} color={colors.plum} strokeWidth={2.4} />
            <Text style={styles.sectionTitle}>Medication routine</Text>
          </View>
          <MoodBubbleSelector
            label="GLP-1 medication"
            value={form.medicationName}
            options={medicationOptions.map((value) => ({ value, label: value }))}
            onChange={(value) => update("medicationName", value)}
            columns={2}
          />
          <DoseDropdown
            medicationName={form.medicationName}
            value={form.currentDose}
            onChange={(value) => update("currentDose", value)}
          />
          <MoodBubbleSelector
            label="Dose day"
            value={form.doseDay}
            options={doseDays.map((value) => ({ value, label: value.slice(0, 3) }))}
            onChange={(value) => update("doseDay", value)}
          />
        </View>
      )}

      {step === 3 && (
        <View style={styles.step}>
          <View style={styles.iconTitle}>
            <Bell size={19} color={colors.plum} strokeWidth={2.4} />
            <Text style={styles.sectionTitle}>Check-in rhythm</Text>
          </View>
          <MoodBubbleSelector
            label="Goal"
            value={form.goal}
            options={goalOptions.map((value) => ({ value, label: value }))}
            onChange={(value) => update("goal", value)}
            columns={2}
          />
          <MoodBubbleSelector
            label="Reminder preference"
            value={form.reminderPreference}
            options={reminderOptions.map((value) => ({ value, label: value }))}
            onChange={(value) => update("reminderPreference", value as ReminderPreference)}
            columns={2}
          />
          <MoodBubbleSelector
            label="Current mental health baseline"
            value={form.mentalBaseline}
            options={baselineOptions.map((value) => ({ value, label: value }))}
            onChange={(value) => update("mentalBaseline", value)}
            columns={2}
          />
        </View>
      )}

      {step === 4 && (
        <View style={styles.step}>
          <View style={styles.iconTitle}>
            <LockKeyhole size={19} color={colors.plum} strokeWidth={2.4} />
            <Text style={styles.sectionTitle}>Private by default</Text>
          </View>
          <MoodBubbleSelector
            label="Prescription medications?"
            value={form.prescriptionMeds ? "yes" : "no"}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" }
            ]}
            onChange={(value) => update("prescriptionMeds", value === "yes")}
            columns={2}
          />
          {form.prescriptionMeds ? (
            <TextInput
              value={form.prescriptionList}
              onChangeText={(value) => update("prescriptionList", value)}
              placeholder="Optional list for your export"
              placeholderTextColor={colors.mutedText}
              style={styles.input}
            />
          ) : null}

          <Text style={styles.fieldLabel}>Substances to track</Text>
          <View style={styles.choiceWrap}>
            {substanceOptions.map((option) => {
              const active = form.substancesToTrack.includes(option);
              return (
                <Pressable
                  key={option}
                  onPress={() => {
                    lightHaptic();
                    toggleSubstance(option);
                  }}
                  style={[styles.choicePill, active && styles.choicePillActive]}
                >
                  <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.fieldLabel}>Emergency/crisis resource country</Text>
          <TextInput
            value={form.crisisCountry}
            onChangeText={(value) => update("crisisCountry", value)}
            placeholder="United States - 988"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
          />

          <View style={[styles.privacy, cardStyle]}>
            <Text style={styles.noticeTitle}>Your log is personal.</Text>
            <Text style={styles.noticeText}>
              MVP data is stored locally on this device. Export only when you choose. Face ID and passcode lock are marked
              as next-step privacy controls.
            </Text>
          </View>
        </View>
      )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={back} disabled={step === 0} style={[styles.secondaryButton, step === 0 && styles.disabled]}>
          <Text style={styles.secondaryText}>Back</Text>
        </Pressable>
        <Pressable onPress={next} style={styles.primaryButton}>
          <LinearGradient colors={gradients.navyButton} style={styles.primaryGradient}>
            <Text style={styles.primaryText}>{step === 4 ? "Begin tracking" : "Continue"}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    paddingTop: 10
  },
  progressTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.7)",
    overflow: "hidden",
    marginBottom: 16
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.plum
  },
  step: {
    flex: 1
  },
  stepScroller: {
    flex: 1
  },
  stepContent: {
    paddingBottom: 10
  },
  hero: {
    borderRadius: 8,
    minHeight: 322,
    padding: 22,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)"
  },
  heroCopy: {
    gap: 8
  },
  kicker: {
    color: colors.plum,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  title: {
    color: colors.navy,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "900",
    letterSpacing: 0
  },
  subtitle: {
    color: colors.softNavy,
    fontSize: 16,
    lineHeight: 23
  },
  notice: {
    marginTop: 12,
    padding: 14,
    flexDirection: "row",
    gap: 10
  },
  noticeCopy: {
    flex: 1,
    gap: 4
  },
  noticeTitle: {
    color: colors.navy,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800"
  },
  noticeText: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 17
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 6
  },
  sectionText: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18
  },
  iconTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12
  },
  input: {
    minHeight: 54,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.76)",
    borderWidth: 1,
    borderColor: "rgba(24,33,59,0.08)",
    paddingHorizontal: 18,
    color: colors.navy,
    fontSize: 15,
    lineHeight: 19,
    marginBottom: 16
  },
  fieldLabel: {
    color: colors.navy,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
    marginBottom: 10
  },
  choiceWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16
  },
  choicePill: {
    minHeight: 42,
    borderRadius: 999,
    justifyContent: "center",
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "rgba(24,33,59,0.08)"
  },
  choicePillActive: {
    backgroundColor: colors.navy
  },
  choiceText: {
    color: colors.softNavy,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
    textTransform: "capitalize"
  },
  choiceTextActive: {
    color: colors.porcelain
  },
  privacy: {
    padding: 15,
    marginTop: 2
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 16
  },
  secondaryButton: {
    flex: 0.85,
    minHeight: 54,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.62)",
    borderWidth: 1,
    borderColor: "rgba(24,33,59,0.08)"
  },
  disabled: {
    opacity: 0.36
  },
  secondaryText: {
    color: colors.softNavy,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800"
  },
  primaryButton: {
    flex: 1.4,
    minHeight: 54,
    borderRadius: 999,
    overflow: "hidden"
  },
  primaryGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryText: {
    color: colors.porcelain,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "900"
  }
});
