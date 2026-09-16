import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHf6yK7J8L9M0N1O2P3Q4R5S6T7U8V9W0",
  authDomain: "bharatflix-82578.firebaseapp.com",
  projectId: "bharatflix-82578",
  storageBucket: "bharatflix-82578.firebasestorage.app",
  messagingSenderId: "858704386202",
  appId: "1:858704386202:web:9cfd17f85b3593d5516723"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
