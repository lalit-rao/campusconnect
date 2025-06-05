import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type OnboardingItemProps = {
  item: {
    id: number;
    title: string;
    description: string;
    image: string;
  };
  width: number;
};

export default function OnboardingItem({ item, width }: OnboardingItemProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { width }]}>
      <Image 
        source={{ uri: item.image }}
        style={[styles.image, { width: width * 0.8 }]}
      />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.primary }]}>{item.title}</Text>
        <Text style={[styles.description, { color: colors.secondaryText }]}>
          {item.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    height: 300,
    resizeMode: 'contain',
    marginBottom: 32,
    borderRadius: 16,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
  },
});