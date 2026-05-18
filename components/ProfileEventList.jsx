import { Image, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock3 } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { NIGHT_GRADIENT } from '@/lib/constants';
import { attendeeCount } from '@/lib/store';
import { formatCountdown, isUrgent } from '@/hooks/useNow';
import { cn } from '@/lib/utils';

export function ProfileEventList({ title, events, attendees, now, emptyText }) {
  const router = useRouter();
  return (
    <View className="mt-6 gap-3">
      <View className="flex-row items-center gap-1.5">
        <Calendar size={14} color="hsl(320 95% 70%)" />
        <Text size="xs" weight="bold" className="uppercase text-primary" style={{ letterSpacing: 1.2 }}>
          {title}
        </Text>
      </View>
      {events.length === 0 ? (
        <Text size="sm" variant="muted">
          {emptyText}
        </Text>
      ) : (
        <View className="gap-2">
          {events.map((e) => {
            const urgent = isUrgent(e.expires_at, now);
            return (
              <Pressable
                key={e.id}
                onPress={() => router.push(`/event/${e.id}`)}
                className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3"
              >
                <View className="h-12 w-12 overflow-hidden rounded-2xl">
                  {e.kind === 'question' || !e.cover_url ? (
                    <LinearGradient
                      colors={
                        e.kind === 'question'
                          ? ['hsl(280 70% 22%)', 'hsl(190 70% 18%)']
                          : NIGHT_GRADIENT
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ position: 'absolute', inset: 0 }}
                    />
                  ) : (
                    <Image
                      source={{ uri: e.cover_url }}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  )}
                </View>
                <View className="flex-1">
                  <Text size="sm" weight="bold" numberOfLines={1} className="text-foreground">
                    {e.title}
                  </Text>
                  <Text size="xs" variant="muted" numberOfLines={1}>
                    {e.kind === 'question'
                      ? `${attendeeCount(attendees, e.id)} in thread`
                      : `${e.venue ?? '—'} · ${attendeeCount(attendees, e.id)} going`}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Clock3 size={11} color={urgent ? 'hsl(320 95% 70%)' : 'hsl(280 10% 65%)'} />
                  <Text
                    size="xs"
                    weight="semibold"
                    className={cn(urgent ? 'text-primary' : 'text-muted-foreground')}
                  >
                    {formatCountdown(e.expires_at, now)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
