import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';
import { Platform } from 'react-native';

export const SPRING_CONFIGS = {
  gentle: { damping: 20, stiffness: 120, mass: 1 },
  snappy: { damping: 15, stiffness: 200, mass: 0.8 },
  bouncy: { damping: 10, stiffness: 150, mass: 1 },
  stiff: { damping: 20, stiffness: 300, mass: 1 },
};

export const TIMING_CONFIGS = {
  fast: { duration: 150 },
  normal: { duration: 250 },
  slow: { duration: 400 },
};

export function triggerHaptic(style = 'light') {
  if (Platform.OS === 'web') return;
  const map = {
    light: ImpactFeedbackStyle.Light,
    medium: ImpactFeedbackStyle.Medium,
    heavy: ImpactFeedbackStyle.Heavy,
  };
  impactAsync(map[style]).catch(() => {});
}
