import React from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

export const Separator = React.forwardRef(
  ({ orientation = 'horizontal', className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        'bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      accessibilityRole="none"
      {...props}
    />
  ),
);

Separator.displayName = 'Separator';
