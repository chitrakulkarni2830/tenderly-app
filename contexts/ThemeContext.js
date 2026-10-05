import { createContext, useContext, useState, useEffect } from 'react';
import { StorageService, STORAGE_KEYS } from '../services/storage';
import { themes } from '../themes';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState('garden');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await StorageService.loadData(STORAGE_KEYS.THEME);
      if (storedTheme && themes[storedTheme]) {
        setCurrentThemeId(storedTheme);
      }
      setIsReady(true);
    };
    loadTheme();
  }, []);

  const changeTheme = async (themeId) => {
    if (themes[themeId]) {
      setCurrentThemeId(themeId);
      await StorageService.saveData(STORAGE_KEYS.THEME, themeId);
    }
  };

  const theme = themes[currentThemeId] || themes.garden;

  if (!isReady) return null;

  return (
    <ThemeContext.Provider value={{ theme, currentThemeId, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
