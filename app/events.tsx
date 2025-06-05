import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ChevronLeft, Calendar, MapPin, Clock, Plus } from 'lucide-react-native';
import { Calendar as CalendarComponent } from 'react-native-calendars';

const events = [
  {
    id: '11',
    title: 'New Year Wellness Run',
    description: 'Start the year with a 5K fun run around campus, open to all students and staff.',
    date: '2025-01-10',
    time: '7:00 AM - 9:00 AM',
    location: 'Sports Complex Track',
    category: 'Sports',
    image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '12',
    title: 'Republic Day Parade & Cultural Show',
    description: 'Celebrate India’s Republic Day with a flag hoisting ceremony and student performances.',
    date: '2025-01-26',
    time: '8:00 AM - 11:00 AM',
    location: 'Central Lawn',
    category: 'Cultural',
    image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '13',
    title: 'Resume Building Workshop',
    description: 'Learn how to craft an impactful resume with guidance from the Career Services team.',
    date: '2025-02-05',
    time: '2:00 PM - 4:00 PM',
    location: 'Career Services Center',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '14',
    title: 'Spring Fest: Colors of Rajasthan',
    description: 'A celebration of Rajasthan’s vibrant culture with folk music, dance, and food.',
    date: '2025-03-05',
    time: '5:00 PM - 9:00 PM',
    location: 'Open Air Theatre',
    category: 'Cultural',
    image: 'https://images.pexels.com/photos/164631/pexels-photo-164631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '16',
    title: 'Women’s Day Panel Discussion',
    description: 'Inspiring talks and discussions with women leaders in STEM and entrepreneurship.',
    date: '2025-03-08',
    time: '3:00 PM - 5:00 PM',
    location: 'Auditorium',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '15',
    title: 'Coding Hackathon',
    description: '24-hour coding challenge for teams to solve real-world problems and win prizes.',
    date: '2025-03-20',
    time: '9:00 AM - 9:00 AM (next day)',
    location: 'Computer Science Block',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '17',
    title: 'Spring Cricket League',
    description: 'Inter-departmental cricket tournament. Form your teams and compete for the trophy!',
    date: '2025-04-10',
    time: '4:00 PM - 8:00 PM',
    location: 'Cricket Ground',
    category: 'Sports',
    image: 'https://images.pexels.com/photos/163209/sports-cricket-batsman-athlete-163209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '18',
    title: 'Earth Day Tree Plantation Drive',
    description: 'Join the Green Club to plant saplings and promote sustainability on campus.',
    date: '2025-04-22',
    time: '8:00 AM - 10:00 AM',
    location: 'Central Lawn',
    category: 'Social',
    image: 'https://images.pexels.com/photos/296230/pexels-photo-296230.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '19',
    title: 'Alumni Connect: Career Stories',
    description: 'Interact with successful MUJ alumni and learn from their career journeys.',
    date: '2025-05-05',
    time: '5:00 PM - 7:00 PM',
    location: 'Seminar Hall, Academic Block 2',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/1181696/pexels-photo-1181696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '20',
    title: 'Summer Yoga Retreat',
    description: 'A weekend of yoga, meditation, and wellness workshops for stress relief.',
    date: '2025-06-03',
    time: '6:00 AM - 10:00 AM',
    location: 'Sports Complex Lawn',
    category: 'Sports',
    image: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '21',
    title: 'Monsoon Music Night',
    description: 'An evening of live music performances by student bands and solo artists.',
    date: '2025-06-03',
    time: '7:00 PM - 10:00 PM',
    location: 'Open Air Theatre',
    category: 'Cultural',
    image: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '24',
    title: 'Garba Night',
    description: 'Celebrate Navratri with traditional Garba dance, music, and festive attire.',
    date: '2025-06-06',
    time: '7:00 PM - 10:00 PM',
    location: 'Central Lawn',
    category: 'Cultural',
    image: 'https://images.pexels.com/photos/164631/pexels-photo-164631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '1',
    title: 'MUJ Campus Orientation Tour',
    description: 'A guided tour for new students covering all major campus buildings, hostels, and facilities.',
    date: '2025-07-15',
    time: '10:00 AM - 12:00 PM',
    location: 'Main Gate, Manipal University Jaipur',
    category: 'Tour',
    image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '2',
    title: 'International Students Welcome Mixer',
    description: 'Meet fellow international and outstation students, enjoy icebreakers, and make new friends.',
    date: '2025-07-16',
    time: '6:00 PM - 8:00 PM',
    location: 'Global Engagement Cell, MUJ',
    category: 'Social',
    image: 'https://images.pexels.com/photos/2422293/pexels-photo-2422293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '3',
    title: 'Library & Digital Resources Workshop',
    description: 'Learn how to access MUJ’s digital library, e-resources, and research tools.',
    date: '2025-07-17',
    time: '11:00 AM - 1:00 PM',
    location: 'Central Library, Room 201',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/159844/book-read-literature-pages-159844.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '4',
    title: 'Oneiros Cultural Fest Launch',
    description: 'Kick-off for MUJ’s annual cultural extravaganza with music, dance, and food stalls.',
    date: '2025-08-05',
    time: '5:00 PM - 9:00 PM',
    location: 'Open Air Theatre',
    category: 'Cultural',
    image: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '5',
    title: 'Tech Talk: AI & IoT Trends',
    description: 'A guest lecture by industry experts on the latest in Artificial Intelligence and Internet of Things.',
    date: '2025-08-10',
    time: '3:00 PM - 5:00 PM',
    location: 'Auditorium, Academic Block 3',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '6',
    title: 'Basketball League: MUJ vs. JECRC',
    description: 'Cheer for the MUJ basketball team as they face off against JECRC University.',
    date: '2025-08-12',
    time: '7:00 PM - 9:00 PM',
    location: 'Sports Complex',
    category: 'Sports',
    image: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '7',
    title: 'Photography Club Walk',
    description: 'Join the Photography Club for a creative campus photo walk and competition.',
    date: '2025-08-15',
    time: '4:00 PM - 6:00 PM',
    location: 'Central Lawn',
    category: 'Social',
    image: 'https://images.pexels.com/photos/167964/pexels-photo-167964.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '22',
    title: 'Independence Day Celebrations',
    description: 'Flag hoisting, parade, and patriotic performances to mark India’s Independence Day.',
    date: '2025-08-15',
    time: '8:00 AM - 12:00 PM',
    location: 'Central Lawn',
    category: 'Cultural',
    image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '8',
    title: 'Startup Bootcamp',
    description: 'A two-day workshop on entrepreneurship, ideation, and pitching, hosted by MUJ E-Cell.',
    date: '2025-08-20',
    time: '9:00 AM - 6:00 PM',
    location: 'Innovation & Incubation Center',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '9',
    title: 'Yoga for Wellness',
    description: 'Morning yoga session for stress relief and wellness, open to all students and staff.',
    date: '2025-08-22',
    time: '6:30 AM - 8:00 AM',
    location: 'Sports Complex Lawn',
    category: 'Sports',
    image: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '10',
    title: 'MUJ Food Carnival',
    description: 'Enjoy cuisines from across India and the world at the annual food carnival.',
    date: '2025-08-25',
    time: '12:00 PM - 4:00 PM',
    location: 'Food Court & Central Lawn',
    category: 'Cultural',
    image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '23',
    title: 'Robotics Club Demo Day',
    description: 'See the latest student-built robots in action and learn about robotics projects.',
    date: '2025-09-05',
    time: '2:00 PM - 5:00 PM',
    location: 'Innovation Lab',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '25',
    title: 'Career Fair & Internship Expo',
    description: 'Meet recruiters from top companies and apply for internships and jobs.',
    date: '2025-10-15',
    time: '10:00 AM - 4:00 PM',
    location: 'Convention Center',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '26',
    title: 'Diwali Mela',
    description: 'Enjoy food stalls, games, and cultural performances at the annual Diwali fair.',
    date: '2025-10-29',
    time: '5:00 PM - 9:00 PM',
    location: 'Central Lawn',
    category: 'Cultural',
    image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '27',
    title: 'Inter-College Football Tournament',
    description: 'Watch teams from different colleges compete for the MUJ Football Cup.',
    date: '2025-11-10',
    time: '4:00 PM - 8:00 PM',
    location: 'Football Ground',
    category: 'Sports',
    image: 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '28',
    title: 'Winter Coding Bootcamp',
    description: 'Intensive week-long bootcamp on full-stack development, open to all branches.',
    date: '2025-12-01',
    time: '10:00 AM - 5:00 PM',
    location: 'Computer Science Block',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '29',
    title: 'Charity Marathon',
    description: 'Participate in a marathon to raise funds for local NGOs and community projects.',
    date: '2025-12-10',
    time: '6:00 AM - 9:00 AM',
    location: 'Campus Grounds',
    category: 'Sports',
    image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '30',
    title: 'Christmas Eve Social',
    description: 'Celebrate the festive season with music, food, and Secret Santa gift exchange.',
    date: '2025-12-24',
    time: '6:00 PM - 9:00 PM',
    location: 'Student Center',
    category: 'Social',
    image: 'https://images.pexels.com/photos/1303082/pexels-photo-1303082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  }
];



export default function EventsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);

  const filteredEvents = events.filter(event => event.date === selectedDate);

  const markedDates = events.reduce((acc, event) => {
    acc[event.date] = { marked: true, dotColor: colors.primary };
    if (event.date === selectedDate) {
      acc[event.date] = {
        ...acc[event.date],
        selected: true,
        selectedColor: colors.primary,
      };
    }
    return acc;
  }, {});

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Academic':
        return '#5C6BC0';
      case 'Social':
        return '#26A69A';
      case 'Tour':
        return '#FFA000';
      case 'Sports':
        return '#EF5350';
      default:
        return colors.primary;
    }
  };

  const renderEventItem = ({ item }) => (
    <View style={[styles.eventCard, { backgroundColor: colors.cardBackground }]}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />

      <View style={styles.eventDetails}>
        <View style={styles.eventHeader}>
          <Text style={[styles.eventTitle, { color: colors.text }]}>{item.title}</Text>
          <View
            style={[
              styles.categoryTag,
              { backgroundColor: getCategoryColor(item.category) }
            ]}
          >
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>

        <Text
          style={[styles.eventDescription, { color: colors.secondaryText }]}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View style={styles.eventMeta}>
          <View style={styles.metaItem}>
            <Clock size={16} color={colors.secondaryText} />
            <Text style={[styles.metaText, { color: colors.secondaryText }]}>
              {item.time}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <MapPin size={16} color={colors.secondaryText} />
            <Text style={[styles.metaText, { color: colors.secondaryText }]}>
              {item.location}
            </Text>
          </View>
        </View>

        <View style={styles.eventActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.actionButtonText}>Add to Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#85b95f' }]}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              I'm Interested
            </Text>
          </TouchableOpacity>
        </View>
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
        <Text style={[styles.title, { color: colors.text }]}>Events & Activities</Text>
        <View style={{ width: 24 }} />
      </View>

      <CalendarComponent
        style={styles.calendar}
        theme={{
          calendarBackground: colors.cardBackground,
          textSectionTitleColor: colors.secondaryText,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: colors.primary,
          dayTextColor: colors.text,
          textDisabledColor: colors.disabledText,
          dotColor: colors.primary,
          arrowColor: colors.primary,
          monthTextColor: colors.text,
        }}
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />

      <View style={styles.eventsSection}>
        <View style={styles.eventsSectionHeader}>
          <View style={styles.dateContainer}>
            <Calendar size={16} color={colors.primary} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {new Date(selectedDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
          </View>
          <Text style={[styles.eventsCount, { color: colors.secondaryText }]}>
            {filteredEvents.length} events
          </Text>
        </View>

        <FlatList
          data={filteredEvents}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.eventsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                No events for this day
              </Text>
            </View>
          )}
        />
      </View>

      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: colors.primary }]}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
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
  calendar: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  eventsSection: {
    flex: 1,
    marginTop: 16,
  },
  eventsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  eventsCount: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  eventsList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  eventCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  eventDetails: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    flex: 1,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Poppins-Regular',
  },
  eventMeta: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
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
  floatingButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
