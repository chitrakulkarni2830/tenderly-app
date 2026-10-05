import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AudioProvider } from '../contexts/AudioContext';
import { ThemeProvider } from '../contexts/ThemeContext';

// Keep the native splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Billabong': require('../assets/fonts/Billabong.ttf'),
    'Amarna': require('../assets/fonts/Amarna.ttf'),
  });

  useEffect(() => {
    if (fontError) throw fontError;
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <AudioProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
          <Stack.Screen name="home" options={{ animation: 'fade' }} />
          <Stack.Screen name="theme" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="about" />
          <Stack.Screen name="garden" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="bouquet" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="bouquet-showcase" options={{ animation: 'fade' }} />
        </Stack>
      </AudioProvider>
    </ThemeProvider>
  );
}
