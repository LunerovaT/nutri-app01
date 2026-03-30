// src/firebase.js
// Připojení k Firebase – tento soubor importuj všude, kde potřebuješ
// přístup k databázi nebo přihlašování.

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaJZesbL55C7OHy0JKgW-PeKcpof1yWck",
  authDomain: "nutriapp-adfae.firebaseapp.com",
  projectId: "nutriapp-adfae",
  storageBucket: "nutriapp-adfae.firebasestorage.app",
  messagingSenderId: "461141010063",
  appId: "1:461141010063:web:016aabbd632e4265e072fa",
};

// Inicializujeme Firebase aplikaci
const app = initializeApp(firebaseConfig);

// auth = správa přihlašování (email/heslo)
// db   = Firestore databáze
export const auth = getAuth(app);
export const db   = getFirestore(app);
