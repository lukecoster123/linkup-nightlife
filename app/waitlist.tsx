import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, MapPin } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { NeonButton } from '@/components/NeonButton';
import { CITIES } from '@/lib/constants';
import { useStore } from '@/lib/store';

export default function WaitlistScreen() {
  const router = useRouter();
  const userId = useStore((s) => s.session?.user_id ?? null);
  const profile = useStore((s) =>
    userId ? s.profiles.find((p) => p.id === userId) ?? null : null,
  );
  const joinWaitlist = useStore((s) => s.joinWaitlist);
  const waitlist = useStore((s) => s.waitlist);

  const cityRow = profile?.city ? CITIES.find((c) => c.id === profile.city) : null;
  const alreadyOn = userId && profile?.city
    ? waitlist.some((w) => w.user_id === userId && w.city === profile.city)
    : false;
  const [joined, setJoined] = useState(alreadyOn);

  const onJoin = () => {
    if (!userId || !profile?.city) return;
    joinWaitlist(userId, profile.city);
    setJoined(true);
  };

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['hsl(280 70% 14%)', 'hsl(270 35% 4%)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', inset: 0 } as never}
      />
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 px-6">
        <View className="flex-1 items-center justify-center gap-6">
          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-primary/15">
            <MapPin size={32} color="hsl(320 95% 70%)" />
          </View>
          <View className="items-center gap-2">
            <Text size="3xl" weight="bold" className="text-center text-foreground" style={{ letterSpacing: -0.5 }}>
              {cityRow?.name ?? 'Your city'} is coming soon
            </Text>
            <Text size="base" variant="muted" className="text-center">
              We launch one city at a time. Drop your name and we&apos;ll text you the second LinkUp goes live in {cityRow?.name ?? 'your city'}.
            </Text>
          </View>

          <View className="w-full gap-3 pt-4">
            {joined ? (
              <View className="flex-row items-center justify-center gap-2 rounded-2xl border border-accent/40 bg-accent/15 p-4">
                <Check size={18} color="hsl(190 100% 75%)" />
                <Text size="sm" weight="semibold" className="text-accent">
                  You&apos;re on the waitlist
                </Text>
              </View>
            ) : (
              <NeonButton onPress={onJoin}>
                <Text size="base" weight="bold" className="text-white">
                  Join the waitlist
                </Text>
              </NeonButton>
            )}
            <Button
              variant="outline"
              className="h-12 rounded-2xl border-border"
              onPress={() => router.push('/pick-city')}
            >
              <Text size="sm" weight="semibold">
                Pick a different city
              </Text>
            </Button>
          </View>
        </View>

        <View className="pb-4">
          <Text size="xs" variant="muted" className="text-center">
            Currently live: Greenville, SC.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
