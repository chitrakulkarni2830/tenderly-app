import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function PrivacyScreen() {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.heading}>Your Space, Your Privacy</Text>
          <Text style={styles.paragraph}>
            Tenderly is designed to be a quiet, personal, and safe space. We believe that caring for yourself shouldn't come at the cost of your privacy.
          </Text>

          <Text style={styles.subheading}>Local Data Only</Text>
          <Text style={styles.paragraph}>
            Everything you do in Tenderly stays on your device. We do not use external servers, databases, or cloud storage to save your information.
            Your name, your garden progress, your custom bouquets, and all of Clover's daily messages are saved directly onto your local device storage.
          </Text>

          <Text style={styles.subheading}>What We Don't Do</Text>
          <Text style={styles.paragraph}>
            Because Tenderly is completely self-contained, there are absolutely no:
          </Text>
          <View style={styles.list}>
            <View style={styles.listItem}>
              <Feather name="x" size={16} color={theme.subtext} style={styles.listIcon} />
              <Text style={styles.listText}>User accounts or logins</Text>
            </View>
            <View style={styles.listItem}>
              <Feather name="x" size={16} color={theme.subtext} style={styles.listIcon} />
              <Text style={styles.listText}>Data collection or analytics tracking</Text>
            </View>
            <View style={styles.listItem}>
              <Feather name="x" size={16} color={theme.subtext} style={styles.listIcon} />
              <Text style={styles.listText}>Third-party advertising</Text>
            </View>
            <View style={styles.listItem}>
              <Feather name="x" size={16} color={theme.subtext} style={styles.listIcon} />
              <Text style={styles.listText}>AI, chatbots, or external services</Text>
            </View>
            <View style={styles.listItem}>
              <Feather name="x" size={16} color={theme.subtext} style={styles.listIcon} />
              <Text style={styles.listText}>Subscriptions or payments</Text>
            </View>
          </View>

          <Text style={styles.subheading}>Your Control</Text>
          <Text style={styles.paragraph}>
            Because all of your data lives on your device, deleting the app will completely and permanently erase all of your progress, flowers, and settings. 
          </Text>
          
          <Text style={styles.paragraph}>
            Rest easy knowing that your quiet garden is just for you.
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 60,
  },
  content: {
    flex: 1,
  },
  heading: {
    fontFamily: 'Amarna',
    fontSize: 22,
    color: theme.accent,
    marginBottom: 16,
  },
  subheading: {
    fontFamily: 'Amarna',
    fontSize: 18,
    color: theme.text,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontFamily: 'Amarna',
    fontSize: 16,
    color: theme.subtext,
    lineHeight: 24,
    marginBottom: 8,
  },
  list: {
    marginTop: 8,
    marginBottom: 16,
    paddingLeft: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listIcon: {
    marginRight: 12,
  },
  listText: {
    fontFamily: 'Amarna',
    fontSize: 15,
    color: theme.subtext,
  },
});
