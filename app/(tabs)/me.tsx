import React, { useMemo, useState } from 'react';
import { Image, Linking, Platform, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  HelpCircle,
  LogOut,
  Pencil,
  Plus,
  Sparkles,
  Star,
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CITIES } from '@/lib/constants';
import { useStore, useCurrentProfile, useCurrentUserId, isExpired } from '@/lib/store';
import { useNow } from '@/hooks/useNow';
import { ProfileEditSheet } from '@/components/ProfileEditSheet';
import { ProfileEventList } from '@/components/ProfileEventList';

export default function MeScreen() {
  const router = useRouter();
  const userId = useCurrentUserId();
  const profile = useCurrentProfile();
  const events = useStore((s) => s.events);
  const attendees = useStore((s) => s.attendees);
  const profiles = useStore((s) => s.profiles);
  const signOut = useStore((s) => s.signOut);
  const now = useNow(60_000);

  const [editing, setEditing] = useState(false);

  const cityRow = profile?.city ? CITIES.find((c) => c.id === profile.city) : null;

  const { hosting, going } = useMemo(() => {
    if (!userId) return { hosting: [], going: [] };
    const hosted = events.filter((e) => e.host_id === userId && !isExpired(e, now));
    const joinedIds = new Set(
      attendees.filter((a) => a.user_id === userId).map((a) => a.event_id),
    );
    const goingList = events.filter(
      (e) => joinedIds.has(e.id) && e.host_id !== userId && !isExpired(e, now),
    );
    return { hosting: hosted, going: goingList };
  }, [events, attendees, userId, now]);

  if (!profile) return null;

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['hsl(320 70% 14%)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 260 } as never}
      />
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header row */}
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center gap-4">
              <Avatar
                className="h-20 w-20 border-2 border-primary/40"
                style={
                  {
                    shadowColor: 'hsl(320 100% 70%)',
                    shadowOpacity: 0.35,
                    shadowRadius: 18,
                  } as never
                }
              >
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
            <Pressable
              onPress={() => setEditing(true)}
              className="h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card"
            >
              <Pencil size={16} color="hsl(280 20% 96%)" />
            </Pressable>
          </View>

          {/* Photo gallery */}
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
                  style={{ width: 110, height: 140, borderRadius: 18 } as never}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          )}

          {/* Bio */}
          {profile.bio ? (
            <Text size="sm" className="mt-5 leading-6 text-foreground">
              {profile.bio}
            </Text>
          ) : (
            <Text size="sm" variant="muted" className="mt-5">
              Add a bio so people know what you&apos;re about.
            </Text>
          )}

          {/* Interests + Vibes */}
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

          {/* Stats */}
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

          {/* Hosting list */}
          <ProfileEventList
            title="Hosting"
            events={hosting}
            profiles={profiles}
            attendees={attendees}
            now={now}
            emptyText="Nothing on the calendar."
          />
          {/* Going list */}
          <ProfileEventList
            title="Going"
            events={going}
            profiles={profiles}
            attendees={attendees}
            now={now}
            emptyText="Not on any plans yet."
          />

          {/* Actions */}
          <View className="mt-6 gap-2">
            <Button
              onPress={() => router.push('/create')}
              className="h-12 flex-row gap-2 rounded-2xl"
              variant="outline"
            >
              <Plus size={16} color="hsl(280 20% 96%)" />
              <Text size="sm" weight="semibold">
                New event
              </Text>
            </Button>
            <Button
              variant="ghost"
              className="h-12 flex-row gap-2 rounded-2xl"
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.location.href = 'mailto:support@navlinkup.com';
                } else {
                  void Linking.openURL('mailto:support@navlinkup.com');
                }
              }}
            >
              <HelpCircle size={16} color="hsl(280 20% 96%)" />
              <Text size="sm" weight="semibold">
                Contact support
              </Text>
            </Button>
            <Button
              variant="ghost"
              className="h-12 flex-row gap-2 rounded-2xl"
              onPress={() => {
                signOut();
                router.replace('/auth');
              }}
            >
              <LogOut size={16} color="hsl(0 84% 70%)" />
              <Text size="sm" weight="semibold" className="text-destructive">
                Sign out
              </Text>
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>

      <ProfileEditSheet visible={editing} onClose={() => setEditing(false)} profile={profile} />
    </View>
  );
}
