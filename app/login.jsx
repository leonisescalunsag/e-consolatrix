import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../styles/LoginStyles';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Temporary function para sa login button
  const handleLogin = () => {
    // Pagka-click, rekta sa home page bro
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
                <Text style={styles.blueText}>e</Text>-Login
              </Text>

              <View style={styles.inputGroup}>
                <TextInput 
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput 
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                
                {/* Dito natin inilagay yung handleLogin bro */}
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                  <Text style={styles.loginButtonText}>LOGIN</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/register')}>
                  <Text style={styles.registerLink}>
                    Don't have an account? <Text style={{ fontWeight: 'bold', color: '#0D3E86' }}>Register here</Text>
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