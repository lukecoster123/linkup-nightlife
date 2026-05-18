import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';

import { cn } from '@/lib/utils';

export function GlassPanel({
  className,
  children,
  intensity = 30,
  ...props
}) {
  if (Platform.OS === 'web') {
    return (
      <View
        className={cn(
          'overflow-hidden rounded-3xl border border-white/10 bg-card/60',
          className,
        )}
        style={{ backdropFilter: 'blur(16px)' }}
        {...props}
      >
        {children}
      </View>
    );
  }
  return (
    <BlurView
      intensity={intensity}
      tint="dark"
      className={cn('overflow-hidden rounded-3xl border border-white/10', className)}
    >
      <View {...props}>{children}</View>
    </BlurView>
  );
}
