import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0D3E86',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Landing Page */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      {/* Main Screens */}
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="history" options={{ headerShown: false }} />
      <Stack.Screen name="courses" options={{ headerShown: false }} />
      <Stack.Screen name="teachers" options={{ headerShown: false }} />
      <Stack.Screen name="rules" options={{ headerShown: false }} />
      <Stack.Screen name="news" options={{ headerShown: false }} />
      
      {/* AI Chatbot */}
      <Stack.Screen 
        name="chatbot" 
        options={{ 
          title: 'AI Assistant',
          headerShown: false,
        }} 
/>
        <Stack.Screen 
  name="virtualtour" 
  options={{ 
    title: '360° Virtual Tour',
    headerShown: false,
  }} 
      />
      
      
      {/* Admin Routes */}
      <Stack.Screen name="admin" options={{ headerShown: false }} />
    </Stack>
  );
}