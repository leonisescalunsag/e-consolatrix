import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, ScrollView, TouchableOpacity, 
  SafeAreaView, Animated, ActivityIndicator, Modal, Pressable 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../styles/NewsStyles';
import { useFadeIn, useSlideUp, usePressAnimation } from '../hooks/useSlideAnimation';
import { db } from '../config/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

// ✅ NEWS CARD - Clickable with preview
const NewsCard = ({ item, index, onPress }) => {
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
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={0.9}
      >
        {/* Category Badge */}
        <View style={styles.cardHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: item.color + '20' }]}>
            <Text style={[styles.categoryText, { color: item.color }]}>{item.category}</Text>
          </View>
          <Text style={styles.newsDate}>{item.date || 'No date'}</Text>
        </View>
        
        {/* Title */}
        <Text style={styles.newsTitle}>{item.title}</Text>
        
        {/* Description Preview - 2 lines only */}
        <Text style={styles.newsPreview} numberOfLines={2}>
          {item.description}
        </Text>
        
        {/* Read More Indicator */}
        <View style={styles.readMoreContainer}>
          <Text style={styles.readMoreText}>Read More</Text>
          <Ionicons name="arrow-forward-circle" size={18} color="#0D3E86" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ✅ NEWS DETAIL MODAL
const NewsDetailModal = ({ visible, news, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!news) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <Animated.View style={[
          styles.modalContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          {/* Close Button */}
          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
            <Ionicons name="close-circle" size={32} color="#0D3E86" />
          </TouchableOpacity>

          {/* Category Badge */}
          <View style={[styles.modalCategoryBadge, { backgroundColor: news.color + '20' }]}>
            <Text style={[styles.modalCategoryText, { color: news.color }]}>
              {news.category}
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.modalTitle}>{news.title}</Text>

          {/* Date */}
          <View style={styles.modalDateRow}>
            <Ionicons name="calendar-outline" size={16} color="#64748B" />
            <Text style={styles.modalDate}>{news.date || 'No date'}</Text>
          </View>

          {/* Full Description */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.modalDescriptionContainer}>
            <Text style={styles.modalDescription}>{news.description}</Text>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
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

// ✅ TAB ICON (Bottom)
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
  const [selectedNews, setSelectedNews] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
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
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        });
      });
      setNews(newsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching news:', error);
      setLoading(false);
    });

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

  // ✅ Open News Detail
  const openNewsDetail = (item) => {
    setSelectedNews(item);
    setModalVisible(true);
  };

  // ✅ Close News Detail
  const closeNewsDetail = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedNews(null), 300);
  };

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
      {/* HEADER */}
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
              placeholder="Search news..." 
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
            <NewsCard 
              key={item.id} 
              item={item} 
              index={index}
              onPress={() => openNewsDetail(item)}
            />
          ))
        )}
      </ScrollView>

      {/* NEWS DETAIL MODAL */}
      <NewsDetailModal
        visible={modalVisible}
        news={selectedNews}
        onClose={closeNewsDetail}
      />

      {/* BOTTOM TAB */}
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