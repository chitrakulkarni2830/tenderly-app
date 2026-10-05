import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Welcome() {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  // Fade to the home screen after welcoming the user
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>hi, {name}</Text>
      <Text style={styles.text}>nice to meet you {'<3'}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Amarna',
    fontSize: 32,
    color: '#4A5D4E',
    fontWeight: '400',
    textAlign: 'center',
  }
});
