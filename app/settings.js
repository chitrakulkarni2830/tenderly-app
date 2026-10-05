import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const menuItems = [
    { id: 'name', name: 'Your Name', icon: 'person-outline', route: '/name' },
    { id: 'guide', name: 'How it works', icon: 'book-outline', route: '/guide' },
    { id: 'about', name: 'About Tenderly', icon: 'leaf-outline', route: '/about' },
    { id: 'privacy', name: 'Privacy Policy', icon: 'shield-checkmark-outline', route: '/privacy' },
  ];

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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.card}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.optionRow,
                  index !== menuItems.length - 1 && styles.optionBorder
                ]}
                onPress={() => router.push(item.route)}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <Ionicons 
                    name={item.icon} 
                    size={22} 
                    color={theme.accent} 
                    style={styles.optionIcon}
                  />
                  <Text style={styles.optionText}>{item.name}</Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.subtext} />
              </TouchableOpacity>
            ))}
          </View>
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
    paddingVertical: 20,
  },
  section: {
    marginBottom: 32,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 14,
  },
  optionText: {
    fontFamily: 'Amarna',
    fontSize: 17,
    color: theme.text,
  },
});
