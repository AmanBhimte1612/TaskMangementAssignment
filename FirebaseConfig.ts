import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDK2yXeVy6W8FBY9_V8GkA49naTaZeRIco",
  authDomain: "taskmanagementassignment.firebaseapp.com",
  projectId: "taskmanagementassignment",
  storageBucket: "taskmanagementassignment.appspot.com", // ✅ fixed `.app` typo
  messagingSenderId: "904957436256",
  appId: "1:904957436256:web:da48bf831c7a998ce7fe05",
  measurementId: "G-RZ9SSBY7T8",
};

// Initialize Firebase once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Correctly initialize auth with persistence
let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (err: any) {
  if (err.code === "auth/duplicate-app" || err.code === "auth/already-initialized") {
    auth = getAuth(app); // fallback to existing instance
  } else {
    throw err;
  }
}

// Firestore
const db = getFirestore(app);

export { app, auth, db };
