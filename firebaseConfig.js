import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAe4cV_5aI2fhVY9OXaYjCXcZjKc3wIGYc",
  authDomain: "tincan-9c205.firebaseapp.com",
  projectId: "tincan-9c205",
  storageBucket: "tincan-9c205.firebasestorage.app",
  messagingSenderId: "630095480222",
  appId: "1:630095480222:web:231af210a8b2089540028f",
  measurementId: "G-Q0JBSVMRST"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});