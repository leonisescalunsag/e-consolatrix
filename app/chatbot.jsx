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

// ✅ COMPLETE AI RESPONSES
const AI_RESPONSES = {
  // Teachers
  'how many teachers': 'We currently have 24 dedicated faculty members at Consolatrix College of Toledo City, Inc. Our teachers are the following departments: College (BSIT, BSHM, BSED, BS Entrep), Senior High School, Junior High School, and Elementary. Each educator is committed to providing quality Catholic education and holistic formation to our students.',
  'teachers': 'Consolatrix College has a diverse and dedicated faculty composed of 24 teachers. You can view the complete Teacher Directory in the app. Our teachers include Program Heads, College Instructors, SHS Instructors, JHS Instructors, and Grade School Teachers across different departments.',
  'college teachers': 'Our College department has instructors from BSIT, BSHM, Education, and BS Entrep programs. Key faculty include Mr. Procoro Gonzaga (BSIT Program Head), Mr. Russel D. Tadena (BSHM Program Head), and Mrs. Josephine M. Tabal (BSED Program Head).',
  'program head': 'Our Program Heads include:\n• Mr. Procoro Gonzaga - BSIT\n• Mr. Russel D. Tadena - BSHM\n• Mrs. Josephine M. Tabal - BSED\n• Ms. Maria Clara - BS Entrep',

  // Courses
  'courses': 'We offer Senior High strands (STEM, ABM, HUMSS, GAS, TVL) and College programs (BSIT, BSHM, BSED, BPED, BSEntrep).',
  'strands': 'Our SHS strands include:\n• STEM - Science, Technology, Engineering, and Mathematics\n• ABM - Accountancy, Business, and Management\n• HUMSS - Humanities and Social Sciences\n• GAS - General Academic Strand\n• TVL - Technical-Vocational-Livelihood',
  'college courses': 'College programs:\n• BSIT - Bachelor of Science in Information Technology\n• BSHM - Bachelor of Science in Hospitality Management\n• BSED - Bachelor of Secondary Education\n• BPED - Bachelor of Physical Education\n• BSEntrep - Bachelor of Science in Entrepreneurship',
  'bsit': 'BSIT - Bachelor of Science in Information Technology. Prepares students for IT careers including software development, networking, database management, and system administration.',
  'bshm': 'BSHM - Bachelor of Science in Hospitality Management. Focuses on hotel and restaurant management, tourism, and hospitality industry operations.',
  'bsed': 'BSED - Bachelor of Secondary Education. Prepares future teachers in various fields including English, Mathematics, Science, and Social Studies.',
  'bped': 'BPED - Bachelor of Physical Education. Focuses on sports education, physical fitness, coaching, and athletic program management.',
  'bsentrepreneurship': 'BSEntrep - Bachelor of Science in Entrepreneurship. Prepares students for business ventures, startup management, and entrepreneurial leadership.',
  'stem': 'STEM - Science, Technology, Engineering, and Mathematics strand for SHS students. Prepares students for college programs in engineering, medicine, and applied sciences.',
  'abm': 'ABM - Accountancy, Business, and Management strand for future business leaders, accountants, and entrepreneurs.',
  'humss': 'HUMSS - Humanities and Social Sciences strand for future educators, social workers, lawyers, and communication professionals.',
  'gas': 'GAS - General Academic Strand for undecided students who want to explore different fields before choosing a college program.',
  'tvl': 'TVL - Technical-Vocational-Livelihood strand for skilled trades and technical careers.',

  // History - Complete
  'school history': 'Consolatrix College of Toledo City, Inc. (CCTC) was established in 1961 by the Augustinian Recollect Sisters (A.R.). It was founded following a heartfelt invitation from the local clergy to provide a religious and moral foundation for the youth of Toledo City. Starting with a pioneering class of only 129 students, the institution has grown into a comprehensive educational center.\n\nOver its 65+ years of existence, CCTC has evolved from a simple school to a full-fledged educational institution offering K-12 and tertiary programs. The school remains committed to its Augustinian Recollect heritage of providing quality Catholic education and transforming students into Christ-centered individuals. Today, CCTC continues to serve the community with its mission of strengthening fraternal charity, facilitating integral development, and nurturing stewardship.',
  'history': 'Consolatrix College of Toledo City, Inc. (CCTC) was established in 1961 by the Augustinian Recollect Sisters (A.R.). It was founded following a heartfelt invitation from the local clergy to provide a religious and moral foundation for the youth of Toledo City. Starting with a pioneering class of only 129 students, the institution has grown into a comprehensive educational center.\n\nOver its 65+ years of existence, CCTC has evolved from a simple school to a full-fledged educational institution offering K-12 and tertiary programs. The school remains committed to its Augustinian Recollect heritage of providing quality Catholic education and transforming students into Christ-centered individuals. Today, CCTC continues to serve the community with its mission of strengthening fraternal charity, facilitating integral development, and nurturing stewardship.',
  'founder': 'Consolatrix College was founded by the Augustinian Recollect Sisters (A.R.) in 1961. The religious congregation established the school following an invitation from the local clergy to provide Catholic education and moral foundation to the youth of Toledo City.',
  'founded': 'Consolatrix College was founded in 1961 by the Augustinian Recollect Sisters (A.R.). The school started with only 129 pioneering students and has since grown into a comprehensive educational institution.',
  '1961': 'Consolatrix College was established in 1961 by the Augustinian Recollect Sisters (A.R.) with only 129 pioneering students. This marked the beginning of what would become a 65+ year legacy of Catholic education in Toledo City.',
  'mission': 'Our mission is to strengthen fraternal charity through God-filled friendship and renewed evangelization; facilitate the integral development of learners towards transformation through current researches, relevant curricular offerings, and responsive community extension services; fortify leadership and professional development of stakeholders through continuing education and intensive Augustinian Recollect spirituality; develop a community of Christ-centered Augustinian Recollect Stewards who are environmentally caring and global leaders; and nurture one another in the shared mission for the sustainability of the AR, school, and social relevance of programs and services.',
  'vision': 'Consolatrix College of Toledo City, Inc. envisions a life-giving and innovating education ministry committed to transforming community of learners into Christ-centered Augustinian Recollect Stewards.',
  'heritage': 'CCTC has a rich heritage of 65+ years of academic excellence and community service. Founded in 1961 by the Augustinian Recollect Sisters, the school has been a pillar of Catholic education in Toledo City, Cebu, shaping thousands of students into Christ-centered individuals.',
  'cctc': 'Consolatrix College of Toledo City (CCTC) is a Catholic educational institution founded in 1961 by the Augustinian Recollect Sisters. It offers K-12 and tertiary programs, with a mission to transform learners into Christ-centered Augustinian Recollect Stewards.',

  // Rules
  'rules': 'Our policies cover Attendance, Dress Code, Academic Integrity, and Behavioral Standards. Each category has specific guidelines to ensure a safe and productive learning environment.',
  'attendance': 'Students must maintain 95% attendance. Late arrivals must report to the office. Absences require a parent note and must be properly documented.',
  'dress code': 'Complete uniform is required daily. School ID must be visible at all times. Follow proper grooming standards as outlined in the student handbook.',
  'academic integrity': 'No plagiarism or cheating. All submitted work must be original. Proper citations are mandatory for all academic papers and projects.',
  'behavioral standards': 'Respect all staff and students. No bullying or harassment is tolerated. Follow classroom guidelines and maintain proper conduct at all times.',
  'policy': 'All school policies are available in the Rules section of the app. These include Attendance, Dress Code, Academic Integrity, and Behavioral Standards.',

  // Enrollment
  'enrollment': 'Enrollment for SY 2026-2027 is now open! Please visit the registrar\'s office for requirements and the enrollment process. Early enrollment is encouraged to secure your slot.',
  'scholarship': 'Please contact the registrar\'s office for scholarship inquiries and available programs. Various scholarships are available for qualified students.',
  'registrar': 'The registrar\'s office is located at the main building, 2nd floor. Visit them for enrollment, records, and other academic concerns.',
  'requirements': 'Enrollment requirements include: Form 138, Good Moral Certificate, Birth Certificate, and 2x2 ID photos. Additional requirements may be requested depending on the program.',

  // General
  'hello': 'Hello! 👋 Welcome to e-Consolatrix. I\'m your AI assistant. How can I help you today? You can ask me about Teachers, Courses, History, Rules, or Enrollment.',
  'hi': 'Hi there! 👋 I\'m your virtual assistant for Consolatrix College. I\'m here to help you learn more about our school. What would you like to know?',
  'help': 'I can help you with:\n• Teachers - faculty information\n• Courses - available programs\n• History - school heritage\n• Rules - policies\n• Enrollment - admission process\n\nJust ask and I\'ll do my best to answer! 😊',
  'about': 'I\'m your AI assistant for Consolatrix College of Toledo City. I\'m here to help you learn more about our school, from our rich history to our current programs and policies.',
  'thank you': 'You\'re welcome! 😊 Feel free to ask more questions about CCTC. I\'m here to help!',
  'thanks': 'You\'re welcome! 😊 Anytime!',
  'good': 'I\'m glad to hear that! 😊 Anything else you\'d like to know about CCTC?',
  'great': 'Awesome! 😊 Let me know if you need anything else.',
  'default': 'I\'m not sure about that. 🤔 Here are some things you can ask me about:\n• Teachers\n• Courses\n• History\n• Rules\n• Enrollment'
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
      text: '👋 Hello! I\'m your AI assistant. Ask me about:\n• Teachers\n• Courses\n• History\n• Rules\n• Enrollment', 
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

  const suggestedQuestions = [
    'How many teachers are there?',
    'What courses are offered?',
    'Tell me about the school history',
    'What are the school rules?',
    'When is the enrollment period?'
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