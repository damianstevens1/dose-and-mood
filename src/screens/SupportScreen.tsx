import React, { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FileText, MessageCircle, PhoneCall, Send, UserRound } from "lucide-react-native";
import { colors, gradients, cardStyle, shadow } from "../constants/theme";
import { UserProfile } from "../types";

type Props = {
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  onOpenExport: () => void;
};

export function SupportScreen({ profile, onProfileChange, onOpenExport }: Props) {
  const [trustedName, setTrustedName] = useState(profile.trustedContact?.name ?? "");
  const [trustedPhone, setTrustedPhone] = useState(profile.trustedContact?.phone ?? "");

  function saveTrustedContact() {
    onProfileChange({
      ...profile,
      trustedContact: {
        name: trustedName,
        phone: trustedPhone
      }
    });
  }

  function callTrustedContact() {
    const phone = trustedPhone || profile.trustedContact?.phone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  }

  return (
    <View style={styles.shell}>
      <LinearGradient colors={gradients.support} style={[styles.hero, shadow.card]}>
        <Text style={styles.kicker}>Need help now?</Text>
        <Text style={styles.title}>Support is available.</Text>
        <Text style={styles.body}>
          This app can't provide emergency care. If you are in immediate danger, call emergency services. In the U.S.,
          988 supports call, text, and chat.
        </Text>
      </LinearGradient>

      <View style={styles.actionGrid}>
        <SupportAction label="Call 988" Icon={PhoneCall} primary onPress={() => Linking.openURL("tel:988")} />
        <SupportAction label="Text 988" Icon={MessageCircle} primary onPress={() => Linking.openURL("sms:988")} />
        <SupportAction label="Chat with 988" Icon={Send} onPress={() => Linking.openURL("https://988lifeline.org/chat/")} />
        <SupportAction label="Clinician note export" Icon={FileText} onPress={onOpenExport} />
        <SupportAction
          label="FDA MedWatch"
          Icon={FileText}
          onPress={() => Linking.openURL("https://www.fda.gov/safety/medwatch-fda-safety-information-and-adverse-event-reporting-program")}
        />
      </View>

      <View style={[styles.infoCard, cardStyle]}>
        <Text style={styles.infoTitle}>Side effect reporting</Text>
        <Text style={styles.infoBody}>
          For serious or unexpected side effects, U.S. users can report to FDA MedWatch. This does not replace contacting a
          clinician or emergency support.
        </Text>
      </View>

      <View style={[styles.contactCard, cardStyle, shadow.card]}>
        <View style={styles.contactHeader}>
          <View style={styles.contactIcon}>
            <UserRound size={19} color={colors.plum} strokeWidth={2.4} />
          </View>
          <View style={styles.contactCopy}>
            <Text style={styles.contactTitle}>Trusted contact</Text>
            <Text style={styles.contactBody}>Save someone you may want to call when things feel heavy.</Text>
          </View>
        </View>
        <TextInput
          value={trustedName}
          onChangeText={setTrustedName}
          placeholder="Name"
          placeholderTextColor={colors.mutedText}
          style={styles.input}
        />
        <TextInput
          value={trustedPhone}
          onChangeText={setTrustedPhone}
          placeholder="Phone number"
          placeholderTextColor={colors.mutedText}
          style={styles.input}
          keyboardType="phone-pad"
        />
        <View style={styles.contactButtons}>
          <Pressable onPress={saveTrustedContact} style={styles.saveContact}>
            <Text style={styles.saveContactText}>Add trusted contact</Text>
          </Pressable>
          <Pressable onPress={callTrustedContact} style={styles.callContact}>
            <Text style={styles.callContactText}>Call trusted contact</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function SupportAction({
  label,
  Icon,
  primary,
  onPress
}: {
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  primary?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.supportAction, primary && styles.supportActionPrimary]}>
      <Icon size={18} color={primary ? colors.porcelain : colors.plum} strokeWidth={2.5} />
      <Text style={[styles.supportActionText, primary && styles.supportActionTextPrimary]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    gap: 14
  },
  hero: {
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.74)"
  },
  kicker: {
    color: colors.danger,
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
    marginTop: 5
  },
  body: {
    color: colors.softNavy,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  supportAction: {
    flexBasis: "48.6%",
    minHeight: 74,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(24,33,59,0.07)"
  },
  supportActionPrimary: {
    backgroundColor: colors.danger,
    borderColor: "rgba(155,53,74,0.2)"
  },
  supportActionText: {
    color: colors.navy,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
    textAlign: "center"
  },
  supportActionTextPrimary: {
    color: colors.porcelain
  },
  contactCard: {
    padding: 15,
    gap: 10
  },
  infoCard: {
    padding: 14
  },
  infoTitle: {
    color: colors.navy,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900"
  },
  infoBody: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4
  },
  contactHeader: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4
  },
  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.champagne
  },
  contactCopy: {
    flex: 1
  },
  contactTitle: {
    color: colors.navy,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900"
  },
  contactBody: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3
  },
  input: {
    minHeight: 50,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(24,33,59,0.07)",
    paddingHorizontal: 15,
    color: colors.navy,
    fontSize: 14,
    lineHeight: 18
  },
  contactButtons: {
    gap: 8
  },
  saveContact: {
    minHeight: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.navy
  },
  saveContactText: {
    color: colors.porcelain,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900"
  },
  callContact: {
    minHeight: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.champagne
  },
  callContactText: {
    color: colors.navy,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900"
  }
});
