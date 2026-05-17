import React, { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, MapPin } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { NeonButton } from '@/components/NeonButton';
import { DURATIONS, VIBES } from '@/lib/constants';
import { useStore, useCurrentUserId } from '@/lib/store';
import { useLocation } from '@/hooks/useLocation';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1571266028243-d220c6a8266c?w=900&q=80',
  'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=900&q=80',
  'https://images.unsplash.com/photo-1485872299712-f7e525a78f3a?w=900&q=80',
  'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=900&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&q=80',
];

export default function CreateScreen() {
  const router = useRouter();
  const toast = useToast();
  const userId = useCurrentUserId();
  const createEvent = useStore((s) => s.createEvent);
  const { coords } = useLocation();

  const [mode, setMode] = useState<'event' | 'question'>('event');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [timeText, setTimeText] = useState('');
  const [vibe, setVibe] = useState<string | null>(null);
  const [durationHours, setDurationHours] = useState(12);
  const [coverUrl, setCoverUrl] = useState<string | null>(COVER_PRESETS[0] ?? null);

  const reset = () => {
    setTitle('');
    setDescription('');
    setVenue('');
    setTimeText('');
    setVibe(null);
    setDurationHours(12);
    setCoverUrl(COVER_PRESETS[0] ?? null);
  };

  const submit = () => {
    if (!userId) return;
    if (!title.trim()) {
      toast.toast({ title: 'Add a title', variant: 'destructive' });
      return;
    }
    if (mode === 'event' && !coords) {
      toast.toast({
        title: 'Location needed',
        description: 'We need GPS to drop an event nearby.',
        variant: 'destructive',
      });
      return;
    }
    const id = createEvent({
      host_id: userId,
      kind: mode,
      title: title.trim(),
      description: description.trim(),
      venue: mode === 'event' ? venue.trim() || null : null,
      time_text: mode === 'event' ? timeText.trim() || null : null,
      vibe: mode === 'event' ? vibe : null,
      cover_url: mode === 'event' ? coverUrl : null,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      durationHours: mode === 'question' ? 12 : durationHours,
    });
    toast.toast({
      title: mode === 'event' ? 'Dropped!' : 'Question posted',
      description: 'It\u2019s live in the feed.',
    });
    reset();
    void id;
    router.replace('/');
  };

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['hsl(320 60% 12%)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200 } as never}
      />
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            size="3xl"
            weight="bold"
            className="text-foreground"
            style={{ letterSpacing: -0.5 }}
          >
            Drop something
          </Text>
          <Text size="sm" variant="muted" className="mt-1">
            Auto-expires in {mode === 'question' ? '12h' : `${durationHours}h`}.
          </Text>

          {/* Mode toggle */}
          <View className="mt-5 flex-row rounded-2xl border border-border bg-card p-1">
            {([
              ['event', 'Drop event'],
              ['question', 'Ask question'],
            ] as const).map(([m, label]) => {
              const active = mode === m;
              return (
                <Pressable
                  key={m}
                  onPress={() => setMode(m)}
                  className="flex-1 items-center justify-center rounded-xl py-3"
                  style={
                    active
                      ? ({ backgroundColor: 'hsl(320 95% 60% / 0.2)' } as never)
                      : undefined
                  }
                >
                  <Text
                    size="sm"
                    weight="bold"
                    className={active ? 'text-primary' : 'text-muted-foreground'}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Event-only: cover */}
          {mode === 'event' && (
            <View className="mt-6 gap-2">
              <Text size="sm" weight="semibold" className="text-foreground">
                Cover image
              </Text>
              <Pressable
                onPress={() => {
                  // rotate through presets to simulate picker
                  const idx = coverUrl ? COVER_PRESETS.indexOf(coverUrl) : -1;
                  const next = COVER_PRESETS[(idx + 1) % COVER_PRESETS.length] ?? null;
                  setCoverUrl(next);
                }}
                className="h-44 items-center justify-center overflow-hidden rounded-3xl border border-border bg-card"
              >
                {coverUrl ? (
                  <>
                    <Image
                      source={{ uri: coverUrl }}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' } as never}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.55)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={{ position: 'absolute', inset: 0 } as never}
                    />
                    <View className="absolute bottom-3 left-3 flex-row items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5">
                      <Camera size={12} color="white" />
                      <Text size="xs" weight="semibold" className="text-white">
                        Tap to change
                      </Text>
                    </View>
                  </>
                ) : (
                  <View className="items-center gap-1.5">
                    <Camera size={24} color="hsl(280 10% 65%)" />
                    <Text size="sm" variant="muted">
                      Add a cover
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          )}

          {/* Title */}
          <View className="mt-5 gap-2">
            <Text size="sm" weight="semibold" className="text-foreground">
              {mode === 'event' ? 'Title' : 'Your question'}
            </Text>
            <Input
              placeholder={
                mode === 'event'
                  ? 'Rooftop sunset @ Up On The Roof'
                  : 'Anyone know a late-night taco spot?'
              }
              value={title}
              onChangeText={setTitle}
              className="h-12 rounded-2xl"
            />
          </View>

          {/* Event-only: venue, time, vibe, duration */}
          {mode === 'event' && (
            <>
              <View className="mt-4 gap-2">
                <Text size="sm" weight="semibold" className="text-foreground">
                  Venue / address
                </Text>
                <Input
                  placeholder="Up On The Roof, Greenville SC"
                  value={venue}
                  onChangeText={setVenue}
                  className="h-12 rounded-2xl"
                />
              </View>

              <View className="mt-4 gap-2">
                <Text size="sm" weight="semibold" className="text-foreground">
                  When
                </Text>
                <Input
                  placeholder="tonight 10pm"
                  value={timeText}
                  onChangeText={setTimeText}
                  className="h-12 rounded-2xl"
                />
              </View>

              <View className="mt-4 gap-2">
                <Text size="sm" weight="semibold" className="text-foreground">
                  Vibe
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {VIBES.map((v) => {
                    const active = v === vibe;
                    return (
                      <Pressable
                        key={v}
                        onPress={() => setVibe(active ? null : v)}
                        className={cn(
                          'rounded-full border px-4 py-2',
                          active
                            ? 'border-transparent bg-primary'
                            : 'border-border bg-card',
                        )}
                      >
                        <Text
                          size="xs"
                          weight="bold"
                          className={active ? 'text-primary-foreground' : 'text-foreground'}
                        >
                          {v}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="mt-4 gap-2">
                <Text size="sm" weight="semibold" className="text-foreground">
                  Expires in
                </Text>
                <View className="flex-row gap-2">
                  {DURATIONS.map((d) => {
                    const active = d.hours === durationHours;
                    return (
                      <Pressable
                        key={d.hours}
                        onPress={() => setDurationHours(d.hours)}
                        className={cn(
                          'flex-1 items-center rounded-xl border py-2.5',
                          active
                            ? 'border-accent bg-accent/15'
                            : 'border-border bg-card',
                        )}
                      >
                        <Text
                          size="sm"
                          weight="bold"
                          className={active ? 'text-accent' : 'text-foreground'}
                        >
                          {d.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </>
          )}

          {/* Description */}
          <View className="mt-4 gap-2">
            <Text size="sm" weight="semibold" className="text-foreground">
              {mode === 'event' ? 'Description' : 'Add context (optional)'}
            </Text>
            <Input
              placeholder={
                mode === 'event'
                  ? 'Cocktails, sunset, then we move downtown.'
                  : 'Bonus points for cheap tacos.'
              }
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              className="min-h-[88px] rounded-2xl py-3"
              style={{ textAlignVertical: 'top' } as never}
            />
          </View>

          {/* Geo status */}
          {mode === 'event' && (
            <View className="mt-4 flex-row items-center gap-2 rounded-2xl border border-border bg-card p-3">
              <MapPin size={14} color={coords ? 'hsl(190 100% 75%)' : 'hsl(0 84% 60%)'} />
              <Text
                size="xs"
                className={coords ? 'text-accent' : 'text-destructive'}
                weight="semibold"
              >
                {coords ? 'Location locked in' : 'Waiting for GPS\u2026'}
              </Text>
            </View>
          )}

          <View className="mt-6">
            <NeonButton onPress={submit} disabled={!title.trim() || (mode === 'event' && !coords)}>
              {mode === 'event' ? 'Drop it' : 'Ask the city'}
            </NeonButton>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
