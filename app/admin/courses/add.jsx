import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AddCourse() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: '',
    name: '',
    level: 'college',
    description: '',
    color: '#1E90FF',
    icon: 'school-outline'
  });

  const handleSave = async () => {
    if (!form.code || !form.name) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'courses'), {
        ...form,
        createdAt: new Date()
      });
      Alert.alert('Success', 'Course added successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ IMPROVED HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="book" size={20} color="#fff" />
          <Text style={styles.headerTitle}>Add Course</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <Text style={styles.formLabel}>Course Code *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., BSIT, STEM"
            placeholderTextColor="#999"
            value={form.code}
            onChangeText={(text) => setForm({...form, code: text.toUpperCase()})}
          />

          <Text style={styles.formLabel}>Course Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Bachelor of Science in Information Technology"
            placeholderTextColor="#999"
            value={form.name}
            onChangeText={(text) => setForm({...form, name: text})}
          />

          <Text style={styles.formLabel}>Level *</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity 
              style={[styles.radio, form.level === 'college' && styles.radioSelected]}
              onPress={() => setForm({...form, level: 'college'})}
            >
              <Text style={[styles.radioText, form.level === 'college' && styles.radioTextSelected]}>
                College
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.radio, form.level === 'shs' && styles.radioSelected]}
              onPress={() => setForm({...form, level: 'shs'})}
            >
              <Text style={[styles.radioText, form.level === 'shs' && styles.radioTextSelected]}>
                Senior High
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.formLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Course description"
            placeholderTextColor="#999"
            value={form.description}
            onChangeText={(text) => setForm({...form, description: text})}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Course'}
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
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 10,
  },
  radio: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    borderRadius: 10,
  },
  radioSelected: {
    backgroundColor: '#0D3E86',
    borderColor: '#0D3E86',
  },
  radioText: {
    color: '#333',
    fontFamily: 'Montserrat-Medium',
  },
  radioTextSelected: {
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