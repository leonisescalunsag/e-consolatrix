import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker'; // ✅ Image Picker
import { db } from '../../../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function AddTeacher() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [image, setImage] = useState(null); // ✅ State para sa image
  
  const [form, setForm] = useState({
    name: '',
    position: '',
    department: 'College', // Pinalitan natin para mag-match sa UI
    course: ''
  });

  const positions = [
    'PROGRAM HEAD', 'COLLEGE INSTRUCTOR', 'SHS INSTRUCTOR', 
    'JHS INSTRUCTOR', 'ELEMENTARY INSTRUCTOR', 'DEAN', 
    'REGISTRAR', 'GUIDANCE COUNSELOR', 'STAFF', 'MAINTENANCE'
  ];

  const departments = [
    { name: 'College', label: 'College' },
    { name: 'SHS', label: 'Senior High School' },
    { name: 'JHS', label: 'Junior High School' },
    { name: 'Elementary', label: 'Elementary' },
    { name: 'Staff', label: 'Staff' },
    { name: 'Maintenance', label: 'Maintenance' }
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

  // ✅ Function para pumili ng image sa gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // Compress ng konti para hindi bumigat
      base64: true, // I-convert sa base64 (pwede itong i-save sa Firestore as string)
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.position || !form.department) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Sa totoong system, dito ka mag-uupload sa Firebase Storage.
      // Pero para sa Capstone, pwede nating i-save muna yung URI (local path) o Base64.
      await addDoc(collection(db, 'teachers'), {
        ...form,
        imageUrl: image, // ✅ Naka-save yung image path/URL
        createdAt: new Date()
      });
      Alert.alert('Success', 'Faculty/Staff added successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => c.level?.toLowerCase() === form.department.toLowerCase());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="person-add" size={20} color="#fff" />
          <Text style={styles.headerTitle}>Add Faculty/Staff</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formCard}>
          
          {/* ✅ IMAGE UPLOADER */}
          <View style={styles.imageUploadContainer}>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={32} color="#0D3E86" />
                  <Text style={styles.imageText}>Upload Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.formLabel}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Mr. John Doe"
            value={form.name}
            onChangeText={(text) => setForm({...form, name: text})}
          />

          <Text style={styles.formLabel}>Position *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.position}
              onValueChange={(value) => setForm({...form, position: value})}
              style={styles.picker}
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
            >
              <Picker.Item label="Select Department" value="" color="#999" />
              {departments.map((dept, index) => (
                <Picker.Item key={index} label={dept.label} value={dept.name} color="#333" />
              ))}
            </Picker>
          </View>

          {form.department === 'College' && (
            <>
              <Text style={styles.formLabel}>Course/Subject</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={form.course}
                  onValueChange={(value) => setForm({...form, course: value})}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Course" value="" color="#999" />
                  {filteredCourses.map((course) => (
                    <Picker.Item key={course.id} label={course.code} value={course.code} color="#333" />
                  ))}
                </Picker>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
            <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Faculty/Staff'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 14, backgroundColor: '#0D3E86', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 4 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 19, fontWeight: 'bold', color: '#fff', fontFamily: 'Montserrat-Bold' },
  backBtn: { padding: 4 },
  scrollContent: { padding: 16, paddingBottom: 40, marginTop: 10 },
  formCard: { backgroundColor: '#fff', borderRadius: 18, padding: 18, elevation: 4 },
  // ✅ Styles para sa Image
  imageUploadContainer: { alignItems: 'center', marginBottom: 20 },
  imagePicker: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F4F8', borderWidth: 2, borderColor: '#0D3E86', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  profileImage: { width: '100%', height: '100%' },
  imagePlaceholder: { alignItems: 'center' },
  imageText: { fontSize: 10, color: '#0D3E86', marginTop: 4, fontFamily: 'Montserrat-Bold' },
  formLabel: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 5, fontFamily: 'Montserrat-Medium' },
  input: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, padding: 12, fontSize: 14, color: '#333', marginBottom: 14, fontFamily: 'Montserrat-Regular' },
  pickerWrapper: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, marginBottom: 14, overflow: 'hidden' },
  picker: { height: 50, color: '#333' },
  saveButton: { backgroundColor: '#0D3E86', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 6 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: 'Montserrat-Bold' },
});