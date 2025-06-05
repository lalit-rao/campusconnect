import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function Index() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        const userToken = await AsyncStorage.getItem('userToken');
        
        setIsFirstTime(hasSeenOnboarding !== 'true');
        setIsAuthenticated(!!userToken);
      } catch (error) {
        console.error('Error checking app state:', error);
        setIsFirstTime(true);
        setIsAuthenticated(false);
      }
    };

    checkFirstTime();
  }, []);

  // Show loading indicator while checking state
  if (isFirstTime === null || isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        {/* Placeholder for loading animation */}
      </View>
    );
  }

  // Redirect based on app state
  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});