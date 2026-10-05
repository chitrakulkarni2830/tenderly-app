import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StorageService } from '../services/storage';
import { BOUQUET_TEMPLATES, FLOWER_METADATA, FLOWERS_PER_CYCLE } from '../services/garden';
import BouquetRenderer from '../components/BouquetRenderer';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function BouquetShowcaseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [flowers, setFlowers] = useState([]);
  
  const templateId = params.templateId || 'cottage_meadow';
  const template = BOUQUET_TEMPLATES.find((t) => t.id === templateId) || BOUQUET_TEMPLATES[0];

  useEffect(() => {
    StorageService.loadGardenFlowers().then((list) => {
      setFlowers(list);
    });
  }, []);

  // Use the latest 5 collected flowers
  const bouquetFlowers = flowers.slice(-FLOWERS_PER_CYCLE);
  const flowerNames = bouquetFlowers
    .map((f) => FLOWER_METADATA[f.flowerType]?.name || 'Bloom')
    .join('  •  ');

  return (
    <SafeAreaView style={styles.container}>
      {/* Quiet Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={() => router.back()}
          style={styles.closeButton}
          accessibilityLabel="Back to Studio"
        >
          <Feather name="x" size={24} color={theme.subtext} />
        </TouchableOpacity>
      </View>

      {/* Main Showcase Presentation */}
      <View style={styles.content}>
        {/* Subtle, quiet greeting */}
        <View style={styles.headerBlock}>
          <Text style={styles.subtext}>look what you grew 🌱</Text>
          <Text style={styles.title}>{template.name}</Text>
        </View>

        {/* The Bouquet in all its handcrafted botanical beauty */}
        <View style={styles.bouquetWrapper}>
          <BouquetRenderer
            template={template}
            flowers={bouquetFlowers}
            size={Math.min(width - 48, 320)}
          />
        </View>

        {/* Quiet Botanical Flower Inscription */}
        <View style={styles.footerBlock}>
          <Text style={styles.flowersListText}>{flowerNames}</Text>
          <View style={styles.divider} />
          <Text style={styles.whisperText}>“A quiet gift of patience and gentle care 🫶🏻”</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: theme.border,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  headerBlock: {
    alignItems: 'center',
    marginTop: 8,
  },
  subtext: {
    fontFamily: 'Amarna',
    fontSize: 16,
    color: theme.subtext,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  title: {
    fontFamily: 'Amarna',
    fontSize: 26,
    color: theme.text,
  },
  bouquetWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  footerBlock: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    width: '100%',
  },
  flowersListText: {
    fontFamily: 'Amarna',
    fontSize: 13,
    color: theme.subtext,
    textAlign: 'center',
    lineHeight: 18,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 14,
  },
  whisperText: {
    fontFamily: 'Amarna',
    fontSize: 16,
    color: theme.accent,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
});
