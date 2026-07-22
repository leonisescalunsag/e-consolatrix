import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, 
  Image, FlatList, Dimensions, Modal, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/VirtualTourStyles';

const { width } = Dimensions.get('window');

// ✅ ROOMS DATA - Simple Panorama Images
const ROOMS = [
  {
    id: '1',
    name: 'Audio-Visual Room (AVR)',
    category: 'Facilities',
    description: 'A fully-equipped audio-visual room for school presentations, seminars, and events.',
    image: require('../../assets/images/avr1.jpg'),
    icon: 'videocam-outline',
    color: '#FF6B35',
  },
  {
    id: '2',
    name: 'School Library',
    category: 'Facilities',
    description: 'A peaceful, air-conditioned library with a vast collection of books and research materials.',
    image: require('../../assets/images/library.jpg'),
    icon: 'library-outline',
    color: '#0D3E86',
  },
  {
    id: '3',
    name: 'School Chapel',
    category: 'Facilities',
    description: 'A sacred space for prayer, reflection, and spiritual activities.',
    image: { uri: 'https://via.placeholder.com/800x400/FFD700/000000?text=Chapel' },
    icon: 'church-outline',
    color: '#FFD700',
  },
  {
    id: '4',
    name: 'Computer Lab 101',
    category: 'Laboratories',
    description: 'A modern computer laboratory equipped with the latest computers and software.',
    image: require('../../assets/images/lab2.jpg'),
    icon: 'desktop-outline',
    color: '#1E90FF',
  },
  {
    id: '5',
    name: 'Computer Lab 102',
    category: 'Laboratories',
    description: 'Another well-equipped computer lab for programming and IT training.',
    image: require('../../assets/images/lab2.jpg'),
    icon: 'laptop-outline',
    color: '#32CD32',
  },
  {
    id: '6',
    name: 'Computer Lab 103',
    category: 'Laboratories',
    description: 'A specialized computer lab for research and multimedia projects.',
    image: { uri: 'https://via.placeholder.com/800x400/8A2BE2/FFFFFF?text=Comp+Lab+103' },
    icon: 'hardware-chip-outline',
    color: '#8A2BE2',
  },
  {
    id: '7',
    name: 'Covered Court',
    category: 'Sports',
    description: 'A spacious covered court for basketball, volleyball, and school events.',
    image: require('../../assets/images/court.jpg'),
    icon: 'basketball-outline',
    color: '#FF4500',
  },
  {
    id: '8',
    name: 'CCTC Grounds',
    category: 'Outdoor',
    description: 'Beautifully landscaped school grounds with gardens and open spaces.',
    image: require('../../assets/images/ground.jpg'),
    icon: 'leaf-outline',
    color: '#32CD32',
  },
  {
    id: '9',
    name: 'HRM Building',
    category: 'Facilities',
    description: 'Hospitality Management building with training facilities and demo kitchens.',
    image: { uri: 'https://via.placeholder.com/800x400/FFD700/000000?text=HRM+Building' },
    icon: 'restaurant-outline',
    color: '#FFD700',
  },
  {
    id: '10',
    name: 'High School Laboratory',
    category: 'Laboratories',
    description: 'Science and computer laboratories for high school students.',
    image: { uri: 'https://via.placeholder.com/800x400/FF6B35/FFFFFF?text=HS+Lab' },
    icon: 'flask-outline',
    color: '#FF6B35',
  },
  {
    id: '11',
    name: 'School Canteen',
    category: 'Facilities',
    description: 'A clean and comfortable canteen serving quality food for students and staff.',
    image: { uri: 'https://via.placeholder.com/800x400/FFA500/FFFFFF?text=Canteen' },
    icon: 'fast-food-outline',
    color: '#FFA500',
  },
  {
    id: '12',
    name: 'Student Lounge',
    category: 'Facilities',
    description: 'A comfortable lounge for students to relax, study, or socialize.',
    image: { uri: 'https://via.placeholder.com/800x400/0D3E86/FFFFFF?text=Student+Lounge' },
    icon: 'cafe-outline',
    color: '#0D3E86',
  },
  {
    id: '13',
    name: 'Parents Lounge',
    category: 'Facilities',
    description: 'A cozy waiting area for parents and guardians.',
    image: { uri: 'https://via.placeholder.com/800x400/8B0000/FFFFFF?text=Parents+Lounge' },
    icon: 'people-outline',
    color: '#8B0000',
  },
  {
    id: '14',
    name: 'School Clinic',
    category: 'Facilities',
    description: 'A well-equipped clinic with a school nurse for health concerns and emergencies.',
    image: { uri: 'https://via.placeholder.com/800x400/DC143C/FFFFFF?text=Clinic' },
    icon: 'medkit-outline',
    color: '#DC143C',
  },

  
];

// ✅ ROOM CARD
const RoomCard = ({ room, onPress }) => {
  return (
    <TouchableOpacity style={styles.roomCard} onPress={onPress} activeOpacity={0.9}>
      <Image source={room.image} style={styles.roomImage} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.roomOverlay}
      />
      <View style={styles.roomInfo}>
        <View style={[styles.roomIcon, { backgroundColor: room.color + '20' }]}>
          <Ionicons name={room.icon} size={20} color={room.color} />
        </View>
        <Text style={styles.roomName} numberOfLines={1}>{room.name}</Text>
        <View style={[styles.roomBadge, { backgroundColor: room.color + '20' }]}>
          <Text style={[styles.roomBadgeText, { color: room.color }]}>
            {room.category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ✅ ROOM DETAIL MODAL - SIMPLE PANORAMA VIEW
const RoomDetailModal = ({ visible, room, onClose }) => {
  if (!room) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Simple Image Viewer */}
          <Image source={room.image} style={styles.modalImage} resizeMode="cover" />
          
          {/* Room Details */}
          <View style={styles.modalDetails}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIcon, { backgroundColor: room.color + '20' }]}>
                <Ionicons name={room.icon} size={24} color={room.color} />
              </View>
              <Text style={styles.modalName}>{room.name}</Text>
              <View style={[styles.modalBadge, { backgroundColor: room.color + '20' }]}>
                <Text style={[styles.modalBadgeText, { color: room.color }]}>
                  {room.category}
                </Text>
              </View>
            </View>
            <Text style={styles.modalDescription}>{room.description}</Text>
            
            {/* Panorama Indicator */}
            <View style={styles.panoramaIndicator}>
              <Ionicons name="image-outline" size={20} color="#0D3E86" />
              <Text style={styles.panoramaIndicatorText}>Panorama View</Text>
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

  const filteredRooms = selectedCategory === 'All'
    ? ROOMS
    : ROOMS.filter(r => r.category === selectedCategory);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
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
      {/* ✅ UPDATED HEADER - Campus Tour */}
      <LinearGradient
        colors={['#0D3E86', '#1A5CB5']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerEmoji}>🏫</Text>
          <Text style={styles.headerTitle}>Campus Tour</Text>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* Category Filters */}
      <View style={styles.categoryWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ✅ UPDATED SUBTITLE */}
      <View style={styles.subtitleWrapper}>
        <Text style={styles.subtitle}>
          Discover the facilities of{' '}
          <Text style={styles.subtitleHighlight}>Consolatrix College</Text>
        </Text>
      </View>

      {/* Rooms Grid */}
      <FlatList
        data={filteredRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoomCard 
            room={item} 
            onPress={() => setSelectedRoom(item)}
          />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />

      {/* Room Detail Modal */}
      <RoomDetailModal
        visible={selectedRoom !== null}
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </View>
  );
}