// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth, browserSessionPersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2551aRlR5a0Y7zdoVWvml0vtzQh3hkGY",
  authDomain: "quiz-app-257cd.firebaseapp.com",
  projectId: "quiz-app-257cd",
  storageBucket: "quiz-app-257cd.appspot.com",
  messagingSenderId: "275062428650",
  appId: "1:275062428650:web:97aef13adef87be1ad9893",
  measurementId: "G-EFT1QY5TD7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: browserSessionPersistence,
  // Other persistence options for web can also be used, but for React Native, AsyncStorage is typically used.
});

export { app, auth };
