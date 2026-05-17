import type { Theme } from '@react-navigation/native';

const NAV_FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  bold: 'Inter_600SemiBold',
  heavy: 'Inter_700Bold',
} as const;

// LinkUp is dark-only neon nightlife. NAV_THEME.dark drives navigation chrome.
export const NAV_THEME = {
  light: {
    background: 'hsl(270 35% 4%)',
    border: 'hsl(270 25% 16%)',
    card: 'hsl(270 30% 7%)',
    notification: 'hsl(320 95% 60%)',
    primary: 'hsl(320 95% 60%)',
    text: 'hsl(280 20% 96%)',
  },
  dark: {
    background: 'hsl(270 35% 4%)',
    border: 'hsl(270 25% 16%)',
    card: 'hsl(270 30% 7%)',
    notification: 'hsl(320 95% 60%)',
    primary: 'hsl(320 95% 60%)',
    text: 'hsl(280 20% 96%)',
  },
};

const FONTS = {
  regular: {
    fontFamily: NAV_FONTS.regular,
    fontWeight: '400' as const,
  },
  medium: {
    fontFamily: NAV_FONTS.medium,
    fontWeight: '500' as const,
  },
  bold: {
    fontFamily: NAV_FONTS.bold,
    fontWeight: '600' as const,
  },
  heavy: {
    fontFamily: NAV_FONTS.heavy,
    fontWeight: '700' as const,
  },
};

export const LIGHT_THEME: Theme = {
  dark: true,
  fonts: FONTS,
  colors: NAV_THEME.dark,
};
export const DARK_THEME: Theme = {
  dark: true,
  fonts: FONTS,
  colors: NAV_THEME.dark,
};

// Cities — Greenville SC is the only live market
export const CITIES = [
  { id: 'greenville-sc', name: 'Greenville', state: 'SC', active: true },
  { id: 'charleston-sc', name: 'Charleston', state: 'SC', active: false },
  { id: 'columbia-sc', name: 'Columbia', state: 'SC', active: false },
  { id: 'charlotte-nc', name: 'Charlotte', state: 'NC', active: false },
  { id: 'raleigh-nc', name: 'Raleigh', state: 'NC', active: false },
  { id: 'atlanta-ga', name: 'Atlanta', state: 'GA', active: false },
] as const;

export type CityId = (typeof CITIES)[number]['id'];

export const VIBES = [
  'Club',
  'Bar',
  'House Party',
  'Live Music',
  'Rooftop',
  'Underground',
  'After',
] as const;

export const DURATIONS = [
  { label: '1h', hours: 1 },
  { label: '3h', hours: 3 },
  { label: '6h', hours: 6 },
  { label: '12h', hours: 12 },
  { label: '24h', hours: 24 },
] as const;

export const NEON_GRADIENT: readonly [string, string, string] = [
  'hsl(320 95% 60%)',
  'hsl(280 80% 50%)',
  'hsl(190 95% 55%)',
];

export const NIGHT_GRADIENT: readonly [string, string, string] = [
  'hsl(270 50% 8%)',
  'hsl(290 60% 10%)',
  'hsl(320 70% 12%)',
];
