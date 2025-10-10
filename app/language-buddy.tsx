import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, ChevronDown, Flag, MessagesSquare } from 'lucide-react-native';
import { getAllUsers, createOrGetChat } from '@/services/messageService';

const languages = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Hindi'
];

export default function LanguageBuddyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [languageFilter, setLanguageFilter] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('suggestions');
  const [buddies, setBuddies] = useState([]);

  useEffect(() => {
    loadBuddies();
  }, [user]);

  const loadBuddies = async () => {
    if (!user) return;
    try {
      const users = await getAllUsers(user.id);
      setBuddies(users);
    } catch (error) {
      console.error('Error loading buddies:', error);
    }
  };

  const startChat = async (otherUser: any) => {
    if (!user) return;
    try {
      const chatId = await createOrGetChat(
        user.id,
        otherUser.id,
        user.name,
        otherUser.name,
        user.profilePic,
        otherUser.profilePic
      );
      router.push(`/chat?chatId=${chatId}&otherUserName=${otherUser.name}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to start chat');
    }
  };

  const filteredBuddies = buddies.filter(buddy => 
    buddy.languages?.some(lang => lang.toLowerCase().includes(languageFilter.toLowerCase()))
  );

  const renderBuddyItem = ({ item }) => (
    <View style={[styles.buddyCard, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.buddyHeader}>
        <Image 
          source={{ 
            uri: item.profilePic || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' 
          }} 
          style={styles.buddyImage} 
        />
        <View style={styles.buddyInfo}>
          <Text style={[styles.buddyName, { color: colors.text }]}>{item.name}</Text>
          <View style={styles.countryRow}>
            <Flag size={16} color={colors.secondaryText} />
            <Text style={[styles.countryText, { color: colors.secondaryText }]}>{item.country || 'Unknown'}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.languageSection}>
        <Text style={[styles.languageLabel, { color: colors.secondaryText }]}>Languages</Text>
        <View style={styles.languageTags}>
          {(item.languages || ['English']).map((lang) => (
            <View 
              key={lang}
              style={[styles.languageTag, { backgroundColor: colors.primary + '20' }]}
            >
              <Text style={[styles.languageTagText, { color: colors.primary }]}>{lang}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.interestsSection}>
        <Text style={[styles.interestsLabel, { color: colors.secondaryText }]}>Interests</Text>
        <Text style={[styles.interestsText, { color: colors.text }]}>
          {item.interests?.join(', ') || 'Music, Sports, Technology'}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.messageButton, { backgroundColor: colors.primary }]}
        onPress={() => startChat(item)}
      >
        <MessagesSquare size={16} color="white" />
        <Text style={styles.messageButtonText}>Message</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Language Buddies</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filterSection}>
        <Text style={[styles.filterLabel, { color: colors.text }]}>I want to practice</Text>
        <TouchableOpacity 
          style={[styles.languageDropdown, { backgroundColor: colors.inputBackground }]}
          onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
        >
          <Text style={[styles.selectedLanguage, { color: colors.text }]}>{languageFilter}</Text>
          <ChevronDown size={20} color={colors.text} />
        </TouchableOpacity>
        
        {showLanguageDropdown && (
          <View style={[styles.dropdown, { backgroundColor: colors.cardBackground }]}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language}
                style={styles.dropdownItem}
                onPress={() => {
                  setLanguageFilter(language);
                  setShowLanguageDropdown(false);
                }}
              >
                <Text 
                  style={[
                    styles.dropdownItemText,
                    { 
                      color: language === languageFilter ? colors.primary : colors.text,
                      fontFamily: language === languageFilter ? 'Poppins-Bold' : 'Poppins-Regular'
                    }
                  ]}
                >
                  {language}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      
      
      
      <FlatList
        data={filteredBuddies}
        renderItem={renderBuddyItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.buddyList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              {buddies.length === 0 ? 'No users registered yet' : `No users speak ${languageFilter}`}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  filterSection: {
    paddingHorizontal: 24,
    marginBottom: 8,
    position: 'relative',
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  languageDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedLanguage: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  dropdown: {
    position: 'absolute',
    top: 84,
    left: 24,
    right: 24,
    borderRadius: 8,
    paddingVertical: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#9E9E9E',
  },
  activeTabText: {
    fontFamily: 'Poppins-Bold',
  },
  buddyList: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  buddyCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buddyHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  buddyImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  buddyInfo: {
    justifyContent: 'center',
  },
  buddyName: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  languageSection: {
    marginBottom: 12,
  },
  languageLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  languageTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  languageTagText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  interestsSection: {
    marginBottom: 16,
  },
  interestsLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  interestsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  messageButtonText: {
    marginLeft: 8,
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },

  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});