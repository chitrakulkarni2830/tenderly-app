import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  CLOVER_STATE: '@tenderly_clover_state',
  USER_SETTINGS: '@tenderly_user_settings',
  GARDEN_FLOWERS: '@tenderly_garden_flowers',
  BOUQUETS: '@tenderly_bouquets',
  WHISPER_STATE: '@tenderly_whisper_state',
  DAILY_MESSAGES_STATE: '@tenderly_daily_messages_state',
  THEME: '@tenderly_theme',
};

/**
 * Cumulative care action thresholds:
 * Stage 1: 0 actions (0 - 2)
 * Stage 2: 3 total actions (3 - 6)
 * Stage 3: 7 total actions (7 - 11)
 * Stage 4: 12 total actions (12 - 17)
 * Stage 5: 18 total actions (18+)
 * Blossom Ready: 21 actions (Stage 5 + 3 additional actions)
 */
export const GROWTH_THRESHOLDS = {
  STAGE_1: 0,
  STAGE_2: 3,
  STAGE_3: 7,
  STAGE_4: 12,
  STAGE_5: 18,
  BLOSSOM_READY: 21,
};

/**
 * Derives growth stage from cumulative care actions.
 * Caps at Stage 5; actions beyond 18 remain at Stage 5.
 */
export const getGrowthStage = (careCount) => {
  if (typeof careCount !== 'number' || careCount < 0) return 1;
  if (careCount >= GROWTH_THRESHOLDS.STAGE_5) return 5;
  if (careCount >= GROWTH_THRESHOLDS.STAGE_4) return 4;
  if (careCount >= GROWTH_THRESHOLDS.STAGE_3) return 3;
  if (careCount >= GROWTH_THRESHOLDS.STAGE_2) return 2;
  return 1;
};

/**
 * Local storage abstraction for persisting application state.
 * Includes Clover state, Garden flower collection, selected theme, and user preferences.
 */
export const StorageService = {
  saveData: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Error saving data", e);
    }
  },
  loadData: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error("Error loading data", e);
      return null;
    }
  },
  saveCloverState: async (careCount, extraState = {}) => {
    const stage = getGrowthStage(careCount);
    await StorageService.saveData(STORAGE_KEYS.CLOVER_STATE, {
      careCount,
      stage,
      ...extraState,
      updatedAt: new Date().toISOString(),
    });
  },
  loadCloverState: async () => {
    const data = await StorageService.loadData(STORAGE_KEYS.CLOVER_STATE);
    if (!data || typeof data.careCount !== 'number') {
      return { careCount: 0, stage: 1 };
    }
    return {
      ...data,
      careCount: data.careCount,
      stage: getGrowthStage(data.careCount),
    };
  },
  // Garden flower collection persistence
  loadGardenFlowers: async () => {
    const list = await StorageService.loadData(STORAGE_KEYS.GARDEN_FLOWERS);
    return Array.isArray(list) ? list : [];
  },
  addGardenFlower: async (flower) => {
    const existing = await StorageService.loadGardenFlowers();
    const updated = [
      ...existing,
      {
        ...flower,
        id: flower.id || `flower_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        collectedAt: flower.collectedAt || new Date().toISOString(),
      },
    ];
    await StorageService.saveData(STORAGE_KEYS.GARDEN_FLOWERS, updated);
    return updated;
  },
  // Resets Clover to Sprouting (careCount = 0) while permanently keeping Garden flowers
  collectFlowerAndResetClover: async (flower) => {
    await StorageService.addGardenFlower(flower);
    await StorageService.saveCloverState(0, { pendingFlower: null });
    return { careCount: 0, stage: 1 };
  },
  // Bouquet persistence
  loadBouquets: async () => {
    const data = await StorageService.loadData(STORAGE_KEYS.BOUQUETS);
    return Array.isArray(data) ? data : [];
  },
  saveBouquet: async (bouquet) => {
    const existing = await StorageService.loadBouquets();
    const updated = [
      ...existing,
      {
        ...bouquet,
        id: bouquet.id || `bouquet_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        createdAt: new Date().toISOString(),
      },
    ];
    await StorageService.saveData(STORAGE_KEYS.BOUQUETS, updated);
    return updated;
  },
  // Whisper sequence state
  loadWhisperState: async () => {
    const data = await StorageService.loadData(STORAGE_KEYS.WHISPER_STATE);
    return data || { sequence: [], currentIndex: 0 };
  },
  saveWhisperState: async (state) => {
    await StorageService.saveData(STORAGE_KEYS.WHISPER_STATE, state);
  },
  // Daily messages state
  // Daily messages state
  loadDailyMessagesState: async () => {
    const data = await StorageService.loadData(STORAGE_KEYS.DAILY_MESSAGES_STATE);
    return data || null;
  },
  saveDailyMessagesState: async (state) => {
    await StorageService.saveData(STORAGE_KEYS.DAILY_MESSAGES_STATE, state);
  },
  // User settings state
  loadUserSettings: async () => {
    const data = await StorageService.loadData(STORAGE_KEYS.USER_SETTINGS);
    return data || { name: '' };
  },
  saveUserSettings: async (settings) => {
    await StorageService.saveData(STORAGE_KEYS.USER_SETTINGS, settings);
  },
};

