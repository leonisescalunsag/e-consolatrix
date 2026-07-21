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

// ✅ CATEGORY COLORS
const CATEGORY_COLORS = {
  'Announcements': '#3b82f6',
  'Events': '#a855f7',
  'Achievements': '#f59e0b',
};

export default function NewsManagement() {
  const router = useRouter();   
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Announcements', 'Events', 'Achievements'];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'news'));
      const newsData = [];
      querySnapshot.forEach((doc) => {
        newsData.push({ id: doc.id, ...doc.data() });
      });
      newsData.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate() - a.createdAt.toDate();
        }
        return 0;
      });
      setNews(newsData);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete News',
      'Are you sure you want to delete this news?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'news', id));
              fetchNews();
            } catch (error) {
              console.error('Error deleting news:', error);
            }
          }
        }
      ]
    );
  };

  const filteredNews = filter === 'All' 
    ? news 
    : news.filter(item => item.category?.toLowerCase() === filter.toLowerCase());

  const getCategoryColor = (category) => {
    return CATEGORY_COLORS[category] || '#666';
  };

  if (loading) return <LoadingSpinner message="Loading news..." />;

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
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerIcon}>
              <Ionicons name="newspaper" size={20} color="#fff" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle} numberOfLines={1}>News & Announcements</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>Manage school updates</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/admin/news/add')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FILTER CHIPS */}
      <View style={styles.filterWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterChip,
                filter === cat && styles.filterChipActive
              ]}
              onPress={() => setFilter(cat)}
            >
              <Text style={[
                styles.filterChipText,
                filter === cat && styles.filterChipTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredNews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AdminCard style={styles.newsCard}>
            {/* ✅ COLOR-CODED HEADER STRIP */}
            <View style={[styles.categoryStrip, { backgroundColor: getCategoryColor(item.category) }]} />
            
            <View style={styles.newsContent}>
              <View style={styles.newsHeader}>
                <View style={styles.categoryHeader}>
                  <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(item.category) }]} />
                  <Text style={[styles.categoryLabel, { color: getCategoryColor(item.category) }]}>
                    {item.category || 'General'}
                  </Text>
                </View>
                <Text style={styles.newsDate}>{item.date || 'No date'}</Text>
              </View>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsDesc} numberOfLines={2}>{item.description}</Text>
              
              {/* ✅ ACTIONS ONLY - NO VIEWS */}
              <View style={styles.newsFooter}>
                <View style={styles.actions}>
                  <TouchableOpacity 
                    onPress={() => router.push(`/admin/news/edit?id=${item.id}`)}
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
            </View>
          </AdminCard>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="newspaper-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No news found</Text>
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
    paddingHorizontal: 16,
    paddingBottom: 14,
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
    marginRight: 8,
  },
  backBtn: {
    padding: 4,
    marginRight: 4,
  },
  headerIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Montserrat-Medium',
    marginTop: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
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
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  filterScroll: {
    paddingVertical: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 36,
  },
  filterChipActive: {
    backgroundColor: '#0D3E86',
    borderColor: '#0D3E86',
  },
  filterChipText: {
    fontSize: 13,
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
  newsCard: {
    marginBottom: 10,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    padding: 0,
    overflow: 'hidden',
  },
  categoryStrip: {
    height: 5,
    width: '100%',
  },
  newsContent: {
    padding: 14,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Montserrat-Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  newsDate: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Montserrat-Regular',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  newsDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
    fontFamily: 'Montserrat-Regular',
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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