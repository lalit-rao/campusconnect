import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ChevronLeft, Filter, ChevronDown, ChevronUp } from 'lucide-react-native';
import TipAccordion from '@/components/cultural-tips/TipAccordion';

const categories = ['All', 'Academics', 'Campus Life', 'Careers', 'Food', 'Safety', 'Social Life', 'Wellness'];

const tips = [
    {
      id: '1',
      title: 'Classroom Etiquette',
      content: 'At MUJ, active participation is encouraged, whether in lectures, tutorials, or labs. Don’t hesitate to ask questions or clarify doubts with professors—they appreciate curiosity. Punctuality and regular attendance are valued, and some courses have attendance requirements for exams.',
      category: 'Academics'
    },
    {
      id: '2',
      title: 'Dining Hall Culture',
      content: 'The campus mess and food courts offer a variety of cuisines, including North Indian, South Indian, and continental options. Take only what you can eat to avoid food wastage. Always return your plates and utensils to the designated area and maintain cleanliness for everyone’s comfort.',
      category: 'Food'
    },
    {
      id: '3',
      title: 'Making Friends',
      content: 'MUJ has a diverse student body from across India and abroad. Attend club orientations, technical fests, and cultural events to meet new people. Joining student clubs like ACM SIGAI is a great way to find friends with similar interests and build your network.',
      category: 'Social Life'
    },
    {
      id: '4',
      title: 'Campus Safety',
      content: 'MUJ is a secure campus with 24/7 security and CCTV surveillance. Use the official shuttle service or walk in groups at night. Save campus security numbers on your phone and don’t hesitate to report any suspicious activity.',
      category: 'Safety'
    },
    {
      id: '5',
      title: 'Respecting Diversity',
      content: 'Students at MUJ come from various cultural, linguistic, and religious backgrounds. Be open-minded and respectful towards everyone’s beliefs and practices. Participate in multicultural events to broaden your perspective.',
      category: 'Social Life'
    },
    {
      id: '6',
      title: 'Academic Integrity',
      content: 'MUJ has strict guidelines against plagiarism and cheating. Always submit original work and cite your sources properly. Familiarize yourself with the university’s academic code of conduct to avoid unintentional violations.',
      category: 'Academics'
    },
    {
      id: '7',
      title: 'Hostel Life',
      content: 'Hostel life is a big part of the MUJ experience. Respect your roommates’ privacy and maintain cleanliness in shared spaces. Participate in hostel events and make use of common rooms to socialize and unwind.',
      category: 'Campus Life'
    },
    {
      id: '8',
      title: 'Weather Preparedness',
      content: 'Jaipur experiences extreme temperatures—hot summers and chilly winters. Pack accordingly, and keep essentials like water bottles, sunscreen, and warm clothing handy. Stay hydrated, especially during peak summer months.',
      category: 'Wellness'
    },
    {
      id: '9',
      title: 'Exploring Jaipur',
      content: 'Take some time to explore Jaipur’s rich heritage—visit forts, palaces, and local markets. Use weekends to discover the Pink City with friends, but always inform your hostel warden if you’re staying out late or overnight.',
      category: 'Social Life'
    },
    {
      id: '10',
      title: 'Time Management',
      content: 'Balancing academics, club activities, and personal time is crucial. Use planners or digital tools to organize your schedule and set reminders for assignments and exams. Don’t hesitate to seek help from seniors or faculty if you feel overwhelmed.',
      category: 'Academics'
    },
    {
      id: '11',
      title: 'Health & Wellbeing',
      content: 'MUJ has a medical center for basic healthcare needs. Register with the campus clinic and know the process for emergencies. Practice good hygiene, eat balanced meals, and make time for physical activity—there are excellent sports facilities on campus.',
      category: 'Wellness'
    },
    {
      id: '12',
      title: 'Internet & Tech',
      content: 'The campus is Wi-Fi enabled, but speeds may vary during peak hours. Keep backups of your work, and use university resources like the digital library and coding labs. If you face technical issues, contact the IT helpdesk.',
      category: 'Campus Life'
    },
    {
      id: '13',
      title: 'Maintain Your Attendance',
      content: 'MUJ enforces a 75% minimum attendance rule for most courses. Falling below this can make you ineligible for exams. Track your attendance regularly and don’t skip classes unless absolutely necessary.',
      category: 'Academics'
    },
    {
      id: '14',
      title: 'Balance Academics and Fun',
      content: 'With frequent fests, club events, and sports, it’s easy to get distracted. Plan your week in advance to ensure you keep up with assignments while enjoying campus life. Setting boundaries helps maintain a healthy balance.[1]',
      category: 'Campus Life'
    },
    {
      id: '15',
      title: 'Utilize Student Support Services',
      content: 'MUJ’s Directorate of Students’ Welfare offers counseling, career guidance, and support for personal or academic challenges. Don’t hesitate to reach out if you’re feeling stressed or need advice.[2][3]',
      category: 'Wellness'
    },
    {
      id: '16',
      title: 'Designate a Study Space',
      content: 'Whether in your hostel room or at the library, create a clutter-free study zone. Keep essentials like chargers, water, and snacks nearby to minimize distractions.[1]',
      category: 'Academics'
    },
    {
      id: '17',
      title: 'Plan Your Schedule',
      content: 'Use planners, apps, or calendars to organize lectures, assignment deadlines, club meetings, and personal time. Pre-planning helps you stay on top of tasks and reduces last-minute stress.[1][7]',
      category: 'Academics'
    },
    {
      id: '18',
      title: 'Engage with Faculty and Peers',
      content: 'Regularly interact with professors and classmates, both in-person and online. Asking questions and discussing topics enhances understanding and builds valuable connections.[4][7]',
      category: 'Academics'
    },
    {
      id: '19',
      title: 'Explore Online Resources',
      content: 'MUJ provides access to digital libraries, e-books, and online learning platforms. Make the most of these resources for assignments, research, and exam prep.[4][7]',
      category: 'Academics'
    },
    {
      id: '20',
      title: 'Join Clubs and Chapters',
      content: 'MUJ has a vibrant club culture, from technical societies to cultural and sports clubs. Participating helps you develop soft skills, leadership, and friendships.[2][5]',
      category: 'Social Life'
    },
    {
      id: '21',
      title: 'Network for Internships and Placements',
      content: 'Attend career fairs, workshops, and alumni talks. Building a professional network early can open doors to internships and job opportunities. Maintain a good CGPA and upskill through online courses.[6]',
      category: 'Careers'
    },
    {
      id: '22',
      title: 'Respect Hostel Rules',
      content: 'Hostel life comes with its own set of rules regarding visitors, curfew, and cleanliness. Follow them to ensure a harmonious living environment and avoid penalties.',
      category: 'Campus Life'
    },
    {
      id: '23',
      title: 'Stay Active and Healthy',
      content: 'Use the sports complex and gym to stay physically active. Join yoga or dance sessions for fitness and stress relief. Prioritize sleep and balanced meals for overall well-being.',
      category: 'Wellness'
    },
    {
      id: '24',
      title: 'Be Cautious with Social Circles',
      content: 'Choose your friends and activities wisely. Surround yourself with positive, like-minded people who support your goals and values.[5]',
      category: 'Social Life'
    },
    {
      id: '25',
      title: 'Prepare for Jaipur’s Climate',
      content: 'Jaipur can be very hot in summer and cold in winter. Pack suitable clothing, use sunscreen, and stay hydrated. Keep an umbrella or raincoat handy during the monsoon.',
      category: 'Wellness'
    },
    {
      id: '26',
      title: 'Participate in Annual Fests',
      content: 'Events like Oneiros (the annual cultural fest) are highlights of MUJ life. Get involved as a participant or volunteer to make memories and learn event management skills.[5]',
      category: 'Campus Life'
    },
    {
      id: '27',
      title: 'Practice Note-Making',
      content: 'Take notes during lectures and while studying online materials. Good note-taking improves retention and makes revision easier before exams.[4][7]',
      category: 'Academics'
    },
    {
      id: '28',
      title: 'Seek Help When Needed',
      content: 'If you’re struggling academically or personally, approach your professors, seniors, or the counseling center. MUJ has resources to support you—don’t hesitate to use them.[3]',
      category: 'Wellness'
    },
    {
      id: '29',
      title: 'Explore Jaipur Responsibly',
      content: 'Enjoy the city’s heritage, food, and shopping, but always inform your hostel warden if you’ll be late. Travel in groups for safety, especially at night.',
      category: 'Social Life'
    },
    {
      id: '30',
      title: 'Be Mindful of Digital Distractions',
      content: 'Limit social media and smartphone use during study hours. Consider using apps that block distractions or set your phone to “Do Not Disturb” while working.[1][4]',
      category: 'Academics'
    }
  ]
;


export default function CulturalTipsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedTips, setExpandedTips] = useState([]);

  const filteredTips = selectedCategory === 'All'
    ? tips
    : tips.filter(tip => tip.category === selectedCategory);

  const toggleTip = (tipId) => {
    setExpandedTips(prev =>
      prev.includes(tipId)
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Cultural Tips</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && { backgroundColor: colors.primary }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && { color: 'white' }
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.tipsContainer}>
        {filteredTips.map((tip) => (
          <TipAccordion
            key={tip.id}
            tip={tip}
            isExpanded={expandedTips.includes(tip.id)}
            onToggle={() => toggleTip(tip.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 52,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16
  },
  backButton: {
    padding: 8
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold'
  },
  filterButton: {
    padding: 8,
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
  tipsContainer: {
    padding: 16,
    paddingBottom: 32
  }
});
