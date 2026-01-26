import React, { useRef } from 'react';
import { View, ImageBackground, Image, Text, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { styles, SWIPE_CONSTANTS } from '../styles/LandingStyles';

export default function LandingPage() {
  const router = useRouter();
  const pan = useRef(new Animated.ValueXY()).current;

  // Logic para sa Rectangle Dots na nagha-highlight base sa swipe
  const getDotStyle = (index) => {
    const section = SWIPE_CONSTANTS.SWIPE_RANGE / 2;
    
    // Interpolation para sa Opacity
    const opacity = pan.x.interpolate({
      inputRange: [
        index === 0 ? 0 : section * (index - 0.5),
        section * index,
        index === 2 ? SWIPE_CONSTANTS.SWIPE_RANGE : section * (index + 0.5)
      ],
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });

    // Interpolation para sa Width (humahaba yung active dot)
    const width = pan.x.interpolate({
      inputRange: [
        index === 0 ? 0 : section * (index - 0.5),
        section * index,
        index === 2 ? SWIPE_CONSTANTS.SWIPE_RANGE : section * (index + 0.5)
      ],
      outputRange: [25, 40, 25],
      extrapolate: 'clamp',
    });

    return { opacity, width };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dx >= 0 && gestureState.dx <= SWIPE_CONSTANTS.SWIPE_RANGE) {
          pan.x.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > SWIPE_CONSTANTS.SWIPE_RANGE * 0.75) {
          Animated.spring(pan.x, {
            toValue: SWIPE_CONSTANTS.SWIPE_RANGE,
            useNativeDriver: false,
          }).start(() => {
            router.push('/login');
            setTimeout(() => pan.x.setValue(0), 1000);
          });
        } else {
          Animated.spring(pan.x, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/images/cc.jpg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient 
          colors={['rgba(13, 62, 134, 0.8)', 'transparent', '#0D3E86']} 
          style={styles.gradientOverlay}
        >
          
          <View style={styles.headerSection}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            <Text style={styles.brandTitle}>
              <Text style={styles.blueText}>e</Text>-Consolatrix
            </Text>
            <Text style={styles.schoolFullName}>CONSOLATRIX COLLEGE OF TOLEDO CITY, INC.</Text>
          </View>

          <View style={styles.bottomSection}>
            <Text style={styles.slogan}>
              "One platform, one community — informed, connected, e-Consolatrix."
            </Text>

            {/* FIGMA RECTANGLE DOTS */}
            <View style={styles.paginationContainer}>
              {[0, 1, 2].map((i) => (
                <Animated.View 
                  key={i} 
                  style={[styles.rectangleDot, getDotStyle(i)]} 
                />
              ))}
            </View>

            <View style={styles.swipeTrack}>
              <Animated.View 
                style={[
                  styles.swipeFill, 
                  { width: Animated.add(pan.x, SWIPE_CONSTANTS.KNOB_SIZE) }
                ]} 
              />
              
              <Text style={styles.swipeGuideText}>{">>>"}</Text>
              
              <Animated.View 
                style={[styles.swipeKnob, { transform: [{ translateX: pan.x }] }]} 
                {...panResponder.panHandlers}
              >
                <Text style={styles.knobLabel}>Start</Text>
              </Animated.View>
            </View>
          </View>

        </LinearGradient>
      </ImageBackground>
    </View>
  );
}