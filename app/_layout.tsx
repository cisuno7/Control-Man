import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReadyEffect } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  useFrameworkReadyEffect();

  return (
    <AuthProvider>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </>
    </AuthProvider>
  );
}