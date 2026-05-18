import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { NeonButton } from '@/components/NeonButton';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/ui/toast';

export default function AuthScreen() {
  const router = useRouter();
  const toast = useToast();
  const signUp = useStore((s) => s.signUp);
  const signIn = useStore((s) => s.signIn);
  const signInGoogle = useStore((s) => s.signInGoogle);

  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('maya@linkup.app');
  const [password, setPassword] = useState('demo123');
  const [displayName, setDisplayName] = useState('');

  const submit = () => {
    if (!email.includes('@') || password.length < 6) {
      toast.toast({
        title: 'Check your details',
        description: 'Email looks off or password under 6 chars.',
        variant: 'destructive',
      });
      return;
    }
    if (mode === 'signup') {
      signUp(email, password, displayName.trim());
      router.replace('/pick-city');
    } else {
      const id = signIn(email, password);
      if (!id) {
        toast.toast({
          title: 'No account found',
          description: 'Try maya@…, jay@…, sloane@…, devon@…, priya@…',
          variant: 'destructive',
        });
        return;
      }
    }
  };

  const google = () => {
    signInGoogle();
  };

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['hsl(320 70% 14%)', 'hsl(280 60% 8%)', 'hsl(270 35% 4%)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', inset: 0 }}
      />
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center gap-10 py-12">
            {/* Hero */}
            <View className="items-center gap-3">
              <View
                className="h-20 w-20 items-center justify-center overflow-hidden rounded-3xl"
                style={{
                  shadowColor: 'hsl(320 100% 70%)',
                  shadowOpacity: 0.6,
                  shadowRadius: 24,
                }}
              >
                <LinearGradient
                  colors={['hsl(320 95% 60%)', 'hsl(280 80% 50%)', 'hsl(190 95% 55%)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ position: 'absolute', inset: 0 }}
                />
                <Text
                  size="3xl"
                  weight="bold"
                  className="text-white"
                  style={{ fontFamily: webFont('Unbounded') }}
                >
                  L
                </Text>
              </View>
              <Text
                size="3xl"
                weight="bold"
                className="text-foreground"
                style={{ fontFamily: webFont('Unbounded'), letterSpacing: -0.5 }}
              >
                LinkUp
              </Text>
              <Text size="base" variant="muted" className="text-center">
                Find something to do — right now.
              </Text>
            </View>

            {/* Toggle */}
            <View className="flex-row rounded-2xl border border-border bg-card p-1">
              {['signin', 'signup'].map((m) => {
                const active = mode === m;
                return (
                  <Pressable
                    key={m}
                    onPress={() => setMode(m)}
                    className="flex-1 items-center justify-center rounded-xl py-2.5"
                    style={
                      active
                        ? { backgroundColor: 'hsl(320 95% 60% / 0.18)' }
                        : undefined
                    }
                  >
                    <Text
                      size="sm"
                      weight="semibold"
                      className={active ? 'text-primary' : 'text-muted-foreground'}
                    >
                      {m === 'signin' ? 'Sign in' : 'Sign up'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Form */}
            <View className="gap-3">
              {mode === 'signup' && (
                <Input
                  placeholder="Display name"
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                  className="h-12 rounded-2xl"
                />
              )}
              <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                className="h-12 rounded-2xl"
              />
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="h-12 rounded-2xl"
              />

              <NeonButton onPress={submit}>
                {mode === 'signup' ? 'Create account' : 'Sign in'}
              </NeonButton>

              <View className="flex-row items-center gap-3 py-1">
                <View className="h-px flex-1 bg-border" />
                <Text size="xs" variant="muted">
                  or
                </Text>
                <View className="h-px flex-1 bg-border" />
              </View>

              <Pressable
                onPress={google}
                className="h-12 flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-card"
              >
                <Mail size={16} color="hsl(280 20% 96%)" />
                <Text size="sm" weight="semibold">
                  Continue with Google
                </Text>
              </Pressable>

              <Text size="xs" variant="muted" className="mt-2 text-center">
                Demo mode — sign in as maya, jay, sloane, devon, or priya. Any password works.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function webFont(name) {
  return Platform.OS === 'web' ? `${name}, Inter, system-ui, sans-serif` : undefined;
}
