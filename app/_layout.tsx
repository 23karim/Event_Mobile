import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading, user } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      if (!isLoading) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [isLoading]);
  if (!isReady) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> 
      <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}