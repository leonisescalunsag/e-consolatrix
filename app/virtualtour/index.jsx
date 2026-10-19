import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, 
  FlatList, Dimensions, Modal, ActivityIndicator, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import YoutubePlayer from 'react-native-youtube-iframe'; 
import { styles } from '../../styles/VirtualTourStyles';

const { width } = Dimensions.get('window');

// ✅ KUMPLETONG DATA (Naka-Youtube IDs na lahat)
const ROOMS = [
  { id: '1', name: 'Audio-Visual Room (AVR)', category: 'Facilities', description: 'A fully-equipped audio-visual room for school presentations, seminars, and events.', youtubeId: 'GoTp0NyR_q4', icon: 'videocam-outline', color: '#FF6B35' },
  { id: '2', name: 'School Library', category: 'Facilities', description: 'A peaceful, air-conditioned library with a vast collection of books and research materials.', youtubeId: 'ZBuG3BE42T8', icon: 'library-outline', color: '#0D3E86' },
  { id: '3', name: 'School Chapel', category: 'Facilities', description: 'A sacred space for prayer, reflection, and spiritual activities.', youtubeId: 'lVIvavddvQ8', icon: 'business-outline', color: '#FFD700' },
  { id: '4', name: 'Computer Laboratory', category: 'Laboratories', description: 'A modern computer laboratory equipped with the latest computers and software.', youtubeId: 'tvakaC099wM', icon: 'desktop-outline', color: '#1E90FF' },
  { id: '5', name: 'Covered Court', category: 'Sports', description: 'A spacious covered court for basketball, volleyball, and school events.', youtubeId: 'lgUa1SAZycI', icon: 'basketball-outline', color: '#FF4500' },
  { id: '6', name: 'CCTC Garden', category: 'Outdoor', description: 'Beautifully landscaped gardens and open spaces.', youtubeId: 'qVRzydHuo6M', icon: 'leaf-outline', color: '#32CD32' },
  { id: '7', name: 'CCTC Grounds', category: 'Outdoor', description: 'The main grounds of Consolatrix College.', youtubeId: 'OcxnSn0bk6A', icon: 'map-outline', color: '#20B2AA' },
  { id: '8', name: 'Guidance Office', category: 'Facilities', description: 'A welcoming space for student counseling and guidance services.', youtubeId: 'f4obYywIoTQ', icon: 'heart-outline', color: '#FF69B4' },
  { id: '9', name: 'HRM Building', category: 'Facilities', description: 'Hospitality Management building with training facilities and demo kitchens.', youtubeId: '10qOs7g4890', icon: 'restaurant-outline', color: '#FFD700' },
  { id: '10', name: 'High School Laboratory', category: 'Laboratories', description: 'Science and computer laboratories for high school students.', youtubeId: 'J00gN-IaOV8', icon: 'flask-outline', color: '#FF6B35' },
  { id: '11', name: 'School Canteen', category: 'Facilities', description: 'A clean and comfortable canteen serving quality food for students and staff.', youtubeId: 'IytPd5UtLAM', icon: 'fast-food-outline', color: '#FFA500' },
  { id: '12', name: 'Student Lounge', category: 'Facilities', description: 'A comfortable lounge for students to relax, study, or socialize.', youtubeId: 'BM6Y7Vyxnaw', icon: 'cafe-outline', color: '#0D3E86' },
  { id: '13', name: 'School Clinic', category: 'Facilities', description: 'A well-equipped clinic with a school nurse for health concerns and emergencies.', youtubeId: 'ywJpyxBAOeA', icon: 'medkit-outline', color: '#DC143C' },
  { id: '14', name: 'Parents Lounge', category: 'Facilities', description: 'A cozy waiting area for parents and guardians.', youtubeId: 'zAHvu1IZf4c', icon: 'people-outline', color: '#8B0000' },
  { id: '15', name: 'Admin Offices', category: 'Facilities', description: 'Offices for the Principal, Registrar, Treasurer, and Faculty.', youtubeId: 'v0_F3BdbN-k', icon: 'briefcase-outline', color: '#8B0000' },
];

// ✅ ROOM CARD (Kinukuha ang Thumbnail mula sa YouTube)
const RoomCard = ({ room, onPress }) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${room.youtubeId}/hqdefault.jpg`;

  return (
    <TouchableOpacity style={styles.roomCard} onPress={onPress} activeOpacity={0.9}>
      
      <Image 
        source={{ uri: thumbnailUrl }} 
        style={styles.roomImage} 
        resizeMode="cover"
      />
      
      <View style={styles.cardDarkOverlay} />

      {/* Play Icon sa gitna */}
      <View style={styles.playIconContainer}>
        <Ionicons name="play" size={20} color="#fff" />
      </View>

      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.roomOverlay} />
      
      <View style={styles.roomInfo}>
        <View style={[styles.roomIcon, { backgroundColor: room.color + '20' }]}>
          <Ionicons name={room.icon} size={20} color={room.color} />
        </View>
        <Text style={styles.roomName} numberOfLines={1}>{room.name}</Text>
        <View style={[styles.roomBadge, { backgroundColor: room.color + '20' }]}>
          <Text style={[styles.roomBadgeText, { color: room.color }]}>{room.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ✅ VIDEO PLAYER MODAL (YouTube)
const RoomDetailModal = ({ visible, room, onClose }) => {
  if (!room) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          
          <View style={styles.videoWrapper}>
            <YoutubePlayer
              height={250}
              play={visible} // Autoplay pagbukas
              videoId={room.youtubeId}
              initialPlayerParams={{
                cc_load_policy: false,
                rel: 0, // Hindi magpapakita ng related videos
                controls: 1,
                modestbranding: 1, // Tinatago ang YouTube logo
                preventFullScreen: false, // Papayagan i-fullscreen
              }}
            />
            
            <TouchableOpacity style={styles.modalClose} onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalDetails}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIcon, { backgroundColor: room.color + '20' }]}>
                <Ionicons name={room.icon} size={24} color={room.color} />
              </View>
              <Text style={styles.modalName}>{room.name}</Text>
            </View>
            
            <Text style={styles.modalDescription}>{room.description}</Text>
            
            <View style={styles.panoramaIndicator}>
              <Ionicons name="walk-outline" size={20} color="#0D3E86" />
              <Text style={styles.panoramaIndicatorText}>POV Walking Tour</Text>
            </View>
          </View>

        </View>
      </View>
    </Modal>
  );
};

// ✅ MAIN COMPONENT
export default function VirtualTourScreen() {
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Facilities', 'Laboratories', 'Sports', 'Outdoor'];
  const filteredRooms = selectedCategory === 'All' ? ROOMS : ROOMS.filter(r => r.category === selectedCategory);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D3E86" />
        <Text style={styles.loadingText}>Loading campus tour...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={['#0D3E86', '#1A5CB5']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerEmoji}>🏫</Text>
          <Text style={styles.headerTitle}>Campus Tour</Text>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* CATEGORY FILTERS */}
      <View style={styles.categoryWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat} style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]} onPress={() => setSelectedCategory(cat)}>
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* SUBTITLE */}
      <View style={styles.subtitleWrapper}>
        <Text style={styles.subtitle}>
          Discover the facilities of{' '}
          <Text style={styles.subtitleHighlight}>Consolatrix College</Text>
        </Text>
      </View>

      {/* ROOMS GRID */}
      <FlatList
        data={filteredRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoomCard room={item} onPress={() => setSelectedRoom(item)} />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />

      {/* MODAL */}
      <RoomDetailModal visible={selectedRoom !== null} room={selectedRoom} onClose={() => setSelectedRoom(null)} />
    </View>
  );
}