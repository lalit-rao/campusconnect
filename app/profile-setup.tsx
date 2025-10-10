import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, X, Plus } from 'lucide-react-native';

const countries = [
  'India', 'Russia', 'United States', 'United Kingdom', 'Canada', 'Australia', 
  'Germany', 'France', 'Spain', 'Italy', 'Japan', 'China', 'South Korea', 
  'Brazil', 'Mexico', 'Netherlands', 'Sweden', 'Norway', 'Other'
];

const languages = [
  'English', 'Hindi', 'Russian', 'Spanish', 'French', 'German', 'Chinese', 
  'Japanese', 'Korean', 'Arabic', 'Portuguese', 'Italian', 'Dutch', 'Swedish', 
  'Norwegian', 'Finnish', 'Polish', 'Turkish', 'Thai', 'Vietnamese'
];

const interests = [
  'Music', 'Sports', 'Technology', 'Art', 'Cooking', 'Travel', 'Photography', 
  'Reading', 'Movies', 'Gaming', 'Dancing', 'Fitness', 'Fashion', 'Science', 
  'History', 'Literature', 'Business', 'Politics', 'Nature', 'Volunteering'
];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, updateUserProfile } = useAuth();
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showInterestDropdown, setShowInterestDropdown] = useState(false);
  
  const [languageSearch, setLanguageSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredLanguages = languages.filter(lang => 
    lang.toLowerCase().includes(languageSearch.toLowerCase())
  );

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests(prev => [...prev, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(prev => prev.filter(i => i !== interest));
  };

  const handleSave = async () => {
    if (!selectedCountry || selectedLanguages.length === 0 || selectedInterests.length === 0) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({
        country: selectedCountry,
        languages: selectedLanguages,
        interests: selectedInterests,
        profileSetupComplete: true
      });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Complete Your Profile</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Help others find you by sharing your background
          </Text>
        </View>

        {/* Country Selection */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Country</Text>
          <TouchableOpacity 
            style={[styles.dropdown, { backgroundColor: colors.inputBackground }]}
            onPress={() => setShowCountryDropdown(!showCountryDropdown)}
          >
            <Text style={[styles.dropdownText, { color: selectedCountry ? colors.text : colors.secondaryText }]}>
              {selectedCountry || 'Select your country'}
            </Text>
            <ChevronDown size={20} color={colors.secondaryText} />
          </TouchableOpacity>
          
          {showCountryDropdown && (
            <View style={[styles.dropdownList, { backgroundColor: colors.cardBackground }]}>
              <ScrollView style={styles.dropdownScroll}>
                {countries.map((country) => (
                  <TouchableOpacity
                    key={country}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedCountry(country);
                      setShowCountryDropdown(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, { color: colors.text }]}>{country}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Languages Selection */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Languages You Speak</Text>
          <TouchableOpacity 
            style={[styles.dropdown, { backgroundColor: colors.inputBackground }]}
            onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
          >
            <Text style={[styles.dropdownText, { color: selectedLanguages.length > 0 ? colors.text : colors.secondaryText }]}>
              {selectedLanguages.length > 0 ? `${selectedLanguages.length} selected` : 'Select languages'}
            </Text>
            <ChevronDown size={20} color={colors.secondaryText} />
          </TouchableOpacity>
          
          {showLanguageDropdown && (
            <View style={[styles.dropdownList, { backgroundColor: colors.cardBackground }]}>
              <TextInput
                style={[styles.searchInput, { backgroundColor: colors.inputBackground, color: colors.text }]}
                placeholder="Search languages..."
                placeholderTextColor={colors.secondaryText}
                value={languageSearch}
                onChangeText={setLanguageSearch}
              />
              <ScrollView style={styles.dropdownScroll}>
                {filteredLanguages.map((language) => (
                  <TouchableOpacity
                    key={language}
                    style={[styles.dropdownItem, selectedLanguages.includes(language) && { backgroundColor: colors.primary + '20' }]}
                    onPress={() => toggleLanguage(language)}
                  >
                    <Text style={[styles.dropdownItemText, { 
                      color: selectedLanguages.includes(language) ? colors.primary : colors.text 
                    }]}>
                      {language}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          
          {selectedLanguages.length > 0 && (
            <View style={styles.selectedTags}>
              {selectedLanguages.map((language) => (
                <View key={language} style={[styles.tag, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.tagText, { color: colors.primary }]}>{language}</Text>
                  <TouchableOpacity onPress={() => toggleLanguage(language)}>
                    <X size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Interests Selection */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Interests</Text>
          <TouchableOpacity 
            style={[styles.dropdown, { backgroundColor: colors.inputBackground }]}
            onPress={() => setShowInterestDropdown(!showInterestDropdown)}
          >
            <Text style={[styles.dropdownText, { color: selectedInterests.length > 0 ? colors.text : colors.secondaryText }]}>
              {selectedInterests.length > 0 ? `${selectedInterests.length} selected` : 'Select interests'}
            </Text>
            <ChevronDown size={20} color={colors.secondaryText} />
          </TouchableOpacity>
          
          {showInterestDropdown && (
            <View style={[styles.dropdownList, { backgroundColor: colors.cardBackground }]}>
              <ScrollView style={styles.dropdownScroll}>
                {interests.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    style={[styles.dropdownItem, selectedInterests.includes(interest) && { backgroundColor: colors.primary + '20' }]}
                    onPress={() => toggleInterest(interest)}
                  >
                    <Text style={[styles.dropdownItemText, { 
                      color: selectedInterests.includes(interest) ? colors.primary : colors.text 
                    }]}>
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          
          <View style={styles.customInterestRow}>
            <TextInput
              style={[styles.customInterestInput, { backgroundColor: colors.inputBackground, color: colors.text }]}
              placeholder="Add custom interest..."
              placeholderTextColor={colors.secondaryText}
              value={customInterest}
              onChangeText={setCustomInterest}
            />
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={addCustomInterest}
            >
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          {selectedInterests.length > 0 && (
            <View style={styles.selectedTags}>
              {selectedInterests.map((interest) => (
                <View key={interest} style={[styles.tag, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.tagText, { color: colors.primary }]}>{interest}</Text>
                  <TouchableOpacity onPress={() => removeInterest(interest)}>
                    <X size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Complete Setup'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  dropdownList: {
    marginTop: 8,
    borderRadius: 12,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownScroll: {
    maxHeight: 180,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  searchInput: {
    margin: 12,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginRight: 8,
  },
  customInterestRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  customInterestInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginRight: 8,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    marginHorizontal: 24,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});