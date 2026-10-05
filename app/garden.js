import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StorageService } from '../services/storage';
import { FLOWER_METADATA, isBouquetUnlocked, FLOWERS_PER_CYCLE } from '../services/garden';

export default function GardenScreen() {
  const router = useRouter();
  const [flowers, setFlowers] = useState([]);
  const [selectedFlower, setSelectedFlower] = useState(null);

  useEffect(() => {
    StorageService.loadGardenFlowers().then((list) => {
      setFlowers(list);
    });
  }, []);

  const bouquetUnlocked = isBouquetUnlocked(flowers);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#3E342D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>The Garden</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Subtle Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.subtitle}>A quiet sanctuary of gathered blooms</Text>
          <Text style={styles.flowerCountText}>
            {flowers.length} {flowers.length === 1 ? 'bloom' : 'blooms'} nurtured with care
          </Text>
        </View>

        {/* Bouquet Studio Banner */}
        <TouchableOpacity
          activeOpacity={bouquetUnlocked ? 0.8 : 1}
          onPress={() => {
            if (bouquetUnlocked) {
              router.push('/bouquet');
            }
          }}
          style={[styles.bouquetBanner, bouquetUnlocked && styles.bouquetBannerUnlocked]}
        >
          <View style={styles.bouquetBannerIcon}>
            <Ionicons
              name={bouquetUnlocked ? 'sparkles' : 'lock-closed-outline'}
              size={22}
              color={bouquetUnlocked ? '#8C6843' : '#8A9589'}
            />
          </View>
          <View style={styles.bouquetBannerTextContainer}>
            <Text style={[styles.bouquetBannerTitle, bouquetUnlocked && styles.bouquetBannerTitleUnlocked]}>
              {bouquetUnlocked ? 'Bouquet Studio • Ready' : 'Bouquet Studio • Locked'}
            </Text>
            <Text style={styles.bouquetBannerSubtext}>
              {bouquetUnlocked
                ? 'You have gathered enough blooms to arrange a bouquet.'
                : `Collect 5 blooms to compose your first bouquet (${flowers.length}/${FLOWERS_PER_CYCLE} gathered).`}
            </Text>
          </View>
          {bouquetUnlocked && <Feather name="chevron-right" size={20} color="#8C6843" />}
        </TouchableOpacity>

        {/* Empty State */}
        {flowers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require('../assets/images/clover_pot.png')}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>Your garden is waiting to bloom</Text>
            <Text style={styles.emptyDescription}>
              Continue tending to Clover on the home screen. When Clover fully matures and blossoms, your discovered flower will be lovingly placed here.
            </Text>
          </View>
        ) : (
          /* Flowers Collection */
          <View style={styles.flowersGrid}>
            {flowers.map((item, index) => {
              const meta = FLOWER_METADATA[item.flowerType] || FLOWER_METADATA.rose;
              const dateStr = item.collectedAt
                ? new Date(item.collectedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })
                : `Bloom #${index + 1}`;

              return (
                <TouchableOpacity
                  key={item.id || `garden_${index}`}
                  style={styles.flowerCard}
                  activeOpacity={0.85}
                  onPress={() => setSelectedFlower({ ...meta, ...item })}
                >
                  <View style={[styles.flowerImageWrapper, { backgroundColor: meta.accentColor || '#F7F3EE' }]}>
                    <Image source={meta.asset} style={styles.flowerThumbnail} resizeMode="contain" />
                  </View>

                  <View style={styles.flowerCardInfo}>
                    <Text style={styles.flowerCardName}>{meta.name}</Text>
                    <Text style={styles.flowerCardBotanical}>{meta.botanicalName}</Text>
                    <View style={styles.tagRow}>
                      <View style={styles.meaningTag}>
                        <Text style={styles.meaningTagText}>{meta.meaning}</Text>
                      </View>
                      <Text style={styles.flowerDate}>{dateStr}</Text>
                    </View>
                  </View>

                  <Feather name="message-circle" size={16} color="#8A9589" style={styles.noteIcon} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Flower Achievement Message Modal */}
      <Modal
        visible={!!selectedFlower}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedFlower(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedFlower && (
              <>
                <View
                  style={[
                    styles.modalImageContainer,
                    { backgroundColor: selectedFlower.accentColor || '#F7F3EE' },
                  ]}
                >
                  <Image source={selectedFlower.asset} style={styles.modalImage} resizeMode="contain" />
                </View>

                <Text style={styles.modalFlowerName}>{selectedFlower.name}</Text>
                <Text style={styles.modalBotanicalName}>{selectedFlower.botanicalName}</Text>
                <Text style={styles.modalMeaning}>{selectedFlower.meaning}</Text>

                <View style={styles.messageBox}>
                  <Text style={styles.modalMessageText}>“{selectedFlower.message}”</Text>
                </View>

                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setSelectedFlower(null)}
                >
                  <Text style={styles.modalCloseButtonText}>Keep in Heart</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2EC', // Cream background
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
    color: '#4A5D4E',
  },
  headerRight: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  subtitle: {
    fontFamily: 'Amarna',
    fontSize: 16,
    color: '#8A9589',
    textAlign: 'center',
  },
  flowerCountText: {
    fontFamily: 'Amarna',
    fontSize: 14,
    color: '#4A5D4E',
    marginTop: 4,
  },
  bouquetBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBE7DE',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
  },
  bouquetBannerUnlocked: {
    backgroundColor: '#FAF3E7',
    borderWidth: 1,
    borderColor: '#E8D6BF',
  },
  bouquetBannerIcon: {
    marginRight: 12,
  },
  bouquetBannerTextContainer: {
    flex: 1,
  },
  bouquetBannerTitle: {
    fontFamily: 'Amarna',
    fontSize: 16,
    color: '#657064',
    marginBottom: 2,
  },
  bouquetBannerTitleUnlocked: {
    color: '#8C6843',
    fontWeight: '600',
  },
  bouquetBannerSubtext: {
    fontFamily: 'Amarna',
    fontSize: 12,
    color: '#8A9589',
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 160,
    height: 160,
    marginBottom: 20,
    opacity: 0.85,
  },
  emptyTitle: {
    fontFamily: 'Amarna',
    fontSize: 20,
    color: '#4A5D4E',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontFamily: 'Amarna',
    fontSize: 14,
    color: '#8A9589',
    textAlign: 'center',
    lineHeight: 22,
  },
  flowersGrid: {
    marginTop: 10,
    gap: 12,
  },
  flowerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EAE5DB',
  },
  flowerImageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  flowerThumbnail: {
    width: 52,
    height: 52,
  },
  flowerCardInfo: {
    flex: 1,
  },
  flowerCardName: {
    fontFamily: 'Amarna',
    fontSize: 18,
    color: '#4A5D4E',
  },
  flowerCardBotanical: {
    fontFamily: 'Amarna',
    fontSize: 12,
    color: '#8A9589',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meaningTag: {
    backgroundColor: '#EBE7DE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  meaningTagText: {
    fontFamily: 'Amarna',
    fontSize: 11,
    color: '#4A5D4E',
  },
  flowerDate: {
    fontFamily: 'Amarna',
    fontSize: 11,
    color: '#A0ACA0',
  },
  noteIcon: {
    marginLeft: 8,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(62, 52, 45, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FAF8F5',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAE5DB',
  },
  modalImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalImage: {
    width: 100,
    height: 100,
  },
  modalFlowerName: {
    fontFamily: 'Amarna',
    fontSize: 22,
    color: '#4A5D4E',
  },
  modalBotanicalName: {
    fontFamily: 'Amarna',
    fontSize: 14,
    color: '#8A9589',
    fontStyle: 'italic',
    marginTop: 2,
  },
  modalMeaning: {
    fontFamily: 'Amarna',
    fontSize: 13,
    color: '#8C6843',
    marginTop: 4,
    marginBottom: 16,
  },
  messageBox: {
    backgroundColor: '#F5F0E6',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ECE4D4',
  },
  modalMessageText: {
    fontFamily: 'Amarna',
    fontSize: 16,
    color: '#4A5D4E',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  modalCloseButton: {
    backgroundColor: '#4A5D4E',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  modalCloseButtonText: {
    fontFamily: 'Amarna',
    fontSize: 15,
    color: '#FAF8F5',
  },
});
