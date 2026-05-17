import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Check,
  Clock3,
  Lock,
  MapPin,
  MessageCircleQuestion,
  Send,
  Users,
} from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';

import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NeonButton } from '@/components/NeonButton';
import { NIGHT_GRADIENT } from '@/lib/constants';
import {
  attendeeCount,
  isAttendee,
  useStore,
  useCurrentUserId,
} from '@/lib/store';
import { useNow, formatCountdown, isUrgent } from '@/hooks/useNow';
import { useLocation } from '@/hooks/useLocation';
import { formatDistance, haversineKm } from '@/lib/geo';
import { cn } from '@/lib/utils';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const userId = useCurrentUserId();
  const { coords } = useLocation();
  const unit = useStore((s) => s.unit);

  const event = useStore((s) => s.events.find((e) => e.id === id) ?? null);
  const profiles = useStore((s) => s.profiles);
  const attendees = useStore((s) => s.attendees);
  const messages = useStore((s) => s.messages);
  const joinEvent = useStore((s) => s.joinEvent);
  const leaveEvent = useStore((s) => s.leaveEvent);
  const sendMessage = useStore((s) => s.sendMessage);

  const now = useNow(30_000);
  const [body, setBody] = useState('');
  const scrollRef = useRef<ScrollView | null>(null);

  const host = event ? profiles.find((p) => p.id === event.host_id) : null;
  const joined = useMemo(
    () => (event ? isAttendee(attendees, event.id, userId) : false),
    [attendees, event, userId],
  );
  const eventAttendees = useMemo(
    () =>
      event
        ? attendees
            .filter((a) => a.event_id === event.id)
            .map((a) => profiles.find((p) => p.id === a.user_id))
            .filter(Boolean)
        : [],
    [attendees, profiles, event],
  );
  const eventMessages = useMemo(
    () => (event ? messages.filter((m) => m.event_id === event.id) : []),
    [messages, event],
  );

  // Realtime sim: scroll to bottom when new message arrives.
  useEffect(() => {
    if (joined && scrollRef.current) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    }
  }, [eventMessages.length, joined]);

  if (!event) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text>Event not found.</Text>
      </View>
    );
  }

  const isQuestion = event.kind === 'question';
  const distance =
    coords && event.lat != null && event.lng != null
      ? formatDistance(haversineKm(coords, { lat: event.lat, lng: event.lng }), unit)
      : null;
  const urgent = isUrgent(event.expires_at, now);
  const count = attendeeCount(attendees, event.id);

  const onJoin = () => {
    if (!userId) return;
    if (joined) {
      // host can't leave
      if (event.host_id === userId) return;
      leaveEvent(event.id, userId);
    } else {
      joinEvent(event.id, userId);
    }
  };

  const onSend = () => {
    if (!userId) return;
    if (!body.trim()) return;
    sendMessage(event.id, userId, body);
    setBody('');
  };

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View className="relative h-72 w-full">
            {isQuestion || !event.cover_url ? (
              <LinearGradient
                colors={
                  isQuestion
                    ? ['hsl(280 70% 22%)', 'hsl(320 80% 16%)', 'hsl(190 70% 18%)']
                    : NIGHT_GRADIENT
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ position: 'absolute', inset: 0 } as never}
              />
            ) : (
              <Image
                source={{ uri: event.cover_url }}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' } as never}
                resizeMode="cover"
              />
            )}
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(20,12,28,0.85)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ position: 'absolute', inset: 0 } as never}
            />

            <SafeAreaView edges={['top']} style={{ position: 'absolute', left: 12, right: 12 } as never}>
              <View className="flex-row items-center justify-between">
                <Pressable
                  onPress={() => router.back()}
                  className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
                >
                  <ArrowLeft size={18} color="white" />
                </Pressable>
                <View
                  className={cn(
                    'flex-row items-center gap-1.5 rounded-full border px-3 py-1.5',
                    urgent ? 'border-primary bg-primary/20' : 'border-white/15 bg-black/50',
                  )}
                >
                  <Clock3 size={12} color={urgent ? 'hsl(320 95% 75%)' : 'white'} />
                  <Text
                    size="xs"
                    weight="bold"
                    className={urgent ? 'text-primary' : 'text-white'}
                  >
                    expires in {formatCountdown(event.expires_at, now)}
                  </Text>
                </View>
              </View>
            </SafeAreaView>
          </View>

          {/* Body */}
          <View className="-mt-6 gap-4 rounded-t-3xl bg-background px-5 pt-6">
            {/* Vibe / Question badge */}
            <View className="flex-row items-center gap-2">
              {isQuestion ? (
                <View className="flex-row items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1.5">
                  <MessageCircleQuestion size={12} color="hsl(190 100% 75%)" />
                  <Text size="xs" weight="bold" className="text-accent">
                    Question
                  </Text>
                </View>
              ) : event.vibe ? (
                <View className="rounded-full bg-primary/20 px-3 py-1.5">
                  <Text size="xs" weight="bold" className="text-primary">
                    {event.vibe}
                  </Text>
                </View>
              ) : null}
              {host && (
                <Pressable
                  onPress={() => router.push(`/u/${host.id}`)}
                  className="flex-row items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5"
                >
                  <Avatar className="h-6 w-6">
                    {host.avatar_url ? (
                      <AvatarImage src={host.avatar_url} />
                    ) : (
                      <AvatarFallback>
                        <Text size="xs" weight="bold">
                          {host.display_name[0]}
                        </Text>
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Text size="xs" weight="semibold">
                    Hosted by {host.display_name}
                  </Text>
                </Pressable>
              )}
            </View>

            <Text size="2xl" weight="bold" className="text-foreground" style={{ letterSpacing: -0.4 }}>
              {event.title}
            </Text>

            {!isQuestion && (
              <View className="gap-1.5">
                {event.venue && (
                  <View className="flex-row items-center gap-2">
                    <MapPin size={15} color="hsl(280 10% 65%)" />
                    <Text size="sm" className="text-foreground">
                      {event.venue}
                    </Text>
                    {distance && (
                      <Text size="sm" variant="muted">
                        · {distance}
                      </Text>
                    )}
                  </View>
                )}
                {event.time_text && (
                  <View className="flex-row items-center gap-2">
                    <Clock3 size={15} color="hsl(280 10% 65%)" />
                    <Text size="sm" className="text-foreground">
                      {event.time_text}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View className="flex-row items-center gap-2">
              <Users size={15} color="hsl(190 100% 75%)" />
              <Text size="sm" weight="semibold" className="text-accent">
                {count} {isQuestion ? 'in thread' : 'going'}
              </Text>
              {/* attendee avatars */}
              <View className="ml-2 flex-row">
                {eventAttendees.slice(0, 5).map((a, idx) =>
                  a ? (
                    <Avatar
                      key={a.id}
                      className="h-6 w-6 border border-background"
                      style={{ marginLeft: idx === 0 ? 0 : -8 } as never}
                    >
                      {a.avatar_url ? (
                        <AvatarImage src={a.avatar_url} />
                      ) : (
                        <AvatarFallback>
                          <Text size="xs" weight="bold">
                            {a.display_name[0]}
                          </Text>
                        </AvatarFallback>
                      )}
                    </Avatar>
                  ) : null,
                )}
              </View>
            </View>

            {event.description ? (
              <Text size="sm" className="leading-6 text-foreground">
                {event.description}
              </Text>
            ) : null}

            {/* Join button */}
            <View className="mt-2">
              {joined ? (
                <View
                  className="h-14 flex-row items-center justify-center gap-2 rounded-2xl border border-accent/40 bg-accent/15"
                >
                  <Check size={18} color="hsl(190 100% 75%)" />
                  <Text size="base" weight="bold" className="text-accent">
                    {isQuestion ? 'You\u2019re in' : 'You\u2019re going'}
                  </Text>
                </View>
              ) : (
                <NeonButton onPress={onJoin}>
                  {isQuestion ? 'Join thread' : 'I\u2019m in'}
                </NeonButton>
              )}
            </View>
          </View>

          {/* Chat */}
          <View className="mt-8 px-5">
            <Text size="sm" weight="bold" className="uppercase text-primary" style={{ letterSpacing: 1.2 }}>
              {isQuestion ? 'Thread' : 'Group chat'}
            </Text>
            <Text size="xs" variant="muted" className="mt-1 mb-4">
              {joined
                ? 'Visible only to attendees · realtime'
                : 'Join to unlock messages'}
            </Text>

            {!joined ? (
              <View className="items-center gap-3 rounded-2xl border border-border bg-card p-6">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                  <Lock size={20} color="hsl(280 10% 65%)" />
                </View>
                <Text size="sm" weight="semibold" className="text-center">
                  Tap join to see and send messages
                </Text>
              </View>
            ) : eventMessages.length === 0 ? (
              <View className="items-center gap-2 rounded-2xl border border-border bg-card p-6">
                <Text size="sm" variant="muted" className="text-center">
                  No messages yet — say hi 👋
                </Text>
              </View>
            ) : (
              <View className="gap-2">
                {eventMessages.map((m) => {
                  const sender = profiles.find((p) => p.id === m.user_id);
                  const mine = m.user_id === userId;
                  return (
                    <View
                      key={m.id}
                      className={cn('max-w-[80%]', mine ? 'self-end' : 'self-start')}
                    >
                      {!mine && sender && (
                        <Text size="xs" variant="muted" className="mb-0.5 ml-3">
                          {sender.display_name}
                        </Text>
                      )}
                      <View
                        className={cn(
                          'rounded-3xl px-4 py-2.5',
                          mine
                            ? 'rounded-br-md bg-primary'
                            : 'rounded-bl-md border border-border bg-card',
                        )}
                      >
                        <Text
                          size="sm"
                          className={mine ? 'text-primary-foreground' : 'text-foreground'}
                        >
                          {m.body}
                        </Text>
                      </View>
                      <Text
                        size="xs"
                        variant="muted"
                        className={cn('mt-1 text-[10px]', mine ? 'text-right mr-2' : 'ml-3')}
                      >
                        {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>

        {joined && (
          <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'hsl(270 35% 4%)' } as never}>
            <View className="flex-row items-center gap-2 border-t border-border bg-card px-4 py-3">
              <TextInput
                value={body}
                onChangeText={setBody}
                placeholder="Say something\u2026"
                placeholderTextColor="hsl(280 10% 50%)"
                onSubmitEditing={onSend}
                className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-foreground"
                style={{
                  fontFamily: 'Inter_400Regular',
                  color: 'hsl(280 20% 96%)',
                } as never}
              />
              <Pressable
                onPress={onSend}
                disabled={!body.trim()}
                className="h-11 w-11 items-center justify-center rounded-full bg-primary"
                style={{ opacity: body.trim() ? 1 : 0.4 } as never}
              >
                <Send size={16} color="white" />
              </Pressable>
            </View>
          </SafeAreaView>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
