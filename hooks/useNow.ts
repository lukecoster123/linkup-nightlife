import { useEffect, useState } from 'react';

// Ticker hook — re-renders every `intervalMs` so countdown chips tick.
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function formatCountdown(expiresAtIso: string, nowMs: number): string {
  const ms = new Date(expiresAtIso).getTime() - nowMs;
  if (ms <= 0) return 'expired';
  const mins = Math.floor(ms / 60_000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hours < 24) return `${hours}h ${remMins}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

export function isUrgent(expiresAtIso: string, nowMs: number): boolean {
  const ms = new Date(expiresAtIso).getTime() - nowMs;
  return ms > 0 && ms < 60 * 60 * 1000; // <1h
}
