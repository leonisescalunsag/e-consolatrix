import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  FlatList, KeyboardAvoidingView, 
  Platform, Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/ChatbotStyles';

// ✅ COMPLETE AI RESPONSES (UPDATED with Faculty, Campus Tour & Enrollment)
const AI_RESPONSES = {
  // Teachers & Faculty (Exact counts)
  'how many teachers': 'Consolatrix College currently has a total of 65 teaching personnel across all departments: 7 in Elementary, 15 in Junior High School, 22 in Senior High School, and 21 College Professors. Additionally, we have 17 Non-Teaching Staff and 5 Maintenance Personnel, bringing our total school personnel to 87. You can view their complete profiles with pictures in the "Faculty" tab of the app.',
  
  'total personnel': 'We have a total of 87 dedicated personnel at Consolatrix College. This includes 65 teachers (Elementary, JHS, SHS, and College), 17 non-teaching staff, and 5 maintenance personnel.',

  'teachers': 'You can find all our dedicated teachers and staff in the Faculty section of the app. We have complete directories for College (BSIT, BSHM, Education, BS Entrep), SHS, JHS, Elementary, and Non-Teaching Staff.',
  
  'faculty': 'Our Faculty & Staff directory features complete profiles with pictures of our Program Heads, College Instructors, SHS/JHS/Elem Teachers, and administrative staff. Check out the Faculty tab to see them!',
  
  'program head': 'Our Program Heads include:\n• Mr. Procorro Gonzaga - BSIT\n• Mr. Russel Tadeña - BSHM (HRM)\n• Dr. Josephine Tabal - BSED (Education)\n• Dr. Maristela Remitar - BS Entrep\nYou can see their pictures in the Faculty section!',
  
  // Campus Tour
  'campus tour': 'The Campus Tour feature is one of our newest additions! It offers a POV (Point of View) walking tour video of major facilities like the AVR, Computer Labs, Library, Chapel, and more. You can watch the videos in the "Campus Tour" section of the app.',
  'tour': 'Our virtual Campus Tour allows you to explore the school facilities through immersive POV videos. Check the Campus Tour section to see the AVR, HM Building, Covered Court, and other major areas!',
  'video': 'You can watch POV walking tour videos of our facilities in the Campus Tour section. It shows you the way to the rooms and highlights inside!',
  'facilities': 'Our major facilities include the Audio-Visual Room (AVR), Computer Laboratories, School Library, Chapel, HRM Building, Covered Court, and many more. You can watch their videos in the Campus Tour tab!',
  
  // Courses
  'courses': 'We offer Senior High strands (STEM, ABM, HUMSS, GAS, TVL) and College programs (BSIT, BSHM, BSED, BPED, BSEntrep).',
  'strands': 'Our SHS strands include:\n• STEM - Science, Technology, Engineering, and Mathematics\n• ABM - Accountancy, Business, and Management\n• HUMSS - Humanities and Social Sciences\n• GAS - General Academic Strand\n• TVL - Technical-Vocational-Livelihood',
  'college courses': 'College programs:\n• BSIT - Bachelor of Science in Information Technology\n• BSHM - Bachelor of Science in Hospitality Management\n• BSED - Bachelor of Secondary Education\n• BPED - Bachelor of Physical Education\n• BSEntrep - Bachelor of Science in Entrepreneurship',
  'bsit': 'BSIT - Bachelor of Science in Information Technology. Prepares students for IT careers including software development, networking, database management, and system administration.',
  'bshm': 'BSHM - Bachelor of Science in Hospitality Management. Focuses on hotel and restaurant management, tourism, and hospitality industry operations.',
  'bsed': 'BSED - Bachelor of Secondary Education. Prepares future teachers in various fields including English, Mathematics, Science, and Social Studies.',

  // History & Mission/Vision
  'school history': 'Consolatrix College of Toledo City, Inc. (CCTC) was established in 1961 by the Augustinian Recollect Sisters (A.R.). It was founded following a heartfelt invitation from the local clergy to provide a religious and moral foundation for the youth of Toledo City. Starting with a pioneering class of only 129 students, the institution has grown into a comprehensive educational center.\n\nOver its 65+ years of existence, CCTC has evolved from a simple school to a full-fledged educational institution offering K-12 and tertiary programs. You can read the full detailed history in the "School" tab.',
  'history': 'Consolatrix College of Toledo City, Inc. (CCTC) was established in 1961 by the Augustinian Recollect Sisters (A.R.). Starting from a pioneering class of 129 students, it has grown into a comprehensive educational center. You can read the full timeline in the School section.',
  'founder': 'Consolatrix College was founded by the Augustinian Recollect Sisters (A.R.) in 1961. The religious congregation established the school following an invitation from the local clergy to provide Catholic education and moral foundation to the youth of Toledo City.',
  'mission': 'Our mission is to strengthen fraternal charity through God-filled friendship and renewed evangelization; facilitate the integral development of learners towards transformation through current researches, relevant curricular offerings, and responsive community extension services; fortify leadership and professional development of stakeholders through continuing education and intensive Augustinian Recollect spirituality; develop a community of Christ-centered Augustinian Recollect Stewards who are environmentally caring and global leaders; and nurture one another in the shared mission for the sustainability of the AR, school, and social relevance of programs and services.',
  'vision': 'Consolatrix College of Toledo City, Inc. envisions a life-giving and innovating education ministry committed to transforming community of learners into Christ-centered Augustinian Recollect Stewards.',

  // Rules & Enrollment (UPDATED WITH VARIATIONS)
  'rules': 'Our policies cover Attendance, Dress Code, Academic Integrity, and Behavioral Standards. Each category has specific guidelines to ensure a safe and productive learning environment. You can read them all in the Rules tab.',
  'attendance': 'Students must maintain 95% attendance. Late arrivals must report to the office. Absences require a parent note and must be properly documented.',
  'dress code': 'Complete uniform is required daily. School ID must be visible at all times. Follow proper grooming standards as outlined in the student handbook.',
  
  // ✅ Tinamaan na natin lahat ng pwedeng itanong about enrollment
   'enrollment': 'Enrollment for the current semester is already closed. The next enrollment period will be announced soon for the upcoming school year. Please stay updated through the News & Announcements section of the app!',
  
  'enroll': 'Enrollment for the current semester is already closed. The next enrollment period will be announced soon for the upcoming school year. Please stay updated through the News & Announcements section of the app!',
   'enrolling': 'Enrollment for the current semester is already closed. The next enrollment period will be announced soon for the upcoming school year. Please stay updated through the News & Announcements section of the app!',
  
  'registrar': 'The registrar\'s office is located at the main building, First Floor. Visit them for enrollment, records, and other academic concerns from Monday to Friday, 8:00 AM to 4:00 PM.',
  'requirements': 'For incoming students, the basic enrollment requirements are:\n• Form 138 (Report Card) or Transcript of Records\n• Good Moral Certificate\n• PSA Birth Certificate\n• 2x2 ID Pictures (4 pcs)\n\nFor transferees, additional documents like Honorable Dismissal may be required. Please visit the Registrar\'s Office for the complete list.',

  // General / Greetings
  'hello': 'Hello! 👋 Welcome to e-Consolatrix. I\'m your AI assistant. How can I help you today? You can ask me about our Faculty, Courses, School History, Rules, or the new Campus Tour!',
  'hi': 'Hi there! 👋 I\'m your virtual assistant for Consolatrix College. I\'m here to help you learn more about our school. What would you like to know?',
  'help': 'I can help you with:\n• Faculty & Staff - teacher profiles\n• Campus Tour - POV facility videos\n• Courses - available programs\n• History - school heritage\n• Rules - policies\n\nJust ask and I\'ll do my best to answer! 😊',
  'about': 'I\'m your AI assistant for Consolatrix College of Toledo City. I\'m here to help you learn more about our school, from our rich history to our current programs, policies, and virtual campus tour.',
  'thank you': 'You\'re welcome! 😊 Feel free to ask more questions about CCTC. I\'m here to help!',
  'thanks': 'You\'re welcome! 😊 Anytime!',
  'good': 'I\'m glad to hear that! 😊 Anything else you\'d like to know about CCTC?',
  'great': 'Awesome! 😊 Let me know if you need anything else.',
  'default': 'I\'m not sure about that. 🤔 Here are some things you can ask me about:\n• Faculty & Staff\n• Campus Tour\n• Courses\n• History\n• Rules\n• Enrollment'
};

const getAIResponse = (input) => {
  const lowerInput = input.toLowerCase();
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (lowerInput.includes(key)) {
      return response;
    }
  }
  return AI_RESPONSES['default'];
};

// ✅ MESSAGE COMPONENT WITH ENTRANCE ANIMATION
const MessageItem = ({ item, index }) => {
  const isUser = item.isUser;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isUser ? 30 : -30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const delay = index * 60;
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [
        { translateX: slideAnim },
        { scale: scaleAnim }
      ]
    }}>
      <View style={[
        styles.messageWrapper,
        isUser ? styles.userWrapper : styles.aiWrapper
      ]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <LinearGradient
              colors={['#0D3E86', '#1A5CB5']}
              style={styles.aiAvatarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="chatbubble-ellipses" size={16} color="#FFFFFF" />
            </LinearGradient>
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.aiBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userText : styles.aiText
          ]}>
            {item.text}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

// ✅ CHIP COMPONENT WITH STAGGER ANIMATION
const SuggestedChip = ({ text, onPress, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const delay = 400 + (index * 80);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }]
    }}>
      <TouchableOpacity
        style={styles.suggestedChip}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.suggestedText}>{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ✅ MAIN CHATBOT SCREEN
const ChatbotScreen = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { 
      id: '1', 
      text: '👋 Hello! I\'m your AI assistant. Ask me about:\n• Faculty & Staff\n• Campus Tour\n• Courses\n• History\n• Rules\n• Enrollment', 
      isUser: false 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  
  // ✅ Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const headerSlideAnim = useRef(new Animated.Value(-30)).current;
  const inputScaleAnim = useRef(new Animated.Value(1)).current;
  const sendScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // ✅ Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    // ✅ Input press animation
    Animated.sequence([
      Animated.timing(inputScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(inputScaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    const userMsg = { id: Date.now().toString(), text: inputText, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(inputText);
      const aiMsg = { id: (Date.now() + 1).toString(), text: response, isUser: false };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  // ✅ BAGONG MGA TANONG PARA SA CHIPS
  const suggestedQuestions = [
    'How many teachers are there?',
    'What facilities can I tour?',
    'What courses are offered?',
    'Tell me about the school history',
    'How to enroll?'
  ];

  return (
    <View style={styles.container}>
      {/* ✅ HEADER WITH ANIMATION */}
      <Animated.View style={{ transform: [{ translateY: headerSlideAnim }] }}>
        <LinearGradient
          colors={['#0D3E86', '#1A5CB5']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.headerIcon}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>AI Assistant</Text>
          </View>
          <View style={{ width: 40 }} />
        </LinearGradient>
      </Animated.View>

      {/* ✅ MESSAGES WITH ANIMATION */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <MessageItem item={item} index={index} />
          )}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
      </Animated.View>

      {/* ✅ TYPING INDICATOR WITH ANIMATION */}
      {isTyping && (
        <Animated.View style={[styles.typingContainer, { opacity: fadeAnim }]}>
          <View style={styles.typingBubble}>
            <View style={styles.typingDots}>
              <View style={[styles.typingDot, styles.typingDot1]} />
              <View style={[styles.typingDot, styles.typingDot2]} />
              <View style={[styles.typingDot, styles.typingDot3]} />
            </View>
            <Text style={styles.typingText}>AI is thinking...</Text>
          </View>
        </Animated.View>
      )}

      {/* ✅ SUGGESTED QUESTIONS WITH STAGGER ANIMATION */}
      <View style={styles.suggestedContainer}>
        {suggestedQuestions.map((q, index) => (
          <SuggestedChip
            key={index}
            text={q}
            index={index}
            onPress={() => {
              setInputText(q);
              setTimeout(() => sendMessage(), 300);
            }}
          />
        ))}
      </View>

      {/* ✅ INPUT WITH ANIMATION */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <Animated.View style={[styles.inputContainer, { transform: [{ scale: inputScaleAnim }] }]}>
          <View style={styles.inputWrapper}>
            <Ionicons name="chatbubble-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ask me anything..."
              placeholderTextColor="#999999"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendMessage}
            />
          </View>
          <TouchableOpacity 
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]} 
            onPress={sendMessage}
            disabled={!inputText.trim()}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#0D3E86', '#1A5CB5']}
              style={styles.sendGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="send" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatbotScreen;