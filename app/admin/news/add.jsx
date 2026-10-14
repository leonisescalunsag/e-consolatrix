import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddNews() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Announcements',
    date: '',
    views: 0,
    icon: 'document-text',
    color: '#3b82f6'
  });

  const categories = [
    { name: 'Announcements', color: '#3b82f6', icon: 'document-text' },
    { name: 'Events', color: '#a855f7', icon: 'calendar' },
    { name: 'Achievements', color: '#f59e0b', icon: 'trophy' }
  ];

  const handleSave = async () => {
    if (!form.title || !form.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const selectedCat = categories.find(c => c.name === form.category);
      await addDoc(collection(db, 'news'), {
        ...form,
        icon: selectedCat.icon,
        color: selectedCat.color,
        createdAt: new Date()
      });
      Alert.alert('Success', 'News added successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // ✅ Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setForm({ ...form, date: formatDate(selectedDate) });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="newspaper" size={20} color="#fff" />
          <Text style={styles.headerTitle}>Add News</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          {/* Title */}
          <Text style={styles.formLabel}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter news title"
            placeholderTextColor="#999"
            value={form.title}
            onChangeText={(text) => setForm({...form, title: text})}
          />

          {/* ✅ CATEGORY SELECTION - SCROLLABLE */}
          <Text style={styles.formLabel}>Category *</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={[
                  styles.categoryBtn,
                  form.category === cat.name && styles.categoryBtnActive,
                  { borderColor: form.category === cat.name ? cat.color : '#E8E8E8' }
                ]}
                onPress={() => setForm({
                  ...form, 
                  category: cat.name,
                  icon: cat.icon,
                  color: cat.color
                })}
              >
                <Ionicons 
                  name={cat.icon} 
                  size={14} 
                  color={form.category === cat.name ? '#fff' : cat.color} 
                />
                <Text style={[
                  styles.categoryText,
                  form.category === cat.name && styles.categoryTextActive
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Description */}
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

          {/* ✅ DATE PICKER */}
          <Text style={styles.formLabel}>Date</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={20} color="#0D3E86" />
            <Text style={[styles.dateButtonText, !form.date && styles.datePlaceholder]}>
              {form.date || 'Select Date'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
            />
          )}

          {/* Save Button */}
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Publish News'}
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
    paddingBottom: 30,
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
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  // ✅ DATE BUTTON
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    gap: 10,
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Montserrat-Regular',
  },
  datePlaceholder: {
    color: '#999',
  },
  // ✅ SCROLLABLE CATEGORY CONTAINER
  categoryContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    gap: 8,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderRadius: 10,
    gap: 4,
    backgroundColor: '#F5F5F5',
    minHeight: 38,
  },
  categoryBtnActive: {
    backgroundColor: '#0D3E86',
    borderColor: '#0D3E86',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Montserrat-Medium',
    color: '#333',
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#fff',
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
});