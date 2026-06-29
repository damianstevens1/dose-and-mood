import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Fingerprint, LockKeyhole, Pill, ShieldCheck } from "lucide-react-native";
import { colors, cardStyle, shadow } from "../constants/theme";
import { ExportSummary } from "../components/ExportSummary";
import { ReminderSettings } from "../components/ReminderSettings";
import { DailyLog, ReminderSettings as ReminderSettingsType, UserProfile } from "../types";
import { MoodBubbleSelector } from "../components/MoodBubbleSelector";
import { DoseDropdown } from "../components/DoseDropdown";

export type MoreSection = "profile" | "reminders" | "export" | "privacy";

type Props = {
  activeSection: MoreSection;
  onSectionChange: (section: MoreSection) => void;
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  logs: DailyLog[];
  reminders: ReminderSettingsType;
  onRemindersChange: (settings: ReminderSettingsType) => void;
};

export function MoreScreen({
  activeSection,
  onSectionChange,
  profile,
  onProfileChange,
  logs,
  reminders,
  onRemindersChange
}: Props) {
  return (
    <View style={styles.shell}>
      <View style={styles.segment}>
        {[
          { key: "profile", label: "Profile" },
          { key: "reminders", label: "Reminders" },
          { key: "export", label: "Export" },
          { key: "privacy", label: "Privacy" }
        ].map((item) => {
          const active = item.key === activeSection;
          return (
            <Pressable
              key={item.key}
              onPress={() => onSectionChange(item.key as MoreSection)}
              style={[styles.segmentItem, active && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {activeSection === "profile" ? <ProfilePanel profile={profile} onProfileChange={onProfileChange} /> : null}
      {activeSection === "reminders" ? (
        <ReminderSettings settings={reminders} onChange={onRemindersChange} />
      ) : null}
      {activeSection === "export" ? <ExportSummary profile={profile} logs={logs} /> : null}
      {activeSection === "privacy" ? <PrivacyPanel /> : null}
    </View>
  );
}

function ProfilePanel({
  profile,
  onProfileChange
}: {
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
}) {
  const medicationOptions = ["Ozempic", "Wegovy", "Mounjaro", "Zepbound", "Other"];
  const doseDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const baselineOptions = ["great", "okay", "stressed", "anxious", "low", "struggling"];
  const historyOptions = ["No history", "Anxiety or depression history", "Prefer not to say"];
  const supportOptions = ["None right now", "Primary care clinician", "Therapist or psychiatrist", "Prefer not to say"];
  const stressOptions = ["No major stress", "Work or family stress", "Body changes", "Major life change"];

  return (
    <View style={styles.profileShell}>
      <View style={[styles.profileHero, cardStyle, shadow.card]}>
        <View style={styles.profileIcon}>
          <Pill size={19} color={colors.plum} strokeWidth={2.5} />
        </View>
        <View style={styles.privacyCopy}>
          <Text style={styles.privacyTitle}>Medication profile</Text>
          <Text style={styles.privacyText}>
            For tracking only. Match the wording on your prescription label and bring changes to your clinician.
          </Text>
        </View>
      </View>
      <Text style={styles.fieldLabel}>Display name</Text>
      <TextInput
        value={profile.nickname}
        onChangeText={(value) => onProfileChange({ ...profile, nickname: value })}
        placeholder="Name or nickname"
        placeholderTextColor={colors.mutedText}
        style={styles.input}
      />
      <MoodBubbleSelector
        label="GLP-1 medication"
        value={profile.medicationName}
        options={medicationOptions.map((value) => ({ value, label: value }))}
        onChange={(value) => onProfileChange({ ...profile, medicationName: value })}
        columns={2}
      />
      <DoseDropdown
        medicationName={profile.medicationName}
        value={profile.currentDose}
        onChange={(value) => onProfileChange({ ...profile, currentDose: value })}
      />
      <Text style={styles.fieldLabel}>Medication timeline</Text>
      <TextInput
        value={profile.medicationStartDate ?? ""}
        onChangeText={(value) => onProfileChange({ ...profile, medicationStartDate: value })}
        placeholder="Start date, if useful"
        placeholderTextColor={colors.mutedText}
        style={styles.input}
      />
      <TextInput
        value={profile.lastDoseChangeDate ?? ""}
        onChangeText={(value) => onProfileChange({ ...profile, lastDoseChangeDate: value })}
        placeholder="Last dose change date, if any"
        placeholderTextColor={colors.mutedText}
        style={styles.input}
      />
      <TextInput
        value={profile.medicationTimelineNotes ?? ""}
        onChangeText={(value) => onProfileChange({ ...profile, medicationTimelineNotes: value })}
        placeholder="Optional switch, pause, or clinician note"
        placeholderTextColor={colors.mutedText}
        style={[styles.input, styles.notesInput]}
        multiline
      />
      <MoodBubbleSelector
        label="Dose day"
        value={profile.doseDay}
        options={doseDays.map((value) => ({ value, label: value.slice(0, 3) }))}
        onChange={(value) => onProfileChange({ ...profile, doseDay: value })}
      />
      <MoodBubbleSelector
        label="Mental health baseline"
        value={profile.mentalBaseline}
        options={baselineOptions.map((value) => ({ value, label: value }))}
        onChange={(value) => onProfileChange({ ...profile, mentalBaseline: value })}
        columns={2}
      />
      <MoodBubbleSelector
        label="Mental health history"
        value={profile.mentalHealthHistory ?? ""}
        options={historyOptions.map((value) => ({ value, label: value }))}
        onChange={(value) => onProfileChange({ ...profile, mentalHealthHistory: value })}
      />
      <MoodBubbleSelector
        label="Current care support"
        value={profile.careSupport ?? ""}
        options={supportOptions.map((value) => ({ value, label: value }))}
        onChange={(value) => onProfileChange({ ...profile, careSupport: value })}
      />
      <MoodBubbleSelector
        label="Recent stress context"
        value={profile.recentStress ?? ""}
        options={stressOptions.map((value) => ({ value, label: value }))}
        onChange={(value) => onProfileChange({ ...profile, recentStress: value })}
        columns={2}
      />
    </View>
  );
}

function PrivacyPanel() {
  return (
    <View style={styles.privacyList}>
      <View style={[styles.privacyHero, cardStyle, shadow.card]}>
        <LockKeyhole size={22} color={colors.plum} strokeWidth={2.4} />
        <View style={styles.privacyCopy}>
          <Text style={styles.privacyTitle}>Your log is personal.</Text>
          <Text style={styles.privacyText}>
            Dose & Mood is local-first for this MVP. Your entries stay on this device unless you choose to export.
          </Text>
        </View>
      </View>
      <PrivacyRow
        Icon={ShieldCheck}
        title="No selling data"
        body="The product promise is private wellness tracking, not ad targeting or data resale."
      />
      <PrivacyRow
        Icon={Fingerprint}
        title="Passcode / Face ID placeholder"
        body="Marked for the next native build. The MVP keeps the UI and data model ready for device lock."
      />
      <PrivacyRow
        Icon={LockKeyhole}
        title="Export only when you choose"
        body="The clinician summary uses your explicit share action. Nothing is sent automatically."
      />
    </View>
  );
}

function PrivacyRow({
  Icon,
  title,
  body
}: {
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  body: string;
}) {
  return (
    <View style={[styles.privacyRow, cardStyle]}>
      <View style={styles.privacyIcon}>
        <Icon size={18} color={colors.success} strokeWidth={2.4} />
      </View>
      <View style={styles.privacyCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowBody}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    gap: 14
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
  privacyList: {
    gap: 12
  },
  profileShell: {
    gap: 2
  },
  fieldLabel: {
    color: colors.navy,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
    marginBottom: 10
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
  notesInput: {
    borderRadius: 8,
    minHeight: 86,
    paddingVertical: 14,
    textAlignVertical: "top"
  },
  profileHero: {
    padding: 16,
    flexDirection: "row",
    gap: 12,
    marginBottom: 14
  },
  profileIcon: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.champagne
  },
  privacyHero: {
    padding: 16,
    flexDirection: "row",
    gap: 12
  },
  privacyCopy: {
    flex: 1
  },
  privacyTitle: {
    color: colors.navy,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "900"
  },
  privacyText: {
    color: colors.softNavy,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4
  },
  privacyRow: {
    padding: 15,
    flexDirection: "row",
    gap: 12
  },
  privacyIcon: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.66)"
  },
  rowTitle: {
    color: colors.navy,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900"
  },
  rowBody: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3
  }
});
