import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, Image, FlatList, 
  Modal, Pressable, ImageBackground, Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { styles } from '../styles/HomeStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebase';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';

// ✅ MENU DATA
const MENU_DATA = [
  { id: '1', title: 'School History', icon: 'book-outline', color: '#FF0000', route: '/history' },
  { id: '2', title: 'Courses and Strands', icon: 'school-outline', color: '#FFD700', route: '/courses' }, 
  { id: '3', title: 'Teacher Directory', icon: 'people-outline', color: '#32CD32', route: '/teachers' },
  { id: '4', title: 'Rules and Policies', icon: 'document-text-outline', color: '#0000FF', route: '/rules' },
  { id: '5', title: 'Campus Tour', icon: 'map-outline', color: '#6C63FF', route: '/virtualtour' },
  { id: '6', title: 'News and Announcements', icon: 'newspaper-outline', color: '#FFA500', route: '/news' },
  { id: '7', title: 'School Statistics', icon: 'stats-chart-outline', color: '#8B0000', route: '/statistics' },
];

// ✅ NOTIFICATION CARD WITH ANIMATION
const NotificationCard = ({ item, onPress, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const timeAgo = (date) => {
    if (!date) return 'Just now';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [
        { translateX: slideAnim },
        { scale: scaleAnim }
      ]
    }}>
      <TouchableOpacity style={styles.notifCard} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.notifIconBox, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon || 'document-text'} size={20} color={item.color || '#0D3E86'} />
        </View>
        <View style={styles.notifContent}>
          <View style={styles.notifHeader}>
            <Text style={styles.notifTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.notifTime}>{timeAgo(item.createdAt)}</Text>
          </View>
          <Text style={styles.notifDesc} numberOfLines={1}>{item.description}</Text>
        </View>
        <View style={styles.notifBadge}>
          <Text style={styles.notifBadgeText}>NEW</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ✅ MENU CARD
const MenuCard = ({ item, index, onPress, cardAnim }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ 
      opacity: cardAnim,
      transform: [
        { 
          scale: cardAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1]
          })
        },
        { 
          translateY: cardAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          })
        }
      ]
    }}>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity 
          style={styles.menuCard}
          activeOpacity={0.85}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={[styles.sideBorder, { backgroundColor: item.color }]} />
          <View style={styles.cardContent}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={28} color="#0D3E86" />
            </View>
            <Text style={styles.menuTitle}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// ✅ SIDEBAR COMPONENTS
const SidebarLink = ({ title, onPress }) => (
  <TouchableOpacity style={styles.sidebarLinkBox} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.sidebarLinkText}>{title}</Text>
  </TouchableOpacity>
);

const SidebarItem = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.sidebarItem} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name={icon} size={20} color="#1A1A2E" style={{ marginRight: 15 }} />
    <Text style={styles.sidebarItemText}>{title}</Text>
  </TouchableOpacity>
);

const TabIcon = ({ icon, label, active, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Ionicons name={icon} size={22} color={active ? '#fff' : '#ccc'} />
        <Text style={[styles.tabLabel, { color: active ? '#fff' : '#ccc' }]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ✅ MAIN COMPONENT
export default function HomeScreen() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const cardAnims = useRef(MENU_DATA.map(() => new Animated.Value(0))).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const notifContainerAnim = useRef(new Animated.Value(0)).current;

  // ✅ FETCH NOTIFICATIONS FROM FIREBASE
  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(5));
    
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const newsData = [];
      querySnapshot.forEach((doc) => {
        newsData.push({ 
          id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        });
      });
      
      const readItems = await AsyncStorage.getItem('readNotifications');
      const readList = readItems ? JSON.parse(readItems) : [];
      const unread = newsData.filter(item => !readList.includes(item.id));
      setUnreadCount(unread.length);
      const displayItems = unread.length > 0 ? unread.slice(0, 3) : newsData.slice(0, 3);
      setNotifications(displayItems);
      
      if (displayItems.length > 0) {
        Animated.timing(notifContainerAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    }, (error) => {
      console.error('Error fetching notifications:', error);
    });

    return () => unsubscribe();
  }, []);

  // ✅ MARK AS READ WHEN VIEWING NEWS
  const handleViewNews = async () => {
    const readItems = await AsyncStorage.getItem('readNotifications');
    const readList = readItems ? JSON.parse(readItems) : [];
    notifications.forEach(item => {
      if (!readList.includes(item.id)) {
        readList.push(item.id);
      }
    });
    await AsyncStorage.setItem('readNotifications', JSON.stringify(readList));
    setUnreadCount(0);
    router.push('/news');
  };

  // ✅ ANIMATIONS
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    Animated.stagger(100, 
      cardAnims.map(anim => 
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      )
    ).start();

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 800,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderItem = ({ item, index }) => (
    <MenuCard 
      item={item} 
      index={index}
      cardAnim={cardAnims[index]}
      onPress={() => item.route && router.push(item.route)}
    />
  );

  // ✅ NOTIFICATION HEADER WITH ANIMATION
  const NotificationHeader = () => {
    if (notifications.length === 0) return null;
    
    return (
      <Animated.View style={{
        opacity: notifContainerAnim,
        transform: [
          { 
            scale: notifContainerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.95, 1]
            })
          },
          { 
            translateY: notifContainerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-10, 0]
            })
          }
        ]
      }}>
        <View style={styles.notifContainerWrapper}>
          <View style={styles.notifContainer}>
            <View style={styles.notifHeaderRow}>
              <View style={styles.notifHeaderLeft}>
                <Ionicons name="notifications" size={18} color="#0D3E86" />
                <Text style={styles.notifHeaderTitle}>Latest Updates</Text>
              </View>
              <TouchableOpacity onPress={handleViewNews}>
                <Text style={styles.notifViewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {notifications.map((notif, index) => (
              <NotificationCard 
                key={notif.id} 
                item={notif} 
                index={index}
                onPress={handleViewNews}
              />
            ))}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <ImageBackground 
      source={require('../assets/images/cc.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <Animated.View style={[styles.gradientOverlay, { backgroundColor: 'rgba(13, 62, 134, 0.45)', opacity: fadeAnim }]}>
        
        <Animated.View style={{ 
          opacity: headerAnim,
          transform: [{
            translateY: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0]
            })
          }]
        }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSidebarVisible(true)} activeOpacity={0.7}>
              <Ionicons name="menu-outline" size={32} color="#fff" />
            </TouchableOpacity>
            
            {/* ✅ BELL WITH BADGE */}
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={handleViewNews}
              style={styles.bellContainer}
            >
              <Ionicons name="notifications-outline" size={28} color="#fff" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={{ 
          opacity: headerAnim,
          transform: [{
            translateX: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0]
            })
          }]
        }}>
          <View style={styles.brandCard}>
            <Image source={require('../assets/images/logotrue1.jpg')} style={styles.brandLogo} />
            <View>
              <Text style={styles.brandTitle}>
                 <Text style={{ color: '#ffffff' }}>e</Text>-Consolatrix
              </Text>
              <Text style={styles.brandSub}>Your School Information Hub</Text>
            </View>
          </View>
        </Animated.View>

        {/* ✅ FLATLIST WITH NOTIFICATION HEADER (SCROLLABLE) */}
        <FlatList
          data={MENU_DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<NotificationHeader />}
        />

        <Animated.View style={[styles.bottomTab, { transform: [{ translateY: slideAnim }] }]}>
          <TabIcon icon="home" label="Home" active onPress={() => router.push('/home')} />
          <TabIcon icon="time-outline" label="School" onPress={() => router.push('/history')} />
          <TabIcon icon="school-outline" label="Courses" onPress={() => router.push('/courses')} />
          <TabIcon icon="people-outline" label="Teacher" onPress={() => router.push('/teachers')} />
          <TabIcon icon="book-outline" label="Rules" onPress={() => router.push('/rules')} />
          <TabIcon icon="newspaper-outline" label="News" onPress={() => router.push('/news')} />
        </Animated.View>

        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => router.push('/chatbot')}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
        </TouchableOpacity>

      </Animated.View>

      {/* ✅ SIDEBAR MODAL - No Admin Login */}
      <Modal animationType="fade" transparent={true} visible={isSidebarVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.sidebarContainer}>
            {/* Sidebar Header */}
            <View style={styles.sidebarBrandCard}>
              <Text style={styles.sidebarBrandText}>e-Consolatrix</Text>
            </View>

            {/* Sidebar Menu - No Admin Login */}
            <View style={styles.sidebarMenu}>
              <SidebarLink title="School History" onPress={() => { setSidebarVisible(false); router.push('/history'); }} />
              <SidebarLink title="Courses and Strands" onPress={() => { setSidebarVisible(false); router.push('/courses'); }} />
              <SidebarLink title="Teacher Directory" onPress={() => { setSidebarVisible(false); router.push('/teachers'); }} />
              <SidebarLink title="Rules and Policies" onPress={() => { setSidebarVisible(false); router.push('/rules'); }} />
              <SidebarLink title="Campus Tour" onPress={() => { setSidebarVisible(false); router.push('/virtualtour'); }} />
              <SidebarLink title="News and Announcements" onPress={() => { setSidebarVisible(false); router.push('/news'); }} />
              <SidebarLink title="School Statistics" onPress={() => { setSidebarVisible(false); router.push('/statistics'); }} />
            </View>

            {/* Sidebar Footer - Log out only */}
            <View style={styles.sidebarFooter}>
              <SidebarItem 
                icon="log-out-outline" 
                title="Log out" 
                onPress={() => {
                  setSidebarVisible(false);
                  router.replace('/'); 
                }} 
              />
            </View>
          </View>
          <Pressable style={styles.modalCloseArea} onPress={() => setSidebarVisible(false)} />
        </View>
      </Modal>
    </ImageBackground>
  );
}