// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB9Om0IqaMLbcmrwO9uLrCu7aNPRWSjQvg",
  authDomain: "ranked-tracker.firebaseapp.com",
  databaseURL: "https://ranked-tracker-default-rtdb.firebaseio.com",
  projectId: "ranked-tracker",
  storageBucket: "ranked-tracker.firebasestorage.app",
  messagingSenderId: "652532039666",
  appId: "1:652532039666:web:a125eb818ebf0dabb6756b",
  measurementId: "G-E30JVTFDDE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
