import React, { useEffect, useRef, useState } from 'react';
import { View, Text, SectionList, TouchableOpacity, ImageBackground, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../styles/CourseStyles';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

// ✅ HARDCODED COLORS AND ICONS FOR REFERENCE
const DEFAULT_COURSE_DATA = {
  'STEM': { color: '#0033FF', icon: 'flask-outline' },
  'ABM': { color: '#32CD32', icon: 'bar-chart-outline' },
  'HUMSS': { color: '#8A2BE2', icon: 'people-outline' },
  'GAS': { color: '#FF8C00', icon: 'school-outline' },
  'TVL': { color: '#FF0000', icon: 'construct-outline' },
  'BSED': { color: '#2E8B57', icon: 'book-outline' },
  'BSIT': { color: '#1E90FF', icon: 'desktop-outline' },
  'BSHM': { color: '#FFD700', icon: 'restaurant-outline' },
  'BSENTREP': { color: '#DC143C', icon: 'trending-up-outline' },
  'BPED': { color: '#FF0000', icon: 'barbell-outline' },
};

// ===== ANIMATED COURSE CARD COMPONENT =====
const AnimatedCourseCard = ({ item, index, sectionIndex }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = (sectionIndex * 100) + (index * 80);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // ✅ Get color and icon from Firebase, fallback to hardcoded
  const defaultColor = '#0D3E86';
  const defaultIcon = 'school-outline';
  
  // Check if course has hardcoded color/icon
  const hardcoded = DEFAULT_COURSE_DATA[item.code] || {};
  const courseColor = item.color || hardcoded.color || defaultColor;
  const iconName = item.icon || hardcoded.icon || defaultIcon;
  
  const isYellow = courseColor === '#FFD700';
  const textDisplayColor = isYellow ? '#f5ed0a' : courseColor;
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '2deg']
  });

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [
        { translateY: slideAnim },
        { scale: scaleAnim },
        { rotate }
      ]
    }}>
      <TouchableOpacity 
        style={styles.courseCard}
        activeOpacity={0.95}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={[styles.colorBar, { backgroundColor: courseColor }]} />
        
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={24} color={courseColor} />
        </View>
        
        <View style={styles.cardInfo}>
          <Text style={[styles.courseCode, { color: textDisplayColor }]}>
            {item.code}
          </Text>
          <Text style={styles.courseName}>{item.name}</Text>
        </View>
        
        <View style={styles.deptBadge}>
          <Text style={styles.deptBadgeText}>
            {item.level === 'shs' ? 'SHS' : 'College'}
          </Text>
        </View>
        
        <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// ===== ANIMATED SECTION HEADER =====
const AnimatedSectionHeader = ({ title, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }]
    }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionAccent} />
      </View>
    </Animated.View>
  );
};

export default function CoursesScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const tabAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = [];
      querySnapshot.forEach((doc) => {
        coursesData.push({ id: doc.id, ...doc.data() });
      });
      
      const shsCourses = coursesData.filter(c => c.level === 'shs');
      const collegeCourses = coursesData.filter(c => c.level === 'college');
      
      const sections = [];
      if (shsCourses.length > 0) {
        sections.push({ title: 'Senior High School', data: shsCourses });
      }
      if (collegeCourses.length > 0) {
        sections.push({ title: 'College Programs', data: collegeCourses });
      }
      
      setCourses(sections);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.spring(tabAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderSectionHeader = ({ section }) => {
    const sectionIndex = courses.findIndex(s => s.title === section.title);
    return <AnimatedSectionHeader title={section.title} index={sectionIndex} />;
  };

  const renderItem = ({ item, index, section }) => {
    const sectionIndex = courses.findIndex(s => s.title === section.title);
    return (
      <AnimatedCourseCard 
        item={item} 
        index={index} 
        sectionIndex={sectionIndex}
      />
    );
  };

  if (loading) {
    return (
      <ImageBackground source={require('../assets/images/cc.jpg')} style={styles.container}>
        <View style={[styles.overlay, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: '#fff', fontSize: 16, marginTop: 10 }}>Loading courses...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('../assets/images/cc.jpg')} style={styles.container}>
      <View style={styles.overlay}>
        <Animated.View style={{
          opacity: headerAnim,
          transform: [{
            translateY: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0]
            })
          }]
        }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/home')} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Courses & Strands</Text>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </View>
        </Animated.View>

        <SectionList
          sections={courses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listPadding}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>No courses found</Text>
            </View>
          }
        />

        <Animated.View style={[styles.bottomTab, { transform: [{ translateY: tabAnim }] }]}>
          <TabIcon icon="home-outline" label="Home" onPress={() => router.push('/home')} />
          <TabIcon icon="time-outline" label="School" onPress={() => router.push('/history')} />
          <TabIcon icon="school" label="Courses" active onPress={() => router.push('/courses')} />
          <TabIcon icon="people-outline" label="Teacher" onPress={() => router.push('/teachers')} />
          <TabIcon icon="book-outline" label="Rules" onPress={() => router.push('/rules')} />
          <TabIcon icon="newspaper-outline" label="News" onPress={() => router.push('/news')} />
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const TabIcon = ({ icon, label, active, onPress }) => (
  <TouchableOpacity 
    style={styles.tabItem} 
    onPress={onPress} 
    activeOpacity={0.8}
  >
    <Ionicons 
      name={icon} 
      size={22} 
      color={active ? '#FFFFFF' : '#ccc'} 
    />
    <Text style={[
      styles.tabLabel, 
      { 
        color: active ? '#FFFFFF' : '#ccc', 
        fontWeight: active ? 'bold' : '400' 
      }
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);