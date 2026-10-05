import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Local storage abstraction for persisting application state.
 * Includes Clover state, selected theme, and user preferences.
 */
export const StorageService = {
  // Placeholder for storage methods
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
  }
};
