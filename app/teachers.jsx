import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, Image, ImageBackground, ScrollView, 
  TouchableOpacity, Animated, Dimensions, Modal, Pressable 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { styles } from '../styles/TeacherStyles';
import { useFadeIn, useSlideUp, usePressAnimation } from '../hooks/useSlideAnimation';

const { width, height } = Dimensions.get('window');

// ✅ DEFAULT HARDCODED DATA (Base list)
const DEFAULT_TEACHERS = {
  arSisters: {
    name: 'AR Sisters', icon: 'star-outline', color: '#D4AF37', sectionLabel: '👥 ADMINISTRATION',
    programHead: { 
      name: 'Sr. Josephine D. Ativo, A.R. Ph.D.EM', 
      position: 'School President', 
      image: require('../assets/images/TEACHERS/AR SISTERS/SR. JOSEPHINE ATIVO.jpg') 
    },
    teachers: [
      { name: 'Sr. Luzviminda C. Escal, A.R.', position: 'School Assistant Principal', image: require('../assets/images/TEACHERS/AR SISTERS/SR. LUZVIMINDA C. ESCAL.jpg') },
      { name: 'Sr. Yvette T. Galabo, A.R.', position: 'School Treasurer', image: require('../assets/images/TEACHERS/AR SISTERS/SR. YVETTE T. GALABO.jpg') },
      { name: 'Sr. Adelina M. Reyes, A.R.', position: 'School Registrar', image: require('../assets/images/TEACHERS/AR SISTERS/SR. ADELINA M. REYES.jpg') },
      { name: 'Sr. Ginger L. Acosta, A.R.', position: 'Administrator', image: require('../assets/images/TEACHERS/AR SISTERS/SR. GINGER L. ACOSTA.jpg') },
    ],
  },
  bsit: {
    name: 'BSIT Department', icon: 'desktop-outline', color: '#0D3E86', sectionLabel: '👥 TEACHERS',
    programHead: { name: 'Mr. Procorro Gonzaga', position: 'CCS Program Head', image: require('../assets/images/TEACHERS/IT DEPT/Procorro Gonzaga.jpg') },
    teachers: [
      { name: 'Mr. Daniel Bert Uy', position: 'Full time - IT Dept.', image: require('../assets/images/TEACHERS/IT DEPT/Daniel Bert Uy.jpg') },
      { name: 'Mr. Kenneth Jimenez', position: 'Full time - IT Dept.', image: require('../assets/images/TEACHERS/IT DEPT/Kenneth Jimenez.jpg') },
      { name: 'Ms. Mitchille Cabigas', position: 'Full time - IT Dept.', image: require('../assets/images/TEACHERS/IT DEPT/Mitchille Cabigas.jpg') },
      { name: 'Mr. Leonie Cecil Uy', position: 'Full time - IT Dept.', image: require('../assets/images/TEACHERS/IT DEPT/Leonie Cecil Uy.jpg') },
      { name: 'Mr. Mauril Alferez', position: 'Full time - IT Dept.', image: require('../assets/images/TEACHERS/IT DEPT/Mauril Alferez.jpg') },
      { name: 'Mr. Reynard Abendan', position: 'Full time - IT Dept.', image: require('../assets/images/TEACHERS/IT DEPT/Reynard Abendan.jpg') },
      { name: 'Mr. John Neilzen Canonigo', position: 'Full time - IT Dept.', image: require('../assets/images/TEACHERS/IT DEPT/John Neilzen Canonigo.jpg') },
    ],
  },
  educDept: {
    name: 'Education Department', icon: 'school-outline', color: '#FF6B35', sectionLabel: '👥 TEACHERS',
    programHead: { name: 'Dr. Josephine Tabal', position: 'Education Program Head', image: require('../assets/images/TEACHERS/EDUC DEPT/Josephine Tabal.jpg') },
    teachers: [
      { name: 'Mrs. Mary Leizl Dela Cruz', position: 'Student Activity Coordinator', image: require('../assets/images/TEACHERS/EDUC DEPT/Mary Liezl Dela Cruz.jpg') },
      { name: 'Mrs. Eleanor Bacalso', position: 'Academic Coordinator', image: require('../assets/images/TEACHERS/EDUC DEPT/Eleanor Bacalso.jpg') },
      { name: 'Mrs. Lorevee Labrado', position: 'Full time - Educ. Dept.', image: require('../assets/images/TEACHERS/EDUC DEPT/Lorevee Labrado.jpg') },
      { name: 'Mr. Florencio Paras III', position: 'Full Time - Educ. Dept.', image: require('../assets/images/TEACHERS/EDUC DEPT/Florencio Paras.jpg') },
      { name: 'Ms. Gilda Abillar', position: 'Part Time - Educ. Dept.', image: require('../assets/images/TEACHERS/EDUC DEPT/Gilda Abillar.jpg') },
    ],
  },
  hrm: {
    name: 'HRM Department', icon: 'restaurant-outline', color: '#FF8C00', sectionLabel: '👥 TEACHERS',
    programHead: { name: 'Mr. Russel Tadeña', position: 'HRM Program Head', image: require('../assets/images/TEACHERS/HRM DEPARTMENT/Russel Tadena.jpg') },
    teachers: [
      { name: 'Ms. Faith Sugabo', position: 'Full time - HRM Dept.', image: require('../assets/images/TEACHERS/HRM DEPARTMENT/Faith Sugabo.jpg') },
      { name: 'Mr. Kyle Miguel Obiña', position: 'Full time - HRM Dept.', image: require('../assets/images/TEACHERS/HRM DEPARTMENT/Kyle Miguel Obina.jpg') },
      { name: 'Ms. Geralene Hubahib', position: 'Full time - HRM Dept.', image: require('../assets/images/TEACHERS/HRM DEPARTMENT/Geralene Hubahib.jpg') },
    ],
  },
  bsentre: {
    name: 'BS Entrep Department', icon: 'briefcase-outline', color: '#8B0000', sectionLabel: '👥 TEACHERS',
    programHead: { name: 'Dr. Maristela Remitar', position: 'BS Entrep Program Head', image: require('../assets/images/TEACHERS/INTREP HEAD/Maristela Remitar.jpg') },
    teachers: [
      { name: 'Ms. Angelie Lacanglacang', position: 'Adviser', image: require('../assets/images/TEACHERS/INTREP HEAD/Angelie Lacanglacang.jpg') },
    ],
  },
  coreSubjects: {
    name: 'Core Subjects', icon: 'book-outline', color: '#1A5CB5', sectionLabel: '👥 TEACHERS', programHead: null,
    teachers: [
      { name: 'Mr. Cecilio Uy', position: 'Core Subjects Teacher', image: require('../assets/images/TEACHERS/CORE SUBS/Cecilio Uy.jpg') },
    ],
  },
  elementary: {
    name: 'Elementary Department', icon: 'school-outline', color: '#32CD32', sectionLabel: '👥 TEACHERS', programHead: null,
    teachers: [
      { name: 'Ms. Corazon Salazar', position: 'Adviser - Kinder Senior', image: require('../assets/images/TEACHERS/ELEM/Corazon Salazar.jpg') },
      { name: 'Ms. Jeramie Dela Cerna', position: 'Adviser - Grade 1 St. Agnes', image: require('../assets/images/TEACHERS/ELEM/Jeramie Dela Cerna.jpg') },
      { name: 'Ms. Andree Adlawan', position: 'Adviser - Grade 2 St. Therese', image: require('../assets/images/TEACHERS/ELEM/Andree Adlawan.jpg') },
      { name: 'Ms. Mary Joy Adlawan', position: 'Adviser - Grade 3 St. Rose of Lima', image: require('../assets/images/TEACHERS/ELEM/Mary Joy Adlawan.jpg') },
      { name: 'Ms. Shaira Marie Cantiberos', position: 'Adviser - Grade 4 St. Rita', image: require('../assets/images/TEACHERS/ELEM/Shaira Marie Cantiberos.jpg') },
      { name: 'Ms. Jennylou Fano', position: 'Adviser - Grade 5 St. Raphael', image: require('../assets/images/TEACHERS/ELEM/Jennylou Fano.jpg') },
      { name: 'Mrs. Gemma Teresa Sitanos', position: 'Adviser - Grade 6 St. Ezekiel', image: require('../assets/images/TEACHERS/ELEM/Gemma Teresa Sitanos.jpg') },
    ],
  },
  jhs: {
    name: 'Junior Highschool', icon: 'book-outline', color: '#6C63FF', sectionLabel: '👥 TEACHERS', programHead: null,
    teachers: [
      { name: 'Mr. Christian Jay Deada', position: 'Adviser - Grade 7 OL Miraculous Medal', image: require('../assets/images/TEACHERS/JR HIGH/Chirstian Jay Deada.jpg') },
      { name: 'Mr. Jan Paul Nalipay', position: 'Adviser - Grade 7 OL Guadalope', image: require('../assets/images/TEACHERS/JR HIGH/Jan Paul Nalipay.jpg') },
      { name: 'Ms. Janine Mahidlaon', position: 'Adviser - Grade 8 OL Sacred Heart', image: require('../assets/images/TEACHERS/JR HIGH/Janine Mahidlaon.jpg') },
      { name: 'Ms. Ivy Rafaela Chiu', position: 'Adviser - Grade 8 OL Perpetual Help', image: null },
      { name: 'Ms. Jia Malesido', position: 'Adviser - Grade 9 OL Nativity', image: require('../assets/images/TEACHERS/JR HIGH/Jia Malesido.jpg') },
      { name: 'Ms. Lucille Blaze Tesorero', position: 'Adviser - Grade 9 OL Assumption', image: require('../assets/images/TEACHERS/JR HIGH/Lucille Blaze Tesorero.jpg') },
      { name: 'Mrs. Monchyll Bacalso', position: 'Adviser - Grade 10 St. Joseph', image: require('../assets/images/TEACHERS/JR HIGH/Monchyll Bacalso.jpg') },
      { name: 'Mr. Christian Mark Tesorero', position: 'Adviser - Grade 10 St. Augustine', image: require('../assets/images/TEACHERS/JR HIGH/Christian Mark Tesorero.jpg') },
      { name: 'Sr. Luzviminda C. Escal, AR', position: 'Subject Teacher - CLE', image: require('../assets/images/TEACHERS/JR HIGH/Luzviminda C. Escal, AR.jpg') },
      { name: 'Mr. Vince Raymond Batomalague', position: 'Subject Teacher - Science 7', image: require('../assets/images/TEACHERS/JR HIGH/Vince Raymond Batomalaque.jpg') },
      { name: 'Mr. Rhex John Warain', position: 'Subject Teacher - Science 8', image: require('../assets/images/TEACHERS/JR HIGH/Rhex John Warain.jpg') },
      { name: 'Ms. Kim Irish Placibe', position: 'Subject Teacher - AP 8 & MAPEH 7', image: require('../assets/images/TEACHERS/JR HIGH/Kim Irish Placibe.jpg') },
      { name: 'Mrs. Esmeralda Piala', position: 'Subject Teacher - Science 10', image: require('../assets/images/TEACHERS/JR HIGH/Esmeralda Piala.jpg') },
      { name: 'Ms. Ann May Caninogo', position: 'Subject Teacher - AP 10', image: require('../assets/images/TEACHERS/JR HIGH/Ann May Canonigo.jpg') },
      { name: 'Ms. Jossie Paña', position: 'Subject Teacher - AP 9', image: require('../assets/images/TEACHERS/JR HIGH/Jossie Pana.jpg') },
    ],
  },
  shs: {
    name: 'Senior Highschool', icon: 'school-outline', color: '#FFD700', sectionLabel: '👥 TEACHERS', programHead: null,
    teachers: [
      { name: 'Ms. Ann May Caninogo', position: 'Adviser - Grade 12 STEM 1', image: require('../assets/images/TEACHERS/SR HIGH/Ann May Canonigo.jpg') },
      { name: 'Mrs. Esmeralda Piala', position: 'Adviser - Grade 12 STEM 2', image: require('../assets/images/TEACHERS/SR HIGH/Esmeralda Piala.jpg') },
      { name: 'Mr. Vince Raymond Batomalague', position: 'Adviser - Grade 12 STEM 3', image: require('../assets/images/TEACHERS/SR HIGH/Vince Raymond Batomalaque.jpg') },
      { name: 'Ms. Princes Danne Rabanez', position: 'Adviser - Grade 12 STEM 4', image: require('../assets/images/TEACHERS/SR HIGH/Princes Danne Rabanes.jpg') },
      { name: 'Ms. Elmie Labustro', position: 'Adviser - Grade 12 HUMSS 1', image: require('../assets/images/TEACHERS/SR HIGH/Elmie Labustro.jpg') },
      { name: 'Mr. Vincy Innael Tanudra', position: 'Adviser - Grade 12 HUMSS 2', image: null },
      { name: 'Ms. Cherica Candar', position: 'Adviser - Grade 12 TVL', image: require('../assets/images/TEACHERS/SR HIGH/Cherica Candar.jpg') },
      { name: 'Mr. Michael Vincent Musico', position: 'Adviser - Grade 12 ABM', image: require('../assets/images/TEACHERS/SR HIGH/Michael Vincent Musico.jpg') },
      { name: 'Ms. Celyn Niña Grace Laordin', position: 'Adviser - Grade 11 Sci & Engr. 1', image: require('../assets/images/TEACHERS/SR HIGH/Celyn Nina Grace Laordin.jpg') },
      { name: 'Ms. Maire Aivey Teñedo', position: 'Adviser - Grade 11 Sci & Engr. 2', image: require('../assets/images/TEACHERS/SR HIGH/Maire Aivey Tenedo.jpg') },
      { name: 'Mr. Rhex John Warain', position: 'Adviser - Grade 11 Sci & Medical 1', image: require('../assets/images/TEACHERS/SR HIGH/Rhex John Warain.jpg') },
      { name: 'Ms. Jossie Paña', position: 'Adviser - Grade 11 Sci & Medical 2', image: require('../assets/images/TEACHERS/SR HIGH/Jossie Pana.jpg') },
      { name: 'Ms. Jamaica Mae M. Marfa', position: 'Adviser - Grade 11 ASSH 1', image: null },
      { name: 'Ms. Ferlita Ationg', position: 'Adviser - Grade 11 ASSH 2', image: require('../assets/images/TEACHERS/SR HIGH/Ferlita Ationg.jpg') },
      { name: 'Ms. Keziah Francine Canonigo', position: 'Adviser - Grade 11 ICT 1', image: require('../assets/images/TEACHERS/SR HIGH/Keziah Francine Canonigo.jpg') },
      { name: 'Mr. Jeevie Rebias', position: 'Adviser - Grade 11 ICT 2', image: require('../assets/images/TEACHERS/SR HIGH/Jeevie Rebias.jpg') },
      { name: 'Ms. Krisnel Ocio', position: 'Adviser - Grade 11 BE', image: require('../assets/images/TEACHERS/SR HIGH/Krisnel Ocio.jpg') },
      { name: 'Ms. Marjehelle Oyao', position: 'Adviser - Grade 11 Hospitality', image: require('../assets/images/TEACHERS/SR HIGH/Marjchelle Oyao.jpg') },
      { name: 'Mrs. Esperanza Dosdos', position: 'Subject Teacher / Part time', image: require('../assets/images/TEACHERS/SR HIGH/Esperanza Dosdos.jpg') },
      { name: 'Ms. Donna Tanggarorang', position: 'Subject Teacher / Part time', image: null },
      { name: 'Mrs. Marichu Balverde', position: 'Subject Teacher / Part time', image: require('../assets/images/TEACHERS/SR HIGH/Marichu Balverde.jpg') },
      { name: 'Mr. Christian Lee Villaflor', position: 'Robotics Teacher - Elem/JHS/SHS', image: require('../assets/images/TEACHERS/SR HIGH/Christian Lee Villaflor.jpg') },
    ],
  },
  staff: {
    name: 'Staff', icon: 'people-outline', color: '#FF8C00', sectionLabel: '👥 STAFF', programHead: null,
    teachers: [
      { name: 'Mrs. Ledovina Batobalonos', position: 'In-charge Library', image: require('../assets/images/TEACHERS/STAFF/Ledovina Batobalonos.jpg') },
      { name: 'Mrs. Noldita Marcelo', position: 'President\'s Office Staff/ TES Focal Person', image: require('../assets/images/TEACHERS/STAFF/Noldita Marcelo.jpg') },
      { name: 'Ms. Elaine Labonite', position: 'Principal\'s Office Staff', image: require('../assets/images/TEACHERS/STAFF/Elaine Labonite.jpg') },
      { name: 'Mrs. Deselyn Gonzaga', position: 'Treasurer\'s Office Staff', image: require('../assets/images/TEACHERS/STAFF/Deselyn Gonzaga.jpg') },
      { name: 'Ms. Juvilee Abelo', position: 'Cashier', image: require('../assets/images/TEACHERS/STAFF/Juvilee Abelo.jpg') },
      { name: 'Ms. Maricel Homecillio', position: 'Liaison/ Supply Officer', image: require('../assets/images/TEACHERS/STAFF/Maricel Homecillio.jpg') },
      { name: 'Mr. Emigdio Igalinos', position: 'Registrar\'s Office - Incharge Basic Education', image: require('../assets/images/TEACHERS/STAFF/Emigdio Igcalinos.jpg') },
      { name: 'Mrs. Jocelyn Canoy', position: 'Registrar\'s Office - College Staff', image: require('../assets/images/TEACHERS/STAFF/Jocelyn Canoy.jpg') },
      { name: 'Ms. Jocelyn Honoridez', position: 'Registrar\'s Office - College Staff', image: require('../assets/images/TEACHERS/STAFF/Joselyn Honoridez.jpg') },
      { name: 'Ms. Jhacky Yballe', position: 'College - TES Staff', image: require('../assets/images/TEACHERS/STAFF/Jhacky Yballe.jpg') },
      { name: 'Ms. Lara Valerie Tito', position: 'Guidance Staff', image: require('../assets/images/TEACHERS/STAFF/Lara Valerie Tito.jpg') },
      { name: 'Ms. Maristela Telebrico', position: 'Library Staff', image: require('../assets/images/TEACHERS/STAFF/Maristela Telebrico.jpg') },
      { name: 'Ms. Leh Maxine Flores', position: 'Computer Technician', image: require('../assets/images/TEACHERS/STAFF/Leh Maxine Flores.jpg') },
      { name: 'Mr. John Kinon Lapis', position: 'Computer Technician', image: require('../assets/images/TEACHERS/STAFF/John Kinon Lapis.jpg') },
      { name: 'Mr. Welmar Gonzaga', position: 'Sound Operator & Science Lab Assistant', image: require('../assets/images/TEACHERS/STAFF/Welmar Gonzaga.jpg') },
      { name: 'Mrs. Janaliza Quia-ot', position: 'School Nurse', image: require('../assets/images/TEACHERS/STAFF/Janaliza Quia-ot.jpg') },
      { name: 'Dr. Tiburcio Dacalos', position: 'School Doctor', image: require('../assets/images/TEACHERS/STAFF/Tiburcio Dacalos.jpg') },
      { name: 'Dr. Malvin Sanchez', position: 'School Dentist', image: null },
    ],
  },
  maintenance: {
    name: 'Maintenance Personnel', icon: 'construct-outline', color: '#8B4513', sectionLabel: '👥 MAINTENANCE', programHead: null,
    teachers: [
      { name: 'Mr. Carlo Maasin', position: 'Maintenance', image: require('../assets/images/TEACHERS/STAFF/Carlo Maasin.jpg') },
      { name: 'Mr. Victor Raymunda', position: 'Maintenance', image: require('../assets/images/TEACHERS/STAFF/Victor Raymuna.jpg') },
      { name: 'Mrs. Vilma Aroba', position: 'Maintenance - Elem Dept.', image: require('../assets/images/TEACHERS/STAFF/Vilma Aroba.jpg') },
      { name: 'Mr. Dionisio Villamor', position: 'Electrician', image: require('../assets/images/TEACHERS/STAFF/Dionisio Villamor.jpg') },
      { name: 'Mrs. Marcelita Salumag', position: 'Maintenance - 2 Storey Bldg/ Canteen/ Cook', image: require('../assets/images/TEACHERS/STAFF/Marcelita Salumag.jpg') },
    ],
  },
};

// ✅ PROGRAM HEAD CARD (Walang Korona)
const ProgramHeadCard = ({ data, color, index, onPress }) => {
  const fadeAnim = useFadeIn(500, index * 100);
  const slideAnim = useSlideUp(30);
  const { scaleAnim, pressIn, pressOut } = usePressAnimation();

  // ✅ Dynamic badge text
  const isPresident = data.position === 'School President';
  const badgeText = isPresident ? 'SCHOOL PRESIDENT' : 'PROGRAM HEAD';

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }], marginBottom: 12 }}>
      <TouchableOpacity style={[styles.programHeadCard, { borderColor: color }]} onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} activeOpacity={0.9}>
        
        {/* ✅ Formal na Badge (Walang Korona) */}
        <View style={[styles.crownBadge, { backgroundColor: color, alignSelf: 'flex-start', paddingHorizontal: 10, borderRadius: 8, marginBottom: 10 }]}>
          <Text style={[styles.crownText, { fontSize: 10, letterSpacing: 0.5 }]}>{badgeText}</Text>
        </View>

        <View style={styles.programHeadContent}>
          {data.image ? (
            <Image source={typeof data.image === 'string' ? { uri: data.image } : data.image} style={[styles.programHeadImage, { borderColor: color }]} />
          ) : (
            <View style={[styles.programHeadImagePlaceholder, { borderColor: color }]}>
              <Ionicons name="person" size={40} color={color} />
            </View>
          )}
          <View style={styles.programHeadInfo}>
            <Text style={styles.programHeadName}>{data.name}</Text>
            <Text style={[styles.programHeadPosition, { color }]}>{data.position}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ✅ TEACHER CARD
const TeacherCard = ({ item, index, color, onPress }) => {
  const fadeAnim = useFadeIn(500, index * 80);
  const slideAnim = useSlideUp(30);
  const { scaleAnim, pressIn, pressOut } = usePressAnimation();

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }}>
      <TouchableOpacity style={styles.teacherCard} onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} activeOpacity={0.9}>
        {item.image ? (
          <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={[styles.teacherImage, { borderColor: color }]} />
        ) : (
          <View style={[styles.teacherImagePlaceholder, { borderColor: color }]}>
            <Ionicons name="person" size={40} color={color} />
          </View>
        )}
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.teacherPos} numberOfLines={2}>{item.position}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ✅ TEACHER DETAIL MODAL
const TeacherModal = ({ visible, teacher, color, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [visible]);

  if (!teacher) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="none" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
            <Ionicons name="close-circle" size={32} color={color} />
          </TouchableOpacity>
          {teacher.image ? (
            <Image source={typeof teacher.image === 'string' ? { uri: teacher.image } : teacher.image} style={[styles.modalImage, { borderColor: color }]} />
          ) : (
            <View style={[styles.modalImagePlaceholder, { borderColor: color }]}>
              <Ionicons name="person" size={70} color={color} />
            </View>
          )}
          <Text style={styles.modalName}>{teacher.name}</Text>
          <Text style={[styles.modalPosition, { color }]}>{teacher.position}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ✅ MAIN COMPONENT
export default function TeacherDirectory() {
  const [selectedDept, setSelectedDept] = useState('arSisters');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [teachersData, setTeachersData] = useState(DEFAULT_TEACHERS);
  
  const router = useRouter();
  const headerAnim = useFadeIn(600);
  const headerSlide = useSlideUp(-20);
  const tabAnim = useSlideUp(100);

  const departments = [
    { key: 'arSisters', label: 'AR Sisters', icon: 'star-outline', color: '#D4AF37' },
    { key: 'bsit', label: 'BSIT', icon: 'desktop-outline', color: '#0D3E86' },
    { key: 'educDept', label: 'Education', icon: 'school-outline', color: '#FF6B35' },
    { key: 'hrm', label: 'BSHM', icon: 'restaurant-outline', color: '#FF8C00' },
    { key: 'bsentre', label: 'BS Entrep', icon: 'briefcase-outline', color: '#8B0000' },
    { key: 'coreSubjects', label: 'Core Subjects', icon: 'book-outline', color: '#1A5CB5' },
    { key: 'elementary', label: 'Elementary', icon: 'school-outline', color: '#32CD32' },
    { key: 'jhs', label: 'JHS', icon: 'book-outline', color: '#6C63FF' },
    { key: 'shs', label: 'SHS', icon: 'school-outline', color: '#FFD700' },
    { key: 'staff', label: 'Staff', icon: 'people-outline', color: '#FF8C00' },
    { key: 'maintenance', label: 'Maintenance', icon: 'construct-outline', color: '#8B4513' },
  ];

  // ✅ FETCH & CACHE LOGIC
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'teachers'));
      const firebaseTeachers = [];
      querySnapshot.forEach((doc) => {
        firebaseTeachers.push({ id: doc.id, ...doc.data() });
      });

      if (firebaseTeachers.length > 0) {
        let mergedData = JSON.parse(JSON.stringify(DEFAULT_TEACHERS)); 
        
        firebaseTeachers.forEach(teacher => {
          let deptKey = 'bsit';
          const dept = teacher.department?.toLowerCase() || '';
          
          if (dept.includes('college') || dept.includes('bsit')) deptKey = 'bsit'; 
          else if (dept.includes('educ')) deptKey = 'educDept';
          else if (dept.includes('hrm')) deptKey = 'hrm';
          else if (dept.includes('entre')) deptKey = 'bsentre';
          else if (dept.includes('elem')) deptKey = 'elementary';
          else if (dept.includes('jhs')) deptKey = 'jhs';
          else if (dept.includes('shs')) deptKey = 'shs';
          else if (dept.includes('staff')) deptKey = 'staff';
          else if (dept.includes('maintenance')) deptKey = 'maintenance';

          if (mergedData[deptKey]) {
            mergedData[deptKey].teachers.unshift({
              name: teacher.name,
              position: teacher.position,
              image: teacher.imageUrl || null 
            });
          }
        });

        setTeachersData(mergedData);
        await AsyncStorage.setItem('cachedTeachers', JSON.stringify(mergedData)); 
      }
    } catch (error) {
      console.log('No internet or Firebase error. Using cached data...');
      const cached = await AsyncStorage.getItem('cachedTeachers');
      if (cached) {
        setTeachersData(JSON.parse(cached));
      }
    }
  };

  const currentDept = teachersData[selectedDept] || DEFAULT_TEACHERS[selectedDept];

  const openTeacherModal = (teacher) => {
    setSelectedTeacher(teacher);
    setModalVisible(true);
  };

  const closeTeacherModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedTeacher(null), 300);
  };

  return (
    <ImageBackground source={require('../assets/images/cc.jpg')} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.gradientOverlay}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          
          <Animated.View style={{ opacity: headerAnim, transform: [{ translateY: headerSlide }] }}>
            <View style={styles.headerWrapper}>
              <View style={styles.headerRedAccent} />
              <View style={styles.headerBlueBox}>
                <Image source={require('../assets/images/bg2.png')} style={styles.headerLogo} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.headerTitle} numberOfLines={1}>Faculty & Staff</Text>
                  <Text style={styles.headerSub} numberOfLines={1}>Consolatrix College of Toledo City</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          <View style={styles.pickerGreyContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
              {departments.map((dept) => (
                <TouchableOpacity
                  key={dept.key}
                  style={[styles.filterChip, selectedDept === dept.key && { backgroundColor: dept.color, borderColor: dept.color }]}
                  onPress={() => setSelectedDept(dept.key)}
                >
                  <Ionicons name={dept.icon} size={14} color={selectedDept === dept.key ? '#fff' : dept.color} />
                  <Text style={[styles.filterChipText, selectedDept === dept.key && { color: '#fff' }]}>{dept.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.deptTitleContainer, { borderLeftColor: currentDept.color }]}>
              <Ionicons name={currentDept.icon} size={24} color={currentDept.color} />
              <Text style={styles.deptTitle}>{currentDept.name}</Text>
            </View>

            {currentDept.programHead && (
              <ProgramHeadCard data={currentDept.programHead} color={currentDept.color} index={0} onPress={() => openTeacherModal(currentDept.programHead)} />
            )}

            {currentDept.teachers.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>{currentDept.sectionLabel}</Text>
                <View style={styles.teacherGrid}>
                  {currentDept.teachers.map((teacher, index) => (
                    <TeacherCard key={index} item={teacher} index={index} color={currentDept.color} onPress={() => openTeacherModal(teacher)} />
                  ))}
                </View>
              </>
            )}
          </ScrollView>

          <TeacherModal visible={modalVisible} teacher={selectedTeacher} color={currentDept.color} onClose={closeTeacherModal} />

          <Animated.View style={[styles.bottomTab, { transform: [{ translateY: tabAnim }] }]}>
            <TabIcon icon="home-outline" label="Home" onPress={() => router.push('/home')} />
            <TabIcon icon="time-outline" label="School" onPress={() => router.push('/history')} />
            <TabIcon icon="school-outline" label="Courses" onPress={() => router.push('/courses')} />
            <TabIcon icon="people-outline" label="Faculty" active />
            <TabIcon icon="book-outline" label="Rules" onPress={() => router.push('/rules')} />
            <TabIcon icon="newspaper-outline" label="News" onPress={() => router.push('/news')} />
          </Animated.View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const TabIcon = ({ icon, label, active, onPress }) => {
  const { scaleAnim, pressIn, pressOut } = usePressAnimation();
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity style={styles.tabItem} onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        <Ionicons name={icon} size={22} color={active ? '#fff' : '#ccc'} />
        <Text style={[styles.tabLabel, { color: active ? '#fff' : '#ccc' }]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};