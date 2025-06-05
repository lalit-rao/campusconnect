import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate
} from 'react-native-reanimated';

type TipAccordionProps = {
  tip: {
    id: string;
    title: string;
    content: string;
    category: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
};

export default function TipAccordion({ tip, isExpanded, onToggle }: TipAccordionProps) {
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
      case 'Academics':
        return '#5C6BC0';
      case 'Food':
        return '#26A69A';
      case 'Social Life':
        return '#FFA000';
      case 'Safety':
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
        <View style={styles.titleContainer}>
          <View
            style={[
              styles.categoryIndicator,
              { backgroundColor: getCategoryColor(tip.category) }
            ]}
          />
          <Text style={[styles.title, { color: colors.text }]}>{tip.title}</Text>
        </View>
        {isExpanded ? (
          <ChevronUp size={24} color={colors.text} />
        ) : (
          <ChevronDown size={24} color={colors.text} />
        )}
      </TouchableOpacity>

      <Animated.View style={[styles.content, contentStyle]}>
        <Text style={[styles.contentText, { color: colors.secondaryText }]}>
          {tip.content}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
  },
  titleContainer: {
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
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    overflow: 'hidden',
  },
  contentText: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
});
