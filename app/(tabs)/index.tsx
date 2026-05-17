import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { EventCard } from '@/components/EventCard';
import { CITIES } from '@/lib/constants';
import { useStore, useCurrentProfile, isExpired } from '@/lib/store';
import { useNow } from '@/hooks/useNow';
import { useLocation } from '@/hooks/useLocation';
import { haversineKm } from '@/lib/geo';

export default function FeedScreen() {
  const profile = useCurrentProfile();
  const events = useStore((s) => s.events);
  const profiles = useStore((s) => s.profiles);
  const attendees = useStore((s) => s.attendees);
  const unit = useStore((s) => s.unit);
  const now = useNow(30_000);
  const { coords } = useLocation();

  const cityRow = profile?.city ? CITIES.find((c) => c.id === profile.city) : null;

  const visible = useMemo(() => {
    const cutoff = Date.now() - 4 * 60 * 60 * 1000;
    const list = events.filter((e) => {
      if (isExpired(e, now)) return false;
      const startsMs = new Date(e.starts_at).getTime();
      return startsMs >= cutoff;
    });

    if (coords) {
      // sort by distance ascending; null distances last
      list.sort((a, b) => {
        const da =
          a.lat != null && a.lng != null
            ? haversineKm(coords, { lat: a.lat, lng: a.lng })
            : Number.POSITIVE_INFINITY;
        const db =
          b.lat != null && b.lng != null
            ? haversineKm(coords, { lat: b.lat, lng: b.lng })
            : Number.POSITIVE_INFINITY;
        return da - db;
      });
    } else {
      list.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }
    return list;
  }, [events, coords, now]);

  return (
    <View className="flex-1 bg-background">
      {/* Top glow */}
      <LinearGradient
        colors={['hsl(320 70% 14%)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 280 } as never}
      />
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mb-6 flex-row items-end justify-between">
            <View>
              <View className="flex-row items-center gap-1.5">
                <Sparkles size={14} color="hsl(320 95% 70%)" />
                <Text size="xs" weight="bold" className="uppercase text-primary" style={{ letterSpacing: 1.5 }}>
                  Tonight&apos;s feed
                </Text>
              </View>
              <Text
                size="3xl"
                weight="bold"
                className="text-foreground"
                style={{ letterSpacing: -0.5 }}
              >
                What&apos;s up{profile ? `, ${profile.display_name}` : ''}?
              </Text>
              {cityRow && (
                <Text size="sm" variant="muted" className="mt-1">
                  {cityRow.name}, {cityRow.state} · live now
                </Text>
              )}
            </View>
          </View>

          {/* Cards */}
          {visible.length === 0 ? (
            <View className="mt-12 items-center gap-2">
              <Text size="lg" weight="bold" className="text-foreground">
                Quiet right now
              </Text>
              <Text size="sm" variant="muted" className="text-center">
                Be the first — drop an event or ask the city.
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {visible.map((e) => (
                <EventCard
                  key={e.id}
                  event={e}
                  host={profiles.find((p) => p.id === e.host_id)}
                  attendees={attendees}
                  userCoords={coords}
                  unit={unit}
                  now={now}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
