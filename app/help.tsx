import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ChevronLeft, Search, ChevronDown, ChevronUp } from 'lucide-react-native';
import FAQAccordion from '@/components/help/FAQAccordion';

const categories = [
  { id: 'visas', name: 'Visas & Legal' },
  { id: 'health', name: 'Health & Safety' },
  { id: 'student', name: 'Student Life' },
  { id: 'housing', name: 'Housing' },
  { id: 'transport', name: 'Transportation' },
];

const faqs = [
  // VISAS
  {
    id: '1',
    question: 'How do I extend my student visa while studying at MUJ?',
    answer: 'Contact the International Student Affairs Office at least 3 months before your visa expires. They will assist you with documentation and guide you through the extension process.',
    category: 'visas',
  },
  {
    id: '2',
    question: 'What documents are required for visa renewal at MUJ?',
    answer: 'You will need your current passport, visa, admission letter, bonafide certificate from MUJ, and proof of financial support. The International Office will provide a checklist.',
    category: 'visas',
  },
  {
    id: '3',
    question: 'Where is the International Student Affairs Office located at MUJ?',
    answer: 'The International Student Affairs Office is on the ground floor of the Administrative Block. Office hours are 10am to 5pm on weekdays.',
    category: 'visas',
  },
  {
    id: '4',
    question: 'Can MUJ help with visa-related emergencies?',
    answer: 'Yes, in case of urgent visa issues, contact the International Student Affairs Office immediately. They can provide guidance and, if necessary, liaise with authorities.',
    category: 'visas',
  },
  {
    id: '5',
    question: 'Does MUJ offer legal support for international students?',
    answer: 'MUJ’s International Office can connect you with legal advisors for visa and immigration matters. Regular information sessions are also held each semester.',
    category: 'visas',
  },
  {
    id: '6',
    question: 'Can I work part-time in India on a student visa while at MUJ?',
    answer: 'Indian student visas generally do not permit off-campus work. However, you may be eligible for internships or on-campus jobs with special permission. Consult the International Office for details.',
    category: 'visas',
  },

  // HEALTH
  {
    id: '7',
    question: 'Where is the MUJ medical center located?',
    answer: 'The medical center is near the main entrance, adjacent to the girls’ hostel. It is open 24/7 for basic health services.',
    category: 'health',
  },
  {
    id: '8',
    question: 'What services does the MUJ medical center provide?',
    answer: 'The center offers first aid, general consultations, basic lab tests, and emergency care. For specialized treatment, referrals to nearby hospitals are provided.',
    category: 'health',
  },
  {
    id: '9',
    question: 'Are there emergency medical services on campus?',
    answer: 'Yes, MUJ has a 24/7 ambulance service. In case of emergencies, call the campus security or medical center hotline.',
    category: 'health',
  },
  {
    id: '10',
    question: 'Do I need health insurance at MUJ?',
    answer: 'Health insurance is mandatory for all international students and recommended for Indian students. The International Office can guide you on suitable plans.',
    category: 'health',
  },
  {
    id: '11',
    question: 'Are mental health and counseling services available at MUJ?',
    answer: 'Yes, MUJ provides free counseling and mental health support through the Student Welfare Office. Confidential appointments can be booked online.',
    category: 'health',
  },
  {
    id: '12',
    question: 'Where can I buy medicines near MUJ?',
    answer: 'There is a pharmacy on campus near the medical center and several medical stores within a 2 km radius of the university.',
    category: 'health',
  },

  // STUDENT
  {
    id: '13',
    question: 'How do I join student clubs and societies at MUJ?',
    answer: 'Visit the Student Activities Portal or attend the annual Club Fair at the start of each semester to sign up for clubs and societies.',
    category: 'student',
  },
  {
    id: '14',
    question: 'What types of student organizations are available at MUJ?',
    answer: 'MUJ offers technical, cultural, sports, literary, and social service clubs. There are also professional chapters like ACM, IEEE, and SIGAI.',
    category: 'student',
  },
  {
    id: '15',
    question: 'How can I participate in technical fests at MUJ?',
    answer: 'Details about technical fests are shared on the university website and through student emails. Registration is usually online and open to all students.',
    category: 'student',
  },
  {
    id: '16',
    question: 'Are there leadership opportunities for students at MUJ?',
    answer: 'Yes, you can become a club coordinator, event organizer, or student representative by applying through your club or the Student Welfare Office.',
    category: 'student',
  },
  {
    id: '17',
    question: 'How do I get academic support or tutoring at MUJ?',
    answer: 'Peer tutoring and faculty office hours are available for academic help. Contact your department or the Student Welfare Office for more information.',
    category: 'student',
  },
  {
    id: '18',
    question: 'How can I provide feedback or raise concerns as a student?',
    answer: 'MUJ has an online grievance redressal portal and regular student-faculty meetings where you can voice concerns or suggestions.',
    category: 'student',
  },

  // HOUSING
  {
    id: '19',
    question: 'What are the on-campus housing options at MUJ?',
    answer: 'MUJ offers air-conditioned hostels for boys and girls with single, double, and triple occupancy rooms. Each hostel has a warden and security.',
    category: 'housing',
  },
  {
    id: '20',
    question: 'How do I apply for hostel accommodation at MUJ?',
    answer: 'Apply online through the MUJ admissions portal after receiving your admission offer. Allotment is on a first-come, first-served basis.',
    category: 'housing',
  },
  {
    id: '21',
    question: 'Are there off-campus housing options near MUJ?',
    answer: 'Yes, several PGs and apartments are available within a 5 km radius. The Housing Office maintains a list of verified options.',
    category: 'housing',
  },
  {
    id: '22',
    question: 'Can I choose my roommate in the hostel?',
    answer: 'You can request a roommate during the application process. The hostel office tries to accommodate requests but cannot guarantee them.',
    category: 'housing',
  },
  {
    id: '23',
    question: 'What amenities are provided in MUJ hostels?',
    answer: 'Hostels offer Wi-Fi, laundry, common rooms, study areas, and 24/7 security. Each floor has water coolers and common bathrooms.',
    category: 'housing',
  },
  {
    id: '24',
    question: 'Are guests allowed in MUJ hostels?',
    answer: 'Visitors are allowed in designated areas during visiting hours. Overnight stays are not permitted for guests.',
    category: 'housing',
  },

  // TRANSPORT
  {
    id: '25',
    question: 'Does MUJ provide a campus shuttle service?',
    answer: 'Yes, MUJ runs shuttle buses connecting the campus with key locations in Jaipur. Timetables are available on the student portal.',
    category: 'transport',
  },
  {
    id: '26',
    question: 'How do I travel from Jaipur railway station or airport to MUJ?',
    answer: 'You can book a prepaid taxi, use app-based cabs, or request a university shuttle during orientation week. Advance booking is recommended.',
    category: 'transport',
  },
  {
    id: '27',
    question: 'Is parking available for students on campus?',
    answer: 'Limited parking is available for two-wheelers and cars. Students must apply for a parking permit through the campus security office.',
    category: 'transport',
  },
  {
    id: '28',
    question: 'Are bicycles allowed on campus?',
    answer: 'Yes, students can use bicycles on campus. Bicycle stands are located near hostels and academic blocks.',
    category: 'transport',
  },
  {
    id: '29',
    question: 'What public transport options are available near MUJ?',
    answer: 'City buses and shared autos are accessible from the university gate, connecting to major Jaipur locations.',
    category: 'transport',
  },
  {
    id: '30',
    question: 'How do I report a lost item on the campus shuttle?',
    answer: 'Report lost items to the Transport Office or the shuttle driver immediately. Found items are kept at the Transport Office for claim.',
    category: 'transport',
  },
];


export default function HelpScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState([]);

  const filteredFaqs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  const searchFilteredFaqs = searchQuery
    ? filteredFaqs.filter(
        faq =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredFaqs;

  const toggleQuestion = (id) => {
    setExpandedQuestions(prev =>
      prev.includes(id)
        ? prev.filter(q => q !== id)
        : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Help & FAQs</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground }]}>
        <Search size={20} color={colors.secondaryText} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search for help..."
          placeholderTextColor={colors.secondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'all' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === 'all' && { color: 'white' },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && { backgroundColor: colors.primary },
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && { color: 'white' },
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.faqsContainer}>
        {searchFilteredFaqs.map((faq) => (
          <FAQAccordion
            key={faq.id}
            faq={faq}
            isExpanded={expandedQuestions.includes(faq.id)}
            onToggle={() => toggleQuestion(faq.id)}
          />
        ))}

        <View style={styles.needHelpContainer}>
          <Text style={[styles.needHelpText, { color: colors.text }]}>
            Still need help?
          </Text>
          <TouchableOpacity
            style={[styles.chatButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/chat')}
          >
            <Text style={styles.chatButtonText}>Chat with Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 152,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'

  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666'
  },
  faqsContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  needHelpContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 16,
  },
  needHelpText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 12,
  },
  chatButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});
