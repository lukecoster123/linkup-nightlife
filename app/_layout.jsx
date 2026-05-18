// oxlint-disable-next-line eslint-plugin-import/no-unassigned-import
import './global.css';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@react-navigation/native';
import { useEffect } from 'react';
import * as DevClient from 'expo-dev-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DARK_THEME } from '@/lib/constants';
import { initPostHog } from '@/lib/posthog';
import { reportErrorToParent } from '@/lib/reportPreviewError';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ToastProvider } from '@/components/ui/toast';
import { AuthGate } from '@/components/AuthGate';

import {
  ErrorBoundary as ExpoErrorBoundary,
  SplashScreen,
  Stack,
} from 'expo-router';

function ErrorBoundary({ error, retry }) {
  useEffect(() => {
    if (Platform.OS === 'web' && error) {
      const message = [error.message, error.stack].filter(Boolean).join('\n');
      reportErrorToParent(message);
    }
  }, [error]);
  return <ExpoErrorBoundary error={error} retry={retry} />;
}

export { ErrorBoundary };

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Force dark theme — LinkUp is dark-only.
  useEffect(() => {
    if (colorScheme !== 'dark') setColorScheme('dark');
  }, [colorScheme, setColorScheme]);

  useEffect(() => {
    void (async () => {
      try {
        await AsyncStorage.setItem('theme', 'dark');
      } catch {
        // no-op
      }
    })();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      void SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return undefined;

    const handleError = (event) => {
      const message = event.error?.stack ?? event.message ?? 'Unknown error';
      reportErrorToParent(message);
    };
    const handleUnhandledRejection = (event) => {
      const err = event.reason;
      const message =
        err instanceof Error ? [err.message, err.stack].filter(Boolean).join('\n') : String(err);
      reportErrorToParent(message);
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const existingLink = document.querySelector(
        'link[href*="fonts.googleapis.com/css2?family=Inter"]',
      );
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Unbounded:wght@500;700;800&display=swap';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    }
  }, []);

  useEffect(() => {
    const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
    if (__DEV__ && Platform.OS !== 'web' && !isExpoGo) {
      const timer = setTimeout(() => {
        DevClient.closeMenu();
        DevClient.hideMenu();
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      initPostHog();
    }
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={DARK_THEME}>
        {/* oxlint-disable-next-line react/style-prop-object */}
        <StatusBar style="light" />
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'hsl(270 35% 4%)' }}>
          <ToastProvider>
            <AuthGate>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: 'hsl(270 35% 4%)' },
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="pick-city" />
                <Stack.Screen name="waitlist" />
                <Stack.Screen name="event/[id]" options={{ presentation: 'card' }} />
                <Stack.Screen name="u/[id]" />
              </Stack>
            </AuthGate>
          </ToastProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
