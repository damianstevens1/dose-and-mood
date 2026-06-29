import React, { useMemo, useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MessageCircle, PhoneCall, Send, ShieldCheck, UserRound } from "lucide-react-native";
import { colors, gradients, cardStyle, shadow } from "../constants/theme";
import {
  AnxietyLevel,
  AppetiteLevel,
  ConcernLevel,
  DailyLog,
  EnergyLevel,
  FoodLevel,
  MoodLevel,
  SeverityLevel,
  SleepLevel,
  TookDose,
  UserProfile
} from "../types";
import { MoodBubbleSelector } from "./MoodBubbleSelector";
import { SubstanceTracker } from "./SubstanceTracker";
import { DoseTracker } from "./DoseTracker";
import { MoodContextTracker } from "./MoodContextTracker";
import { successHaptic } from "../utils/haptics";

type Props = {
  profile: UserProfile;
  existingLog?: DailyLog;
  onSave: (log: DailyLog) => void;
};

const todayIso = () => new Date().toISOString().slice(0, 10);

export function DailyCheckIn({ profile, existingLog, onSave }: Props) {
  const initialLog = useMemo<DailyLog>(
    () =>
      existingLog ?? {
        id: `log-${todayIso()}`,
        source: "user",
        date: todayIso(),
        mood: "neutral",
        anxiety: "mild",
        energy: "okay",
        appetite: "low",
        food: "light meal",
        nausea: "none",
        sleep: "okay",
        tookGlp1: new Date().toLocaleDateString("en-US", { weekday: "long" }) === profile.doseDay ? "no" : "not dose day",
        substances: [],
        moodContext: [],
        concerningThoughts: "no",
        note: ""
      },
    [existingLog, profile.doseDay]
  );

  const [log, setLog] = useState<DailyLog>(initialLog);
  const [safetyModalVisible, setSafetyModalVisible] = useState(false);
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(existingLog?.concerningThoughts !== "yes");

  function update<K extends keyof DailyLog>(key: K, value: DailyLog[K]) {
    setLog((current) => ({ ...current, [key]: value }));
  }

  function handleConcern(value: string) {
    const next = value as ConcernLevel;
    update("concerningThoughts", next);
    if (next === "yes") {
      setSafetyAcknowledged(false);
      setSafetyModalVisible(true);
    }
  }

  function save() {
    if (log.concerningThoughts === "yes" && !safetyAcknowledged) {
      setSafetyModalVisible(true);
      return;
    }
    successHaptic();
    onSave({ ...log, id: existingLog?.id?.startsWith("sample-") ? `log-${todayIso()}` : existingLog?.id ?? `log-${todayIso()}`, source: "user", date: todayIso() });
  }

  return (
    <View style={styles.shell}>
      <LinearGradient colors={gradients.champagne} style={[styles.topCard, shadow.card]}>
        <Text style={styles.kicker}>30-second log</Text>
        <Text style={styles.title}>How are you feeling today?</Text>
        <Text style={styles.subtitle}>
          Gentle tracking can make patterns easier to discuss with your clinician.
        </Text>
      </LinearGradient>

      <MoodBubbleSelector
        label="Mood right now"
        value={log.mood}
        options={[
          { value: "great", label: "Great" },
          { value: "good", label: "Good" },
          { value: "neutral", label: "Neutral" },
          { value: "low", label: "Low" },
          { value: "very low", label: "Very low" }
        ]}
        onChange={(value) => update("mood", value as MoodLevel)}
      />

      <MoodBubbleSelector
        label="Anxiety"
        value={log.anxiety}
        options={[
          { value: "none", label: "None" },
          { value: "mild", label: "Mild" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" }
        ]}
        onChange={(value) => update("anxiety", value as AnxietyLevel)}
        columns={2}
      />

      <MoodBubbleSelector
        label="Energy"
        value={log.energy}
        options={[
          { value: "low", label: "Low" },
          { value: "okay", label: "Okay" },
          { value: "good", label: "Good" },
          { value: "wired", label: "Wired" }
        ]}
        onChange={(value) => update("energy", value as EnergyLevel)}
        columns={2}
      />

      <MoodBubbleSelector
        label="Appetite"
        value={log.appetite}
        options={[
          { value: "none", label: "None" },
          { value: "low", label: "Low" },
          { value: "normal", label: "Normal" },
          { value: "high", label: "High" }
        ]}
        onChange={(value) => update("appetite", value as AppetiteLevel)}
        columns={2}
      />

      <MoodBubbleSelector
        label="Food today"
        value={log.food}
        options={[
          { value: "barely ate", label: "Barely ate" },
          { value: "light meal", label: "Light meal" },
          { value: "balanced", label: "Balanced" },
          { value: "heavy", label: "Heavy" },
          { value: "sugar craving", label: "Sugar craving" }
        ]}
        onChange={(value) => update("food", value as FoodLevel)}
      />

      <MoodBubbleSelector
        label="Nausea / GI"
        value={log.nausea}
        options={[
          { value: "none", label: "None" },
          { value: "mild", label: "Mild" },
          { value: "medium", label: "Medium" },
          { value: "severe", label: "Severe" }
        ]}
        onChange={(value) => update("nausea", value as SeverityLevel)}
        columns={2}
      />

      <MoodBubbleSelector
        label="Sleep last night"
        value={log.sleep}
        options={[
          { value: "poor", label: "Poor" },
          { value: "okay", label: "Okay" },
          { value: "good", label: "Good" }
        ]}
        onChange={(value) => update("sleep", value as SleepLevel)}
      />

      <DoseTracker
        doseDay={profile.doseDay}
        value={log.tookGlp1}
        onChange={(value: TookDose) => update("tookGlp1", value)}
      />

      <SubstanceTracker value={log.substances} onChange={(value) => update("substances", value)} />

      <MoodContextTracker value={log.moodContext ?? []} onChange={(value) => update("moodContext", value)} />

      <MoodBubbleSelector
        label="Any concerning thoughts?"
        helper="You are not alone. Support can be immediate."
        value={log.concerningThoughts}
        options={[
          { value: "no", label: "No" },
          { value: "maybe", label: "Maybe" },
          { value: "yes", label: "Yes" }
        ]}
        onChange={handleConcern}
      />

      <View style={[styles.noteCard, cardStyle]}>
        <Text style={styles.noteLabel}>What might have affected your mood today?</Text>
        <TextInput
          value={log.note}
          onChangeText={(value) => update("note", value)}
          placeholder="Optional reflection"
          placeholderTextColor={colors.mutedText}
          style={styles.noteInput}
          multiline
        />
      </View>

      {log.concerningThoughts === "maybe" ? (
        <View style={[styles.softNotice, cardStyle]}>
          <ShieldCheck size={18} color={colors.plum} strokeWidth={2.4} />
          <Text style={styles.softNoticeText}>
            If this starts feeling urgent or unsafe, use support now or contact someone you trust.
          </Text>
        </View>
      ) : null}

      <Pressable onPress={save} style={styles.saveButton}>
        <LinearGradient colors={gradients.navyButton} style={styles.saveGradient}>
          <Text style={styles.saveText}>{existingLog ? "Update today's log" : "Save today's log"}</Text>
        </LinearGradient>
      </Pressable>

      <SafetyModal
        visible={safetyModalVisible}
        onClose={() => setSafetyModalVisible(false)}
        onContinue={() => {
          setSafetyAcknowledged(true);
          setSafetyModalVisible(false);
        }}
      />
    </View>
  );
}

function SafetyModal({
  visible,
  onClose,
  onContinue
}: {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void;
}) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalScrim}>
        <View style={[styles.modalCard, shadow.soft]}>
          <Text style={styles.modalTitle}>You deserve support right now.</Text>
          <Text style={styles.modalBody}>
            This app can't provide emergency care, but help is available. If you may be in immediate danger, call emergency
            services now.
          </Text>
          <View style={styles.modalActions}>
            <Pressable style={styles.modalAction} onPress={() => Linking.openURL("tel:988")}>
              <PhoneCall size={18} color={colors.porcelain} strokeWidth={2.4} />
              <Text style={styles.modalActionText}>Call 988</Text>
            </Pressable>
            <Pressable style={styles.modalAction} onPress={() => Linking.openURL("sms:988")}>
              <MessageCircle size={18} color={colors.porcelain} strokeWidth={2.4} />
              <Text style={styles.modalActionText}>Text 988</Text>
            </Pressable>
            <Pressable style={styles.modalAction} onPress={() => Linking.openURL("https://988lifeline.org/chat/")}>
              <Send size={18} color={colors.porcelain} strokeWidth={2.4} />
              <Text style={styles.modalActionText}>Chat 988</Text>
            </Pressable>
            <Pressable style={styles.modalSecondary} onPress={onClose}>
              <UserRound size={17} color={colors.navy} strokeWidth={2.3} />
              <Text style={styles.modalSecondaryText}>Contact trusted person</Text>
            </Pressable>
            <Pressable style={styles.continueButton} onPress={onContinue}>
              <Text style={styles.continueText}>I'm safe and want to continue</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  shell: {
    paddingTop: 4
  },
  topCard: {
    borderRadius: 8,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.74)"
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
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    marginTop: 6
  },
  subtitle: {
    color: colors.softNavy,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7
  },
  noteCard: {
    padding: 15,
    marginBottom: 14
  },
  noteLabel: {
    color: colors.navy,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
    marginBottom: 8
  },
  noteInput: {
    minHeight: 92,
    color: colors.navy,
    fontSize: 15,
    lineHeight: 22,
    textAlignVertical: "top"
  },
  softNotice: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    marginBottom: 14
  },
  softNoticeText: {
    flex: 1,
    color: colors.softNavy,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600"
  },
  saveButton: {
    minHeight: 58,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 12
  },
  saveGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  saveText: {
    color: colors.porcelain,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "900"
  },
  modalScrim: {
    flex: 1,
    backgroundColor: "rgba(24,33,59,0.36)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  modalCard: {
    width: "100%",
    maxWidth: 390,
    borderRadius: 8,
    backgroundColor: colors.porcelain,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)"
  },
  modalTitle: {
    color: colors.navy,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
    marginBottom: 8
  },
  modalBody: {
    color: colors.softNavy,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16
  },
  modalActions: {
    gap: 9
  },
  modalAction: {
    minHeight: 50,
    borderRadius: 999,
    backgroundColor: colors.danger,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  modalActionText: {
    color: colors.porcelain,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "900"
  },
  modalSecondary: {
    minHeight: 50,
    borderRadius: 999,
    backgroundColor: colors.champagne,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  modalSecondaryText: {
    color: colors.navy,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900"
  },
  continueButton: {
    minHeight: 50,
    borderRadius: 999,
    backgroundColor: "rgba(24,33,59,0.07)",
    alignItems: "center",
    justifyContent: "center"
  },
  continueText: {
    color: colors.navy,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900"
  }
});
