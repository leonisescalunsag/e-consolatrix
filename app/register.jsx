import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../styles/LoginStyles';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Temporary function para sa register button
  const handleRegister = () => {
    // Rekta sa home page din pagka-register
    router.push('/home');
  };

  return (
    <ImageBackground 
      source={require('../assets/images/cc.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.gradientOverlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex1}
        >
          <ScrollView contentContainerStyle={styles.centerContent}>
            
            <View style={styles.loginCard}>
              <Image source={require('../assets/images/logo.png')} style={styles.logo} />
              
              <Text style={styles.title}>
                <Text style={styles.blueText}>e</Text>-Register
              </Text>

              <View style={styles.inputGroup}>
                <TextInput 
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput 
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput 
                  style={styles.input}
                  placeholder="Create Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                
                {/* Dito natin inilagay yung handleRegister bro */}
                <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                  <Text style={styles.loginButtonText}>CREATE ACCOUNT</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.registerLink}>
                    Already have an account? <Text style={{ fontWeight: 'bold', color: '#0D3E86' }}>Login here</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}