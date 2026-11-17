import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, TextInput, Platform, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../components/LoadingSpinner';
import { db } from '../../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

export default function EditNews() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Announcements',
    date: '',
    views: 0,
    image: null, // ✅ Added image state
    icon: 'document-text',
    color: '#3b82f6'
  });

  const categories = [
    { name: 'Announcements', color: '#3b82f6', icon: 'document-text' },
    { name: 'Events', color: '#a855f7', icon: 'calendar' },
    { name: 'Achievements', color: '#f59e0b', icon: 'trophy' }
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const docRef = doc(db, 'news', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setForm({ ...form, ...docSnap.data() });
      } else {
        Alert.alert('Error', 'News not found');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Image Picker
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Denied", "Please allow access to your gallery to upload images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled) {
      setForm({ ...form, image: `data:image/jpeg;base64,${result.assets[0].base64}` });
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setForm({ ...form, date: formatDate(selectedDate) });
    }
  };

  const handleUpdate = async () => {
    if (!form.title || !form.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const selectedCat = categories.find(c => c.name === form.category);
      const docRef = doc(db, 'news', id);
      await updateDoc(docRef, {
        ...form,
        icon: selectedCat.icon,
        color: selectedCat.color,
        updatedAt: new Date()
      });
      Alert.alert('Success', 'News updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading news..." />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="create" size={20} color="#fff" />
          <Text style={styles.headerTitle}>Edit News</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <Text style={styles.formLabel}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter news title"
            placeholderTextColor="#999"
            value={form.title}
            onChangeText={(text) => setForm({...form, title: text})}
          />

          <Text style={styles.formLabel}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={[
                  styles.categoryBtn,
                  form.category === cat.name && styles.categoryBtnActive,
                  { borderColor: form.category === cat.name ? cat.color : '#E8E8E8' }
                ]}
                onPress={() => setForm({ ...form, category: cat.name, icon: cat.icon, color: cat.color })}
              >
                <Ionicons name={cat.icon} size={14} color={form.category === cat.name ? '#fff' : cat.color} />
                <Text style={[styles.categoryText, form.category === cat.name && styles.categoryTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.formLabel}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter news description"
            placeholderTextColor="#999"
            value={form.description}
            onChangeText={(text) => setForm({...form, description: text})}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* ✅ IMAGE UPLOAD SECTION */}
          <Text style={styles.formLabel}>Image (Optional)</Text>
          <TouchableOpacity onPress={pickImage} style={styles.imagePickerBtn}>
            <Ionicons name="image-outline" size={20} color="#0D3E86" />
            <Text style={styles.imagePickerText}>{form.image ? "Change Image" : "Select Image"}</Text>
          </TouchableOpacity>
          
          {form.image && (
            <Image source={{ uri: form.image }} style={styles.previewImage} resizeMode="cover" />
          )}

          <Text style={styles.formLabel}>Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
            <Ionicons name="calendar-outline" size={20} color="#0D3E86" />
            <Text style={[styles.dateButtonText, !form.date && styles.datePlaceholder]}>
              {form.date || 'Select Date'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={form.date ? new Date(form.date) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
            />
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleUpdate} disabled={saving}>
              <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Update News'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 14,
    backgroundColor: '#0D3E86', borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 19, fontWeight: 'bold', color: '#fff', fontFamily: 'Montserrat-Bold' },
  backBtn: { padding: 4 },
  scrollContent: { padding: 16, paddingBottom: 30 },
  formCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 18,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8,
  },
  formLabel: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 5, fontFamily: 'Montserrat-Medium' },
  input: {
    backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10,
    padding: 12, fontSize: 14, color: '#333', marginBottom: 14, fontFamily: 'Montserrat-Regular',
  },
  textArea: { height: 100, paddingTop: 12 },
  dateButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5',
    borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, padding: 12, marginBottom: 14, gap: 10,
  },
  dateButtonText: { fontSize: 14, color: '#333', fontFamily: 'Montserrat-Regular' },
  datePlaceholder: { color: '#999' },
  categoryContainer: { flexDirection: 'row', paddingVertical: 4, gap: 8 },
  categoryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, paddingHorizontal: 14, borderWidth: 1.5, borderRadius: 10,
    gap: 4, backgroundColor: '#F5F5F5', minHeight: 38,
  },
  categoryBtnActive: { backgroundColor: '#0D3E86', borderColor: '#0D3E86' },
  categoryText: { fontSize: 11, fontWeight: '600', fontFamily: 'Montserrat-Medium', color: '#333', textAlign: 'center' },
  categoryTextActive: { color: '#fff' },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  button: {
    flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  cancelButton: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E0E0E0' },
  cancelButtonText: { color: '#666', fontSize: 15, fontWeight: '600', fontFamily: 'Montserrat-Medium' },
  saveButton: { backgroundColor: '#0D3E86' },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold', fontFamily: 'Montserrat-Bold' },
  // Image Styles
  imagePickerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F0F4F8', borderWidth: 1, borderColor: '#0D3E86', borderStyle: 'dashed',
    borderRadius: 10, padding: 15, marginBottom: 15, gap: 8,
  },
  imagePickerText: { fontSize: 14, color: '#0D3E86', fontFamily: 'Montserrat-Medium' },
  previewImage: { width: '100%', height: 180, borderRadius: 10, marginBottom: 15 },
});