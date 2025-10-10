import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        setIsFirstTime(hasSeenOnboarding !== 'true');
      } catch (error) {
        console.error('Error checking app state:', error);
        setIsFirstTime(true);
      }
    };

    checkFirstTime();
  }, []);

  // Show loading indicator while checking state
  if (isFirstTime === null || isLoading) {
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

  // Check if user needs to complete profile setup
  if (user && !user.profileSetupComplete) {
    return <Redirect href="/profile-setup" />;
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