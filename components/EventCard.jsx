import { Image, Platform, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Clock3, MapPin, MessageCircleQuestion, Users } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NIGHT_GRADIENT } from '@/lib/constants';
import { formatDistance, haversineKm } from '@/lib/geo';
import { attendeeCount } from '@/lib/store';
import { formatCountdown, isUrgent } from '@/hooks/useNow';
import { cn } from '@/lib/utils';

export function EventCard({ event, host, attendees, userCoords, unit, now }) {
  const router = useRouter();
  const isQuestion = event.kind === 'question';
  const count = attendeeCount(attendees, event.id);
  const urgent = isUrgent(event.expires_at, now);

  const distance =
    userCoords && event.lat != null && event.lng != null
      ? formatDistance(haversineKm(userCoords, { lat: event.lat, lng: event.lng }), unit)
      : null;

  return (
    <Pressable
      onPress={() => router.push(`/event/${event.id}`)}
      className="overflow-hidden rounded-3xl border border-border bg-card"
    >
      {/* Cover */}
      <View className="relative h-48 w-full">
        {isQuestion || !event.cover_url ? (
          <LinearGradient
            colors={isQuestion ? ['hsl(280 70% 22%)', 'hsl(320 80% 16%)', 'hsl(190 70% 18%)'] : NIGHT_GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', inset: 0 }}
          />
        ) : (
          <Image
            source={{ uri: event.cover_url }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.65)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: 'absolute', inset: 0 }}
        />

        {/* Top row: host chip + countdown */}
        <View className="absolute left-3 right-3 top-3 flex-row items-center justify-between">
          <GlassChip>
            <Avatar className="h-6 w-6">
              {host?.avatar_url ? (
                <AvatarImage src={host.avatar_url} />
              ) : (
                <AvatarFallback>
                  <Text size="xs" weight="bold">
                    {host?.display_name?.[0] ?? '?'}
                  </Text>
                </AvatarFallback>
              )}
            </Avatar>
            <Text size="xs" weight="semibold" className="text-foreground">
              {host?.display_name ?? 'Anonymous'}
            </Text>
          </GlassChip>

          <GlassChip className={cn(urgent && 'border-primary')}>
            <Clock3 size={12} color={urgent ? 'hsl(320 95% 70%)' : 'hsl(280 20% 96%)'} />
            <Text
              size="xs"
              weight="semibold"
              className={cn(urgent ? 'text-primary' : 'text-foreground')}
            >
              {formatCountdown(event.expires_at, now)}
            </Text>
          </GlassChip>
        </View>

        {/* Bottom row: vibe / question badge + distance */}
        <View className="absolute bottom-3 left-3 right-3 flex-row items-center justify-between">
          {isQuestion ? (
            <View className="flex-row items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1.5">
              <MessageCircleQuestion size={12} color="hsl(190 100% 75%)" />
              <Text size="xs" weight="bold" className="text-accent">
                Question
              </Text>
            </View>
          ) : event.vibe ? (
            <Badge className="border-0 bg-primary/25">
              <Text size="xs" weight="bold" className="text-primary">
                {event.vibe}
              </Text>
            </Badge>
          ) : (
            <View />
          )}
          {distance && (
            <GlassChip>
              <MapPin size={11} color="hsl(280 20% 96%)" />
              <Text size="xs" weight="semibold" className="text-foreground">
                {distance}
              </Text>
            </GlassChip>
          )}
        </View>
      </View>

      {/* Body */}
      <View className="gap-2 p-4">
        <Text size="lg" weight="bold" numberOfLines={2} className="text-foreground">
          {event.title}
        </Text>

        {isQuestion ? (
          event.description ? (
            <Text size="sm" variant="muted" numberOfLines={2}>
              {event.description}
            </Text>
          ) : null
        ) : (
          <View className="gap-1">
            {event.venue && (
              <View className="flex-row items-center gap-1.5">
                <MapPin size={13} color="hsl(280 10% 65%)" />
                <Text size="sm" variant="muted" numberOfLines={1}>
                  {event.venue}
                </Text>
              </View>
            )}
            {event.time_text && (
              <View className="flex-row items-center gap-1.5">
                <Clock3 size={13} color="hsl(280 10% 65%)" />
                <Text size="sm" variant="muted">
                  {event.time_text}
                </Text>
              </View>
            )}
          </View>
        )}

        <View className="mt-1 flex-row items-center gap-1.5">
          <Users size={13} color="hsl(190 100% 75%)" />
          <Text size="xs" weight="semibold" className="text-accent">
            {count} {isQuestion ? 'in thread' : 'going'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function GlassChip({ children, className }) {
  if (Platform.OS === 'web') {
    return (
      <View
        className={cn(
          'flex-row items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1.5',
          className,
        )}
        style={{ backdropFilter: 'blur(12px)' }}
      >
        {children}
      </View>
    );
  }
  return (
    <BlurView
      intensity={40}
      tint="dark"
      className={cn(
        'flex-row items-center gap-1.5 overflow-hidden rounded-full border border-white/10 px-2.5 py-1.5',
        className,
      )}
    >
      {children}
    </BlurView>
  );
}
