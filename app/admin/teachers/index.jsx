import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AdminCard from '../components/AdminCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CategoryBadge from '../components/CategoryBadge';
import { db } from '../../../config/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function FacultyManagement() {
  const router = useRouter();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const departments = [
    { name: 'All', label: 'All' },
    { name: 'College', label: 'College' },
    { name: 'SHS', label: 'Senior High' },
    { name: 'JHS', label: 'Junior High' },
    { name: 'Elementary', label: 'Elementary' },
    { name: 'Staff', label: 'Staff' }
  ];

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'teachers'));
      const facultyData = [];
      querySnapshot.forEach((doc) => {
        facultyData.push({ id: doc.id, ...doc.data() });
      });
      setFaculty(facultyData);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Are you sure you want to delete this?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteDoc(doc(db, 'teachers', id));
        fetchFaculty();
      }}
    ]);
  };

  const filteredFaculty = filter === 'All' ? faculty : faculty.filter(item => item.department === filter);
  const sortedFaculty = [...filteredFaculty].sort((a, b) => a.name.localeCompare(b.name));

  if (loading) return <LoadingSpinner message="Loading faculty..." />;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.push('/admin/dashboard')} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerIcon}>
              <Ionicons name="people" size={22} color="#fff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Faculty & Staff</Text>
              <Text style={styles.headerSubtitle}>Manage school personnel</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/admin/teachers/add')}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterContainer}>
            {departments.map((dept) => (
              <TouchableOpacity key={dept.name} style={[styles.filterChip, filter === dept.name && styles.filterChipActive]} onPress={() => setFilter(dept.name)}>
                <Text style={[styles.filterChipText, filter === dept.name && styles.filterChipTextActive]}>{dept.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={sortedFaculty}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AdminCard style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardInfo}>
                {/* ✅ Dito na natin pinapasok yung Image kung meron, kung wala yung Initials */}
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </Text>
                  </View>
                )}
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <CategoryBadge category={item.department} />
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => router.push(`/admin/teachers/edit?id=${item.id}`)} style={styles.actionBtn}>
                  <Ionicons name="create-outline" size={18} color="#8B0000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                  <Ionicons name="trash-outline" size={18} color="#8B0000" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.details}>
              <Text style={styles.detailText}>💼 {item.position}</Text>
              {item.course && <Text style={styles.detailText}>📚 {item.course}</Text>}
            </View>
          </AdminCard>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No Faculty/Staff found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  headerContainer: { backgroundColor: '#0D3E86', paddingTop: 50, paddingHorizontal: 18, paddingBottom: 16, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, elevation: 4 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backBtn: { padding: 4, marginRight: 6 },
  headerIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', fontFamily: 'Montserrat-Bold' },
  headerSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'Montserrat-Medium' },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 18, gap: 4 },
  addButtonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  filterWrapper: { backgroundColor: '#fff', marginHorizontal: 15, marginTop: -8, borderRadius: 14, elevation: 4, paddingVertical: 4 },
  filterScroll: { paddingVertical: 6 },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 12, alignItems: 'center' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 18, backgroundColor: '#F5F5F5', marginRight: 8, borderWidth: 1, borderColor: '#E8E8E8' },
  filterChipActive: { backgroundColor: '#0D3E86', borderColor: '#0D3E86' },
  filterChipText: { fontSize: 13, color: '#666', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },
  list: { padding: 14, paddingBottom: 120 },
  card: { marginBottom: 10, borderRadius: 14, padding: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0D3E86', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarImage: { width: 44, height: 44, borderRadius: 22, marginRight: 12, backgroundColor: '#ddd' }, // ✅ Bagong style
  avatarText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  nameContainer: { flex: 1 },
  name: { fontSize: 15, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 3 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 6, borderRadius: 8, backgroundColor: '#F5F5F5' },
  details: { marginTop: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  detailText: { fontSize: 13, color: '#555', marginBottom: 4 },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 17, fontWeight: 'bold', color: '#999', marginTop: 10 },
});