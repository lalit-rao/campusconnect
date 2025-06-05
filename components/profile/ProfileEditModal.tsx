import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { X, Check } from 'lucide-react-native';

type ProfileEditModalProps = {
  visible: boolean;
  onClose: () => void;
  userData: any;
};

export default function ProfileEditModal({ visible, onClose, userData }: ProfileEditModalProps) {
  const { colors } = useTheme();
  
  const [name, setName] = useState(userData?.name || '');
  const [country, setCountry] = useState(userData?.country || '');
  const [languages, setLanguages] = useState(userData?.languages?.join(', ') || '');
  const [interests, setInterests] = useState(userData?.interests?.join(', ') || '');
  
  const handleSave = () => {
    // Here you would normally save the updated profile data
    // For this example, we'll just close the modal
    onClose();
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
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Check size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.formContainer}>
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
              style={[styles.saveButtonLarge, { backgroundColor: colors.primary }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
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