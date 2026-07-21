import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { db, auth } from '../../config/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import LoadingSpinner from './components/LoadingSpinner';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalCourses: 0,
    totalNews: 0,
    totalRules: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const teachersSnapshot = await getDocs(collection(db, 'teachers'));
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const newsSnapshot = await getDocs(collection(db, 'news'));
      const rulesSnapshot = await getDocs(collection(db, 'rules'));

      setStats({
        totalTeachers: teachersSnapshot.size,
        totalCourses: coursesSnapshot.size,
        totalNews: newsSnapshot.size,
        totalRules: rulesSnapshot.size
      });

      const recentNewsQuery = query(
        collection(db, 'news'),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const recentNewsSnapshot = await getDocs(recentNewsQuery);
      const activities = [];
      recentNewsSnapshot.forEach((doc) => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: 'news',
          action: 'News published',
          title: data.title,
          time: data.createdAt?.toDate() || new Date()
        });
      });

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/home');
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient
        colors={['#0D3E86', '#1A5CB5']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Ionicons name="grid" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Dashboard</Text>
              <Text style={styles.headerSubtitle}>Welcome back, Admin</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.exitButton}>
            <Ionicons name="exit-outline" size={20} color="#fff" />
            <Text style={styles.exitText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* MAIN CONTENT */}
      <LinearGradient
        colors={['#F0F4F8', '#E8EDF2']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Welcome Card */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>📊 Overview</Text>
            <Text style={styles.welcomeDesc}>Here's what's happening in your school app</Text>
          </View>

          {/* ✅ STATS GRID - 2x2 */}
          <View style={styles.statsGrid}>
            {/* Row 1: Teachers & Courses */}
            <View style={styles.statsRow}>
              <TouchableOpacity 
                style={[styles.statCard, styles.statCardLeft]}
                onPress={() => router.push('/admin/teachers')}
              >
                <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="school" size={24} color="#32CD32" />
                </View>
                <Text style={styles.statNumber}>{stats.totalTeachers}</Text>
                <Text style={styles.statLabel}>Teachers</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.statCard, styles.statCardRight]}
                onPress={() => router.push('/admin/courses')}
              >
                <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="book" size={24} color="#FF8C00" />
                </View>
                <Text style={styles.statNumber}>{stats.totalCourses}</Text>
                <Text style={styles.statLabel}>Courses</Text>
              </TouchableOpacity>
            </View>

            {/* Row 2: News & Rules */}
            <View style={styles.statsRow}>
              <TouchableOpacity 
                style={[styles.statCard, styles.statCardLeft]}
                onPress={() => router.push('/admin/news')}
              >
                <View style={[styles.statIcon, { backgroundColor: '#FCE4EC' }]}>
                  <Ionicons name="newspaper" size={24} color="#E91E63" />
                </View>
                <Text style={styles.statNumber}>{stats.totalNews}</Text>
                <Text style={styles.statLabel}>News</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.statCard, styles.statCardRight]}
                onPress={() => router.push('/admin/rules')}
              >
                <View style={[styles.statIcon, { backgroundColor: '#F3E5F5' }]}>
                  <Ionicons name="document-text" size={24} color="#8A2BE2" />
                </View>
                <Text style={styles.statNumber}>{stats.totalRules}</Text>
                <Text style={styles.statLabel}>Rules</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.quickActionItem}
                onPress={() => router.push('/admin/news/add')}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name="add-circle" size={22} color="#8B0000" />
                </View>
                <Text style={styles.quickActionText}>New Post</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickActionItem}
                onPress={() => router.push('/admin/teachers/add')}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name="person-add" size={22} color="#8B0000" />
                </View>
                <Text style={styles.quickActionText}>Add Teacher</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickActionItem}
                onPress={() => router.push('/admin/courses/add')}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name="book" size={22} color="#8B0000" />
                </View>
                <Text style={styles.quickActionText}>Add Course</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickActionItem}
                onPress={() => router.push('/admin/rules/add')}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name="document-text" size={22} color="#8B0000" />
                </View>
                <Text style={styles.quickActionText}>Add Rule</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🕐 Recent Activity</Text>
            {recentActivity.length > 0 ? (
              recentActivity.map((item) => (
                <View key={item.id} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Ionicons name="newspaper" size={16} color="#8B0000" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>{item.action}</Text>
                    <Text style={styles.activityTitle}>{item.title}</Text>
                    <Text style={styles.activityTime}>{formatTime(item.time)}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No recent activity</Text>
            )}
          </View>

          {/* System Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔧 System Status</Text>
            <View style={styles.statusItem}>
              <View style={styles.statusLeft}>
                <Ionicons name="server" size={18} color="#0D3E86" />
                <Text style={styles.statusLabel}>Database</Text>
              </View>
              <View style={styles.statusRight}>
                <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.statusValue}>Healthy</Text>
              </View>
            </View>
            <View style={styles.statusItem}>
              <View style={styles.statusLeft}>
                <Ionicons name="cloud" size={18} color="#0D3E86" />
                <Text style={styles.statusLabel}>Firebase Auth</Text>
              </View>
              <View style={styles.statusRight}>
                <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.statusValue}>Online</Text>
              </View>
            </View>
            <View style={styles.statusItem}>
              <View style={styles.statusLeft}>
                <Ionicons name="hardware-chip" size={18} color="#0D3E86" />
                <Text style={styles.statusLabel}>Storage</Text>
              </View>
              <View style={styles.statusRight}>
                <View style={styles.progressBarWrapper}>
                  <View style={[styles.progressFill, { width: '85%' }]} />
                </View>
                <Text style={styles.statusValue}>85%</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  headerGradient: {
    paddingTop: 45,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 8,
    shadowColor: '#0D3E86',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Montserrat-Medium',
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  exitText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 13,
    fontFamily: 'Montserrat-Medium',
  },
  backgroundGradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  welcomeCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    fontFamily: 'Montserrat-Bold',
  },
  welcomeDesc: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
    fontFamily: 'Montserrat-Regular',
  },
  // ✅ 2x2 STATS GRID
  statsGrid: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    flex: 1,
  },
  statCardLeft: {
    marginRight: 6,
  },
  statCardRight: {
    marginLeft: 6,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A2E',
    fontFamily: 'Montserrat-Bold',
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 14,
    fontFamily: 'Montserrat-Bold',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: (width - 62) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  quickActionText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Montserrat-Regular',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    fontFamily: 'Montserrat-Medium',
  },
  activityTime: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'Montserrat-Regular',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Montserrat-Regular',
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusValue: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Montserrat-Regular',
  },
  progressBarWrapper: {
    width: 80,
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0D3E86',
    borderRadius: 3,
  },
});