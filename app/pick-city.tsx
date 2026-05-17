import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, MapPin } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { CITIES } from '@/lib/constants';
import { useStore } from '@/lib/store';

export default function PickCityScreen() {
  const router = useRouter();
  const userId = useStore((s) => s.session?.user_id ?? null);
  const setCity = useStore((s) => s.setCity);

  const choose = (id: (typeof CITIES)[number]['id'], active: boolean) => {
    if (!userId) return;
    setCity(userId, id);
    router.replace(active ? '/' : '/waitlist');
  };

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['hsl(320 70% 14%)', 'hsl(270 35% 4%)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={{ position: 'absolute', inset: 0 } as never}
      />
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}>
          <View className="gap-2">
            <Text size="3xl" weight="bold" className="text-foreground" style={{ letterSpacing: -0.5 }}>
              Pick your city
            </Text>
            <Text size="base" variant="muted">
              We only show plans happening near you.
            </Text>
          </View>

          <View className="mt-8 gap-3">
            {CITIES.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => choose(c.id, c.active)}
                className="flex-row items-center justify-between rounded-2xl border border-border bg-card p-4"
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary/15">
                    <MapPin
                      size={18}
                      color={c.active ? 'hsl(320 95% 70%)' : 'hsl(280 10% 60%)'}
                    />
                  </View>
                  <View>
                    <Text size="base" weight="semibold" className="text-foreground">
                      {c.name}, {c.state}
                    </Text>
                    <Text size="xs" variant="muted">
                      {c.active ? 'Live' : 'Coming soon · join waitlist'}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color="hsl(280 10% 60%)" />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
