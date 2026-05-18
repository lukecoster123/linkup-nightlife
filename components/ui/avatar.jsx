import { createContext, useContext, useMemo, useState } from 'react';
import { Image, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Text } from './text';

const avatarVariants = cva(
  'relative items-center justify-center overflow-hidden rounded-full bg-muted',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-14 w-14',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

const AvatarContext = createContext({ loaded: false, setLoaded: (_) => {} });

export function Avatar({ size, className, children, ...props }) {
  const [loaded, setLoaded] = useState(false);

  const contextValue = useMemo(() => ({ loaded, setLoaded }), [loaded]);

  return (
    <AvatarContext.Provider value={contextValue}>
      <View className={cn(avatarVariants({ size }), className)} {...props}>
        {children}
      </View>
    </AvatarContext.Provider>
  );
}

export function AvatarImage({ src, alt }) {
  const { setLoaded } = useContext(AvatarContext);

  return (
    <Animated.View entering={FadeIn.duration(300)} className="absolute inset-0">
      <Image
        source={{ uri: src }}
        style={{ width: '100%', height: '100%' }}
        accessibilityLabel={alt}
        onLoad={() => setLoaded(true)}
      />
    </Animated.View>
  );
}

export function AvatarFallback({ className, children }) {
  const { loaded } = useContext(AvatarContext);

  if (loaded) return null;

  return (
    <View className={cn('flex-1 items-center justify-center', className)}>
      <Text size="sm" weight="medium" variant="muted">
        {children}
      </Text>
    </View>
  );
}
