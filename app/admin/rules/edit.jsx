import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../components/LoadingSpinner';
import { db } from '../../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function EditRule() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState({
    title: '',
    category: 'attendance',
    color: '#44e644',
    icon: 'time-outline'
  });

  const categories = [
    { name: 'attendance', label: 'Attendance', color: '#44e644', icon: 'time-outline' },
    { name: 'dresscode', label: 'Dress Code', color: '#0033FF', icon: 'shirt-outline' },
    { name: 'academic', label: 'Academic Integrity', color: '#f50c0c', icon: 'school-outline' },
    { name: 'behavioral', label: 'Behavioral Standards', color: '#FFA500', icon: 'people-outline' }
  ];

  useEffect(() => {
    fetchRule();
  }, []);

  const fetchRule = async () => {
    try {
      const docRef = doc(db, 'rules', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setForm({
          title: data.title,
          category: data.category,
          color: data.color,
          icon: data.icon
        });
        setRules(data.rules || ['']);
      } else {
        Alert.alert('Error', 'Rule not found');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const addRuleField = () => {
    setRules([...rules, '']);
  };

  const removeRuleField = (index) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
  };

  const updateRule = (text, index) => {
    const newRules = [...rules];
    newRules[index] = text;
    setRules(newRules);
  };

  const handleUpdate = async () => {
    if (!form.title || rules.some(rule => !rule.trim())) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSaving(true);
    try {
      const selectedCat = categories.find(c => c.name === form.category);
      const docRef = doc(db, 'rules', id);
      await updateDoc(docRef, {
        ...form,
        rules: rules.filter(r => r.trim()),
        icon: selectedCat.icon,
        color: selectedCat.color,
        updatedAt: new Date()
      });
      Alert.alert('Success', 'Rule updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading rule..." />;

  return (
    <View style={styles.container}>
      {/* ✅ IMPROVED HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="create" size={20} color="#fff" />
          <Text style={styles.headerTitle}>Edit Rule</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <Text style={styles.formLabel}>Category Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Attendance Policy"
            placeholderTextColor="#999"
            value={form.title}
            onChangeText={(text) => setForm({...form, title: text})}
          />

          <Text style={styles.formLabel}>Category Type *</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={[
                  styles.categoryBtn,
                  form.category === cat.name && styles.categoryBtnActive,
                  { borderColor: cat.color }
                ]}
                onPress={() => setForm({
                  ...form, 
                  category: cat.name,
                  color: cat.color,
                  icon: cat.icon
                })}
              >
                <Ionicons 
                  name={cat.icon} 
                  size={18} 
                  color={form.category === cat.name ? '#fff' : cat.color} 
                />
                <Text style={[
                  styles.categoryText,
                  form.category === cat.name && styles.categoryTextActive
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.formLabel}>Rules *</Text>
          {rules.map((rule, index) => (
            <View key={index} style={styles.ruleRow}>
              <View style={styles.ruleNumber}>
                <Text style={styles.ruleNumberText}>{index + 1}</Text>
              </View>
              <TextInput
                style={[styles.input, styles.ruleInput]}
                placeholder={`Rule ${index + 1}`}
                placeholderTextColor="#999"
                value={rule}
                onChangeText={(text) => updateRule(text, index)}
              />
              {rules.length > 1 && (
                <TouchableOpacity onPress={() => removeRuleField(index)} style={styles.removeBtn}>
                  <Ionicons name="close-circle" size={22} color="#8B0000" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addRuleBtn} onPress={addRuleField}>
            <Ionicons name="add-circle" size={20} color="#0D3E86" />
            <Text style={styles.addRuleText}>Add Another Rule</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]}
              onPress={handleUpdate}
              disabled={saving}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Update Rule'}
              </Text>
            </TouchableOpacity>
          </View>
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
  ruleInput: {
    flex: 1,
    marginBottom: 0,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 8,
    gap: 6,
  },
  categoryBtnActive: {
    backgroundColor: '#0D3E86',
    borderColor: '#0D3E86',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Montserrat-Medium',
    color: '#333',
  },
  categoryTextActive: {
    color: '#fff',
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  ruleNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0D3E86',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  removeBtn: {
    padding: 2,
  },
  addRuleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#0D3E86',
    borderStyle: 'dashed',
    borderRadius: 10,
    marginVertical: 10,
    gap: 8,
  },
  addRuleText: {
    color: '#0D3E86',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Montserrat-Medium',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat-Medium',
  },
  saveButton: {
    backgroundColor: '#0D3E86',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
});