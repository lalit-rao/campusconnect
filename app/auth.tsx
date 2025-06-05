import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

export default function Auth() {
  const [activeTab, setActiveTab] = useState('login');
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image 
            source={{
              uri: 'https://images.pexels.com/photos/6147369/pexels-photo-6147369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            }}
            style={styles.headerImage}
          />
        </View>

        <Text style={styles.title}>Campus Connect</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'login' ? styles.activeTab : null
            ]}
            onPress={() => setActiveTab('login')}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'login' ? styles.activeTabText : null
            ]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'signup' ? styles.activeTab : null
            ]}
            onPress={() => setActiveTab('signup')}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'signup' ? styles.activeTabText : null
            ]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  headerImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: '#F5F5F5',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  activeTabText: {
    color: '#4A90E2',
    fontFamily: 'Poppins-Bold',
  },
  formContainer: {
    paddingHorizontal: 24,
  },
});