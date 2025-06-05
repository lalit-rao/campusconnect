import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import DashboardCard from '@/components/home/DashboardCard';
import { Map, Globe, CalendarDays, CircleHelp as HelpCircle } from 'lucide-react-native';
import { getGreeting } from '@/utils/helpers';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>{greeting},</Text>
            <Text style={[styles.username, { color: colors.primary }]}>{user?.name || 'Student'}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Image
              source={{ uri: user?.profilePic || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.featuredSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>What's New</Text>
          <View style={[styles.featuredCard, { backgroundColor: colors.cardBackground }]}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
              style={styles.featuredImage}
            />
            <View style={styles.featuredContent}>
              <Text style={[styles.featuredTitle, { color: colors.text }]}>Campus Tour</Text>
              <Text style={[styles.featuredDescription, { color: colors.secondaryText }]}>
                Join us for a guided campus tour today at 2 PM
              </Text>
              <TouchableOpacity
                style={[styles.featuredButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/events')}
              >
                <Text style={styles.featuredButtonText}>Join Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.cardsGrid}>
          <DashboardCard
            title="Explore Campus"
            icon={<Map size={24} color={colors.primary} />}
            onPress={() => router.push('/map')}
            // color="#E1F5FE"
            color={colors.dashboardCard1}
          />
          <DashboardCard
            title="Cultural Tips"
            icon={<Globe size={24} color="#26A69A" />}
            onPress={() => router.push('/cultural-tips')}
            // color="#E0F2F1"
            color={colors.dashboardCard2}
          />
          <DashboardCard
            title="Events"
            icon={<CalendarDays size={24} color="#AB47BC" />}
            onPress={() => router.push('/events')}
            // color="#F3E5F5"
            color={colors.dashboardCard3}
          />
          <DashboardCard
            title="Help & FAQs"
            icon={<HelpCircle size={24} color="#EC407A" />}
            onPress={() => router.push('/help')}
            // color="#FCE4EC"
            color={colors.dashboardCard4}
          />
        </View>

        <View style={styles.recommendedSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Language Buddies</Text>
          <TouchableOpacity
            style={[styles.viewAllButton, { borderColor: colors.border }]}
            onPress={() => router.push('/language-buddy')}
          >
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendedScroll}
        >
          {[1, 2, 3].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.buddyCard, { backgroundColor: colors.cardBackground }]}
              onPress={() => router.push('/language-buddy')}
            >
              <Image
                source={{ uri: `https://images.pexels.com/photos/${3190334 + item}/pexels-photo-${3190334 + item}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2` }}
                style={styles.buddyImage}
              />
              <Text style={[styles.buddyName, { color: colors.text }]}>Student {item}</Text>
              <Text style={[styles.buddyLanguage, { color: colors.secondaryText }]}>
                Speaks English, Spanish
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  username: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginTop: -4,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  featuredSection: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 12,
  },
  featuredCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuredButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  featuredButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 8,
  },
  recommendedSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  viewAllButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  viewAllText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  recommendedScroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  buddyCard: {
    width: 150,
    marginHorizontal: 4,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buddyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  buddyName: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  buddyLanguage: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
});
