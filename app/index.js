import { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';

export default function Splash() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // 1. Fade in the splash screen
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // 2. Simulate initialization/hydration process (e.g., loading themes, fonts, storage)
    const initApp = async () => {
      try {
        // Placeholder for real initialization logic
        await new Promise(resolve => setTimeout(resolve, 2500));
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        // 3. Navigate to Onboarding
        router.replace('/onboarding');
      }
    };

    initApp();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        {/* Placeholder for the Clover / Tenderly logo */}
        <Text style={styles.title}>Tenderly</Text>
        <Text style={styles.subtitle}>take care of me to take care of you</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2EC', // Temporary cozy off-white color
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Billabong',
    fontSize: 64,
    color: '#4A5D4E', // Temporary cozy green color
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '400',
    color: '#7C8A7F',
    fontStyle: 'italic',
  }
});
