import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Animated, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../styles/RulesStyles';
import { useFadeIn, useSlideUp, usePressAnimation } from '../hooks/useSlideAnimation';

// ✅ POLICIES DATA - UPDATED WITH HANDBOOK CONTENT
const POLICIES = [
  {
    title: "Attendance and Absences",
    color: '#8B4513',
    icon: 'time-outline',
    rules: [
      "Regular attendance and diligence in studies are vital for success. Students are expected to attend classes regularly or by answering on time the digital activities provided by the teacher.",
      "Students who are not able to complete tasks on time should be marked as absent. To not be marked absent, students must send an excuse letter with reasons signed by parents to the class adviser/subject teacher via email, chat, or learning management system.",
      "The maximum permitted absences from class consists of 11 absences from either a three-unit lecture course or a one-unit laboratory course."
    ]
  },
  {
    title: "Grading System",
    color: '#1E90FF',
    icon: 'stats-chart-outline',
    hasTable: true,
    gradingScale: [
      { grade: '1.0', equivalent: '95%', meaning: 'Excellent' },
      { grade: '1.1', equivalent: '94%', meaning: '' },
      { grade: '1.2', equivalent: '93%', meaning: '' },
      { grade: '1.3', equivalent: '92%', meaning: '' },
      { grade: '1.4', equivalent: '91%', meaning: '' },
      { grade: '1.5', equivalent: '90%', meaning: 'Very Good' },
      { grade: '1.6', equivalent: '89%', meaning: '' },
      { grade: '1.7', equivalent: '88%', meaning: '' },
      { grade: '1.8', equivalent: '87%', meaning: '' },
      { grade: '1.9', equivalent: '86%', meaning: '' },
      { grade: '2.0', equivalent: '85%', meaning: '' },
      { grade: '2.1', equivalent: '84%', meaning: '' },
      { grade: '2.2', equivalent: '83%', meaning: 'Good' },
      { grade: '2.3', equivalent: '82%', meaning: '' },
      { grade: '2.4', equivalent: '81%', meaning: '' },
      { grade: '2.5', equivalent: '80%', meaning: '' },
      { grade: '2.6', equivalent: '79%', meaning: '' },
      { grade: '2.7', equivalent: '78%', meaning: 'Fair' },
      { grade: '2.8', equivalent: '77%', meaning: '' },
      { grade: '2.9', equivalent: '76%', meaning: '' },
      { grade: '3.0', equivalent: '75%', meaning: '' },
      { grade: '4.0', equivalent: '', meaning: 'Conditional' },
      { grade: '5.0', equivalent: '', meaning: 'Failed' }
    ],
    rules: [
      "Qualitative grades will not be used in computing General Weighted Average (GWA), but will be used only to break a tie in the ranking of students.",
      "The grade of 'INC' is given to a student who fails to take the final examination or fails to complete other requirements of the subject due to illness or other valid reasons.",
      "Removal of 'INC' must be done within one (1) academic year with three (3) regular removal periods by passing an examination or meeting all requirements.",
      "The grade of '4' is automatically changed to '5' when the one-year grace period for removal has lapsed.",
      "A grade of '4' if not removed within one (1) academic year must be re-enrolled within the prescribed enrollment period.",
      "No student shall solicit directly or indirectly any grade from his/her professor. Violating this rule shall lose credit in the subject(s) without prejudice to disciplinary action."
    ]
  },
  {
    title: "Retention Policies",
    color: '#DC143C',
    icon: 'alert-circle-outline',
    rules: [
      "A student to remain in good standing must have passed at least 67% of the units he has enrolled in during a semester.",
      "A student who fails to meet the 67% requirement may request admission and upon approval of the Dean, shall be placed on probation with reduced load.",
      "A student who fails at least 67% of the units enrolled shall be dropped from the college. Such student may apply for admission to another college upon recommendation of the College Dean."
    ]
  },
  {
    title: "General Policies",
    color: '#0D3E86',
    icon: 'shield-checkmark-outline',
    rules: [
      "All students must wear the prescribed school uniform at all times.",
      "School ID must be worn and visible at all times.",
      "Maintain cleanliness and orderliness within the school premises.",
      "Respect school property and report any damage to authorities."
    ]
  },
  {
    title: "Academic Policies",
    color: '#6C63FF',
    icon: 'book-outline',
    rules: [
      "Regular attendance is required for all classes.",
      "Students must submit assignments and projects on time.",
      "Cheating and plagiarism are strictly prohibited.",
      "Academic integrity must be upheld at all times."
    ]
  },
  {
    title: "Student Conduct",
    color: '#32CD32',
    icon: 'people-outline',
    rules: [
      "Treat teachers, staff, and fellow students with respect.",
      "Observe proper behavior and decorum at all times.",
      "No bullying, harassment, or discrimination of any kind.",
      "Maintain a positive and supportive learning environment."
    ]
  },
  {
    title: "Safety & Security",
    color: '#FF6B35',
    icon: 'lock-closed-outline',
    rules: [
      "Follow all safety protocols and emergency procedures.",
      "No weapons or dangerous items allowed on campus.",
      "Report any suspicious activity to security personnel.",
      "Fire drills and earthquake drills must be taken seriously."
    ]
  },
  {
    title: "Technology Use",
    color: '#8B0000',
    icon: 'desktop-outline',
    rules: [
      "Use school computers and internet responsibly.",
      "No unauthorized access to school systems.",
      "Cyberbullying and online harassment are prohibited.",
      "Mobile phones must be used appropriately during class hours."
    ]
  },
  {
    title: "Community",
    color: '#FFD700',
    icon: 'heart-outline',
    rules: [
      "Participate in school activities and events.",
      "Contribute to community extension programs.",
      "Promote a culture of unity and cooperation.",
      "Respect cultural and religious diversity."
    ]
  }
];

// ✅ GRADING TABLE COMPONENT
const GradingTable = ({ scale }) => {
  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Grade</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Equivalent</Text>
        <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Meaning</Text>
      </View>
      {scale.map((item, index) => (
        <View key={index} style={[
          styles.tableRow,
          index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
        ]}>
          <Text style={[styles.tableCell, { flex: 1, fontWeight: '600' }]}>{item.grade}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{item.equivalent}</Text>
          <Text style={[styles.tableCell, { flex: 1.5, color: item.meaning ? '#0D3E86' : '#666' }]}>
            {item.meaning}
          </Text>
        </View>
      ))}
    </View>
  );
};

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
                {policy.rules ? policy.rules.length : 0} rules
              </Text>
            </View>
          </View>
        </View>
        
        {/* Grading Table (if hasTable) */}
        {policy.hasTable && policy.gradingScale && (
          <GradingTable scale={policy.gradingScale} />
        )}
        
        {/* Rules List */}
        {policy.rules && policy.rules.length > 0 && (
          <View style={styles.rulesContainer}>
            {policy.rules.map((rule, rIndex) => (
              <RuleItem 
                key={rIndex} 
                text={rule} 
                color={policy.color}
              />
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// ✅ SEARCH BAR COMPONENT
const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search-outline" size={20} color="#999" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search rules..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Ionicons name="close-circle" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
};

// ✅ CATEGORY FILTER CHIPS
const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.filterScroll}
      contentContainerStyle={styles.filterContainer}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[
            styles.filterChip,
            selectedCategory === cat && styles.filterChipActive
          ]}
          onPress={() => setSelectedCategory(cat)}
        >
          <Text style={[
            styles.filterChipText,
            selectedCategory === cat && styles.filterChipTextActive
          ]}>
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const headerAnim = useFadeIn(600);
  const headerSlide = useSlideUp(-20);
  const tabAnim = useSlideUp(100);
  const noteAnim = useFadeIn(500, 50);

  // Get unique categories
  const categories = ['All', ...new Set(POLICIES.map(p => p.title))];

  // Filter policies based on search and category
  const filteredPolicies = POLICIES.filter(policy => {
    const matchesCategory = selectedCategory === 'All' || policy.title === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.rules.some(rule => rule.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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

          {/* SEARCH BAR */}
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {/* CATEGORY FILTER */}
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
          />

          {/* POLICY CARDS */}
          {filteredPolicies.length > 0 ? (
            filteredPolicies.map((policy, index) => (
              <PolicyCard key={index} policy={policy} index={index} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.5)" />
              <Text style={styles.emptyText}>No rules found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filter</Text>
            </View>
          )}

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