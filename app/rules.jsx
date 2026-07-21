import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../styles/RulesStyles';
import { useFadeIn, useSlideUp, usePressAnimation } from '../hooks/useSlideAnimation';

// ✅ POLICIES DATA
const POLICIES = [
  {
    title: "Attendance Policy",
    color: '#0D3E86',
    icon: 'time-outline',
    rules: [
      "Students must maintain 95% attendance",
      "Late arrivals must report to the office",
      "Absences require a parent/guardian note",
      "Excessive absences may result in disciplinary action"
    ]
  },
  {
    title: "Dress Code",
    color: '#1A5CB5',
    icon: 'shirt-outline',
    rules: [
      "Complete school uniform required daily",
      "School ID must be visible at all times",
      "Proper grooming and hygiene standards",
      "No accessories or jewelry that distract"
    ]
  },
  {
    title: "Academic Integrity",
    color: '#E31E24',
    icon: 'school-outline',
    rules: [
      "No plagiarism or cheating",
      "All work must be original",
      "Proper citations required",
      "Academic dishonesty has serious consequences"
    ]
  },
  {
    title: "Behavioral Standards",
    color: '#FF6B35',
    icon: 'people-outline',
    rules: [
      "Respect all staff, students, and visitors",
      "No bullying, harassment, or discrimination",
      "Follow classroom and school guidelines",
      "Maintain a positive learning environment"
    ]
  },
  {
    title: "Safety & Security",
    color: '#32CD32',
    icon: 'lock-closed-outline',
    rules: [
      "Follow all safety protocols",
      "Report suspicious activities immediately",
      "No weapons or dangerous items allowed",
      "Cooperate during emergency drills"
    ]
  },
  {
    title: "Technology Use",
    color: '#8B0000',
    icon: 'desktop-outline',
    rules: [
      "Use school devices responsibly",
      "No unauthorized access to systems",
      "Respect intellectual property",
      "Mobile phones must be used appropriately"
    ]
  }
];

// ✅ RULE ITEM COMPONENT
const RuleItem = ({ text, color }) => {
  return (
    <View style={styles.ruleItem}>
      <View style={[styles.ruleBullet, { backgroundColor: color }]} />
      <Text style={styles.ruleText}>{text}</Text>
    </View>
  );
};

// ✅ POLICY CARD
const PolicyCard = ({ policy, index }) => {
  const fadeAnim = useFadeIn(500, index * 100);
  const slideAnim = useSlideUp(30);

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }]
    }}>
      <View style={[styles.policyCard, { borderLeftColor: policy.color }]}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: policy.color + '20' }]}>
            <Ionicons name={policy.icon} size={24} color={policy.color} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.policyTitle}>{policy.title}</Text>
            <View style={[styles.ruleCountBadge, { backgroundColor: policy.color + '15' }]}>
              <Text style={[styles.ruleCountText, { color: policy.color }]}>
                {policy.rules.length} rules
              </Text>
            </View>
          </View>
        </View>
        
        {/* Rules List */}
        <View style={styles.rulesContainer}>
          {policy.rules.map((rule, rIndex) => (
            <RuleItem 
              key={rIndex} 
              text={rule} 
              color={policy.color}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

// ✅ TAB ICON
const TabIcon = ({ icon, label, active, onPress }) => {
  const { scaleAnim, pressIn, pressOut } = usePressAnimation();
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={0.8}
      >
        <Ionicons name={icon} size={22} color={active ? '#fff' : '#ccc'} />
        <Text style={[styles.tabLabel, { color: active ? '#fff' : '#ccc' }]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ✅ MAIN COMPONENT
export default function RulesScreen() {
  const router = useRouter();
  const headerAnim = useFadeIn(600);
  const headerSlide = useSlideUp(-20);
  const tabAnim = useSlideUp(100);
  const noteAnim = useFadeIn(500, 50);

  return (
    <ImageBackground source={require('../assets/images/cc.jpg')} style={styles.container}>
      <View style={styles.overlay}>
        {/* HEADER */}
        <Animated.View style={{
          opacity: headerAnim,
          transform: [{ translateY: headerSlide }]
        }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/home')} activeOpacity={0.7}>
              <Ionicons name="menu-outline" size={32} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Rules & Policies</Text>
            <TouchableOpacity onPress={() => router.push('/news')} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* NOTE CARD */}
          <Animated.View style={{
            opacity: noteAnim,
            transform: [{ translateY: useSlideUp(20) }]
          }}>
            <View style={styles.noteCard}>
              <View style={styles.noteIconContainer}>
                <Ionicons name="information-circle" size={28} color="#0D3E86" />
              </View>
              <Text style={styles.noteText}>
                Please review all school policies carefully. Compliance ensures a safe and productive learning environment for everyone.
              </Text>
            </View>
          </Animated.View>

          {/* POLICY CARDS */}
          {POLICIES.map((policy, index) => (
            <PolicyCard key={index} policy={policy} index={index} />
          ))}

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              📌 Policies are subject to change. Check regularly for updates.
            </Text>
          </View>
        </ScrollView>

        {/* BOTTOM TAB */}
        <Animated.View style={[styles.bottomTab, { transform: [{ translateY: tabAnim }] }]}>
          <TabIcon icon="home-outline" label="Home" onPress={() => router.push('/home')} />
          <TabIcon icon="time-outline" label="School" onPress={() => router.push('/history')} />
          <TabIcon icon="school-outline" label="Courses" onPress={() => router.push('/courses')} />
          <TabIcon icon="people-outline" label="Teacher" onPress={() => router.push('/teachers')} />
          <TabIcon icon="book" label="Rules" active onPress={() => router.push('/rules')} />
          <TabIcon icon="newspaper-outline" label="News" onPress={() => router.push('/news')} />
        </Animated.View>
      </View>
    </ImageBackground>
  );
}