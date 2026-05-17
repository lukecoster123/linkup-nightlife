import React from 'react';
import { Platform, View, type ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';

import { cn } from '@/lib/utils';

export function GlassPanel({
  className,
  children,
  intensity = 30,
  ...props
}: ViewProps & { intensity?: number }) {
  if (Platform.OS === 'web') {
    return (
      <View
        className={cn(
          'overflow-hidden rounded-3xl border border-white/10 bg-card/60',
          className,
        )}
        style={{ backdropFilter: 'blur(16px)' } as never}
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
