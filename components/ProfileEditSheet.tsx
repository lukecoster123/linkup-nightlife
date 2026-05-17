import React, { useState } from 'react';
import {
  Image as RNImage,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { NeonButton } from '@/components/NeonButton';
import { useStore, type Profile } from '@/lib/store';
import { cn } from '@/lib/utils';

const INTEREST_OPTS = [
  'Music',
  'Coffee',
  'Whiskey',
  'Tacos',
  'Sushi',
  'Climbing',
  'Hiking',
  'DJ',
  'Vinyl',
  'Karaoke',
  'Photography',
  'Reading',
];
const VIBE_OPTS = ['Club', 'Bar', 'House Party', 'Live Music', 'Rooftop', 'Underground', 'After'];
const PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
];

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: Profile;
};

export function ProfileEditSheet({ visible, onClose, profile }: Props) {
  const updateProfile = useStore((s) => s.updateProfile);

  const [displayName, setDisplayName] = useState(profile.display_name);
  const [age, setAge] = useState(profile.age?.toString() ?? '');
  const [bio, setBio] = useState(profile.bio);
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [vibes, setVibes] = useState<string[]>(profile.vibes);
  const [photos, setPhotos] = useState<string[]>(profile.photos);

  const toggle = (
    arr: string[],
    setArr: (v: string[]) => void,
    value: string,
  ) => {
    setArr(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);
  };

  const save = () => {
    updateProfile(profile.id, {
      display_name: displayName.trim() || profile.display_name,
      age: age.trim() ? Number.parseInt(age, 10) || null : null,
      bio: bio.trim(),
      interests,
      vibes,
      photos,
      avatar_url: photos[0] ?? profile.avatar_url,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="max-h-[90%] rounded-t-3xl border-t border-border bg-card"
        >
          <View className="flex-row items-center justify-between border-b border-border px-5 py-4">
            <Text size="lg" weight="bold">
              Edit profile
            </Text>
            <Pressable
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full bg-muted"
            >
              <X size={16} color="hsl(280 20% 96%)" />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32, gap: 16 }}>
            <Field label="Display name">
              <Input value={displayName} onChangeText={setDisplayName} className="h-12 rounded-2xl" />
            </Field>
            <Field label="Age">
              <Input
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                className="h-12 rounded-2xl"
                placeholder="e.g. 24"
              />
            </Field>
            <Field label="Bio">
              <Input
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                placeholder="What do you like to do?"
                className="min-h-[88px] rounded-2xl py-3"
                style={{ textAlignVertical: 'top' } as never}
              />
            </Field>

            <Field label="Photos">
              <View className="flex-row flex-wrap gap-2">
                {PHOTO_PRESETS.map((p) => {
                  const active = photos.includes(p);
                  return (
                    <Pressable
                      key={p}
                      onPress={() => toggle(photos, setPhotos, p)}
                      className={cn(
                        'h-20 w-20 overflow-hidden rounded-2xl border-2',
                        active ? 'border-primary' : 'border-transparent',
                      )}
                      style={{ opacity: active ? 1 : 0.55 } as never}
                    >
                      <RNImage
                        source={{ uri: p }}
                        style={{ width: '100%', height: '100%' } as never}
                        resizeMode="cover"
                      />
                    </Pressable>
                  );
                })}
              </View>
              <Text size="xs" variant="muted" className="mt-1">
                Tap to toggle. The first selected photo is your avatar.
              </Text>
            </Field>

            <Field label="Interests">
              <ChipRow
                opts={INTEREST_OPTS}
                values={interests}
                onToggle={(v) => toggle(interests, setInterests, v)}
                variant="filled"
              />
            </Field>
            <Field label="Vibes">
              <ChipRow
                opts={VIBE_OPTS}
                values={vibes}
                onToggle={(v) => toggle(vibes, setVibes, v)}
                variant="outline"
              />
            </Field>

            <View className="mt-4">
              <NeonButton onPress={save}>
                <Text size="base" weight="bold" className="text-white">
                  Save
                </Text>
              </NeonButton>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text size="xs" weight="bold" className="uppercase text-muted-foreground" style={{ letterSpacing: 1.2 }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

function ChipRow({
  opts,
  values,
  onToggle,
  variant,
}: {
  opts: string[];
  values: string[];
  onToggle: (v: string) => void;
  variant: 'filled' | 'outline';
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {opts.map((o) => {
        const active = values.includes(o);
        if (variant === 'filled') {
          return (
            <Pressable
              key={o}
              onPress={() => onToggle(o)}
              className={cn(
                'rounded-full px-3 py-1.5',
                active ? 'bg-primary' : 'border border-border bg-card',
              )}
            >
              <Text
                size="xs"
                weight="bold"
                className={active ? 'text-primary-foreground' : 'text-foreground'}
              >
                {o}
              </Text>
            </Pressable>
          );
        }
        return (
          <Pressable
            key={o}
            onPress={() => onToggle(o)}
            className={cn(
              'rounded-full border px-3 py-1.5',
              active ? 'border-accent bg-accent/15' : 'border-border bg-card',
            )}
          >
            <Text
              size="xs"
              weight="bold"
              className={active ? 'text-accent' : 'text-foreground'}
            >
              {o}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Tiny image helper to keep the JSX clean — kept as a no-op export removed.

