import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../styles/NewsStyles';
import { useFadeIn, useSlideUp, usePressAnimation } from '../hooks/useSlideAnimation';
import { db } from '../config/firebase';
import { collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';

// ✅ ANIMATED NEWS CARD
const AnimatedNewsCard = ({ item, index }) => {
  const fadeAnim = useFadeIn(500, index * 100);
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
        style={styles.newsCard}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={0.9}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: item.color + '20' }]}>
            <Text style={[styles.categoryText, { color: item.color }]}>{item.category}</Text>
          </View>
          <Ionicons name="bookmark-outline" size={20} color="#64748b" />
        </View>
        
        <View style={styles.cardContent}>
          <View style={[styles.iconBox, { backgroundColor: item.color || '#0D3E86' }]}>
            <Ionicons name={item.icon || 'document-text'} size={24} color="white" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsDesc} numberOfLines={2}>{item.description}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={14} color="#64748b" />
              <Text style={styles.metaText}>{item.date || 'No date'}</Text>
              <Ionicons name="eye-outline" size={14} color="#64748b" style={{ marginLeft: 10 }} />
              <Text style={styles.metaText}>{item.views || 0}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ✅ TAB BUTTON
const TabButton = ({ tab, active, onPress }) => {
  const { scaleAnim, pressIn, pressOut } = usePressAnimation();
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={[styles.tabButton, active && styles.activeTabButton]}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
      >
        <Text style={[styles.tabText, active && styles.activeTabText]}>{tab}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ✅ TAB ICON
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

// ✅ MAIN COMPONENT
export default function NewsScreen() {
  const [activeTab, setActiveTab] = useState('All news');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const tabs = ['All news', 'Announcements', 'Events', 'Achievements'];

  // ✅ FETCH NEWS FROM FIREBASE (REAL-TIME)
  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newsData = [];
      querySnapshot.forEach((doc) => {
        newsData.push({ 
          id: doc.id, 
          ...doc.data(),
          // Convert Firestore timestamp to string if needed
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        });
      });
      setNews(newsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching news:', error);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // ✅ FILTER BY CATEGORY
  const filteredByCategory = activeTab === 'All news' 
    ? news 
    : news.filter(item => item.category === activeTab);

  // ✅ FILTER BY SEARCH
  const filteredNews = searchQuery.trim() === ''
    ? filteredByCategory
    : filteredByCategory.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // ✅ HEADER ANIMATIONS
  const headerAnim = useFadeIn(600);
  const headerSlide = useSlideUp(-20);
  const tabAnim = useSlideUp(100);

  // ✅ LOADING STATE
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D3E86" />
          <Text style={styles.loadingText}>Loading news...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ANIMATED HEADER */}
      <Animated.View style={{
        opacity: headerAnim,
        transform: [{ translateY: headerSlide }]
      }}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Ionicons name="newspaper-outline" size={32} color="white" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.headerTitle}>News and Announcements</Text>
              <Text style={styles.headerSubtitle}>Stay updated with latest news</Text>
            </View>
          </View>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#94a3b8" />
            <TextInput 
              placeholder="Search news and announcements" 
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>

      {/* CATEGORY TABS */}
      <View style={{ backgroundColor: 'white' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {tabs.map((tab) => (
            <TabButton 
              key={tab} 
              tab={tab} 
              active={activeTab === tab} 
              onPress={() => setActiveTab(tab)}
            />
          ))}
        </ScrollView>
      </View>

      {/* NEWS LIST */}
      <ScrollView 
        contentContainerStyle={styles.newsList} 
        showsVerticalScrollIndicator={false}
      >
        {filteredNews.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="newspaper-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No news found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search term' : 'Check back later for updates'}
            </Text>
          </View>
        ) : (
          filteredNews.map((item, index) => (
            <AnimatedNewsCard key={item.id} item={item} index={index} />
          ))
        )}
      </ScrollView>

      {/* ANIMATED BOTTOM TAB */}
      <Animated.View style={[styles.bottomTab, { transform: [{ translateY: tabAnim }] }]}>
        <TabIcon icon="home-outline" label="Home" onPress={() => router.push('/home')} />
        <TabIcon icon="time-outline" label="School" onPress={() => router.push('/history')} />
        <TabIcon icon="school-outline" label="Courses" onPress={() => router.push('/courses')} />
        <TabIcon icon="people-outline" label="Teacher" onPress={() => router.push('/teachers')} />
        <TabIcon icon="book-outline" label="Rules" onPress={() => router.push('/rules')} />
        <TabIcon icon="newspaper-outline" label="News" active />
      </Animated.View>
    </SafeAreaView>
  );
}