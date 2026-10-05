import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StorageService } from '../services/storage';
import { BOUQUET_TEMPLATES, isBouquetUnlocked, FLOWER_METADATA, FLOWERS_PER_CYCLE } from '../services/garden';
import BouquetRenderer from '../components/BouquetRenderer';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function BouquetStudioScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [flowers, setFlowers] = useState([]);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

  useEffect(() => {
    StorageService.loadGardenFlowers().then((list) => {
      setFlowers(list);
    });
  }, []);

  const bouquetUnlocked = isBouquetUnlocked(flowers);
  // Pick the latest 5 flowers collected for the bouquet arrangement
  const bouquetFlowers = flowers.slice(-FLOWERS_PER_CYCLE);
  const currentTemplate = BOUQUET_TEMPLATES[selectedTemplateIndex] || BOUQUET_TEMPLATES[0];

  const handleOpenShowcase = async () => {
    // Persist this bouquet creation
    await StorageService.saveBouquet({
      templateId: currentTemplate.id,
      templateName: currentTemplate.name,
      flowerIds: bouquetFlowers.map((f) => f.flowerType),
    });

    router.push({
      pathname: '/bouquet-showcase',
      params: {
        templateId: currentTemplate.id,
      },
    });
  };

  if (!bouquetUnlocked) {
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
          <Text style={styles.headerTitle}>Bouquet Studio</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.lockedContainer}>
          <View style={styles.lockedIconWrapper}>
            <Ionicons name="lock-closed-outline" size={36} color={theme.subtext} />
          </View>
          <Text style={styles.lockedTitle}>Awaiting 5 Blooms</Text>
          <Text style={styles.lockedDescription}>
            The Bouquet Studio gently unlocks once you have nurtured and gathered at least 5 flowers in your Garden.
          </Text>
          <Text style={styles.lockedProgress}>
            {flowers.length} of {FLOWERS_PER_CYCLE} blooms gathered
          </Text>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => router.back()}
          >
            <Text style={styles.returnButtonText}>Return to Garden</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bouquet Studio</Text>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={handleOpenShowcase}
          style={styles.showcaseButton}
        >
          <Ionicons name="sparkles" size={18} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Subtitle */}
        <View style={styles.introContainer}>
          <Text style={styles.introSubtitle}>Arrange your nurtured blooms</Text>
          <Text style={styles.introDescription}>
            Your 5 gathered flowers are nestled together with baby’s breath and wild greenery.
          </Text>
        </View>

        {/* Live Dynamic Bouquet Preview */}
        <View style={styles.previewCanvas}>
          <BouquetRenderer
            template={currentTemplate}
            flowers={bouquetFlowers}
            size={Math.min(width - 48, 310)}
          />
        </View>

        {/* 5 Arrangement Selector Pills (All 5 100% visible on screen at once) */}
        <View style={styles.selectorSection}>
          <View style={styles.selectorHeaderRow}>
            <Text style={styles.selectorTitle}>Select Arrangement</Text>
            <Text style={styles.selectorCountTag}>5 Styles Available</Text>
          </View>

          <View style={styles.pillsRowSelector}>
            {BOUQUET_TEMPLATES.map((tmpl, idx) => {
              const isSelected = idx === selectedTemplateIndex;
              return (
                <TouchableOpacity
                  key={tmpl.id}
                  activeOpacity={0.75}
                  onPress={() => setSelectedTemplateIndex(idx)}
                  style={[
                    styles.arrangementPill,
                    isSelected && styles.arrangementPillSelected,
                  ]}
                >
                  <Text style={[styles.pillIndex, isSelected && styles.pillIndexSelected]}>
                    0{idx + 1}
                  </Text>
                  <Text
                    style={[styles.pillName, isSelected && styles.pillNameSelected]}
                    numberOfLines={1}
                  >
                    {tmpl.shortName || tmpl.name.split(' ')[1] || tmpl.name}
                  </Text>
                  <View
                    style={[
                      styles.pillWrapIndicator,
                      { backgroundColor: tmpl.wrapType === 'kraft' ? '#C2A383' : '#7D9680' },
                      isSelected && styles.pillWrapIndicatorSelected,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Template Details Card */}
        <View style={styles.templateDetailsCard}>
          <View style={styles.templateDetailsHeader}>
            <Text style={styles.templateName}>{currentTemplate.name}</Text>
            <View
              style={[
                styles.wrapTypeBadge,
                { backgroundColor: currentTemplate.wrapType === 'kraft' ? '#F7F0E6' : '#EFF4F0' },
              ]}
            >
              <Text
                style={[
                  styles.wrapTypeBadgeText,
                  { color: currentTemplate.wrapType === 'kraft' ? '#8C6843' : '#4A5D4E' },
                ]}
              >
                {currentTemplate.wrapType === 'kraft' ? 'Kraft Wrap' : 'Silk Ribbon'}
              </Text>
            </View>
          </View>
          <Text style={styles.templateSubtitle}>{currentTemplate.subtitle}</Text>
          <Text style={styles.templateDescription}>{currentTemplate.description}</Text>
        </View>

        {/* Included Flowers Pills */}
        <View style={styles.flowersPillsSection}>
          <Text style={styles.flowersPillsHeader}>Flowers gathered in this bouquet</Text>
          <View style={styles.pillsRow}>
            {bouquetFlowers.map((f, idx) => {
              const meta = FLOWER_METADATA[f.flowerType] || FLOWER_METADATA.rose;
              return (
                <View key={`flower_pill_${idx}`} style={styles.pillItem}>
                  <View style={[styles.pillColorDot, { backgroundColor: meta.color }]} />
                  <Text style={styles.pillText}>{meta.name}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          style={styles.admireButton}
          activeOpacity={0.85}
          onPress={handleOpenShowcase}
        >
          <Ionicons name="sparkles-outline" size={18} color={theme.background} style={{ marginRight: 8 }} />
          <Text style={styles.admireButtonText}>Admire in Showcase</Text>
        </TouchableOpacity>
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
  showcaseButton: {
    padding: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  introContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
    width: '100%',
  },
  introSubtitle: {
    fontFamily: 'Amarna',
    fontSize: 15,
    color: theme.subtext,
    marginBottom: 3,
  },
  introDescription: {
    fontFamily: 'Amarna',
    fontSize: 13,
    color: theme.subtext,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  previewCanvas: {
    width: '100%',
    height: 380,
    backgroundColor: theme.card,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  // 5 Arrangement Selector Pills
  selectorSection: {
    width: '100%',
    marginBottom: 14,
  },
  selectorHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  selectorTitle: {
    fontFamily: 'Amarna',
    fontSize: 14,
    color: theme.text,
  },
  selectorCountTag: {
    fontFamily: 'Amarna',
    fontSize: 11,
    color: theme.subtext,
  },
  pillsRowSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 6,
  },
  arrangementPill: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.border,
  },
  arrangementPillSelected: {
    borderColor: theme.accent,
    backgroundColor: theme.border,
  },
  pillIndex: {
    fontFamily: 'Amarna',
    fontSize: 10,
    color: theme.subtext,
    marginBottom: 2,
  },
  pillIndexSelected: {
    color: theme.accent,
    fontWeight: 'bold',
  },
  pillName: {
    fontFamily: 'Amarna',
    fontSize: 12,
    color: theme.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  pillNameSelected: {
    color: theme.accent,
    fontWeight: '600',
  },
  pillWrapIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillWrapIndicatorSelected: {
    width: 14,
    borderRadius: 3,
  },
  // Selected Template Details Card
  templateDetailsCard: {
    width: '100%',
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.border,
  },
  templateDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  templateName: {
    fontFamily: 'Amarna',
    fontSize: 17,
    color: theme.text,
  },
  wrapTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  wrapTypeBadgeText: {
    fontFamily: 'Amarna',
    fontSize: 11,
    fontWeight: '600',
  },
  templateSubtitle: {
    fontFamily: 'Amarna',
    fontSize: 12,
    color: theme.accent,
    marginBottom: 4,
  },
  templateDescription: {
    fontFamily: 'Amarna',
    fontSize: 12,
    color: theme.subtext,
    lineHeight: 17,
  },
  flowersPillsSection: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: theme.border,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  flowersPillsHeader: {
    fontFamily: 'Amarna',
    fontSize: 11,
    color: theme.subtext,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  pillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
  },
  pillColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  pillText: {
    fontFamily: 'Amarna',
    fontSize: 11,
    color: theme.text,
  },
  admireButton: {
    flexDirection: 'row',
    backgroundColor: theme.accent,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  admireButtonText: {
    fontFamily: 'Amarna',
    fontSize: 15,
    color: theme.background,
  },
  // Locked State
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  lockedIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  lockedTitle: {
    fontFamily: 'Amarna',
    fontSize: 22,
    color: theme.text,
    marginBottom: 10,
  },
  lockedDescription: {
    fontFamily: 'Amarna',
    fontSize: 15,
    color: theme.subtext,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  lockedProgress: {
    fontFamily: 'Amarna',
    fontSize: 14,
    color: theme.accent,
    backgroundColor: theme.border,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 28,
  },
  returnButton: {
    backgroundColor: theme.accent,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 22,
  },
  returnButtonText: {
    fontFamily: 'Amarna',
    fontSize: 14,
    color: theme.background,
  },
});
