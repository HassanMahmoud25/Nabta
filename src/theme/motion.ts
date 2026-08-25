import { Easing, ReduceMotion } from "react-native-reanimated";
export const motion = {
  duration: {
    instant: 90,
    quick: 160,
    standard: 260,
    reveal: 420,
    celebration: 720,
  },
  easing: {
    standard: Easing.bezier(0.2, 0, 0, 1),
    emphasized: Easing.bezier(0.16, 1, 0.3, 1),
  },
  spring: {
    damping: 16,
    stiffness: 230,
    mass: 0.7,
    reduceMotion: ReduceMotion.System,
  },
} as const;
