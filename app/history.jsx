import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../styles/HistoryStyles';

export default function HistoryScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={require('../assets/images/cc.jpg')} style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/home')}>
            <Ionicons name="menu-outline" size={32} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>School History</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* OUR HERITAGE CARD - SQUARE BLOCK STYLE */}
          <View style={styles.historyCard}>
            <View style={[styles.sideAccent, { backgroundColor: '#E31E24' }]} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitleCentered}>Our Heritage</Text>
              
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../assets/images/logo.png')} 
                  style={styles.schoolLogo}
                  resizeMode="contain"
                />
              </View>

              {/* Justified block text para pantay ang gilid */}
              <Text style={styles.cardTextJustified}>
                Consolatrix College of Toledo City, Inc. (CCTC) was established in 1961 by the Augustinian Recollect Sisters (A.R.) following a heartfelt invitation from the local clergy to provide a religious and moral foundation for the youth.
              </Text>
              
              <Text style={[styles.cardTextJustified, { marginTop: 15 }]}>
                Starting with a pioneering class of only 129 students, the institution has evolved into a comprehensive educational center offering K-12 and tertiary programs.
              </Text>
              
              <View style={{ height: 20 }} />
            </View>
          </View>

          {/* VISION CARD - SQUARE BLOCK STYLE */}
          <View style={styles.historyCard}>
            <View style={[styles.sideAccent, { backgroundColor: '#FFD700' }]} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitleCentered}>Vision</Text>
              <Text style={styles.cardTextJustified}>
                Consolatrix College of Toledo City, Inc. envisions a life-giving and innovating education ministry committed to transforming community of learners into Christ-centered Augustinian Recollect Stewards.
              </Text>
              <View style={{ height: 15 }} />
            </View>
          </View>

          {/* MISSION CARD */}
          <View style={styles.historyCard}>
            <View style={[styles.sideAccent, { backgroundColor: '#32CD32' }]} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitleCentered}>Mission</Text>
              <Text style={styles.cardHeaderSmallCentered}>Consolatrix College of Toledo City, Inc. mission is to:</Text>
              
              <MissionPoint num="1." text="Strengthen fraternal charity through God-filled friendship and renewed evangelization;" />
              <MissionPoint num="2." text="Facilitate the integral development of the learners towards transformation through current researches, relevant curricular offerings and responsive community extension services;" />
              <MissionPoint num="3." text="Fortify leadership and professional development of stakeholders through continuing education and intensive Augustinian Recollect spirituality;" />
              <MissionPoint num="4." text="Develop a community of Christ-centered Augustinian Recollect Stewards who are environmentally caring and global leaders; and" />
              <MissionPoint num="5." text="Nurture one another in the shared mission for the sustainability of the AR, school and social relevance of programs and services." />
              <View style={{ height: 15 }} />
            </View>
          </View>

        </ScrollView>

        <View style={styles.bottomTab}>
          <TabIcon icon="home-outline" label="Home" onPress={() => router.push('/home')} />
          <TabIcon icon="time" label="School" active onPress={() => router.push('/history')} />
          <TabIcon icon="school-outline" label="Courses" onPress={() => router.push('/courses')} />
          <TabIcon icon="people-outline" label="Teacher" onPress={() => router.push('/teachers')} />
          <TabIcon icon="book-outline" label="Rules" onPress={() => router.push('/rules')} />
        </View>
      </View>
    </ImageBackground>
  );
}

const MissionPoint = ({ num, text }) => (
  <View style={styles.missionItem}>
    <Text style={styles.bulletNumber}>{num}</Text>
    <Text style={styles.missionText}>{text}</Text>
  </View>
);

const TabIcon = ({ icon, label, active, onPress }) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color={active ? '#fff' : '#ccc'} />
    <Text style={[styles.tabLabel, { color: active ? '#fff' : '#ccc' }]}>{label}</Text>
  </TouchableOpacity>
);