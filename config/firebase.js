import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ✅ YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAIUESyNJo_sBOfEvH1ko0BV_6HBhD6uSk",
  authDomain: "smartlift-a2f85.firebaseapp.com",
  projectId: "smartlift-a2f85",
  storageBucket: "smartlift-a2f85.firebasestorage.app",
  messagingSenderId: "734042931459",
  appId: "1:734042931459:web:f454b87d0f088e1f112936"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// ✅ Initialize Firestore
export const db = getFirestore(app);

// ✅ Initialize Storage (for images)
export const storage = getStorage(app);