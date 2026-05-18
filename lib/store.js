import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ----- Seed data -----
// Greenville, SC center
const GVL = { lat: 34.852_618, lng: -82.394_011 };

function randomNear(c, radiusKm = 3) {
  const r = (radiusKm / 111) * Math.sqrt(Math.random());
  const t = 2 * Math.PI * Math.random();
  return { lat: c.lat + r * Math.cos(t), lng: c.lng + r * Math.sin(t) };
}

const COVERS = [
  'https://images.unsplash.com/photo-1571266028243-d220c6a8266c?w=900&q=80',
  'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=900&q=80',
  'https://images.unsplash.com/photo-1574391884720-bbc049ec09ad?w=900&q=80',
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=900&q=80',
  'https://images.unsplash.com/photo-1485872299712-f7e525a78f3a?w=900&q=80',
  'https://images.unsplash.com/photo-1578632749014-ca77efd052eb?w=900&q=80',
  'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=900&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&q=80',
];

const AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
];

const SEED_PROFILES = [
  {
    id: 'u-maya',
    display_name: 'Maya',
    avatar_url: AVATARS[0],
    age: 24,
    bio: 'Rooftops, vinyl, late tacos. DM me your favorite warehouse.',
    interests: ['Music', 'Photography', 'Tacos', 'Vinyl'],
    vibes: ['Underground', 'Rooftop', 'After'],
    photos: [AVATARS[0], COVERS[0]],
    city: 'greenville-sc',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: 'u-jay',
    display_name: 'Jay',
    avatar_url: AVATARS[3],
    age: 28,
    bio: 'Bartender at Methodical. I know where the after spot is.',
    interests: ['Cocktails', 'Hiking', 'Live Music'],
    vibes: ['Bar', 'Live Music'],
    photos: [AVATARS[3]],
    city: 'greenville-sc',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
  {
    id: 'u-sloane',
    display_name: 'Sloane',
    avatar_url: AVATARS[1],
    age: 26,
    bio: 'House DJ. Looking for someone to crash a rooftop with.',
    interests: ['DJ', 'Tennis', 'Sushi'],
    vibes: ['Club', 'House Party'],
    photos: [AVATARS[1]],
    city: 'greenville-sc',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: 'u-devon',
    display_name: 'Devon',
    avatar_url: AVATARS[6],
    age: 30,
    bio: 'New to GVL. Help me find the good shit.',
    interests: ['Coffee', 'Climbing', 'Whiskey'],
    vibes: ['Bar', 'Underground'],
    photos: [AVATARS[6]],
    city: 'greenville-sc',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'u-priya',
    display_name: 'Priya',
    avatar_url: AVATARS[5],
    age: 23,
    bio: 'Anyone DTF (down to find) the best dive bar?',
    interests: ['Karaoke', 'Reading', 'Tacos'],
    vibes: ['Bar', 'Live Music'],
    photos: [AVATARS[5]],
    city: 'greenville-sc',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
];

const now = Date.now();
const HOUR = 1000 * 60 * 60;

const SEED_EVENTS = [
  {
    id: 'e-1',
    host_id: 'u-maya',
    kind: 'event',
    title: 'Rooftop sunset @ Up On The Roof',
    description: 'Cocktails, that pink Greenville sunset, then we move downtown. Solo welcome.',
    venue: 'Up On The Roof',
    starts_at: new Date(now + 2 * HOUR).toISOString(),
    time_text: 'tonight 8pm',
    vibe: 'Rooftop',
    cover_url: COVERS[0],
    ...randomNear(GVL, 1.5),
    expires_at: new Date(now + 6 * HOUR).toISOString(),
    created_at: new Date(now - HOUR).toISOString(),
  },
  {
    id: 'e-2',
    host_id: 'u-jay',
    kind: 'event',
    title: 'Methodical takeover — funk night',
    description: 'DJ spinning rare grooves til 2am. Free shot if you say "linkup" at the door.',
    venue: 'Methodical Coffee (after dark)',
    starts_at: new Date(now + 4 * HOUR).toISOString(),
    time_text: 'tonight 10pm',
    vibe: 'Live Music',
    cover_url: COVERS[1],
    ...randomNear(GVL, 0.8),
    expires_at: new Date(now + 8 * HOUR).toISOString(),
    created_at: new Date(now - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'e-3',
    host_id: 'u-sloane',
    kind: 'event',
    title: 'House party — vinyl only',
    description: 'BYOB, no top 40, dress up. Address drops to attendees only.',
    venue: 'East side, address on join',
    starts_at: new Date(now + 5 * HOUR).toISOString(),
    time_text: 'tonight 11pm',
    vibe: 'House Party',
    cover_url: COVERS[2],
    ...randomNear(GVL, 2.2),
    expires_at: new Date(now + 9 * HOUR).toISOString(),
    created_at: new Date(now - 90 * 60 * 1000).toISOString(),
  },
  {
    id: 'e-q1',
    host_id: 'u-priya',
    kind: 'question',
    title: 'Anyone know a late-night taco spot still open after 1am?',
    description: 'Asking for science. And me. I am hungry.',
    venue: null,
    starts_at: new Date(now - 30 * 60 * 1000).toISOString(),
    time_text: null,
    vibe: null,
    cover_url: null,
    ...randomNear(GVL, 1),
    expires_at: new Date(now + 11 * HOUR).toISOString(),
    created_at: new Date(now - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'e-4',
    host_id: 'u-devon',
    kind: 'event',
    title: 'Underground show — basement of Hub City',
    description: 'Three local punk bands. $5 cover, ends at 1am. Loud as hell.',
    venue: 'Hub City Bookshop basement',
    starts_at: new Date(now + 3 * HOUR).toISOString(),
    time_text: 'tonight 9pm',
    vibe: 'Underground',
    cover_url: COVERS[3],
    ...randomNear(GVL, 1.1),
    expires_at: new Date(now + 7 * HOUR).toISOString(),
    created_at: new Date(now - 2 * HOUR).toISOString(),
  },
  {
    id: 'e-5',
    host_id: 'u-maya',
    kind: 'event',
    title: 'After-hours @ The Velvet',
    description: 'Late late session, deep house only. 1am til whenever.',
    venue: 'The Velvet (downtown)',
    starts_at: new Date(now + 7 * HOUR).toISOString(),
    time_text: 'tonight 1am',
    vibe: 'After',
    cover_url: COVERS[4],
    ...randomNear(GVL, 0.5),
    expires_at: new Date(now + 12 * HOUR).toISOString(),
    created_at: new Date(now - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'e-q2',
    host_id: 'u-sloane',
    kind: 'question',
    title: 'Best dive bar in Greenville? Trying to avoid Main Street tonight.',
    description: '',
    venue: null,
    starts_at: new Date(now - 2 * HOUR).toISOString(),
    time_text: null,
    vibe: null,
    cover_url: null,
    ...randomNear(GVL, 1.4),
    expires_at: new Date(now + 10 * HOUR).toISOString(),
    created_at: new Date(now - 2 * HOUR).toISOString(),
  },
  {
    id: 'e-6',
    host_id: 'u-jay',
    kind: 'event',
    title: 'Trivia + tequila',
    description: 'Team up at the door. Winner gets a bottle.',
    venue: "Smiley's Acoustic Cafe",
    starts_at: new Date(now + 1 * HOUR).toISOString(),
    time_text: 'tonight 7pm',
    vibe: 'Bar',
    cover_url: COVERS[5],
    ...randomNear(GVL, 1.8),
    expires_at: new Date(now + 5 * HOUR).toISOString(),
    created_at: new Date(now - 45 * 60 * 1000).toISOString(),
  },
];

const SEED_ATTENDEES = [
  ...SEED_EVENTS.map((e) => ({
    event_id: e.id,
    user_id: e.host_id,
    joined_at: e.created_at,
  })),
  { event_id: 'e-1', user_id: 'u-jay', joined_at: new Date(now - 30 * 60 * 1000).toISOString() },
  { event_id: 'e-1', user_id: 'u-sloane', joined_at: new Date(now - 20 * 60 * 1000).toISOString() },
  { event_id: 'e-1', user_id: 'u-priya', joined_at: new Date(now - 10 * 60 * 1000).toISOString() },
  { event_id: 'e-2', user_id: 'u-maya', joined_at: new Date(now - 25 * 60 * 1000).toISOString() },
  { event_id: 'e-2', user_id: 'u-devon', joined_at: new Date(now - 15 * 60 * 1000).toISOString() },
  { event_id: 'e-3', user_id: 'u-priya', joined_at: new Date(now - 50 * 60 * 1000).toISOString() },
  { event_id: 'e-q1', user_id: 'u-devon', joined_at: new Date(now - 25 * 60 * 1000).toISOString() },
  { event_id: 'e-4', user_id: 'u-priya', joined_at: new Date(now - 30 * 60 * 1000).toISOString() },
  { event_id: 'e-4', user_id: 'u-jay', joined_at: new Date(now - 20 * 60 * 1000).toISOString() },
  { event_id: 'e-5', user_id: 'u-sloane', joined_at: new Date(now - 5 * 60 * 1000).toISOString() },
  { event_id: 'e-6', user_id: 'u-priya', joined_at: new Date(now - 40 * 60 * 1000).toISOString() },
  { event_id: 'e-6', user_id: 'u-devon', joined_at: new Date(now - 35 * 60 * 1000).toISOString() },
];

const SEED_MESSAGES = [
  {
    id: 'm-1',
    event_id: 'e-1',
    user_id: 'u-maya',
    body: 'Hey y\u2019all! I\u2019ll be in a black jumpsuit. Look for the loud laugh.',
    created_at: new Date(now - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'm-2',
    event_id: 'e-1',
    user_id: 'u-sloane',
    body: 'On my way. Pulling up in 10.',
    created_at: new Date(now - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'm-3',
    event_id: 'e-1',
    user_id: 'u-jay',
    body: 'Saving two seats by the railing 🍸',
    created_at: new Date(now - 12 * 60 * 1000).toISOString(),
  },
  {
    id: 'm-4',
    event_id: 'e-2',
    user_id: 'u-jay',
    body: 'Door opens at 9:30. I\u2019m the dude with the headphones.',
    created_at: new Date(now - 18 * 60 * 1000).toISOString(),
  },
  {
    id: 'm-5',
    event_id: 'e-2',
    user_id: 'u-devon',
    body: 'Bringing a buddy, that cool?',
    created_at: new Date(now - 8 * 60 * 1000).toISOString(),
  },
  {
    id: 'm-6',
    event_id: 'e-q1',
    user_id: 'u-priya',
    body: 'For real, I\u2019m starving. Anyone?',
    created_at: new Date(now - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'm-7',
    event_id: 'e-q1',
    user_id: 'u-devon',
    body: 'Papi Queso truck stays til 2 on Fridays. Worth the walk.',
    created_at: new Date(now - 22 * 60 * 1000).toISOString(),
  },
];

// ----- Listeners (realtime simulation) -----
const listeners = new Set();
export function subscribe(fn) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
function emit() {
  for (const fn of listeners) fn();
}

export const useStore = create(
  persist(
    (set, get) => ({
      session: null,
      profiles: SEED_PROFILES,
      events: SEED_EVENTS,
      attendees: SEED_ATTENDEES,
      messages: SEED_MESSAGES,
      waitlist: [],
      unit: 'mi',

      signUp: (email, _password, displayName) => {
        const id = `u-${Math.random().toString(36).slice(2, 9)}`;
        const profile = {
          id,
          display_name: displayName || email.split('@')[0],
          avatar_url: null,
          age: null,
          bio: '',
          interests: [],
          vibes: [],
          photos: [],
          city: null,
          created_at: new Date().toISOString(),
        };
        set((s) => ({ profiles: [...s.profiles, profile], session: { user_id: id } }));
        emit();
        return id;
      },

      signIn: (email, _password) => {
        const prefix = email.split('@')[0]?.toLowerCase() ?? '';
        const profile = get().profiles.find(
          (p) => p.display_name.toLowerCase() === prefix,
        );
        if (!profile) return null;
        set({ session: { user_id: profile.id } });
        emit();
        return profile.id;
      },

      signInGoogle: () => {
        const id = 'u-maya';
        set({ session: { user_id: id } });
        emit();
        return id;
      },

      signOut: () => {
        set({ session: null });
        emit();
      },

      setCity: (userId, city) => {
        set((s) => ({
          profiles: s.profiles.map((p) => (p.id === userId ? { ...p, city } : p)),
        }));
        emit();
      },

      joinWaitlist: (userId, city) => {
        set((s) => ({
          waitlist: [
            ...s.waitlist,
            {
              id: `w-${Math.random().toString(36).slice(2, 9)}`,
              user_id: userId,
              city,
              created_at: new Date().toISOString(),
            },
          ],
        }));
        emit();
      },

      updateProfile: (userId, patch) => {
        set((s) => ({
          profiles: s.profiles.map((p) => (p.id === userId ? { ...p, ...patch } : p)),
        }));
        emit();
      },

      createEvent: (input) => {
        const id = `e-${Math.random().toString(36).slice(2, 9)}`;
        const ts = new Date().toISOString();
        const expires = new Date(
          Date.now() + input.durationHours * 60 * 60 * 1000,
        ).toISOString();
        const event = {
          id,
          host_id: input.host_id,
          kind: input.kind,
          title: input.title,
          description: input.description,
          venue: input.kind === 'event' ? (input.venue ?? null) : null,
          starts_at: ts,
          time_text: input.kind === 'event' ? (input.time_text ?? null) : null,
          vibe: input.kind === 'event' ? (input.vibe ?? null) : null,
          cover_url: input.kind === 'event' ? (input.cover_url ?? null) : null,
          lat: input.lat ?? null,
          lng: input.lng ?? null,
          expires_at: expires,
          created_at: ts,
        };
        set((s) => ({
          events: [event, ...s.events],
          attendees: [
            ...s.attendees,
            { event_id: id, user_id: input.host_id, joined_at: ts },
          ],
        }));
        emit();
        return id;
      },

      joinEvent: (eventId, userId) => {
        const exists = get().attendees.some(
          (a) => a.event_id === eventId && a.user_id === userId,
        );
        if (exists) return;
        set((s) => ({
          attendees: [
            ...s.attendees,
            { event_id: eventId, user_id: userId, joined_at: new Date().toISOString() },
          ],
        }));
        emit();
      },

      leaveEvent: (eventId, userId) => {
        set((s) => ({
          attendees: s.attendees.filter(
            (a) => !(a.event_id === eventId && a.user_id === userId),
          ),
        }));
        emit();
      },

      sendMessage: (eventId, userId, body) => {
        const trimmed = body.trim();
        if (!trimmed) return;
        const msg = {
          id: `m-${Math.random().toString(36).slice(2, 9)}`,
          event_id: eventId,
          user_id: userId,
          body: trimmed,
          created_at: new Date().toISOString(),
        };
        set((s) => ({ messages: [...s.messages, msg] }));
        emit();
      },
    }),
    {
      name: 'linkup-store-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        session: state.session,
        profiles: state.profiles,
        events: state.events,
        attendees: state.attendees,
        messages: state.messages,
        waitlist: state.waitlist,
        unit: state.unit,
      }),
    },
  ),
);

// ----- Selectors -----
export function useCurrentUserId() {
  return useStore((s) => s.session?.user_id ?? null);
}

export function useCurrentProfile() {
  return useStore((s) => {
    const id = s.session?.user_id;
    if (!id) return null;
    return s.profiles.find((p) => p.id === id) ?? null;
  });
}

export function getProfileById(profiles, id) {
  return profiles.find((p) => p.id === id);
}

export function attendeeCount(attendees, eventId) {
  let n = 0;
  for (const a of attendees) if (a.event_id === eventId) n++;
  return n;
}

export function isAttendee(attendees, eventId, userId) {
  if (!userId) return false;
  return attendees.some((a) => a.event_id === eventId && a.user_id === userId);
}

export function isExpired(event, nowMs = Date.now()) {
  return new Date(event.expires_at).getTime() <= nowMs;
}
