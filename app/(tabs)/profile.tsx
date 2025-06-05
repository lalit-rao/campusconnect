import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Camera, Moon, ChevronRight, LogOut } from 'lucide-react-native';
import ProfileEditModal from '@/components/profile/ProfileEditModal';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>
        
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: user?.profilePic || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
              style={styles.profileImage} 
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.profileName, { color: colors.text }]}>
            {user?.name || 'John Doe'}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.secondaryText }]}>
            {user?.email || 'john.doe@example.com'}
          </Text>

          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About Me</Text>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Country</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {user?.country || 'United States'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Languages</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {user?.languages?.join(', ') || 'English, Spanish'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Interests</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {user?.interests?.join(', ') || 'Music, Sports, Technology'}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          
          <View style={styles.preferenceRow}>
            <Text style={[styles.preferenceLabel, { color: colors.text }]}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D1D6', true: colors.primary }}
              thumbColor={'white'}
            />
          </View>
          
          <View style={styles.preferenceRow}>
            <Text style={[styles.preferenceLabel, { color: colors.text }]}>Push Notifications</Text>
            <Switch
              value={true}
              trackColor={{ false: '#D1D1D6', true: colors.primary }}
              thumbColor={'white'}
            />
          </View>
          
          <View style={styles.preferenceRow}>
            <Text style={[styles.preferenceLabel, { color: colors.text }]}>Email Updates</Text>
            <Switch
              value={false}
              trackColor={{ false: '#D1D1D6', true: colors.primary }}
              thumbColor={'white'}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About App</Text>
          
          <TouchableOpacity style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: colors.text }]}>Privacy Policy</Text>
            <ChevronRight size={20} color={colors.secondaryText} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: colors.text }]}>Terms of Service</Text>
            <ChevronRight size={20} color={colors.secondaryText} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: colors.text }]}>Version 1.0.0</Text>
            <ChevronRight size={20} color={colors.secondaryText} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.error }]}
          onPress={logout}
        >
          <LogOut size={20} color="white" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {isEditing && (
          <ProfileEditModal
            visible={isEditing}
            onClose={() => setIsEditing(false)}
            userData={user}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A90E2',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  section: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  preferenceLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginBottom: 40,
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginLeft: 8,
  },
});