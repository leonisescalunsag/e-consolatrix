import React, { useRef, useEffect, useState } from 'react';
import { View, ImageBackground, Text, Animated, TouchableOpacity, Easing, ActivityIndicator, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Font from 'expo-font';
import { styles } from '../styles/LandingStyles';
import { Ionicons } from '@expo/vector-icons';

export default function LandingPage() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // ✅ Secret Code State
  const [secretCode, setSecretCode] = useState('');
  const [showSecretInput, setShowSecretInput] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const tapTimer = useRef(null);

  // Animation values
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const springAnim = useRef(new Animated.Value(0.3)).current;
  const slideLeftAnim = useRef(new Animated.Value(-100)).current;
  const slideRightAnim = useRef(new Animated.Value(100)).current;
  const buttonWiggle = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideTextAnim = useRef(new Animated.Value(0)).current;

  // Auto-sliding text data
  const slides = [
    {
      id: 0,
      title: 'One platform, one community —',
      subtitle: 'informed, connected, e-Consolatrix.',
      description: 'Stay connected with everything about CCTC in one place.'
    },
    {
      id: 1,
      title: 'Empowering Education',
      subtitle: 'Quality Catholic learning since 1961.',
      description: '65+ years of academic excellence and community service.'
    },
    {
      id: 2,
      title: 'Your Future Starts Here',
      subtitle: 'Explore programs from SHS to College.',
      description: 'STEM, ABM, HUMSS, TVL, BSIT, BSHM, BSED, and more.'
    }
  ];

  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
        'Montserrat-ExtraBold': require('../assets/fonts/Montserrat-ExtraBold.ttf'),
        'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
        'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-Italic': require('../assets/fonts/Montserrat-Italic.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  useEffect(() => {
    // Logo bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Title rotation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Spring animation
    Animated.spring(springAnim, {
      toValue: 1,
      tension: 100,
      friction: 5,
      useNativeDriver: true,
    }).start();

    // Slide in animations
    Animated.parallel([
      Animated.spring(slideLeftAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(slideRightAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Button wiggle
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonWiggle, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(buttonWiggle, {
          toValue: -1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(buttonWiggle, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
      ])
    ).start();

    // Auto-slide text animation
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideTextAnim, {
          toValue: -30,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        slideTextAnim.setValue(30);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(slideTextAnim, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleExplore = () => {
    router.push('/home');
  };

  // ✅ TRIPLE TAP on "e-Consolatrix" text
  const handleTextPress = () => {
    setTapCount(prev => prev + 1);
    
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
    }
    
    tapTimer.current = setTimeout(() => {
      setTapCount(0);
    }, 1500);
    
    // Triple tap detected (3 taps within 1.5 seconds)
    if (tapCount === 2) {
      setShowSecretInput(true);
      setTapCount(0);
      clearTimeout(tapTimer.current);
    }
  };

  // ✅ Check Secret Code
  const checkSecretCode = (code) => {
    const ADMIN_CODE = 'admin123';  // ← Change this
    
    if (code === ADMIN_CODE) {
      setSecretCode('');
      setShowSecretInput(false);
      router.push('/admin/login');
    }
  };

  // ✅ Cancel Secret Input
  const cancelSecretInput = () => {
    setShowSecretInput(false);
    setSecretCode('');
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg']
  });

  const wiggle = buttonWiggle.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-5deg', '0deg', '5deg']
  });

  // Show loading while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D3E86' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/images/bj.jpeg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      > 
        {/* TOP GRADIENT */}
        <LinearGradient 
          colors={['rgba(13, 62, 134, 0.95)', 'rgba(13, 61, 134, 0.42)', 'transparent']} 
          locations={[0, 0.7, 1]} 
          style={styles.topGradient}
        />

        {/* MAIN CONTENT */}
        <View style={styles.contentContainer}>
          {/* ANIMATED HEADER SECTION */}
          <Animated.View style={[
            styles.headerSection, 
            { transform: [{ scale: springAnim }] }
          ]}>
            {/* ✅ e-Consolatrix Text - Triple Tap to Show Secret Input */}
            <TouchableOpacity 
              onPress={handleTextPress}
              activeOpacity={0.7}
            >
              <Animated.Text style={[styles.brandTitle, { transform: [{ rotate }] }]}>
                <Text style={styles.blueText}>e</Text>-Consolatrix
              </Animated.Text>
            </TouchableOpacity>
            
            <Text style={styles.schoolFullName}>
              CONSOLATRIX COLLEGE{"\n"}
              OF TOLEDO CITY, INC.
            </Text>
          </Animated.View>

          {/* ANIMATED BOTTOM CONTENT */}
          <View style={styles.bottomSection}>
            {/* AUTO-SLIDING TEXT */}
            <Animated.View style={[
              styles.slidingContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideTextAnim }]
              }
            ]}>
              <Text style={styles.slideTitle}>{currentSlideData.title}</Text>
              <Text style={styles.slideSubtitle}>{currentSlideData.subtitle}</Text>
              <Text style={styles.slideDescription}>{currentSlideData.description}</Text>
            </Animated.View>

            {/* Sliding Dots Indicator */}
            <View style={styles.slideDotsContainer}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.slideDot,
                    currentSlide === index && styles.slideDotActive
                  ]}
                />
              ))}
            </View>

            {/* BUTTON with wiggle */}
            <Animated.View style={{ transform: [{ rotate: wiggle }] }}>
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={handleExplore}
                activeOpacity={0.8}
              >
                <Text style={styles.exploreButtonText}>eXPLORE NOW</Text>
                <Animated.View style={[styles.exploreIconContainer, { transform: [{ rotate }] }]}>
                  <Text style={styles.exploreIcon}>→</Text>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>

            {/* ✅ SECRET CODE INPUT - Hidden (Appears on Triple Tap) */}
            {showSecretInput && (
              <View style={styles.secretInputContainer}>
                <View style={styles.secretInputWrapper}>
                  <Ionicons name="lock-closed" size={18} color="rgba(255,255,255,0.6)" />
                  <TextInput
                    style={styles.secretInput}
                    placeholder="Enter access code"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    secureTextEntry
                    value={secretCode}
                    onChangeText={(text) => {
                      setSecretCode(text);
                      checkSecretCode(text);
                    }}
                    autoFocus
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={cancelSecretInput}>
                    <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.6)" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.secretHint}>Triple tap "e-Consolatrix" to show this input</Text>
              </View>
            )}
          </View>
        </View>

        {/* BOTTOM GRADIENT */}
        <LinearGradient 
          colors={['transparent', 'rgba(13, 62, 134, 0.8)', 'rgba(13, 61, 134, 0.73)']} 
          locations={[0, 0.6, 1]} 
          style={styles.bottomGradient}
        />
      </ImageBackground>
    </View>
  );
}