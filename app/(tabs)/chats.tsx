import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, MessageCircleQuestion } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { useStore, useCurrentUserId, isExpired } from '@/lib/store';
import { useNow } from '@/hooks/useNow';
import { NIGHT_GRADIENT } from '@/lib/constants';

export default function ChatsScreen() {
  const router = useRouter();
  const userId = useCurrentUserId();
  const events = useStore((s) => s.events);
  const attendees = useStore((s) => s.attendees);
  const messages = useStore((s) => s.messages);
  const profiles = useStore((s) => s.profiles);
  const now = useNow(30_000);

  const inbox = useMemo(() => {
    if (!userId) return [];
    const myEventIds = new Set(
      attendees.filter((a) => a.user_id === userId).map((a) => a.event_id),
    );

    type Row = {
      event: (typeof events)[number];
      lastMsg: (typeof messages)[number] | null;
      lastTs: number;
    };
    const rows: Row[] = [];
    for (const e of events) {
      if (!myEventIds.has(e.id)) continue;
      if (isExpired(e, now)) continue;
      const msgs = messages.filter((m) => m.event_id === e.id);
      const last = msgs.length ? msgs[msgs.length - 1]! : null;
      rows.push({
        event: e,
        lastMsg: last,
        lastTs: last
          ? new Date(last.created_at).getTime()
          : new Date(e.created_at).getTime(),
      });
    }
    rows.sort((a, b) => b.lastTs - a.lastTs);
    return rows;
  }, [userId, events, attendees, messages, now]);

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['hsl(190 60% 12%)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 220 } as never}
      />
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100 }}
        >
          <Text
            size="3xl"
            weight="bold"
            className="text-foreground"
            style={{ letterSpacing: -0.5 }}
          >
            Chats
          </Text>
          <Text size="sm" variant="muted" className="mt-1 mb-6">
            Threads from plans you joined.
          </Text>

          {inbox.length === 0 ? (
            <View className="mt-12 items-center gap-3">
              <View className="h-16 w-16 items-center justify-center rounded-3xl bg-accent/15">
                <MessageCircle size={26} color="hsl(190 100% 75%)" />
              </View>
              <Text size="lg" weight="bold" className="text-foreground">
                No threads yet
              </Text>
              <Text size="sm" variant="muted" className="text-center">
                Join a plan in the feed to unlock its chat.
              </Text>
              <Pressable
                onPress={() => router.push('/')}
                className="mt-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-2"
              >
                <Text size="sm" weight="bold" className="text-primary">
                  Browse feed
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="gap-2">
              {inbox.map(({ event, lastMsg }) => {
                const sender = lastMsg
                  ? profiles.find((p) => p.id === lastMsg.user_id)
                  : null;
                return (
                  <Pressable
                    key={event.id}
                    onPress={() => router.push(`/event/${event.id}`)}
                    className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3"
                  >
                    <View className="h-14 w-14 overflow-hidden rounded-2xl">
                      {event.kind === 'question' || !event.cover_url ? (
                        <LinearGradient
                          colors={
                            event.kind === 'question'
                              ? ['hsl(280 70% 22%)', 'hsl(190 70% 18%)']
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
                      {event.kind === 'question' && (
                        <View className="absolute inset-0 items-center justify-center">
                          <MessageCircleQuestion size={20} color="hsl(190 100% 80%)" />
                        </View>
                      )}
                    </View>
                    <View className="flex-1 gap-0.5">
                      <Text
                        size="sm"
                        weight="bold"
                        className="text-foreground"
                        numberOfLines={1}
                      >
                        {event.title}
                      </Text>
                      <Text size="xs" variant="muted" numberOfLines={1}>
                        {lastMsg
                          ? `${sender?.display_name ?? 'Someone'}: ${lastMsg.body}`
                          : 'No messages yet — say hi.'}
                      </Text>
                    </View>
                    <Text size="xs" variant="muted">
                      {lastMsg
                        ? formatDistanceToNow(new Date(lastMsg.created_at), {
                            addSuffix: false,
                          })
                            .replace('about ', '')
                            .replace(' minutes', 'm')
                            .replace(' minute', 'm')
                            .replace(' hours', 'h')
                            .replace(' hour', 'h')
                            .replace(' seconds', 's')
                            .replace(' days', 'd')
                            .replace(' day', 'd')
                        : ''}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
