import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import LoadingSpinner from '../components/LoadingSpinner';
import { db } from '../../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function EditTeacher() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null);
  
  const [form, setForm] = useState({
    name: '',
    position: '',
    department: 'College',
    course: ''
  });

  const positions = [
    'PROGRAM HEAD', 'COLLEGE INSTRUCTOR', 'SHS INSTRUCTOR', 
    'JHS INSTRUCTOR', 'ELEMENTARY INSTRUCTOR', 'REGISTRAR', 
    'GUIDANCE COUNSELOR', 'STAFF', 'MAINTENANCE',
    'SCHOOL PRESIDENT', 'SCHOOL ASSISTANT PRINCIPAL', 'SCHOOL TREASURER', 'ADMINISTRATOR'
  ];

  const departments = [
    { name: 'College', label: 'College' },
    { name: 'SHS', label: 'Senior High School' },
    { name: 'JHS', label: 'Junior High School' },
    { name: 'Elementary', label: 'Elementary' },
    { name: 'Staff', label: 'Staff' },
    { name: 'Maintenance', label: 'Maintenance' },
    { name: 'AR Sisters', label: 'AR Sisters' }
  ];

  const isARSister = form.department === 'AR Sisters';
  const hideDepartmentPicker = ['STAFF', 'MAINTENANCE', 'ELEMENTARY INSTRUCTOR', 'JHS INSTRUCTOR'].includes(form.position) || isARSister;
  const hideCoursePicker = hideDepartmentPicker || form.position === 'REGISTRAR' || form.position === 'GUIDANCE COUNSELOR';

  useEffect(() => {
    fetchTeacher();
  }, []);

  const fetchTeacher = async () => {
    try {
      const docRef = doc(db, 'teachers', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setForm(data);
        if (data.imageUrl) setImage(data.imageUrl);
      } else {
        Alert.alert('Error', 'Teacher not found');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    if (!form.name || !form.position) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      let finalDept = form.department;
      if (form.position === 'STAFF') finalDept = 'Staff';
      if (form.position === 'MAINTENANCE') finalDept = 'Maintenance';
      if (form.position === 'ELEMENTARY INSTRUCTOR') finalDept = 'Elementary';
      if (form.position === 'JHS INSTRUCTOR') finalDept = 'JHS';
      if (['SCHOOL PRESIDENT', 'SCHOOL ASSISTANT PRINCIPAL', 'SCHOOL TREASURER', 'ADMINISTRATOR'].includes(form.position)) {
        finalDept = 'AR Sisters';
      }

      const docRef = doc(db, 'teachers', id);
      await updateDoc(docRef, {
        name: form.name,
        position: form.position,
        department: finalDept,
        course: hideCoursePicker ? '' : form.course,
        imageUrl: image, 
        updatedAt: new Date()
      });
      Alert.alert('Success', 'Updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading..." />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="create" size={20} color="#fff" />
          <Text style={styles.headerTitle}>Edit Faculty/Staff</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          
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
            <Text style={styles.changePhotoText}>Tap to change photo</Text>
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
              onValueChange={(value) => {
                setForm({...form, position: value});
                if (['SCHOOL PRESIDENT', 'SCHOOL ASSISTANT PRINCIPAL', 'SCHOOL TREASURER', 'ADMINISTRATOR'].includes(value)) {
                  setForm(prev => ({...prev, position: value, department: 'AR Sisters'}));
                }
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select Position" value="" color="#999" />
              {positions.map((pos, index) => (
                <Picker.Item key={index} label={pos} value={pos} color="#333" />
              ))}
            </Picker>
          </View>

          {!hideDepartmentPicker && (
            <>
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
            </>
          )}

          {!hideCoursePicker && form.department === 'College' && (
            <>
              <Text style={styles.formLabel}>Course/Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., BSIT DEPARTMENT"
                value={form.course}
                onChangeText={(text) => setForm({...form, course: text})}
              />
            </>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleUpdate} disabled={saving}>
              <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Update'}</Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: { padding: 16, paddingBottom: 30 },
  formCard: { backgroundColor: '#fff', borderRadius: 18, padding: 18, elevation: 4 },
  imageUploadContainer: { alignItems: 'center', marginBottom: 20 },
  imagePicker: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F4F8', borderWidth: 2, borderColor: '#0D3E86', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  profileImage: { width: '100%', height: '100%' },
  imagePlaceholder: { alignItems: 'center' },
  imageText: { fontSize: 10, color: '#0D3E86', marginTop: 4, fontFamily: 'Montserrat-Bold' },
  changePhotoText: { fontSize: 12, color: '#666', marginTop: 8, fontFamily: 'Montserrat-Medium' },
  formLabel: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 5, fontFamily: 'Montserrat-Medium' },
  input: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, padding: 12, fontSize: 14, color: '#333', marginBottom: 14, fontFamily: 'Montserrat-Regular' },
  pickerWrapper: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, marginBottom: 14, overflow: 'hidden' },
  picker: { height: 48, color: '#333' },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  button: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  cancelButton: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E0E0E0' },
  cancelButtonText: { color: '#666', fontSize: 15, fontWeight: '600' },
  saveButton: { backgroundColor: '#0D3E86' },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});