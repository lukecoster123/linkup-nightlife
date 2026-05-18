import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Greenville SC fallback when geolocation isn't available (mock dev mode).
const GVL = { lat: 34.852_618, lng: -82.394_011 };

export function useLocation() {
  const [coords, setCoords] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (
      Platform.OS === 'web' &&
      typeof navigator !== 'undefined' &&
      navigator.geolocation
    ) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return;
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          if (cancelled) return;
          setPermissionDenied(true);
          // Fallback so the feed still works in preview.
          setCoords(GVL);
        },
        { enableHighAccuracy: false, maximumAge: 60_000, timeout: 5000 },
      );
    } else {
      // Native preview path: use Greenville as the demo origin so distances render.
      setCoords(GVL);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  return { coords, permissionDenied };
}
