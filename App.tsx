import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import {
  BarChart3,
  CircleAlert,
  Home,
  Settings,
  Sparkles
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CrisisSupportButton } from "./src/components/CrisisSupportButton";
import { MascotCompanion } from "./src/components/MascotCompanion";
import {
  buildSampleLogs,
  buildSummerMonthLogs,
  defaultProfile,
  defaultReminderSettings,
  loggerStarterProfile,
  summerDemoProfile
} from "./src/data/sampleData";
import { DailyLog, ReminderSettings as ReminderSettingsType, ScreenKey, UserProfile } from "./src/types";
import { colors, gradients, shadow } from "./src/constants/theme";
import { OnboardingFlow } from "./src/components/OnboardingFlow";
import { DailyCheckIn } from "./src/components/DailyCheckIn";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { InsightsScreen } from "./src/screens/InsightsScreen";
import { SupportScreen } from "./src/screens/SupportScreen";
import { MoreScreen, MoreSection } from "./src/screens/MoreScreen";

const PROFILE_KEY = "dose-and-mood:profile";
const LOGS_KEY = "dose-and-mood:logs";
const REMINDERS_KEY = "dose-and-mood:reminders";

const navItems: Array<{
  key: ScreenKey;
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}> = [
  { key: "checkin", label: "Today", Icon: Home },
  { key: "dashboard", label: "Trends", Icon: BarChart3 },
  { key: "insights", label: "Insights", Icon: Sparkles },
  { key: "support", label: "Support", Icon: CircleAlert },
  { key: "more", label: "More", Icon: Settings }
];

function isUserLog(log: DailyLog) {
  return log.source === "user" || !log.id.startsWith("sample-");
}

function differsFromSample(log: DailyLog, sample?: DailyLog) {
  if (!sample || !log.id.startsWith("sample-")) {
    return false;
  }

  return (
    log.mood !== sample.mood ||
    log.anxiety !== sample.anxiety ||
    log.energy !== sample.energy ||
    log.appetite !== sample.appetite ||
    log.food !== sample.food ||
    log.nausea !== sample.nausea ||
    log.sleep !== sample.sleep ||
    log.tookGlp1 !== sample.tookGlp1 ||
    log.concerningThoughts !== sample.concerningThoughts ||
    log.note !== sample.note ||
    (log.moodContext ?? []).join(",") !== (sample.moodContext ?? []).join(",") ||
    log.substances.join(",") !== sample.substances.join(",")
  );
}

function getSearchParams() {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }

  return new URLSearchParams(window.location.search);
}

function getIsExampleDemo() {
  const demo = getSearchParams().get("demo");
  return demo === "summer" || demo === "30day" || demo === "example";
}

function getIsFreshLogger() {
  const params = getSearchParams();
  return params.get("mode") === "logger" || params.get("start") === "logger";
}

function clearModeParam() {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.delete("mode");
  url.searchParams.delete("start");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

export default function App() {
  const isExampleDemo = getIsExampleDemo();
  const isFreshLogger = getIsFreshLogger();
  const { width } = useWindowDimensions();
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [reminders, setReminders] = useState<ReminderSettingsType>(defaultReminderSettings);
  const [activeScreen, setActiveScreen] = useState<ScreenKey>(isExampleDemo ? "dashboard" : "checkin");
  const [moreSection, setMoreSection] = useState<MoreSection>("reminders");
  const fade = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    async function loadAppState() {
      try {
        if (isExampleDemo) {
          setProfile({ ...summerDemoProfile, nickname: "Example" });
          setLogs(buildSummerMonthLogs());
          setReminders({
            ...defaultReminderSettings,
            preference: "twice daily",
            times: ["8:30 AM", "8:30 PM"]
          });
          setActiveScreen("dashboard");
          return;
        }

        if (isFreshLogger) {
          setProfile(null);
          setLogs([]);
          setReminders(defaultReminderSettings);
          setActiveScreen("checkin");
          return;
        }

        const [savedProfile, savedLogs, savedReminders] = await Promise.all([
          AsyncStorage.getItem(PROFILE_KEY),
          AsyncStorage.getItem(LOGS_KEY),
          AsyncStorage.getItem(REMINDERS_KEY)
        ]);

        setProfile(savedProfile ? JSON.parse(savedProfile) : null);
        setLogs(savedLogs ? JSON.parse(savedLogs) : []);
        setReminders(savedReminders ? JSON.parse(savedReminders) : defaultReminderSettings);
      } finally {
        setLoaded(true);
      }
    }

    loadAppState();
  }, [isExampleDemo, isFreshLogger]);

  useEffect(() => {
    if (!loaded || !profile || isExampleDemo) {
      return;
    }
    AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [isExampleDemo, loaded, profile]);

  useEffect(() => {
    if (!loaded || isExampleDemo) {
      return;
    }
    AsyncStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  }, [isExampleDemo, loaded, logs]);

  useEffect(() => {
    if (!loaded || isExampleDemo) {
      return;
    }
    AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  }, [isExampleDemo, loaded, reminders]);

  useEffect(() => {
    fade.setValue(0.92);
    Animated.timing(fade, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true
    }).start();
  }, [activeScreen, moreSection, fade]);

  const appProfile = profile ?? loggerStarterProfile;
  const sampleRowsForProfile = buildSampleLogs(appProfile.doseDay);
  const sampleByDate = new Map(sampleRowsForProfile.map((log) => [log.date, log]));
  const userLogs = logs.filter((log) => isUserLog(log) || differsFromSample(log, sampleByDate.get(log.date)));
  const displayLogs = userLogs.length ? userLogs : logs;
  const isSampleMode = logs.length > 0 && userLogs.length === 0;
  const todayLog = userLogs.find((log) => log.date === new Date().toISOString().slice(0, 10));
  const isWide = width >= 720;

  function completeOnboarding(nextProfile: UserProfile) {
    if (isFreshLogger) {
      clearModeParam();
    }
    setProfile(nextProfile);
    setReminders({
      ...defaultReminderSettings,
      preference: nextProfile.reminderPreference
    });
    setLogs((current) => current.filter(isUserLog));
    setActiveScreen("checkin");
  }

  function saveDailyLog(nextLog: DailyLog) {
    setLogs((current) => {
      const currentUserLogs = current.filter(isUserLog);
      const rest = currentUserLogs.filter((log) => log.date !== nextLog.date);
      return [...rest, { ...nextLog, source: "user" as const }].sort((a, b) => a.date.localeCompare(b.date));
    });
    setActiveScreen("dashboard");
  }

  function openExportFromSupport() {
    setMoreSection("export");
    setActiveScreen("more");
  }

  if (!loaded) {
    return (
      <LinearGradient colors={gradients.app} style={styles.loadingShell}>
        <ActivityIndicator color={colors.navy} />
      </LinearGradient>
    );
  }

  if (!profile) {
    return (
      <LinearGradient colors={gradients.app} style={styles.appBackground}>
        <StatusBar style="dark" />
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.phoneShell, isWide && styles.phoneShellWide]}>
            <OnboardingFlow defaultProfile={loggerStarterProfile} onComplete={completeOnboarding} />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradients.app} style={styles.appBackground}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.phoneShell, isWide && styles.phoneShellWide]}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>Dose & Mood</Text>
              <Text style={styles.headerTitle}>
                {activeScreen === "checkin"
                  ? "Small check-in"
                  : isExampleDemo
                    ? "30-day example"
                    : `Hi ${appProfile.nickname || "there"}`}
              </Text>
              <Text style={styles.medicalLine}>Personal tracking tool, not medical advice.</Text>
            </View>
            <View style={styles.headerActions}>
              <MascotCompanion size="small" phrase="Softly here." />
              <CrisisSupportButton compact onPress={() => setActiveScreen("support")} />
            </View>
          </View>

          <Animated.View style={[styles.content, { opacity: fade }]}>
            {activeScreen === "checkin" && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <DailyCheckIn profile={appProfile} existingLog={todayLog} onSave={saveDailyLog} />
              </ScrollView>
            )}

            {activeScreen === "dashboard" && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <DashboardScreen
                  profile={appProfile}
                  logs={displayLogs}
                  isSampleMode={isSampleMode}
                  demoLabel={isExampleDemo ? "30-day example" : undefined}
                  onLogToday={() => setActiveScreen("checkin")}
                />
              </ScrollView>
            )}

            {activeScreen === "insights" && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <InsightsScreen profile={appProfile} logs={displayLogs} />
              </ScrollView>
            )}

            {activeScreen === "support" && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <SupportScreen
                  profile={appProfile}
                  onProfileChange={setProfile}
                  onOpenExport={openExportFromSupport}
                />
              </ScrollView>
            )}

            {activeScreen === "more" && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <MoreScreen
                  activeSection={moreSection}
                  onSectionChange={setMoreSection}
                  profile={appProfile}
                  onProfileChange={(nextProfile) => setProfile(nextProfile)}
                  logs={displayLogs}
                  reminders={reminders}
                  onRemindersChange={setReminders}
                />
              </ScrollView>
            )}
          </Animated.View>

          <View style={[styles.bottomNav, shadow.soft]}>
            {navItems.map(({ key, label, Icon }) => {
              const active = key === activeScreen;
              return (
                <Pressable
                  key={key}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                  onPress={() => setActiveScreen(key)}
                  style={[styles.navItem, active && styles.navItemActive]}
                >
                  <Icon size={20} color={active ? colors.navy : colors.mutedText} strokeWidth={active ? 2.4 : 2} />
                  <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  appBackground: {
    flex: 1
  },
  loadingShell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  safeArea: {
    flex: 1,
    alignItems: "center"
  },
  phoneShell: {
    width: "100%",
    maxWidth: 430,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 18 : 8
  },
  phoneShellWide: {
    marginVertical: 18,
    borderRadius: 34,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
    backgroundColor: "rgba(255,255,255,0.28)"
  },
  header: {
    minHeight: 104,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingTop: 8
  },
  headerCopy: {
    flex: 1
  },
  eyebrow: {
    color: colors.plum,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  headerTitle: {
    color: colors.navy,
    fontSize: 27,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 3
  },
  medicalLine: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4
  },
  headerActions: {
    width: 116,
    alignItems: "flex-end",
    gap: 8
  },
  content: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 104
  },
  bottomNav: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: Platform.OS === "web" ? 16 : 10,
    minHeight: 70,
    borderRadius: 999,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.84)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.78)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  navItem: {
    flex: 1,
    minHeight: 52,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    gap: 3
  },
  navItemActive: {
    backgroundColor: colors.champagne
  },
  navText: {
    color: colors.mutedText,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "700",
    letterSpacing: 0
  },
  navTextActive: {
    color: colors.navy
  }
});
