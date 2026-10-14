import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function AddTeacher() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: '',
    position: '',
    department: 'college',
    course: ''
  });

  const positions = [
    'PROGRAM HEAD',
    'COLLEGE INSTRUCTOR',
    'SHS INSTRUCTOR',
    'JHS INSTRUCTOR',
    'ELEMENTARY INSTRUCTOR',
    'DEAN',
    'REGISTRAR',
    'GUIDANCE COUNSELOR'
  ];

  const departments = [
    { name: 'college', label: 'College' },
    { name: 'shs', label: 'Senior High School' },
    { name: 'jhs', label: 'Junior High School' },
    { name: 'elementary', label: 'Elementary' }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = [];
      querySnapshot.forEach((doc) => {
        coursesData.push({ id: doc.id, ...doc.data() });
      });
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.position || !form.department) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'teachers'), {
        ...form,
        createdAt: new Date()
      });
      Alert.alert('Success', 'Teacher added successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => c.level === form.department);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="person-add" size={20} color="#fff" />
          <Text style={styles.headerTitle}>Add Teacher</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <Text style={styles.formLabel}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Mr. John Doe"
            placeholderTextColor="#999"
            value={form.name}
            onChangeText={(text) => setForm({...form, name: text})}
          />

          <Text style={styles.formLabel}>Position *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.position}
              onValueChange={(value) => setForm({...form, position: value})}
              style={styles.picker}
              dropdownIconColor="#0D3E86"
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Select Position" value="" color="#999" />
              {positions.map((pos, index) => (
                <Picker.Item key={index} label={pos} value={pos} color="#333" />
              ))}
            </Picker>
          </View>

          <Text style={styles.formLabel}>Department *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.department}
              onValueChange={(value) => setForm({...form, department: value, course: ''})}
              style={styles.picker}
              dropdownIconColor="#0D3E86"
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Select Department" value="" color="#999" />
              {departments.map((dept, index) => (
                <Picker.Item key={index} label={dept.label} value={dept.name} color="#333" />
              ))}
            </Picker>
          </View>

          {form.department === 'college' && (
            <>
              <Text style={styles.formLabel}>Course/Subject</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={form.course}
                  onValueChange={(value) => setForm({...form, course: value})}
                  style={styles.picker}
                  dropdownIconColor="#0D3E86"
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item label="Select Course" value="" color="#999" />
                  {filteredCourses.map((course) => (
                    <Picker.Item 
                      key={course.id} 
                      label={course.code} 
                      value={course.code} 
                      color="#333" 
                    />
                  ))}
                </Picker>
              </View>
            </>
          )}

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Teacher'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: '#0D3E86',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,

    
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
  backBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Montserrat-Medium',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#333',
    marginBottom: 14,
    fontFamily: 'Montserrat-Regular',
  },
  pickerWrapper: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    marginBottom: 14,
    overflow: 'hidden',
    height: 50,
  },
  picker: {
    height: 50,
    color: '#333',
  },
  pickerItem: {
    height: 44,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#0D3E86',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  scrollContent: {
  padding: 16,
  paddingBottom: 40,
  marginTop: 10,  // ✅ Add this
},
});