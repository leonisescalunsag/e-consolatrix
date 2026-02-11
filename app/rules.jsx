import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../styles/RulesStyles';

// Nilagyan natin ng color property bawat category para sa side border
const POLICIES = [
  {
    title: "Attendance",
    color: '#44e644', // Green
    rules: [
      "Students must maintain 95% attendance",
      "Late arrivals must report to office",
      "Absences require parent note"
    ]
  },
  {
    title: "Dress Code",
    color: '#0033FF', // Blue
    rules: [
      "Complete uniform required daily",
      "ID must be visible at all times",
      "Proper grooming standards"
    ]
  },
  {
    title: "Academic Integrity",
    color: '#f50c0c', // Purple
    rules: [
      "No plagiarism or cheating",
      "Original work required",
      "Citations must be proper"
    ]
  },
  {
    title: "Behavioral Standards",
    color: '#FFA500', // Orange
    rules: [
      "Respect all staff and students",
      "No bullying or harassment",
      "Follow classroom guidelines"
    ]
  }
];

export default function RulesScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={require('../assets/images/cc.jpg')} style={styles.container}>
      <View style={styles.overlay}>
        {/* Header - Consistent sa Home at Courses */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/home')} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={32} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rules & Policies</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Note Card - Blue side border */}
          <View style={styles.noteCard}>
            <Text style={styles.noteText}>
              Please review all school policies carefully. Compliance ensures a safe and productive learning environment.
            </Text>
          </View>

          {/* Policy Cards with Side Colors and Shadows */}
          {POLICIES.map((policy, index) => (
            <View key={index} style={styles.policyCard}>
              {/* Ito yung makulay na bar sa gilid */}
              <View style={[styles.sideBar, { backgroundColor: policy.color }]} />
              
              <View style={styles.cardContent}>
                <Text style={styles.policyTitle}>{policy.title}</Text>
                {policy.rules.map((rule, rIndex) => (
                  <Text key={rIndex} style={styles.ruleItem}>
                    {`> `}{rule}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* BOTTOM TAB - Fully Matched at Active ang Rules */}
        <View style={styles.bottomTab}>
          <TabIcon icon="home-outline" label="Home" onPress={() => router.push('/home')} />
          <TabIcon icon="time-outline" label="School" onPress={() => router.push('/history')} />
          <TabIcon icon="school-outline" label="Courses" onPress={() => router.push('/courses')} />
          <TabIcon icon="people-outline" label="Teacher" onPress={() => router.push('/teachers')} />
          <TabIcon icon="book" label="Rules" active onPress={() => router.push('/rules')} />
        </View>
      </View>
    </ImageBackground>
  );
}

const TabIcon = ({ icon, label, active, onPress }) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.8}>
    <Ionicons 
      name={icon} 
      size={22} 
      color={active ? '#fff' : '#ccc'} 
    />
    <Text style={[
      styles.tabLabel, 
      { color: active ? '#fff' : '#ccc', fontWeight: active ? 'bold' : '400' }
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);