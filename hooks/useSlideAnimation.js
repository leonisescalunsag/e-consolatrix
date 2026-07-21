import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

export const useFadeIn = (duration = 800, delay = 0) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return fadeAnim;
};

export const useSlideUp = (initialValue = 100, tension = 50, friction = 7) => {
  const slideAnim = useRef(new Animated.Value(initialValue)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      tension,
      friction,
      useNativeDriver: true,
    }).start();
  }, []);

  return slideAnim;
};

export const useStaggerItems = (itemCount, baseDelay = 100) => {
  const anims = useRef(Array(itemCount).fill(0).map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(baseDelay, 
      anims.map(anim => 
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  return anims;
};

export const usePressAnimation = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return { scaleAnim, pressIn, pressOut };
};