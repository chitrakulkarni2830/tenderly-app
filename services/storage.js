import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  CLOVER_STATE: '@tenderly_clover_state',
  USER_SETTINGS: '@tenderly_user_settings',
};

/**
 * Cumulative care action thresholds:
 * Stage 1: 0 actions (0 - 2)
 * Stage 2: 3 total actions (3 - 6)
 * Stage 3: 7 total actions (7 - 11)
 * Stage 4: 12 total actions (12 - 17)
 * Stage 5: 18 total actions (18+)
 */
export const GROWTH_THRESHOLDS = {
  STAGE_1: 0,
  STAGE_2: 3,
  STAGE_3: 7,
  STAGE_4: 12,
  STAGE_5: 18,
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
 * Includes Clover state, selected theme, and user preferences.
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
  saveCloverState: async (careCount) => {
    const stage = getGrowthStage(careCount);
    await StorageService.saveData(STORAGE_KEYS.CLOVER_STATE, {
      careCount,
      stage,
      updatedAt: new Date().toISOString(),
    });
  },
  loadCloverState: async () => {
    const data = await StorageService.loadData(STORAGE_KEYS.CLOVER_STATE);
    if (!data || typeof data.careCount !== 'number') {
      return { careCount: 0, stage: 1 };
    }
    return {
      careCount: data.careCount,
      stage: getGrowthStage(data.careCount),
    };
  }
};

