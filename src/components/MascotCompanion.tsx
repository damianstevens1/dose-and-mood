import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { colors, shadow } from "../constants/theme";

const mascotImage = require("../../assets/wellness-moon-cat.png");

type Props = {
  size?: "small" | "large";
  phrase?: string;
};

export function MascotCompanion({ size = "large", phrase = "One soft check-in." }: Props) {
  const breath = useRef(new Animated.Value(0)).current;
  const isSmall = size === "small";

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true
        })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [breath]);

  const scale = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.035]
  });

  return (
    <View style={[styles.wrap, isSmall && styles.wrapSmall]}>
      <Animated.View style={[styles.mascot, isSmall && styles.mascotSmall, { transform: [{ scale }] }, shadow.card]}>
        <Image source={mascotImage} style={styles.image} resizeMode="cover" />
      </Animated.View>
      {!isSmall ? <Text style={styles.phrase}>{phrase}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  wrapSmall: {
    gap: 0
  },
  mascot: {
    width: 128,
    height: 128,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.porcelain,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.78)"
  },
  mascotSmall: {
    width: 60,
    height: 60,
    borderRadius: 20
  },
  image: {
    width: "100%",
    height: "100%"
  },
  phrase: {
    color: colors.plum,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    textAlign: "center"
  }
});
