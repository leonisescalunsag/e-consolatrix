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

export default function TeachersManagement() {
  const router = useRouter();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const departments = [
    { name: 'all', label: 'All' },
    { name: 'college', label: 'College' },
    { name: 'shs', label: 'Senior High' },
    { name: 'jhs', label: 'Junior High' },
    { name: 'elementary', label: 'Elementary' }
  ];

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

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Teacher',
      'Are you sure you want to delete this teacher?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'teachers', id));
              fetchTeachers();
            } catch (error) {
              console.error('Error deleting teacher:', error);
            }
          }
        }
      ]
    );
  };

  const filteredTeachers = filter === 'all' 
    ? teachers 
    : teachers.filter(item => item.department === filter);

  const sortedTeachers = [...filteredTeachers].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  if (loading) return <LoadingSpinner message="Loading teachers..." />;

  return (
    <View style={styles.container}>
      {/* ✅ IMPROVED HEADER WITH BACK BUTTON */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            {/* ✅ BACK BUTTON */}
            <TouchableOpacity 
              onPress={() => router.push('/admin/dashboard')} 
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerIcon}>
              <Ionicons name="people" size={22} color="#fff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Teachers Directory</Text>
              <Text style={styles.headerSubtitle}>Manage your faculty members</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/admin/teachers/add')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Department Filters */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterContainer}>
            {departments.map((dept) => (
              <TouchableOpacity
                key={dept.name}
                style={[
                  styles.filterChip,
                  filter === dept.name && styles.filterChipActive
                ]}
                onPress={() => setFilter(dept.name)}
              >
                <Text style={[
                  styles.filterChipText,
                  filter === dept.name && styles.filterChipTextActive
                ]}>
                  {dept.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={sortedTeachers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AdminCard style={styles.teacherCard}>
            <View style={styles.teacherHeader}>
              <View style={styles.teacherInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </Text>
                </View>
                <View style={styles.nameContainer}>
                  <Text style={styles.teacherName}>{item.name}</Text>
                  <View style={styles.badgeContainer}>
                    <CategoryBadge category={item.department} />
                  </View>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity 
                  onPress={() => router.push(`/admin/teachers/edit?id=${item.id}`)}
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

            <View style={styles.details}>
              <View style={styles.detailRow}>
                <View style={[styles.detailIcon, { backgroundColor: '#FFE5E5' }]}>
                  <Ionicons name="briefcase-outline" size={13} color="#8B0000" />
                </View>
                <Text style={styles.detailText}>{item.position}</Text>
              </View>
              {item.course && (
                <View style={styles.detailRow}>
                  <View style={[styles.detailIcon, { backgroundColor: '#E5F0FF' }]}>
                    <Ionicons name="book-outline" size={13} color="#0066CC" />
                  </View>
                  <Text style={styles.detailText}>{item.course}</Text>
                </View>
              )}
            </View>
          </AdminCard>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No teachers found</Text>
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
  // ✅ IMPROVED HEADER WITH BACK BUTTON
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
    paddingVertical: 4,
  },
  filterScroll: {
    paddingVertical: 6,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 34,
  },
  filterChipActive: {
    backgroundColor: '#0D3E86',
    borderColor: '#0D3E86',
  },
  filterChipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  list: {
    padding: 14,
    paddingBottom: 120,
  },
  teacherCard: {
    marginBottom: 10,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    padding: 14,
  },
  teacherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0D3E86',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  nameContainer: {
    flex: 1,
  },
  teacherName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 3,
    fontFamily: 'Montserrat-Bold',
  },
  badgeContainer: {
    alignSelf: 'flex-start',
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
  details: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  detailText: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'Montserrat-Regular',
    flex: 1,
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