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

export default function RulesManagement() {
  const router = useRouter();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const categories = [
    { name: 'all', label: 'All' },
    { name: 'attendance', label: 'Attendance', color: '#44e644' },
    { name: 'dresscode', label: 'Dress Code', color: '#0033FF' },
    { name: 'academic', label: 'Academic Integrity', color: '#f50c0c' },
    { name: 'behavioral', label: 'Behavioral Standards', color: '#FFA500' }
  ];

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'rules'));
      const rulesData = [];
      querySnapshot.forEach((doc) => {
        rulesData.push({ id: doc.id, ...doc.data() });
      });
      setRules(rulesData);
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Rule',
      'Are you sure you want to delete this rule?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'rules', id));
              fetchRules();
            } catch (error) {
              console.error('Error deleting rule:', error);
            }
          }
        }
      ]
    );
  };

  const filteredRules = filter === 'all' 
    ? rules 
    : rules.filter(item => item.category === filter);

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.name === category);
    return cat ? cat.color : '#8B0000';
  };

  if (loading) return <LoadingSpinner message="Loading rules..." />;

  return (
    <View style={styles.container}>
      {/* ✅ IMPROVED HEADER WITH BACK BUTTON */}
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
              <Ionicons name="document-text" size={22} color="#fff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Rules & Policies</Text>
              <Text style={styles.headerSubtitle}>Manage school policies</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/admin/rules/add')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filters */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={[
                  styles.filterChip,
                  filter === cat.name && styles.filterChipActive
                ]}
                onPress={() => setFilter(cat.name)}
              >
                <Text style={[
                  styles.filterChipText,
                  filter === cat.name && styles.filterChipTextActive
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={filteredRules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AdminCard style={styles.ruleCard}>
            <View style={styles.ruleHeader}>
              <View style={styles.ruleTitleContainer}>
                <CategoryBadge category={item.category} />
                <Text style={styles.ruleTitle}>{item.title}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity 
                  onPress={() => router.push(`/admin/rules/edit?id=${item.id}`)}
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

            {item.rules && item.rules.map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <View style={[styles.bullet, { backgroundColor: getCategoryColor(item.category) }]} />
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </AdminCard>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No rules found</Text>
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
    paddingHorizontal: 14,
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
  ruleCard: {
    marginBottom: 10,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    padding: 14,
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ruleTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    fontFamily: 'Montserrat-Bold',
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
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingLeft: 4,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    fontFamily: 'Montserrat-Regular',
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