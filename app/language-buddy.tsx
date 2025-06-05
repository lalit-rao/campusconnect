import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ChevronLeft, ChevronDown, Flag, MessagesSquare } from 'lucide-react-native';

const languages = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Hindi'
];

const buddies = [
  {
    id: '1',
    name: 'Emma Wilson',
    country: 'USA',
    speaks: ['English', 'Spanish'],
    learning: ['French'],
    interests: ['Music', 'Travel'],
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '2',
    name: 'Luisa Garcia',
    country: 'Spain',
    speaks: ['Spanish', 'French'],
    learning: ['English'],
    interests: ['Cooking', 'Cinema'],
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '3',
    name: 'Hiroshi Tanaka',
    country: 'Japan',
    speaks: ['Japanese', 'English'],
    learning: ['Spanish'],
    interests: ['Technology', 'Anime'],
    image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '4',
    name: 'Sophie Dupont',
    country: 'France',
    speaks: ['French', 'English'],
    learning: ['Chinese'],
    interests: ['Art', 'Dancing'],
    image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '5',
    name: 'Wei Zhang',
    country: 'China',
    speaks: ['Chinese', 'English'],
    learning: ['German'],
    interests: ['Sports', 'Photography'],
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

export default function LanguageBuddyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [languageFilter, setLanguageFilter] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('suggestions');

  const filteredBuddies = buddies.filter(buddy => buddy.speaks.includes(languageFilter));

  const renderBuddyItem = ({ item }) => (
    <View style={[styles.buddyCard, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.buddyHeader}>
        <Image source={{ uri: item.image }} style={styles.buddyImage} />
        <View style={styles.buddyInfo}>
          <Text style={[styles.buddyName, { color: colors.text }]}>{item.name}</Text>
          <View style={styles.countryRow}>
            <Flag size={16} color={colors.secondaryText} />
            <Text style={[styles.countryText, { color: colors.secondaryText }]}>{item.country}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.languageSection}>
        <Text style={[styles.languageLabel, { color: colors.secondaryText }]}>Speaks</Text>
        <View style={styles.languageTags}>
          {item.speaks.map((lang) => (
            <View 
              key={lang}
              style={[styles.languageTag, { backgroundColor: colors.primary + '20' }]}
            >
              <Text style={[styles.languageTagText, { color: colors.primary }]}>{lang}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.languageSection}>
        <Text style={[styles.languageLabel, { color: colors.secondaryText }]}>Learning</Text>
        <View style={styles.languageTags}>
          {item.learning.map((lang) => (
            <View 
              key={lang}
              style={[styles.languageTag, { backgroundColor: '#FF985F20' }]}
            >
              <Text style={[styles.languageTagText, { color: '#FF985F' }]}>{lang}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.interestsSection}>
        <Text style={[styles.interestsLabel, { color: colors.secondaryText }]}>Interests</Text>
        <Text style={[styles.interestsText, { color: colors.text }]}>{item.interests.join(', ')}</Text>
      </View>
      
      <View style={styles.buttonsRow}>
        <TouchableOpacity 
          style={[styles.messageButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/chat')}
        >
          <MessagesSquare size={16} color="white" />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.connectButton, { borderColor: colors.primary }]}>
          <Text style={[styles.connectButtonText, { color: colors.primary }]}>Send Request</Text>
        </TouchableOpacity>
      </View>
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

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'suggestions' && [styles.activeTab, { borderColor: colors.primary }],
          ]}
          onPress={() => setActiveTab('suggestions')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'suggestions' && [styles.activeTabText, { color: colors.primary }],
            ]}
          >
            Suggestions
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'buddies' && [styles.activeTab, { borderColor: colors.primary }],
          ]}
          onPress={() => setActiveTab('buddies')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'buddies' && [styles.activeTabText, { color: colors.primary }],
            ]}
          >
            My Buddies
          </Text>
        </TouchableOpacity>
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
              No {activeTab === 'suggestions' ? 'suggestions' : 'buddies'} available
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
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
    justifyContent: 'center',
  },
  messageButtonText: {
    marginLeft: 8,
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  connectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  connectButtonText: {
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