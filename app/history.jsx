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

// ✅ MISSION POINT COMPONENT
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

// ✅ GRADUATE ATTRIBUTE ITEM
const GraduateAttribute = ({ text, color }) => {
  const { scaleAnim, pressIn, pressOut } = usePressAnimation();
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <View style={styles.graduateItem}>
        <View style={[styles.graduateBullet, { backgroundColor: color }]} />
        <Text style={styles.graduateText}>{text}</Text>
      </View>
    </Animated.View>
  );
};

// ✅ MAGAZINE CARD
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
      icon: 'medal-outline',
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

  // ✅ GRADUATE ATTRIBUTES DATA
  const graduateAttributes = [
    'Christ-centered',
    'Persistent in searching for the Truth',
    'Life-giving communicator of truth and love',
    'Creator of communion',
    'Transformative servant-leader',
    'Creative steward of God\'s creation',
  ];

  // ✅ INSTITUTIONAL OBJECTIVES - COMPLETE (7 items)
  const institutionalObjectives = [
    'To develop a self-directed Filipino who is committed to building the community where he/she lives, promoting Christ\'s love to attain the Ultimate Goal - God.',
    'To acquire fundamental knowledge, values and attitudes, habits and skills in language and arts, science, health, social studies, mathematics, music, technology and livelihood education and their intelligent application in appropriate life situations.',
    'To promote harmonious development of one\'s powers and talents, for the realization of a pure, faithful, inviolate conscience and hence lead a holy life.',
    'To foster in the academic community a sound spiritual life through religious instruction, personal guidance, encouragement to frequent the Sacraments and regular participation at Holy Mass.',
    'To train the citizens in the exercise of their rights, duties, and responsibilities in a democratic society and for active participation in a progressive and productive home and community life by providing a situation for a well-rounded development of a man as a person and as a member of society, to develop moral character, personal discipline, civic conscience, vocational efficiency and to teach the duties of citizenship.',
    'To provide an environment that will help the academic community develop into well-balanced citizens who are prepared to take their place as individuals and as members of their respective social groups or community in a democratic society.',
    'To develop basic understanding about Philippine culture, the desirable traditions and virtues of our people as essential requisite in attaining national consciousness and solidarity.'
  ];

  return (
    <ImageBackground source={require('../assets/images/cc.jpg')} style={styles.container}>
      <View style={styles.overlay}>
        <Animated.View style={{ opacity: headerAnim, transform: [{ translateY: headerSlide }] }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/home')}>
              <Ionicons name="menu-outline" size={32} color="#fff" />
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
              <Text style={styles.highlightText}>Consolatrix College of Toledo City, Inc.</Text> was established in 1961 by the Augustinian Recollect Sisters (A.R.) following a heartfelt invitation from the local clergy to provide a religious and moral foundation for the youth of Toledo City.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 15 }]}>
              Starting with a pioneering class of only <Text style={styles.highlightText}>129 students</Text>, the institution has evolved into a comprehensive educational center offering <Text style={styles.highlightText}>K-12 and tertiary programs</Text>. Today, CCTC stands as a beacon of quality Catholic education in the region.
            </Text>
            <ImageCarousel images={HERITAGE_IMAGES} />
          </MagazineCard>

          {/* ✅ CARD 2: HISTORICAL BACKGROUND - FULL VERSION */}
          <MagazineCard accentColor="#0D3E86" delay={100}>
            <View style={styles.magazineHeader}>
              <View style={[styles.magazineTag, { backgroundColor: '#0D3E86' }]}>
                <Text style={styles.magazineTagText}>OUR STORY</Text>
              </View>
              <Text style={styles.magazineTitle}>Historical Background</Text>
            </View>
            <View style={[styles.magazineDivider, { backgroundColor: '#0D3E86' }]} />
            
            <Text style={styles.magazineBodyText}>
              Consolatrix College of Toledo City, Inc., formerly known as Consolatrix Academy is a Catholic institution owned and managed by the Congregation of the Augustinian Recollect Sisters. Its aspiration for quality education since its foundation proves its willingness to move forward as a whole school community and makes innovations in its teaching apostolate. It continually strives to provide excellent service to all its clientele.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              The school was founded as a humble response to the need of the Church through an invitation of the parish priest and of the bishop of the diocese encouraged by the parishioners to open a school for the religious and moral development of the youth in Toledo City.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              In 1958, Fr. Leonardo Arriba through the advice and guidance of Most Rev. Julio Rosales, Archbishop of Cebu, requested the Congregation of the Augustinian Recollect Sisters to undertake this noble task.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              After complying with all the requirements of the Bureau of Private Schools, classes started in June 1961, with 129 high school students. The first Superior / Principal was Sor Dolores De Sagrado Corazon, A.R.M. The school began to operate, serving the local community with the goal: "To carry out the religious and moral upliftment of the youth".
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              In 1998, Consolatrix Academy changed its name to Consolatrix College of Toledo City, Inc. having opened the College Department with the following courses with permits and recognitions: Bachelor of Elementary Education (BEED) – GR No.042 s. of 2001, Bachelor of Secondary Education (BSED), major in English and Mathematics – GR. 043 s. of 2001; and two-year course in Associate in Computer Secretarial (ACS) GR. No 279 s. of 2000.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              The following year, the ACS program was realigned to Associate in Computer Technology (ACT), which has a ladderized curriculum leading to a Bachelor of Science in Computer Science (BSCS) and Information Technology (BSIT) – GR. No 010 s. of 2011.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              Government Recognitions (GR) were likewise granted to the following courses: Bachelor of Science in Hospitality Management (BSHM) – GR. No.028 series of 2012 Major in Hotel & Restaurant Management, Bachelor of Science in Office Administration (BSOA) – GR No. 001 series of 2015 and Bachelor of Science in Entrepreneurship (BSEntrep) – GR No. 004 series of 2020.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              Considering the demand for teachers in Physical Education, the school offered the Bachelor of Physical Education (BPED) – GR No.004, series of 2022.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              In school year 2022-2023, Science was added as one of the majors for those who are taking BSED aside from English and Mathematics. The institution being K to 12 ready, was granted the Provisional Government Permit to operate Senior High School Program in 2016 offering Academic Track – ABM, STEM, HUMSS as well as Technical Vocational Livelihood Track major HE and ICT. It had its first Commencement Exercises in April 2016 with 97 graduates.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              Counting the years of its existence, the school contributes to the country's educative goal. The extent of its contribution, however, is still in the process of evaluation. To fulfill its own educational goals, it has taken seriously the situation of the Philippine Education System by blending human culture with the message of salvation. As proclaimers of the Good News of Salvation, the school and its constituents identify themselves with the less fortunate ones and distinctively witness to their charism.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              The school, as a Catholic institution, follows the Christian philosophy of education that is based on the Catholic philosophy of life and at the same time subscribes to the beliefs, the inspiration, and the educational thoughts of its founders and its institutional goals.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              With the efforts of the A.R. Sisters and lay personnel, the Basic Education Department earned the certificate from the Philippine Accrediting Association of Schools Colleges and Universities (PAASCU) in March, 2011 for the Level I Accreditation Status.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              On May 16, 2016, the school was granted a PAASCU Level II Re-accreditation status, and in September, 2022 after undergoing a resurvey, the school continues to be PAASCU Level II Accredited institution.
            </Text>
            <Text style={[styles.magazineBodyText, { marginTop: 12 }]}>
              The school continues to equip its students holistically to be competitive and socially responsive individuals.
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
              text="Fortify leadership and professional development of stakeholders through continuing education and intensive Augustinian Recollect Spirituality" 
            />
            <MissionPoint 
              num="4" 
              text="Develop a community of Christ-centered Augustinian Recollect Stewards who are environmentally caring and global leaders" 
            />
            <MissionPoint 
              num="5" 
              text="Nurture one another in the shared mission for the sustainability of the AR schools and social relevance of programs and services" 
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

          {/* ✅ CARD 6: GRADUATE ATTRIBUTES */}
          <MagazineCard accentColor="#6C63FF" delay={500}>
            <View style={styles.magazineHeader}>
              <View style={[styles.magazineTag, { backgroundColor: '#6C63FF' }]}>
                <Text style={styles.magazineTagText}>OUR GRADUATES</Text>
              </View>
              <Text style={styles.magazineTitle}>Graduate Attributes</Text>
            </View>
            <View style={[styles.magazineDivider, { backgroundColor: '#6C63FF' }]} />
            
            <Text style={styles.magazineSubtext}>
              A.R. / Consolatricians Graduate Attributes:
            </Text>
            
            {graduateAttributes.map((attribute, index) => (
              <GraduateAttribute 
                key={index} 
                text={attribute} 
                color="#6C63FF" 
              />
            ))}
          </MagazineCard>

          {/* ✅ CARD 7: SCHOOL SEAL */}
          <MagazineCard accentColor="#E31E24" delay={600}>
            <View style={styles.magazineHeader}>
              <View style={[styles.magazineTag, { backgroundColor: '#E31E24' }]}>
                <Text style={styles.magazineTagText}>OUR SYMBOL</Text>
              </View>
              <Text style={styles.magazineTitle}>The School Seal</Text>
            </View>
            <View style={[styles.magazineDivider, { backgroundColor: '#E31E24' }]} />

            <View style={styles.sealContainer}>
              <Image 
                source={require('../assets/images/logo.png')} 
                style={styles.sealLogo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.magazineSubtext}>Consolation of the Virtues</Text>
            
            <View style={styles.sealExplanation}>
              <Text style={styles.sealText}>
                <Text style={styles.sealHighlight}>The Shield:</Text> Bears the national colors: red, white, and blue, indicating that the institution is genuinely Filipino and to express "PATRIA" field of the shield.
              </Text>
              <Text style={styles.sealText}>
                <Text style={styles.sealHighlight}>The Cross:</Text> Occupies the center of the shield, symbolizing the missionary character of the Congregation of the Augustinian Recollect Sisters.
              </Text>
              <Text style={styles.sealText}>
                <Text style={styles.sealHighlight}>The Bible and the Flaming Heart:</Text> On the right side of the shield is the emblem of the Congregation of the Augustinian Recollect Sisters.
              </Text>
              <Text style={styles.sealText}>
                <Text style={styles.sealHighlight}>The Rose:</Text> On the left side of the shield are the attributes of the Blessed Virgin Mary.
              </Text>
              <Text style={styles.sealText}>
                <Text style={styles.sealHighlight}>Virtus et Scientia:</Text> Indicates the two-fold objectives of the school: Virtue and knowledge which characterize a true Catholic Education.
              </Text>
              <Text style={styles.sealText}>
                <Text style={styles.sealHighlight}>The Outer Rim:</Text> Contains the school's name and location.
              </Text>
            </View>
          </MagazineCard>

          {/* ✅ CARD 8: INSTITUTIONAL OBJECTIVES - COMPLETE */}
          <MagazineCard accentColor="#FF6B35" delay={700}>
            <View style={styles.magazineHeader}>
              <View style={[styles.magazineTag, { backgroundColor: '#FF6B35' }]}>
                <Text style={styles.magazineTagText}>OUR GOALS</Text>
              </View>
              <Text style={styles.magazineTitle}>Institutional Objectives</Text>
            </View>
            <View style={[styles.magazineDivider, { backgroundColor: '#FF6B35' }]} />
            
            {institutionalObjectives.map((objective, index) => (
              <View key={index} style={styles.objectiveItem}>
                <View style={[styles.objectiveNumber, { backgroundColor: '#FF6B35' }]}>
                  <Text style={styles.objectiveNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.objectiveText}>{objective}</Text>
              </View>
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