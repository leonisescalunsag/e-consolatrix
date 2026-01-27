import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, Pressable, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/HomeStyles';

const MENU_DATA = [
  { id: '1', title: 'School History', icon: 'time-outline', color: '#FF0000' },
  { id: '2', title: 'Courses and Strands', icon: 'school-outline', color: '#FFD700' },
  { id: '3', title: 'Teacher Directory', icon: 'people-outline', color: '#32CD32' },
  { id: '4', title: 'Rules and Policies', icon: 'book-outline', color: '#0000FF' },
  { id: '5', title: 'News and Announcements', icon: 'notifications-outline', color: '#FFA500' },
];

export default function HomeScreen() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const renderItem = ({ item }) => {
    const isNewsCard = item.id === '5';

    return (
      <TouchableOpacity 
        style={[
          styles.menuCard, 
          isNewsCard && styles.centeredLastCard
        ]}
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
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)}>
            <Ionicons name="menu-outline" size={32} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* BRAND CARD */}
        <View style={styles.brandCard}>
          <Image source={require('../assets/images/log1.png')} style={styles.brandLogo} />
          <View>
            <Text style={styles.brandTitle}>e-Consolatrix</Text>
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

        {/* BOTTOM TAB */}
        <View style={styles.bottomTab}>
          <TabIcon icon="home" label="Home" active />
          <TabIcon icon="time-outline" label="School" />
          <TabIcon icon="school-outline" label="Courses" />
          <TabIcon icon="people-outline" label="Teacher" />
          <TabIcon icon="book-outline" label="Rules" />
        </View>
      </View>

      {/* SIDEBAR MODAL */}
      <Modal animationType="fade" transparent={true} visible={isSidebarVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.sidebarContainer}>
            <View style={styles.sidebarBrandCard}>
              <Image source={require('../assets/images/log1.png')} style={styles.sidebarLogoSmall} />
              <Text style={styles.sidebarBrandText}>e-Consolatrix</Text>
            </View>

            <View style={styles.sidebarMenu}>
              <SidebarLink title="School History" />
              <SidebarLink title="Courses and Strands" />
              <SidebarLink title="Teacher Directory" />
              <SidebarLink title="Rules and Policies" />
              <SidebarLink title="News and Announcements" />
            </View>

            <View style={styles.sidebarFooter}>
              <Text style={accountLabelStyle}>ACCOUNT</Text>
              <SidebarItem icon="settings-outline" title="Settings" />
              <SidebarItem icon="language-outline" title="Language" />
              <SidebarItem icon="help-circle-outline" title="Get help" />
              <View style={styles.divider} />
              <SidebarItem icon="log-out-outline" title="Log out" />
            </View>
          </View>
          <Pressable style={styles.modalCloseArea} onPress={() => setSidebarVisible(false)} />
        </View>
      </Modal>
    </ImageBackground>
  );
}

const SidebarLink = ({ title }) => (
  <TouchableOpacity style={styles.sidebarLinkBox}>
    <Text style={styles.sidebarLinkText}>{title}</Text>
  </TouchableOpacity>
);

const SidebarItem = ({ icon, title }) => (
  <TouchableOpacity style={styles.sidebarItem}>
    <Ionicons name={icon} size={20} color="#fff" style={{ marginRight: 15 }} />
    <Text style={styles.sidebarItemText}>{title}</Text>
  </TouchableOpacity>
);

const TabIcon = ({ icon, label, active }) => (
  <TouchableOpacity style={styles.tabItem}>
    <Ionicons name={icon} size={22} color={active ? '#fff' : '#ccc'} />
    <Text style={[styles.tabLabel, { color: active ? '#fff' : '#ccc' }]}>{label}</Text>
  </TouchableOpacity>
);

const accountLabelStyle = { color: '#fff', fontSize: 13, fontWeight: 'bold', marginBottom: 15, marginTop: 20 };