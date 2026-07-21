import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, FlatList, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { styles } from '../styles/TeacherStyles';
import { useFadeIn, useSlideUp, usePressAnimation } from '../hooks/useSlideAnimation';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const TeacherCard = ({ item, index }) => {
  const fadeAnim = useFadeIn(500, index * 80);
  const slideAnim = useSlideUp(30);
  const { scaleAnim, pressIn, pressOut } = usePressAnimation();

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [
        { translateY: slideAnim },
        { scale: scaleAnim }
      ]
    }}>
      <TouchableOpacity 
        style={styles.teacherCard}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={0.9}
      >
        <View style={styles.cardIconContainer}>
          <Ionicons name="person-circle" size={54} color="#124da5" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.teacherName}>{item.name}</Text>
          <Text style={styles.teacherPos}>{item.position}</Text>
          <Text style={styles.teacherCourse}>{item.course || item.department}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function TeacherDirectory() {
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const headerAnim = useFadeIn(600);
  const headerSlide = useSlideUp(-20);
  const tabAnim = useSlideUp(100);
  const filterAnim = useFadeIn(500, 200);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'teachers'));
      const teachersData = [];
      querySnapshot.forEach((doc) => {
        teachersData.push({ id: doc.id, ...doc.data() });
      });
      setTeachers(teachersData);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = selectedDept === '' 
    ? [] 
    : teachers.filter(t => {
        const deptMatch = t.department?.toUpperCase() === selectedDept.toUpperCase();
        if (selectedDept === 'college') {
          return deptMatch && (selectedCourse === '' ? true : t.course === selectedCourse);
        }
        return deptMatch;
      });

  const renderTeacherItem = ({ item, index }) => (
    <TeacherCard item={item} index={index} />
  );

  const clearFilters = () => {
    setSelectedDept('');
    setSelectedCourse('');
  };

  // ✅ FILTER HEADER COMPONENT (nasa loob ng FlatList)
  const FilterHeader = () => (
    <Animated.View style={{
      opacity: filterAnim,
      transform: [{ translateY: useSlideUp(20) }]
    }}>
      <View style={styles.filterSection}>
        {/* Department Picker */}
        <View style={styles.pickerWrapper}>
          <View style={styles.pickerLabelContainer}>
            <Ionicons name="business-outline" size={16} color="#0D3E86" />
            <Text style={styles.pickerLabel}>Select Department / Level</Text>
          </View>
          <Picker
            selectedValue={selectedDept}
            onValueChange={(v) => { setSelectedDept(v); setSelectedCourse(''); }}
            style={styles.picker}
            dropdownIconColor="#0D3E86"
          >
            <Picker.Item label="Select Department/Level" value="" />
            <Picker.Item label="🏫 COLLEGE" value="college" />
            <Picker.Item label="🎓 SENIOR HIGHSCHOOL" value="shs" />
            <Picker.Item label="📚 JUNIOR HIGHSCHOOL" value="jhs" />
            <Picker.Item label="✏️ ELEMENTARY" value="elementary" />
          </Picker>
        </View>

        {/* Course Picker (only for college) */}
        {selectedDept === 'college' && (
          <View style={[styles.pickerWrapper, { marginTop: 12 }]}>
            <View style={styles.pickerLabelContainer}>
              <Ionicons name="book-outline" size={16} color="#0D3E86" />
              <Text style={styles.pickerLabel}>Select Course Department</Text>
            </View>
            <Picker
              selectedValue={selectedCourse}
              onValueChange={(v) => setSelectedCourse(v)}
              style={styles.picker}
              dropdownIconColor="#0D3E86"
            >
              <Picker.Item label="All Courses" value="" />
              <Picker.Item label="💻 BSIT DEPARTMENT" value="BSIT DEPARTMENT" />
              <Picker.Item label="🍽️ BSHM DEPARTMENT" value="BSHM DEPARTMENT" />
              <Picker.Item label="📖 EDUCATION DEPARTMENT" value="EDUCATION DEPARTMENT" />
              <Picker.Item label="📊 BS ENTERP DEPARTMENT" value="BS ENTERP DEPARTMENT" />
            </Picker>
          </View>
        )}

        {/* Clear Filter Button */}
        {selectedDept !== '' && (
          <TouchableOpacity style={styles.clearBtn} onPress={clearFilters} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color="#fff" />
            <Text style={styles.clearBtnText}>Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  return (
    <ImageBackground source={require('../assets/images/cc.jpg')} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.gradientOverlay}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          
          {/* Header */}
          <Animated.View style={{
            opacity: headerAnim,
            transform: [{ translateY: headerSlide }]
          }}>
            <View style={styles.headerWrapper}>
              <View style={styles.headerRedAccent} />
              <View style={styles.headerBlueBox}>
                <Image source={require('../assets/images/logo3.png')} style={styles.headerLogo} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.headerTitle}>Teachers Directory</Text>
                  <Text style={styles.headerSub}>Consolatrix College of Toledo City</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* ✅ FlatList with Filter Header - SCROLLABLE */}
          {loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Loading teachers...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredTeachers}
              renderItem={renderTeacherItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={<FilterHeader />}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="people-outline" size={80} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.emptyText}>
                    {selectedDept === '' 
                      ? '👆 Please select a department to view teachers' 
                      : 'No teachers found for this department'}
                  </Text>
                </View>
              }
            />
          )}

          {/* Bottom Tab */}
          <Animated.View style={[styles.bottomTab, { transform: [{ translateY: tabAnim }] }]}>
            <TabIcon icon="home-outline" label="Home" onPress={() => router.push('/home')} />
            <TabIcon icon="time-outline" label="School" onPress={() => router.push('/history')} />
            <TabIcon icon="school-outline" label="Courses" onPress={() => router.push('/courses')} />
            <TabIcon icon="people-outline" label="Teacher" active />
            <TabIcon icon="book-outline" label="Rules" onPress={() => router.push('/rules')} />
            <TabIcon icon="newspaper-outline" label="News" onPress={() => router.push('/news')} />
          </Animated.View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const TabIcon = ({ icon, label, active, onPress }) => {
  const { scaleAnim, pressIn, pressOut } = usePressAnimation();
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
      >
        <Ionicons name={icon} size={22} color={active ? '#fff' : '#ccc'} />
        <Text style={[styles.tabLabel, { color: active ? '#fff' : '#ccc' }]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};