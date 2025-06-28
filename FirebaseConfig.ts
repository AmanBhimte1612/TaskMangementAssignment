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
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "", // ✅ fixed `.app` typo
  messagingSenderId: "",
  appId: "",
  measurementId: "",
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
