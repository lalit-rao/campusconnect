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
    title: 'Diwali',
    description: 'Enjoy the festuval of lights with fireworks and sweets.',
    date: '2025-10-20',
    time: 'All day',
    location: 'Campus Wide',
    category: 'Festival',
    image: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '12',
    title: 'Govardhan Puja',
    description: 'Celebrate the traditional Govardhan Puja with rituals and community feasting.',
    date: '2025-10-22',
    time: 'All Day',
    location: 'Campus Temple Grounds',
    category: 'Spiritual',
    image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '13',
    title: 'TechiDeate',
    description: 'A tech symposium featuring workshops, guest lectures, and project exhibitions.',
    date: '2025-11-14',
    time: '9:00 AM - 6:00 PM',
    location: 'Academic Block 1',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '14',
    title: 'TechiDeate',
    description: 'A tech symposium featuring workshops, guest lectures, and project exhibitions.',
    date: '2025-11-15',
    time: '9:00 AM - 6:00 PM',
    location: 'Academic Block 1',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '16',
    title: 'Last Instruction Date',
    description: 'Last day of regular classes for the semester. Prepare for exams!',
    date: '2025-11-19',
    time: '9:00 AM - 6:00 PM',
    location: '',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '15',
    title: 'Re-Sessional Exams',
    description: 'Re-Semester exams begin. Best of luck to all students!',
    date: '2025-11-20',
    time: '9:00 AM - 6:00 PM',
    location: 'As per allocated classrooms',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '17',
    title: 'Re-Sessional Exams',
    description: 'Re-Semester exams begin. Best of luck to all students!',
    date: '2025-11-21',
    time: '9:00 AM - 6:00 PM',
    location: 'As per allocated classrooms',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '18',
    title: 'Re-Sessional Exams',
    description: 'Re-Semester exams begin. Best of luck to all students!',
    date: '2025-11-22',
    time: '9:00 AM - 6:00 PM',
    location: 'As per allocated classrooms',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '19',
    title: 'Start of End Term Exams',
    description: 'End Term exams for the semester commence. Stay focused and do your best!',
    date: '2025-11-21',
    time: '9:00 AM - 6:00 PM',
    location: 'As per seating plan',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/1181696/pexels-photo-1181696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '20',
    title: 'End of End Term Exams',
    description: 'End Term exams for the semester Ends. Happy vacations!',
    date: '2025-12-05',
    time: '9:00 AM - 6:00 PM',
    location: '',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/1181696/pexels-photo-1181696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  
  },
  {
    id: '21',
    title: 'Start of Winter Break',
    description: 'Winter break begins. Enjoy your holidays and recharge for the next semester!',
    date: '2025-12-06',
    time: '',
    location: '',
    category: 'Vacation',
    image: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '24',
    title: 'Result Decalration',
    description: 'Semester results will be declared. Check your grades online.',
    date: '2025-12-17',
    time: 'All Day',
    location: 'Online Portal',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/164631/pexels-photo-164631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '1',
    title: 'End of Winter break',
    description: 'Winter break ends. Classes resume for the new semester.',
    date: '2026-01-04',
    time: '',
    location: '',
    category: 'Vacation',
    image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '2',
    title: 'Commencement of Classes for Even Semester',
    description: 'New semester begins. Welcome back students!',
    date: '2026-01-05',
    time: '9:00 AM - 6:00 PM',
    location: 'MUJ Campus',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/2422293/pexels-photo-2422293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '3',
    title: 'Republic Day',
    description: 'National holiday celebrating the adoption of the Constitution of India.',
    date: '2026-01-26',
    time: 'All Day',
    location: 'Campus Wide',
    category: 'National',
    image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '4',
    title: 'National Science Day',
    description: 'Celebrating scientific achievements and promoting scientific temper.',
    date: '2026-02-28',
    time: 'All Day',
    location: 'Science Block',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '5',
    title: 'Holi Festival',
    description: 'Festival of colors celebration with traditional festivities.',
    date: '2026-03-14',
    time: 'All Day',
    location: 'Central Lawn',
    category: 'Festival',
    image: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '6',
    title: 'End of MTE',
    description: 'Mid-term examinations conclude.',
    date: '2026-02-27',
    time: 'All Day',
    location: 'Examination Halls',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/159844/book-read-literature-pages-159844.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '7',
    title: 'Start of ETE',
    description: 'End-term examinations begin.',
    date: '2026-04-28',
    time: 'All Day',
    location: 'Examination Halls',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/159844/book-read-literature-pages-159844.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '8',
    title: 'Establishment Day',
    description: 'Celebrating the founding of the institution.',
    date: '2026-05-04',
    time: 'All Day',
    location: 'Main Auditorium',
    category: 'Institutional',
    image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '9',
    title: 'Oneiros Cultural Festival',
    description: 'Annual cultural extravaganza with performances and competitions.',
    date: '2026-03-15',
    time: '5:00 PM - 11:00 PM',
    location: 'Open Air Theatre',
    category: 'Cultural',
    image: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '10',
    title: 'Last Instruction Day',
    description: 'Final day of regular classes before examinations.',
    date: '2026-04-14',
    time: 'All Day',
    location: 'Academic Blocks',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/159844/book-read-literature-pages-159844.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '11',
    title: 'Re-Sessional Examination',
    description: 'Supplementary examinations for students.',
    date: '2026-04-17',
    time: 'All Day',
    location: 'Examination Halls',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/159844/book-read-literature-pages-159844.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '12',
    title: 'Result Declaration',
    description: 'Academic results announcement.',
    date: '2026-05-15',
    time: 'All Day',
    location: 'Online Portal',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/159844/book-read-literature-pages-159844.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '13',
    title: 'Start of Summer Break for Students',
    description: 'Summer vacation begins for students.',
    date: '2026-05-16',
    time: 'All Day',
    location: 'Campus Wide',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '14',
    title: 'Start of Make Up Exam',
    description: 'Make-up examinations begin.',
    date: '2026-07-10',
    time: 'All Day',
    location: 'Examination Halls',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/159844/book-read-literature-pages-159844.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '14',
    title: 'End of Make Up Exam',
    description: 'Make-up examinations conclude.',
    date: '2026-07-29',
    time: 'All Day',
    location: 'Examination Halls',
    category: 'Academic',
    image: 'https://images.pexels.com/photos/159844/book-read-literature-pages-159844.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
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
