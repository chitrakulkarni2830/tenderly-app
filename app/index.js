import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Tenderly Home (Placeholder)</Text>
      <Link href="/theme"><Text>Theme Selection</Text></Link>
      <Link href="/settings"><Text>Settings</Text></Link>
      <Link href="/about"><Text>About</Text></Link>
    </View>
  );
}
