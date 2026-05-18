import { Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { cn } from '@/lib/utils';

export function BlurOverlay({
  visible,
  intensity = 20,
  tint = 'dark',
  onPress,
  className,
}) {
  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      className={cn('absolute inset-0 z-50', className)}
      style={StyleSheet.absoluteFill}
    >
      <Pressable
        onPress={onPress}
        style={StyleSheet.absoluteFill}
        accessibilityRole="button"
        accessibilityLabel="Close overlay"
      >
        <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      </Pressable>
    </Animated.View>
  );
}
