import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, Pressable, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { styles } from '../styles/HomeStyles';

const MENU_DATA = [
  { id: '1', title: 'School History', icon: 'time-outline', color: '#FF0000', route: '/history' },
  { id: '2', title: 'Courses and Strands', icon: 'school-outline', color: '#FFD700', route: '/courses' }, 
  { id: '3', title: 'Teacher Directory', icon: 'people-outline', color: '#32CD32', route: '/teachers' },
  { id: '4', title: 'Rules and Policies', icon: 'book-outline', color: '#0000FF', route: '/rules' },
  { id: '5', title: 'News and Announcements', icon: 'notifications-outline', color: '#FFA500', route: '/news' },
];

export default function HomeScreen() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();

  const renderItem = ({ item }) => {
    const isNewsCard = item.id === '5';

    return (
      <TouchableOpacity 
        style={[styles.menuCard, isNewsCard && styles.centeredLastCard]}
        activeOpacity={0.85} // Simple animation, hindi nagtatransparent masyado
        onPress={() => item.route && router.push(item.route)}
      >
        <View style={[styles.sideBorder, { backgroundColor: item.color }]} />
        <View style={styles.cardContent}>
          <View style={styles.iconCircle}>
            <Ionicons name={item.icon} size={28} color="#0D3E86" />
          </View>
          <Text style={styles.menuTitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground 
      source={require('../assets/images/cc.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={[styles.gradientOverlay, { backgroundColor: 'rgba(13, 62, 134, 0.45)' }]}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)} activeOpacity={0.7}>
            <Ionicons name="menu-outline" size={32} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.brandCard}>
          <Image source={require('../assets/images/log1.png')} style={styles.brandLogo} />
          <View>
            <Text style={styles.brandTitle}>
               <Text style={{ color: '#0033FF' }}>e</Text>-Consolatrix
            </Text>
            <Text style={styles.brandSub}>Your School Information Hub</Text>
          </View>
        </View>

        <FlatList
          data={MENU_DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.bottomTab}>
          <TabIcon icon="home" label="Home" active onPress={() => router.push('/home')} />
          <TabIcon icon="time-outline" label="School" onPress={() => router.push('/history')} />
          <TabIcon icon="school-outline" label="Courses" onPress={() => router.push('/courses')} />
          <TabIcon icon="people-outline" label="Teacher" onPress={() => router.push('/teachers')} />
          <TabIcon icon="book-outline" label="Rules" onPress={() => router.push('/rules')} />
        </View>
      </View>

      <Modal animationType="fade" transparent={true} visible={isSidebarVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.sidebarContainer}>
            <View style={styles.sidebarBrandCard}>
              <Image source={require('../assets/images/log1.png')} style={styles.sidebarLogoSmall} />
              <Text style={styles.sidebarBrandText}>
                <Text style={{ color: '#0033FF' }}>e</Text>-Consolatrix
              </Text>
            </View>

            <View style={styles.sidebarMenu}>
              <SidebarLink title="School History" onPress={() => { setSidebarVisible(false); router.push('/history'); }} />
              <SidebarLink title="Courses and Strands" onPress={() => { setSidebarVisible(false); router.push('/courses'); }} />
              <SidebarLink title="Teacher Directory" onPress={() => { setSidebarVisible(false); router.push('/teachers'); }} />
              <SidebarLink title="Rules and Policies" onPress={() => { setSidebarVisible(false); router.push('/rules'); }} />
              <SidebarLink title="News and Announcements" onPress={() => { setSidebarVisible(false); router.push('/news'); }} />
            </View>

            <View style={styles.sidebarFooter}>
              <Text style={accountLabelStyle}>ACCOUNT</Text>
              <SidebarItem icon="settings-outline" title="Settings" />
              <SidebarItem icon="language-outline" title="Language" />
              <SidebarItem icon="help-circle-outline" title="Get help" />
              <View style={styles.divider} />
              <SidebarItem icon="log-out-outline" title="Log out" onPress={() => router.replace('/login')} />
            </View>
          </View>
          <Pressable style={styles.modalCloseArea} onPress={() => setSidebarVisible(false)} />
        </View>
      </Modal>
    </ImageBackground>
  );
}

const SidebarLink = ({ title, onPress }) => (
  <TouchableOpacity style={styles.sidebarLinkBox} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.sidebarLinkText}>{title}</Text>
  </TouchableOpacity>
);

const SidebarItem = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.sidebarItem} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name={icon} size={20} color="#fff" style={{ marginRight: 15 }} />
    <Text style={styles.sidebarItemText}>{title}</Text>
  </TouchableOpacity>
);

const TabIcon = ({ icon, label, active, onPress }) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.8}>
    <Ionicons name={icon} size={22} color={active ? '#fff' : '#ccc'} />
    <Text style={[styles.tabLabel, { color: active ? '#fff' : '#ccc' }]}>{label}</Text>
  </TouchableOpacity>
);

const accountLabelStyle = { color: '#fff', fontSize: 13, fontWeight: 'bold', marginBottom: 15, marginTop: 20 };