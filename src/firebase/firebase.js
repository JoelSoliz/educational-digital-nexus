"use client";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvrLB6c--1vDskzIJH_HY5UTPyFnDP-5E",
  authDomain: "educational-digital-nexus.firebaseapp.com",
  projectId: "educational-digital-nexus",
  storageBucket: "educational-digital-nexus.appspot.com",
  messagingSenderId: "321232261451",
  appId: "1:321232261451:web:7232146a12d30eba5cd8ce",
  measurementId: "G-508QXHXLJC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
