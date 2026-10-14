import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  Animated, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { styles } from '../styles/StatisticsStyles';

export default function StatisticsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    teachers: 0,
    collegePrograms: 0,
    shsStrands: 0,
    totalPrograms: 0,
    years: 65,
    founded: '1961',
    location: 'Toledo City, Cebu',
    type: 'Catholic Education',
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    fetchStats();
    startAnimations();
  }, []);

  const fetchStats = async () => {
    try {
      const teachersSnapshot = await getDocs(collection(db, 'teachers'));
      const teachersCount = teachersSnapshot.size;

      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const allCourses = [];
      coursesSnapshot.forEach((doc) => {
        allCourses.push({ id: doc.id, ...doc.data() });
      });
      
      const collegeCourses = allCourses.filter(c => c.level === 'college');
      const shsStrands = allCourses.filter(c => c.level === 'shs');

      setStats({
        teachers: teachersCount,
        collegePrograms: collegeCourses.length,
        shsStrands: shsStrands.length,
        totalPrograms: collegeCourses.length + shsStrands.length,
        years: 65,
        founded: '1961',
        location: 'Toledo City, Cebu',
        type: 'Catholic Education',
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAnimations = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  // ✅ STAT CARD
  const StatCard = ({ icon, value, label, color, bgColor, delay = 0 }) => {
    const countAnim = useRef(new Animated.Value(0)).current;
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      Animated.timing(countAnim, {
        toValue: value,
        duration: 1500,
        delay,
        useNativeDriver: true,
      }).start();

      countAnim.addListener(({ value: val }) => {
        setDisplayValue(Math.floor(val));
      });

      return () => countAnim.removeAllListeners();
    }, []);

    return (
      <Animated.View style={[styles.statCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={[styles.statIconContainer, { backgroundColor: bgColor }]}>
          <Ionicons name={icon} size={28} color={color} />
        </View>
        <Text style={[styles.statNumber, { color }]}>{displayValue.toLocaleString()}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </Animated.View>
    );
  };

  // ✅ QUICK FACT
  const QuickFact = ({ icon, text, color, bgColor }) => (
    <View style={styles.factItem}>
      <View style={[styles.factIcon, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.factText}>{text}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D3E86" />
        <Text style={styles.loadingText}>Loading statistics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📊 School Statistics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid - 2x2 */}
        <View style={styles.statsGrid}>
          <StatCard 
            icon="people" 
            value={stats.teachers} 
            label="Total Teachers" 
            color="#0D3E86"
            bgColor="#E8EDF4"
            delay={0}
          />
          <StatCard 
            icon="book" 
            value={stats.collegePrograms} 
            label="College Programs" 
            color="#1A5CB5"
            bgColor="#E3EEF9"
            delay={100}
          />
          <StatCard 
            icon="school" 
            value={stats.shsStrands} 
            label="SHS Strands" 
            color="#FF6B35"
            bgColor="#FDF0EA"
            delay={200}
          />
          <StatCard 
            icon="ribbon" 
            value={stats.totalPrograms} 
            label="Total Programs" 
            color="#32CD32"
            bgColor="#E8F5E9"
            delay={300}
          />
        </View>

        {/* School Information */}
        <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.sectionTitle}>🏫 About Consolatrix College</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar" size={20} color="#0D3E86" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Founded</Text>
                <Text style={styles.infoValue}>{stats.founded}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={20} color="#0D3E86" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Years of Excellence</Text>
                <Text style={styles.infoValue}>{stats.years}+ Years</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={20} color="#0D3E86" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{stats.location}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="school" size={20} color="#0D3E86" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Type</Text>
                <Text style={styles.infoValue}>{stats.type}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Quick Facts */}
        <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.sectionTitle}>⚡ Quick Facts</Text>
          <View style={styles.factsGrid}>
            <QuickFact 
              icon="ribbon" 
              text="Augustinian Recollect Sisters" 
              color="#8B0000"
              bgColor="#FDE8E8"
            />
            <QuickFact 
              icon="school" 
              text="K-12 to College Programs" 
              color="#32CD32"
              bgColor="#E8F5E9"
            />
            <QuickFact 
              icon="location" 
              text="Toledo City, Cebu" 
              color="#FF6B35"
              bgColor="#FDF0EA"
            />
            <QuickFact 
              icon="people" 
              text="Dedicated Faculty & Staff" 
              color="#0D3E86"
              bgColor="#E8EDF4"
            />
          </View>
        </Animated.View>

        {/* Description */}
        <Animated.View style={[styles.aboutSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.sectionTitle}>📖 About CCTC</Text>
          <Text style={styles.aboutText}>
            <Text style={styles.aboutHighlight}>Consolatrix College of Toledo City</Text> was founded in 
            <Text style={styles.aboutHighlight}> 1961 </Text> 
            by the Augustinian Recollect Sisters. It has been providing 
            <Text style={styles.aboutHighlight}> quality Catholic education </Text> 
            for over 65 years, offering programs from Junior High to College level.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}