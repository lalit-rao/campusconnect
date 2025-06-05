import { useCallback } from 'react';
import { Text, View, StyleSheet, useWindowDimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingItem from '@/components/onboarding/OnboardingItem';
import Paginator from '@/components/onboarding/Paginator';

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to Campus Connect',
    description: 'Your guide to exploring your new campus and city!',
    image: 'https://images.pexels.com/photos/8358126/pexels-photo-8358126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 2,
    title: 'Discover Resources',
    description: 'Find buildings, services, and events with ease.',
    image: 'https://images.pexels.com/photos/5905498/pexels-photo-5905498.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 3,
    title: 'Connect & Learn',
    description: "Get tips from students who've been in your shoes.",
    image: 'https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const flatListRef = useAnimatedRef();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleSkip = useCallback(async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/auth');
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  }, [router]);

  const handleGetStarted = useCallback(async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/auth');
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={({ item }) => <OnboardingItem item={item} width={width} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id.toString()}
      />

      <View style={styles.bottomContainer}>
        <Paginator data={onboardingData} scrollX={scrollX} />
        
        <TouchableOpacity 
          style={styles.getStartedButton} 
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Medium',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    paddingTop: 8,
  },
  getStartedButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  getStartedText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});