import * as Haptics from "expo-haptics";

export async function lightHaptic() {
  try {
    await Haptics.selectionAsync();
  } catch {
    // Haptics are best-effort in Expo web and simulators.
  }
}

export async function successHaptic() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Haptics are best-effort in Expo web and simulators.
  }
}
