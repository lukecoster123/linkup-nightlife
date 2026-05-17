import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { View } from 'react-native';

import { CITIES } from '@/lib/constants';
import { useStore } from '@/lib/store';

// Routes that don't require auth/active-city.
const PUBLIC_SEGMENTS = new Set(['auth', 'pick-city', 'waitlist']);

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const session = useStore((s) => s.session);
  const profiles = useStore((s) => s.profiles);

  const profile = session ? profiles.find((p) => p.id === session.user_id) ?? null : null;

  useEffect(() => {
    const top = segments[0] ?? '';
    const isPublic = PUBLIC_SEGMENTS.has(top);

    if (!session) {
      if (top !== 'auth') router.replace('/auth');
      return;
    }

    if (!profile?.city) {
      if (top !== 'pick-city') router.replace('/pick-city');
      return;
    }

    const cityActive = CITIES.find((c) => c.id === profile.city)?.active ?? false;
    if (!cityActive) {
      if (top !== 'waitlist') router.replace('/waitlist');
      return;
    }

    // Authed + active-city. If they're stuck on a public page, push them home.
    if (isPublic) {
      router.replace('/');
    }
  }, [segments, session, profile, router]);

  return <View style={{ flex: 1 }}>{children}</View>;
}
