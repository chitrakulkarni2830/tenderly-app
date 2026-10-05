import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="theme" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="about" />
    </Stack>
  );
}
