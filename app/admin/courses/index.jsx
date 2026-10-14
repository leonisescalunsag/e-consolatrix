import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AdminCard from '../components/AdminCard';
import AdminButton from '../components/AdminButton';
import LoadingSpinner from '../components/LoadingSpinner';
import CategoryBadge from '../components/CategoryBadge';
import { db } from '../../../config/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function AdminCourses() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Course',
      'Are you sure you want to delete this course?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'courses', id));
              fetchCourses();
            } catch (error) {
              console.error('Error deleting course:', error);
            }
          }
        }
      ]
    );
  };

  const filteredCourses = filter === 'all' 
    ? courses 
    : courses.filter(c => c.level === filter);

  if (loading) return <LoadingSpinner message="Loading courses..." />;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              onPress={() => router.push('/admin/dashboard')} 
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerIcon}>
              <Ionicons name="book" size={22} color="#fff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Courses & Strands</Text>
              <Text style={styles.headerSubtitle}>Manage academic programs</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/admin/courses/add')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ FIXED FILTER CHIPS */}
      <View style={styles.filterWrapper}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterChipText, filter === 'all' && styles.filterChipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'college' && styles.filterChipActive]}
            onPress={() => setFilter('college')}
          >
            <Text style={[styles.filterChipText, filter === 'college' && styles.filterChipTextActive]}>
              College
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'shs' && styles.filterChipActive]}
            onPress={() => setFilter('shs')}
          >
            <Text style={[styles.filterChipText, filter === 'shs' && styles.filterChipTextActive]}>
              SHS
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AdminCard style={styles.courseCard}>
            <View style={styles.courseHeader}>
              <View style={styles.courseLeft}>
                <View style={styles.courseIcon}>
                  <Ionicons name="school-outline" size={20} color="#0D3E86" />
                </View>
                <View>
                  <Text style={styles.courseCode}>{item.code}</Text>
                  <CategoryBadge category={item.level} />
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity 
                  onPress={() => router.push(`/admin/courses/edit?id=${item.id}`)}
                  style={styles.actionBtn}
                >
                  <Ionicons name="create-outline" size={18} color="#8B0000" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleDelete(item.id)}
                  style={styles.actionBtn}
                >
                  <Ionicons name="trash-outline" size={18} color="#8B0000" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.courseName}>{item.name}</Text>
            {item.description && (
              <Text style={styles.courseDesc} numberOfLines={2}>{item.description}</Text>
            )}
          </AdminCard>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No courses found</Text>
            <Text style={styles.emptySubtext}>Tap "Add" to create one</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    backgroundColor: '#0D3E86',
    paddingTop: 50,
    paddingHorizontal: 18,
    paddingBottom: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    padding: 4,
    marginRight: 6,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Montserrat-Medium',
    marginTop: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Montserrat-Medium',
  },
  // ✅ FIXED FILTER STYLES
  filterWrapper: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: -8,
    borderRadius: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 38,
  },
  filterChipActive: {
    backgroundColor: '#0D3E86',
    borderColor: '#0D3E86',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  list: {
    padding: 14,
    paddingBottom: 120,
  },
  courseCard: {
    marginBottom: 10,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    padding: 14,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  courseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    fontFamily: 'Montserrat-Bold',
  },
  courseName: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Montserrat-Medium',
    marginBottom: 2,
  },
  courseDesc: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Montserrat-Regular',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 10,
    fontFamily: 'Montserrat-Bold',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 4,
    fontFamily: 'Montserrat-Medium',
  },
});