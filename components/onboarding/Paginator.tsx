import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';

type PaginatorProps = {
  data: any[];
  scrollX: Animated.SharedValue<number>;
};

export default function Paginator({ data, scrollX }: PaginatorProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {data.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const animatedDotStyle = useAnimatedStyle(() => {
          const width = interpolate(
            scrollX.value,
            inputRange,
            [10, 20, 10],
            'clamp'
          );

          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.5, 1, 0.5],
            'clamp'
          );

          return {
            width,
            opacity,
          };
        });

        return (
          <Animated.View
            key={index.toString()}
            style={[styles.dot, animatedDotStyle]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4A90E2',
    marginHorizontal: 4,
  },
});
