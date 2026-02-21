import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBADbVFYd_NVoWU1Wxi4mxOTyBoeuBDAyQ",
  authDomain: "choronko-wifi.firebaseapp.com",
  projectId: "choronko-wifi",
  storageBucket: "choronko-wifi.firebasestorage.app",
  messagingSenderId: "531864817668",
  appId: "1:531864817668:web:e9d3085994c4c92196a551",
  measurementId: "G-27651Y192E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// THIS LINE IS THE FIX: It must say 'export const db'
export const db = getFirestore(app);
