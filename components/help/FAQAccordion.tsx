import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate
} from 'react-native-reanimated';

type FAQAccordionProps = {
  faq: {
    id: string;
    question: string;
    answer: string;
    category: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
};

export default function FAQAccordion({ faq, isExpanded, onToggle }: FAQAccordionProps) {
  const { colors } = useTheme();
  const animationProgress = useSharedValue(isExpanded ? 1 : 0);

  if (isExpanded) {
    animationProgress.value = withTiming(1, { duration: 300 });
  } else {
    animationProgress.value = withTiming(0, { duration: 300 });
  }

  const contentStyle = useAnimatedStyle(() => {
    const maxHeight = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 500]
    );

    const opacity = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [0, 0, 1]
    );

    return {
      maxHeight,
      opacity,
    };
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case 'visas':
        return '#5C6BC0';
      case 'health':
        return '#26A69A';
      case 'student':
        return '#AB47BC';
      case 'housing':
        return '#FFA000';
      case 'transport':
        return '#EF5350';
      default:
        return colors.primary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.questionContainer}>
          <View
            style={[
              styles.categoryIndicator,
              { backgroundColor: getCategoryColor(faq.category) }
            ]}
          />
          <Text style={[styles.question, { color: colors.text }]}>{faq.question}</Text>
        </View>
        {isExpanded ? (
          <ChevronUp size={20} color={colors.text} />
        ) : (
          <ChevronDown size={20} color={colors.text} />
        )}
      </TouchableOpacity>

      <Animated.View style={[styles.content, contentStyle]}>
        <Text style={[styles.answer, { color: colors.secondaryText }]}>
          {faq.answer}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  question: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    flex: 1,
    paddingRight: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    overflow: 'hidden',
  },
  answer: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
    paddingLeft: 20,
  },
});
