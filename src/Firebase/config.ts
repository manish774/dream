// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAHtUDArOfWP1H4OskMNe1sLnUlaP8svJ4",
  authDomain: "mydream-6c77f.firebaseapp.com",
  projectId: "mydream-6c77f",
  storageBucket: "mydream-6c77f.appspot.com",
  messagingSenderId: "134199548045",
  appId: "1:134199548045:web:51e0463f8f43a8b7116ac4",
  measurementId: "G-09V3TWQDXQ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
