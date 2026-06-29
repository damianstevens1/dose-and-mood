import { Platform } from "react-native";

export const colors = {
  ivory: "#FFF9F1",
  porcelain: "#FFFDF9",
  blush: "#F7CFD8",
  blushDeep: "#DCA4AE",
  lavender: "#D9D1F3",
  lavenderDeep: "#9588C8",
  sage: "#C7D9C5",
  sageDeep: "#7F9B80",
  champagne: "#F3E1BE",
  champagneDeep: "#C8A968",
  navy: "#18213B",
  softNavy: "#334061",
  plum: "#7D6688",
  roseText: "#815763",
  mutedText: "#7D7B84",
  line: "rgba(24,33,59,0.10)",
  whiteGlass: "rgba(255,255,255,0.72)",
  blushGlass: "rgba(247,207,216,0.38)",
  danger: "#9B354A",
  success: "#597A5D",
  warning: "#9C713D"
};

export const gradients = {
  app: [colors.ivory, "#FBEEF0", "#F0EEF9", "#EFF6EA"] as const,
  hero: ["#FFF8EE", "#F7D8E0", "#E7E0FA"] as const,
  navyButton: ["#27304E", "#18213B"] as const,
  support: ["#FFF8EE", "#F4D7DD"] as const,
  sage: ["#EFF6EA", "#DDECDC"] as const,
  lavender: ["#F5F2FF", "#DED7F4"] as const,
  champagne: ["#FFF8E8", "#F0DDB5"] as const
};

export const shadow = {
  soft: Platform.select({
    ios: {
      shadowColor: "#5F5269",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.12,
      shadowRadius: 24
    },
    android: {
      elevation: 8
    },
    default: {
      shadowColor: "#5F5269",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.1,
      shadowRadius: 20
    }
  }),
  card: Platform.select({
    ios: {
      shadowColor: "#64576B",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.09,
      shadowRadius: 18
    },
    android: {
      elevation: 5
    },
    default: {
      shadowColor: "#64576B",
      shadowOffset: { width: 0, height: 9 },
      shadowOpacity: 0.08,
      shadowRadius: 16
    }
  })
};

export const cardStyle = {
  borderRadius: 8,
  backgroundColor: colors.whiteGlass,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.74)"
};
