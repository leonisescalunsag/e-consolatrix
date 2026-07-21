import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  ImageBackground, Image, Animated, Dimensions, 
  Modal, TouchableWithoutFeedback 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../styles/HistoryStyles';
import { useFadeIn, useSlideUp, usePressAnimation } from '../hooks/useSlideAnimation';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// ✅ SCHOOL IMAGES FOR CAROUSEL
const HERITAGE_IMAGES = [
  { id: '1', image: require('../assets/images/sis8.jpg')},
  { id: '2', image: require('../assets/images/sis10.jpg') },
  { id: '3', image: require('../assets/images/sis9.jpg') },
  { id: '4', image: require('../assets/images/sis11.jpg')},
  { id: '5', image: require('../assets/images/sis1.jpg') },
  { id: '6', image: require('../assets/images/sis2.jpg')  },
   { id: '7', image: require('../assets/images/sis3.jpg')  },
  { id: '8', image: require('../assets/images/sis4.jpg') },
  { id: '9', image: require('../assets/images/sis5.jpg') },
  { id: '10', image: require('../assets/images/sis6.jpg') },
  { id: '11', image: require('../assets/images/sis7.jpg') },
];

const MissionPoint = ({ num, text }) => {
  const { scaleAnim, pressIn, pressOut } = usePressAnimation();
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <View style={styles.missionItem}>
        <View style={styles.missionNumber}>
          <Text style={styles.missionNumberText}>{num}</Text>
        </View>
        <Text style={styles.missionText}>{text}</Text>
      </View>
    </Animated.View>
  );
};

// ✅ CORE VALUE CARD
const CoreValueCard = ({ icon, title, description, color }) => {
  const { scaleAnim, pressIn, pressOut } = usePressAnimation();
  const fadeAnim = useFadeIn(400);
  
  return (
    <Animated.View style={{ 
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }] 
    }}>
      <TouchableOpacity 
        style={[styles.coreValueCard, { borderLeftColor: color }]}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={0.9}
      >
        <View style={[styles.coreValueIcon, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.coreValueContent}>
          <Text style={styles.coreValueTitle}>{title}</Text>
          <Text style={styles.coreValueDesc}>{description}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ✅ Magazine Card Component
const MagazineCard = ({ children, accentColor, delay = 0 }) => {
  const fadeAnim = useFadeIn(600, delay);
  const slideAnim = useSlideUp(40);

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }]
    }}>
      <View style={[styles.magazineCard, { borderTopColor: accentColor }]}>
        {children}
      </View>
    </Animated.View>
  );
};

// ✅ IMAGE CAROUSEL
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const scrollViewRef = useRef(null);
  const autoSlideInterval = useRef(null);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [containerWidth, setContainerWidth] = useState(width - 70);
  const [isScrolling, setIsScrolling] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [currentIndex]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const startAutoSlide = () => {
    if (autoSlideInterval.current) clearInterval(autoSlideInterval.current);
    autoSlideInterval.current = setInterval(() => {
      if (isAutoSliding && !isScrolling) {
        const nextIndex = (currentIndex + 1) % images.length;
        goToSlide(nextIndex);
      }
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
      autoSlideInterval.current = null;
    }
  };

  const goToSlide = (index) => {
    if (index < 0) index = 0;
    if (index >= images.length) index = images.length - 1;
    
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * containerWidth,
      animated: true,
    });
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / containerWidth);
    if (index !== currentIndex && index >= 0 && index < images.length) {
      setCurrentIndex(index);
      setIsScrolling(true);
    }
  };

  const handleMomentumScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / containerWidth);
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
      setIsScrolling(false);
    }
  };

  const openImageViewer = (image) => {
    setSelectedImage(image);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <View 
        style={styles.carouselContainer}
        onLayout={(event) => {
          const { width: newWidth } = event.nativeEvent.layout;
          setContainerWidth(newWidth);
        }}
      >
        <View style={styles.imageCounter}>
          <Text style={styles.imageCounterText}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            onTouchStart={() => setIsAutoSliding(false)}
            onTouchEnd={() => {
              setIsAutoSliding(true);
              startAutoSlide();
            }}
            scrollEventThrottle={16}
            style={styles.carouselScroll}
          >
            {images.map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.carouselSlide, { width: containerWidth }]}
                onPress={() => openImageViewer(item)}
                activeOpacity={0.95}
              >
                <Image 
                  source={item.image} 
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.carouselGradient}
                  locations={[0.5, 1]}
                />
                <View style={styles.carouselCaptionContainer}>
                  <View style={styles.carouselCaptionWrapper}>
                    <Ionicons name="location-outline" size={14} color="#fff" />
                    <Text style={styles.carouselCaption}>{item.caption || 'CCTC Heritage'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <View style={styles.carouselDots}>
          {images.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.carouselDot,
                currentIndex === index && styles.carouselDotActive
              ]}
              onPress={() => goToSlide(index)}
            />
          ))}
        </View>
      </View>

      {/* Image Viewer Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageViewer}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={40} tint="dark" style={styles.blurBackground} />
          <TouchableOpacity style={styles.closeButton} onPress={closeImageViewer}>
            <Ionicons name="close-circle" size={44} color="#fff" />
          </TouchableOpacity>
          <View style={styles.imageViewerContainer}>
            {selectedImage && (
              <>
                <Image 
                  source={selectedImage.image} 
                  style={styles.imageViewer}
                  resizeMode="contain"
                />
                <View style={styles.imageViewerFooter}>
                  <Ionicons name="location-outline" size={18} color="#0D3E86" />
                  <Text style={styles.imageViewerCaption}>{selectedImage.caption || 'CCTC Heritage'}</Text>
                </View>
              </>
            )}
          </View>
          <TouchableWithoutFeedback onPress={closeImageViewer}>
            <View style={styles.modalTouchArea} />
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </>
  );
};

// ✅ MAIN COMPONENT
export default function HistoryScreen() {
  const router = useRouter();
  const headerAnim = useFadeIn(600);
  const headerSlide = useSlideUp(-20);
  const tabAnim = useSlideUp(100);

  // ✅ CORE VALUES DATA
  const coreValues = [
    {
      icon: 'cross-outline',
      title: 'Christ-centered',
      description: 'Putting faith and values at the core of all endeavors, guided by the teachings of Jesus Christ.',
      color: '#E31E24',
    },
    {
      icon: 'people-outline',
      title: 'Augustinian Recollect Steward',
      description: 'Embracing the charism of the Augustinian Recollect Sisters by being responsible, caring, and compassionate stewards.',
      color: '#0D3E86',
    },
    {
      icon: 'heart-outline',
      title: 'Charity',
      description: 'Acting with love, kindness, and generosity towards others, embodying the virtue of Christian charity.',
      color: '#FF6B35',
    },
    {
      icon: 'hand-left-outline',
      title: 'Compassion',
      description: 'Showing empathy, understanding, and care for others, especially those in need.',
      color: '#32CD32',
    },
    {
      icon: 'flag-outline',
      title: 'Tenacity',
      description: 'Demonstrating perseverance, determination, and resilience in the face of challenges.',
      color: '#FFD700',
    },
    {
      icon: 'ribbon-outline',
      title: 'Commitment',
      description: 'Being dedicated, loyal, and faithful to one\'s duties, responsibilities, and the mission of the institution.',
      color: '#8B0000',
    },
  ];

  return (
    <ImageBackground source={require('../assets/images/cc.jpg')} style={styles.container}>
      <View style={styles.overlay}>
        <Animated.View style={{ opacity: headerAnim, transform: [{ translateY: headerSlide }] }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/home')}>
              <Ionicons name="arrow-back" size={32} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Our Story</Text>
            <TouchableOpacity onPress={() => router.push('/news')}>
              <Ionicons name="notifications-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* ✅ CARD 1: OUR HERITAGE */}
          <MagazineCard accentColor="#E31E24" delay={0}>
            <View style={styles.magazineHeader}>
              <View style={styles.magazineTag}>
                <Text style={styles.magazineTagText}>EST. 1961</Text>
              </View>
              <Text style={styles.magazineTitle}>Our Heritage</Text>
            </View>
            
            <View style={styles.magazineDivider} />
            
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/logo.png')} 
                style={styles.schoolLogo}
                resizeMode="contain"
              />
            </View>
            
            <Text style={styles.magazineBodyText}>
              <Text style={styles.highlightText}>Consolatrix College of Toledo City, Inc. (CCTC)</Text> was established in 1961 by the Augustinian Recollect Sisters (A.R.) following a heartfelt invitation from the local clergy to provide a religious and moral foundation for the youth of Toledo City.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 15 }]}>
              Starting with a pioneering class of only <Text style={styles.highlightText}>129 students</Text>, the institution has evolved into a comprehensive educational center offering <Text style={styles.highlightText}>K-12 and tertiary programs</Text>. Today, CCTC stands as a beacon of quality Catholic education in the region.
            </Text>
            
            <ImageCarousel images={HERITAGE_IMAGES} />
          </MagazineCard>

          {/* ✅ CARD 2: SCHOOL HISTORY (NEW - after Heritage) */}
          <MagazineCard accentColor="#0D3E86" delay={100}>
            <View style={styles.magazineHeader}>
              <View style={[styles.magazineTag, { backgroundColor: '#0D3E86' }]}>
                <Text style={styles.magazineTagText}>OUR JOURNEY</Text>
              </View>
              <Text style={styles.magazineTitle}>School History</Text>
            </View>
            <View style={[styles.magazineDivider, { backgroundColor: '#0D3E86' }]} />
            
            <Text style={styles.magazineBodyText}>
              <Text style={styles.highlightText}>1961:</Text> Consolatrix College of Toledo City was founded by the Augustinian Recollect Sisters with 129 pioneering students.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              <Text style={styles.highlightText}>1970s-1980s:</Text> The institution expanded its academic offerings, introducing new programs to meet the growing needs of the community.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              <Text style={styles.highlightText}>1990s:</Text> CCTC achieved recognition as a leading educational institution in the region, known for its commitment to excellence and values formation.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              <Text style={styles.highlightText}>2000s-Present:</Text> The college continues to innovate, offering K-12 programs, college courses, and community extension services. Today, CCTC remains dedicated to its mission of transforming learners into Christ-centered Augustinian Recollect Stewards.
            </Text>
          </MagazineCard>

          {/* ✅ CARD 3: VISION */}
          <MagazineCard accentColor="#FFD700" delay={200}>
            <View style={styles.magazineHeader}>
              <View style={[styles.magazineTag, { backgroundColor: '#FFD700' }]}>
                <Text style={[styles.magazineTagText, { color: '#0D3E86' }]}>OUR GOAL</Text>
              </View>
              <Text style={styles.magazineTitle}>Vision</Text>
            </View>
            <View style={[styles.magazineDivider, { backgroundColor: '#FFD700' }]} />
            
            <Text style={styles.magazineBodyText}>
              Consolatrix College of Toledo City, Inc. envisions a life-giving and innovating education ministry committed to transforming community of learners into <Text style={styles.highlightText}>Christ-centered Augustinian Recollect Stewards</Text>.
            </Text>
          </MagazineCard>

          {/* ✅ CARD 4: MISSION */}
          <MagazineCard accentColor="#32CD32" delay={300}>
            <View style={styles.magazineHeader}>
              <View style={[styles.magazineTag, { backgroundColor: '#32CD32' }]}>
                <Text style={[styles.magazineTagText, { color: '#fff' }]}>OUR PURPOSE</Text>
              </View>
              <Text style={styles.magazineTitle}>Mission</Text>
            </View>
            <View style={[styles.magazineDivider, { backgroundColor: '#32CD32' }]} />
            
            <Text style={styles.magazineSubtext}>
              Consolatrix College of Toledo City, Inc. mission is to:
            </Text>
            
            <MissionPoint 
              num="1" 
              text="Strengthen fraternal charity through God-filled friendship and renewed evangelization" 
            />
            <MissionPoint 
              num="2" 
              text="Facilitate the integral development of the learners towards transformation through current researches, relevant curricular offerings and responsive community extension services" 
            />
            <MissionPoint 
              num="3" 
              text="Fortify leadership and professional development of stakeholders through continuing education and intensive Augustinian Recollect spirituality" 
            />
            <MissionPoint 
              num="4" 
              text="Develop a community of Christ-centered Augustinian Recollect Stewards who are environmentally caring and global leaders" 
            />
            <MissionPoint 
              num="5" 
              text="Nurture one another in the shared mission for the sustainability of the AR, school and social relevance of programs and services" 
            />
          </MagazineCard>

          {/* ✅ CARD 5: CORE VALUES */}
          <MagazineCard accentColor="#8B0000" delay={400}>
            <View style={styles.magazineHeader}>
              <View style={[styles.magazineTag, { backgroundColor: '#8B0000' }]}>
                <Text style={styles.magazineTagText}>OUR IDENTITY</Text>
              </View>
              <Text style={styles.magazineTitle}>Core Values</Text>
            </View>
            <View style={[styles.magazineDivider, { backgroundColor: '#8B0000' }]} />
            
            <Text style={styles.magazineSubtext}>
              The <Text style={styles.highlightText}>CARS</Text> values that guide the CCTC community:
            </Text>
            
            {coreValues.map((value, index) => (
              <CoreValueCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
                color={value.color}
              />
            ))}
          </MagazineCard>

        </ScrollView>

        <Animated.View style={[styles.bottomTab, { transform: [{ translateY: tabAnim }] }]}>
          <TabIcon icon="home-outline" label="Home" onPress={() => router.push('/home')} />
          <TabIcon icon="time" label="School" active onPress={() => router.push('/history')} />
          <TabIcon icon="school-outline" label="Courses" onPress={() => router.push('/courses')} />
          <TabIcon icon="people-outline" label="Teacher" onPress={() => router.push('/teachers')} />
          <TabIcon icon="book-outline" label="Rules" onPress={() => router.push('/rules')} />
          <TabIcon icon="newspaper-outline" label="News" onPress={() => router.push('/news')} />
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

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