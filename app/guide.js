import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function GuideScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How it works</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.intro}>
            Tenderly is a gentle companion app. Here is a little guide on how to spend your time here:
          </Text>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="water-outline" size={20} color={theme.accent} />
              <Text style={styles.sectionTitle}>Daily Care</Text>
            </View>
            <Text style={styles.paragraph}>
              Each day, Clover will gently ask for something it needs — water, sunlight, nourishment, or love. When you complete these actions for Clover, we hope it serves as a gentle reminder to care for yourself in the same way.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="chatbubble-outline" size={20} color={theme.accent} />
              <Text style={styles.sectionTitle}>Whispers</Text>
            </View>
            <Text style={styles.paragraph}>
              Resting just beneath Clover, you will find your daily whisper. These are small, quiet affirmations designed to bring a moment of peace to your day. They refresh automatically every morning.
            </Text>
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="leaf-outline" size={20} color={theme.accent} />
              <Text style={styles.sectionTitle}>Growth & Blooming</Text>
            </View>
            <Text style={styles.paragraph}>
              As you continue to care for Clover day by day, it will slowly grow from a tiny sprout into a fully blossomed plant. Growth takes time, so be patient with it (and yourself).
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flower-outline" size={20} color={theme.accent} />
              <Text style={styles.sectionTitle}>The Garden</Text>
            </View>
            <Text style={styles.paragraph}>
              Once Clover reaches its final blossoming stage, you can collect its beautiful flower to keep in your personal Garden. The cycle then begins anew, allowing you to grow a vibrant bouquet over time.
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.footerText}>
            Take it one day at a time. 🌱
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontFamily: 'Amarna',
    fontSize: 24,
    color: theme.text,
  },
  headerRight: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 60,
  },
  content: {
    alignItems: 'flex-start',
  },
  intro: {
    fontFamily: 'Amarna',
    fontSize: 18,
    color: theme.subtext,
    lineHeight: 26,
    marginBottom: 32,
    textAlign: 'center',
    alignSelf: 'center',
  },
  section: {
    marginBottom: 28,
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Amarna',
    fontSize: 20,
    color: theme.accent,
    marginLeft: 8,
  },
  paragraph: {
    fontFamily: 'Amarna',
    fontSize: 18,
    color: theme.text,
    lineHeight: 28,
    opacity: 0.9,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    width: 40,
    alignSelf: 'center',
    marginVertical: 40,
    opacity: 0.5,
  },
  footerText: {
    fontFamily: 'Amarna',
    fontSize: 20,
    color: theme.accent,
    textAlign: 'center',
    alignSelf: 'center',
  },
});
