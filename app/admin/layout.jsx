import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AdminLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0D3E86',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerBackTitle: 'Back',
        headerRight: () => (
          <TouchableOpacity 
            onPress={() => router.push('/admin/dashboard')}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="home" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Admin Dashboard',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.push('/home')}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="exit-outline" size={24} color="#fff" />
            </TouchableOpacity>
          )
        }} 
      />
      
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          title: 'Admin Dashboard',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.push('/home')}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="exit-outline" size={24} color="#fff" />
            </TouchableOpacity>
          )
        }} 
      />
      
      {/* Admin Login */}
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Admin Login',
          headerShown: false,
        }} 
      />

      {/* Teachers */}
      <Stack.Screen 
        name="teachers/index" 
        options={{ title: 'Teachers Directory' }} 
      />
      <Stack.Screen 
        name="teachers/add" 
        options={{ title: 'Add Teacher' }} 
      />
      <Stack.Screen 
        name="teachers/edit" 
        options={{ title: 'Edit Teacher' }} 
      />

      {/* Courses */}
      <Stack.Screen 
        name="courses/index" 
        options={{ title: 'Courses & Strands' }} 
      />
      <Stack.Screen 
        name="courses/add" 
        options={{ title: 'Add Course' }} 
      />
      <Stack.Screen 
        name="courses/edit" 
        options={{ title: 'Edit Course' }} 
      />

      {/* News */}
      <Stack.Screen 
        name="news/index" 
        options={{ title: 'News & Announcements' }} 
      />
      <Stack.Screen 
        name="news/add" 
        options={{ title: 'Add News' }} 
      />
      <Stack.Screen 
        name="news/edit" 
        options={{ title: 'Edit News' }} 
      />

      {/* ✅ Rules */}
      <Stack.Screen 
        name="rules/index" 
        options={{ title: 'Rules & Policies' }} 
      />
      <Stack.Screen 
        name="rules/add" 
        options={{ title: 'Add Rule Category' }} 
      />
      <Stack.Screen 
        name="rules/edit" 
        options={{ title: 'Edit Rules' }} 
      />

      {/* ✅ Alerts - Placed beside Rules */}
      <Stack.Screen 
        name="alerts/index" 
        options={{ title: 'Alerts & Notifications' }} 
      />
      <Stack.Screen 
        name="alerts/add" 
        options={{ title: 'Create Alert' }} 
      />
      <Stack.Screen 
        name="alerts/edit" 
        options={{ title: 'Edit Alert' }} 
      />

      {/* Chatbot */}
      <Stack.Screen 
        name="chatbot" 
        options={{ 
          title: 'AI Assistant',
          headerShown: false,
        }} 
      />
    </Stack>
  );
}