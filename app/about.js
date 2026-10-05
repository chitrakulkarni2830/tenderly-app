import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { version } from '../package.json';

export default function AboutScreen() {
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
        <Text style={styles.headerTitle}>About Tenderly</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.quote}>
            "Take care of me to take care of you."
          </Text>

          <Text style={styles.paragraph}>
            Tenderly is a small, quiet space designed for moments of rest and reflection. It was created with a gentle philosophy: by nurturing something small, we can gently remind ourselves to be nurtured, too.
          </Text>
          
          <Text style={styles.paragraph}>
            Clover is more than just a little friend you look after. As you water, nourish, and care for Clover, it blossoms alongside you — quietly encouraging you to drink a glass of water, to step into the sunlight, and to show yourself the same warmth and love.
          </Text>

          <Text style={styles.paragraph}>
            We hope this garden becomes a peaceful retreat where you can slow down, breathe deeply, and find a little bit of comfort in the everyday magic of growing together.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.footerText}>
            Thank you for helping us grow.
          </Text>
          <Text style={styles.versionText}>
            Version {version}
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
    paddingTop: 40,
    paddingBottom: 60,
  },
  content: {
    alignItems: 'center',
  },
  quote: {
    fontFamily: 'Amarna',
    fontSize: 22,
    color: theme.accent,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 40,
    lineHeight: 32,
  },
  paragraph: {
    fontFamily: 'Amarna',
    fontSize: 16,
    color: theme.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 40,
  },
  footerText: {
    fontFamily: 'Amarna',
    fontSize: 16,
    color: theme.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  versionText: {
    fontFamily: 'Amarna',
    fontSize: 14,
    color: theme.subtext,
    textAlign: 'center',
  },
});
