import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { Text } from '@/components/ui/text';
import { NEON_GRADIENT } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function NeonButton({ onPress, children, disabled, className, size = 'lg' }) {
  const handle = () => {
    if (disabled || !onPress) return;
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  const heightClass = size === 'lg' ? 'h-14' : 'h-12';

  return (
    <Pressable onPress={handle} disabled={disabled} accessibilityRole="button">
      <View
        className={cn(
          'overflow-hidden rounded-2xl',
          heightClass,
          disabled && 'opacity-40',
          className,
        )}
        style={
          disabled
            ? undefined
            : {
                shadowColor: 'hsl(320 100% 60%)',
                shadowOpacity: 0.5,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 0 },
              }
        }
      >
        <LinearGradient
          colors={NEON_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', inset: 0 }}
        />
        <View className="flex-1 items-center justify-center px-6">
          {typeof children === 'string' ? (
            <Text size="base" weight="bold" className="text-white">
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </View>
    </Pressable>
  );
}
