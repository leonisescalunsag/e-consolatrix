import React from 'react';
import { View, Text, SectionList, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../styles/CourseStyles';

const COURSE_DATA = [
  {
    title: "Senior High School",
    data: [
      { id: '1', code: 'STEM', name: 'Science, Technology, Engineering, and Mathematics', color: '#0033FF' },
      { id: '2', code: 'ABM', name: 'Accountancy, Business, and Management', color: '#32CD32' },
      { id: '3', code: 'HUMSS', name: 'Humanities and Social Sciences', color: '#8A2BE2' },
      { id: '4', code: 'GAS', name: 'General Academic Strand', color: '#FF8C00' },
      { id: '5', code: 'TVL', name: 'Technical-Vocational-Livelihood', color: '#FF0000' },
    ]
  },
  {
    title: "College Programs",
    data: [
      { id: '6', code: 'BSED', name: 'Bachelor of Secondary Education', color: '#2E8B57' },
      { id: '7', code: 'BSIT', name: 'Bachelor of Science in Information Technology', color: '#1E90FF' },
      { id: '9', code: 'BSHM', name: 'Bachelor of Science in Hospitality Management', color: '#FFD700' },
      { id: '8', code: 'BSENTREP', name: 'Bachelor of Science in Entrepreneurship', color: '#DC143C' },
      { id: '10', code: 'BPED', name: 'Bachelor of Physical Education', color: '#FF0000' }, // New Course Added
    ]
  }
];

export default function CoursesScreen() {
  const router = useRouter();

  const renderCourseItem = ({ item }) => {
    // Visibility logic for Yellow (BSHM)
    const isYellow = item.color === '#FFD700';
    const textDisplayColor = isYellow ? '#B8860B' : item.color;

    return (
      <TouchableOpacity 
        style={styles.courseCard}
        activeOpacity={0.85}
      >
        <View style={[styles.colorBar, { backgroundColor: item.color }]} />
        
        <View style={styles.cardInfo}>
          <Text style={[styles.courseCode, { 
            color: textDisplayColor,
            textShadowColor: isYellow ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 1
          }]}>
            {item.code}
          </Text>
          <Text style={styles.courseName}>{item.name}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={require('../assets/images/cc.jpg')} style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/home')} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Courses & Strands</Text>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>

        <SectionList
          sections={COURSE_DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderCourseItem}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          )}
          contentContainerStyle={styles.listPadding}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.bottomTab}>
          <TabIcon icon="home-outline" label="Home" onPress={() => router.push('/home')} />
          <TabIcon icon="time-outline" label="School" onPress={() => router.push('/history')} />
          <TabIcon icon="school" label="Courses" active onPress={() => router.push('/courses')} />
          <TabIcon icon="people-outline" label="Teacher" onPress={() => router.push('/teachers')} />
          <TabIcon icon="book-outline" label="Rules" onPress={() => router.push('/rules')} />
        </View>
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