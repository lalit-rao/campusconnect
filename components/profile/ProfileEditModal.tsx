import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, Alert, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { X, Check, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

type ProfileEditModalProps = {
  visible: boolean;
  onClose: () => void;
  userData: any;
};

export default function ProfileEditModal({ visible, onClose, userData }: ProfileEditModalProps) {
  const { colors } = useTheme();
  const { updateUserProfile } = useAuth();
  
  const [name, setName] = useState(userData?.name || '');
  const [country, setCountry] = useState(userData?.country || '');
  const [languages, setLanguages] = useState(userData?.languages?.join(', ') || '');
  const [interests, setInterests] = useState(userData?.interests?.join(', ') || '');
  const [profilePic, setProfilePic] = useState(userData?.profilePic || '');
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to change profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };
  
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = {
        name: name.trim(),
        country: country.trim(),
        languages: languages.split(',').map(lang => lang.trim()).filter(lang => lang),
        interests: interests.split(',').map(interest => interest.trim()).filter(interest => interest),
        profilePic: profilePic,
      };
      
      await updateUserProfile(updatedData);
      Alert.alert('Success', 'Profile updated successfully!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
            <TouchableOpacity 
              onPress={handleSave} 
              style={[styles.saveButton, { opacity: isLoading ? 0.5 : 1 }]}
              disabled={isLoading}
            >
              <Check size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.formContainer}>
            <View style={styles.profilePicSection}>
              <TouchableOpacity onPress={pickImage} style={styles.profilePicContainer}>
                <Image 
                  source={{ uri: profilePic || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
                  style={styles.profilePic} 
                />
                <View style={[styles.cameraIcon, { backgroundColor: colors.primary }]}>
                  <Camera size={16} color="white" />
                </View>
              </TouchableOpacity>
              <Text style={[styles.profilePicLabel, { color: colors.secondaryText }]}>Tap to change photo</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: colors.border 
                  }
                ]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.secondaryText}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Country</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: colors.border 
                  }
                ]}
                value={country}
                onChangeText={setCountry}
                placeholder="Enter your country"
                placeholderTextColor={colors.secondaryText}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Languages</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: colors.border 
                  }
                ]}
                value={languages}
                onChangeText={setLanguages}
                placeholder="e.g. English, Spanish"
                placeholderTextColor={colors.secondaryText}
              />
              <Text style={[styles.inputHelper, { color: colors.secondaryText }]}>
                Separate languages with commas
              </Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Interests</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: colors.border,
                    height: 100,
                    textAlignVertical: 'top',
                    paddingTop: 12
                  }
                ]}
                value={interests}
                onChangeText={setInterests}
                placeholder="e.g. Music, Sports, Technology"
                placeholderTextColor={colors.secondaryText}
                multiline
                numberOfLines={4}
              />
              <Text style={[styles.inputHelper, { color: colors.secondaryText }]}>
                Separate interests with commas
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.saveButtonLarge, { 
                backgroundColor: colors.primary,
                opacity: isLoading ? 0.5 : 1 
              }]}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  formContainer: {
    padding: 24,
  },
  profilePicSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePicContainer: {
    position: 'relative',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profilePicLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  inputHelper: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  saveButtonLarge: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});