import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // Stack adalah sistem navigasi "tumpukan" (seperti web history)
    <Stack
      screenOptions={{
        // Header disembunyikan karena kita biasanya membuat header custom
        headerShown: false, 
        // Warna latar belakang dasar aplikasi
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      {/* Auth group dan Tabs group sebagai main routes */}
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}