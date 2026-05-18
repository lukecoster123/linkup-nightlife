import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sparkles, Star } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CITIES } from '@/lib/constants';
import { useStore, isExpired } from '@/lib/store';
import { useNow } from '@/hooks/useNow';
import { ProfileEventList } from '@/components/ProfileEventList';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const profile = useStore((s) => s.profiles.find((p) => p.id === id) ?? null);
  const events = useStore((s) => s.events);
  const attendees = useStore((s) => s.attendees);
  const profiles = useStore((s) => s.profiles);
  const now = useNow(60_000);

  const cityRow = profile?.city ? CITIES.find((c) => c.id === profile.city) : null;

  const { hosting, going } = useMemo(() => {
    if (!profile) return { hosting: [], going: [] };
    const hosted = events.filter((e) => e.host_id === profile.id && !isExpired(e, now));
    const joinedIds = new Set(
      attendees.filter((a) => a.user_id === profile.id).map((a) => a.event_id),
    );
    const goingList = events.filter(
      (e) => joinedIds.has(e.id) && e.host_id !== profile.id && !isExpired(e, now),
    );
    return { hosting: hosted, going: goingList };
  }, [events, attendees, profile, now]);

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['hsl(320 70% 14%)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 260 }}
      />
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="flex-row items-center justify-between px-5 pb-2 pt-1">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-card"
          >
            <ArrowLeft size={18} color="hsl(280 20% 96%)" />
          </Pressable>
          <Text size="sm" weight="bold" className="text-foreground">
            Profile
          </Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/40">
              {profile.photos[0] || profile.avatar_url ? (
                <AvatarImage
                  src={profile.photos[0] ?? profile.avatar_url ?? ''}
                />
              ) : (
                <AvatarFallback>
                  <Text size="2xl" weight="bold">
                    {profile.display_name[0] ?? '?'}
                  </Text>
                </AvatarFallback>
              )}
            </Avatar>
            <View>
              <Text size="2xl" weight="bold" className="text-foreground" style={{ letterSpacing: -0.4 }}>
                {profile.display_name}
                {profile.age != null ? `, ${profile.age}` : ''}
              </Text>
              <Text size="sm" variant="muted">
                {cityRow ? `${cityRow.name}, ${cityRow.state}` : '—'}
              </Text>
            </View>
          </View>

          {profile.photos.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-5"
              contentContainerStyle={{ gap: 10 }}
            >
              {profile.photos.map((p) => (
                <Image
                  key={p}
                  source={{ uri: p }}
                  style={{ width: 110, height: 140, borderRadius: 18 }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          )}

          {profile.bio && (
            <Text size="sm" className="mt-5 leading-6 text-foreground">
              {profile.bio}
            </Text>
          )}

          {profile.interests.length > 0 && (
            <View className="mt-5 gap-2">
              <View className="flex-row items-center gap-1.5">
                <Star size={13} color="hsl(320 95% 70%)" />
                <Text size="xs" weight="bold" className="uppercase text-primary" style={{ letterSpacing: 1.2 }}>
                  Interests
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {profile.interests.map((i) => (
                  <View key={i} className="rounded-full bg-primary px-3 py-1.5">
                    <Text size="xs" weight="bold" className="text-primary-foreground">
                      {i}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {profile.vibes.length > 0 && (
            <View className="mt-4 gap-2">
              <View className="flex-row items-center gap-1.5">
                <Sparkles size={13} color="hsl(190 100% 75%)" />
                <Text size="xs" weight="bold" className="uppercase text-accent" style={{ letterSpacing: 1.2 }}>
                  Vibes
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {profile.vibes.map((v) => (
                  <View key={v} className="rounded-full border border-accent/60 px-3 py-1.5">
                    <Text size="xs" weight="bold" className="text-accent">
                      {v}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View className="mt-6 flex-row gap-3">
            <View className="flex-1 items-center rounded-2xl border border-border bg-card py-4">
              <Text size="2xl" weight="bold" className="text-primary">
                {going.length}
              </Text>
              <Text size="xs" variant="muted">
                Going
              </Text>
            </View>
            <View className="flex-1 items-center rounded-2xl border border-border bg-card py-4">
              <Text size="2xl" weight="bold" className="text-accent">
                {hosting.length}
              </Text>
              <Text size="xs" variant="muted">
                Hosting
              </Text>
            </View>
          </View>

          <ProfileEventList
            title="Hosting"
            events={hosting}
            profiles={profiles}
            attendees={attendees}
            now={now}
            emptyText="No upcoming plans."
          />
          <ProfileEventList
            title="Going"
            events={going}
            profiles={profiles}
            attendees={attendees}
            now={now}
            emptyText="Not on any plans yet."
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
