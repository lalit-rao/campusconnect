import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
const lightTheme = {
  primary: '#4A90E2',
  secondary: '#26A69A',
  accent: '#FF985F',
  background: '#FFFFFF',
  cardBackground: '#FFFFFF',
  text: '#212121',
  secondaryText: '#757575',
  disabledText: '#BDBDBD',
  border: '#E0E0E0',
  inputBackground: '#F5F5F5',
  error: '#E53935',
  success: '#43A047',
  warning: '#FFB300',
  dashboardCard1: '#E1F5FE',
  dashboardCard2: '#E0F2F1',
  dashboardCard3: '#F3E5F5',
  dashboardCard4: '#FCE4EC',
  Entertext: '#212121'
};

const darkTheme = {
  primary: '#64B5F6',
  secondary: '#4DB6AC',
  accent: '#FFB74D',
  background: '#121212',
  cardBackground: '#1E1E1E',
  text: '#FFFFFF',
  Entertext: '#212121',
  secondaryText: '#B0B0B0',
  disabledText: '#757575',
  border: '#333333',
  inputBackground: 'rgba(44,44,44,0.42)',
  error: '#EF5350',
  success: '#66BB6A',
  warning: '#FFD54F',
  dashboardCard1: 'rgba(13, 71, 161, 0.7)',   // glassy deep blue
  dashboardCard2: 'rgba(0, 77, 64, 0.7)',     // glassy dark teal
  dashboardCard3: 'rgba(74, 20, 140, 0.7)',   // glassy deep purple
  dashboardCard4: 'rgba(136, 14, 79, 0.7)'   // glassy dark pink

};

type ThemeContextType = {
  isDark: boolean;
  colors: typeof lightTheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // Load saved theme preference
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        } else {
          // Use system preference if no saved preference
          setIsDark(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
        setIsDark(systemColorScheme === 'dark');
      }
    };

    loadThemePreference();
  }, [systemColorScheme]);

  // Handle initial loading state
  if (isDark === null) {
    return null; // or a loading indicator
  }

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('themePreference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const colors = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
