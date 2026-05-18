import { Tabs } from 'expo-router';
import { Compass, MessageCircle, PlusCircle, User } from 'lucide-react-native';
import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'hsl(320 95% 70%)',
        tabBarInactiveTintColor: 'hsl(280 10% 60%)',
        tabBarStyle: {
          backgroundColor:
            Platform.OS === 'web' ? 'rgba(20, 12, 28, 0.85)' : 'transparent',
          borderTopColor: 'hsl(270 25% 16%)',
          borderTopWidth: 1,
          height: 70,
          paddingTop: 8,
          paddingBottom: 12,
          position: 'absolute',
          ...(Platform.OS === 'web' && { backdropFilter: 'blur(20px)' }),
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 11,
          letterSpacing: 0.2,
        },
        tabBarBackground:
          Platform.OS === 'web'
            ? undefined
            : () => (
                <BlurView
                  intensity={50}
                  tint="dark"
                  style={{ position: 'absolute', inset: 0 }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(20, 12, 28, 0.55)',
                    }}
                  />
                </BlurView>
              ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => (
            <PlusCircle color={color} size={(size ?? 22) + 2} strokeWidth={2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size ?? 22} />,
        }}
      />
    </Tabs>
  );
}
